import type { User } from '@/types/models/user.model'

export type UserResponse = { data: User; message?: string }

export type UserListResponse = {
  data: User[]
  message?: string
}
