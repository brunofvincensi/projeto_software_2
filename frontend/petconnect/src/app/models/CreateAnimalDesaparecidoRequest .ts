import { Animal } from "./Animal";

export interface CreateAnimalDesaparecidoRequest {
  titulo: string;
  local: string;
  dataDesaparecimento: Date;
  complemento?: string;
  animal: Omit<Animal, 'id'>;
}
