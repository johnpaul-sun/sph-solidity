<template>
  <button class="text-green-500" @click="print"><slot /></button>
</template>

<script setup lang="ts">
function print() {
  console.log("clicked!");
}
// unused() function is for checking if eslint is working
// function unused() {
//   console.log("unused!");
// }
</script>
