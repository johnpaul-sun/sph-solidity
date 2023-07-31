<template>
  <div class="relative flex flex-col min-h-screen">
    <Navbar class="sticky top-0 z-50 backdrop-blur-md" />
    <div
      class="bg-linear-gradient-white-to-light flex-1 flex items-center justify-center flex-col gap-4"
    >
      <h1 class="text-6xl">{{ error.statusCode }}</h1>
      <p>{{ error.statusMessage }}</p>
      <BaseButton
        class="rounded-lg border py-2 px-4 border-primary-10 text-primary-10"
        @click="handleError"
      >
        Go back home
      </BaseButton>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { NuxtError } from "nuxt/app";

defineProps<{ error: NuxtError }>();

const handleError = () => clearError({ redirect: "/" });
</script>
