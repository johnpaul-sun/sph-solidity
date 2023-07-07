<template>
  <button
    v-bind="$attrs"
    class="{ disabled: 'opacity-50'}"
    :disabled="disabled"
    @click="handleSubmit"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
type Props = {
  label?: String;
  disabled?: boolean;
};

function handleSubmit() {}

defineProps<Props>();
</script>
