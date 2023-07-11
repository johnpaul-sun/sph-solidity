<template>
  <div
    v-if="isShowModal"
    class="fixed flex w-screen h-screen justify-center items-center -translate-y-[64px]"
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
        <slot />
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
