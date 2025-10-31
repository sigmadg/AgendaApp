/**
 * 📄 JSON CONFIG - CONFIGURACIONES TIPADAS
 * Gestión de datos estáticos y configuraciones de la aplicación
 */

import configData from './config.json';

// ============================================
// 🎯 TIPOS DE DATOS
// ============================================

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  features: string[];
}

export interface Theme {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  background: string;
  surface: string;
  text: string;
  'text-secondary': string;
}

export interface Locale {
  code: string;
  name: string;
  flag: string;
  default?: boolean;
}

export interface Features {
  authentication: {
    login: boolean;
    register: boolean;
    forgot_password: boolean;
    reset_password: boolean;
    social_login: boolean;
    biometric: boolean;
  };
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    in_app: boolean;
    reminders: boolean;
  };
  storage: {
    local: boolean;
    cloud: boolean;
    sync: boolean;
    backup: boolean;
  };
  accessibility: {
    high_contrast: boolean;
    reduced_motion: boolean;
    screen_reader: boolean;
    large_text: boolean;
  };
}

export interface Limits {
  max_tasks_per_day: number;
  max_events_per_month: number;
  max_notes_per_category: number;
  max_attachments_per_item: number;
  max_backup_size: string;
}

export interface Defaults {
  reminder_time: string;
  theme: string;
  language: string;
  timezone: string;
  date_format: string;
  time_format: string;
}

export interface ApiConfig {
  base_url: string;
  version: string;
  timeout: number;
  retry_attempts: number;
}

export interface AnalyticsConfig {
  enabled: boolean;
  tracking_id: string;
  events: string[];
}

export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
    author: string;
    year: number;
  };
  categories: Category[];
  themes: {
    light: Theme;
    dark: Theme;
  };
  locales: Locale[];
  features: Features;
  limits: Limits;
  defaults: Defaults;
  api: ApiConfig;
  analytics: AnalyticsConfig;
}

// ============================================
// 📄 CONFIGURACIÓN PRINCIPAL
// ============================================

export const CONFIG: AppConfig = configData as AppConfig;

// ============================================
// 🔧 UTILIDADES PARA CONFIGURACIONES
// ============================================

/**
 * Obtiene una categoría por su ID
 */
export const getCategoryById = (id: string): Category | undefined => {
  return CONFIG.categories.find(category => category.id === id);
};

/**
 * Obtiene todas las categorías activas
 */
export const getActiveCategories = (): Category[] => {
  return CONFIG.categories;
};

/**
 * Obtiene el tema actual
 */
export const getCurrentTheme = (themeName: 'light' | 'dark' = 'light'): Theme => {
  return CONFIG.themes[themeName];
};

/**
 * Obtiene el locale por defecto
 */
export const getDefaultLocale = (): Locale => {
  return CONFIG.locales.find(locale => locale.default) || CONFIG.locales[0];
};

/**
 * Obtiene un locale por código
 */
export const getLocaleByCode = (code: string): Locale | undefined => {
  return CONFIG.locales.find(locale => locale.code === code);
};

/**
 * Verifica si una característica está habilitada
 */
export const isFeatureEnabled = (category: keyof Features, feature: string): boolean => {
  const categoryFeatures = CONFIG.features[category];
  return (categoryFeatures as any)[feature] || false;
};

/**
 * Obtiene un valor por defecto
 */
export const getDefaultValue = (key: keyof Defaults): any => {
  return CONFIG.defaults[key];
};

/**
 * Obtiene el límite para una entidad
 */
export const getLimit = (key: keyof Limits): any => {
  return CONFIG.limits[key];
};

// ============================================
// 🎨 UTILIDADES DE TEMAS
// ============================================

/**
 * Obtiene los colores del tema actual
 */
export const getThemeColors = (themeName: 'light' | 'dark' = 'light') => {
  const theme = getCurrentTheme(themeName);
  return {
    // Colores principales
    primary: theme.primary,
    secondary: theme.secondary,
    success: theme.success,
    warning: theme.warning,
    danger: theme.danger,

    // Colores de superficie
    background: theme.background,
    surface: theme.surface,

    // Colores de texto
    text: theme.text,
    textSecondary: theme['text-secondary'],

    // Variantes
    primaryLight: adjustColor(theme.primary, 0.8),
    primaryDark: adjustColor(theme.primary, -0.2),
    surfaceElevated: adjustColor(theme.surface, -0.05),
  };
};

/**
 * Ajusta el brillo de un color hexadecimal
 */
const adjustColor = (color: string, amount: number): string => {
  const usePound = color[0] === '#';
  const col = usePound ? color.slice(1) : color;

  const num = parseInt(col, 16);
  let r = (num >> 16) + Math.round(amount * 255);
  let g = (num >> 8 & 0x00FF) + Math.round(amount * 255);
  let b = (num & 0x0000FF) + Math.round(amount * 255);

  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;

  return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16);
};

// ============================================
// 🌍 UTILIDADES DE LOCALIZACIÓN
// ============================================

/**
 * Obtiene la lista de idiomas disponibles
 */
export const getAvailableLocales = (): Locale[] => {
  return CONFIG.locales;
};

/**
 * Formatea una fecha según la configuración
 */
export const formatDate = (date: Date): string => {
  const format = CONFIG.defaults.date_format;
  // Implementación básica de formateo
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return format.replace('DD', day).replace('MM', month).replace('YYYY', year);
};

/**
 * Formatea una hora según la configuración
 */
export const formatTime = (date: Date): string => {
  const format = CONFIG.defaults.time_format;
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  if (format === '12h') {
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

// ============================================
// ⚙️ CONFIGURACIONES DE API
// ============================================

/**
 * Construye una URL completa para la API
 */
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = CONFIG.api.base_url;
  const version = CONFIG.api.version;
  return `${baseUrl}/${version}/${endpoint}`;
};

/**
 * Obtiene la configuración de timeout para requests
 */
export const getApiTimeout = (): number => {
  return CONFIG.api.timeout;
};

/**
 * Obtiene el número máximo de reintentos
 */
export const getApiRetryAttempts = (): number => {
  return CONFIG.api.retry_attempts;
};

// ============================================
// 📊 UTILIDADES DE ANALYTICS
// ============================================

/**
 * Verifica si analytics está habilitado
 */
export const isAnalyticsEnabled = (): boolean => {
  return CONFIG.analytics.enabled;
};

/**
 * Obtiene el ID de seguimiento
 */
export const getTrackingId = (): string => {
  return CONFIG.analytics.tracking_id;
};

/**
 * Verifica si un evento debe ser trackeado
 */
export const shouldTrackEvent = (eventName: string): boolean => {
  return CONFIG.analytics.events.includes(eventName);
};

// ============================================
// 🎯 EXPORTACIÓN PRINCIPAL
// ============================================

export const JSON_CONFIG = {
  CONFIG,
  getCategoryById,
  getActiveCategories,
  getCurrentTheme,
  getDefaultLocale,
  getLocaleByCode,
  isFeatureEnabled,
  getDefaultValue,
  getLimit,
  getThemeColors,
  getAvailableLocales,
  formatDate,
  formatTime,
  buildApiUrl,
  getApiTimeout,
  getApiRetryAttempts,
  isAnalyticsEnabled,
  getTrackingId,
  shouldTrackEvent,
};
