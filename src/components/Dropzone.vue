<template>
  <div
    class="dropzone"
    :class="{ dragging }"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <input
      ref="fileInput"
      class="file-input"
      type="file"
      multiple
      accept=".xrns,.zip"
      @change="onFiles"
      hidden
    />
    <div class="content" @click="openPicker">
      <p class="text-sm text-renoise-dark opacity-80">
        Drop .xrns / .zip files here — or click to pick
      </p>
      <small v-if="acceptedCount">Selected: {{ acceptedCount }}</small>
    </div>
    
  </div>
  <br />
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({});
const emit = defineEmits(["files"]);

const fileInput = ref(null);
const dragging = ref(false);
const acceptedCount = ref(0);

function openPicker() {
  fileInput.value && fileInput.value.click();
}

function onFiles(e) {
  const files = Array.from(e.target.files || []);
  handleFiles(files);
  // reset input so same file can be selected again
  e.target.value = null;
}

function onDragOver() {
  dragging.value = true;
}
function onDragLeave() {
  dragging.value = false;
}
function onDrop(e) {
  dragging.value = false;
  const items = Array.from(e.dataTransfer.files || []);
  handleFiles(items);
}

function handleFiles(files) {
  const accepted = files.filter((f) => /\.(xrns|zip)$/i.test(f.name));
  acceptedCount.value = accepted.length;
  if (accepted.length) emit("files", accepted);
}
</script>

<style scoped>
.dropzone {
  border: 2px dashed #666;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
}
.dropzone.dragging {
  background: rgba(0, 0, 0, 0.03);
  border-color: var(--renoise-dark);
}
.content p {
  margin: 0;
  font-weight: 600;
}
.content small {
  color: #666;
}
</style>
