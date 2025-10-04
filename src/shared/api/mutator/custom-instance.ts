import Axios, { type AxiosRequestConfig, type AxiosError } from 'axios'
import { appEnv } from '@/shared/lib/config'
import { ErrorService } from '@/shared/services/error.service'
import { NotificationService } from '@/shared/services/notification.service'
import { useAuthStore } from '@/entities/session'

const notificationService = new NotificationService()
const errorService = new ErrorService(notificationService)

const AXIOS_INSTANCE = Axios.create({
  baseURL: appEnv.BACKEND_URL,
  timeout: 30_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let pendingRequests: Array<(token: string | null) => void> = []

const processQueue = (token: string | null) => {
  pendingRequests.forEach((cb) => cb(token))
  pendingRequests = []
}

AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    const authTokens = sessionStorage.getItem('auth_tokens')
    if (authTokens) {
      try {
        const tokens = JSON.parse(authTokens)
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`
        }
      } catch {}
    }
    return config
  },
  (error) => Promise.reject(error),
)

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const auth = useAuthStore()

      if (!isRefreshing) {
        isRefreshing = true

        const refreshToken = auth.tokens?.refreshToken

        return AXIOS_INSTANCE.post(
          '/v1/auth/refresh',
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } },
        )
          .then((res) => {
            const accessToken = res?.data?.accessToken
            const newRefreshToken = res?.data?.refreshToken || refreshToken
            const accessTokenExpiresIn = res?.data?.accessTokenExpiresIn || 3600
            const refreshTokenExpiresIn =
              res?.data?.refreshTokenExpiresIn || auth.tokens?.refreshTokenExpiresIn || 86400

            if (accessToken) {
              auth.setTokens({
                accessToken,
                refreshToken: newRefreshToken,
                accessTokenExpiresIn,
                refreshTokenExpiresIn,
              })

              processQueue(accessToken)

              originalRequest.headers = originalRequest.headers || {}
              originalRequest.headers.Authorization = `Bearer ${accessToken}`
              return AXIOS_INSTANCE(originalRequest)
            }

            auth.cleanup()
            processQueue(null)
            return Promise.reject(error)
          })
          .catch((refreshErr) => {
            auth.cleanup()
            processQueue(null)
            return Promise.reject(refreshErr)
          })
          .finally(() => {
            isRefreshing = false
          })
      }

      return new Promise((resolve, reject) => {
        pendingRequests.push((token) => {
          if (!token) {
            reject(error)
            return
          }
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(AXIOS_INSTANCE(originalRequest))
        })
      })
    }

    const timeSinceLoad = Date.now() - (window.performance?.timing?.navigationStart || 0)
    if (
      timeSinceLoad < 5000 &&
      error?.message &&
      (error.message.includes('Network Error') || error.message.includes('Failed to fetch'))
    ) {
      console.warn('Network error during initial load, suppressing notification:', error.message)
      return Promise.reject(error)
    }

    errorService.handleApiError(error)
    return Promise.reject(error)
  },
)

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source()
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data) as any

  promise.cancel = () => {
    source.cancel('Query was cancelled')
  }

  return promise
}

export type ErrorType<Error> = AxiosError<Error>
export type BodyType<BodyData> = BodyData
