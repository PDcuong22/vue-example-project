import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE ?? '/api'

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

instance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('access_token')
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  } catch (e) {
    // ignore in SSR
    console.warn('No access token found', e)
  }
  return config
})

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    return Promise.reject(err)
  },
)

export default instance
