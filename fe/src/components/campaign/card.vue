<template>
  <NuxtLink
    :to="toLink"
    class="rounded-2xl overflow-hidden bg-white shadow-card flex flex-col w-80 flex-grow max-w-[320px]"
    :class="additionalClass ?? ''"
  >
    <div>
      <img :src="imgSrc" class="h-44 w-full object-cover" />
      <div class="m-4 leading-[150%]">
        <div class="text-dark text-base font-bold">{{ title }}</div>
        <div class="mt-2 text-disabled text-sm font-normal flex items-center">
          <p class="text-ellipsis overflow-hidden ...">
            {{ truncate(description, 95) }}
          </p>
        </div>
      </div>
    </div>
    <div class="mx-4 mb-4">
      <div class="font-bold text-dark flex justify-between">
        <div class="text-sm">{{ ethValue }}</div>
        <div class="text-base w-4/12 text-left">{{ daysLeft }}</div>
      </div>
      <div class="font-normal text-primary-500 flex text-sm justify-between">
        <div>Raised ETH</div>
        <div class="w-4/12 text-left">Days Left</div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import CampaignCardProps from "@/types/CampaignCardProps";

const { truncate } = useUtils();
const campaignCardProps = defineProps<CampaignCardProps>();
const {
  imgSrc,
  ethValue,
  title,
  description,
  daysLeft,
  additionalClass,
  toLink,
} = toRefs(campaignCardProps);
</script>
