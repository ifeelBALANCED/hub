import { toast } from 'vue-sonner'
import { TOAST_DURATION } from '../lib/constants'

export interface NotificationConfig {
  title: string
  description?: string
  duration?: number
}

export const notificationService = {
  success(options: NotificationConfig): void {
    toast.success(options.title, {
      description: options.description,
      duration: options.duration ?? TOAST_DURATION.MEDIUM,
    })
  },

  error(options: NotificationConfig): void {
    toast.error(options.title, {
      description: options.description,
      duration: options.duration ?? TOAST_DURATION.LONG,
    })
  },

  info(options: NotificationConfig): void {
    toast.info(options.title, {
      description: options.description,
      duration: options.duration ?? TOAST_DURATION.MEDIUM,
    })
  },

  warning(options: NotificationConfig): void {
    toast.warning(options.title, {
      description: options.description,
      duration: options.duration ?? TOAST_DURATION.MEDIUM,
    })
  },
}
