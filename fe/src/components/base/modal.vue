<template>
  <div
    v-if="isShowModal"
    class="fixed flex w-screen h-screen justify-center items-center"
  >
    <div class="fixed h-screen w-screen top-0 left-0 bg-black opacity-50"></div>
    <div class="fixed bg-white rounded-md shadow-md w-[400px] overflow-hidden">
      <div
        class="flex justify-end items-center px-4 h-10 text-dark bg-primary-200"
      >
        <BaseButton @click="handleClose">
          <Icon name="material-symbols:close" class="h-6 w-6" />
        </BaseButton>
      </div>
      <div
        class="flex flex-col items-center p-4 space-y-4 text-primary-10 text-sm text-center"
      >
        <div>
          You need to setup and connect your wallet in order to proceed with the
          transaction.
        </div>
        <NuxtLink
          to="/help"
          class="flex w-full justify-center items-center rounded-md px-4 py-2 bg-clip-text text-sm font-bold text-transparent bg-linear-gradient-primary border border-primary-400"
          @click="handleClose"
        >
          Setup MetaMask wallet
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useWalletStore } from "~/store/wallet";

const walletStore = useWalletStore();

const { updateIsShowModal } = walletStore;
const { isShowModal } = storeToRefs(walletStore);

const handleClose = () => {
  updateIsShowModal(false);
};
</script>
