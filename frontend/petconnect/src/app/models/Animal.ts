import { AnimalEspecie } from "./AnimalEspecie";

// Interfaces básicas
export interface Animal {
  id?: number;
  nome: string;
  especie: AnimalEspecie;
  raca?: string;
  idade: number;
  descricao: string;
  imagemUrl?: string;
}
