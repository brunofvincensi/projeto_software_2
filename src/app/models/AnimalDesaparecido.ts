import { Animal } from "./Animal";
import { Usuario } from "./Usuario";

export interface AnimalDesaparecido {
  id?: number;
  titulo: string;
  local: string;
  dataDesaparecimento: Date;
  complemento?: string;
  encontrado: boolean;
  animal: Animal;
  usuario: Usuario;
}
