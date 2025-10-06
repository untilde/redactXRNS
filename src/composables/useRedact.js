import { ref } from "vue";
import JSZip from "jszip";

const files = ref([]);
const results = ref([]);
const processing = ref(false);
const downloadAllProcessing = ref(false);

const resetUrls = (items) => {
  for (const r of items) {
    try {
      if (r.url) URL.revokeObjectURL(r.url);
      if (r.listUrl) URL.revokeObjectURL(r.listUrl);
    } catch (_) {}
  }
};

function onFiles(selected) {
  files.value.push(...selected);
}

async function anonymizeAll() {
  if (!files.value.length) return;
  processing.value = true;
  results.value = [];

  try {
    const tasks = files.value.map((f) =>
      anonymizeFile(f).catch((err) => {
        console.error("file anonymize error", f.name, err);
        return null;
      })
    );

    const done = await Promise.allSettled(tasks);
    results.value = done
      .map((r) => (r.status === "fulfilled" ? r.value : null))
      .filter(Boolean);
  } finally {
    processing.value = false;
    files.value = [];
  }
}

async function anonymizeFile(file) {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const songKey = Object.keys(zip.files).find((k) =>
    k.toLowerCase().endsWith("/song.xml") || k.toLowerCase() === "song.xml"
  );

  let count = 0;
  let mappings = [];
  if (songKey) {
    const songText = await zip.file(songKey).async("text");
    const res = sanitizeSongXml(songText);
    zip.file(songKey, res.text);
    count = res.count;
    mappings = res.mappings;
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const outName = file.name.replace(/(\.zip|\.xrns)$/i, "") + "-redacted.xrns";
  const url = URL.createObjectURL(blob);

  const listTxt =
    mappings.length > 0
      ? mappings
          .map((m) => `Original: ${m.original}\nRedacted: ${m.redacted}\n`)
          .join("\n")
      : null;

  const listBlob = listTxt && new Blob([listTxt], { type: "text/plain" });
  const listUrl = listBlob && URL.createObjectURL(listBlob);
  const listName = listTxt && outName.replace(/\.xrns$/i, "-redacted-list.txt");

  return { name: outName, url, blob, count, listUrl, listBlob, listName };
}

async function downloadAll() {
  if (!results.value.length) return;
  downloadAllProcessing.value = true;

  try {
    const pack = new JSZip();
    results.value.forEach((r) => pack.file(r.name, r.blob));
    const bundleUrl = URL.createObjectURL(
      await pack.generateAsync({ type: "blob" })
    );
    const a = document.createElement("a");
    a.href = bundleUrl;
    a.download = "anon-xrns-bundle.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    // revoke after a tick to allow download to start
    setTimeout(() => {
      try {
        URL.revokeObjectURL(bundleUrl);
      } catch (_) {}
    }, 1500);
  } finally {
    downloadAllProcessing.value = false;
  }
}

function removeResult(index) {
  const r = results.value[index];
  if (r) resetUrls([r]);
  results.value.splice(index, 1);
}

function clearAll() {
  resetUrls(results.value);
  results.value = [];
}

function removeFile(index) {
  files.value.splice(index, 1);
}

function sanitizeSongXml(xmlText) {
  let count = 0;
  const mappings = [];

  const out = xmlText.replace(/<FileName>([\s\S]*?)<\/FileName>/gi, (match, path) => {
    if (!/file:/i.test(path)) return match;
  const filename = path.split(/[\\/]/).pop();
  // always hard-code the double-slash prefix per user request
  const redacted = `//File:/REDACTED/${filename}`;
    count++;
    mappings.push({ original: path, redacted });
    return `<FileName>${redacted}</FileName>`;
  });

  return { text: out, count, mappings };
}

export function useRedact() {
  return {
    files,
    results,
    processing,
    downloadAllProcessing,
    onFiles,
    anonymizeAll,
    downloadAll,
    removeResult,
    removeFile,
    clearAll,
    sanitizeSongXml,
  };
}
