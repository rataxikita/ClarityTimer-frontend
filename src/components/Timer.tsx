import { useEffect } from 'react';
import Character from './Character';
import { useSettings } from '../contexts/SettingsContext';
import { useTimer } from '../contexts/TimerContext';

export default function TimerComponent() {
    const { settings } = useSettings();
    const {
        minutes,
        seconds,
        isRunning,
        isBreak,
        isLongBreak,
        session,
        isPaused,
        dailyProgress,
        playNotification,
        toggleTimer,
        resetTimer,
        setPlayNotification
    } = useTimer();

    useEffect(() => {
        if (playNotification) {
            setPlayNotification(false);
        }
    }, [playNotification, setPlayNotification]);

    return (
        <>
            <div style={{
                textAlign: 'center',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '15px',
                margin: '20px 0'
            }}>
                <h2 style={{
                    fontSize: '2rem',
                    color: isBreak ? '#ff6b6b' : '#4ecdc4',
                    marginBottom: '20px',
                    fontWeight: 'bold'
                }}>
                    {isBreak
                        ? (isLongBreak ? '🌙 Descanso Largo' : '💤 Descanso')
                        : '📚 Estudio'
                    }
                </h2>

                {/* Información del descanso largo */}
                {isBreak && isLongBreak && (
                    <div style={{
                        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        marginBottom: '20px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>
                            🎉 ¡Felicitaciones! Has completado 4 sesiones.
                            ¡Disfruta de tu descanso largo!
                        </p>
                    </div>
                )}

                <Character isBreak={isBreak} />

                <div style={{
                    fontSize: '4rem',
                    fontWeight: 'bold',
                    color: isBreak ? '#ff6b6b' : '#4ecdc4',
                    margin: '20px 0',
                    fontFamily: 'monospace',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                }}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>

                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '15px',
                    borderRadius: '10px',
                    margin: '20px 0',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                }}>
                    <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>
                        Hoy completaste {dailyProgress}/{settings.totalSessions} sesiones
                    </p>
                    <p style={{ margin: '0', opacity: '0.9' }}>
                        Sesión {session} de {settings.totalSessions}
                        {isLongBreak && ' - ¡Descanso Largo!'}
                    </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    <button
                        onClick={toggleTimer}
                        style={{
                            padding: '15px 30px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '10px',
                            background: isRunning ? '#ff6b6b' : '#4ecdc4',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            minWidth: '120px'
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
                        {isRunning ? '⏸️ Pausar' : '▶️ Iniciar'}
                    </button>

                    <button
                        onClick={resetTimer}
                        style={{
                            padding: '15px 30px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '10px',
                            background: '#95a5a6',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                            minWidth: '120px'
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
                        🔄 Reiniciar
                    </button>
                </div>

                {/* Indicador de estado global */}
                <div style={{
                    marginTop: '20px',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.8)',
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#4a5568' }}>
                        💡 El temporizador continúa funcionando en todas las pestañas
                    </p>
                </div>
            </div>
        </>
    );
}

