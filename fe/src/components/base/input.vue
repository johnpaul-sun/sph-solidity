<template>
  <div class="flex flex-col w-full space-y-1">
    <label :for="name" class="flex items-center text-sm font-bold text-dark"
      >{{ label }}
    </label>
    <input
      :id="id"
      v-model="modelValue"
      :value="modelValue"
      :name="name"
      :placeholder="placeholder"
      :type="type"
      :step="step"
      :class="{
        'outline outline-danger outline-1': error,
        'cursor-not-allowed': disabled,
      }"
      class="w-full text-sm px-2 h-10 rounded border border-disabled focus:outline-none placeholder-disabled"
      min="0"
      :disabled="disabled"
    />
    <span class="h-4 text-red-500 text-xs font-light"> {{ error }} </span>
  </div>
</template>

<script setup lang="ts">
type Props = {
  id: string;
  name: string;
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  type?: string;
  error?: string;
  step?: string;
  disabled: boolean;
};

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const modelValue = useVModel(props, "modelValue", emit);
</script>
