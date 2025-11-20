import api from './api';

export interface PersonajeSanrio {
  id: number;
  nombre: string;
  descripcion?: string;
  categoria: {
    id: number;
    nombre: string;
    color?: string;
    icono?: string;
  };
  precioPuntos: number;
  rareza: string;
  imagenEstudio: string;
  imagenDescanso: string;
  disponible: boolean;
  esDefault: boolean;
  ordenTienda: number;
}

export interface InventarioUsuario {
  id: number;
  personaje: PersonajeSanrio;
  fechaObtencion: string;
  puntosGastados: number;
  esActivo: boolean;
  vecesUsado: number;
  codigoCertificado?: string;
}

export interface CompraResponse {
  exito: boolean;
  mensaje: string;
  puntosRestantes: number;
}

export const personajeService = {
  getAll: async (): Promise<PersonajeSanrio[]> => {
    const response = await api.get<PersonajeSanrio[]>('/personajes');
    return response.data;
  },

  // Para Admin/Vendedor: obtiene TODOS los personajes (incluyendo no disponibles)
  getAllAdmin: async (): Promise<PersonajeSanrio[]> => {
    const response = await api.get<PersonajeSanrio[]>('/personajes/admin/all');
    return response.data;
  },

  getById: async (id: number): Promise<PersonajeSanrio> => {
    const response = await api.get<PersonajeSanrio>(`/personajes/${id}`);
    return response.data;
  },

  getByCategoria: async (categoriaId: number): Promise<PersonajeSanrio[]> => {
    const response = await api.get<PersonajeSanrio[]>(`/personajes/categoria/${categoriaId}`);
    return response.data;
  },

  getDisponibles: async (): Promise<PersonajeSanrio[]> => {
    const response = await api.get<PersonajeSanrio[]>('/personajes/disponibles');
    return response.data;
  },

  getDesbloqueados: async (): Promise<InventarioUsuario[]> => {
    const response = await api.get<InventarioUsuario[]>('/personajes/desbloqueados');
    return response.data;
  },

  comprar: async (personajeId: number): Promise<CompraResponse> => {
    const response = await api.post<CompraResponse>(`/personajes/${personajeId}/comprar`);
    return response.data;
  },

  activar: async (id: number) => {
    await api.put(`/personajes/${id}/activar`);
  },

  update: async (id: number, data: Partial<PersonajeSanrio>) => {
    const response = await api.put(`/personajes/${id}`, data);
    return response.data;
  },

  getAllAdopciones: async (): Promise<InventarioUsuario[]> => {
    const response = await api.get<InventarioUsuario[]>('/personajes/admin/adopciones');
    return response.data;
  }
};
