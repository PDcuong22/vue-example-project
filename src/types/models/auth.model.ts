export type AuthTokens = {
  access_token: string
  refresh_token?: string
  expires_in?: number
}

export type AuthUser = {
  id: number
  name: string
  email: string
  role?: string | null
  avatar_url?: string | null
}
