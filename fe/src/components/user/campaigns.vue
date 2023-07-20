<template>
  <div class="mt-6">
    <div class="flex gap-6 flex-wrap">
      <CampaignCard
        v-for="campaign in userCampaigns"
        :key="campaign.id"
        :title="campaign.title"
        :description="campaign.description"
        :eth-value="campaign.ethValue"
        :img-src="campaign.imgSrc"
        :days-left="campaign.daysLeft"
        additional-class="cursor-pointer"
        @click="$router.push(`/campaigns/${campaign.id}`)"
      ></CampaignCard>
    </div>
    <div
      v-if="lastPage > 1"
      class="w-full mt-8 h-14 flex items-center justify-center"
    >
      <BasePaginator
        :current-page="currentPage"
        :last-page="lastPage"
        :items-per-page="itemsPerPage"
        :on-page-change="setPage"
      />
    </div>
    <div v-if="userCampaigns.length < 1" class="flex justify-center mt-6">
      <p>No campaigns to show.</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { BigNumberish, ethers } from "ethers";
import { toast } from "vue3-toastify";
import { useWalletStore } from "~/store/wallet";
import CampaignCardProps from "~/types/CampaignCardProps";

const { $getSmartContract: getSmartContract } = useNuxtApp();
const { getDaysLeft } = useUtils();
const useWallet = useWalletStore();

const itemsPerPage = ref<number>(6);
const currentPage = ref<number>(1);
const lastPage = ref<number>(1);
const { address } = storeToRefs(useWallet);
const isLoading = ref<boolean>(false);
const imgSrc = `https://api.multiavatar.com/${address}.png`;
const userCampaigns = ref<CampaignCardProps[]>([]);

const getUserCampaings = async (pageNumber: number) => {
  isLoading.value = true;
  const smartContract = await getSmartContract();
  if (smartContract !== null) {
    smartContract
      .getUserCampaigns(itemsPerPage.value, pageNumber)
      .then((result) => {
        if (result[0].length > 0) {
          userCampaigns.value = result[0].map((campaign: BigNumberish[]) => {
            return {
              id: campaign[0],
              imgSrc,
              title: campaign[3],
              description: campaign[4],
              ethValue: ethers.formatEther(campaign[6]),
              daysLeft: getDaysLeft(campaign[7]),
            };
          });
          lastPage.value = Number(result[2]);
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
  getUserCampaings(currentPage.value);
});

const setPage = (_itemsPerPage: number, pageNumber: number): void => {
  currentPage.value = pageNumber;
  getUserCampaings(currentPage.value);
};
</script>
