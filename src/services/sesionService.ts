import api from './api';

export interface DetalleSesionRequest {
  numeroPomodoro: number;
  duracionMinutos: number;
  tipo: 'TRABAJO' | 'DESCANSO_CORTO' | 'DESCANSO_LARGO';
  puntosOtorgados: number;
  completado: boolean;
  horaInicio?: string; // Formato: "HH:mm:ss" (solo hora, no fecha completa)
  horaFin?: string; // Formato: "HH:mm:ss"
  tareaDescripcion?: string;
}

export interface SesionPomodoroRequest {
  personajeUsadoId: number;
  detalles: DetalleSesionRequest[];
}

export interface SesionPomodoro {
  id: number;
  fecha: string;
  horaInicio?: string;
  horaFin?: string;
  totalPomodoros: number;
  tiempoTotalMinutos: number;
  puntosGanados: number;
  puntosBonus: number;
  personajeUsado?: {
    id: number;
    nombre: string;
  };
  completada: boolean;
  detalles: Array<{
    id: number;
    numeroPomodoro: number;
    duracionMinutos: number;
    tipo: string;
    puntosOtorgados: number;
    completado: boolean;
  }>;
}

export const sesionService = {
  crear: async (data: SesionPomodoroRequest): Promise<SesionPomodoro> => {
    const response = await api.post<SesionPomodoro>('/sesiones', data);
    return response.data;
  },

  completar: async (sesionId: number): Promise<void> => {
    await api.post(`/sesiones/${sesionId}/completar`);
  },

  getById: async (id: number): Promise<SesionPomodoro> => {
    const response = await api.get<SesionPomodoro>(`/sesiones/${id}`);
    return response.data;
  },

  getMisSesiones: async (): Promise<SesionPomodoro[]> => {
    const response = await api.get<SesionPomodoro[]>('/sesiones');
    return response.data;
  },
};

