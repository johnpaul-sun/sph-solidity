<template>
  <Loader v-if="isPageLoading" />
  <div v-else>
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
          :total-donators-pages="totalDonatorsPages"
        />
      </div>
      <div v-if="activeTab === 'Donations'">
        <UserDonations />
      </div>
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
const isPageLoading = ref<boolean>(true);
const imgSrc = ref<string>("");
const totalDonatorsPages = ref<number>(1);
const donatorsData = ref<DonatorsData>({
  donatorsList: [],
  totalDonators: 0,
  totalPages: 0,
  nextPage: 0,
  previousPage: 0,
});
const itemsPerPage = 6;
const currentPage = 1;

const profileTabs = ["My Campaigns", "Donators", "Donations"];
const activeTab = ref(useCookie("active-tab").value ?? profileTabs[0]);

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

      if (donators.length > 0) {
        const donatorsInfo = donators
          ?.map((donator: [number, string, string, number]) => {
            const donationAmount = donator[3].toString();
            if (donationAmount !== "0") {
              return {
                id: donator[0],
                donator: donator[1],
                campaignTitle: donator[2],
                donationAmount,
              };
            }
            return null;
          })
          .filter(Boolean);

        donatorsData.value = {
          donatorsList: donatorsInfo,
          totalDonators,
          totalPages,
          nextPage,
          previousPage,
        };
        totalDonatorsPages.value = totalPages;
      }
      isPageLoading.value = false;
    }
  } catch (error) {
    isPageLoading.value = false;
    const errorCode = JSON.parse(JSON.stringify(error)).code;

    if (process.client) {
      if (errorCode === "UNCONFIGURED_NAME" || errorCode === undefined) return;
      toast.error("Something went wrong!");
    }
  }
};

const callNewData = (currentPage: number): void => {
  getDonatorsByWalletAddress(address.value, itemsPerPage, currentPage);
};

if (process.client) {
  watch(
    [activeTab, address],
    () => {
      getDonatorsByWalletAddress(address.value, itemsPerPage, currentPage);
      imgSrc.value = getAvatarUrl(address.value);
    },
    { immediate: true },
  );
}

onUnmounted(() => {
  useCookie("active-tab").value = profileTabs[0];
});
</script>
