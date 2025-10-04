import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,

      retry: (failureCount, error) => {
        if (error instanceof Error && 'message' in error) {
          const message = (error as any).message
          if (
            message &&
            (message.includes('Network Error') || message.includes('Failed to fetch'))
          ) {
            return false
          }
        }

        if (error instanceof Error && 'status' in error && typeof error.status === 'number') {
          const status = error.status
          if (status >= 400 && status < 500) {
            return false
          }
        }
        return failureCount < 2
      },

      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      refetchOnWindowFocus: 'always',
      refetchOnReconnect: true,
      refetchOnMount: true,
      networkMode: 'online',
      gcTime: 1000 * 60 * 10,
    },
    mutations: {
      retry: 0,
      networkMode: 'online',
    },
  },
})

const persister = createAsyncStoragePersister({ storage: localStorage })

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  buster: '', // Change this to bust cache on version updates

  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      const { state } = query

      if (state.status !== 'success') return false
      if (state.error) return false

      try {
        const dataSize = JSON.stringify(state.data).length
        if (dataSize > 1024 * 1024) return false
      } catch {
        return false
      }

      const queryKey = JSON.stringify(query.queryKey)

      if (queryKey.includes('"auth"') || queryKey.includes('"user"')) {
        return true
      }

      if (query.queryKey[0] === 'v1' && query.queryKey.length >= 2) {
        const method = query.queryKey[1] as string
        const allowedMethods = ['users', 'meetings', 'settings', 'profile', 'config']

        if (allowedMethods.includes(method)) {
          return true
        }
      }

      if (
        query.queryKey.some((key) => typeof key === 'object') ||
        query.queryKey.some((key) => typeof key === 'function')
      ) {
        return false
      }

      return false
    },

    shouldDehydrateMutation: () => false,
  },
})

export { VueQueryPlugin, queryClient }
