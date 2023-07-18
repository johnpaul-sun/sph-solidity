<template>
  <div>
    <BaseModal>
      <div>
        You need to setup and connect your wallet in order to proceed with the
        transaction.
      </div>
      <NuxtLink
        to="/help"
        class="flex w-full justify-center items-center rounded-md px-4 py-2 bg-clip-text text-sm font-bold text-transparent bg-linear-gradient-primary border border-primary-400"
        @click="handleCloseModal"
      >
        Setup MetaMask wallet
      </NuxtLink></BaseModal
    >
    <div
      class="h-[560px] grid grid-cols-3 grid-rows-1 gap-4 text-center bg-gradient-container"
    >
      <div class="flex flex-col justify-center items-center">
        <IconsBlocksLeft />
      </div>
      <div
        class="flex flex-col justify-center items-center gap-8 text-primary-10"
      >
        <h1
          class="text-[40px] bg-gradient text-transparent bg-clip-text font-bold text-4xl leading-[125%]"
        >
          WELCOME TO SUNBLOCK
        </h1>
        <p class="max-w-[480px] text-center leading-[125%] text-lg">
          Contribute to projects and innovations that matter using Blockchain
          technology.
        </p>
        <div class="flex flex-col justify-center items-center">
          <p class="text-base font-bold mb-2">Want to make a project?</p>
          <NuxtLink
            to="/create-campaign"
            class="flex justify-center items-center btn-gradient h-10 px-4 font-bold text-sm uppercase"
            >Start a campaign
          </NuxtLink>
        </div>
      </div>
      <div class="flex flex-col justify-center items-center">
        <IconsBlocksRight />
      </div>
    </div>
    <div class="bg-primary-50">
      <div class="max-w-[960px] mx-auto py-6">
        <div
          class="bg-gradient text-transparent bg-clip-text text-2xl font-bold leading-[125%]"
        >
          New campaigns
        </div>
        <div>
          <div v-if="isLoading" class="h-40 flex justify-center items-center">
            <div class="flex justify-center items-center">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
              ></div>
            </div>
          </div>
          <div
            v-if="recentCampaign?.length === 0"
            class="h-40 flex justify-center items-center"
          >
            No campaigns available
          </div>
          <div v-else>
            <div
              class="mt-6 grid grid-cols-3 gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            >
              <CampaignCard
                v-for="{
                  id,
                  title,
                  story,
                  currentAmount,
                  deadline,
                } in recentCampaign"
                :key="id"
                :title="title"
                :description="story"
                :eth-value="formatEther(currentAmount)"
                :img-src="imgSrc"
                :days-left="getDaysLeft(deadline)"
                :to-link="`/campaigns/${id}`"
              ></CampaignCard>
            </div>
            <div
              v-if="!isLoading && recentCampaign?.length >= 6"
              class="w-full mt-8 h-14 flex items-center justify-center"
            >
              <NuxtLink
                to="/campaigns"
                class="rounded-lg border py-2 px-4 border-primary-10 text-primary-10"
              >
                View more campaigns
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatEther } from "ethers";
import { toast } from "vue3-toastify";

import CampaignCardProps from "~/types/CampaignCardProps";
import CardSample from "~/mocks/card-sample.json";
import { useWalletStore } from "~/store/wallet";
import RecentCampaignData from "~/types/RecentCampaignData";

type ResultData = [
  number,
  string,
  string,
  string,
  string,
  number,
  number,
  number,
  number,
][];

const cardValueSample = ref<CampaignCardProps>(CardSample);

const walletStore = useWalletStore();
const { updateIsShowModal } = walletStore;

const handleCloseModal = () => updateIsShowModal(false);
const { $getSmartContract: getSmartContract } = useNuxtApp();
const { getDaysLeft } = useUtils();

const { imgSrc } = cardValueSample.value;

const recentCampaign = ref<RecentCampaignData[]>([]);
const isLoading = ref<boolean>(true);

const getRecentCampaigns = async (pageSize: number): Promise<void> => {
  try {
    const smartContract = await getSmartContract();

    if (smartContract !== null) {
      const result = await smartContract.getRecentCampaigns(pageSize);
      const campaignData: RecentCampaignData[] = (result[0] as ResultData).map(
        (item) => ({
          id: item[0],
          creator: item[1],
          fullname: item[2],
          title: item[3],
          story: item[4],
          goalAmount: item[5],
          currentAmount: item[6],
          deadline: item[7],
          totalDonations: item[8],
        }),
      );
      recentCampaign.value = campaignData.reverse();
    }
  } catch (error) {
    if (process.client) {
      if ((error as { code: string }).code === "UNCONFIGURED_NAME") return;
      toast.error("Something went wrong!");
    }
  }
};

onMounted(() => {
  getRecentCampaigns(6);
  isLoading.value = false;
});
</script>
