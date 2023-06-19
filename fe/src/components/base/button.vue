<template>
  <button v-bind="$attrs" @click="handleSubmit"><slot /></button>
</template>

<script setup lang="ts">
type Props = {
  label?: String;
};

function handleSubmit() {}

defineProps<Props>();
</script>
