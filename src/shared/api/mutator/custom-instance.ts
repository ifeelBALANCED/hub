import axios, { type AxiosRequestConfig, type AxiosError } from 'axios'
import { appEnv } from '@/shared/lib/config'
import { ErrorService } from '@/shared/services/error.service'
import { NotificationService } from '@/shared/services/notification.service'

const notificationService = new NotificationService()
const errorService = new ErrorService(notificationService)

const AXIOS_INSTANCE = axios.create({
  baseURL: appEnv.BACKEND_URL,
  timeout: 30_000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    errorService.handleApiError(error)
    return Promise.reject(error)
  },
)

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source()
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
