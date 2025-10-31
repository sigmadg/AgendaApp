import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Paleta de colores inspirada en la naturaleza - Formal pero natural
export const colors = {
  // Colores principales del tema natural
  primary: '#2D5016',        // Verde bosque profundo
  secondary: '#1A3D0A',      // Verde musgo oscuro
  accent: '#4A6741',         // Verde oliva
  
  // Colores de fondo (tema natural)
  background: '#F5F7F0',     // Crema natural
  surface: '#E8F0E3',        // Verde menta suave
  card: '#F0F4ED',          // Verde pálido
  paper: '#F8FAF6',         // Blanco natural
  
  // Colores de texto (tema natural)
  textPrimary: '#2D5016',    // Verde bosque
  textSecondary: '#4A6741',  // Verde oliva
  textTertiary: '#6B7C5A',   // Verde grisáceo
  
  // Colores de estado (tema natural)
  success: '#4A7C59',        // Verde esmeralda
  warning: '#D4A574',        // Dorado atardecer
  error: '#B85450',          // Rojo terracota
  info: '#5B8FA8',           // Azul océano
  
  // Colores naturales para resaltar
  nature: {
    forest: '#2D5016',       // Verde bosque profundo
    moss: '#4A6741',         // Verde musgo
    sage: '#6B7C5A',         // Verde salvia
    ocean: '#5B8FA8',        // Azul océano
    sky: '#87CEEB',          // Azul cielo
    earth: '#8B4513',        // Marrón tierra
    sunset: '#D4A574',       // Dorado atardecer
    sunrise: '#F4A460',      // Naranja amanecer
    stone: '#A8A8A8',        // Gris piedra
    sand: '#F4E4BC',         // Beige arena
  },
  
  // Colores de escritura natural
  ink: '#2D5016',           // Tinta verde bosque
  pencil: '#6B7C5A',        // Lápiz verde grisáceo
  highlighter: '#87CEEB',   // Resaltador azul cielo
  marker: '#D4A574',        // Marcador dorado atardecer
  pen: '#4A7C59',           // Pluma verde esmeralda
  
  // Colores naturales del tema
  earth: '#8B4513',         // Marrón tierra
  forest: '#2D5016',        // Verde bosque
  sky: '#87CEEB',           // Azul cielo
  sunset: '#D4A574',        // Dorado atardecer
  moon: '#A8A8A8',          // Gris piedra
  
  // Colores de acuarela natural
  watercolor1: '#E8F0E3',   // Verde menta suave
  watercolor2: '#F0F4ED',   // Verde pálido
  watercolor3: '#F4E4BC',   // Beige arena
  watercolor4: '#F8FAF6',   // Blanco natural
  
  // Sombras naturales
  shadow: 'rgba(45, 80, 22, 0.2)',
  shadowDark: 'rgba(26, 61, 10, 0.3)',
  paperShadow: 'rgba(74, 103, 65, 0.15)', // Verde musgo para sombra de papel
};

// Tipografía de Bullet Journal (escritura a mano)
export const typography = {
  // Tamaños de fuente orgánicos
  h1: 32, // Títulos principales (escritura grande)
  h2: 28, // Subtítulos principales
  h3: 24, // Títulos de sección
  h4: 20, // Subtítulos de sección
  h5: 18, // Títulos de componente
  h6: 16, // Títulos pequeños
  body: 15, // Texto principal (escritura normal)
  bodyLarge: 17, // Texto principal grande
  bodySmall: 13, // Texto secundario
  caption: 12, // Texto de apoyo
  small: 10, // Texto muy pequeño
  
  // Pesos de fuente naturales
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  
  // Altura de línea orgánica (como escritura a mano)
  lineHeight: {
    tight: 1.3, // Para títulos
    normal: 1.5, // Para texto normal
    comfortable: 1.7, // Para texto largo
    relaxed: 1.9, // Para texto espaciado
  },
  
  // Espaciado entre letras natural
  letterSpacing: {
    tight: -0.3,
    normal: 0.2,
    wide: 0.8,
    wider: 1.2,
  },
};

