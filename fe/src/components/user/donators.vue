<template>
  <table class="table-auto mt-6">
    <thead class="border-b border-primary-10">
      <tr class="h-10 items-center">
        <th class="text-center px-4 text-primary-500">#</th>
        <th class="text-left px-4 w-72">Donator</th>
        <th class="text-left px-4 flex-1">Campaign Title</th>
        <th class="text-left px-4 w-40">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="({ id, avatar, donator, title, amount }, index) in donors"
        :key="id"
        class="items-center min-h-[56px] border-b border-disabled"
      >
        <td class="px-4 text-center bg-primary-200">
          {{ index + 1 }}
        </td>
        <td class="px-4 py-2">
          <div class="flex items-center space-x-2">
            <!-- <span class="w-8">{{ index + 1 }}.</span> -->
            <UserAvatar :img-src="avatar" :height="40" :width="40" />
            <span>
              {{ middleTruncate(donator, 6, 4) }}
            </span>
          </div>
        </td>
        <td class="px-4 py-2">{{ title }}</td>
        <td class="px-4 w-40">{{ amount }} ETH</td>
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
import donors from "@/mocks/campaign-donators.json";
import { useUtils } from "~/composables/useUtils";

const { middleTruncate } = useUtils();
const currentPage = ref(1);
const itemsPerPage = ref(5);
const lastPage = donors.length / itemsPerPage.value;

const setPage = (_itemsPerPage: number, pageNumber: number): void => {
  currentPage.value = pageNumber;
};
</script>
