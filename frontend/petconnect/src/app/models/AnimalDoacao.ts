import { Animal } from "./Animal";
import { Usuario } from "./Usuario";

export interface AnimalDoacao {
  id?: number;
  titulo: string;
  descricao: string;
  dataPublicacao?: Date;
  animal: Animal;
  doador: Usuario;
  adotante?: Usuario;
  adotado?: boolean;
}
