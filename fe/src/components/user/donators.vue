<template>
  <table class="table-auto mt-6 w-full">
    <thead class="border-b border-primary-10">
      <tr class="h-10 items-center">
        <th class="text-center text-primary-500">#</th>
        <th class="text-left px-4 w-72">Donator</th>
        <th class="text-left px-4 flex-1">Campaign Title</th>
        <th class="text-left px-4 w-40">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(
          { donator, campaignTitle, donationAmount }, index
        ) in donatorsData.donatorsList"
        :key="index"
        class="items-center min-h-[56px] border-b border-disabled"
      >
        <td class="w-[56px] text-center bg-primary-200">
          {{ index + 1 }}
        </td>
        <td class="px-4 py-2">
          <div class="flex items-center space-x-2">
            <UserAvatar
              :img-src="getAvatarUrl(donator)"
              :height="40"
              :width="40"
            />
            <span>
              {{ middleTruncate(donator, 6, 4) }}
            </span>
          </div>
        </td>
        <td class="px-4 py-2">{{ campaignTitle }}</td>
        <td class="px-4 w-40">{{ formatEther(donationAmount) }} ETH</td>
      </tr>
    </tbody>
  </table>
  <div class="mt-8 h-14 flex items-center justify-center">
    <BasePaginator
      :current-page="currentPage"
      :last-page="lastPage"
      :items-per-page="itemsPerPage"
      :on-page-change="setPage"
    />
  </div>
</template>
<script setup lang="ts">
import { formatEther } from "ethers";
import { useUtils } from "~/composables/useUtils";

import DonatorsData from "~/types/DonatorsData";

const props = defineProps<{
  donatorsData: DonatorsData;
  callNewData: (currentPage: number) => void;
}>();

const { donatorsData } = toRefs(props);

const { middleTruncate, getAvatarUrl } = useUtils();
const currentPage = ref(1);
const itemsPerPage = ref(5);
const lastPage = ref(donatorsData.value.totalPages);

const setPage = (_itemsPerPage: number, pageNumber: number): void => {
  currentPage.value = pageNumber;
  props.callNewData(currentPage.value);
};
</script>
