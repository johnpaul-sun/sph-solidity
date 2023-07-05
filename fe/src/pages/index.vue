<template>
  <div>
    <div
      class="h-[560px] grid grid-cols-3 grid-rows-1 gap-4 text-center bg-gradient-container"
    >
      <div class="flex flex-col justify-center items-center">
        <IconsBlocksLeft />
      </div>
      <div
        class="flex flex-col justify-center items-center gap-8 text-primary-10"
      >
        <h1
          class="text-[40px] bg-gradient text-transparent bg-clip-text font-bold text-4xl leading-[125%]"
        >
          WELCOME TO SUNBLOCK
        </h1>
        <p class="max-w-[480px] text-center leading-[125%] text-lg">
          Contribute to projects and innovations that matter using Blockchain
          technology.
        </p>
        <div class="flex flex-col justify-center items-center">
          <p class="text-base font-bold mb-2">Want to make a project?</p>
          <NuxtLink
            to="/create-campaign"
            class="flex justify-center items-center btn-gradient h-10 px-4 font-bold text-sm uppercase"
            >Start a campaign
          </NuxtLink>
        </div>
      </div>
      <div class="flex flex-col justify-center items-center">
        <IconsBlocksRight />
      </div>
    </div>
    <div class="bg-primary-50">
      <div class="max-w-[960px] mx-auto py-6">
        <div
          class="bg-gradient text-transparent bg-clip-text text-2xl font-bold leading-[125%]"
        >
          All Campaigns
        </div>
        <div
          class="mt-6 grid grid-cols-3 gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
        >
          <CampaignCard
            v-for="i in 6"
            :key="i"
            :title="title"
            :description="description"
            :eth-value="ethValue"
            :img-src="imgSrc"
            :days-left="daysLeft"
          ></CampaignCard>
        </div>
        <div class="w-full mt-8 h-14 flex items-center justify-center">
          <BasePaginator
            :current-page="currentPage"
            :last-page="10"
            :items-per-page="itemsPerPage"
            :on-page-change="setPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CampaignCardProps from "~/types/CampaignCardProps";
import CardSample from "~/mocks/card-sample.json";

const itemsPerPage = ref(5);
const currentPage = ref(1);
const cardValueSample = ref<CampaignCardProps>(CardSample);

const { title, imgSrc, description, ethValue, daysLeft } =
  cardValueSample.value;
const setPage = (_itemsPerPage: number, pageNumber: number): void => {
  currentPage.value = pageNumber;
};
</script>
