<template>
  <div
    class="mt-6 grid grid-cols-3 gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 campaigns"
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
</template>
<script setup lang="ts">
import CardSample from "~/mocks/card-sample.json";
import CampaignCardProps from "~/types/CampaignCardProps";
import UserCardSample from "~/mocks/user-card-sample.json";
import UserCardProps from "~/types/UserCardProps";

const userCardValueSample = ref<UserCardProps>(UserCardSample);

const itemsPerPage = ref(5);
const currentPage = ref(1);
const cardValueSample = ref<CampaignCardProps>(CardSample);
const { imgSrc } = userCardValueSample.value;

const { title, description, ethValue, daysLeft } = cardValueSample.value;
const setPage = (_itemsPerPage: number, pageNumber: number): void => {
  currentPage.value = pageNumber;
};
</script>
