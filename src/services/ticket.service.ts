import { TicketApi } from '@/api/ticket.api'
import type { Models } from '@/types'
import type { Interfaces } from '@/types'
import type { CreateTicketDto, UpdateTicketDto } from '@/types/dto/ticket.dto'

const TicketService = {
  async list(params?: Record<string, unknown>): Promise<{ data: Models.Ticket[]; meta?: Interfaces.Pagination }> {
    const res = await TicketApi.list(params)
    return { data: res.data.data, meta: res.data.meta }
  },

  async get(id: number): Promise<Models.Ticket> {
    const res = await TicketApi.get(id)
    return res.data.data
  },

  async create(payload: CreateTicketDto): Promise<Models.Ticket> {
    const res = await TicketApi.create(payload)
    return res.data.data
  },

  async update(id: number, payload: UpdateTicketDto): Promise<Models.Ticket> {
    const res = await TicketApi.update(id, payload)
    return res.data.data
  },

  async delete(id: number): Promise<void> {
    await TicketApi.delete(id)
  },
}

export default TicketService
