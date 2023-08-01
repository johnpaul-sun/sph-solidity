<template>
  <div class="mt-6">
    <table class="table-auto w-full">
      <thead class="border-b border-primary-10">
        <tr class="h-10 items-center">
          <th class="text-center px-4 text-primary-500 w-1/12">#</th>
          <th class="text-left px-4 w-3/12">Creator ID</th>
          <th class="text-left px-4 flex-1 w-6/12">Campaign Title</th>
          <th class="text-left px-4 w-2/12">Amount</th>
          <th class="text-left px-4 w-2/12">Status</th>
        </tr>
      </thead>
      <tbody v-if="!isLoading">
        <tr
          v-for="(
            {
              id,
              userAddress,
              campaignTitle,
              donationAmount,
              status,
              fundsReturned,
            },
            index
          ) in donations"
          :key="index"
          w
          class="items-center h-14 min-h-[56px] border-b border-disabled"
        >
          <td
            class="min-w-[56px] px-4 text-center bg-primary-200 cursor-pointer"
            @click="redirect(id)"
          >
            {{ index + 1 }}
          </td>
          <td class="px-4 py-2 cursor-pointer" @click="redirect(id)">
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
          <td class="px-4 py-2 cursor-pointer" @click="redirect(id)">
            {{ campaignTitle }}
          </td>
          <td class="px-4 w-40">{{ donationAmount }} ETH</td>
          <td class="px-4 w-40">
            <span v-if="status === 'achieved'" class="text-green-600"
              >Success</span
            >
            <span
              v-if="status === 'pending' && !fundsReturned"
              class="text-yellow-600"
              >Pending</span
            >
            <BaseButton
              v-if="
                status === 'expired' || (status === 'pending' && fundsReturned)
              "
              :class="
                isLoading || fundsReturned
                  ? 'bg-disabled h-9 px-4 rounded-[6px] text-white cursor-not-allowed'
                  : 'btn-gradient-hr'
              "
              :disabled="isLoading || fundsReturned"
              @click="getRefund(id, address)"
            >
              <span v-if="!fundsReturned">Refund</span>
              <span v-else>Refunded</span>
            </BaseButton>
          </td>
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
    <div v-if="isPageLoading" class="flex justify-center items-center w-full">
      <p>Loading...</p>
    </div>
    <div v-else>
      <div
        v-if="donations.length < 1 && !isPageLoading"
        class="flex justify-center mt-6"
      >
        <p>No campaigns to show.</p>
      </div>
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
  id: number;
  campaignTitle: string;
  userAddress: string;
  donationAmount: string;
  status: string;
  fundsReturned: boolean;
};

const router = useRouter();
const { middleTruncate, getAvatarUrl, getRefund } = useUtils();
const itemsPerPage = ref<number>(6);
const currentPage = ref<number>(1);
const lastPage = ref<number>(1);
const isLoading = ref<boolean>(false);
const isPageLoading = ref<boolean>(true);
const donations = ref<DonationType[]>([]);
const { $getSmartContract: getSmartContract } = useNuxtApp();
const useWallet = useWalletStore();
const { address, refresher } = storeToRefs(useWallet);

const redirect = (id: number) => {
  router.push(`/campaigns/${id}`);
};

const getUserDonations = async (pageNumber: number) => {
  isLoading.value = true;
  const smartContract = await getSmartContract();
  if (smartContract !== null) {
    smartContract
      .getUserDonations(address.value, itemsPerPage.value, pageNumber)
      .then((result) => {
        if (result[0].length > 0) {
          donations.value = result[0].reduce(
            (acc: DonationType[], current: DonationType) => {
              const existingDonation = acc.find(
                (donation) => donation.id === current.id,
              );

              if (existingDonation) {
                existingDonation.donationAmount = (
                  Number(existingDonation.donationAmount) +
                  Number(ethers.formatEther(current.donationAmount))
                ).toString();
              } else {
                acc.push({
                  id: current.id,
                  campaignTitle: current.campaignTitle,
                  userAddress: current.userAddress,
                  donationAmount: ethers.formatEther(current.donationAmount),
                  status: current.status,
                  fundsReturned: current.fundsReturned,
                });
              }
              return acc;
            },
            [],
          );

          lastPage.value = Number(result[1].totalPages);
        }
      })
      .catch((error) => {
        toast.error(error.reason);
      })
      .finally(() => {
        isLoading.value = false;
        isPageLoading.value = false;
      });
  } else {
    isLoading.value = false;
    isPageLoading.value = false;
  }
};

watch(
  refresher,
  () => {
    getUserDonations(currentPage.value);
  },
  { immediate: true },
);

const setPage = (_itemsPerPage: number, pageNumber: number): void => {
  currentPage.value = pageNumber;
  getUserDonations(currentPage.value);
};
</script>
