<script setup lang="ts">
import { Field as VeeFormField } from 'vee-validate'

interface FormFieldProps {
  name: string
}

defineProps<FormFieldProps>()
</script>

<template>
  <VeeFormField v-bind="$attrs" :name="name" v-slot="slotProps">
    <slot v-bind="slotProps" />
  </VeeFormField>
</template>
