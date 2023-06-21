<template>
  <div class="space-y-1">
    <label :for="name" class="text-sm font-bold text-dark">
      {{ label }}
    </label>
    <textarea
      :id="id"
      v-model="modelValue"
      :name="name"
      :placeholder="placeholder"
      type="text"
      rows="5"
      class="w-full text-sm p-2 max-h-40 overflow-y-auto rounded border border-disabled focus:outline-none placeholder-disabled"
    />
    <span v-if="error" class="flex pt-2 text-red-500 text-xs">
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
type Props = {
  id: string;
  name: string;
  label?: string;
  modelValue?: any;
  placeholder?: string;
  error?: string;
};

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const modelValue = useVModel(props, "modelValue", emit);
</script>
