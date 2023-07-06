<template>
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
      <BaseButton
        type="submit"
        :class="
          isLoading
            ? 'bg-disabled h-9 px-4 rounded-[6px] text-white'
            : 'btn-gradient-hr'
        "
        :disabled="isLoading"
      >
        Fund Campaign
      </BaseButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import { toast } from "vue3-toastify";
import {
  FundCampaignRequest,
  FundCampaignRequestSchema,
} from "~/schemas/fund-campaign";
import CampaignFundFormProps from "~/types/CampaignFundFormProps";

const campaignFundFormProps = defineProps<CampaignFundFormProps>();
const emit = defineEmits(["fund-campaign"]);

const { isLoading, isConnected } = toRefs(campaignFundFormProps);

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

const warning = () => {
  toast.info("Connect wallet first!", { autoClose: 1500 });
};

const { value: amount } = useField<FundCampaignRequest["amount"]>("amount");

const onSubmit = handleSubmit(() => {
  if (isConnected.value) {
    emit("fund-campaign", values.amount);
    resetForm();
  } else {
    warning();
  }
});
</script>

<style lang="postcss" scoped>
.label {
  @apply font-bold text-dark uppercase;
}
</style>
