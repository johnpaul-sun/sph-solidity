<template>
  <header class="shadow-sm bg-white">
    <nav class="container m-auto py-2 px-5 flex justify-between items-center">
      <NuxtLink to="/" class="justify-center"><Logo /></NuxtLink>
      <div class="flex gap-4">
        <BaseSearch />
        <WalletButton :connected="connected" :address="accountAddress" />
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import Logo from "../components/icons/Logo.vue";
const connected = true;
const accountAddress = "0x012345678910"; // placeholder address
</script>
