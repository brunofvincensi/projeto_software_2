import { Usuario } from "./Usuario";

export interface CampanhaSolidaria {
  id?: number;
  titulo: string;
  descricao: string;
  meta: number;
  valorArrecadado?: number;
  dataInicio: Date;
  dataFim?: Date;
  usuario: Usuario;
}
