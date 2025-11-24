import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { z } from 'zod';
import { 
  TIME_CONSTRAINTS, 
  CHARACTERS, 
  STORAGE_KEYS,
  THEMES,
  type CharacterType,
  type ThemeType
} from '../constants/settings';

// Esquema de configuración con zod
const SettingsSchema = z.object({
  studyTime: z.number().min(TIME_CONSTRAINTS.STUDY_TIME.MIN).max(TIME_CONSTRAINTS.STUDY_TIME.MAX).default(TIME_CONSTRAINTS.STUDY_TIME.DEFAULT),
  breakTime: z.number().min(TIME_CONSTRAINTS.BREAK_TIME.MIN).max(TIME_CONSTRAINTS.BREAK_TIME.MAX).default(TIME_CONSTRAINTS.BREAK_TIME.DEFAULT),
  totalSessions: z.number().min(TIME_CONSTRAINTS.TOTAL_SESSIONS.MIN).max(TIME_CONSTRAINTS.TOTAL_SESSIONS.MAX).default(TIME_CONSTRAINTS.TOTAL_SESSIONS.DEFAULT),
  autoMode: z.boolean().default(false),
  selectedCharacter: z.enum([CHARACTERS.CINNAMOROLL]).default(CHARACTERS.CINNAMOROLL),
  theme: z.enum([THEMES.DEFAULT, THEMES.SUNSET, THEMES.OCEAN, THEMES.FOREST, THEMES.LAVENDER, THEMES.MIDNIGHT]).default(THEMES.DEFAULT),
});

export type Settings = z.infer<typeof SettingsSchema>;

interface StoredSettingsData {
  version: number;
  settings: Settings;
  lastUpdated: string;
}

// Valores por defecto
const DEFAULT_SETTINGS: Settings = {
  studyTime: TIME_CONSTRAINTS.STUDY_TIME.DEFAULT,
  breakTime: TIME_CONSTRAINTS.BREAK_TIME.DEFAULT,
  totalSessions: TIME_CONSTRAINTS.TOTAL_SESSIONS.DEFAULT,
  autoMode: false,
  selectedCharacter: CHARACTERS.CINNAMOROLL,
  theme: THEMES.DEFAULT,
};

// Versión actual del esquema para migraciones
const CURRENT_VERSION = 1;

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => { success: boolean; error?: string };
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => { success: boolean; error?: string };
  resetSettings: () => void;
  isLoading: boolean;
}

// Contexto
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings debe usarse dentro de un SettingsProvider');
  }
  return context;
};

// Función para migrar datos antiguos
const migrateSettings = (storedData: unknown): Settings => {
  try {
    // Si no hay datos almacenados, usar valores por defecto
    if (!storedData) {
      return DEFAULT_SETTINGS;
    }

    const data = storedData as StoredSettingsData | Settings;

    // Si es un objeto con versión, verificar si necesita migración
    if ('version' in data && data.version && data.version < CURRENT_VERSION) {
      // Aquí puedes agregar lógica de migración específica por versión
      console.log(`Migrando configuración de versión ${data.version} a ${CURRENT_VERSION}`);
    }

    // Si es un objeto sin versión (formato antiguo), migrar
    if (!('version' in data) || !data.version) {
      console.log('Migrando configuración del formato antiguo');
      const oldSettings = data as Partial<Settings>;
      const migratedSettings: Settings = {
        studyTime: oldSettings.studyTime ?? DEFAULT_SETTINGS.studyTime,
        breakTime: oldSettings.breakTime ?? DEFAULT_SETTINGS.breakTime,
        totalSessions: oldSettings.totalSessions ?? DEFAULT_SETTINGS.totalSessions,
        autoMode: oldSettings.autoMode ?? DEFAULT_SETTINGS.autoMode,
        selectedCharacter: oldSettings.selectedCharacter ?? DEFAULT_SETTINGS.selectedCharacter,
        theme: oldSettings.theme ?? DEFAULT_SETTINGS.theme,
      };
      return migratedSettings;
    }

    // Si ya tiene la versión correcta, usar directamente
    return ('settings' in data && data.settings) ? data.settings : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error migrando configuración:', error);
    return DEFAULT_SETTINGS;
  }
};

// 🎯 PRESENTACIÓN: Función para cargar configuración desde localStorage
// Usa safeParse de Zod: si los datos son inválidos, usa los defaults
// Esto protege contra datos corruptos
const loadSettingsFromStorage = (): Settings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.POMODORO_SETTINGS);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(stored);
    const migratedSettings = migrateSettings(parsed);
    
    // 🎯 PRESENTACIÓN: Validar con zod - safeParse
    // Si los datos son inválidos, usa los defaults
    const result = SettingsSchema.safeParse(migratedSettings);
    if (result.success) {
      return result.data;
    } else {
      console.error('Error validando configuración:', result.error);
      return DEFAULT_SETTINGS;
    }
  } catch (error) {
    console.error('Error cargando configuración:', error);
    return DEFAULT_SETTINGS;
  }
};

// Función para guardar configuración en localStorage
const saveSettingsToStorage = (settings: Settings): void => {
  try {
    const dataToStore: StoredSettingsData = {
      version: CURRENT_VERSION,
      settings: settings,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.POMODORO_SETTINGS, JSON.stringify(dataToStore));
  } catch (error) {
    console.error('Error guardando configuración:', error);
  }
};

// Provider del contexto
interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  // 🎯 PRESENTACIÓN: useState con función (lazy initialization)
  // En vez de pasar un valor directo, pasamos una función
  // Esto significa que solo se ejecuta UNA VEZ al montar, no en cada render
  // Carga desde localStorage o usa defaults
  const [settings, setSettings] = useState<Settings>(() => loadSettingsFromStorage());
  const [isLoading, setIsLoading] = useState(true);

  // 🎯 PRESENTACIÓN: useEffect de sincronización
  // Sincroniza automáticamente cualquier cambio de configuración con localStorage
  // El usuario cambia algo → se guarda automáticamente
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // 🎯 PRESENTACIÓN: Función para actualizar configuración
  // Valida con Zod antes de guardar
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    try {
      // Combinar con configuración actual
      const mergedSettings = { ...settings, ...newSettings };
      // Validar con zod
      const validatedSettings = SettingsSchema.parse(mergedSettings);
      setSettings(validatedSettings);
      saveSettingsToStorage(validatedSettings);
      return { success: true };
    } catch (error) {
      console.error('Error validando configuración:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [settings]);

  // Función para actualizar una sola configuración
  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    try {
      const newSettings = { ...settings, [key]: value };
      const validatedSettings = SettingsSchema.parse(newSettings);
      setSettings(validatedSettings);
      saveSettingsToStorage(validatedSettings);
      return { success: true };
    } catch (error) {
      console.error('Error validando configuración:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [settings]);

  // Función para resetear a valores por defecto
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettingsToStorage(DEFAULT_SETTINGS);
  }, []);

  const value: SettingsContextType = {
    settings,
    updateSettings,
    updateSetting,
    resetSettings,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

