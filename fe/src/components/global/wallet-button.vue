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
      <span :title="address">{{ middleTruncate(address, 6, 3) }}</span>
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
        <NuxtLink to="/profile" class="dropdown-item">Profile</NuxtLink>
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

import { ProviderRpcError } from "~/types/ProviderRpcError";
import { useWalletStore } from "~/store/wallet";
const { middleTruncate } = useUtils();

const router = useRouter();
const isDropdownOpen = ref<boolean>(false);
const useWallet = useWalletStore();
const { updateStatus, updateIsShowModal } = useWallet;
const { isConnected, address } = storeToRefs(useWallet);

const connectWallet = async (): Promise<void> => {
  const ethereum = window.ethereum;

  if (ethereum) {
    try {
      const account = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const connection = localStorage.getItem("is-connected");

      if (!connection) {
        toast.success("Wallet connected successfully!", { autoClose: 1500 });
      }

      localStorage.setItem("is-connected", "true");
      useCookie("is-connected").value = "true";
      updateStatus(true, (account as string)[0]);
    } catch (error) {
      const processingErrorCode = -32002;

      if ((error as ProviderRpcError).code === processingErrorCode) {
        toast.error("Please unlock your MetaMask wallet!", { autoClose: 1500 });
      } else {
        toast.error("Something went wrong!", { autoClose: 1500 });
      }
    }
  } else {
    toast.info("Please install MetaMask extension.", { autoClose: 1500 });
    updateIsShowModal(true);
  }
};

const disconnectWallet = (): void => {
  updateStatus(false, "");
  useCookie("is-connected").value = null;

  toast.success("Wallet disconnected successfully!", {
    autoClose: 1500,
  });
  setTimeout(() => {
    router.push("/");
  }, 1500);
  localStorage.removeItem("is-connected");
};

if (process.client) {
  watchEffect(() => {
    const connection = localStorage.getItem("is-connected");

    if (connection) {
      connectWallet();
    }
  });
}

const copyAddress = (): void => {
  navigator.clipboard
    .writeText(address.value)
    .then(() => {
      toast.success("Address copied successfully!", { autoClose: 1500 });
    })
    .catch(() => {
      toast.error("Failed to copy address!", { autoClose: 1500 });
    });
};
</script>
