<template>
  <div
    class="flex flex-col rounded-lg w-[171px] h-fit overflow-clip border border-disabled"
  >
    <div class="text-[20px] font-bold text-center py-[18px] px-[10px]">
      {{ content }}
    </div>
    <div class="bg-gradient text-white text-center p-4">
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  label: string;
  content: string | number;
};
defineProps<Props>();
</script>
