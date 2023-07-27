<template>
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
        v-for="(
          { campaignId, title, totalDonation, creator }, index
        ) in campaigns"
        :key="campaignId"
        w
        class="items-center h-14 min-h-[56px] border-b border-disabled hover:cursor-pointer"
        @click="handleRedirect(`campaigns/${String(campaignId)}`)"
      >
        <td class="min-w-[56px] px-4 text-center bg-primary-200">
          {{ index + 1 }}
        </td>

        <td class="px-4 py-2">
          <div class="flex items-center space-x-2">
            <UserAvatar :img-src="creator.imageUrl" :height="40" :width="40" />
            <span>
              {{ middleTruncate(creator.address, 6, 4) }}
            </span>
          </div>
        </td>
        <td class="px-4 py-2">{{ title }}</td>
        <td class="px-4 w-40">{{ totalDonation }} ETH</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import Campaign from "~/types/Campaign";

const router = useRouter();

type Props = {
  campaigns: Campaign[];
};

const tableViewProps = defineProps<Props>();
const { campaigns } = toRefs(tableViewProps);

const { middleTruncate } = useUtils();

const handleRedirect = (to: string) => {
  router.push({ path: to });
};
</script>
