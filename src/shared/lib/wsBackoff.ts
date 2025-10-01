export interface BackoffOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  backoffFactor?: number
}

export class WebSocketBackoff {
  private retryCount = 0
  private retryTimeoutId: number | null = null

  constructor(private options: BackoffOptions = {}) {
    this.options = {
      maxRetries: Infinity,
      baseDelay: 1000,
      maxDelay: 30000,
      backoffFactor: 2,
      ...options,
    }
  }

  calculateDelay(): number {
    const delay = this.options.baseDelay! * Math.pow(this.options.backoffFactor!, this.retryCount)
    return Math.min(delay, this.options.maxDelay!)
  }

  scheduleRetry(callback: () => void): void {
    if (this.retryCount >= this.options.maxRetries!) {
      return
    }

    this.retryCount++
    const delay = this.calculateDelay()

    this.retryTimeoutId = window.setTimeout(() => {
      callback()
    }, delay)
  }

  reset(): void {
    this.retryCount = 0
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
      this.retryTimeoutId = null
    }
  }

  getRetryCount(): number {
    return this.retryCount
  }
}

export const createWebSocketBackoff = (options?: BackoffOptions): WebSocketBackoff => {
  return new WebSocketBackoff(options)
}
