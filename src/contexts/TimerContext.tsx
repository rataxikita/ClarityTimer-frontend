import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useSettings } from './SettingsContext';
import { useAuth } from './AuthContext';
import { STORAGE_KEYS } from '../constants/settings';
import { sesionService, type DetalleSesionRequest } from '../services/sesionService';

interface TimerContextType {
  // Estado del temporizador
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isBreak: boolean;
  isLongBreak: boolean;
  session: number;
  isPaused: boolean;
  dailyProgress: number;
  
  // Estado de notificaciones
  playNotification: boolean;
  
  // Funciones del temporizador
  toggleTimer: () => void;
  resetTimer: () => void;
  
  // Funciones de sonido
  setPlayNotification: (value: boolean) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer debe usarse dentro de un TimerProvider');
  }
  return context;
};

interface TimerProviderProps {
  children: ReactNode;
}

// Componente Provider
export const TimerProvider = ({ children }: TimerProviderProps) => {
  const { settings } = useSettings();
  const { user, updateUser } = useAuth();
  
  // Estado del temporizador
  const [minutes, setMinutes] = useState(settings.studyTime);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);
  const [session, setSession] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  
  // Estado de sesión en backend
  const [sesionId, setSesionId] = useState<number | null>(null);
  const [detallesSesion, setDetallesSesion] = useState<DetalleSesionRequest[]>([]);
  const horaInicioSesion = useRef<Date | null>(null);
  
  // Estado de notificaciones
  const [playNotification, setPlayNotification] = useState(false);
  
  // Progreso diario
  const [dailyProgress, setDailyProgress] = useState(0);
  
  const interval = useRef<NodeJS.Timeout | null>(null);
  const isIntervalActive = useRef<boolean>(false);

  const getToday = (): string => new Date().toISOString().slice(0, 10);

  // Cargar progreso diario al inicializar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POMODORO_PROGRESS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.date === getToday()) {
          setDailyProgress(parsed.count);
        } else {
          setDailyProgress(0);
        }
      } catch (error) {
        console.error('Error parsing progress:', error);
        setDailyProgress(0);
      }
    } else {
      setDailyProgress(0);
    }
  }, []);


  // Actualizar configuración cuando cambie (solo si no está corriendo y no está pausado)
  // IMPORTANTE: No incluir isPaused en las dependencias para evitar que se ejecute al iniciar
  useEffect(() => {
    console.log('🟢 useEffect configuración - isRunning:', isRunning, 'isPaused:', isPaused);
    // Solo actualizar si NO está corriendo (evitar interferir cuando se inicia)
    if (!isRunning) {
      const newMinutes = !isBreak ? settings.studyTime : (isLongBreak ? settings.breakTime * 3 : settings.breakTime);
      console.log('🟢 useEffect configuración actualizando - minutes:', newMinutes);
      setMinutes(newMinutes);
      setSeconds(0); // Mostrar 0 segundos cuando está pausado
    }
  }, [settings.studyTime, settings.breakTime, isBreak, isLongBreak, isRunning]);

  // Lógica del temporizador
  useEffect(() => {
    console.log('🟡 useEffect intervalo ejecutado - isRunning:', isRunning, 'minutes:', minutes, 'seconds:', seconds);
    
    // Si no está corriendo, solo limpiar y salir
    if (!isRunning) {
      console.log('🟡 Limpiando intervalo (no está corriendo)');
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
      isIntervalActive.current = false;
      return;
    }
    
    // Si ya hay un intervalo activo, no crear otro (previene duplicados)
    if (isIntervalActive.current && interval.current) {
      console.log('🟡 Ya hay un intervalo activo, no crear otro');
      return;
    }
    
    // Limpiar cualquier intervalo existente
    if (interval.current) {
      console.log('🟡 Limpiando intervalo existente antes de crear uno nuevo');
      clearInterval(interval.current);
      interval.current = null;
    }
    
    console.log('🟡 Esperando 100ms antes de crear intervalo. Estado actual - minutes:', minutes, 'seconds:', seconds);
    
    // Esperar un momento para asegurar que el estado (minutes, seconds) se haya actualizado
    // antes de crear el intervalo. Esto es importante porque setMinutes y setSeconds son asíncronos
    const timeoutId = setTimeout(() => {
      console.log('🟡 Creando intervalo. Estado en este momento - minutes:', minutes, 'seconds:', seconds);
      // Marcar que el intervalo está activo
      isIntervalActive.current = true;
      
      // Crear el intervalo - la primera ejecución será después de 1 segundo
      // Usar callbacks de estado para acceder siempre a los valores más recientes
      interval.current = setInterval(() => {
        console.log('⏰ Tick del intervalo - antes de actualizar');
        // Lógica del temporizador: siempre restar 1 segundo
        setSeconds((prevSeconds) => {
          console.log('⏰ setSeconds callback - prevSeconds:', prevSeconds);
          if (prevSeconds > 0) {
            // Si hay segundos, solo restar 1 segundo
            return prevSeconds - 1;
          } else {
            // Cuando los segundos llegan a 0, restar 1 minuto
            setMinutes((prevMinutes) => {
              console.log('⏰ setMinutes callback - prevMinutes:', prevMinutes);
              if (prevMinutes > 0) {
                return prevMinutes - 1;
              } else {
                // Cuando los minutos llegan a 0, terminar el período
                handleEndOfPeriod();
                return 0;
              }
            });
            // Resetear segundos a 59 cuando se resta un minuto
            return 59;
          }
        });
      }, 1000);
    }, 100); // Delay para asegurar que el estado se actualice (setMinutes/setSeconds son asíncronos)
    
    // Cleanup: limpiar intervalo y timeout cuando el componente se desmonte o isRunning cambie
    return () => {
      console.log('🟡 Cleanup del useEffect intervalo');
      clearTimeout(timeoutId);
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
      isIntervalActive.current = false;
    };
  }, [isRunning]);

  // Función auxiliar para formatear hora en formato HH:mm:ss para LocalTime.parse()
  const formatearHora = (fecha: Date | null): string | undefined => {
    if (!fecha) return undefined;
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
  };

  const handleEndOfPeriod = async () => {
    const ahora = new Date();
    const duracionMinutos = isBreak 
      ? (isLongBreak ? settings.breakTime * 3 : settings.breakTime)
      : settings.studyTime;
    
    // Si es un pomodoro de trabajo completado, agregarlo a los detalles
    if (!isBreak && user && user.personajeActivoId) {
      const nuevoDetalle: DetalleSesionRequest = {
        numeroPomodoro: session,
        duracionMinutos: settings.studyTime,
        tipo: 'TRABAJO',
        puntosOtorgados: 10, // 10 puntos por pomodoro
        completado: true,
        horaInicio: formatearHora(horaInicioSesion.current),
        horaFin: formatearHora(ahora)
      };
      
      const detallesActualizados = [...detallesSesion, nuevoDetalle];
      setDetallesSesion(detallesActualizados);
      
      // Si se completaron todos los pomodoros, crear la sesión y completarla
      if (session >= settings.totalSessions) {
        try {
          // Crear sesión con todos los detalles acumulados
          const sesionCreada = await sesionService.crear({
            personajeUsadoId: user.personajeActivoId,
            detalles: detallesActualizados
          });
          
          // Completar la sesión para otorgar puntos
          await sesionService.completar(sesionCreada.id);
          await updateUser(); // Actualizar puntos del usuario
          
          console.log('✅ Sesión completada, puntos otorgados:', sesionCreada.id);
          
          // Resetear estado de sesión
          setSesionId(null);
          setDetallesSesion([]);
          horaInicioSesion.current = null;
        } catch (error) {
          console.error('Error guardando/completando sesión:', error);
        }
      }
    }
    
    // Si es un descanso completado, agregarlo a los detalles también
    if (isBreak) {
      const nuevoDetalle: DetalleSesionRequest = {
        numeroPomodoro: session,
        duracionMinutos: duracionMinutos,
        tipo: isLongBreak ? 'DESCANSO_LARGO' : 'DESCANSO_CORTO',
        puntosOtorgados: 0, // Los descansos no dan puntos
        completado: true,
        horaInicio: formatearHora(horaInicioSesion.current),
        horaFin: formatearHora(ahora)
      };
      
      const detallesActualizados = [...detallesSesion, nuevoDetalle];
      setDetallesSesion(detallesActualizados);
    }
    
    if (isBreak) {
      setIsBreak(false);
      setIsLongBreak(false);
      setSession((prev) => prev + 1);
      setMinutes(settings.studyTime);
      setSeconds(0);
    } else {
      setIsBreak(true);
      const newSession = session + 1;
      if (newSession % 4 === 0) {
        setIsLongBreak(true);
        setMinutes(settings.breakTime * 3);
      } else {
        setIsLongBreak(false);
        setMinutes(settings.breakTime);
      }
      setSeconds(0);
    }
    
    // Actualizar progreso diario SOLO cuando se completa un pomodoro de trabajo
    if (!isBreak) {
      const saved = localStorage.getItem(STORAGE_KEYS.POMODORO_PROGRESS);
      let newCount = 1;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.date === getToday()) {
            newCount = parsed.count + 1;
          }
        } catch (error) {
          console.error('Error parsing progress:', error);
        }
      }
      setDailyProgress(newCount);
      localStorage.setItem(STORAGE_KEYS.POMODORO_PROGRESS, JSON.stringify({
        date: getToday(),
        count: newCount
      }));
    }
    
    setPlayNotification(true);
    
    // Si está en modo automático y no se completaron todas las sesiones, continuar
    if (settings.autoMode && session < settings.totalSessions) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const toggleTimer = () => {
    console.log('🔵 toggleTimer llamado');
    console.log('🔵 Estado actual - minutes:', minutes, 'seconds:', seconds, 'isRunning:', isRunning);
    
    setIsRunning((prev) => {
      const next = !prev;
      console.log('🔵 setIsRunning - prev:', prev, 'next:', next);
      setIsPaused(!next);
      if (next) {
        // Al iniciar, establecer el tiempo PRIMERO, luego cambiar isRunning
        // Esto asegura que el tiempo esté establecido antes de que el useEffect del intervalo se ejecute
        const newMinutes = !isBreak ? settings.studyTime : (isLongBreak ? settings.breakTime * 3 : settings.breakTime);
        console.log('🔵 Estableciendo tiempo - minutes:', newMinutes, 'seconds: 0');
        setMinutes(newMinutes);
        setSeconds(0);
        if (!isBreak && !horaInicioSesion.current) {
          // Guardar hora de inicio cuando se inicia un pomodoro de trabajo
          horaInicioSesion.current = new Date();
        }
      }
      return next;
    });
  };

  const resetTimer = () => {
    setMinutes(settings.studyTime);
    setSeconds(0);
    setIsRunning(false);
    setIsBreak(false);
    setIsLongBreak(false);
    setSession(1);
    setIsPaused(false);
    // Resetear sesión del backend
    setSesionId(null);
    setDetallesSesion([]);
    horaInicioSesion.current = null;
  };

  const value: TimerContextType = {
    // Estado del temporizador
    minutes,
    seconds,
    isRunning,
    isBreak,
    isLongBreak,
    session,
    isPaused,
    dailyProgress,
    
    // Estado de notificaciones
    playNotification,
    
    // Funciones del temporizador
    toggleTimer,
    resetTimer,
    
    // Funciones de sonido
    setPlayNotification,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};

