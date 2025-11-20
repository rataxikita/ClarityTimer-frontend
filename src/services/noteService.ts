import api from './api';
import { NoteCategory } from '../constants/settings';

export interface Note {
    id: number;
    content: string;
    category: NoteCategory;
    createdAt: string;
    completed: boolean;
    pinned: boolean;
}

export const noteService = {
    getAll: async (): Promise<Note[]> => {
        const response = await api.get('/notas');
        return response.data;
    },

    create: async (note: Omit<Note, 'id' | 'createdAt'>): Promise<Note> => {
        const response = await api.post('/notas', note);
        return response.data;
    },

    update: async (id: number, note: Partial<Note>): Promise<Note> => {
        const response = await api.put(`/notas/${id}`, note);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/notas/${id}`);
    }
};
