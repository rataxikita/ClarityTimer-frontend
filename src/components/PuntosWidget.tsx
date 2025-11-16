import { useAuth } from '../contexts/AuthContext';
import { estadisticaService, type ProgresoUsuario } from '../services/estadisticaService';
import { useState, useEffect } from 'react';

export default function PuntosWidget() {
  const { user } = useAuth();
  const [progreso, setProgreso] = useState<ProgresoUsuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProgreso();
  }, [user?.id]);

  const cargarProgreso = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const datos = await estadisticaService.getMiProgreso();
      setProgreso(datos);
    } catch (error) {
      console.error('Error cargando progreso:', error);
      // Usar datos del usuario si hay error
      if (user) {
        setProgreso({
          puntosTotales: user.puntosTotales,
          puntosDisponibles: user.puntosDisponibles,
          streakDias: user.streakDias,
          fechaUltimaSesion: undefined
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const datos = progreso || {
    puntosTotales: user.puntosTotales,
    puntosDisponibles: user.puntosDisponibles,
    streakDias: user.streakDias,
    fechaUltimaSesion: undefined
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '15px',
      padding: '25px',
      color: 'white',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
      marginBottom: '20px'
    }}>
      <h3 style={{
        margin: '0 0 20px 0',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        💎 Mis Puntos
      </h3>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '2rem' }}>⏳</div>
          <p>Cargando...</p>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💎</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                {datos.puntosDisponibles}
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                Puntos Disponibles
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔥</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                {datos.streakDias}
              </div>
              <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                Días de Racha
              </div>
            </div>
          </div>

          {datos.streakDias > 0 && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '10px',
              padding: '12px',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              {datos.streakDias >= 30 && '🏆 ¡Racha de 1 mes! +50 puntos bonus'}
              {datos.streakDias >= 7 && datos.streakDias < 30 && '🎉 ¡Racha de 1 semana! +20 puntos bonus'}
              {datos.streakDias >= 3 && datos.streakDias < 7 && '✨ ¡Racha de 3 días! +10 puntos bonus'}
              {datos.streakDias < 3 && `¡Sigue así! Completa ${3 - datos.streakDias} días más para bonus`}
            </div>
          )}
        </>
      )}
    </div>
  );
}

