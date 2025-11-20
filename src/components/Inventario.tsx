import { useState, useEffect } from 'react';
import { personajeService, type InventarioUsuario } from '../services/personajeService';
import { useAuth } from '../contexts/AuthContext';
import PersonajeCard from './PersonajeCard';
import CertificateModal from './CertificateModal';

export default function Inventario() {
  const { user } = useAuth();
  const [inventario, setInventario] = useState<InventarioUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<InventarioUsuario | null>(null);

  useEffect(() => {
    if (user) {
      cargarInventario();
    }
  }, [user?.id]);

  const cargarInventario = async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await personajeService.getDesbloqueados();
      setInventario(datos);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el inventario');
    } finally {
      setLoading(false);
    }
  };

  const handleActualizacion = () => {
    cargarInventario();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
        <p style={{ color: '#4a5568' }}>Cargando inventario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>❌</div>
        <p style={{ color: '#e74c3c', marginBottom: '20px' }}>{error}</p>
        <button
          onClick={cargarInventario}
          style={{
            padding: '10px 20px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  const personajeActivo = inventario.find(inv => inv.esActivo);
  const personajesInactivos = inventario.filter(inv => !inv.esActivo);

  return (
    <div>
      <h3 style={{
        color: '#4a5568',
        marginBottom: '20px',
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
        🎁 Mi Inventario ({inventario.length} personajes)
      </h3>

      {inventario.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#f7fafc',
          borderRadius: '15px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📦</div>
          <p style={{ color: '#718096', fontSize: '1.1rem', marginBottom: '10px' }}>
            Aún no tienes personajes en tu inventario.
          </p>
          <p style={{ color: '#a0aec0', fontSize: '0.9rem' }}>
            Ve a la tienda para comprar tu primer personaje.
          </p>
        </div>
      ) : (
        <>
          {personajeActivo && (
            <div style={{ marginBottom: '30px' }}>
              <h4 style={{
                color: '#4a5568',
                marginBottom: '15px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                ⭐ Personaje Activo
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                <PersonajeCard
                  personaje={personajeActivo.personaje}
                  inventario={inventario}
                  onCompraExitosa={handleActualizacion}
                  onViewCertificate={() => setSelectedCertificate(personajeActivo)}
                />
              </div>
            </div>
          )}

          {personajesInactivos.length > 0 && (
            <div>
              <h4 style={{
                color: '#4a5568',
                marginBottom: '15px',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                📚 Otros Personajes ({personajesInactivos.length})
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                {personajesInactivos.map((inv) => (
                  <PersonajeCard
                    key={inv.id}
                    personaje={inv.personaje}
                    inventario={inventario}
                    onCompraExitosa={handleActualizacion}
                    onViewCertificate={() => setSelectedCertificate(inv)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {selectedCertificate && (
        <CertificateModal
          isOpen={!!selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
          item={selectedCertificate}
        />
      )}
    </div>
  );
}

