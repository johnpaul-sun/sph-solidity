<template>
  <div class="bg-primary-50">
    <div class="max-w-[960px] mx-auto py-6">
      <div
        class="bg-gradient text-transparent bg-clip-text text-2xl font-bold leading-[125%]"
      >
        All Campaigns
      </div>
      <div class="mt-6 flex justify-between items-center">
        <div>
          <p v-if="search" class="text-sm text-disabled leading-[150%]">
            filtered by keyword:
            <span class="text-primary-10">{{ search }}</span>
          </p>
        </div>
        <BaseViewToggle :type="viewType" @change-type="changeViewType" />
      </div>

      <div v-if="viewType === 'cards'">
        <CampaignCardView :campaigns="allCampaigns" />
      </div>

      <div v-else-if="viewType === 'table'">
        <CampaignTableView :campaigns="allCampaigns" />
      </div>

      <div
        v-show="!resultIndex.isLastPage && !isLoading"
        class="w-full mt-6 h-14 flex items-center justify-center"
      >
        <BaseButton
          class="rounded-lg border-primary-10 font-bold text-sm border px-4 py-2 h-10"
          @click="loadCampaigns"
        >
          Load more campaigns
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ethers } from "ethers";
import { toast } from "vue3-toastify";
import ViewToggleType from "@/types/ViewToggleType";
import Campaign from "~/types/Campaign";
import {
  SmartContractCampaign,
  SmartContractResultIndex,
} from "~/types/SmartContract";

const route = useRoute();
const {
  query: { search },
} = route;

const { getDaysLeft } = useUtils();
const { $getSmartContract: getSmartContract } = useNuxtApp();

const viewType = ref<ViewToggleType>("cards");
const isLoading = ref<boolean>(true);
const allCampaigns = ref<Campaign[]>([]);
const resultIndex = ref<SmartContractResultIndex>({
  isLastPage: false,
  nextIndex: 0,
});

const changeViewType = (type: ViewToggleType): void => {
  viewType.value = type;
};

const getAllCampaignsResult = async (
  size: number,
  startIndex: number
): Promise<[SmartContractCampaign[], SmartContractResultIndex]> => {
  const smartContract = await getSmartContract();
  let campaigns, resultIndex;
  if (smartContract !== null) {
    const result = await smartContract.getAllCampaigns(size, startIndex);
    campaigns = result[0];
    resultIndex = result[1];
  }
  return [campaigns, resultIndex];
};

const setAllCampaigns = (data: SmartContractCampaign[]): Campaign[] => {
  const campaigns = data.map((campaign: SmartContractCampaign) => {
    return {
      campaignId: Number(campaign.id),
      title: campaign.title,
      creator: {
        address: campaign.creator,
        fullName: campaign.fullname,
        imgSrc:
          "https://img.freepik.com/free-psd/3d-illustration-person_23-2149436182.jpg",
      },
      imgSrc: "https://images.unsplash.com/photo-1529390079861-591de354faf5",
      story: campaign.story,
      daysLeft: getDaysLeft(campaign.deadline),
      totalDonation: Number(ethers.formatEther(campaign.currentAmount)),
      totalBackers: Number(campaign.totalDonations),
    };
  });
  return campaigns;
};

const setResultIndex = (data: SmartContractResultIndex) => {
  return {
    isLastPage: data.isLastPage,
    nextIndex: data.nextIndex,
  };
};

const loadCampaigns = () => {
  isLoading.value = true;
  getAllCampaignsResult(6, resultIndex.value.nextIndex)
    .then((result) => {
      const fetchedCampaigns = setAllCampaigns(result[0]);
      allCampaigns.value = allCampaigns.value.concat(fetchedCampaigns);
      resultIndex.value = setResultIndex(result[1]);
    })
    .catch((error) => {
      toast.error(error.reason);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

onMounted(() => {
  loadCampaigns();
});
</script>
