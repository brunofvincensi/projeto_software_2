import { Animal } from './../models/Animal';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AnimalDoacao
} from '../models/AnimalDoacao';
import {
  AnimalDesaparecido,
} from '../models/AnimalDesaparecido';
import {
  CreateAnimalDoacaoRequest
} from '../models/CreateAnimalDoacaoRequest ';
import {
  CreateAnimalDesaparecidoRequest
} from '../models/CreateAnimalDesaparecidoRequest ';
import {
  AnimalEspecie
} from '../models/AnimalEspecie';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Animais para doação
  getAnimaisDoacao(especie?: AnimalEspecie, raca?: string): Observable<AnimalDoacao[]> {
    let params = new HttpParams();
    if (especie) params = params.set('especie', especie);
    if (raca) params = params.set('raca', raca);

    return this.http.get<AnimalDoacao[]>(`${this.baseUrl}/animais/doacao`, { params });
  }

  createAnimalDoacao(request: CreateAnimalDoacaoRequest): Observable<AnimalDoacao> {
    return this.http.post<AnimalDoacao>(`${this.baseUrl}/animais/doacao`, request);
  }

  demonstrarInteresse(animalDoacaoId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/animais/doacao/${animalDoacaoId}/interesse`, {});
  }
  getAnimalById(id: number): Observable<Animal> {
  return this.http.get<Animal>(`${this.baseUrl}/animals/${id}`);
}

  // Animais desaparecidos
  getAnimaisDesaparecidos(especie?: AnimalEspecie, local?: string): Observable<AnimalDesaparecido[]> {
    let params = new HttpParams();
    if (especie) params = params.set('especie', especie);
    if (local) params = params.set('local', local);

    return this.http.get<AnimalDesaparecido[]>(`${this.baseUrl}/animais/desaparecidos`, { params });
  }

  createAnimalDesaparecido(request: CreateAnimalDesaparecidoRequest): Observable<AnimalDesaparecido> {
    return this.http.post<AnimalDesaparecido>(`${this.baseUrl}/animais/desaparecidos`, request);
  }

  marcarComoEncontrado(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/animais/desaparecidos/${id}/encontrado`, {});
  }
}
