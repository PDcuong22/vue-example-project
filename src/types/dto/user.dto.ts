export type CreateUserDto = {
  name: string
  email: string
  password: string
  password_confirmation?: string
  role_id?:number
}

export type UpdateUserDto = Partial<CreateUserDto> & {
  id: number
}
