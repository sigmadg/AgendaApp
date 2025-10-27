// Configuración de las subsecciones de PersonalProfile

export const sectionsConfig = [
  {
    id: 'events',
    name: 'Eventos del día',
    icon: 'calendar-outline',
    description: 'Gestiona tus eventos y citas',
    color: '#4A7C59',
    component: 'EventsSection'
  },
  {
    id: 'tasks',
    name: 'Tareas',
    icon: 'checkmark-circle-outline',
    description: 'Organiza tus tareas diarias',
    color: '#4A7C59',
    component: 'TasksSection'
  },
  {
    id: 'profile',
    name: 'Perfil',
    icon: 'person-outline',
    description: 'Gestiona tu información personal',
    color: '#4A7C59',
    component: 'ProfileSection'
  },
  {
    id: 'settings',
    name: 'Configuración',
    icon: 'settings-outline',
    description: 'Personaliza tu experiencia',
    color: '#4A7C59',
    component: 'SettingsSection'
  }
];

// Configuración de colores del ecosistema Forest
export const forestColors = {
  primary: '#2D5016',        // Verde bosque profundo
  secondary: '#4A7C59',     // Verde bosque medio
  accent: '#4A6741',         // Verde bosque claro
  background: '#F5F7F0',      // Verde muy claro
  surface: '#F8FAF6',        // Verde superficie
  light: '#E8F0E3',          // Verde muy claro
  text: '#2D5016',           // Texto principal
  textSecondary: '#4A6741',  // Texto secundario
  textMuted: '#6B7280',      // Texto atenuado
  white: '#FFFFFF',          // Blanco
  error: '#E53E3E',          // Rojo error
  success: '#4A7C59',        // Verde éxito
  warning: '#F59E0B',        // Amarillo advertencia
  info: '#3B82F6'            // Azul información
};

// Configuración de tipografía
export const typography = {
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: forestColors.text
  },
  subtitle: {
    fontSize: 12,
    color: forestColors.textMuted,
    fontWeight: '500'
  },
  body: {
    fontSize: 14,
    color: forestColors.textSecondary,
    lineHeight: 20
  },
  caption: {
    fontSize: 12,
    color: forestColors.textMuted,
    lineHeight: 16
  }
};

// Configuración de espaciado
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32
};

// Configuración de bordes
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999
};

// Configuración de sombras
export const shadows = {
  sm: {
    shadowColor: forestColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  md: {
    shadowColor: forestColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  lg: {
    shadowColor: forestColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6
  }
};
