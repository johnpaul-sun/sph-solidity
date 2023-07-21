<template>
  <div class="flex space-x-2 p-2 border bg-white rounded-md">
    <Icon name="charm:search" class="text-disabled my-auto" />
    <input
      v-model="searchKey"
      placeholder="Search"
      class="bg-white outline-none"
      @keyup.enter="handleSumbit"
    />
  </div>
</template>

<script setup lang="ts">
type Props = {
  searchDefault: string;
};

const searchBarProps = defineProps<Props>();
const emit = defineEmits(["on-sumbit"]);
const searchKey = ref<string>(searchBarProps.searchDefault ?? "");

const handleSumbit = () => {
  emit("on-sumbit", searchKey.value);
};
</script>
