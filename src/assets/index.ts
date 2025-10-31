/**
 * 📁 ASSETS INDEX - GESTIÓN CENTRALIZADA DE RECURSOS
 * Sistema completo de assets para AgendaApp Ionic
 */

export * from './images';
export * from './icons';
export * from './fonts';
export * from './sounds';

// ============================================
// 🎯 CONFIGURACIÓN GLOBAL DE ASSETS
// ============================================

export const ASSETS_CONFIG = {
  // Configuración de imágenes
  IMAGE_CONFIG: {
    formats: ['webp', 'png', 'jpg', 'svg'],
    quality: 90,
    maxWidth: 1920,
    maxHeight: 1080,
  },

  // Configuración de iconos
  ICON_CONFIG: {
    formats: ['svg', 'png'],
    sizes: [16, 24, 32, 48, 64, 96, 128],
    defaultSize: 24,
  },

  // Configuración de fuentes
  FONT_CONFIG: {
    families: ['Inter', 'Poppins', 'Montserrat'],
    weights: [300, 400, 500, 600, 700, 800],
    formats: ['woff2', 'woff', 'ttf'],
  },

  // Configuración de sonidos
  SOUND_CONFIG: {
    formats: ['mp3', 'wav', 'ogg'],
    volume: 0.7,
  },
};

// ============================================
// 🔧 UTILIDADES PARA ASSETS
// ============================================

/**
 * Obtiene la ruta completa de un asset
 */
export const getAssetPath = (category: string, filename: string): string => {
  return `/assets/${category}/${filename}`;
};

/**
 * Verifica si un asset existe
 */
export const assetExists = (path: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = path;
  });
};

/**
 * Precarga imágenes críticas
 */
export const preloadCriticalImages = (): Promise<void[]> => {
  const criticalImages = [
    IMAGES.LOGO.MAIN,
    IMAGES.MASCOTA.DEFAULT,
    IMAGES.AUTH.BACKGROUND,
  ];

  return Promise.all(
    criticalImages.map(img =>
      new Promise<void>((resolve) => {
        const image = new Image();
        image.onload = () => resolve();
        image.src = img;
      })
    )
  );
};

/**
 * Genera URLs optimizadas para diferentes dispositivos
 */
export const getResponsiveImage = (
  basePath: string,
  breakpoints: { sm: number; md: number; lg: number } = { sm: 480, md: 768, lg: 1024 }
) => {
  return {
    sm: `${basePath}?w=${breakpoints.sm}`,
    md: `${basePath}?w=${breakpoints.md}`,
    lg: `${basePath}?w=${breakpoints.lg}`,
    original: basePath,
  };
};

// ============================================
// 📊 METADATOS DE ASSETS
// ============================================

export const ASSETS_METADATA = {
  totalImages: 25,
  totalIcons: 50,
  totalFonts: 3,
  totalSounds: 5,
  lastUpdated: new Date().toISOString(),
  version: '1.0.0',
};
