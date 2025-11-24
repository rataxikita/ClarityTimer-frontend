import axios from 'axios';
import { STORAGE_KEYS } from '../constants/settings';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// 🎯 PRESENTACIÓN: Configurar axios con interceptores para JWT
// Centraliza TODA la autenticación - ningún servicio maneja tokens manualmente
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🎯 PRESENTACIÓN: REQUEST INTERCEPTOR - Se ejecuta ANTES de cada petición HTTP
// Automáticamente inyecta el token JWT en el header Authorization de TODAS las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🎯 PRESENTACIÓN: RESPONSE INTERCEPTOR - Se ejecuta DESPUÉS de cada respuesta
// Si detecta 401 (no autorizado) = token expirado → limpia estado y redirige al login
// También maneja 403 (prohibido) y errores 500+
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

