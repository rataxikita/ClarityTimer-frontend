import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { flushSync } from 'react-dom';
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
  // 🎯 PRESENTACIÓN: useRef para horaInicio - NO causa re-renders
  const horaInicioSesion = useRef<Date | null>(null);

  // Estado de notificaciones
  const [playNotification, setPlayNotification] = useState(false);

  // Progreso diario
  const [dailyProgress, setDailyProgress] = useState(0);

  // 🎯 PRESENTACIÓN: useRef para el interval - referencia mutable
  const interval = useRef<NodeJS.Timeout | null>(null);
  const isIntervalActive = useRef<boolean>(false);

  // 🎯 PRESENTACIÓN: Refs para evitar problemas de closure en el interval
  // Mantienen valores actuales SIN causar re-renders
  const minutesRef = useRef(minutes);
  const secondsRef = useRef(seconds);
  const isBreakRef = useRef(isBreak);
  const isLongBreakRef = useRef(isLongBreak);
  const sessionRef = useRef(session);

  // Actualizar las refs cuando cambien los estados
  useEffect(() => {
    minutesRef.current = minutes;
  }, [minutes]);

  useEffect(() => {
    secondsRef.current = seconds;
  }, [seconds]);

  useEffect(() => {
    isBreakRef.current = isBreak;
  }, [isBreak]);

  useEffect(() => {
    isLongBreakRef.current = isLongBreak;
  }, [isLongBreak]);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

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
  useEffect(() => {
    console.log('🟢 useEffect configuración - isRunning:', isRunning, 'isPaused:', isPaused);
    // Solo actualizar si NO está corriendo Y NO está pausado (evitar interferir cuando se inicia o pausa)
    if (!isRunning && !isPaused) {
      const newMinutes = !isBreak ? settings.studyTime : (isLongBreak ? settings.breakTime * 3 : settings.breakTime);
      console.log('🟢 useEffect configuración actualizando - minutes:', newMinutes);
      setMinutes(newMinutes);
      setSeconds(0);
    }
  }, [settings.studyTime, settings.breakTime, isBreak, isLongBreak, isRunning, isPaused]);


  // ⭐⭐⭐ PRESENTACIÓN: CORAZÓN DEL TIMER ⭐⭐⭐
  // Este useEffect crea el setInterval que decrementa cada segundo
  // Usa las refs para evitar problemas de closure 
  useEffect(() => {
    console.log('🟡 useEffect intervalo ejecutado - isRunning:', isRunning);

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
    // 🎯 PRESENTACIÓN: setInterval - se ejecuta CADA SEGUNDO

    console.log('🟡 Creando intervalo nuevo');
    isIntervalActive.current = true;

    // Crear el intervalo
    interval.current = setInterval(() => {
      console.log('⏰ Tick del intervalo - mins:', minutesRef.current, 'secs:', secondsRef.current);

      // 🎯 PRESENTACIÓN: Cuando llega a 0:0, llama a handleEndOfPeriod
      if (minutesRef.current === 0 && secondsRef.current === 0) {
        handleEndOfPeriod();
        return;
      }

      // Si los segundos son 0 pero hay minutos, restar un minuto y poner segundos en 59
      if (secondsRef.current === 0 && minutesRef.current > 0) {
        setMinutes(minutesRef.current - 1);
        setSeconds(59);
      } else {
        // Simplemente restar un segundo
        setSeconds(secondsRef.current - 1);
      }
    }, 1000);

    // 🎯 PRESENTACIÓN: Cleanup function - CRÍTICO para evitar memory leaks
    // Se ejecuta cuando el componente se desmonta o isRunning cambia
    return () => {
      console.log('🟡 Cleanup del useEffect intervalo');
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
  // 🔥🔥🔥 PRESENTACIÓN: FUNCIÓN MÁS COMPLEJA - 120 LÍNEAS 🔥🔥🔥
  // Maneja qué pasa cuando el timer llega a 0:0
  // PRIMERO: Guarda sesión en backend
  // SEGUNDO: Transiciona entre trabajo ↔ descanso  
  // TERCERO: Respeta modo automático
  const handleEndOfPeriod = async () => {
    const ahora = new Date();
    const duracionMinutos = isBreakRef.current
      ? (isLongBreakRef.current ? settings.breakTime * 3 : settings.breakTime)
      : settings.studyTime;

    // 🎯 PRESENTACIÓN: PRIMERO - Guardar sesión en backend
    // Crea objeto con todos los datos: fecha, horas, tipo, duración
    if (!isBreakRef.current && user && user.personajeActivoId) {
      const nuevoDetalle: DetalleSesionRequest = {
        numeroPomodoro: sessionRef.current,
        duracionMinutos: settings.studyTime,
        tipo: 'TRABAJO',
        puntosOtorgados: 10,
        completado: true,
        horaInicio: formatearHora(horaInicioSesion.current),
        horaFin: formatearHora(ahora)
      };

      const detallesActualizados = [...detallesSesion, nuevoDetalle];
      setDetallesSesion(detallesActualizados);

      // Si se completaron todos los pomodoros de trabajo, crear la sesión y completarla
      // sessionRef.current es el número de la sesión actual (1-indexed)
      // Si tengo 4 sesiones y estoy en la sesión 4, ya completé todas
      if (sessionRef.current === settings.totalSessions) {
        try {
          console.log('🎮 Creando sesión con detalles:', detallesActualizados);

          const sesionCreada = await sesionService.crear({
            personajeUsadoId: user.personajeActivoId,
            detalles: detallesActualizados
          });

          console.log('✅ Sesión creada con ID:', sesionCreada.id);

          // Esperar un momento antes de completar
          await new Promise(resolve => setTimeout(resolve, 500));

          await sesionService.completar(sesionCreada.id);
          console.log('✅ Sesión completada, puntos otorgados');

          await updateUser();
          console.log('✅ Usuario actualizado');

          setSesionId(null);
          setDetallesSesion([]);
          horaInicioSesion.current = null;
        } catch (error: any) {
          console.error('❌ Error guardando/completando sesión:', error);
          console.error('❌ Detalles del error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
        }
      }
    }

    // 🎯 PRESENTACIÓN: SEGUNDO - Transición entre fases
    if (isBreakRef.current) {
      const nuevoDetalle: DetalleSesionRequest = {
        numeroPomodoro: sessionRef.current,
        duracionMinutos: duracionMinutos,
        tipo: isLongBreakRef.current ? 'DESCANSO_LARGO' : 'DESCANSO_CORTO',
        puntosOtorgados: 0,
        completado: true,
        horaInicio: formatearHora(horaInicioSesion.current),
        horaFin: formatearHora(ahora)
      };

      const detallesActualizados = [...detallesSesion, nuevoDetalle];
      setDetallesSesion(detallesActualizados);
    }

    if (isBreakRef.current) {
      setIsBreak(false);
      setIsLongBreak(false);
      setSession((prev) => prev + 1);
      setMinutes(settings.studyTime);
      setSeconds(0);
    } else {
      setIsBreak(true);
      const newSession = sessionRef.current + 1;
      // 🎯 PRESENTACIÓN: Cada 4 sesiones = descanso LARGO
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
    if (!isBreakRef.current) {
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

    // 🎯 PRESENTACIÓN: TERCERO - Respeta modo automático
    // Si autoMode está activado, continúa automáticamente
    if (settings.autoMode && sessionRef.current < settings.totalSessions) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  const toggleTimer = () => {
    console.log('🔵 toggleTimer llamado - isRunning:', isRunning, 'isPaused:', isPaused);

    if (!isRunning) {
      // Limpiar cualquier intervalo existente PRIMERO
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
        isIntervalActive.current = false;
      }

      // Solo resetear el tiempo si NO está pausado (es decir, es un inicio fresco)
      if (!isPaused) {
        const newMinutes = !isBreak ? settings.studyTime : (isLongBreak ? settings.breakTime * 3 : settings.breakTime);
        console.log('🔵 Iniciando nuevo ciclo con', newMinutes, 'minutos');

        if (!isBreak && !horaInicioSesion.current) {
          horaInicioSesion.current = new Date();
        }

        // 🎯 PRESENTACIÓN: flushSync - Fuerza actualizaciones SÍNCRONAS
        // React normalmente agrupa updates, pero el timer necesita exactitud
        flushSync(() => {
          setMinutes(newMinutes);
          setSeconds(0);
        });
      } else {
        // Si está pausado, solo reanudar con el tiempo actual
        console.log('🔵 Reanudando desde pausa - mins:', minutes, 'secs:', seconds);
      }

      // Marcar como no pausado y iniciar
      setIsPaused(false);
      setIsRunning(true);
    } else {
      // Pausar el temporizador
      console.log('🔵 Pausando temporizador');
      setIsRunning(false);
      setIsPaused(true);
    }
  };

  const resetTimer = () => {
    setMinutes(settings.studyTime);
    setSeconds(0);
    setIsRunning(false);
    setIsBreak(false);
    setIsLongBreak(false);
    setSession(1);
    setIsPaused(false);
    setSesionId(null);
    setDetallesSesion([]);
    horaInicioSesion.current = null;
  };

  const value: TimerContextType = {
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
    setPlayNotification,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};