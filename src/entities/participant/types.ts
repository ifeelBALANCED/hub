export interface Participant {
  id: string
  name?: string
  avatar_url?: string | null
  role?: 'host' | 'guest'
  joined_at: number
  left_at?: number | null
}

export interface ParticipantEvent {
  type: 'participant_joined' | 'participant_left' | 'state_sync'
  participant?: Participant
  participantId?: string
  participants?: Participant[]
}

export interface ParticipantsState {
  participants: Participant[]
  isLoading: boolean
  error: string | null
}
