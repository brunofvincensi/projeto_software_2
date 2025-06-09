import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnimalDesaparecido } from '../models/animal-desaparecido.model';

@Injectable({
  providedIn: 'root'
})
export class AnimalDesaparecidoService {

  constructor(private http: HttpClient) { }

  findAll(filtros: any) {
        // Cria HttpParams dinamicamente
    let params = new HttpParams();

    // Adiciona apenas os parâmetros que foram fornecidos
    Object.keys(filtros).forEach(key => {
      if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
        params = params.append(key, filtros[key]);
      }
    });

    return this.http.get<AnimalDesaparecido[]>('http://localhost:8080/animal/desaparecido/all', { params });
  }

  findById(id: number) {
    return this.http.get<AnimalDesaparecido>('http://localhost:8080/animal/desaparecido/' + id);
  }

  delete(id: number) {
    return this.http.delete<void>('http://localhost:8080/animal/desaparecido/' + id);
  }

  save(animalDesaparecido: any) {
    return new Promise<void>((resolve, reject) => {
			this.http.post<void>('http://localhost:8080/animal/desaparecido', animalDesaparecido)
				.subscribe({
					next: async (data: any) => {
            resolve();
					},
					error: err => reject(err.error)
				});
		});
  }

}
