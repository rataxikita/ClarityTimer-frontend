import api from './api';

export interface HistorialPuntos {
  id: number;
  tipo: 'GANADO' | 'GASTADO' | 'BONUS' | 'REGALO';
  cantidad: number;
  descripcion?: string;
  fecha: string;
}

export interface ProgresoUsuario {
  puntosTotales: number;
  puntosDisponibles: number;
  streakDias: number;
  fechaUltimaSesion?: string;
}

export const estadisticaService = {
  getHistorialPuntos: async (): Promise<HistorialPuntos[]> => {
    const response = await api.get<HistorialPuntos[]>('/estadisticas/puntos/historial');
    return response.data;
  },

  getMiProgreso: async (): Promise<ProgresoUsuario> => {
    const response = await api.get<ProgresoUsuario>('/estadisticas/mi-progreso');
    return response.data;
  },

  getRanking: async (): Promise<any[]> => {
    const response = await api.get('/estadisticas/ranking');
    return response.data;
  },
};

