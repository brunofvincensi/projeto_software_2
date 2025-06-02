import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getAllUsers(): Observable<Usuario[]> {
    return this.apiService.get<Usuario[]>('/users');
  }

  getUserById(id: number): Observable<Usuario> {
    return this.apiService.get<Usuario>(`/users/${id}`);
  }

  createUser(user: Usuario): Observable<Usuario> {
    return this.apiService.post<Usuario>('/users', user);
  }

  updateUser(id: number, user: Usuario): Observable<Usuario> {
    return this.apiService.put<Usuario>(`/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.apiService.delete<void>(`/users/${id}`);
  }

  register(user: Usuario): Observable<Usuario> {
    return this.apiService.post<Usuario>('/auth/register', user);
  }

  login(email: string, password: string): Observable<any> {
    return this.apiService.post<any>('/auth/login', { email, password });
  }
}
