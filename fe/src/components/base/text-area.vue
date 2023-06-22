<template>
  <div class="flex flex-col space-y-1">
    <label :for="name" class="flex items-center text-sm font-bold text-dark">
      {{ label }}
    </label>
    <textarea
      :id="id"
      v-model="modelValue"
      :name="name"
      :placeholder="placeholder"
      type="text"
      rows="5"
      :class="{
        'outline outline-danger outline-1': error
      }"
      class="w-full text-sm p-2 h-32 max-h-32 overflow-y-auto rounded border border-disabled focus:outline-none placeholder-disabled"
    />
    <span class="h-4 text-red-500 text-xs font-light"> {{ error }} </span>
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
