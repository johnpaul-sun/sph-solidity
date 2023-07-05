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
      <UserCampaigns />
    </div>
    <div v-if="activeTab === 'Donators'">
      <UserDonators />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserCardProps from "~/types/UserCardProps";
import UserCardSample from "~/mocks/user-card-sample.json";

const userCardValueSample = ref<UserCardProps>(UserCardSample);

const { userId, imgSrc, blockChainLabel, blockChainValue } =
  userCardValueSample.value;

const profileTabs = ["My Campaigns", "Donators", "Donations"];

const activeTab = ref("My Campaigns");
</script>
