import { useState, useEffect, useRef } from 'react';
import { CHARACTER_PATHS } from '../constants/settings';

interface FloatingPetProps {
  isBreak: boolean;
  isPaused: boolean;
}

export default function FloatingPet({ isBreak, isPaused }: FloatingPetProps) {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showMotivationalMessage, setShowMotivationalMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  
  const petRef = useRef<HTMLDivElement>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Frases de motivación
  const motivationalMessages = [
    "¡Tú puedes! 💪 Cada minuto de estudio te acerca a tus metas",
    "Recuerda: el conocimiento es poder 🧠",
    "¡Mantén el foco! Estás haciendo un excelente trabajo",
    "Cada sesión de estudio te hace más fuerte 💪",
    "¡No te rindas! El éxito está a la vuelta de la esquina",
    "Tu futuro yo te agradecerá por este esfuerzo 🌟",
    "¡Sigue así! Estás construyendo un futuro brillante",
    "Cada paso cuenta, no importa lo pequeño que sea",
    "¡Eres capaz de lograr grandes cosas! 🎯",
    "El estudio es la inversión que siempre da retornos"
  ];

  // Mostrar mensaje motivacional cuando se pausa
  useEffect(() => {
    if (isPaused && !isBreak) {
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setCurrentMessage(randomMessage);
      setShowMotivationalMessage(true);
      
      // Limpiar timeout anterior
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
      
      // Ocultar mensaje después de 5 segundos
      messageTimeoutRef.current = setTimeout(() => {
        setShowMotivationalMessage(false);
      }, 5000);
    } else {
      setShowMotivationalMessage(false);
    }

    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, [isPaused, isBreak]);

  // Manejar el inicio del drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Solo botón izquierdo
    if (!petRef.current) return;
    
    const rect = petRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  // Manejar el movimiento del drag
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Mantener dentro de los límites de la ventana
    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 100;
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  // Manejar el fin del drag
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Toggle visibilidad
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Toggle minimizado
  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
  };

  // Efectos para el drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isVisible) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          cursor: 'pointer'
        }}
        onClick={toggleVisibility}
      >
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          color: 'white',
          fontSize: '20px'
        }}>
          🐾
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mascota flotante */}
      <div
        ref={petRef}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 1000,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          transition: isDragging ? 'none' : 'all 0.3s ease'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Contenedor principal */}
        <div style={{
          background: isBreak 
            ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' 
            : 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          borderRadius: '25px',
          padding: '20px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.2)',
          border: '3px solid rgba(255,255,255,0.4)',
          minWidth: isMinimized ? '70px' : '140px',
          minHeight: isMinimized ? '70px' : '140px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          {/* Efecto de brillo */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
            animation: 'shine 3s infinite',
            pointerEvents: 'none'
          }}></div>
          
          {/* Imagen del personaje */}
          <img
            src={isBreak ? CHARACTER_PATHS.CINNAMOROLL_BREAK : CHARACTER_PATHS.CINNAMOROLL_STUDY}
            alt="Mascota"
            style={{
              width: isMinimized ? '45px' : '90px',
              height: 'auto',
              filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))',
              transition: 'all 0.3s ease',
              zIndex: 1,
              position: 'relative'
            }}
          />

          {/* Controles */}
          {!isMinimized && (
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '8px',
              zIndex: 2,
              position: 'relative'
            }}>
              <button
                onClick={toggleMinimized}
                style={{
                  background: 'rgba(255,255,255,0.4)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = 'scale(1)';
                }}
                title="Minimizar"
              >
                ➖
              </button>
              <button
                onClick={toggleVisibility}
                style={{
                  background: 'rgba(255,255,255,0.4)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = 'scale(1)';
                }}
                title="Ocultar"
              >
                ✕
              </button>
            </div>
          )}

          {/* Botón para expandir si está minimizado */}
          {isMinimized && (
            <button
              onClick={toggleMinimized}
              style={{
                background: 'rgba(255,255,255,0.4)',
                border: 'none',
                borderRadius: '50%',
                width: '25px',
                height: '25px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                position: 'absolute',
                top: '8px',
                right: '8px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 2
              }}
              onMouseOver={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'scale(1)';
              }}
              title="Expandir"
            >
              ➕
            </button>
          )}
        </div>
      </div>

      {/* Mensaje motivacional */}
      {showMotivationalMessage && (
        <div style={{
          position: 'fixed',
          left: position.x + 140,
          top: position.y,
          zIndex: 1001,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
          maxWidth: '300px',
          animation: 'slideIn 0.3s ease'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '20px' }}>💪</span>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
              {currentMessage}
            </p>
          </div>
          <div style={{
            position: 'absolute',
            left: '-10px',
            top: '20px',
            width: '0',
            height: '0',
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
            borderRight: '10px solid #667eea'
          }}></div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }
      `}</style>
    </>
  );
}

