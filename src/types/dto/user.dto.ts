export type CreateUserDto = {
  name: string
  email: string
  password: string
  password_confirmation?: string
}

export type UpdateUserDto = Partial<CreateUserDto> & {
  id?: number // optional nếu dùng endpoint /users/:id
}
