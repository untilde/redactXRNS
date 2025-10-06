<template>
  <div>
    <h1>redactXRNS</h1>

    <div style="max-width: 700px; text-align: justify;">
      <br />
      <p>This tool redacts user paths in XRNS files by simply editing the Song.xml content.</p>
        <p>Processing happens locally in your browser - no files are uploaded to
        a server.</p>
        <p>For the paranoid.</p>

      <br />

      <!-- Upload controls: Dropzone + upload list + anonymize button -->
      <Dropzone @files="onFiles" />

      <div class="mb-8" v-if="files.length">
        <h3>Files ({{ files.length }})</h3>
        <ul>
          <li v-for="(f, i) in files" :key="i" class="flex items-center gap-3">
            <span class="truncate">{{ f.name }}</span>
            <span class="text-sm text-gray-400 cursor-pointer" @click="removeFile(i)">[x]</span>
          </li>
        </ul>
        <br />
        <div class="flex justify-center">
        <button
          class="rounded-none px-3 py-2 border border-black bg-black text-white disabled:opacity-60 disabled:cursor-not-allowed"
          @click="anonymizeAll"
          :disabled="processing"
        >
          Anonymize
        </button>
      </div>
      </div>

      <div v-if="processing" class="mt-3 font-bold">Processing...</div>
    </div>

    <AnonOutput />
  </div>

  <!-- fixed footer: special thanks -->
  <div
    class="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none"
  >
    <p class="text-xs px-3 py-1 pointer-events-auto">
      Special thanks to det/hine for the convo that lead me to this tool.
    </p>
  </div>
</template>

<script setup>
import AnonOutput from "./components/AnonOutput.vue";
import Dropzone from "./components/Dropzone.vue";
import { useRedact } from "./composables/useRedact";

const {
  files,
  results,
  processing,
  downloadAllProcessing,
  onFiles,
  anonymizeAll,
  downloadAll,
  removeFile,
} = useRedact();
</script>
