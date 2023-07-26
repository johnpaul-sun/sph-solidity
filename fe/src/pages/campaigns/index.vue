<template>
  <div class="flex-1 bg-primary-50">
    <div class="px-36 mx-auto py-6">
      <div
        class="bg-gradient text-transparent bg-clip-text text-2xl font-bold leading-[125%]"
      >
        All Campaigns
      </div>
      <div class="mt-6 flex justify-end items-center gap-7">
        <div v-show="search" class="max-w-full w-full truncate">
          <span class="min-w-fit text-sm text-disabled">
            filtered by keyword:
          </span>
          <span class="w-full truncate text-primary-10">
            {{ search }}
          </span>
        </div>
        <BaseViewToggle
          class="min-w-fit"
          :type="viewType"
          @change-type="changeViewType"
        />
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
          @click="loadCampaigns(true)"
        >
          Load more campaigns
        </BaseButton>
      </div>

      <div
        v-show="allCampaigns.length < 1 && !isLoading"
        class="mt-6 h-14 flex items-center justify-center"
      >
        No campaigns to show
      </div>
      <div
        v-show="isLoading"
        class="mt-6 h-14 flex items-center justify-center"
      >
        Loading campaigns...
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
const search = ref<string>(route.query.search?.toString() ?? "");

const { getDaysLeft, getAvatarUrl } = useUtils();
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

const getCampaignsResult = async (): Promise<
  [SmartContractCampaign[], SmartContractResultIndex]
> => {
  const smartContract = await getSmartContract();
  let result, fetchedCampaigns, fetchedResultIndex;
  if (smartContract !== null) {
    if (search.value) {
      result = await smartContract.searchByTitle(
        search.value,
        6,
        resultIndex.value.nextIndex,
      );
    } else {
      result = await smartContract.getAllCampaigns(
        6,
        resultIndex.value.nextIndex,
      );
    }
    fetchedCampaigns = result[0];
    fetchedResultIndex = result[1];
  }
  return [fetchedCampaigns, fetchedResultIndex];
};

const setAllCampaigns = (data: SmartContractCampaign[]): Campaign[] => {
  const campaigns = data.map((campaign: SmartContractCampaign) => {
    return {
      campaignId: Number(campaign.id),
      title: campaign.title,
      creator: {
        address: campaign.creator,
        fullName: campaign.fullname,
        imageUrl: getAvatarUrl(campaign.creator),
      },
      imageUrl: campaign.imageUrl,
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

const loadCampaigns = (fromLoadMore = false) => {
  isLoading.value = true;

  getCampaignsResult()
    .then((result) => {
      const fetchedCampaigns = setAllCampaigns(result[0]);
      allCampaigns.value = fromLoadMore
        ? allCampaigns.value.concat(fetchedCampaigns)
        : fetchedCampaigns;
      resultIndex.value = setResultIndex(result[1]);
    })
    .catch((error) => {
      toast.error(error.reason);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

watch(
  () => route.query.search,
  (value) => {
    search.value = value?.toString() ?? "";
    resultIndex.value = setResultIndex({
      isLastPage: false,
      nextIndex: 0,
    });
    loadCampaigns();
  },
);

onMounted(() => {
  loadCampaigns();
});
</script>
