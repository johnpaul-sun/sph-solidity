<template>
  <div
    v-if="stepNumber == activeStep"
    class="bg-white p-10 space-y-6 rounded-md"
  >
    <div class="text-dark">
      STEP {{ stepNumber }} of {{ totalSteps }}: {{ stepTitle }}
    </div>
    <div class="min-h-[480px] flex flex-col space-y-4">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
interface Props {
  stepNumber: number | string;
  totalSteps: number;
  stepTitle: string;
  activeStep: number;
}

defineProps<Props>();
</script>
