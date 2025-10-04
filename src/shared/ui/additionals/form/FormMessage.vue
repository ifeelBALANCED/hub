<script lang="ts" setup>
import { toValue, type HTMLAttributes } from 'vue'
import { ErrorMessage } from 'vee-validate'
import { cn } from '@/shared/lib/cn'
import { useFormField } from './useFormField'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { name, formMessageId } = useFormField()
</script>

<template>
  <ErrorMessage
    :id="formMessageId"
    data-slot="form-message"
    as="p"
    :name="toValue(name)"
    :class="cn('text-red-600 text-sm font-medium', props.class)"
  />
</template>
