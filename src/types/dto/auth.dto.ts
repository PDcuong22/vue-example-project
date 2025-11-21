export type LoginDto = {
email: string;
password: string;
};


export type RegisterDto = {
name: string;
email: string;
password: string;
password_confirmation?: string;
};
