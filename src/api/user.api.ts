import axios from './axios'
import type { CreateUserDto, UpdateUserDto } from '@/types/dto/user.dto'
import type { UserResponse, UserListResponse } from '@/types/responses/user.response'

export const UserApi = {
  getAll(params?: Record<string, unknown>) {
    return axios.get<UserListResponse>('/users', { params })
  },

  getOne(id: number) {
    return axios.get<UserResponse>(`/users/${id}`)
  },

  create(payload: CreateUserDto) {
    return axios.post<UserResponse>('/users', payload)
  },

  update(id: number, payload: UpdateUserDto) {
    return axios.put<UserResponse>(`/users/${id}`, payload)
  },

  remove(id: number) {
    return axios.delete<void>(`/users/${id}`)
  },
}
