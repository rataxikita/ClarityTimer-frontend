import { useState, useEffect } from 'react';
import { estadisticaService, type HistorialPuntos } from '../services/estadisticaService';
import { useAuth } from '../contexts/AuthContext';

export default function HistorialPuntosComponent() {
  const { user } = useAuth();
  const [historial, setHistorial] = useState<HistorialPuntos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      cargarHistorial();
    }
  }, [user?.id]);

  const cargarHistorial = async () => {
    setLoading(true);
    setError(null);
    try {
      const datos = await estadisticaService.getHistorialPuntos();
      setHistorial(datos);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  const getTipoIcono = (tipo: string) => {
    switch (tipo) {
      case 'GANADO': return '💰';
      case 'GASTADO': return '🛍️';
      case 'BONUS': return '🎁';
      case 'REGALO': return '🎉';
      default: return '💎';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'GANADO': return '#4ecdc4';
      case 'GASTADO': return '#ff6b6b';
      case 'BONUS': return '#feca57';
      case 'REGALO': return '#ff9ff3';
      default: return '#667eea';
    }
  };

  const formatearFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      const hoy = new Date();
      const ayer = new Date(hoy);
      ayer.setDate(ayer.getDate() - 1);

      if (date.toDateString() === hoy.toDateString()) {
        return 'Hoy';
      } else if (date.toDateString() === ayer.toDateString()) {
        return 'Ayer';
      } else {
        return date.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      }
    } catch {
      return fecha;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
        <p style={{ color: '#4a5568' }}>Cargando historial...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>❌</div>
        <p style={{ color: '#e74c3c', marginBottom: '20px' }}>{error}</p>
        <button
          onClick={cargarHistorial}
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

  return (
    <div>
      <h3 style={{
        color: '#4a5568',
        marginBottom: '20px',
        fontSize: '1.5rem',
        fontWeight: 'bold'
      }}>
        📜 Historial de Puntos
      </h3>

      {historial.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: '#f7fafc',
          borderRadius: '15px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📝</div>
          <p style={{ color: '#718096', fontSize: '1.1rem' }}>
            Aún no tienes transacciones de puntos.
          </p>
          <p style={{ color: '#a0aec0', fontSize: '0.9rem', marginTop: '10px' }}>
            Completa pomodoros para ganar puntos y verlos aquí.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {historial.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '15px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                borderLeft: `4px solid ${getTipoColor(item.tipo)}`,
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{
                fontSize: '2rem',
                width: '50px',
                textAlign: 'center'
              }}>
                {getTipoIcono(item.tipo)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: 'bold',
                  color: '#4a5568',
                  marginBottom: '5px',
                  fontSize: '1rem'
                }}>
                  {item.descripcion || (item.tipo === 'GANADO' ? 'Puntos ganados' : 
                    item.tipo === 'GASTADO' ? 'Puntos gastados' : 
                    item.tipo === 'BONUS' ? 'Bonus por racha' : 
                    item.tipo === 'REGALO' ? 'Puntos de bienvenida' : 
                    'Transacción')}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: '#718096'
                }}>
                  {item.fecha ? formatearFecha(item.fecha) : 'Fecha no disponible'}
                </div>
              </div>

              <div style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: getTipoColor(item.tipo),
                minWidth: '80px',
                textAlign: 'right'
              }}>
                {item.tipo === 'GASTADO' ? '-' : '+'}{item.cantidad}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

