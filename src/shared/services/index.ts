export * from './error.service'
export * from './notification.service'
export * from './auth.service'

export { notificationService } from './notification.service'
export { errorService, extractErrorMessage } from './error.service'
export { WebSocketUtils } from './auth.service'

export {
  HttpClient,
  httpClient,
  type IHttpClient,
  type HttpClientConfig,
  type RequestConfig,
  type HttpResponse,
} from '../api/mutator/custom-instance'
