/**
 * 🔤 FONTS - SISTEMA DE FUENTES TIPOGRÁFICAS
 * Gestión completa de tipografías y estilos de texto
 */

// ============================================
// 🎨 FUENTES PRINCIPALES
// ============================================

export const FONT_FAMILIES = {
  PRIMARY: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  SECONDARY: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  ACCENT: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  MONOSPACE: '"SF Mono", Monaco, Inconsolata, "Roboto Mono", Consolas, monospace',
};

// ============================================
// 📏 PESOS DE FUENTE
// ============================================

export const FONT_WEIGHTS = {
  THIN: 100,
  EXTRA_LIGHT: 200,
  LIGHT: 300,
  REGULAR: 400,
  MEDIUM: 500,
  SEMI_BOLD: 600,
  BOLD: 700,
  EXTRA_BOLD: 800,
  BLACK: 900,
} as const;

// ============================================
// 📐 TAMAÑOS DE FUENTE
// ============================================

export const FONT_SIZES = {
  // Escala de texto pequeña
  XS: '0.75rem',      // 12px
  SM: '0.875rem',     // 14px
  BASE: '1rem',       // 16px

  // Escala de texto mediana
  LG: '1.125rem',     // 18px
  XL: '1.25rem',      // 20px
  '2XL': '1.5rem',    // 24px

  // Escala de texto grande
  '3XL': '1.875rem',  // 30px
  '4XL': '2.25rem',   // 36px
  '5XL': '3rem',      // 48px
  '6XL': '3.75rem',   // 60px
  '7XL': '4.5rem',    // 72px
  '8XL': '6rem',      // 96px
  '9XL': '8rem',      // 128px
} as const;

// ============================================
// 📏 ALTURAS DE LÍNEA
// ============================================

export const LINE_HEIGHTS = {
  NONE: 1,
  TIGHT: 1.25,
  SNUG: 1.375,
  NORMAL: 1.5,
  RELAXED: 1.625,
  LOOSE: 2,
} as const;

// ============================================
// 📏 ESPACIADO DE LETRAS
// ============================================

export const LETTER_SPACING = {
  TIGHTER: '-0.05em',
  TIGHT: '-0.025em',
  NORMAL: '0em',
  WIDE: '0.025em',
  WIDER: '0.05em',
  WIDEST: '0.1em',
} as const;

// ============================================
// 🎯 CONFIGURACIONES TIPOGRÁFICAS
// ============================================

export const TYPOGRAPHY = {
  // Títulos principales
  H1: {
    fontFamily: FONT_FAMILIES.SECONDARY,
    fontSize: FONT_SIZES['4XL'],
    fontWeight: FONT_WEIGHTS.EXTRA_BOLD,
    lineHeight: LINE_HEIGHTS.TIGHT,
    letterSpacing: LETTER_SPACING.TIGHT,
  },

  H2: {
    fontFamily: FONT_FAMILIES.SECONDARY,
    fontSize: FONT_SIZES['3XL'],
    fontWeight: FONT_WEIGHTS.BOLD,
    lineHeight: LINE_HEIGHTS.TIGHT,
    letterSpacing: LETTER_SPACING.TIGHT,
  },

  H3: {
    fontFamily: FONT_FAMILIES.SECONDARY,
    fontSize: FONT_SIZES['2XL'],
    fontWeight: FONT_WEIGHTS.BOLD,
    lineHeight: LINE_HEIGHTS.TIGHT,
    letterSpacing: LETTER_SPACING.TIGHT,
  },

  H4: {
    fontFamily: FONT_FAMILIES.SECONDARY,
    fontSize: FONT_SIZES.XL,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
    lineHeight: LINE_HEIGHTS.SNUG,
    letterSpacing: LETTER_SPACING.NORMAL,
  },

  H5: {
    fontFamily: FONT_FAMILIES.PRIMARY,
    fontSize: FONT_SIZES.LG,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
    lineHeight: LINE_HEIGHTS.SNUG,
    letterSpacing: LETTER_SPACING.NORMAL,
  },

  H6: {
    fontFamily: FONT_FAMILIES.PRIMARY,
    fontSize: FONT_SIZES.BASE,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
    lineHeight: LINE_HEIGHTS.SNUG,
    letterSpacing: LETTER_SPACING.NORMAL,
  },

  // Texto principal
  BODY: {
    fontFamily: FONT_FAMILIES.PRIMARY,
    fontSize: FONT_SIZES.BASE,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.NORMAL,
  },

  BODY_LARGE: {
    fontFamily: FONT_FAMILIES.PRIMARY,
    fontSize: FONT_SIZES.LG,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.NORMAL,
  },

  // Texto secundario
  CAPTION: {
    fontFamily: FONT_FAMILIES.PRIMARY,
    fontSize: FONT_SIZES.SM,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.WIDE,
  },

  CAPTION_BOLD: {
    fontFamily: FONT_FAMILIES.PRIMARY,
    fontSize: FONT_SIZES.SM,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
    lineHeight: LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.WIDE,
  },

  // Texto pequeño
  SMALL: {
    fontFamily: FONT_FAMILIES.PRIMARY,
    fontSize: FONT_SIZES.XS,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.WIDE,
  },

  SMALL_BOLD: {
    fontFamily: FONT_FAMILIES.PRIMARY,
    fontSize: FONT_SIZES.XS,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
    lineHeight: LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.WIDE,
  },

  // Texto especial
  LEAD: {
    fontFamily: FONT_FAMILIES.PRIMARY,
    fontSize: FONT_SIZES.LG,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: LINE_HEIGHTS.RELAXED,
    letterSpacing: LETTER_SPACING.NORMAL,
  },

  QUOTE: {
    fontFamily: FONT_FAMILIES.SECONDARY,
    fontSize: FONT_SIZES.LG,
    fontWeight: FONT_WEIGHTS.MEDIUM,
    lineHeight: LINE_HEIGHTS.RELAXED,
    letterSpacing: LETTER_SPACING.NORMAL,
    fontStyle: 'italic',
  },

  // Código
  CODE: {
    fontFamily: FONT_FAMILIES.MONOSPACE,
    fontSize: FONT_SIZES.SM,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.NORMAL,
  },

  // Botones
  BUTTON: {
    fontFamily: FONT_FAMILIES.PRIMARY,
    fontSize: FONT_SIZES.BASE,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
    lineHeight: LINE_HEIGHTS.NONE,
    letterSpacing: LETTER_SPACING.WIDE,
    textTransform: 'none',
  },

  BUTTON_SMALL: {
    fontFamily: FONT_FAMILIES.PRIMARY,
    fontSize: FONT_SIZES.SM,
    fontWeight: FONT_WEIGHTS.SEMI_BOLD,
    lineHeight: LINE_HEIGHTS.NONE,
    letterSpacing: LETTER_SPACING.WIDE,
    textTransform: 'none',
  },

  // Inputs
  INPUT: {
    fontFamily: FONT_FAMILIES.PRIMARY,
    fontSize: FONT_SIZES.BASE,
    fontWeight: FONT_WEIGHTS.REGULAR,
    lineHeight: LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.NORMAL,
  },

  INPUT_LABEL: {
    fontFamily: FONT_FAMILIES.PRIMARY,
    fontSize: FONT_SIZES.SM,
    fontWeight: FONT_WEIGHTS.MEDIUM,
    lineHeight: LINE_HEIGHTS.NORMAL,
    letterSpacing: LETTER_SPACING.WIDE,
  },
};

