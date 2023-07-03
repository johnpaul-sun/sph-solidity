<template>
  <footer class="h-16 bg-gradient-container flex justify-center">
    <div class="flex items-center">
      <IconsCopyRight class="mr-1"></IconsCopyRight>
      <div>SPH_SOLIDITY {{ year }}</div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = computed(() => {
  return new Date().getFullYear();
});
</script>
