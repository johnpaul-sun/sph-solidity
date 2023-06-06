<template>
  <button @click="print"><slot /></button>
</template>

<script setup lang="ts">
function print() {
    console.log('clicked!')
}
function unused() {
    console.log('unused!')
}
</script>