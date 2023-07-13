<template>
  <div
    class="flex flex-col gap-6 py-6 px-36 md:px-44 min-h-screen lg:px-48 bg-linear-gradient-white-to-light overflow-auto"
  >
    <div class="flex gap-[22px]">
      <div class="w-full h-[420px]">
        <img
          :src="campaign.imgSrc"
          alt="Boy writing on paper"
          class="object-cover w-full h-[420px]"
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
import CampaignProps from "~/types/CampaignProps";
import { useWalletStore } from "~/store/wallet";

definePageMeta({
  middleware: ["auth"],
});

const route = useRoute();
const { truncate, getDaysLeft } = useUtils();

const { $getSmartContract: getSmartContract } = useNuxtApp();

const isLoading = ref<boolean>(false);
const canEdit = ref<boolean>(false);
const useWallet = useWalletStore();
const { isConnected, address } = storeToRefs(useWallet);
const { id } = route.params;
const campaign = ref<CampaignProps>({
  campaignId: 0,
  title: "",
  creator: {
    address: "",
    fullName: "",
    imgSrc: "",
  },
  imgSrc: "",
  story: "",
  daysLeft: 0,
  totalDonation: 0,
  totalBackers: 0,
  donations: [],
});

const getCampaign = async (id: number): Promise<void> => {
  isLoading.value = true;
  const smartContract = await getSmartContract();
  if (smartContract !== null) {
    smartContract
      .getCampaign(id)
      .then((result) => {
        campaign.value = {
          campaignId: Number(result[0][0]),
          title: result[0][3],
          creator: {
            address: result[0][1],
            fullName: result[0][2],
            imgSrc:
              "https://img.freepik.com/free-psd/3d-illustration-person_23-2149436182.jpg",
          },
          imgSrc:
            "https://images.unsplash.com/photo-1529390079861-591de354faf5",
          story: result[0][4],
          daysLeft: getDaysLeft(result[0][7]),
          totalDonation: Number(ethers.formatEther(result[0][6])),
          totalBackers: Number(result[0][8]),
          donations: [],
        };
        result[1].map((donation: ethers.BigNumberish[]) =>
          campaign.value.donations.push({
            donationId: Number(donation[0]),
            address: donation[2].toString(),
            amount: Number(ethers.formatEther(donation[3])),
          })
        );
        if (
          address.value.toLowerCase() ===
          campaign.value.creator.address.toLowerCase()
        ) {
          canEdit.value = true;
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
              truncate(error.message, 10)
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
  getCampaign(Number(id));
});
</script>
