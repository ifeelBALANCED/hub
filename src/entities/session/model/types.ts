import type { UserResponse } from '@/shared/api/client'

export type User = UserResponse

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
  refreshTokenExpiresIn: number
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  displayName: string
}

export interface OAuthCredentials {
  idToken: string
}

export interface RefreshCredentials {
  refreshToken?: string
}
