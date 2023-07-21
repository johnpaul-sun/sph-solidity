<template>
  <div class="mt-6">
    <table class="table-auto w-full">
      <thead class="border-b border-primary-10">
        <tr class="h-10 items-center">
          <th class="text-center px-4 text-primary-500 w-1/12">#</th>
          <th class="text-left px-4 w-3/12">Creator ID</th>
          <th class="text-left px-4 flex-1 w-6/12">Campaign Title</th>
          <th class="text-left px-4 w-2/12">Amount</th>
        </tr>
      </thead>
      <tbody v-if="!isLoading">
        <tr
          v-for="(
            { userAddress, campaignTitle, donationAmount }, index
          ) in donations"
          :key="index"
          w
          class="items-center h-14 min-h-[56px] border-b border-disabled"
        >
          <td class="min-w-[56px] px-4 text-center bg-primary-200">
            {{ index + 1 }}
          </td>
          <td class="px-4 py-2">
            <div class="flex items-center space-x-2">
              <UserAvatar
                :img-src="getAvatarUrl(userAddress)"
                :height="40"
                :width="40"
              />
              <span>
                {{ middleTruncate(userAddress, 6, 4) }}
              </span>
            </div>
          </td>
          <td class="px-4 py-2">{{ campaignTitle }}</td>
          <td class="px-4 w-40">{{ donationAmount }} ETH</td>
        </tr>
      </tbody>
    </table>
    <div v-if="lastPage > 1" class="mt-8 h-14 flex items-center justify-center">
      <BasePaginator
        :current-page="currentPage"
        :last-page="lastPage"
        :items-per-page="itemsPerPage"
        :on-page-change="setPage"
      />
    </div>
    <div v-if="donations.length < 1" class="flex justify-center mt-6">
      <p>No donations to show.</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ethers } from "ethers";
import { toast } from "vue3-toastify";
import { useUtils } from "~/composables/useUtils";
import { useWalletStore } from "~/store/wallet";

type DonationType = {
  campaignTitle: string;
  userAddress: string;
  donationAmount: string;
};

const { middleTruncate, getAvatarUrl } = useUtils();
const itemsPerPage = ref<number>(6);
const currentPage = ref<number>(1);
const lastPage = ref<number>(1);
const isLoading = ref<boolean>(false);
const donations = ref<DonationType[]>([]);
const { $getSmartContract: getSmartContract } = useNuxtApp();
const useWallet = useWalletStore();
const { address } = storeToRefs(useWallet);

const getUserDonations = async (pageNumber: number) => {
  isLoading.value = true;
  const smartContract = await getSmartContract();
  if (smartContract !== null) {
    smartContract
      .getUserDonations(address.value, itemsPerPage.value, pageNumber)
      .then((result) => {
        if (result[0].length > 0) {
          donations.value = result[0].map(
            (donation: DonationType): DonationType => {
              const { campaignTitle, userAddress, donationAmount } = donation;
              return {
                campaignTitle,
                userAddress,
                donationAmount: ethers.formatEther(donationAmount),
              };
            },
          );
          lastPage.value = Number(result[1].totalPages);
        }
      })
      .catch((error) => {
        toast.error(error.reason);
      })
      .finally(() => {
        isLoading.value = false;
      });
  } else {
    isLoading.value = false;
  }
};

onMounted(() => {
  getUserDonations(currentPage.value);
});

const setPage = (_itemsPerPage: number, pageNumber: number): void => {
  currentPage.value = pageNumber;
  getUserDonations(currentPage.value);
};
</script>