// Espaciado consistente
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Bordes redondeados
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 999,
};

// Sombras naturales inspiradas en la naturaleza
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  paper: {
    shadowColor: colors.nature.forest,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  sm: {
    shadowColor: colors.nature.moss,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: colors.nature.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.nature.forest,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: colors.nature.forest,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Estilos globales de Bullet Journal
export const globalStyles = StyleSheet.create({
  // Contenedor principal (página de papel)
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Contenido principal (escritura en papel)
  content: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  
  // Tarjetas (notas naturales)
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.nature.sage,
    ...shadows.paper,
  },
  
  // Botones naturales
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.nature.forest,
    ...shadows.sm,
  },
  
  buttonSecondary: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.nature.moss,
    ...shadows.sm,
  },
  
  buttonText: {
    color: colors.textPrimary,
    fontSize: typography.h6,
    fontWeight: typography.semiBold,
  },
  
  // Estilos naturales para resaltar elementos importantes
  natureHighlight: {
    borderWidth: 2,
    borderColor: colors.nature.ocean,
    shadowColor: colors.nature.ocean,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  
  natureText: {
    color: colors.nature.forest,
    textShadowColor: colors.nature.forest,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  
  natureButton: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.nature.sunset,
    shadowColor: colors.nature.sunset,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Inputs naturales
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.nature.sage,
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  
  inputFocused: {
    borderColor: colors.nature.forest,
    borderWidth: 2,
    ...shadows.sm,
  },
  
  // Textos elegantes y legibles
  title: {
    fontSize: typography.h3,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    lineHeight: typography.lineHeight.tight * typography.h3,
    letterSpacing: typography.letterSpacing.tight,
  },
  
  subtitle: {
    fontSize: typography.h5,
    fontWeight: typography.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    lineHeight: typography.lineHeight.normal * typography.h5,
    letterSpacing: typography.letterSpacing.normal,
  },
  
  body: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.comfortable * typography.body,
    letterSpacing: typography.letterSpacing.normal,
  },
  
  bodyLarge: {
    fontSize: typography.bodyLarge,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.comfortable * typography.bodyLarge,
    letterSpacing: typography.letterSpacing.normal,
  },
  
  caption: {
    fontSize: typography.caption,
    color: colors.textTertiary,
    lineHeight: typography.lineHeight.normal * typography.caption,
    letterSpacing: typography.letterSpacing.normal,
  },
  
  // Iconos
  icon: {
    fontSize: 24,
    color: colors.primary,
  },
  
  iconSecondary: {
    fontSize: 24,
    color: colors.secondary,
  },
  
  // Espaciado
  marginTop: {
    marginTop: spacing.md,
  },
  
  marginBottom: {
    marginBottom: spacing.md,
  },
  
  marginHorizontal: {
    marginHorizontal: spacing.md,
  },
  
  marginVertical: {
    marginVertical: spacing.md,
  },
  
  padding: {
    padding: spacing.md,
  },
  
  paddingHorizontal: {
    paddingHorizontal: spacing.md,
  },
  
  paddingVertical: {
    paddingVertical: spacing.md,
  },
  
  // Flexbox
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  spaceAround: {
    justifyContent: 'space-around',
  },
  
  // Bordes
  border: {
    borderWidth: 1,
    borderColor: colors.textTertiary,
  },
  
  borderRounded: {
    borderRadius: borderRadius.md,
  },
  
  // Sombras
  shadow: {
    ...shadows.sm,
  },
  
  shadowMedium: {
    ...shadows.md,
  },
  
  shadowLarge: {
    ...shadows.lg,
  },
});

// Estilos específicos para componentes
export const componentStyles = {
  // Header
  header: {
    backgroundColor: colors.surface,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  
  // Sidebar
  sidebar: {
    backgroundColor: colors.surface,
    width: width * 0.8,
    ...shadows.lg,
  },
  
  // Calendar
  calendar: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.sm,
  },
  
  // Task List
  taskList: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.sm,
  },
  
  // Event Item
  eventItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.xs,
    ...shadows.sm,
  },
};

export default globalStyles;
