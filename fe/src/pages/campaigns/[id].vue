<template>
  <div
    class="flex flex-col gap-6 py-6 px-36 md:px-44 min-h-screen lg:px-48 bg-linear-gradient-white-to-light overflow-auto"
  >
    <div class="flex gap-[22px]">
      <div class="w-full h-[420px]">
        <img
          :src="imgSrc"
          alt="Boy writing on paper"
          class="object-cover w-full h-[420px]"
        />
      </div>

      <div class="flex flex-col gap-[24px]">
        <CampaignDetailCard label="Days left" :content="daysLeft" />
        <CampaignDetailCard label="Donations" :content="`${donations} ETH`" />
        <CampaignDetailCard label="Total backers" :content="totalBackers" />
      </div>
    </div>

    <div class="bg-white p-4 flex gap-6 sm:flex-col lg:flex-row rounded-lg">
      <CampaignContent
        :id="id"
        :title="title"
        :creator="creator"
        :story="story"
        :donators="donators"
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
import CampaignProps from "~/types/CampaignProps";
import CampaignSample from "~/mocks/campaign-sample.json";
import { useWalletStore } from "~/store/wallet";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const { truncate } = useUtils();

const { $getSmartContract: getSmartContract } = useNuxtApp();

const campaignValueSample = ref<CampaignProps>(CampaignSample);

const isLoading = ref<boolean>(false);

const useWallet = useWalletStore();
const { isConnected } = storeToRefs(useWallet);
const { id } = route.params;

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

const {
  title,
  creator,
  imgSrc,
  story,
  daysLeft,
  donations,
  totalBackers,
  donators,
} = campaignValueSample.value;
</script>
