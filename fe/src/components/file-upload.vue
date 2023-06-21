<template>
  <div class="space-y-1">
    <div class="font-bold text-sm text-dark">Upload image</div>
    <div class="flex h-10 items-center text-sm">
      <input id="upload-file" name="upload-file" type="file" class="hidden" />
      <span
        class="flex overflow-hidden w-full h-full items-center rounded-l px-2 bg-white text-disabled border border-disabled border-r-0"
        >Choose an image to upload
      </span>
      <label
        for="upload-file"
        class="flex whitespace-nowrap h-full items-center justify-center px-4 border bg-base text-white border-disabled border-l-0 rounded-tr rounded-br"
      >
        Upload image
      </label>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
