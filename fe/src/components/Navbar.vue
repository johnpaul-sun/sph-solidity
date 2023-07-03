<template>
  <header class="shadow-sm bg-white/30 h-16 py-3 px-16">
    <nav class="flex justify-between items-center">
      <NuxtLink to="/" class="justify-center"><Logo /></NuxtLink>
      <div class="flex gap-4">
        <BaseSearch />
        <WalletButton />
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import Logo from "../components/icons/Logo.vue";
</script>
