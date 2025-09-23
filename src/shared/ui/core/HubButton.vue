<script setup lang="ts">
import { Primitive } from 'radix-vue'
import { cva } from 'class-variance-authority'
import { cn } from '@/shared/lib/cn'

const hubButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-border bg-transparent hover:bg-muted text-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-muted text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        hero: 'bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-sharp hover:scale-[1.02] transition-all duration-200',
        control:
          'bg-background-secondary border border-border text-foreground hover:bg-background-tertiary hover:border-accent/50 transition-all duration-200',
        danger:
          'bg-destructive/10 border border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200',
        success:
          'bg-success/10 border border-success/30 text-success hover:bg-success hover:text-success-foreground transition-all duration-200',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10 rounded-full',
        'icon-sm': 'h-8 w-8 rounded-full',
        'icon-lg': 'h-12 w-12 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface HubButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'hero'
    | 'control'
    | 'danger'
    | 'success'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
  asChild?: boolean
}

const props = withDefaults(defineProps<HubButtonProps>(), {
  variant: 'default',
  size: 'default',
})

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <Primitive
    :as="asChild ? 'template' : 'button'"
    :as-child="asChild"
    :class="cn(hubButtonVariants({ variant, size }), $attrs.class as string)"
    v-bind="$attrs"
  >
    <slot />
  </Primitive>
</template>
