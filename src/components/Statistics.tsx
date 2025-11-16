import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { STORAGE_KEYS } from '../constants/settings';
import { sesionService } from '../services/sesionService';
import { estadisticaService } from '../services/estadisticaService';
import PuntosWidget from './PuntosWidget';
import HistorialPuntos from './HistorialPuntos';

interface StatisticsData {
  totalSessions: number;
  totalStudyTime: number;
  totalBreakTime: number;
  averageSessionsPerDay: number;
  currentStreak: number;
  longestStreak: number;
  weeklyProgress: Array<{
    date: Date;
    sessions: number;
    studyTime: number;
  }>;
  monthlyProgress: Array<{
    date: Date;
    sessions: number;
    studyTime: number;
  }>;
}

interface DayProgress {
  date: Date;
  sessions: number;
  studyTime: number;
}

export default function Statistics() {
  const { settings } = useSettings();
  const { user } = useAuth();
  const [stats, setStats] = useState<StatisticsData>({
    totalSessions: 0,
    totalStudyTime: 0,
    totalBreakTime: 0,
    averageSessionsPerDay: 0,
    currentStreak: 0,
    longestStreak: 0,
    weeklyProgress: [],
    monthlyProgress: []
  });
  const [activeTab, setActiveTab] = useState<'general' | 'puntos' | 'historial'>('general');

  useEffect(() => {
    loadStatistics();
    if (user) {
      loadSesionesBackend();
    }
  }, [user?.id]);

  const loadStatistics = () => {
    try {
      const savedStats = localStorage.getItem(STORAGE_KEYS.STATISTICS);
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const loadSesionesBackend = async () => {
    if (!user) return;
    try {
      const sesiones = await sesionService.getMisSesiones();
      const totalPomodoros = sesiones.reduce((sum, s) => sum + s.totalPomodoros, 0);
      const totalTiempo = sesiones.reduce((sum, s) => sum + s.tiempoTotalMinutos, 0);
      
      // Actualizar estadísticas con datos del backend
      setStats(prev => ({
        ...prev,
        totalSessions: sesiones.length,
        totalStudyTime: totalTiempo,
        currentStreak: user.streakDias || 0
      }));
    } catch (error) {
      console.error('Error cargando sesiones del backend:', error);
    }
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  interface Achievement {
    title: string;
    description: string;
    achieved: boolean;
    icon: string;
  }

  const achievements: Achievement[] = [
    { title: 'Primera Sesión', description: 'Completa tu primera sesión', achieved: stats.totalSessions > 0, icon: '🎯' },
    { title: 'Estudiante Dedicado', description: 'Completa 10 sesiones', achieved: stats.totalSessions >= 10, icon: '📚' },
    { title: 'Racha de 3 Días', description: 'Estudia 3 días seguidos', achieved: stats.currentStreak >= 3, icon: '🔥' },
    { title: 'Maratón de Estudio', description: 'Completa 50 sesiones', achieved: stats.totalSessions >= 50, icon: '🏃‍♂️' },
    { title: 'Maestro del Tiempo', description: 'Acumula 24 horas de estudio', achieved: stats.totalStudyTime >= 1440, icon: '⏰' },
    { title: 'Consistencia Perfecta', description: 'Estudia 7 días seguidos', achieved: stats.currentStreak >= 7, icon: '🌟' }
  ];

  return (
    <div>
      {/* Pestañas */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '25px',
        borderBottom: '2px solid #e2e8f0',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('general')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'general' ? '#667eea' : 'transparent',
            color: activeTab === 'general' ? 'white' : '#4a5568',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease'
          }}
        >
          📊 General
        </button>
        <button
          onClick={() => setActiveTab('puntos')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'puntos' ? '#667eea' : 'transparent',
            color: activeTab === 'puntos' ? 'white' : '#4a5568',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease'
          }}
        >
          💎 Puntos
        </button>
        <button
          onClick={() => setActiveTab('historial')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'historial' ? '#667eea' : 'transparent',
            color: activeTab === 'historial' ? 'white' : '#4a5568',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease'
          }}
        >
          📜 Historial
        </button>
      </div>

      {/* Contenido de pestañas */}
      {activeTab === 'general' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          padding: '20px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            textAlign: 'center',
            color: '#4a5568',
            marginBottom: '20px',
            fontSize: '1.8rem',
            fontWeight: 'bold'
          }}>
            📊 Estadísticas de Progreso
          </h2>

      {/* Resumen general */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>{stats.totalSessions}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Sesiones Totales</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>{formatTime(stats.totalStudyTime)}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Tiempo de Estudio</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>{stats.currentStreak}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Racha Actual</p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '2rem' }}>{stats.averageSessionsPerDay.toFixed(1)}</h3>
          <p style={{ margin: 0, opacity: 0.9 }}>Promedio/Día</p>
        </div>
      </div>

      {/* Logros */}
      <div>
        <h3 style={{
          color: '#4a5568',
          marginBottom: '15px',
          fontSize: '1.3rem'
        }}>
          🏆 Logros
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          {achievements.map((achievement, index) => (
            <div key={index} style={{
              background: achievement.achieved 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                : '#f7fafc',
              color: achievement.achieved ? 'white' : '#4a5568',
              padding: '15px',
              borderRadius: '10px',
              border: achievement.achieved ? 'none' : '2px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              transition: 'all 0.3s ease'
            }}>
              <span style={{ fontSize: '2rem' }}>{achievement.icon}</span>
              <div>
                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>
                  {achievement.title}
                </h4>
                <p style={{ margin: 0, opacity: achievement.achieved ? 0.9 : 0.7, fontSize: '0.9rem' }}>
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
        </div>
      )}

      {activeTab === 'puntos' && (
        <div>
          <PuntosWidget />
        </div>
      )}

      {activeTab === 'historial' && (
        <div>
          <HistorialPuntos />
        </div>
      )}
    </div>
  );
}

