<template>
  <div
    class="py-6 px-36 md:px-44 min-h-screen lg:px-48 bg-linear-gradient-white-to-light overflow-auto"
  >
    <UserCard
      :block-chain-value="blockChainValue"
      :block-chain-label="blockChainLabel"
      :img-src="imgSrc"
      :user-id="userId"
    />
    <div class="mt-6">
      <BaseTabs
        :active-tab="activeTab"
        :items="profileTabs"
        @change-tab="activeTab = $event"
      />
    </div>
    <div v-if="activeTab === 'My Campaigns'">
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
          :per-page="first"
          :on-page-change="setPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserCardProps from "~/types/UserCardProps";
import UserCardSample from "~/mocks/user-card-sample.json";
import CampaignCardProps from "~/types/CampaignCardProps";
import CardSample from "~/mocks/card-sample.json";

const userCardValueSample = ref<UserCardProps>(UserCardSample);

const { userId, imgSrc, blockChainLabel, blockChainValue } =
  userCardValueSample.value;

const first = ref(5);
const currentPage = ref(1);
const cardValueSample = ref<CampaignCardProps>(CardSample);

const { title, description, ethValue, daysLeft } = cardValueSample.value;
const setPage = (first: number, page: number) => {
  currentPage.value = page;
  console.log(first);
};

const profileTabs = ["My Campaigns", "Donators", "Donations"];

const activeTab = ref("My Campaigns");
</script>
