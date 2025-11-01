<script setup lang="ts">
import { NFormItem, NInput, NSelect, NColorPicker, NCheckbox, NRate } from "naive-ui";

interface Props {
  label: string;
  path: string;
  type?: 'input' | 'select' | 'color' | 'checkbox' | 'rate';
  modelValue: any;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  required?: boolean;
}

withDefaults(defineProps<Props>(), {
  type: 'input',
  required: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();

const updateValue = (value: any) => {
  emit('update:modelValue', value);
};
</script>

<template>
  <NFormItem :label="label" :path="path">
    <NInput
      v-if="type === 'input'"
      :value="modelValue"
      @update:value="updateValue"
      :placeholder="placeholder"
    />
    
    <NSelect
      v-else-if="type === 'select'"
      :value="modelValue"
      @update:value="updateValue"
      :options="options"
      :placeholder="placeholder"
    />
    
    <NColorPicker
      v-else-if="type === 'color'"
      :value="modelValue"
      @update:value="updateValue"
      :show-alpha="false"
    />
    
    <NCheckbox
      v-else-if="type === 'checkbox'"
      :checked="modelValue"
      @update:checked="updateValue"
    >
      {{ placeholder }}
    </NCheckbox>
    
    <NRate
      v-else-if="type === 'rate'"
      :value="modelValue"
      @update:value="updateValue"
      :allow-half="true"
    />
  </NFormItem>
</template>