import { useState, useEffect } from 'react';
import { personajeService, type PersonajeSanrio, type InventarioUsuario } from '../services/personajeService';
import { useAuth } from '../contexts/AuthContext';

export default function VendedorDashboard() {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'productos' | 'adopciones'>('productos');
    const [personajes, setPersonajes] = useState<PersonajeSanrio[]>([]);
    const [adopciones, setAdopciones] = useState<InventarioUsuario[]>([]); // En un caso real, esto vendría de un endpoint de "todas las ventas"
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            // Obtiene TODOS los personajes (incluyendo no disponibles)
            const dataPersonajes = await personajeService.getAllAdmin();
            setPersonajes(dataPersonajes);

            // Obtiene todas las adopciones
            const dataAdopciones = await personajeService.getAllAdopciones();
            setAdopciones(dataAdopciones);
        } catch (error) {
            console.error('Error cargando datos de vendedor:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: 'Arial, sans-serif' }}>
            {/* Navbar */}
            <nav style={{ background: '#2c3e50', padding: '15px 30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🏪 Panel de Vendedor</h1>
                    <span style={{ background: '#e67e22', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>STAFF</span>
                </div>
                <button
                    onClick={logout}
                    style={{ background: '#c0392b', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Cerrar Sesión
                </button>
            </nav>

            <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button
                        onClick={() => setActiveTab('productos')}
                        style={{
                            padding: '12px 25px',
                            background: activeTab === 'productos' ? 'white' : 'transparent',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            color: activeTab === 'productos' ? '#2c3e50' : '#7f8c8d',
                            boxShadow: activeTab === 'productos' ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
                            cursor: 'pointer',
                            fontSize: '1.1rem'
                        }}
                    >
                        📦 Gestión de Productos
                    </button>
                    <button
                        onClick={() => setActiveTab('adopciones')}
                        style={{
                            padding: '12px 25px',
                            background: activeTab === 'adopciones' ? 'white' : 'transparent',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            color: activeTab === 'adopciones' ? '#2c3e50' : '#7f8c8d',
                            boxShadow: activeTab === 'adopciones' ? '0 4px 6px rgba(0,0,0,0.1)' : 'none',
                            cursor: 'pointer',
                            fontSize: '1.1rem'
                        }}
                    >
                        📜 Registro de Adopciones
                    </button>
                </div>

                {/* Content */}
                <div style={{ background: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>Cargando panel...</div>
                    ) : activeTab === 'productos' ? (
                        <div>
                            <div style={{ marginBottom: '20px' }}>
                                <h2 style={{ margin: 0, color: '#2c3e50' }}>Inventario de Tienda</h2>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>ID</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Personaje</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Categoría</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Precio</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {personajes.map(p => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                                            <td style={{ padding: '15px' }}>#{p.id}</td>
                                            <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img src={p.imagenEstudio} alt="" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                                <span style={{ fontWeight: 'bold' }}>{p.nombre}</span>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <span style={{ background: p.categoria.color || '#ddd', color: 'white', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem' }}>
                                                    {p.categoria.nombre}
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px' }}>💎 {p.precioPuntos}</td>
                                            <td style={{ padding: '15px' }}>
                                                {p.disponible ? (
                                                    <span style={{ color: '#27ae60', fontWeight: 'bold' }}>En Stock</span>
                                                ) : (
                                                    <span style={{ color: '#c0392b', fontWeight: 'bold' }}>Agotado</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div>
                            <h2 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Historial de Adopciones</h2>

                            {adopciones.length === 0 ? (
                                <div style={{ padding: '40px', textAlign: 'center', background: '#f8f9fa', borderRadius: '10px', color: '#7f8c8d' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📭</div>
                                    <p>No hay adopciones registradas aún.</p>
                                </div>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                            <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>ID Adopción</th>
                                            <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Usuario</th>
                                            <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Personaje</th>
                                            <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Fecha</th>
                                            <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Costo</th>
                                            <th style={{ padding: '15px', borderBottom: '2px solid #e9ecef' }}>Certificado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adopciones.map(a => (
                                            <tr key={a.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                                                <td style={{ padding: '15px', fontFamily: 'monospace', color: '#7f8c8d' }}>#{a.id}</td>
                                                <td style={{ padding: '15px', fontWeight: 'bold' }}>
                                                    {/* Nota: InventarioUsuario tiene objeto Usuario completo, pero typescript interface podría necesitar actualización si no lo tiene */}
                                                    {/* Asumimos que el backend devuelve el objeto usuario anidado */}
                                                    {(a as any).usuario?.username || 'Usuario Desconocido'}
                                                </td>
                                                <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <img src={a.personaje.imagenEstudio} alt="" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                                                    <span>{a.personaje.nombre}</span>
                                                </td>
                                                <td style={{ padding: '15px' }}>
                                                    {new Date(a.fechaObtencion).toLocaleDateString()}
                                                </td>
                                                <td style={{ padding: '15px' }}>💎 {a.puntosGastados}</td>
                                                <td style={{ padding: '15px' }}>
                                                    <span
                                                        title={a.codigoCertificado}
                                                        style={{
                                                            background: '#ecf0f1',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontFamily: 'monospace',
                                                            fontSize: '0.8rem',
                                                            cursor: 'help',
                                                            display: 'inline-block',
                                                            maxWidth: '150px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {a.codigoCertificado || 'N/A'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
