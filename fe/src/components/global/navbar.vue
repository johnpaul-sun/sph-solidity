<template>
  <header class="shadow-sm bg-white/30 h-16 py-3 px-16">
    <nav class="flex justify-between items-center">
      <NuxtLink to="/" class="justify-center"><IconsLogo /></NuxtLink>
      <div class="flex gap-4">
        <BaseSearchBar />
        <WalletButton />
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts"></script>
