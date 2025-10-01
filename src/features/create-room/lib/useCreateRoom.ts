import { computed } from 'vue'
import { useCreateMeetingMeetingsPost } from '@/shared/api/client'
import { notificationService } from '@/shared/services/notification.service'

export const useCreateRoom = () => {
  const mutation = useCreateMeetingMeetingsPost({
    mutation: {
      onSuccess: (result) => {
        notificationService.success({
          title: 'Room Created Successfully',
          description: `Meeting room ${result.room_id} is ready!`,
        })
      },
      onError: (error: any) => {
        notificationService.error({
          title: 'Failed to Create Room',
          description: error instanceof Error ? error.message : 'An unknown error occurred',
        })
      },
    },
  })

  const isCreating = computed(() => mutation.isPending.value)
  const error = computed(() => mutation.error.value?.message || null)

  const createRoom = async () => {
    const result = await mutation.mutateAsync()
    return result
  }

  return {
    createRoom,
    isCreating,
    error,
    mutation,
  }
}
