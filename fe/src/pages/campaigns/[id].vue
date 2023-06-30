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
        <DetailCard label="Days left" :content="daysLeft" />
        <DetailCard label="Donations" :content="`${donations} DCAPP`" />
        <DetailCard label="Total backers" :content="totalBackers" />
      </div>
    </div>

    <div class="bg-white p-4 flex gap-6 sm:flex-col lg:flex-row">
      <div class="flex flex-col gap-6 sm:w-full lg:w-[654px] xl:w-full">
        <div>
          <p class="label">Title: {{ title }}</p>
        </div>
        <div class="group flex-col">
          <p class="label">Creator:</p>
          <div class="group">
            <div class="w-[60px] h-[60px]">
              <img
                :src="creator.imgSrc"
                alt="avatar"
                class="object-cover rounded-full"
              />
            </div>
            <div
              class="flex flex-col gap-1 px-4 py-1 max-w-[196px] overflow-clip"
            >
              <p class="font-bold">
                {{ middleTruncate(creator.address, 8, 5) }}
              </p>
              <p class="text-disabled">
                {{ creator.totalCampaigns }} campaigns
              </p>
            </div>
          </div>
        </div>
        <div class="group flex-col">
          <p class="label">Story</p>
          <div class="text-sm text-disabled">{{ story }}</div>
        </div>
        <div class="group flex-col w-[345px]">
          <p class="label">Donators</p>
          <ol>
            <div
              v-for="donator in donators"
              :key="donator.address"
              class="flex justify-between text-sm"
            >
              <li class="text-disabled">
                <span class="text-dark">
                  {{ middleTruncate(donator.address, 8, 5) }}
                </span>
              </li>
              <span class="text-primary-10">
                {{ donator.amount }}
                <span class="font-bold"> ETH</span>
              </span>
            </div>
          </ol>
        </div>
      </div>
      <div class="flex flex-col gap-6 sm:w-full lg:w-[396px] xl:min-w-[396px]">
        <p class="label">Fund</p>
        <form
          class="bg-primary-100 p-4 flex flex-col gap-2 rounded-md"
          @submit.prevent="onSubmit"
        >
          <p class="w-full font-bold text-dark text-md text-center">
            Fund the campaign
          </p>
          <BaseInput
            id="amount"
            name="amount"
            placeholder="0.123 ETH"
            :error="errors.amount"
            :model-value="amount"
            @change="handleChange"
          />
          <div class="flex flex-col gap-4 p-4 mb-4 rounded-md bg-primary-50">
            <p class="font-bold text-dark text-sm">
              Back it because you believe in it.
            </p>
            <p class="text-sm text-primary-10">
              Supporting a project for no reward, just because it speaks to you.
            </p>
          </div>
          <button type="submit" class="btn-gradient-hr">Fund Campaign</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import CampaignProps from "~/types/CampaignProps";
import CampaignSample from "~/mocks/campaign-sample.json";
import {
  FundCampaignRequest,
  FundCampaignRequestSchema,
} from "~/schemas/fund-campaign";

const campaignValueSample = ref<CampaignProps>(CampaignSample);
const { middleTruncate } = useUtils();

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

const validationSchema = toTypedSchema(FundCampaignRequestSchema);

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
  const { name, value } = e.target;

  setFieldValue(name, parseFloat(value));

  validateField(e.target.name);
};

const { value: amount } = useField<FundCampaignRequest["amount"]>("amount");

const onSubmit = handleSubmit(() => {
  console.log(values);
  resetForm();
});
</script>

<style lang="postcss" scoped>
.label {
  @apply font-bold text-dark uppercase;
}
.group {
  @apply flex gap-2;
}

ol li {
  display: list-item;
  list-style-type: decimal;
  list-style-position: inside;
}
</style>
