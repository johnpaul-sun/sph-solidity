<template>
  <div
    class="flex flex-col gap-6 py-6 px-36 flex-1 bg-linear-gradient-white-to-light overflow-auto"
  >
    <div class="flex gap-[22px]">
      <div class="w-full h-[420px]">
        <img
          :src="campaign.imageUrl"
          class="object-cover w-full h-[420px]"
          @error="replaceByDefault"
        />
      </div>

      <div class="flex flex-col gap-[24px]">
        <CampaignDetailCard label="Days left" :content="campaign.daysLeft" />
        <CampaignDetailCard
          label="Donations"
          :content="`${campaign.totalDonation} ETH`"
        />
        <CampaignDetailCard
          label="Total backers"
          :content="campaign.totalBackers"
        />
      </div>
    </div>

    <div class="bg-white p-4 flex gap-6 sm:flex-col lg:flex-row rounded-lg">
      <CampaignContent
        :id="campaign.campaignId"
        :title="campaign.title"
        :creator="campaign.creator"
        :story="campaign.story"
        :donations="campaign.donations"
        :can-edit="canEdit"
      />
      <CampaignFundForm
        :is-connected="isConnected"
        :is-loading="isLoading"
        @fund-campaign="donateCampaign"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { toast } from "vue3-toastify";
import { ethers } from "ethers";
import Campaign from "~/types/Campaign";
import {
  SmartContractCampaign,
  SmartContractDonationTransaction,
} from "~/types/SmartContract";
import { useWalletStore } from "~/store/wallet";
import placeholderImage from "@/assets/img/placeholder.png";

const route = useRoute();
const { truncate, getDaysLeft, getAvatarUrl } = useUtils();

const { $getSmartContract: getSmartContract } = useNuxtApp();

const isLoading = ref<boolean>(false);
const canEdit = ref<boolean>(false);
const useWallet = useWalletStore();
const { isConnected, address } = storeToRefs(useWallet);
const id = Number(route.params.id);
const campaign = ref<Campaign>({
  campaignId: 0,
  title: "",
  creator: {
    address: "",
    fullName: "",
    imageUrl: "",
  },
  imageUrl: "",
  story: "",
  daysLeft: 0,
  totalDonation: 0,
  totalBackers: 0,
  donations: [],
});

const replaceByDefault = (e: Event) => {
  (e.target as HTMLImageElement).src = placeholderImage;
};

const setCampaign = (
  data: [SmartContractCampaign, SmartContractDonationTransaction[]],
): Campaign => {
  const donations = data[1].map(
    (donation: SmartContractDonationTransaction) => {
      return {
        donationId: Number(donation.id),
        address: donation.donor,
        amount: Number(ethers.formatEther(donation.amount)),
      };
    },
  );
  return {
    campaignId: Number(data[0].id),
    title: data[0].title,
    creator: {
      address: data[0].creator,
      fullName: data[0].fullname,
      imageUrl: getAvatarUrl(data[0].creator),
    },
    imageUrl: data[0].imageUrl,
    story: data[0].story,
    daysLeft: getDaysLeft(data[0].deadline),
    totalDonation: Number(ethers.formatEther(data[0].currentAmount)),
    totalBackers: Number(data[0].totalDonations),
    donations,
  };
};

const getCampaign = async (
  id: number,
): Promise<[SmartContractCampaign, SmartContractDonationTransaction[]]> => {
  const smartContract = await getSmartContract();
  let campaign, donations;
  if (smartContract !== null) {
    campaign = await smartContract.getCampaign(id);
    donations = await smartContract.getCampaignDonations(id);
  }
  return [campaign, donations[0]];
};

const donateCampaign = async (amount: number): Promise<void> => {
  isLoading.value = true;
  const smartContract = await getSmartContract();
  if (smartContract !== null) {
    smartContract
      .sendDonation(id, {
        value: ethers.parseEther(amount.toString()),
      })
      .then(() => {
        toast.info("Funding campaign in progress!");
      })
      .catch((error) => {
        if (error.reason === "rejected") {
          toast.error("Fund rejected!");
        } else if (error.message.includes("insufficient funds for gas")) {
          toast.error("Insufficient balance!");
        } else {
          toast.error(
            "There was an error from your request. Details :" +
              truncate(error.message, 10),
          );
        }
      })
      .finally(() => {
        isLoading.value = false;
      });
  } else {
    isLoading.value = false;
  }
};

onMounted(() => {
  getCampaign(id)
    .then((result) => {
      campaign.value = setCampaign(result);
      if (
        address.value.toLowerCase() ===
        campaign.value.creator.address.toLowerCase()
      ) {
        canEdit.value = true;
      }
    })
    .catch((error) => {
      toast.error(error.reason);
    });
});
</script>
