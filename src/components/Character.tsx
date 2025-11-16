import { useAuth } from '../contexts/AuthContext';
import { personajeService } from '../services/personajeService';
import { useState, useEffect } from 'react';

interface CharacterProps {
  isBreak: boolean;
}

export default function Character({ isBreak }: CharacterProps) {
  const { user } = useAuth();
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const [nombrePersonaje, setNombrePersonaje] = useState<string>('Cinnamoroll');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPersonaje = async () => {
      if (user?.personajeActivoId) {
        try {
          setLoading(true);
          const personaje = await personajeService.getById(user.personajeActivoId);
          const rutaImagen = isBreak ? personaje.imagenDescanso : personaje.imagenEstudio;
          setImagenUrl(rutaImagen || null);
          setNombrePersonaje(personaje.nombre);
        } catch (error) {
          console.error('Error cargando personaje:', error);
          // Usar imagen por defecto si hay error
          setImagenUrl(isBreak ? '/characters/cinnamoroll-break.png' : '/characters/cinnamoroll-study.png');
        } finally {
          setLoading(false);
        }
      } else {
        // Si no hay personaje activo, usar Cinnamoroll por defecto
        setImagenUrl(isBreak ? '/characters/cinnamoroll-break.png' : '/characters/cinnamoroll-study.png');
        setNombrePersonaje('Cinnamoroll');
        setLoading(false);
      }
    };

    cargarPersonaje();
  }, [user?.personajeActivoId, isBreak]);

  const rutaFinal = imagenUrl || (isBreak ? '/characters/cinnamoroll-break.png' : '/characters/cinnamoroll-study.png');

  return (
    <div style={{ 
      marginTop: "20px",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <div style={{
        position: 'relative',
        padding: '20px',
        borderRadius: '20px',
        background: 'white',
        border: `2px solid ${isBreak ? '#ff9a9e' : '#a8edea'}`,
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        transform: 'scale(1)',
        transition: 'all 0.3s ease',
        animation: isBreak ? 'bounce 2s infinite' : 'pulse 3s infinite',
        minHeight: '220px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {loading ? (
          <div style={{ fontSize: '3rem' }}>⏳</div>
        ) : (
          <img
            src={rutaFinal}
            alt={`${nombrePersonaje} ${isBreak ? 'descanso' : 'estudio'}`}
            style={{ 
              width: "180px", 
              height: "auto",
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
              transition: 'transform 0.3s ease',
              maxHeight: '180px',
              objectFit: 'contain'
            }}
            onMouseOver={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.transform = 'scale(1)';
            }}
            onError={(e) => {
              // Si la imagen falla, usar placeholder
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<div style="font-size: 4rem; color: white;">🎴</div>';
              }
            }}
          />
        )}
      </div>
      
      <p style={{
        marginTop: '15px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: isBreak ? '#ff6b6b' : '#4ecdc4',
        textAlign: 'center',
        opacity: '0.8'
      }}>
        {isBreak ? '💤 ¡Hora de descansar!' : '📚 ¡A estudiar!'}
      </p>
      
      {nombrePersonaje && (
        <p style={{
          marginTop: '5px',
          fontSize: '14px',
          fontWeight: 'normal',
          color: '#718096',
          textAlign: 'center',
          opacity: '0.7'
        }}>
          {nombrePersonaje}
        </p>
      )}
      
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) scale(1);
          }
          40% {
            transform: translateY(-10px) scale(1.02);
          }
          60% {
            transform: translateY(-5px) scale(1.01);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