// ============================================
// 🎨 ESTILOS ESPECIALES
// ============================================

export const TEXT_STYLES = {
  // Gradientes de texto
  GRADIENT: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  GRADIENT_SECONDARY: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  GRADIENT_SUCCESS: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  // Efectos de texto
  SHADOW: {
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },

  SHADOW_STRONG: {
    textShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  },

  // Decoraciones
  UNDERLINE: {
    textDecoration: 'underline',
    textDecorationColor: 'rgba(102, 126, 234, 0.5)',
    textDecorationThickness: '2px',
    textUnderlineOffset: '4px',
  },

  STRIKETHROUGH: {
    textDecoration: 'line-through',
    textDecorationColor: 'rgba(239, 68, 68, 0.7)',
  },

  // Estados
  DISABLED: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },

  FOCUS: {
    outline: '2px solid #667eea',
    outlineOffset: '2px',
  },

  // Animaciones
  FADE_IN: {
    animation: 'fadeIn 0.3s ease-in-out',
  },

  SLIDE_UP: {
    animation: 'slideUp 0.3s ease-out',
  },
};

// ============================================
// 📏 UTILIDADES TIPOGRÁFICAS
// ============================================

/**
 * Aplica estilos tipográficos a un componente
 */
export const applyTypography = (variant: keyof typeof TYPOGRAPHY) => {
  return TYPOGRAPHY[variant];
};

/**
 * Combina estilos tipográficos con estilos personalizados
 */
export const combineTypography = (
  variant: keyof typeof TYPOGRAPHY,
  customStyles: Record<string, any>
) => {
  return { ...TYPOGRAPHY[variant], ...customStyles };
};

/**
 * Obtiene el tamaño de fuente responsivo
 */
export const getResponsiveFontSize = (
  baseSize: string,
  breakpoints: { sm?: string; md?: string; lg?: string } = {}
) => {
  return {
    fontSize: baseSize,
    '@media (min-width: 640px)': { fontSize: breakpoints.sm || baseSize },
    '@media (min-width: 768px)': { fontSize: breakpoints.md || breakpoints.sm || baseSize },
    '@media (min-width: 1024px)': { fontSize: breakpoints.lg || breakpoints.md || breakpoints.sm || baseSize },
  };
};

/**
 * Calcula la altura de línea óptima basada en el tamaño de fuente
 */
export const calculateOptimalLineHeight = (fontSize: number, baseLineHeight: number = 1.5) => {
  return Math.round(fontSize * baseLineHeight);
};

// ============================================
// 🎯 EXPORTACIÓN PRINCIPAL
// ============================================

export const FONTS = {
  FAMILIES: FONT_FAMILIES,
  WEIGHTS: FONT_WEIGHTS,
  SIZES: FONT_SIZES,
  LINE_HEIGHTS,
  LETTER_SPACING,
  TYPOGRAPHY,
  TEXT_STYLES,
};
