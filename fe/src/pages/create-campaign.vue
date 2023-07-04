<template>
  <div class="flex flex-grow">
    <div class="w-1/2 sm:flex hidden">
      <img
        src="../assets/img/be-the-change.jpg"
        alt="Be the Change"
        class="object-cover h-full"
      />
    </div>
    <div
      class="flex flex-grow justify-center items-center bg-linear-gradient-white-to-light"
    >
      <form
        class="flex flex-col w-full p-16 space-y-16"
        @submit.prevent="onSubmit"
      >
        <div class="text-2xl text-dark font-bold">START A NEW CAMPAIGN</div>
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
          <BaseFileUpload />
          <div class="flex w-full space-x-4">
            <BaseInput
              id="goal"
              label="Goal"
              name="goal"
              placeholder="0.123 DCAPP"
              :error="errors.goal"
              type="number"
              step="any"
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
          v-if="isConnected"
          class="flex w-fit items-center justify-center text-sm uppercase"
          :class="
            isLoading
              ? 'bg-disabled h-10 px-4 rounded-[6px] text-white'
              : 'btn-gradient'
          "
          :disabled="isLoading"
        >
          Submit Application
        </BaseButton>
        <div
          v-else
          class="flex w-fit items-center justify-center text-sm uppercase btn-gradient cursor-pointer"
          @click="warning"
        >
          Submit Application
        </div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { toast } from "vue3-toastify";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { ethers } from "ethers";
import {
  CreateCampaignRequest,
  CreateCampaignRequestSchema,
} from "../schemas/create-campaign";
import { useWalletStore } from "~/store/wallet";

const validationSchema = toTypedSchema(CreateCampaignRequestSchema);
const { $getSmartContract: getSmartContract } = useNuxtApp();

const {
  handleSubmit,
  resetForm,
  values,
  errors,
  setFieldValue,
  validateField,
} = useForm({
  validationSchema,
});

const handleChange = (e: any) => {
  const { name, value, type } = e.target;

  if (type === "number") {
    setFieldValue(name, parseFloat(value));
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
const { value: goal } = useField<CreateCampaignRequest["goal"]>("goal");
const { value: date } = useField<CreateCampaignRequest["date"]>("date");

const isLoading = ref<boolean>(false);
const useWallet: any = useWalletStore();
const { isConnected } = storeToRefs(useWallet);

const warning = () => {
  toast.info("Connect wallet first!", { autoClose: 1500 });
};

const onSubmit = handleSubmit(async () => {
  isLoading.value = true;
  const deadline = new Date(values.date as string);

  // adjust date to handle time difference for epoch timestamp
  const offset = deadline.getTimezoneOffset();
  deadline.setMinutes(deadline.getMinutes() + offset);

  const smartContract = await getSmartContract();
  if (smartContract !== null) {
    smartContract
      .createCampaign(
        values.fullname,
        values.campaign,
        values.story,
        ethers.parseEther((values.goal as number).toString()),
        deadline.getTime() / 1000, // convert from milliseconds to secsonds
      )
      .then(() => {
        resetForm();
        toast.info("Campaign creation in progress!");
      })
      .catch((error) => {
        if (error.reason === "rejected") {
          toast.error("Campaign rejected!");
        } else {
          toast.error(error.reason);
        }
      })
      .finally(() => {
        isLoading.value = false;
      });
  } else {
    warning();
    isLoading.value = false;
  }
});
</script>
