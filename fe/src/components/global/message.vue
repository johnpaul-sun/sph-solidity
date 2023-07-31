<template>
  <div class="flex-1 mt-6 h-14 flex items-center justify-center flex-col gap-4">
    <p>{{ message }}</p>
    <BaseButton
      class="rounded-lg border py-2 px-4 border-primary-10 text-primary-10"
      @click="handleRedirect('/')"
    >
      Go back home
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
type Props = {
  message: string;
};

const props = defineProps<Props>();

const { message } = toRefs(props);

const router = useRouter();

const handleRedirect = (to: string) => {
  router.push({ path: to });
};
</script>
