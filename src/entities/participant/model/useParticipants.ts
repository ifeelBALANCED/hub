import { computed } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import type { Participant, ParticipantEvent } from '../types'
import type { MeetingResponse } from '@/shared/api/client'

export const getParticipantsQueryKey = (roomId: string) => ['participants', roomId] as const

export const useParticipants = (roomId: string, initialParticipants?: Participant[]) => {
  const queryClient = useQueryClient()

  const initialData = initialParticipants || []

  const participants = computed(() => {
    const queryData = queryClient.getQueryData(getParticipantsQueryKey(roomId))
    return (queryData as Participant[]) || initialData
  })

  const participantsCount = computed(() => participants.value.length)

  const sortedParticipants = computed(() =>
    [...participants.value].sort((a, b) => a.joined_at - b.joined_at),
  )

  const initializeFromMeeting = (meeting: MeetingResponse) => {
    if (meeting.participants && meeting.participants.length > 0) {
      const transformedParticipants = meeting.participants.map((p) => ({
        id: p.id,
        name: `User ${p.user_id}`,
        avatar_url: null,
        role: undefined,
        joined_at: p.joined_at,
        left_at: p.left_at || null,
      }))

      queryClient.setQueryData(getParticipantsQueryKey(roomId), transformedParticipants)
    }
  }

  const applyEvent = (event: ParticipantEvent) => {
    const currentParticipants = participants.value

    switch (event.type) {
      case 'participant_joined':
        if (event.participant) {
          const existingIndex = currentParticipants.findIndex((p) => p.id === event.participant!.id)
          if (existingIndex === -1) {
            const updatedParticipants = [...currentParticipants, event.participant]
            queryClient.setQueryData(getParticipantsQueryKey(roomId), updatedParticipants)
          }
        }
        break

      case 'participant_left':
        if (event.participantId) {
          const updatedParticipants = currentParticipants.filter(
            (p) => p.id !== event.participantId,
          )
          queryClient.setQueryData(getParticipantsQueryKey(roomId), updatedParticipants)
        }
        break

      case 'state_sync':
        if (event.participants) {
          queryClient.setQueryData(getParticipantsQueryKey(roomId), event.participants)
        }
        break
    }
  }

  const reset = () => {
    queryClient.setQueryData(getParticipantsQueryKey(roomId), [])
  }

  return {
    participants,
    participantsCount,
    sortedParticipants,
    initializeFromMeeting,
    applyEvent,
    reset,
  }
}
