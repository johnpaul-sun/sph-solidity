<template>
  <div
    class="flex flex-col gap-6 py-6 px-36 md:px-44 min-h-screen lg:px-48 bg-linear-gradient-white-to-light overflow-auto"
  >
    <div class="flex gap-[22px]">
      <div class="w-full h-[420px]">
        <img
          :src="imgSrc"
          alt="Boy writing on paper"
          class="object-cover w-full h-[420px]"
        />
      </div>

      <div class="flex flex-col gap-[24px]">
        <CampaignDetailCard label="Days left" :content="daysLeft" />
        <CampaignDetailCard label="Donations" :content="`${donations} ETH`" />
        <CampaignDetailCard label="Total backers" :content="totalBackers" />
      </div>
    </div>

    <div class="bg-white p-4 flex gap-6 sm:flex-col lg:flex-row">
      <CampaignContent
        :title="title"
        :creator="creator"
        :story="story"
        :donators="donators"
      />
      <CampaignFundForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import CampaignProps from "~/types/CampaignProps";
import CampaignSample from "~/mocks/campaign-sample.json";

const campaignValueSample = ref<CampaignProps>(CampaignSample);

const {
  title,
  creator,
  imgSrc,
  story,
  daysLeft,
  donations,
  totalBackers,
  donators,
} = campaignValueSample.value;
</script>
