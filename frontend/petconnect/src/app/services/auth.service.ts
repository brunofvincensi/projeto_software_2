import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, of, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { Usuario } from '../models/usuario.model';
import { catchError } from 'rxjs/operators';

const USER_STORAGE_KEY = 'petconnect.user';
const BASE_URL_V1 = 'v1/acesso';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private usuario?: Usuario;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  register(userData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
			this.http.post<void>('http://localhost:8080/usuario', userData)
				.subscribe({
					next: async (data: any) => {
            resolve();
					},
					error: err => reject(err.error)
				});
		});
  }

  update(userData: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
			this.http.put<void>('http://localhost:8080/usuario', userData)
				.subscribe({
					next: async (data: any) => {
            resolve();
					},
					error: err => reject(err.error)
				});
		});
  }

  login(username: string, password: string) {
    return new Promise<string>((resolve, reject) => {
			this.http.post<string>('http://localhost:8080/usuario/login', { email: username, senha: password })
				.subscribe({
					next: async (data: any) => {
						// atualizar token
						const token = data.accessToken;
						this.tokenService.setToken(token);
						this.tokenService.setRefreshToken(data.refreshToken);

						// pegar informações do usuário pelo token
						const tokenInfo = this.tokenService.getDecodedToken(token);
						const user: Usuario = {
              dataNascimento: tokenInfo.dtNascimento,
              email: username,
              nome: tokenInfo.nome,
              telefone: tokenInfo.phoneNumber,
              role: '',
              id: tokenInfo.id,
              senha: '',
              imagemUrl: '',
              avaliacao: 0
            };
						// atualizar o perfil principal e o usuário
						try {
							await this.loadUserLogin(user as Usuario);
							resolve(data.token);
						} catch (err) {
							this.tokenService.clearTokens();
							reject(err);
						}
					},
					error: err => reject('Email ou senha inválidos')
				});
		});
  }

  avaliar(dados: any) {
    return this.http.post<void>('http://localhost:8080/usuario/avaliar', dados)
  }

  /**
	 * @returns o usuário autenticado, se o usuário do serviço não está definido então busca do localStorage
	 */
	getCurrentUser() {
		if (!this.usuario) {
			const item = localStorage.getItem(USER_STORAGE_KEY);
			if (item) {
				this.usuario = JSON.parse(item);
			}
		}
		return this.usuario;
	}

  getUsuarioById(id: number) {
		return this.http.get<Usuario>('http://localhost:8080/usuario/' + id);
  }

	/**
	 * Atualizar dados de perfil e configuração ao fazer login
	 * @param user
	 */
	private async loadUserLogin(user: Usuario) {
		this.usuario = user;
		localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(this.usuario));
	}

  /**
	 * Realiza o logout do usuário autenticado.
	 * Limpa o usuário no serviço e o token de autenticação.
	 */
	async logout() {
		this.clearUser();
		this.tokenService.clearTokens();
	}

  /**
	 * Remove o usuário autenticado do serviço e do localStorage.
	 */
	clearUser() {
		this.usuario = undefined;
		localStorage.removeItem(USER_STORAGE_KEY);
	}

  isAuthenticated(): boolean {
    return !!this.tokenService.getToken();
  }

}
