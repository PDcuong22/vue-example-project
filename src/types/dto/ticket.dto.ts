export type CreateTicketDto = {
  title: string
  description: string
  priority_id: number | null
  status_id: number | null
  labels: number[] | null
  categories: number[] | null
  assigned_user_id?: number | null
  attachments?: File[]
}

export type UpdateTicketDto = Partial<CreateTicketDto> & {
  attachments_to_remove?: number[]
}
