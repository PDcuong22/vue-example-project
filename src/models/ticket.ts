export interface Ticket {
  id: number
  title: string
  description?: string
  assignee?: string
  status?: 'open' | 'progress' | 'closed' | string
  createdAt: string
}
