<script lang="ts" setup>
import type { LabelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/shared/lib/cn'
import { Label } from '@/shared/ui/additionals'
import { useFormField } from './useFormField'

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>()

const { error, formItemId } = useFormField()
</script>

<template>
  <Label
    data-slot="form-label"
    :data-error="!!error"
    :class="cn('text-gray-700 data-[error=true]:text-red-600', props.class)"
    :for="formItemId"
  >
    <slot />
  </Label>
</template>
