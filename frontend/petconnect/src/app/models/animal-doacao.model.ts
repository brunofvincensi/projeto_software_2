import { Animal } from "./animal.model";

export interface AnimalDoacao {
  id: number;
  animal: Animal;
  titulo: string;
  dataPublicacao: Date;
  descricao: string;
  doado: boolean;
  idUsuario: number;
  emailUsuario: string;

}
