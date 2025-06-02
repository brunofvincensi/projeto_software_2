import { Role } from "./Role";






export interface RegisterRequest {
  email: string;
  senha: string;
  nome: string;
  telefone?: string;
  dataNascimento?: Date;
  role: Role;
}
