<template>
  <button class="text-green-500" @click="print"><slot /></button>
</template>

<script setup lang="ts">
function print() {
  console.log("clicked!");
}
</script>
