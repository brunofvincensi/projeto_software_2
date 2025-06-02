import { Animal } from "./Animal";

export interface CreateAnimalDoacaoRequest {
  titulo: string;
  descricao: string;
  animal: Omit<Animal, 'id'>;
}
