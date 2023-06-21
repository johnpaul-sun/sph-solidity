<template>
  <button
    v-bind="$attrs"
    class="{ disabled: 'opacity-50'}"
    @click="handleSubmit"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
type Props = {
  label?: String;
};

function handleSubmit() {}

defineProps<Props>();
</script>
