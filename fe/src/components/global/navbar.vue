<template>
  <header class="shadow-sm bg-white/30 h-16 py-3 px-16">
    <nav class="flex justify-between items-center">
      <NuxtLink to="/" class="justify-center"><IconsLogo /></NuxtLink>
      <div class="flex items-center gap-4">
        <BaseButton @click="handleHelp">
          <Icon
            name="heroicons:question-mark-circle"
            class="h-6 w-6 text-disabled"
          />
        </BaseButton>
        <BaseSearchBar
          :search-default="router.currentRoute.value.query.search"
          @on-sumbit="handleSearch"
        />
        <WalletButton />
      </div>
    </nav>
  </header>
</template>
<script setup lang="ts">
const router = useRouter();

const handleHelp = () => {
  router.push("/help");
};

const handleSearch = (searchKey: string) => {
  router.push(`campaigns${searchKey ? `?search=${searchKey}` : ""}`);
};
</script>
