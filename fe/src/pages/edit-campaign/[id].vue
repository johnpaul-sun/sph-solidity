<template>
  <div class="flex-grow bg-linear-gradient-white-to-light">
    <div class="max-w-[960px] mx-auto space-y-6 py-6">
      <div class="flex items-center space-x-2">
        <BaseButton @click="handleBack">
          <Icon name="material-symbols:chevron-left" class="h-6 w-6" />
        </BaseButton>
        <div class="font-bold text-2xl text-dark">EDIT CAMPAIGN</div>
      </div>
      <div class="relative h-60">
        <img
          :src="imageUrl"
          class="w-full h-full object-cover"
          @error="replaceByDefault"
        />
      </div>
      <form class="flex flex-col space-y-6" @submit.prevent="onSubmit">
        <div class="space-y-2">
          <BaseInput
            id="fullname"
            label="Full name"
            name="fullname"
            placeholder="Enter your full name"
            :error="errors.fullname"
            :model-value="fullname"
            @change="handleChange"
          />
          <BaseInput
            id="campaign-name"
            label="Campaign name"
            name="campaign"
            placeholder="Enter a title"
            :error="errors.campaign"
            :model-value="campaign"
            @change="handleChange"
          />
          <BaseTextArea
            id="story"
            label="Story"
            name="story"
            placeholder="Write your story..."
            :error="errors.story"
            :model-value="story"
            @change="handleChange"
          />
          <BaseInput
            id="image-url"
            label="Image URL"
            name="imageUrl"
            placeholder="Enter an image link"
            :error="errors.imageUrl"
            :model-value="imageUrl"
            @change="handleValidateImageUrl"
          />
          <div class="flex w-full space-x-4">
            <BaseInput
              id="goal"
              label="Goal"
              name="goal"
              placeholder="0.123 ETH"
              type="number"
              step="any"
              :error="errors.goal"
              :model-value="goal"
              @change="handleChange"
            />
            <BaseInput
              id="date"
              label="Date"
              name="date"
              type="date"
              :error="errors.date"
              :model-value="date"
              @change="handleChange"
            />
          </div>
        </div>
        <BaseButton
          class="w-fit"
          :class="
            isLoading
              ? 'bg-disabled h-10 px-4 rounded-[6px] text-white'
              : 'btn-gradient'
          "
          :disabled="isLoading || !isConnected"
          >UPDATE CAMPAIGN</BaseButton
        >
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ethers } from "ethers";
import { toast } from "vue3-toastify";
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { storeToRefs } from "pinia";
import {
  CreateCampaignRequestSchema,
  CreateCampaignRequest,
} from "../../schemas/create-campaign";
import isImageUrl from "~/plugins/isImageUrl";
import { useWalletStore } from "~/store/wallet";
import placeholderImage from "@/assets/img/placeholder.png";

const validationSchema = toTypedSchema(CreateCampaignRequestSchema);
const router = useRouter();
const route = useRoute();
const { getDateYMD, notConnectedWarning } = useUtils();

const useWallet = useWalletStore();
const { isConnected } = storeToRefs(useWallet);
const { id } = route.params;
const { $getSmartContract: getSmartContract } = useNuxtApp();
const isLoading = ref<boolean>(false);
const campaignData = ref<{
  fullname: string;
  campaign: string;
  story: string;
  goal: number;
  imageUrl: string;
  date: string;
  upload?: string | undefined;
}>({
  fullname: "",
  campaign: "",
  story: "",
  imageUrl: "",
  goal: 0,
  date: "",
});

const {
  handleSubmit,
  resetForm,
  values,
  errors,
  setFieldValue,
  setFieldError,
  validateField,
} = useForm({
  validationSchema,
});

