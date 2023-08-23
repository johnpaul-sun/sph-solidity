<template>
  <NuxtLink
    :to="toLink"
    class="flex flex-col justify-between col-span-1 w-full rounded-2xl overflow-hidden bg-white shadow-card"
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
      <div class="flex justify-between">
        <div>
          <p class="font-bold text-dark">{{ ethValue }}</p>
          <p class="font-normal text-primary-500">Raised ETH</p>
        </div>
        <div v-if="Number(daysLeft) >= 0" class="w-4/12 text-left">
          <p class="font-bold text-dark">{{ daysLeft }}</p>
          <p class="font-normal text-primary-500">
            {{ Number(daysLeft) > 1 ? "Days left" : "Day left" }}
          </p>
        </div>
        <div v-else class="w-4/12 text-left">
          <p class="font-bold text-dark">{{ deadline }}</p>
          <p class="font-normal text-primary-500">Date Ended</p>
        </div>
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
  deadline,
  additionalClass,
  toLink,
} = toRefs(campaignCardProps);

const replaceByDefault = (e: Event) => {
  (e.target as HTMLImageElement).src = placeholderImage;
};
</script>
