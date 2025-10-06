<template>
  <div style="max-width: 700px" class="anon-xrns">
    <div v-if="results.length" class="mt-8">
      <hr />
      <br />
      <h3>Anonymized Files ({{ results.length }})</h3>
      <br />

      <ul class="list-none p-0 mt-3">
        <li v-for="(r, i) in results" :key="i" class="py-3 border-b border-black/6 flex items-center">

          <button
            class="mr-4 text-lg w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-800 bg-transparent border-0"
            @click="remove(i)"
            title="Remove"
            aria-label="Remove"
          >
            ×
          </button>


          <div class="grid grid-cols-[1fr_auto] gap-x-6 items-center flex-1 justify-items-center text-center">

            <div class="flex flex-col items-center">
              <div class="font-semibold truncate">{{ r.name }}</div>
              <div class="text-gray-600 text-sm mt-1">redacted paths: {{ r.count }}</div>
            </div>


            <div class="flex flex-col items-center">
              <div>
                <a class="text-[#eea406] no-underline" :href="r.url" :download="r.name">[Download]</a>
              </div>
              <div class="mt-1 text-sm">
                <a v-if="r.listUrl" class="text-[#007bff] no-underline" :href="r.listUrl" :download="r.listName">[List Paths]</a>
              </div>
            </div>
          </div>



        </li>
      </ul>

      <!-- bottom action buttons -->
      <div class="mt-6 flex justify-center gap-2">
        <button
          class="rounded-none px-3 py-2 border border-black bg-black text-white disabled:opacity-60 disabled:cursor-not-allowed"
          @click="downloadAll"
          :disabled="downloadAllProcessing || !results.length"
        >
          Download All
        </button>
        <button
          class="rounded-none px-3 py-2 border border-black bg-white text-black disabled:opacity-60 disabled:cursor-not-allowed"
          @click="clearAll"
          :disabled="!results.length"
        >
          Clear All
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Dropzone from "./Dropzone.vue";
import { useRedact } from "../composables/useRedact";

const {
  files,
  results,
  processing,
  downloadAllProcessing,
  onFiles,
  anonymizeAll,
  downloadAll,
  removeResult,
  clearAll,
} = useRedact();

function remove(i) {
  removeResult(i);
}
</script>
