<template>
  <div class="flex flex-col gap-6 sm:w-full lg:w-full">
    <div class="flex items-center">
      <p class="label">Title: {{ title }}</p>
      <Icon
        v-show="canEdit"
        class="ml-4 cursor-pointer"
        name="heroicons-solid:pencil-square"
        size="16"
        @click="editCampaign"
      />
    </div>
    <div class="group flex-col">
      <p class="label">Creator:</p>
      <div class="group">
        <UserAvatar :img-src="creator.imgSrc" :width="60" :height="60" />
        <div class="flex flex-col gap-1 px-4 py-1 max-w-[196px] overflow-clip">
          <p class="font-bold">
            {{ middleTruncate(creator.address, 8, 5) }}
          </p>
          <p class="text-disabled">{{ creator.fullName }}</p>
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
          v-for="donation in donations"
          :key="donation.donationId"
          class="flex justify-between text-sm"
        >
          <li class="text-disabled">
            <span class="text-dark">
              {{ middleTruncate(donation.address, 8, 5) }}
            </span>
          </li>
          <span class="text-primary-10">
            {{ donation.amount }}
            <span class="font-bold"> ETH</span>
          </span>
        </div>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Donation, Creator } from "~/types/Campaign";
type Props = {
  id: number;
  title: string;
  creator: Creator;
  story: string;
  donations: Donation[];
  canEdit: boolean;
};

const campaignContentProps = defineProps<Props>();
const { id, title, creator, story, donations, canEdit } =
  toRefs(campaignContentProps);

const router = useRouter();

const editCampaign = (): void => {
  router.push(`/edit-campaign/${id.value}`);
};

const { middleTruncate } = useUtils();
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
