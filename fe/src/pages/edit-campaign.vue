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
          src="../assets/img/be-the-change.jpg"
          class="w-full h-full object-cover"
        />
        <BaseButton
          class="absolute bottom-0 right-0 -translate-x-4 -translate-y-4 flex items-center h-7 px-4 py-2 text-xs text-dark bg-white opacity-50 rounded-md"
          >Edit</BaseButton
        >
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
        <BaseButton class="btn-gradient w-fit">UPDATE CAMPAIGN</BaseButton>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  CreateCampaignRequestSchema,
  CreateCampaignRequest,
} from "../schemas/create-campaign";

const validationSchema = toTypedSchema(CreateCampaignRequestSchema);
const router = useRouter();

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

const handleChange = (e: InputEvent) => {
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
const { value: goal } = useField<CreateCampaignRequest["goal"]>("goal");
const { value: date } = useField<CreateCampaignRequest["date"]>("date");

const handleBack = () => {
  router.back();
};

const onSubmit = handleSubmit(() => {
  console.log(values);

  resetForm();
});
</script>
