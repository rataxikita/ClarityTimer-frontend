// Constantes para configuración de tiempo
export const TIME_CONSTRAINTS = {
  STUDY_TIME: {
    MIN: 1,
    MAX: 120,
    DEFAULT: 25,
  },
  BREAK_TIME: {
    MIN: 1,
    MAX: 60,
    DEFAULT: 5,
  },
  TOTAL_SESSIONS: {
    MIN: 1,
    MAX: 20,
    DEFAULT: 5,
  },
} as const;

// Constantes para personajes
export const CHARACTERS = {
  CINNAMOROLL: 'cinnamoroll',
} as const;

// Constantes para localStorage
export const STORAGE_KEYS = {
  POMODORO_SETTINGS: 'pomodoroSettings',
  POMODORO_PROGRESS: 'pomodoroProgress',
  STATISTICS: 'pomodoroStatistics',
  NOTES: 'pomodoroNotes',
  THEME: 'pomodoroTheme',
  NOTIFICATION_SETTINGS: 'pomodoroNotificationSettings',
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
} as const;

// Constantes para rutas de personajes
export const CHARACTER_PATHS = {
  CINNAMOROLL_STUDY: '/characters/cinnamoroll-study.png',
  CINNAMOROLL_BREAK: '/characters/cinnamoroll-break.png',
} as const;

// Constantes para notificaciones
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
} as const;

// Constantes para estados del timer
export const TIMER_STATES = {
  STUDY: 'study',
  BREAK: 'break',
  PAUSED: 'paused',
  FINISHED: 'finished',
} as const;

// Constantes para temas
export const THEMES = {
  DEFAULT: 'default',
  SUNSET: 'sunset',
  OCEAN: 'ocean',
  FOREST: 'forest',
  LAVENDER: 'lavender',
  MIDNIGHT: 'midnight',
} as const;

// Constantes para categorías de notas
export const NOTE_CATEGORIES = {
  GENERAL: 'general',
  STUDY: 'study',
  BREAK: 'break',
  IDEAS: 'ideas',
  TASKS: 'tasks',
} as const;

// Tipos TypeScript
export type CharacterType = typeof CHARACTERS[keyof typeof CHARACTERS];
export type ThemeType = typeof THEMES[keyof typeof THEMES];
export type TimerState = typeof TIMER_STATES[keyof typeof TIMER_STATES];
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];
export type NoteCategory = typeof NOTE_CATEGORIES[keyof typeof NOTE_CATEGORIES];

// Schema de validación con Zod
import { z } from 'zod';

export const settingsSchema = z.object({
  studyTime: z.number()
    .min(TIME_CONSTRAINTS.STUDY_TIME.MIN)
    .max(TIME_CONSTRAINTS.STUDY_TIME.MAX)
    .default(TIME_CONSTRAINTS.STUDY_TIME.DEFAULT),
  breakTime: z.number()
    .min(TIME_CONSTRAINTS.BREAK_TIME.MIN)
    .max(TIME_CONSTRAINTS.BREAK_TIME.MAX)
    .default(TIME_CONSTRAINTS.BREAK_TIME.DEFAULT),
  longBreakTime: z.number()
    .min(TIME_CONSTRAINTS.BREAK_TIME.MIN)
    .max(TIME_CONSTRAINTS.BREAK_TIME.MAX)
    .default(15),
  sessions: z.number()
    .min(TIME_CONSTRAINTS.TOTAL_SESSIONS.MIN)
    .max(TIME_CONSTRAINTS.TOTAL_SESSIONS.MAX)
    .default(TIME_CONSTRAINTS.TOTAL_SESSIONS.DEFAULT),
  autoMode: z.boolean().default(false),
  soundEnabled: z.boolean().default(true),
  theme: z.enum(['default', 'sunset', 'ocean', 'forest', 'lavender', 'midnight', 'kitty', 'melody', 'kuromi', 'pompompurin', 'cinnamoroll', 'pochacco']).default('default'),
});

export type Settings = z.infer<typeof settingsSchema>;

