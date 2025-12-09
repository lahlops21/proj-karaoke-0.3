export interface AdminCadastroRequest {
  name: string;
  email: string;
  senha: string;
  endereco?: string | null;
}

export interface AdminCadastroResponse {
  id:number
}

export interface AdminLoginRequest {
  email: string;
  senha: string;
}

export interface AdminLoginResponse {
  token: string;
  expiresIn: number
}
