<template>
  <div class="flex flex-col w-full space-y-1">
    <label :for="name" class="text-sm font-bold text-dark">{{ label }}</label>
    <input
      :id="id"
      v-model="modelValue"
      :value="modelValue"
      :name="name"
      :placeholder="placeholder"
      :type="type"
      :step="step"
      :class="{ 'text-disabled': !modelValue }"
      class="w-full text-sm px-2 h-10 rounded border border-disabled focus:outline-none"
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
  modelValue?: any;
  label?: string;
  placeholder?: string;
  type?: string;
  error?: string;
  step?: string;
};

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const modelValue = useVModel(props, "modelValue", emit);
</script>
