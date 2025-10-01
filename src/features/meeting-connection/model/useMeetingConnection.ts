import { ref, computed, watch, onUnmounted } from 'vue'
import { useWebSocket } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { createWebSocketBackoff } from '@/shared/lib/wsBackoff'
import { WebSocketUtils } from '@/shared/services/auth.service'
import { appEnv } from '@/shared/lib/config'
import { useParticipants, type ParticipantEvent } from '@/entities/participant'

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export const useMeetingConnection = () => {
  const route = useRoute()
  const roomId = computed(() => route.params.roomId as string)
  const participants = useParticipants(roomId.value)

  const wsUrl = computed(() => {
    const wsBaseUrl = WebSocketUtils.getWebSocketUrl(appEnv.BACKEND_URL)
    return `${wsBaseUrl}/meeting/${roomId.value}`
  })

  const backoff = createWebSocketBackoff({
    maxRetries: 10,
    baseDelay: 1000,
    maxDelay: 30000,
  })

  const {
    status: wsStatus,
    data: wsData,
    send: wsSend,
    open: wsOpen,
    close: wsClose,
  } = useWebSocket(wsUrl, {
    immediate: WebSocketUtils.isAuthenticated(),
    autoReconnect: false,
    protocols: [],
    heartbeat: {
      message: JSON.stringify({ type: 'ping' }),
      interval: 30000,
    },
  })

  const connectionStatus = computed<ConnectionStatus>(() => {
    switch (wsStatus.value) {
      case 'CONNECTING':
        return 'connecting'
      case 'OPEN':
        return 'connected'
      case 'CLOSED':
        return 'disconnected'
      default:
        return 'error'
    }
  })

  const error = ref<string | null>(null)
  const reconnectAttempt = ref(0)

  const handleMessage = (event: MessageEvent) => {
    try {
      const data: ParticipantEvent = JSON.parse(event.data)
      participants.applyEvent(data)

      if (data.type === 'state_sync') {
        error.value = null
      }
    } catch {
      error.value = 'Invalid message format received'
    }
  }

  const handleError = (_event: Event) => {
    if (!WebSocketUtils.isAuthenticated()) {
      error.value = 'Authentication required - please log in to connect to the meeting'
    } else {
      error.value = 'Connection failed - check your internet connection'
    }

    backoff.scheduleRetry(() => {
      reconnectAttempt.value++
      wsOpen()
    })
  }

  const handleClose = (event: CloseEvent) => {
    if (event.wasClean) {
      // Clean close - do nothing
    } else {
      if (!WebSocketUtils.isAuthenticated()) {
        error.value = 'Connection closed - authentication may have expired'
      } else {
        error.value = 'Connection lost - attempting to reconnect...'
      }

      backoff.scheduleRetry(() => {
        reconnectAttempt.value++
        wsOpen()
      })
    }
  }

  watch(roomId, (newRoomId, oldRoomId) => {
    if (newRoomId !== oldRoomId) {
      backoff.reset()
      reconnectAttempt.value = 0
      error.value = null

      wsClose()
    }
  })

  watch(
    () => WebSocketUtils.isAuthenticated(),
    (isAuthenticated) => {
      if (isAuthenticated) {
        wsOpen()
      } else {
        wsClose()
        error.value = 'Authentication required'
      }
    },
  )

  watch(wsStatus, (status) => {
    switch (status) {
      case 'OPEN':
        backoff.reset()
        reconnectAttempt.value = 0
        error.value = null
        break
      case 'CLOSED':
        if (!backoff.getRetryCount()) {
          backoff.scheduleRetry(() => {
            reconnectAttempt.value++
            wsOpen()
          })
        }
        break
    }
  })

  onUnmounted(() => {
    backoff.reset()
    wsClose()
  })

  const isAuthenticated = computed(() => WebSocketUtils.isAuthenticated())

  return {
    connectionStatus,
    error,
    reconnectAttempt,
    backoff,
    isAuthenticated,

    send: wsSend,
    close: wsClose,

    wsStatus,
    wsData,

    handleMessage,
    handleError,
    handleClose,
  }
}
