/**
 * Simple utility functions for WebSocket connections
 * Since we're using cookie-based authentication, WebSocket connections
 * will automatically inherit cookies from HTTP requests
 */

export class WebSocketUtils {
  /**
   * Get WebSocket URL from backend HTTP URL
   * Converts HTTP URLs to WebSocket URLs (ws:// or wss://)
   */
  static getWebSocketUrl(baseUrl: string): string {
    // Convert HTTP backend URL to WebSocket URL
    const wsProtocol = baseUrl.startsWith('https://') ? 'wss://' : 'ws://'
    const wsBaseUrl = baseUrl.replace(/^https?:\/\//, wsProtocol)

    // Remove trailing slash if present and add WebSocket path
    const cleanBaseUrl = wsBaseUrl.endsWith('/') ? wsBaseUrl.slice(0, -1) : wsBaseUrl

    return cleanBaseUrl
  }

  /**
   * Check if user is authenticated by checking if we have user data
   * This is a simple check since we're relying on cookies
   */
  static isAuthenticated(): boolean {
    // Simple check - if we have user data in sessionStorage, user is likely authenticated
    // The actual authentication happens via HTTP cookies
    try {
      const userData = sessionStorage.getItem('user')
      return Boolean(userData)
    } catch {
      return false
    }
  }
}
