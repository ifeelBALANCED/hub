/**
 * Simple utility functions for WebSocket connections
 * Since we're using cookie-based authentication, WebSocket connections
 * will automatically inherit cookies from HTTP requests
 */

import { useUser } from '@/entities/user'

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
   * Check if user is authenticated by checking the user store
   * This properly integrates with the Pinia user store
   */
  static isAuthenticated(): boolean {
    try {
      // Use the user store to check authentication status
      // This ensures consistency with the rest of the app
      const { isAuthenticated } = useUser()
      return isAuthenticated
    } catch {
      return false
    }
  }
}
