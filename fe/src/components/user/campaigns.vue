<template>
  <div class="mt-6">
    <div
      class="grid xxl:grid-cols-5 xl:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6"
    >
      <CampaignCard
        v-for="{
          id,
          title,
          imageUrl,
          description,
          ethValue,
          daysLeft,
        } in userCampaigns"
        :key="id"
        :title="title"
        :description="description"
        :eth-value="ethValue"
        :image-url="imageUrl"
        :days-left="daysLeft"
        additional-class="cursor-pointer"
        @click="$router.push(`/campaigns/${id}`)"
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
import { toast } from "vue3-toastify";
import { BigNumberish, ethers } from "ethers";
import CampaignCardProps from "~/types/CampaignCardProps";

const { $getSmartContract: getSmartContract } = useNuxtApp();
const { getDaysLeft } = useUtils();

const itemsPerPage = ref<number>(6);
const currentPage = ref<number>(1);
const lastPage = ref<number>(1);
const isLoading = ref<boolean>(false);
const userCampaigns = ref<CampaignCardProps[]>([]);

const getUserCampaigns = async (pageNumber: number) => {
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
              title: campaign[3],
              description: campaign[4],
              imageUrl: campaign[5],
              ethValue: ethers.formatEther(campaign[7]),
              daysLeft: getDaysLeft(campaign[8]),
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
  getUserCampaigns(currentPage.value);
});

const setPage = (_itemsPerPage: number, pageNumber: number): void => {
  currentPage.value = pageNumber;
  getUserCampaigns(currentPage.value);
};
</script>
