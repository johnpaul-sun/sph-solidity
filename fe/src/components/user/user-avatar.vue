<template>
  <div class="h-[90px] w-[90px]">
    <img :src="imgSrc" class="rounded-full object-cover h-[90px] w-[90px]" />
  </div>
</template>

<script setup lang="ts">
type Props = {
  imgSrc: string;
  width: number;
  height: number;
};

defineProps<Props>();
</script>
