<template>
  <div
    class="h-10 rounded-md py-1 px-4 flex space-x-1 border border-primary-10 items-center cursor-pointer"
    @click="changeViewType"
  >
    <div class="text-primary-10 text-sm leading-[120%]">
      View as <span class="capitalize">{{ type }}</span>
    </div>
    <Icon name="solar:hamburger-menu-linear" class="h-4 w-4" />
  </div>
</template>

<script setup lang="ts">
import ViewToggleType from "@/types/ViewToggleType";

const viewToggleProps = defineProps<{ type: ViewToggleType }>();
const { type } = toRefs(viewToggleProps);
const emits = defineEmits(["change-type"]);

const changeViewType = (): void => {
  emits("change-type", type.value === "cards" ? "table" : "cards");
};
</script>
