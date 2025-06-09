import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnimalDoacao } from '../models/animal-doacao.model';

@Injectable({
  providedIn: 'root'
})
export class AnimalDoacaoService {

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

    return this.http.get<AnimalDoacao[]>('http://localhost:8080/animal/doacao/all', { params });
  }

  findById(id: number) {
    return this.http.get<AnimalDoacao>('http://localhost:8080/animal/doacao/' + id);
  }

  delete(id: number) {
    return this.http.delete<void>('http://localhost:8080/animal/doacao/' + id);
  }

  save(animalDoacao: any) {
    return new Promise<void>((resolve, reject) => {
			this.http.post<void>('http://localhost:8080/animal/doacao', animalDoacao)
				.subscribe({
					next: async (data: any) => {
            resolve();
					},
					error: err => reject(err.error)
				});
		});
  }

}
