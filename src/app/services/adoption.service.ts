import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Adoption } from '../models/adoption.model';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {
  constructor(private apiService: ApiService) {}

  getAllAdoptions(): Observable<Adoption[]> {
    return this.apiService.get<Adoption[]>('/adoptions');
  }

  getAdoptionById(id: number): Observable<Adoption> {
    return this.apiService.get<Adoption>(`/adoptions/${id}`);
  }

  createAdoptionRequest(adoption: Adoption): Observable<Adoption> {
    return this.apiService.post<Adoption>('/adoptions', adoption);
  }

  updateAdoptionStatus(id: number, status: string): Observable<Adoption> {
    return this.apiService.put<Adoption>(`/adoptions/${id}/status`, { status });
  }

  getUserAdoptions(userId: number): Observable<Adoption[]> {
    return this.apiService.get<Adoption[]>(`/adoptions/user/${userId}`);
  }
}
