import { useState, useEffect, ChangeEvent } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { noteService, type Note } from '../services/noteService';
import { NOTE_CATEGORIES, type NoteCategory } from '../constants/settings';



interface Category {
  key: NoteCategory | 'all';
  name: string;
  color: string;
}

const categories: Category[] = [
  { key: 'general', name: '📝 General', color: '#667eea' },
  { key: 'study', name: '📚 Estudio', color: '#4ecdc4' },
  { key: 'break', name: '💤 Descanso', color: '#ff9a9e' },
  { key: 'ideas', name: '💡 Ideas', color: '#feca57' },
  { key: 'tasks', name: '✅ Tareas', color: '#48dbfb' }
];

export default function NotesManager() {
  const { settings } = useSettings();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | 'all'>('general');
  const [showAddNote, setShowAddNote] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await noteService.getAll();
      setNotes(data);
    } catch (error) {
      console.error('Error cargando notas:', error);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      const createdNote = await noteService.create({
        content: newNote.trim(),
        category: selectedCategory as NoteCategory,
        completed: false,
        pinned: false
      });

      setNotes([createdNote, ...notes]);
      setNewNote('');
      setShowAddNote(false);
    } catch (error) {
      console.error('Error creando nota:', error);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      await noteService.delete(id);
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error eliminando nota:', error);
    }
  };

  const toggleComplete = async (id: number) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    try {
      const updatedNote = await noteService.update(id, { completed: !note.completed });
      setNotes(notes.map(n => n.id === id ? updatedNote : n));
    } catch (error) {
      console.error('Error actualizando nota:', error);
    }
  };

  const togglePin = async (id: number) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    try {
      const updatedNote = await noteService.update(id, { pinned: !note.pinned });
      setNotes(notes.map(n => n.id === id ? updatedNote : n));
    } catch (error) {
      console.error('Error actualizando nota:', error);
    }
  };

  // 🎯 PRESENTACIÓN: NotesManager - Filtrado y ordenamiento multinivel
  // Filtrado por categoría y ordenamiento: primero las notas fijadas, luego por fecha descendente
  // Usa actualizaciones optimistas: actualiza la UI inmediatamente, luego confirma con el backend
  const filteredNotes = notes
    .filter(note =>
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'all' || note.category === selectedCategory)
    )
    .sort((a, b) => {
      // 🎯 PRESENTACIÓN: Ordenamiento multinivel
      // 1. Primero las notas fijadas (pinned)
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // 2. Luego por fecha descendente (más recientes primero)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '15px',
      padding: '20px',
      margin: '20px 0',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <h3 style={{
          color: '#4a5568',
          margin: 0,
          fontSize: '1.3rem'
        }}>
          📝 Notas y Recordatorios
        </h3>
        <button
          onClick={() => setShowAddNote(!showAddNote)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          {showAddNote ? 'Cancelar' : '➕ Nueva Nota'}
        </button>
      </div>

      {/* Agregar nueva nota */}
      {showAddNote && (
        <div style={{
          background: 'rgba(255,255,255,0.8)',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '2px solid #e2e8f0'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#4a5568' }}>
            ✍️ Nueva Nota
          </h4>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: 'bold' }}>
              Categoría:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as NoteCategory)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '2px solid #e2e8f0',
                fontSize: '14px'
              }}
            >
              {categories.filter(c => c.key !== 'all').map(category => (
                <option key={category.key} value={category.key}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#4a5568', fontWeight: 'bold' }}>
              Contenido:
            </label>
            <textarea
              value={newNote}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewNote(e.target.value)}
              placeholder="Escribe tu nota aquí..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                borderRadius: '6px',
                border: '2px solid #e2e8f0',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowAddNote(false)}
              style={{
                background: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={addNote}
              style={{
                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Guardar Nota
            </button>
          </div>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="🔍 Buscar notas..."
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '2px solid #e2e8f0',
              fontSize: '14px'
            }}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value as NoteCategory | 'all')}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '2px solid #e2e8f0',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          <option value="all">📋 Todas las categorías</option>
          {categories.filter(c => c.key !== 'all').map(category => (
            <option key={category.key} value={category.key}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de notas */}
      <div style={{
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {filteredNotes.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#718096',
            fontSize: '1.1rem'
          }}>
            {searchTerm || selectedCategory !== 'all'
              ? '🔍 No se encontraron notas que coincidan con tu búsqueda'
              : '📝 No hay notas aún. ¡Crea tu primera nota!'
            }
          </div>
        ) : (
          filteredNotes.map(note => {
            const category = categories.find(cat => cat.key === note.category);
            return (
              <div
                key={note.id}
                style={{
                  background: note.pinned ? 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)' : 'rgba(255,255,255,0.8)',
                  padding: '15px',
                  borderRadius: '10px',
                  marginBottom: '10px',
                  border: `2px solid ${category?.color || '#e2e8f0'}`,
                  opacity: note.completed ? 0.6 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        background: category?.color || '#e2e8f0',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {category?.name || '📝'}
                      </span>

                      {note.pinned && (
                        <span style={{ fontSize: '1.2rem' }}>📌</span>
                      )}

                      <span style={{
                        color: '#718096',
                        fontSize: '0.8rem'
                      }}>
                        {formatDate(note.createdAt)}
                      </span>
                    </div>

                    <p style={{
                      margin: 0,
                      textDecoration: note.completed ? 'line-through' : 'none',
                      color: note.completed ? '#718096' : '#4a5568',
                      lineHeight: '1.5'
                    }}>
                      {note.content}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '5px'
                  }}>
                    <button
                      onClick={() => togglePin(note.id)}
                      style={{
                        background: 'rgba(255,255,255,0.3)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                      title={note.pinned ? 'Desanclar' : 'Anclar'}
                    >
                      {note.pinned ? '📌' : '📍'}
                    </button>

                    <button
                      onClick={() => toggleComplete(note.id)}
                      style={{
                        background: note.completed
                          ? 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)'
                          : 'rgba(255,255,255,0.3)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: note.completed ? 'white' : 'inherit'
                      }}
                      title={note.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                    >
                      {note.completed ? '✅' : '⭕'}
                    </button>

                    <button
                      onClick={() => deleteNote(note.id)}
                      style={{
                        background: 'rgba(255,255,255,0.3)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: '#e74c3c'
                      }}
                      title="Eliminar nota"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Estadísticas */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: 'rgba(255,255,255,0.8)',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, color: '#4a5568', fontSize: '0.9rem' }}>
          📊 Total de notas: {notes.length} |
          Completadas: {notes.filter(note => note.completed).length} |
          Ancladas: {notes.filter(note => note.pinned).length}
        </p>
      </div>
    </div>
  );
}

