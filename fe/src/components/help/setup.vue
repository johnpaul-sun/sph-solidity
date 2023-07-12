<template>
  <div v-if="stepNumber == activeStep" class="px-4 space-y-6">
    <div class="text-dark">
      STEP {{ stepNumber }} of {{ totalSteps }}: {{ stepTitle }}
    </div>
    <div class="flex flex-col space-y-4 px-4">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  stepNumber: number;
  totalSteps: number;
  stepTitle: string;
  activeStep: number;
  handleClick: () => void;
}

defineProps<Props>();
</script>
