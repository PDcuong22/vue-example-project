import type { Models } from '@/types'
import type { Interfaces } from '@/types'

export type TicketResponse = { data: Models.Ticket; message?: string }

export type TicketListResponse = {
  data: Models.Ticket[]
  meta?: Interfaces.Pagination
}
