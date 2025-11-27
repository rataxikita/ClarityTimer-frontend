import React, { useState, useEffect } from 'react';
import { usuarioService, Usuario } from '../services/usuarioService';

const UserManager: React.FC = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingRol, setEditingRol] = useState<number | null>(null);
    const [selectedRol, setSelectedRol] = useState<'ADMIN' | 'VENDEDOR' | 'CLIENTE'>('CLIENTE');

    useEffect(() => {
        loadUsuarios();
    }, []);

    const loadUsuarios = async () => {
        try {
            const data = await usuarioService.getAll();
            setUsuarios(data);
        } catch (error) {
            console.error('Error loading usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRol = async (id: number) => {
        try {
            await usuarioService.updateRol(id, selectedRol);
            setUsuarios(usuarios.map(u =>
                u.id === id ? { ...u, rol: selectedRol } : u
            ));
            setEditingRol(null);
        } catch (error) {
            console.error('Error updating rol:', error);
            alert('Error al actualizar el rol');
        }
    };

    const handleToggleActivo = async (id: number, currentStatus: boolean) => {
        try {
            console.log('🔄 Toggle activo - ID:', id, 'Estado actual:', currentStatus);
            const usuarioActualizado = await usuarioService.toggleActivo(id);
            console.log('✅ Usuario actualizado desde backend:', usuarioActualizado);
            setUsuarios(usuarios.map(u =>
                u.id === id ? { ...u, activo: usuarioActualizado.activo } : u
            ));
            console.log('✅ Estado actualizado en frontend');
        } catch (error: any) {
            console.error('❌ Error toggling activo:', error);
            console.error('❌ Detalles del error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            alert(error.response?.data?.message || 'Error al cambiar el estado');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) {
            return;
        }
        try {
            await usuarioService.delete(id);
            setUsuarios(usuarios.filter(u => u.id !== id));
        } catch (error: any) {
            console.error('Error deleting usuario:', error);
            alert(error.response?.data?.message || 'Error al eliminar el usuario');
        }
    };

    const getRolColor = (rol: string) => {
        switch (rol) {
            case 'ADMIN': return '#e74c3c';
            case 'VENDEDOR': return '#3498db';
            case 'CLIENTE': return '#27ae60';
            default: return '#95a5a6';
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Cargando usuarios...</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#2c3e50' }}>👥 Gestión de Usuarios</h2>
                <p style={{ color: '#7f8c8d', marginTop: '5px' }}>
                    Total: {usuarios.length} usuarios
                </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                            <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>ID</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Username</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Email</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Nombre</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Rol</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Puntos</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Estado</th>
                            <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                                <td style={{ padding: '15px' }}>#{usuario.id}</td>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{usuario.username}</td>
                                <td style={{ padding: '15px' }}>{usuario.email}</td>
                                <td style={{ padding: '15px' }}>
                                    {usuario.nombre} {usuario.apellido}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {editingRol === usuario.id ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <select
                                                value={selectedRol}
                                                onChange={(e) => setSelectedRol(e.target.value as any)}
                                                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #bdc3c7' }}
                                            >
                                                <option value="CLIENTE">CLIENTE</option>
                                                <option value="VENDEDOR">VENDEDOR</option>
                                                <option value="ADMIN">ADMIN</option>
                                            </select>
                                            <button
                                                onClick={() => handleUpdateRol(usuario.id)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                                title="Guardar"
                                            >
                                                💾
                                            </button>
                                            <button
                                                onClick={() => setEditingRol(null)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                                title="Cancelar"
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{
                                                background: getRolColor(usuario.rol),
                                                color: 'white',
                                                padding: '4px 10px',
                                                borderRadius: '15px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {usuario.rol}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setEditingRol(usuario.id);
                                                    setSelectedRol(usuario.rol);
                                                }}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}
                                                title="Editar Rol"
                                            >
                                                ✏️
                                            </button>
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    💎 {usuario.puntosDisponibles} / {usuario.puntosTotales}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    {usuario.activo ? (
                                        <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Activo</span>
                                    ) : (
                                        <span style={{ color: '#c0392b', fontWeight: 'bold' }}>Inactivo</span>
                                    )}
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button
                                            onClick={() => handleToggleActivo(usuario.id, usuario.activo)}
                                            style={{
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                color: 'white',
                                                background: usuario.activo ? '#e74c3c' : '#27ae60',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {usuario.activo ? 'Desactivar' : 'Activar'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(usuario.id)}
                                            style={{
                                                padding: '5px 10px',
                                                borderRadius: '5px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                color: 'white',
                                                background: '#c0392b',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManager;

