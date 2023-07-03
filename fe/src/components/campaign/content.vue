<template>
  <div class="flex flex-col gap-6 sm:w-full lg:w-full">
    <div>
      <p class="label">Title: {{ title }}</p>
    </div>
    <div class="group flex-col">
      <p class="label">Creator:</p>
      <div class="group">
        <div class="w-[60px] h-[60px]">
          <UserAvatar :img-src="creator.imgSrc" />
        </div>
        <div class="flex flex-col gap-1 px-4 py-1 max-w-[196px] overflow-clip">
          <p class="font-bold">
            {{ middleTruncate(creator.address, 8, 5) }}
          </p>
          <p class="text-disabled">{{ creator.totalCampaigns }} campaigns</p>
        </div>
      </div>
    </div>
    <div class="group flex-col">
      <p class="label">Story</p>
      <div class="text-sm text-disabled">{{ story }}</div>
    </div>
    <div class="group flex-col w-[345px]">
      <p class="label">Donators</p>
      <ol>
        <div
          v-for="donator in donators"
          :key="donator.address"
          class="flex justify-between text-sm"
        >
          <li class="text-disabled">
            <span class="text-dark">
              {{ middleTruncate(donator.address, 8, 5) }}
            </span>
          </li>
          <span class="text-primary-10">
            {{ donator.amount }}
            <span class="font-bold"> ETH</span>
          </span>
        </div>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Donator, Creator } from "~/types/CampaignProps";
type Props = {
  title: string;
  creator: Creator;
  story: string;
  donators: Donator[];
};
defineProps<Props>();

const { middleTruncate } = useUtils();
</script>

<style lang="postcss" scoped>
.label {
  @apply font-bold text-dark uppercase;
}
.group {
  @apply flex gap-2;
}

ol li {
  display: list-item;
  list-style-type: decimal;
  list-style-position: inside;
}
</style>
