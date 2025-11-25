import { UserApi } from '@/api/user.api'
import type { CreateUserDto, UpdateUserDto } from '@/types/dto/user.dto'
import type { User } from '@/types/models/user.model'
import type { Interfaces } from '@/types'

const UserService = {
  async fetchAll(params?: Record<string, unknown>): Promise<{ data: User[]; meta?: Interfaces.Pagination }> {
    const res = await UserApi.getAll(params)
    return { data: res.data.data }
  },

  async fetchOne(id: number): Promise<User> {
    const res = await UserApi.getOne(id)
    return res.data.data
  },

  async create(payload: CreateUserDto): Promise<User> {
    const res = await UserApi.create(payload)
    return res.data.data
  },

  async update(id: number, payload: UpdateUserDto): Promise<User> {
    const res = await UserApi.update(id, payload)
    return res.data.data
  },

  async remove(id: number): Promise<void> {
    await UserApi.remove(id)
  },
}
export default UserService
