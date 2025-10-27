// Exportar el componente principal
export { default as PersonalProfile } from './PersonalProfile';

// Exportar subsecciones individuales
export { default as EventsSection } from './sections/EventsSection';
export { default as TasksSection } from './sections/TasksSection';
export { default as ProfileSection } from './sections/ProfileSection';
export { default as SettingsSection } from './sections/SettingsSection';

// Exportar estilos
export { personalStyles } from './styles/personalStyles';

// Exportar configuración
export { sectionsConfig, forestColors, typography, spacing, borderRadius, shadows } from './config/sectionsConfig';

// Exportar utilidades
export * from './utils/helpers';
