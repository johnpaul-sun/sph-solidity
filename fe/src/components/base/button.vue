<template>
  <button
    v-bind="$attrs"
    class="{ disabled: 'opacity-50'}"
    :disabled="disabled"
    :class="isLoading ? loadingClass : defaultClass"
    @click="handleSubmit"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
type Props = {
  label?: String;
  disabled?: boolean;
  isLoading?: boolean;
  loadingClass?: string;
  defaultClass?: string;
};

function handleSubmit() {}

defineProps<Props>();
</script>
