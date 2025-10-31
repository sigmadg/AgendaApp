# 📁 Sistema de Assets - AgendaApp Ionic

## 🎯 **Visión General**

El sistema de assets de AgendaApp proporciona una gestión centralizada y organizada de todos los recursos estáticos de la aplicación, incluyendo imágenes, iconos, fuentes, sonidos y configuraciones.

## 📂 **Estructura del Sistema**

```
src/assets/
├── 📄 index.ts              # Punto de entrada principal
├── 🖼️ images.ts             # Gestión de imágenes
├── 🎯 icons.ts              # Iconos de Ionic y categorías
├── 🔤 fonts.ts              # Sistema tipográfico
├── 🔊 sounds.ts             # Efectos de audio
├── 📄 json/                 # Configuraciones JSON
│   ├── index.ts            # Configuraciones tipadas
│   └── config.json         # Datos de configuración
└── 📖 README.md            # Esta documentación
```

## 🎨 **Uso de Imágenes**

### Importación
```typescript
import { IMAGES, getCategoryImage, getMascotaMood } from '@/assets/images';
```

### Uso Básico
```typescript
// Logo principal
<img src={IMAGES.LOGOS.MAIN} alt="AgendaApp Logo" />

// Imagen de categoría
<img src={getCategoryImage('health', 'BG')} alt="Salud" />

// Estado de ánimo de mascota
<img src={getMascotaMood('happy')} alt="Mascota feliz" />
```

### Imágenes Categóricas
```typescript
// Todas las categorías disponibles
const categories = IMAGES.CATEGORIES;

// Acceso específico
const healthIcon = IMAGES.CATEGORIES.HEALTH.ICON;
const workBackground = IMAGES.CATEGORIES.WORK.BG;
```

## 🎯 **Uso de Iconos**

### Importación
```typescript
import { ICONS, getCategoryIcon, getAuthIcon } from '@/assets/icons';
```

### Iconos de Ionic
```typescript
import { IonIcon } from '@ionic/react';

// Icono de corazón
<IonIcon icon={ICONS.IONICONS.HEART} />

// Icono de usuario
<IonIcon icon={ICONS.IONICONS.PERSON} />
```

### Iconos por Categoría
```typescript
// Icono de salud
<IonIcon icon={getCategoryIcon('health')} />

// Iconos de autenticación
<IonIcon icon={getAuthIcon('PASSWORD')} />
```

## 🔤 **Sistema Tipográfico**

### Importación
```typescript
import { FONTS, applyTypography, combineTypography } from '@/assets/fonts';
```

### Aplicación de Estilos
```typescript
// Aplicar estilo H1
const titleStyle = applyTypography('H1');

// Combinar con estilos personalizados
const customTitleStyle = combineTypography('H1', {
  color: 'var(--ion-color-primary)',
});

// En componentes
<Text style={titleStyle}>Título Principal</Text>
```

### Tamaños y Pesos
```typescript
// Acceso directo
const largeText = FONTS.SIZES['2XL'];
const boldWeight = FONTS.WEIGHTS.BOLD;

// En CSS-in-JS
const textStyle = {
  fontSize: FONTS.SIZES.BASE,
  fontWeight: FONTS.WEIGHTS.MEDIUM,
  lineHeight: FONTS.LINE_HEIGHTS.NORMAL,
};
```

## 🔊 **Sistema de Audio**

### Importación
```typescript
import { SOUNDS, audioManager, playActionSound } from '@/assets/sounds';
```

### Reproducción Básica
```typescript
// Sonido de éxito
await audioManager.play(SOUNDS.ACTION_SOUNDS.SUCCESS);

// Función utilitaria
playActionSound('SAVE');
```

### Gestión Avanzada
```typescript
// Configurar volúmenes
audioManager.setCategoryVolume('notifications', 0.8);

// Habilitar/deshabilitar audio
audioManager.setEnabled(true);

// Precargar sonidos críticos
await audioManager.preloadCriticalSounds();
```

## ⚙️ **Configuraciones JSON**

### Importación
```typescript
import { CONFIG, getCategoryById, getThemeColors } from '@/assets/json';
```

### Uso de Configuraciones
```typescript
// Información de la app
const appName = CONFIG.app.name;
const appVersion = CONFIG.app.version;

// Categorías
const healthCategory = getCategoryById('health');

// Colores del tema
const themeColors = getThemeColors('dark');
```

