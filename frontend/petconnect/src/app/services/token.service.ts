import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

const TOKEN_STORAGE_KEY = 'petconnect.access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'petconnect.refresh_access_token';

/**
 * Serviço que gerencia o JWT de autenticação do usuário.
 */
@Injectable({
	providedIn: 'root'
})
export class TokenService {

	private jwtHelper!: JwtHelperService;
	private token?: string;
	private refreshToken?: string;

	constructor() {
		this.jwtHelper = new JwtHelperService();
	}

	getToken() {
		if (this.token) return this.token;
		return localStorage.getItem(TOKEN_STORAGE_KEY) || undefined;
	}

	getRefreshToken() {
		if (this.refreshToken) return this.refreshToken;
		return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) || undefined;
	}

	setToken(token: string) {
		this.token = token;
		localStorage.setItem(TOKEN_STORAGE_KEY, token);
	}

	setRefreshToken(refreshToken: string) {
		this.refreshToken = refreshToken;
		localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
	}

	clearToken() {
		this.token = undefined;
		localStorage.removeItem(TOKEN_STORAGE_KEY);
	}

	clearRefreshToken() {
		this.refreshToken = undefined;
		localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
	}

	clearTokens() {
		this.clearToken();
		this.clearRefreshToken();
	}

	isExpired(token?: string) {
		return !!token ? this.jwtHelper.isTokenExpired(token) : true;
	}

	getDecodedToken(token: string) {
		return this.jwtHelper.decodeToken(token);
	}

}
