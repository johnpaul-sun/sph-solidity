<template>
  <div
    class="rounded-2xl w-80 h-40 bg-gradient-to-b from-[#F39D40] to-[#AC3971] p-[1px]"
  >
    <div class="bg-white h-full rounded-2xl p-6 space-x-4 flex items-center">
      <img :src="imgSrc" class="h-24 w-24 rounded-full object-cover" />
      <div>
        <div class="flex text-2xl font-bold space-x-4">
          <div class="text-dark">{{ blockChainValue }}</div>
          <div class="text-primary-500">{{ blockChainLabel }}</div>
        </div>
        <div class="text-primary-10 mt-2">{{ userId }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserCardProps from "~/types/UserCardProps";

const userCardProps = defineProps<UserCardProps>();
const { userId, imgSrc, blockChainLabel, blockChainValue } =
  toRefs(userCardProps);
</script>
