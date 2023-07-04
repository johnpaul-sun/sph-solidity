<template>
  <div>
    <table class="table-auto mt-6">
      <thead class="border-b border-primary-10">
        <tr class="flex h-10 items-center">
          <th class="text-left px-4 w-72">Donator</th>
          <th class="text-left px-4 w-96">Campaign Title</th>
          <th class="text-left px-4 w-40">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="{ id, avatar, donator, title, amount } in donors"
          :key="id"
          class="flex items-center min-h-[56px] border-b border-disabled"
        >
          <td class="px-4 w-72">
            <div class="flex items-center space-x-2">
              <span>{{ id }}.</span>
              <img
                :src="avatar"
                alt="avatar"
                class="flex h-10 w-10 rounded-full"
              />
              <span>
                {{ middleTruncate(donator, 6, 4) }}
              </span>
            </div>
          </td>
          <td class="px-4 w-96 py-2">{{ title }}</td>
          <td class="px-4">{{ amount }} ETH</td>
        </tr>
      </tbody>
    </table>
    <div class="w-full mt-8 h-14 flex items-center justify-center">
      <BasePaginator
        :current-page="currentPage"
        :last-page="lastPage"
        :per-page="itemPerPage"
        :on-page-change="setPage"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import donors from "@/mocks/campaign-donators.json";
import { useUtils } from "~/composables/useUtils";

const { middleTruncate } = useUtils();
const currentPage = ref(1);
const itemPerPage = ref(5);
const lastPage = donors.length / itemPerPage.value;

const setPage = (first: number, page: number) => {
  currentPage.value = page;
  console.log(first);
};
</script>
