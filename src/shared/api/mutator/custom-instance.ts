import axios, {
  type AxiosRequestConfig,
  type AxiosError,
  type AxiosInstance,
  type Method,
  type InternalAxiosRequestConfig,
} from 'axios'
import { appEnv } from '@/shared/lib/config'
import { errorService, type ApiErrorResponse } from '@/shared/services'
import { useAuthStore } from '@/shared/stores/auth'

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: { timestamp: number }
    skipErrorHandling?: boolean
  }
}

type ErrorService = typeof errorService

export interface HttpClientConfig {
  baseURL: string
  timeout: number
  withCredentials: boolean
  headers: Record<string, string>
  retry?: {
    attempts: number
    delay: number
  }
}

export interface RequestConfig extends Omit<AxiosRequestConfig, 'signal' | 'method' | 'url'> {
  signal?: AbortSignal
  method?: Method
  url?: string
  skipAuth?: boolean
  skipErrorHandling?: boolean
}

export interface HttpResponse<T = unknown> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

export interface IHttpClient {
  get<T = unknown>(url: string, config?: RequestConfig): Promise<T>
  post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T>
  put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T>
  patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T>
  delete<T = unknown>(url: string, config?: RequestConfig): Promise<T>
  request<T = unknown>(config: RequestConfig): Promise<T>
  cancelRequest(requestKey: string): void
  cancelAllRequests(): void
  getActiveRequestCount(): number
  getActiveRequestKeys(): string[]
}

export class HttpClient implements IHttpClient {
  private readonly axiosInstance: AxiosInstance
  private readonly errorService: ErrorService
  private readonly activeRequests: Map<string, AbortController> = new Map()
  private readonly config: HttpClientConfig

  constructor(config: HttpClientConfig, errorService: ErrorService) {
    this.config = config
    this.errorService = errorService

    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      withCredentials: config.withCredentials,
      headers: config.headers,
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorResponse>) => this.handleError(error),
    )

    this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      config.metadata = { timestamp: Date.now() }
      return config
    })
  }

  private handleError(error: AxiosError<ApiErrorResponse>): Promise<never> {
    const { response, config } = error

    if (response?.status === 401) {
      const authStore = useAuthStore()
      authStore.handleSessionExpiry()
      return Promise.reject(error)
    }

    const isAuthEndpoint = config?.url?.includes('/auth/')
    const shouldSkipErrorHandling =
      (config as InternalAxiosRequestConfig)?.skipErrorHandling || isAuthEndpoint

    if (!shouldSkipErrorHandling) {
      this.errorService.handleApiError(error)
    }

    return Promise.reject(error)
  }

  private generateRequestKey(method: Method, url: string, data?: unknown): string {
    const dataString =
      data && ['POST', 'PUT', 'PATCH'].includes(method) ? `:${JSON.stringify(data)}` : ''
    return `${method}:${url}${dataString}`
  }

  private createRequestMetadata(): AbortController {
    return new AbortController()
  }

  private async executeRequest<T>(
    method: Method,
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<T> {
    const requestKey = this.generateRequestKey(method, url, data)
    const controller = this.createRequestMetadata()

    this.activeRequests.set(requestKey, controller)

    try {
      const axiosConfig: AxiosRequestConfig = {
        method,
        url,
        data,
        signal: controller.signal,
        ...config,
      }

      const response = await this.axiosInstance.request(axiosConfig)
      return response.data
    } finally {
      this.activeRequests.delete(requestKey)
    }
  }

  public cancelRequest(requestKey: string): void {
    const controller = this.activeRequests.get(requestKey)
    if (controller) {
      controller.abort()
      this.activeRequests.delete(requestKey)
    }
  }

  public cancelAllRequests(): void {
    this.activeRequests.forEach((controller) => controller.abort())
    this.activeRequests.clear()
  }

  async get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.executeRequest<T>('GET', url, undefined, config)
  }

  async post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.executeRequest<T>('POST', url, data, config)
  }

  async put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.executeRequest<T>('PUT', url, data, config)
  }

  async patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.executeRequest<T>('PATCH', url, data, config)
  }

  async delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.executeRequest<T>('DELETE', url, undefined, config)
  }

  async request<T = unknown>(config: RequestConfig): Promise<T> {
    const { method = 'GET', url = '', data, ...restConfig } = config
    return this.executeRequest<T>(method, url, data, restConfig)
  }

  public getActiveRequestCount(): number {
    return this.activeRequests.size
  }

  public getActiveRequestKeys(): string[] {
    return Array.from(this.activeRequests.keys())
  }

  public cancelRequestsByUrl(urlPattern: string | RegExp): void {
    const keysToCancel = Array.from(this.activeRequests.keys()).filter((key) => {
      const url = key.split(':').slice(1).join(':')
      return typeof urlPattern === 'string' ? url.includes(urlPattern) : urlPattern.test(url)
    })

    keysToCancel.forEach((key) => this.cancelRequest(key))
  }

  public getRequestMetadata(): Array<{
    key: string
    timestamp: number
    url: string
    method: Method
  }> {
    return Array.from(this.activeRequests.entries()).map(([key, controller]) => {
      const parts = key.split(':')
      const method = parts[0] as Method
      const url = parts.slice(1).join(':') || ''
      return {
        key,
        timestamp: (controller as any).timestamp || Date.now(),
        url,
        method,
      }
    })
  }

  public isRequestActive(method: Method, url: string, data?: unknown): boolean {
    const requestKey = this.generateRequestKey(method, url, data)
    return this.activeRequests.has(requestKey)
  }
}

export const httpClient = new HttpClient(
  {
    baseURL: appEnv.BACKEND_URL,
    timeout: 30_000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    retry: {
      attempts: 3,
      delay: 1000,
    },
  },
  errorService,
)

export const customInstance = <T = unknown>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const mergedConfig = { ...config, ...options }
  const requestConfig: RequestConfig = {
    ...mergedConfig,
    signal: mergedConfig.signal as AbortSignal | undefined,
    method: mergedConfig.method as Method | undefined,
    url: mergedConfig.url,
  }
  return httpClient.request<T>(requestConfig)
}

export type ErrorType<T = unknown> = AxiosError<T>
export type BodyType<T = unknown> = T
