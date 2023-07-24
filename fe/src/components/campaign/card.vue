<template>
  <NuxtLink
    :to="toLink"
    class="col-span-1 w-full rounded-2xl overflow-hidden bg-white shadow-card"
    :class="additionalClass ?? ''"
  >
    <div>
      <img
        :src="imageUrl"
        alt="Image"
        class="h-44 w-full object-cover"
        @error="replaceByDefault"
      />
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
import placeholderImage from "@/assets/img/placeholder.png";

const { truncate } = useUtils();
const campaignCardProps = defineProps<CampaignCardProps>();
const {
  imageUrl,
  ethValue,
  title,
  description,
  daysLeft,
  additionalClass,
  toLink,
} = toRefs(campaignCardProps);

const replaceByDefault = (e: Event) => {
  (e.target as HTMLImageElement).src = placeholderImage;
};
</script>
