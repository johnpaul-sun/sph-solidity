<template>
  <div class="h-[400px] rounded-2xl overflow-hidden bg-white shadow-card">
    <img :src="imgSrc" class="h-44 w-full object-cover" />
    <div class="mx-4 mt-4 leading-[150%]">
      <div class="text-dark text-base font-bold">{{ title }}</div>
      <div class="mt-2 text-disabled text-sm font-normal flex items-center">
        {{ truncate(description, 95) }}
      </div>
      <div class="mt-6">
        <div class="font-bold text-dark flex justify-between">
          <div class="text-sm">{{ ethValue }}</div>
          <div class="text-base w-4/12 text-left">{{ daysLeft }}</div>
        </div>
        <div class="font-normal text-primary-500 flex text-sm justify-between">
          <div>Raised ETH</div>
          <div class="w-4/12 text-left">Days Left</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CampaignCardProps from "@/types/CampaignCardProps";

const { truncate } = useUtils();
const campaignCardProps = defineProps<CampaignCardProps>();
const { imgSrc, ethValue, title, description, daysLeft } =
  toRefs(campaignCardProps);
</script>
