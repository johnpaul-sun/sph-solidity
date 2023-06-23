<!-- eslint-disable import/namespace -->
<template>
  <div
    class="relative"
    @mouseover="isDropdownOpen = true"
    @mouseleave="isDropdownOpen = false"
  >
    <button
      v-if="isConnected"
      class="flex gap-4 justify-center items-center btn-gradient h-full px-3 w-56"
    >
      <Icon name="solar:wallet-linear" size="40" />
      <span class="truncate" :title="address">{{
        truncateAddress(address, 6, 3)
      }}</span>
      <Icon v-show="isDropdownOpen" name="ps:down" size="20" />
      <Icon v-show="!isDropdownOpen" name="ps:up" size="20" />
    </button>
    <button v-else class="btn-gradient h-full p-2 w-56" @click="connectWallet">
      Connect Wallet
    </button>
    <div
      class="absolute pt-3 right-0"
      :hidden="!isDropdownOpen || !isConnected"
      @mouseover="isDropdownOpen = true"
      @mouseleave="isDropdownOpen = false"
    >
      <div
        class="flex flex-col text-base text-dark text-left rounded-md w-44 divide-y divide-disabled divide border border-disabled bg-white"
      >
        <BaseButton class="dropdown-item rounded-t-md" @click="copyAddress"
          >Copy Address</BaseButton
        >
        <BaseButton class="dropdown-item">Profile</BaseButton>
        <BaseButton class="dropdown-item rounded-b-md" @click="disconnectWallet"
          >Disconnect</BaseButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { toast } from "vue3-toastify";

import { useWalletStore } from "~/store/wallet";

const isDropdownOpen = ref<boolean>(false);
const useWallet: any = useWalletStore();
const { updateStatus } = useWallet;
const { isConnected, address } = storeToRefs(useWallet);

const connectWallet = async () => {
  const ethereum = (window as any).ethereum;

  if (ethereum) {
    try {
      const account = await ethereum.request({
        method: "eth_requestAccounts"
      });
      const connection = localStorage.getItem("isConnected");

      if (!connection) {
        toast.success("Wallet connected successfully!", { autoClose: 1500 });
      }

      localStorage.setItem("isConnected", "true");
      updateStatus(true, account[0]);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", { autoClose: 1500 });
    }
  } else {
    toast.info("Please install MetaMask extension.", { autoClose: 1500 });
  }
};

const disconnectWallet = () => {
  updateStatus(false);
  localStorage.removeItem("isConnected");
};

if (process.client) {
  watchEffect(() => {
    const connection = localStorage.getItem("isConnected");

    if (connection) {
      connectWallet();
    }
  });
}

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

const copyAddress = () => {
  navigator.clipboard
    .writeText(address.value)
    .then(() => {
      toast.success("Address copied successfully!", { autoClose: 1500 });
    })
    .catch((error) => {
      console.error("Failed to copy address:", error);
      toast.error("Failed to copy address!", { autoClose: 1500 });
    });
};
</script>
