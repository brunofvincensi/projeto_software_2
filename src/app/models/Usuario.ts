import { Role } from "./Role";

export interface Usuario {
  id?: number;
  email: string;
  senha?: string;
  nome: string;
  telefone?: string;
  imagemUrl?: string;
  dataNascimento?: Date;
  dataCriacao?: Date;
  role: Role;
  mediaAvaliacao?: number;
}
