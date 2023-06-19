<template>
  <div
    class="relative"
    @mouseover="isDropdownOpen = true"
    @mouseleave="isDropdownOpen = false"
  >
    <button
      v-if="connected"
      class="flex gap-4 justify-center items-center btn-gradient h-full px-3 w-56"
    >
      <Icon name="solar:wallet-linear" size="40" />
      <span class="truncate" :title="address">{{
        truncateAddress(address, 6, 3)
      }}</span>
      <Icon v-if="isDropdownOpen" name="ps:down" size="20" />
      <Icon v-else name="ps:up" size="20" />
    </button>
    <button v-else class="btn-gradient h-full p-2 w-56">Connect Wallet</button>
    <div
      v-if="isDropdownOpen && connected"
      class="absolute pt-3 right-0"
      @mouseover="isDropdownOpen = true"
      @mouseleave="isDropdownOpen = false"
    >
      <div
        class="flex flex-col text-base text-dark text-left rounded-md w-44 divide-y divide-disabled divide border border-disabled bg-white"
      >
        <BaseButton class="dropdown-item rounded-t-md">Copy Address</BaseButton>
        <BaseButton class="dropdown-item">Profile</BaseButton>
        <BaseButton class="dropdown-item rounded-b-md">Disconnect</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  connected: boolean;
  address: string;
}
const props = defineProps<Props>();
const { connected, address } = toRefs(props);
const isDropdownOpen = ref<boolean>(false);

const truncateAddress = (
  address: string,
  startLength: number,
  endLength: number
) => {
  if (address.length <= startLength + endLength) {
    return address;
  }
  const start = address.substr(0, startLength);
  const end = address.substr(address.length - endLength);
  return start + "..." + end;
};
</script>
