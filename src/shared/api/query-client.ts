import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { appEnv } from '@/shared/lib/config'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,

      retry: (failureCount, error) => {
        if (error instanceof Error && 'status' in error && typeof error.status === 'number') {
          const status = error.status

          if (status >= 400 && status < 500) {
            return false
          }
        }

        return failureCount < 3
      },

      refetchOnWindowFocus: appEnv.MODE === 'development',

      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error) => {
        if (error instanceof Error && 'status' in error && typeof error.status === 'number') {
          const status = error.status
          if (status >= 400 && status < 500) {
            return false
          }
        }

        if (error instanceof Error) {
          if (
            error.message.includes('Network Error') ||
            error.message.includes('timeout') ||
            error.message.includes('ECONNABORTED')
          ) {
            return false
          }
        }

        return failureCount < 1
      },
    },
  },
})

export { VueQueryPlugin, queryClient }
