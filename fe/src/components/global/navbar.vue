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
        <BaseSearchBar :search-default="search" @on-submit="handleSearch" />
        <WalletButton />
      </div>
    </nav>
  </header>
</template>
<script setup lang="ts">
const router = useRouter();
const search = ref<string>(
  router.currentRoute.value.query.search?.toString() ?? "",
);

const handleHelp = () => {
  router.push("/help");
};

const handleSearch = (searchKey: string) => {
  router.push(`/campaigns${searchKey ? `?search=${searchKey}` : ""}`);
};

watch(
  () => router.currentRoute.value.query.search,
  (value) => {
    search.value = value?.toString() ?? "";
  },
);
</script>
