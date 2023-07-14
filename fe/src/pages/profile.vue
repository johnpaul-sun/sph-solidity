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
      <UserDonators
        :donators-data="donatorsData"
        :call-new-data="callNewData"
      />
    </div>
    <div v-if="activeTab === 'Donations'">
      <UserDonations />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { toast } from "vue3-toastify";

import { useWalletStore } from "~/store/wallet";
import DonatorsData from "~/types/DonatorsData";

definePageMeta({
  middleware: ["auth"],
});

const useWallet = useWalletStore();
const { isConnected, address, balance } = storeToRefs(useWallet);

const { $getSmartContract: getSmartContract } = useNuxtApp();
const { middleTruncate, getAvatarUrl } = useUtils();

const isLoading = ref<boolean>(false);
const imgSrc = ref<string>("");
const donatorsData = ref<DonatorsData>({
  donatorsList: [],
  totalDonators: 0,
  totalPages: 0,
  nextPage: 0,
  previousPage: 0,
});
const itemsPerPage = 5;
const currentPage = 1;

const profileTabs = ["My Campaigns", "Donators", "Donations"];
const activeTab = ref("My Campaigns");

const getDonatorsByWalletAddress = async (
  walletAddress: string,
  pageSize: number,
  pageNumber: number,
): Promise<void> => {
  try {
    const smartContract = await getSmartContract();
    if (smartContract !== null) {
      const result = await smartContract.getDonatorsByWalletAddress(
        walletAddress,
        pageSize,
        pageNumber,
      );
      const donators = result[0];
      const totalDonators = Number(result[1]);
      const totalPages = Number(result[2]);
      const nextPage = Number(result[3]);
      const previousPage = Number(result[4]);

      const donatorsInfo = donators?.map(
        (donator: [string, string, number]) => ({
          donator: donator[0],
          campaignTitle: donator[1],
          donationAmount: donator[2].toString(),
        }),
      );
      const donatorsList = JSON.parse(JSON.stringify(donatorsInfo, null, 2));

      donatorsData.value = {
        donatorsList,
        totalDonators,
        totalPages,
        nextPage,
        previousPage,
      };
    }
  } catch (error) {
    if ((error as { code: string }).code === "UNCONFIGURED_NAME") return;
    toast.error("Something went wrong!");
  }
};

const callNewData = (currentPage: number): void => {
  getDonatorsByWalletAddress(address.value, itemsPerPage, currentPage);
};

watch(
  [activeTab, address],
  () => {
    getDonatorsByWalletAddress(address.value, itemsPerPage, currentPage);
    imgSrc.value = getAvatarUrl(address.value);
  },
  { immediate: true },
);
</script>
