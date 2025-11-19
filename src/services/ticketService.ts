// Simple in-memory mock service — thay bằng axios khi có API thật
import type { Ticket } from '@/models'

export type CreateTicketPayload = Omit<Ticket, 'id' | 'createdAt'>

let counter = 23
const store: Ticket[] = Array.from({ length: 23 }).map((_, i) => ({
  id: i + 1,
  title: `Sample ticket #${i + 1}`,
  description: `Description for ticket ${i + 1}`,
  assignee: ['Tom', 'Anna', 'Mike'][i % 3],
  status: ['open', 'progress', 'closed'][i % 3],
  createdAt: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
}))

export async function listTickets({
  page = 1,
  size = 10,
  q = '',
}: {
  page?: number
  size?: number
  q?: string
}) {
  await new Promise((r) => setTimeout(r, 200)) // simulate latency
  let items = store.slice()
  if (q) {
    const key = q.toLowerCase()
    items = items.filter(
      (t) => t.title.toLowerCase().includes(key) || (t.assignee || '').toLowerCase().includes(key),
    )
  }
  const total = items.length
  const start = (page - 1) * size
  items = items.slice(start, start + size)
  return { items, total }
}

export async function getTicket(id: number): Promise<Ticket | null> {
  await new Promise((r) => setTimeout(r, 120))
  return store.find((t) => t.id === id) ?? null
}

export async function createTicket(payload: CreateTicketPayload) {
  await new Promise((r) => setTimeout(r, 150))
  // nếu title bắt buộc, payload.title là string theo type => no runtime check needed
  const rec: Ticket = {
    id: ++counter,
    createdAt: new Date().toISOString().slice(0, 10),
    title: payload.title,
    description: payload.description ?? '',
    assignee: payload.assignee,
    status: payload.status ?? 'open',
  }
  store.unshift(rec)
  return rec
}

export async function updateTicket(id: number, payload: Partial<Ticket>) {
  await new Promise((r) => setTimeout(r, 150))
  const idx = store.findIndex((s) => s.id === id)
  if (idx >= 0) {
    const ticket = store[idx]
    if (ticket) {
      Object.assign(ticket, payload)
      return ticket
    }
  }
  return store[idx]
}

export async function deleteTicket(id: number) {
  await new Promise((r) => setTimeout(r, 120))
  const idx = store.findIndex((s) => s.id === id)
  if (idx >= 0) store.splice(idx, 1)
  return true
}
