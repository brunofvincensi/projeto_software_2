import { Animal } from "./animal.model";

export interface AnimalDesaparecido {
  id: number;
  animal: Animal;
  local: string;
  dataDesaparecimento: Date;
  complemento: string;
  encontrado: boolean;
  idUsuario: number;
  emailUsuario: string;
}
