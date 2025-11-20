import { useEffect, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface NotificationManagerProps {
  isBreak?: boolean;
  isLongBreak?: boolean;
  session?: number;
  totalSessions?: number;
  onSessionComplete?: () => void;
}

export default function NotificationManager({
  isBreak,
  isLongBreak,
  session,
  totalSessions,
  onSessionComplete
}: NotificationManagerProps) {
  const { settings } = useSettings();
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  useEffect(() => {
    // Verificar si las notificaciones están disponibles
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestNotificationPermission = async (): Promise<boolean> => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      return permission === 'granted';
    }
    return false;
  };

  const showNotification = (title: string, body: string, icon: string | null = null): Notification | null => {
    if (!notificationsEnabled || !('Notification' in window)) return null;

    const notification = new Notification(title, {
      body,
      icon: icon || '/characters/cinnamoroll-study.png',
      badge: '/icon.png',
      tag: 'pomodoro-notification',
      requireInteraction: false,
      silent: false
    });

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  };

  const handleSessionComplete = () => {
    if (!notificationsEnabled) return;

    if (isBreak) {
      if (isLongBreak) {
        showNotification(
          '🌙 ¡Descanso Largo Completado!',
          '¡Excelente trabajo! Has completado 4 sesiones. ¡Es hora de volver a estudiar!',
          '/characters/cinnamoroll-break.png'
        );
      } else {
        showNotification(
          '💤 ¡Descanso Completado!',
          '¡Descanso terminado! Volvamos a estudiar con energía renovada.',
          '/characters/cinnamoroll-break.png'
        );
      }
    } else {
      showNotification(
        '📚 ¡Sesión de Estudio Completada!',
        `¡Excelente trabajo! Sesión ${session} de ${totalSessions} completada. ¡Tómate un descanso!`,
        '/characters/cinnamoroll-study.png'
      );
    }

    if (onSessionComplete) {
      onSessionComplete();
    }
  };

  const showMotivationalNotification = () => {
    if (!notificationsEnabled) return;

    const motivationalMessages = [
      '💪 ¡Tú puedes! Cada minuto de estudio te acerca a tus metas',
      '🧠 Recuerda: el conocimiento es poder',
      '🎯 ¡Mantén el foco! Estás haciendo un excelente trabajo',
      '🌟 Tu futuro yo te agradecerá por este esfuerzo',
      '🔥 Cada sesión de estudio te hace más fuerte'
    ];

    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

    showNotification(
      '💪 ¡Motivación!',
      randomMessage,
      '/characters/cinnamoroll-study.png'
    );
  };

  const showStreakNotification = (streak: number) => {
    if (!notificationsEnabled) return;

    let message = '';
    let title = '';

    if (streak === 3) {
      title = '🔥 ¡Racha de 3 Días!';
      message = '¡Increíble! Has estudiado 3 días seguidos. ¡Sigue así!';
    } else if (streak === 7) {
      title = '🌟 ¡Racha de 1 Semana!';
      message = '¡Fantástico! Has mantenido una racha de 7 días. ¡Eres un estudiante ejemplar!';
    } else if (streak === 30) {
      title = '🏆 ¡Racha de 1 Mes!';
      message = '¡Extraordinario! Has estudiado durante 30 días seguidos. ¡Eres una leyenda!';
    }

    if (message) {
      showNotification(title, message, '/characters/cinnamoroll-study.png');
    }
  };

  interface NotificationType {
    title: string;
    description: string;
    icon: string;
  }

  const notificationTypes: NotificationType[] = [
    { title: 'Sesiones Completadas', description: 'Alerta cuando termina una sesión de estudio', icon: '📚' },
    { title: 'Descansos Terminados', description: 'Notificación cuando termina el descanso', icon: '💤' },
    { title: 'Descansos Largos', description: 'Celebración especial por completar 4 sesiones', icon: '🌙' },
    { title: 'Rachas', description: 'Felicitaciones por mantener rachas de estudio', icon: '🔥' },
    { title: 'Motivación', description: 'Mensajes motivacionales aleatorios', icon: '💪' },
    { title: 'Logros', description: 'Notificaciones por desbloquear logros', icon: '🏆' }
  ];

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '15px',
      padding: '20px',
      margin: '20px 0',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{
        color: '#4a5568',
        marginBottom: '20px',
        fontSize: '1.3rem',
        textAlign: 'center'
      }}>
        🔔 Notificaciones del Sistema
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {/* Estado de las notificaciones */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '15px',
          background: notificationsEnabled ? 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)' : '#f7fafc',
          color: notificationsEnabled ? 'white' : '#4a5568',
          borderRadius: '10px',
          border: notificationsEnabled ? 'none' : '2px solid #e2e8f0'
        }}>
          <div>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>
              {notificationsEnabled ? '✅ Notificaciones Activas' : '🔇 Notificaciones Desactivadas'}
            </h4>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
              {notificationsEnabled
                ? 'Recibirás alertas cuando terminen las sesiones y descansos'
                : 'Activa las notificaciones para recibir alertas importantes'
              }
            </p>
          </div>

          {!notificationsEnabled && (
            <button
              onClick={requestNotificationPermission}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              Activar Notificaciones
            </button>
          )}
        </div>

        {/* Tipos de notificaciones */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px'
        }}>
          {notificationTypes.map((type, index) => (
            <div key={index} style={{
              background: 'rgba(255,255,255,0.8)',
              padding: '15px',
              borderRadius: '10px',
              border: '2px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <span style={{ fontSize: '2rem' }}>{type.icon}</span>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', color: '#4a5568' }}>
                  {type.title}
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#718096' }}>
                  {type.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div style={{
          marginTop: '15px',
          padding: '15px',
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#4a5568', fontSize: '0.9rem' }}>
            💡 Las notificaciones te ayudarán a mantener el foco y celebrar tus logros.
            Puedes desactivarlas en cualquier momento desde la configuración de tu navegador.
          </p>
        </div>
      </div>
    </div>
  );
}

