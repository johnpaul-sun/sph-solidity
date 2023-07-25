<template>
  <div class="flex space-x-2 p-2 border bg-white rounded-md">
    <Icon name="charm:search" class="text-disabled my-auto" />
    <input
      v-model="searchKey"
      placeholder="Search"
      class="bg-white outline-none"
      @keyup.enter="handleSubmit"
      @keyup.delete="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
type Props = {
  searchDefault?: string;
};

const searchBarProps = defineProps<Props>();
const emit = defineEmits(["on-submit"]);
const searchKey = ref<string>(searchBarProps.searchDefault ?? "");

const handleSubmit = () => {
  emit("on-submit", searchKey.value);
};

watch(
  () => searchBarProps.searchDefault,
  (value) => {
    searchKey.value = value?.toString() ?? "";
  },
);
</script>
