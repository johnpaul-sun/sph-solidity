<template>
  <div
    class="flex"
    :style="{ height: `${props.height}px`, width: `${props.width}px` }"
  >
    <img :src="imgSrc" class="rounded-full object-cover" />
  </div>
</template>

<script setup lang="ts">
type Props = {
  imgSrc: string;
  width?: number | string;
  height?: number | string;
};

const props = withDefaults(defineProps<Props>(), {
  width: 60,
  height: 60,
});
</script>
