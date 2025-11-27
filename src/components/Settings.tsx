import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import {
  TIME_CONSTRAINTS
} from '../constants/settings';

export default function Settings() {
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();
  const [studyTime, setStudyTime] = useState<number | string>(settings.studyTime);
  const [breakTime, setBreakTime] = useState<number | string>(settings.breakTime);
  const [totalSessions, setTotalSessions] = useState<number | string>(settings.totalSessions);
  const [autoMode, setAutoMode] = useState(settings.autoMode);
  
  // Estado para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Actualizar estado local cuando cambie la configuración
  useEffect(() => {
    setStudyTime(settings.studyTime);
    setBreakTime(settings.breakTime);
    setTotalSessions(settings.totalSessions);
    setAutoMode(settings.autoMode);
  }, [settings]);

  // Validación suave para inputs
  const handleInputChange = (
    setter: (value: number | string) => void,
    value: string,
    min = 1,
    max = 120
  ) => {
    // Solo permitir números
    const numericValue = value.replace(/[^0-9]/g, '');

    // Si está vacío, permitir que se borre completamente
    if (numericValue === '') {
      setter('');
      return;
    }

    const numValue = parseInt(numericValue);
    if (numValue >= min && numValue <= max) {
      setter(numValue);
    }
  };

  const handleSave = () => {
    // Validar que todos los campos tengan valores válidos
    if (typeof studyTime !== 'number' || typeof breakTime !== 'number' || typeof totalSessions !== 'number') {
      alert('Por favor, completa todos los campos con valores válidos.');
      return;
    }

    // Actualizar configuración usando el contexto
    const newSettings = {
      studyTime,
      breakTime,
      totalSessions,
      autoMode,
      selectedCharacter: settings.selectedCharacter // Mantener el personaje actual sin cambios
    };

    const result = updateSettings(newSettings);

    if (result.success) {
      // Mostrar notificación de éxito
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4ecdc4;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: bold;
        animation: slideIn 0.3s ease;
      `;
      notification.textContent = '✅ Configuración guardada';
      document.body.appendChild(notification);

      // Remover notificación después de 3 segundos
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);
    } else {
      alert(`Error al guardar configuración: ${result.error}`);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    setPasswordSuccess(false);

    // Validaciones
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Por favor, completa todos los campos');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    setPasswordLoading(true);

    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 5000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta.';
      setPasswordError(errorMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Agregar estilos CSS para las animaciones
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '15px',
      margin: '20px 0'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#4a5568',
        marginBottom: '30px',
        fontSize: '2rem',
        fontWeight: 'bold'
      }}>
        ⚙️ Configuración
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Tiempo de estudio */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#4a5568'
          }}>
            ⏰ Minutos de estudio:
          </label>
          <input
            type="text"
            value={studyTime}
            onChange={(e) => handleInputChange(setStudyTime, e.target.value, TIME_CONSTRAINTS.STUDY_TIME.MIN, TIME_CONSTRAINTS.STUDY_TIME.MAX)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              fontSize: '16px',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
          <small style={{ color: '#888', fontSize: '12px' }}>
            Rango: {TIME_CONSTRAINTS.STUDY_TIME.MIN}-{TIME_CONSTRAINTS.STUDY_TIME.MAX} minutos
          </small>
        </div>

        {/* Tiempo de descanso */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#4a5568'
          }}>
            💤 Minutos de descanso:
          </label>
          <input
            type="text"
            value={breakTime}
            onChange={(e) => handleInputChange(setBreakTime, e.target.value, TIME_CONSTRAINTS.BREAK_TIME.MIN, TIME_CONSTRAINTS.BREAK_TIME.MAX)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              fontSize: '16px',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
          <small style={{ color: '#888', fontSize: '12px' }}>
            Rango: {TIME_CONSTRAINTS.BREAK_TIME.MIN}-{TIME_CONSTRAINTS.BREAK_TIME.MAX} minutos
          </small>
        </div>

        {/* Número de sesiones */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#4a5568'
          }}>
            📊 Número de sesiones:
          </label>
          <input
            type="text"
            value={totalSessions}
            onChange={(e) => handleInputChange(setTotalSessions, e.target.value, TIME_CONSTRAINTS.TOTAL_SESSIONS.MIN, TIME_CONSTRAINTS.TOTAL_SESSIONS.MAX)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e2e8f0',
              fontSize: '16px',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
          <small style={{ color: '#888', fontSize: '12px' }}>
            Rango: {TIME_CONSTRAINTS.TOTAL_SESSIONS.MIN}-{TIME_CONSTRAINTS.TOTAL_SESSIONS.MAX} sesiones
          </small>
        </div>

      </div>

      {/* Modo automático */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#4a5568',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={autoMode}
            onChange={(e) => setAutoMode(e.target.checked)}
            style={{
              transform: 'scale(1.3)',
              cursor: 'pointer'
            }}
          />
          🔄 Modo automático
        </label>
        <p style={{
          margin: '10px 0 0 0',
          color: '#666',
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          {autoMode
            ? '✅ El temporizador continuará automáticamente entre fases sin necesidad de pausar manualmente.'
            : '⏸️ El temporizador se pausará al final de cada fase para que puedas decidir cuándo continuar.'
          }
        </p>
      </div>

      {/* Sección de Cambio de Contraseña */}
      {user && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          border: '2px solid #e2e8f0'
        }}>
          <h3 style={{
            marginTop: 0,
            marginBottom: '20px',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#4a5568'
          }}>
            🔐 Cambiar Contraseña
          </h3>

          {passwordSuccess && (
            <div style={{
              background: '#d4edda',
              color: '#155724',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '15px',
              border: '1px solid #c3e6cb'
            }}>
              ✅ Contraseña actualizada exitosamente
            </div>
          )}

          {passwordError && (
            <div style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '15px',
              border: '1px solid #f5c6cb'
            }}>
              ❌ {passwordError}
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#4a5568'
            }}>
              Contraseña Actual
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Ingresa tu contraseña actual"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#4a5568'
            }}>
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#4a5568'
            }}>
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              placeholder="Repite la nueva contraseña"
            />
          </div>

          <button
            onClick={handlePasswordChange}
            disabled={passwordLoading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              background: passwordLoading
                ? '#a0aec0'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              cursor: passwordLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          >
            {passwordLoading ? '⏳ Cambiando...' : '🔐 Cambiar Contraseña'}
          </button>
        </div>
      )}

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '15px 40px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            minWidth: '200px'
          }}
          onMouseOver={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.transform = 'translateY(0)';
          }}
        >
          💾 Guardar Configuración
        </button>
      </div>
    </div>
  );
}

