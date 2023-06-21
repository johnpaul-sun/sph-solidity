<template>
  <div class="flex h-full w-full">
    <div class="w-1/2">
      <img
        src="../assets/img/be-the-change.jpg"
        alt="Be the Change"
        class="object-cover w-full h-full"
      />
    </div>
    <div
      class="flex justify-center items-center flex-col w-1/2 bg-gradient-to-b from-white to-light"
    >
      <form
        class="flex flex-col w-full p-16 space-y-16"
        @submit.prevent="onSubmit"
      >
        <div class="text-2xl text-dark font-bold">START A NEW CAMPAIGN</div>
        <div class="space-y-4">
          <BaseInput
            id="fullname"
            v-model="fullname"
            label="Full name"
            name="fullname"
            placeholder="Enter your full name"
            :error="errors.fullname"
          />
          <BaseInput
            id="campaign-name"
            v-model="campaign"
            label="Campaign name"
            name="campaign-name"
            placeholder="Enter a title"
            :error="errors.campaign"
          />
          <BaseTextArea
            id="story"
            v-model="story"
            label="Story"
            name="story"
            placeholder="Write your story..."
            :error="errors.story"
          />
          <FileUpload />
          <div class="flex w-full space-x-4">
            <BaseInput
              id="goal"
              v-model="goal"
              label="Goal"
              name="goal"
              placeholder="0.123 DCAPP"
              :error="errors.goal"
              type="number"
              step="any"
            />
            <BaseInput
              id="date"
              v-model="date"
              label="Date"
              name="date"
              type="date"
              :error="errors.date"
            />
          </div>
        </div>
        <BaseButton
          class="flex w-fit items-center justify-center text-sm uppercase btn-gradient"
        >
          Submit Application
        </BaseButton>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import {
  CreateCampaignRequest,
  CreateCampaignRequestSchema
} from "../schemas/create-campaign";

const validationSchema = toTypedSchema(CreateCampaignRequestSchema);

const { handleSubmit, resetForm, values, errors } = useForm({
  validationSchema
});

const { value: fullname } =
  useField<CreateCampaignRequest["fullname"]>("fullname");
const { value: campaign } =
  useField<CreateCampaignRequest["campaign"]>("campaign");
const { value: story } = useField<CreateCampaignRequest["story"]>("story");
const { value: goal } = useField<CreateCampaignRequest["goal"]>("goal");
const { value: date } = useField<CreateCampaignRequest["date"]>("date");

const onSubmit = handleSubmit(() => {
  console.log(values);
  resetForm();
});
</script>
