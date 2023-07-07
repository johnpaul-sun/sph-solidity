<template>
  <div
    v-if="isConnected || !isLoading"
    class="py-6 px-36 md:px-44 min-h-screen lg:px-48 bg-linear-gradient-white-to-light overflow-auto"
  >
    <UserCard
      :block-chain-value="balance"
      block-chain-label="ETH"
      :img-src="imgSrc"
      :user-id="middleTruncate(address, 6, 3)"
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
    <div v-if="activeTab === 'Donations'">
      <UserDonations />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useWalletStore } from "~/store/wallet";
const useWallet = useWalletStore();
const { isConnected, address, balance } = storeToRefs(useWallet);

const { middleTruncate } = useUtils();

const isLoading = ref<boolean>(false);
const imgSrc = `https://api.multiavatar.com/${address}.png`;

const profileTabs = ["My Campaigns", "Donators", "Donations"];

const activeTab = ref("My Campaigns");
</script>
