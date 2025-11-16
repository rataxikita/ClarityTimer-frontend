import { useEffect, useState } from 'react';
import { useTimer } from '../contexts/TimerContext';

export default function GlobalStatusIndicator() {
  const { 
    minutes, 
    seconds, 
    isRunning, 
    isBreak, 
    session
  } = useTimer();

  const [isVisible, setIsVisible] = useState(false);

  // Para web, siempre mostrar (ya no hay Electron)
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 999,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '15px',
      borderRadius: '15px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
      border: '2px solid rgba(255,255,255,0.3)',
      minWidth: '200px',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <h4 style={{ margin: 0, fontSize: '1rem' }}>
          🌟 Estado Global
        </h4>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: isRunning ? '#4ecdc4' : '#ff6b6b',
          animation: isRunning ? 'pulse 1.5s infinite' : 'none'
        }}></div>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <span style={{ fontSize: '0.9rem', opacity: '0.9' }}>
          {isBreak ? '💤 Descanso' : '📚 Estudio'}
        </span>
        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <span style={{ fontSize: '0.9rem', opacity: '0.9' }}>
          Sesión {session}
        </span>
        <span style={{ fontSize: '0.9rem' }}>
          {isRunning ? '▶️ Ejecutando' : '⏸️ Pausado'}
        </span>
      </div>
      

      <style>{`
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

