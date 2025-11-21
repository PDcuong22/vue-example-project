import type { AuthTokens, AuthUser } from '@/types/models/auth.model'

export type LoginResponse = AuthTokens & { user: AuthUser }
export type RegisterResponse = AuthUser
