export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role?: 'admin' | 'user' | string
  createdAt: string
}

let counter = 6
const store: User[] = [
  {
    id: 1,
    name: 'Tom',
    email: 'tom@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    role: 'admin',
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    name: 'Anna',
    email: 'anna@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    role: 'user',
    createdAt: '2024-02-10',
  },
  {
    id: 3,
    name: 'Mike',
    email: 'mike@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    role: 'user',
    createdAt: '2024-03-05',
  },
  {
    id: 4,
    name: 'Lina',
    email: 'lina@example.com',
    avatar: 'https://i.pravatar.cc/150?img=4',
    role: 'user',
    createdAt: '2024-04-12',
  },
  {
    id: 5,
    name: 'Sara',
    email: 'sara@example.com',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'user',
    createdAt: '2024-05-20',
  },
]

function delay(ms = 150) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function listUsers({
  page = 1,
  size = 10,
  q = '',
}: { page?: number; size?: number; q?: string } = {}) {
  await delay(200)
  let items = store.slice()
  if (q) {
    const key = q.toLowerCase()
    items = items.filter(
      (u) => u.name.toLowerCase().includes(key) || u.email.toLowerCase().includes(key),
    )
  }
  const total = items.length
  const start = (page - 1) * size
  items = items.slice(start, start + size)
  return { items, total }
}

export async function getUser(id: number) {
  await delay(120)
  return store.find((u) => u.id === id) ?? null
}

export async function createUser(payload: Partial<User>) {
  await delay(150)
  counter++
  const rec: User = {
    id: counter,
    name: payload.name ?? `User ${counter}`,
    email: payload.email ?? `user${counter}@example.com`,
    avatar: payload.avatar,
    role: payload.role ?? 'user',
    createdAt: new Date().toISOString().slice(0, 10),
  }
  store.unshift(rec)
  return rec
}

export async function updateUser(id: number, payload: Partial<Omit<User, 'id'>>) {
  await delay(150)
  const idx = store.findIndex((u) => u.id === id)
  if (idx >= 0) {
    const user = store[idx]
    if (user) {
      Object.assign(user, payload)
      return user
    }
  }
  return null
}

export async function deleteUser(id: number) {
  await delay(120)
  const idx = store.findIndex((u) => u.id === id)
  if (idx >= 0) store.splice(idx, 1)
  return true
}

/* simple auth helpers (mock) */
let currentUserId: number | null = 1

export async function getCurrentUser() {
  await delay(80)
  return currentUserId ? getUser(currentUserId) : null
}

export async function login(email: string) {
  await delay(200)
  const u = store.find((s) => s.email === email) ?? store[0]
  if (!u) throw new Error('User not found')
  currentUserId = u.id
  return u
}

export async function logout() {
  await delay(80)
  currentUserId = null
  return true
}
