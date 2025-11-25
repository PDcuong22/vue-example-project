import api from '@/api/axios'
import type { LoginDto, RegisterDto } from '@/types/dto/auth.dto'
import type { Models } from '@/types'

class AuthService {
  private TOKEN_KEY = 'access_token'

  async login(payload: LoginDto): Promise<Models.AuthTokens & { user: Models.AuthUser }> {
    const response = await api.post('login', payload)
    const data = response.data

    localStorage.setItem(this.TOKEN_KEY, data.access_token)
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
    return data
  }

  async register(payload: RegisterDto){
    const response =  await api.post('register', payload)
    return response.data
  }

  async logout(): Promise<void> {
    await api.post('logout')
    localStorage.removeItem(this.TOKEN_KEY)
    delete api.defaults.headers.common['Authorization']
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  clearToken() {
    localStorage.removeItem(this.TOKEN_KEY)
    delete api.defaults.headers.common['Authorization']
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  async fetchCurrentUser(): Promise<Models.AuthUser> {
    return api.get('profile').then(res => res.data.data)
  }
}

export default new AuthService()
