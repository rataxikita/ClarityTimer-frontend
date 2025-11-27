import React, { useState, useEffect } from 'react';
import { personajeService, PersonajeSanrio } from '../services/personajeService';

const AdminDashboard: React.FC = () => {
    const [products, setProducts] = useState<PersonajeSanrio[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editPrice, setEditPrice] = useState<number>(0);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await personajeService.getAllAdmin(); // Obtiene TODOS los personajes
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    // 🎯 PRESENTACIÓN: AdminDashboard - Actualización optimista
    // Permite edición inline de precios y toggle de disponibilidad
    // Usa map() para actualizaciones inmutables del estado
    // Actualiza la UI inmediatamente (optimista), luego confirma con el backend
    const handleToggleAvailability = async (id: number, currentStatus: boolean) => {
        try {
            await personajeService.update(id, { disponible: !currentStatus });
            // 🎯 PRESENTACIÓN: Actualización inmutable con map()
            setProducts(products.map(p =>
                p.id === id ? { ...p, disponible: !currentStatus } : p
            ));
        } catch (error) {
            console.error('Error updating availability:', error);
        }
    };

    const startEditing = (product: PersonajeSanrio) => {
        setEditingId(product.id);
        setEditPrice(product.precioPuntos);
    };

    // 🎯 PRESENTACIÓN: Edición inline de precios
    // Actualización optimista: UI se actualiza inmediatamente
    const savePrice = async (id: number) => {
        try {
            await personajeService.update(id, { precioPuntos: editPrice });
            // 🎯 PRESENTACIÓN: Actualización inmutable con map()
            setProducts(products.map(p =>
                p.id === id ? { ...p, precioPuntos: editPrice } : p
            ));
            setEditingId(null);
        } catch (error) {
            console.error('Error updating price:', error);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#2c3e50' }}>🛡️ Gestión de Productos (Personajes)</h2>
                <p style={{ color: '#7f8c8d', marginTop: '5px' }}>
                    Total: {products.length} personajes
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px' }}>Cargando productos...</div>
            ) : (
                <div style={{ overflowX: 'auto' }}>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>ID</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Personaje</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Categoría</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Precio (Puntos)</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Estado</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                                            <td style={{ padding: '15px' }}>#{product.id}</td>
                                            <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img src={product.imagenEstudio} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                                <span style={{ fontWeight: 'bold' }}>{product.nombre}</span>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <span style={{ background: product.categoria.color || '#ddd', color: 'white', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem' }}>
                                                    {product.categoria.nombre}
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                {editingId === product.id ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        <input
                                                            type="number"
                                                            value={editPrice}
                                                            onChange={(e) => setEditPrice(Number(e.target.value))}
                                                            style={{ width: '80px', padding: '5px', borderRadius: '4px', border: '1px solid #bdc3c7' }}
                                                        />
                                                        <button
                                                            onClick={() => savePrice(product.id)}
                                                            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                                            title="Guardar"
                                                        >
                                                            💾
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                                            title="Cancelar"
                                                        >
                                                            ❌
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span>💎 {product.precioPuntos}</span>
                                                        <button
                                                            onClick={() => startEditing(product)}
                                                            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem' }}
                                                            title="Editar Precio"
                                                        >
                                                            ✏️
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                {product.disponible ? (
                                                    <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Disponible</span>
                                                ) : (
                                                    <span style={{ color: '#c0392b', fontWeight: 'bold' }}>No Disponible</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <button
                                                    onClick={() => handleToggleAvailability(product.id, product.disponible)}
                                                    style={{
                                                        padding: '5px 10px',
                                                        borderRadius: '5px',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                        background: product.disponible ? '#e74c3c' : '#27ae60'
                                                    }}
                                                >
                                                    {product.disponible ? 'Desactivar' : 'Activar'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
