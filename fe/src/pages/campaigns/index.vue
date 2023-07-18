<template>
  <div class="bg-primary-50">
    <div class="max-w-[960px] mx-auto py-6">
      <div
        class="bg-gradient text-transparent bg-clip-text text-2xl font-bold leading-[125%]"
      >
        All Campaigns
      </div>
      <div class="mt-6 flex justify-between items-center">
        <div>
          <p v-if="search" class="text-sm text-disabled leading-[150%]">
            filtered by keyword:
            <span class="text-primary-10">{{ search }}</span>
          </p>
        </div>
        <BaseViewToggle :type="viewType" @change-type="changeViewType" />
      </div>
      <div
        v-if="viewType === 'cards'"
        class="mt-6 grid grid-cols-3 gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
      >
        <CampaignCard
          v-for="(
            { title, description, ethValue, imgSrc, daysLeft }, i
          ) in cardValueSamples"
          :key="i"
          :title="title"
          :description="description"
          :eth-value="ethValue"
          :img-src="imgSrc"
          :days-left="daysLeft"
        />
      </div>
      <div v-else-if="viewType === 'table'">
        <table class="table-auto mt-6 w-full">
          <thead class="border-b border-primary-10">
            <tr class="h-10 items-center">
              <th class="text-center px-4 text-primary-500 w-1/12">#</th>
              <th class="text-left px-4 w-3/12">Creator ID</th>
              <th class="text-left px-4 flex-1 w-6/12">Campaign Title</th>
              <th class="text-left px-4 w-2/12">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="({ id, campaignId, title, amount }, index) in donations"
              :key="id"
              w
              class="items-center h-14 min-h-[56px] border-b border-disabled"
            >
              <td class="min-w-[56px] px-4 text-center bg-primary-200">
                {{ index + 1 }}
              </td>
              <td class="px-4 py-2">
                <div class="flex items-center space-x-2">
                  <span>
                    {{ middleTruncate(campaignId, 6, 4) }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-2">{{ title }}</td>
              <td class="px-4 w-40">{{ amount }} ETH</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="w-full mt-6 h-14 flex items-center justify-center">
        <BaseButton
          class="rounded-lg border-primary-10 font-bold text-sm border px-4 py-2 h-10"
        >
          Load more campaigns
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import donations from "~/mocks/campaign-donations.json";
import CampaignCardProps from "~/types/CampaignCardProps";
import CardArray from "~/mocks/campaing-card-array-sample.json";
import ViewToggleType from "@/types/ViewToggleType";

const route = useRoute();
const { middleTruncate } = useUtils();
const viewType = ref<ViewToggleType>("cards");
const cardValueSamples = ref<CampaignCardProps[]>(CardArray);
const {
  query: { search },
} = route;

const changeViewType = (type: ViewToggleType): void => {
  viewType.value = type;
};
</script>
