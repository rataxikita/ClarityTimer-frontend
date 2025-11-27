import api from './api';

export interface Usuario {
    id: number;
    username: string;
    email: string;
    nombre: string;
    apellido: string;
    rol: 'ADMIN' | 'VENDEDOR' | 'CLIENTE';
    puntosTotales: number;
    puntosDisponibles: number;
    streakDias: number;
    activo: boolean;
    fechaRegistro: string;
}

export const usuarioService = {
    getAll: async (): Promise<Usuario[]> => {
        const response = await api.get('/usuarios/admin/all');
        return response.data;
    },

    getById: async (id: number): Promise<Usuario> => {
        const response = await api.get(`/usuarios/admin/${id}`);
        return response.data;
    },

    updateRol: async (id: number, rol: 'ADMIN' | 'VENDEDOR' | 'CLIENTE'): Promise<Usuario> => {
        const response = await api.put(`/usuarios/admin/${id}/rol`, { rol });
        return response.data;
    },

    toggleActivo: async (id: number): Promise<Usuario> => {
        const response = await api.put(`/usuarios/admin/${id}/activo`);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/usuarios/admin/${id}`);
    }
};

