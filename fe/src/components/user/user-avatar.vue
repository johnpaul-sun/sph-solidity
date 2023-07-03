<template>
  <img
    :src="imgSrc"
    :class="`rounded-full object-cover h-[${props.height}px] w-[${props.width}px]`"
  />
</template>

<script setup lang="ts">
type Props = {
  imgSrc: string;
  width?: number;
  height?: number;
};

const props = withDefaults(defineProps<Props>(), {
  width: 60,
  height: 60,
});
</script>