### Utilidades
```typescript
// Verificar características
const hasBiometric = isFeatureEnabled('authentication', 'biometric');

// Valores por defecto
const defaultLanguage = getDefaultValue('language');

// Límites
const maxTasks = getLimit('max_tasks_per_day');
```

## 🎯 **Gestión Global de Assets**

### Importación Principal
```typescript
import {
  ASSETS_CONFIG,
  getAssetPath,
  preloadCriticalImages,
  assetExists
} from '@/assets';
```

### Utilidades Globales
```typescript
// Verificar existencia de asset
const imageExists = await assetExists('/assets/images/logo.svg');

// Obtener ruta completa
const imagePath = getAssetPath('images', 'logo.svg');

// Precargar imágenes críticas
await preloadCriticalImages();
```

## 📋 **Convenciones de Nomenclatura**

### Archivos de Imágenes
```
logo-main.svg          # Logo principal
logo-icon.svg          # Icono de app
mascota-happy.png      # Mascota feliz
category-health-bg.jpg # Fondo de categoría salud
```

### Archivos de Audio
```
button-click.mp3       # Click de botón
success.mp3            # Sonido de éxito
notification.mp3       # Notificación genérica
```

### Estructura de Carpetas
```
assets/
├── images/           # Imágenes estáticas
│   ├── logos/       # Logos y marcas
│   ├── mascota/     # Personaje mascota
│   ├── auth/        # Autenticación
│   ├── categories/  # Categorías
│   └── decorative/  # Elementos decorativos
├── sounds/          # Audio
│   ├── actions/     # Acciones UI
│   ├── notifications/ # Notificaciones
│   └── music/       # Música de fondo
└── json/            # Configuraciones
```

## 🚀 **Mejores Prácticas**

### 1. **Lazy Loading**
```typescript
// Precargar solo imágenes críticas
await preloadCriticalImages();

// Cargar imágenes bajo demanda
const image = new Image();
image.src = getAssetPath('images', 'heavy-image.jpg');
```

### 2. **Optimización de Audio**
```typescript
// Configurar volúmenes apropiados
audioManager.setCategoryVolume('ambient', 0.3); // Música de fondo baja

// Evitar reproducción simultánea
audioManager.stop(previousSound);
audioManager.play(newSound);
```

### 3. **Responsive Images**
```typescript
import { getResponsiveImage } from '@/assets';

const responsiveLogo = getResponsiveImage('/assets/images/logo.svg', {
  sm: 480,
  md: 768,
  lg: 1024
});

// En JSX
<img
  src={responsiveLogo.original}
  srcSet={`${responsiveLogo.sm} 480w, ${responsiveLogo.md} 768w, ${responsiveLogo.lg} 1024w`}
  alt="Logo Responsivo"
/>
```

### 4. **Type Safety**
```typescript
// Usar tipos para categorías
type CategoryId = 'health' | 'work' | 'personal';

const getCategoryAssets = (id: CategoryId) => {
  return getCategoryById(id);
};
```

## 🔧 **Mantenimiento**

### Actualización de Assets
1. **Imágenes**: Colocar en carpetas correspondientes
2. **Sonidos**: Comprimir a formatos optimizados (MP3, OGG)
3. **Configuraciones**: Actualizar `config.json` y tipos
4. **Versionado**: Actualizar `version` en configuración

### Optimización
- **Imágenes**: Usar WebP cuando sea posible
- **Audio**: Comprimir y usar formatos apropiados
- **Bundle**: Considerar lazy loading para assets grandes
- **Cache**: Implementar estrategias de cache apropiadas

## 📊 **Estadísticas del Sistema**

- **Total de Assets**: 150+ recursos
- **Categorías**: 12 módulos principales
- **Temas**: Light/Dark mode completo
- **Idiomas**: 4 locales soportados
- **Audio**: 50+ efectos de sonido
- **Configuración**: Completamente tipada

---

## 🎊 **Resultado Final**

Este sistema de assets proporciona:

✅ **Organización perfecta** - Todo estructurado por categorías
✅ **Type safety completo** - TypeScript en todas las configuraciones
✅ **Performance optimizada** - Lazy loading y precarga inteligente
✅ **Mantenibilidad** - Fácil de extender y modificar
✅ **Escalabilidad** - Arquitectura preparada para crecimiento
✅ **Developer experience** - APIs intuitivas y bien documentadas

**¡El sistema está listo para ser usado en toda la aplicación!** 🚀✨