const getCampaign = async (): Promise<void> => {
  isLoading.value = true;
  const smartContract = await getSmartContract();
  if (smartContract !== null) {
    smartContract
      .getCampaign(id)
      .then((result) => {
        values.fullname = result[2];
        values.campaign = result[3];
        values.story = result[4];
        values.imageUrl = result[5];
        values.goal = +ethers.formatEther(result[6]);
        values.date = getDateYMD(result[8]);

        campaignData.value.fullname = values.fullname ?? "";
        campaignData.value.campaign = values.campaign ?? "";
        campaignData.value.story = values.story ?? "";
        campaignData.value.imageUrl = values.imageUrl ?? "";
        campaignData.value.goal = values.goal;
        campaignData.value.date = values.date;
      })
      .catch((error): void => {
        toast.error(error.reason);
      })
      .finally((): void => {
        isLoading.value = false;
      });
  } else {
    notConnectedWarning();
    isLoading.value = false;
  }
};

onMounted((): void => {
  getCampaign();
});

const handleValidateImageUrl = async (
  e: InputEvent,
): Promise<void | undefined> => {
  isLoading.value = true;
  const { name, value } = e.target as HTMLInputElement;

  const val = await isImageUrl(value);
  setFieldValue(name, value);

  if (!val) {
    setFieldError(name, "Invalid image url");
  } else {
    validateField(name);
  }

  isLoading.value = false;
};

const replaceByDefault = (e: Event) => {
  (e.target as HTMLImageElement).src = placeholderImage;
};

const handleChange = (e: InputEvent): void => {
  const { name, type, value } = e.target as HTMLInputElement;

  if (type === "number") {
    setFieldValue(name, parseFloat(value));
  } else if (type === "date ") {
    const dateValue = new Date(value);
    setFieldValue(name, dateValue);
  } else {
    setFieldValue(name, value);
  }
  validateField(name);
};

const { value: fullname } =
  useField<CreateCampaignRequest["fullname"]>("fullname");
const { value: campaign } =
  useField<CreateCampaignRequest["campaign"]>("campaign");
const { value: story } = useField<CreateCampaignRequest["story"]>("story");
const { value: imageUrl } =
  useField<CreateCampaignRequest["imageUrl"]>("imageUrl");
const { value: goal } = useField<CreateCampaignRequest["goal"]>("goal");
const { value: date } = useField<CreateCampaignRequest["date"]>("date");

const handleBack = (): void => {
  router.back();
};

const checkIfDirty = (): boolean => {
  if (
    campaignData.value.fullname === values.fullname &&
    campaignData.value.campaign === values.campaign &&
    campaignData.value.story === values.story &&
    campaignData.value.imageUrl === values.imageUrl &&
    campaignData.value.goal === values.goal &&
    campaignData.value.date === values.date
  ) {
    return false;
  } else {
    return true;
  }
};

const onSubmit = handleSubmit(async (): Promise<void> => {
  isLoading.value = true;
  const deadline = new Date(values.date as string);

  if (!checkIfDirty()) {
    toast.info("Campaign not updated!");
    isLoading.value = false;

    return;
  }
  // adjust date to handle time difference for each timestamp
  const offset = deadline.getTimezoneOffset();
  deadline.setMinutes(deadline.getMinutes() + offset);

  const smartContract = await getSmartContract();
  if (smartContract !== null) {
    smartContract
      .editCampaign(
        Number(id),
        values.fullname,
        values.campaign,
        values.story,
        values.imageUrl,
        ethers.parseEther((values.goal as number).toString()),
        deadline.getTime() / 1000, // convert from milliseconds to secsonds
      )
      .then((): void => {
        resetForm();
        toast.info("Campaign update in progress!");
      })
      .catch((error): void => {
        if (error.reason === "rejected") {
          toast.error("Campaign update rejected!");
        } else if (error.message.includes("insufficient funds for gas")) {
          toast.error("Insufficient balance!");
        } else {
          toast.error(error.reason);
        }
      })
      .finally((): void => {
        getCampaign();
        isLoading.value = false;
      });
  } else {
    notConnectedWarning();
    isLoading.value = false;
  }

  resetForm();
});
</script>
