<template>
  <div class="flex overflow-y-auto space-x-4">
    <div
      v-for="tab in items"
      :key="tab"
      :class="`rounded-md h-11 ${
        tab === activeTab
          ? 'bg-linear-gradient-primary p-[1px] cursor-not-allowed'
          : 'cursor-pointer'
      } `"
      @click="$emit('change-tab', tab)"
    >
      <div
        class="rounded-md h-full py-2 px-6"
        :class="{ 'bg-white': tab === activeTab }"
      >
        <div
          :class="`text-base whitespace-nowrap ${
            tab === activeTab
              ? 'bg-clip-text text-base font-bold text-transparent bg-linear-gradient-primary'
              : 'text-dark'
          }`"
        >
          {{ tab }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TabsProps from "~/types/TabsProps";

defineEmits(["change-tab"]);
const tabsProps = defineProps<TabsProps>();

const { activeTab, items } = toRefs(tabsProps);
</script>

