import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AnimalDoacao } from '../models/AnimalDoacao';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {
  constructor(private apiService: ApiService) {}

  getAllAdoptions(): Observable<AnimalDoacao[]> {
    return this.apiService.get<AnimalDoacao[]>('/adoptions');
  }

  // Fixed: Use apiService instead of http
  submitAdoption(adoption: AnimalDoacao): Observable<AnimalDoacao> {
    return this.apiService.post<AnimalDoacao>('/adoptions', adoption);
  }

  getAdoptionById(id: number): Observable<AnimalDoacao> {
    return this.apiService.get<AnimalDoacao>(`/adoptions/${id}`);
  }

  createAdoptionRequest(adoption: AnimalDoacao): Observable<AnimalDoacao> {
    return this.apiService.post<AnimalDoacao>('/adoptions', adoption);
  }

  updateAdoptionStatus(id: number, status: string): Observable<AnimalDoacao> {
    return this.apiService.put<AnimalDoacao>(`/adoptions/${id}/status`, { status });
  }

  getUserAdoptions(userId: number): Observable<AnimalDoacao[]> {
    return this.apiService.get<AnimalDoacao[]>(`/adoptions/user/${userId}`);
  }
}
