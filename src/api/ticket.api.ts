import axios from './axios'
import type { CreateTicketDto, UpdateTicketDto } from '@/types/dto/ticket.dto'
import type { TicketResponse, TicketListResponse } from '@/types/responses/ticket.response'

export const TicketApi = {
  list(params?: Record<string, unknown>) {
    return axios.get<TicketListResponse>('/tickets', { params })
  },

  get(id: number) {
    return axios.get<TicketResponse>(`/tickets/${id}`)
  },

  create(payload: CreateTicketDto | FormData) {
    return axios.post<TicketResponse>('/tickets', payload)
  },

  update(id: number, payload: UpdateTicketDto) {
    return axios.put<TicketResponse>(`/tickets/${id}`, payload)
  },

  delete(id: number) {
    return axios.delete<void>(`/tickets/${id}`)
  },
}
