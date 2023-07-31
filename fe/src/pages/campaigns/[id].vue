<template>
  <Loader v-if="isPageLoading" />
  <div
    v-else
    class="flex flex-col gap-6 py-6 px-36 md:px-44 min-h-screen lg:px-48 bg-linear-gradient-white-to-light overflow-auto"
  >
    <div class="flex gap-[22px]">
      <div class="relative w-full h-[420px]" @click="viewImageFullscreen">
        <div class="relative cursor-zoom-in">
          <img
            :src="campaign.imageUrl"
            alt="Campaign Image"
            class="object-cover w-full h-[420px] rounded-lg"
            @error="replaceByDefault"
          />
        </div>

        <div
          v-if="showFullscreenImage"
          class="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-70 cursor-zoom-out"
        >
          <div
            class="w-[800px] h-[600px] rounded-lg shadow-lg bg-disabled relative cursor-zoom-out"
          >
            <img
              :src="campaign.imageUrl"
              alt="Campaign Image"
              class="object-contain w-full h-full rounded-lg"
              @error="replaceByDefault"
            />
            <button
              class="absolute top-2 right-2 font-bold text-3xl cursor-pointer shadow-lg bg-white text-black rounded-full w-[35px] text-center"
            >
              &times;
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-[24px]">
        <CampaignDetailCard label="Days left" :content="campaign.daysLeft" />
        <CampaignDetailCard
          label="Donations"
          :content="`${campaign.totalDonation} ETH`"
        />
        <CampaignDetailCard
          label="Campaign Goal"
          :content="`${campaign.campaignGoal} ETH`"
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
        :campaign-id="id"
        :is-connected="isConnected"
        :is-loading="isLoading"
        :is-campaign-done="isCampaignDone"
        :is-goal-achieved="isGoalAchieved"
        :is-donator="isDonator"
        :is-funds-returned="isFundsReturned"
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
const router = useRouter();
const { truncate, getDaysLeft, getAvatarUrl, campaignStatusChecker } =
  useUtils();

const { $getSmartContract: getSmartContract } = useNuxtApp();

const isCampaignDone = ref<boolean>(false);
const isGoalAchieved = ref<boolean>(false);
const isFundsReturned = ref<boolean>(false);
const isDonator = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const isPageLoading = ref<boolean>(true);
const showFullscreenImage = ref(false);
const canEdit = ref<boolean>(false);
const useWallet = useWalletStore();
const { isConnected, address, refresher } = storeToRefs(useWallet);
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
  campaignGoal: 0,
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
      if (donation.donor.toLowerCase() === address.value) {
        isDonator.value = true;
      }

      return {
        donationId: Number(donation.id),
        address: donation.donor,
        amount: Number(ethers.formatEther(donation.amount)),
      };
    },
  );
  const totalDonation = Number(ethers.formatEther(data[0].currentAmount));
  const campaignGoal = Number(ethers.formatEther(data[0].goalAmount));
  const addressLoweredCase = Object.values(data[0].fundsReturned).map(
    (address) => address.toLowerCase(),
  );
  isFundsReturned.value = addressLoweredCase.includes(address.value);
  isGoalAchieved.value = totalDonation >= campaignGoal;
  isCampaignDone.value = campaignStatusChecker(
    totalDonation,
    campaignGoal,
    data[0].deadline,
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
    totalDonation,
    campaignGoal,
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

if (process.client) {
  watch(
    refresher,
    () => {
      if (isNaN(id) || id < 0) {
        router.push("/404");
        return;
      }
      getCampaign(id)
        .then((result) => {
          campaign.value = setCampaign(result);

          const isCampaignOwner =
            address.value.toLowerCase() ===
            campaign.value.creator.address.toLowerCase();

          if (isCampaignOwner) {
            canEdit.value = !isCampaignDone.value;
          }

          isPageLoading.value = false;
        })
        .catch((error) => {
          toast.error(error.reason);
        });
    },
    { immediate: true },
  );
}

const viewImageFullscreen = () => {
  showFullscreenImage.value = !showFullscreenImage.value;
};
</script>
