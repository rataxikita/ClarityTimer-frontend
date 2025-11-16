import api from './api';
import { STORAGE_KEYS } from '../constants/settings';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nombre?: string;
  apellido?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UsuarioResponse {
  id: number;
  username: string;
  email: string;
  nombre?: string;
  apellido?: string;
  rol: string;
  puntosTotales: number;
  puntosDisponibles: number;
  streakDias: number;
  personajeActivoId?: number;
  personajeActivoNombre?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  usuario: UsuarioResponse;
}

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.usuario));
    }
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.usuario));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  getCurrentUser: async (): Promise<UsuarioResponse> => {
    const response = await api.get<UsuarioResponse>('/auth/me');
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
    return response.data;
  },

  getStoredUser: (): UsuarioResponse | null => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },
};

