<template>
  <div
    class="mt-6 grid 3xl:grid-cols-6 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6"
  >
    <CampaignCard
      v-for="{
        campaignId,
        title,
        story,
        totalDonation,
        imageUrl,
        daysLeft,
      } in campaigns"
      :key="campaignId"
      :title="title"
      :description="story"
      :eth-value="totalDonation"
      :image-url="imageUrl"
      :days-left="daysLeft"
      :to-link="`/campaigns/${campaignId}`"
    />
  </div>
</template>

<script setup lang="ts">
import Campaign from "~/types/Campaign";

type Props = {
  campaigns: Campaign[];
};

const cardViewProps = defineProps<Props>();
const { campaigns } = toRefs(cardViewProps);
</script>
