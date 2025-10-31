/**
 * 🎯 ICONS - SISTEMA COMPLETO DE ICONOS
 * Iconos organizados por categorías y funcionalidades
 */

// ============================================
// 🎨 ICONOS DE IONIC (NOMBRE DE LOS ICONOS)
// ============================================

export const IONICONS = {
  // Navegación
  HOME: 'home',
  MENU: 'menu',
  BACK: 'arrow-back',
  FORWARD: 'arrow-forward',
  CLOSE: 'close',
  SEARCH: 'search',

  // Usuario y Perfil
  PERSON: 'person',
  PERSON_ADD: 'person-add',
  PERSON_CIRCLE: 'person-circle',
  SETTINGS: 'settings',
  LOGOUT: 'log-out',

  // Acciones
  ADD: 'add',
  EDIT: 'create',
  DELETE: 'trash',
  SAVE: 'checkmark',
  CANCEL: 'close-circle',
  REFRESH: 'refresh',
  SHARE: 'share',

  // Estados
  CHECKMARK: 'checkmark',
  CHECKMARK_CIRCLE: 'checkmark-circle',
  CLOSE_CIRCLE: 'close-circle',
  ALERT: 'alert',
  WARNING: 'warning',
  INFORMATION: 'information',

  // Salud y Bienestar
  HEART: 'heart',
  FITNESS: 'fitness',
  RESTAURANT: 'restaurant',
  WATER: 'water',
  BED: 'bed',
  MEDICAL: 'medical',

  // Trabajo
  BRIEFCASE: 'briefcase',
  BUSINESS: 'business',
  CALENDAR: 'calendar',
  TIME: 'time',
  TIMER: 'timer',

  // Educación
  SCHOOL: 'school',
  BOOK: 'book',
  LIBRARY: 'library',
  ACADEMIC_CAP: 'school',

  // Finanzas
  CARD: 'card',
  CASH: 'cash',
  PIE_CHART: 'pie-chart',
  TRENDLINE: 'trending-up',

  // Viajes
  PLANE: 'airplane',
  CAR: 'car',
  MAP: 'map',
  LOCATION: 'location',
  NAVIGATE: 'navigate',

  // Eventos
  PARTY: 'wine',
  GIFT: 'gift',
  HAPPY: 'happy',
  CAKE: 'restaurant',

  // Idiomas
  LANGUAGE: 'language',
  EARTH: 'earth',
  CHATBUBBLE: 'chatbubble',

  // Mascotas
  PAW: 'paw',
  PETS: 'paw',

  // Entretenimiento
  FILM: 'film',
  MUSIC: 'musical-notes',
  GAME_CONTROLLER: 'game-controller',

  // Comunicación
  MAIL: 'mail',
  CALL: 'call',
  CHAT: 'chatbubble',
  NOTIFICATIONS: 'notifications',

  // Redes Sociales
  LOGO_FACEBOOK: 'logo-facebook',
  LOGO_TWITTER: 'logo-twitter',
  LOGO_INSTAGRAM: 'logo-instagram',
  LOGO_LINKEDIN: 'logo-linkedin',

  // Dispositivos
  PHONE: 'phone-portrait',
  TABLET: 'tablet-portrait',
  LAPTOP: 'laptop',
  DESKTOP: 'desktop',

  // Archivos y Documentos
  DOCUMENT: 'document',
  FOLDER: 'folder',
  IMAGE: 'image',
  CAMERA: 'camera',

  // Clima
  SUNNY: 'sunny',
  RAINY: 'rainy',
  CLOUDY: 'cloudy',
  SNOW: 'snow',

  // Naturaleza
  LEAF: 'leaf',
  FLOWER: 'flower',
  TREE: 'leaf',
  STAR: 'star',

  // Objetos
  KEY: 'key',
  LOCK: 'lock',
  UNLOCK: 'unlock',
  EYE: 'eye',
  EYE_OFF: 'eye-off',
  GLOBE: 'globe',
  COMPASS: 'compass',
};

// ============================================
// 📂 ICONOS POR CATEGORÍAS
// ============================================

export const CATEGORY_ICONS = {
  PERSONAL: IONICONS.PERSON,
  HEALTH: IONICONS.HEART,
  WORK: IONICONS.BRIEFCASE,
  SCHOOL: IONICONS.SCHOOL,
  FINANCE: IONICONS.CARD,
  TRAVEL: IONICONS.PLANE,
  EVENTS: IONICONS.PARTY,
  LANGUAGES: IONICONS.LANGUAGE,
  PETS: IONICONS.PAW,
  SELFCARE: IONICONS.HEART,
  READING: IONICONS.BOOK,
  MOVIES: IONICONS.FILM,
};

// ============================================
// 🔐 ICONOS DE AUTENTICACIÓN
// ============================================

export const AUTH_ICONS = {
  EMAIL: IONICONS.MAIL,
  PASSWORD: IONICONS.LOCK,
  USERNAME: IONICONS.PERSON,
  PHONE: IONICONS.CALL,
  LOGIN: IONICONS.LOG_IN,
  LOGOUT: IONICONS.LOG_OUT,
  REGISTER: IONICONS.PERSON_ADD,
  FORGOT_PASSWORD: IONICONS.KEY,
  RESET_PASSWORD: IONICONS.REFRESH,
  SHOW_PASSWORD: IONICONS.EYE,
  HIDE_PASSWORD: IONICONS.EYE_OFF,
  REMEMBER_ME: IONICONS.CHECKMARK,
  SECURITY: IONICONS.SHIELD,
};

// ============================================
// 📊 ICONOS DE SALUD
// ============================================

export const HEALTH_ICONS = {
  HEART_RATE: IONICONS.HEART,
  BLOOD_PRESSURE: IONICONS.HEART,
  WEIGHT: IONICONS.BARCODE,
  HEIGHT: IONICONS.BARCODE,
  TEMPERATURE: IONICONS.THERMOMETER,
  SLEEP: IONICONS.BED,
  WATER: IONICONS.WATER,
  STEPS: IONICONS.FOOTSTEPS,
  CALORIES: IONICONS.FLAME,
  EXERCISE: IONICONS.FITNESS,
  NUTRITION: IONICONS.RESTAURANT,
  MEDICAL: IONICONS.MEDICAL,
  PILLS: IONICONS.MEDICAL,
  SYRINGE: IONICONS.MEDICAL,
  HOSPITAL: IONICONS.MEDICAL,
};

// ============================================
// 💼 ICONOS DE TRABAJO
// ============================================

export const WORK_ICONS = {
  OFFICE: IONICONS.BUSINESS,
  MEETING: IONICONS.PEOPLE,
  PROJECT: IONICONS.FOLDER,
  TASK: IONICONS.CHECKMARK_CIRCLE,
  DEADLINE: IONICONS.TIME,
  EMAIL: IONICONS.MAIL,
  PHONE: IONICONS.CALL,
  PRESENTATION: IONICONS.EASEL,
  REPORT: IONICONS.DOCUMENT,
  GOAL: IONICONS.TROPHY,
  PROMOTION: IONICONS.STAR,
  SALARY: IONICONS.CARD,
};

// ============================================
// 🎓 ICONOS DE EDUCACIÓN
// ============================================

export const EDUCATION_ICONS = {
  SCHOOL: IONICONS.SCHOOL,
  BOOK: IONICONS.BOOK,
  LIBRARY: IONICONS.LIBRARY,
  TEACHER: IONICONS.PERSON,
  STUDENT: IONICONS.PERSON,
  CLASS: IONICONS.PEOPLE,
  GRADE: IONICONS.STAR,
  TEST: IONICONS.CHECKMARK_CIRCLE,
  HOMEWORK: IONICONS.DOCUMENT,
  NOTEBOOK: IONICONS.BOOK,
  PENCIL: IONICONS.CREATE,
  ERASER: IONICONS.BACKSPACE,
};

// ============================================
// 💰 ICONOS DE FINANZAS
// ============================================

export const FINANCE_ICONS = {
  WALLET: IONICONS.CARD,
  BANK: IONICONS.BUSINESS,
  MONEY: IONICONS.CASH,
  CREDIT_CARD: IONICONS.CARD,
  DEBIT_CARD: IONICONS.CARD,
  BUDGET: IONICONS.PIE_CHART,
  SAVINGS: IONICONS.TRENDING_UP,
  INVESTMENT: IONICONS.TRENDING_UP,
  LOAN: IONICONS.CARD,
  TAX: IONICONS.DOCUMENT,
  RECEIPT: IONICONS.DOCUMENT,
  DONATION: IONICONS.HEART,
};

// ============================================
// ✈️ ICONOS DE VIAJES
// ============================================

export const TRAVEL_ICONS = {
  PLANE: IONICONS.AIRPLANE,
  TRAIN: IONICONS.TRAIN,
  BUS: IONICONS.BUS,
  CAR: IONICONS.CAR,
  SHIP: IONICONS.BOAT,
  HOTEL: IONICONS.BED,
  RESORT: IONICONS.BED,
  CAMPING: IONICONS.LEAF,
  BACKPACK: IONICONS.BAG,
  MAP: IONICONS.MAP,
  LOCATION: IONICONS.LOCATION,
  COMPASS: IONICONS.COMPASS,
};

// ============================================
// 🎉 ICONOS DE EVENTOS
// ============================================

export const EVENT_ICONS = {
  BIRTHDAY: IONICONS.CAKE,
  WEDDING: IONICONS.HEART,
  PARTY: IONICONS.WINE,
  CONCERT: IONICONS.MUSIC,
  THEATER: IONICONS.FILM,
  SPORTS: IONICONS.FITNESS,
  MEETING: IONICONS.PEOPLE,
  CONFERENCE: IONICONS.PEOPLE,
  CELEBRATION: IONICONS.HAPPY,
  ANNIVERSARY: IONICONS.HEART,
  HOLIDAY: IONICONS.GIFT,
  VACATION: IONICONS.PLANE,
};

// ============================================
// 🌍 ICONOS DE IDIOMAS
// ============================================

export const LANGUAGE_ICONS = {
  SPANISH: IONICONS.LANGUAGE,
  ENGLISH: IONICONS.LANGUAGE,
  FRENCH: IONICONS.LANGUAGE,
  GERMAN: IONICONS.LANGUAGE,
  ITALIAN: IONICONS.LANGUAGE,
  PORTUGUESE: IONICONS.LANGUAGE,
  CHINESE: IONICONS.LANGUAGE,
  JAPANESE: IONICONS.LANGUAGE,
  KOREAN: IONICONS.LANGUAGE,
  RUSSIAN: IONICONS.LANGUAGE,
  ARABIC: IONICONS.LANGUAGE,
  HINDI: IONICONS.LANGUAGE,
  SPEAK: IONICONS.MIC,
  LISTEN: IONICONS.HEADSET,
  READ: IONICONS.BOOK,
  WRITE: IONICONS.CREATE,
};

// ============================================
// 🐾 ICONOS DE MASCOTAS
// ============================================

export const PET_ICONS = {
  DOG: IONICONS.PAW,
  CAT: IONICONS.PAW,
  BIRD: IONICONS.PAW,
  FISH: IONICONS.PAW,
  HAMSTER: IONICONS.PAW,
  RABBIT: IONICONS.PAW,
  FOOD: IONICONS.RESTAURANT,
  WATER: IONICONS.WATER,
  VET: IONICONS.MEDICAL,
  GROOMING: IONICONS.CUT,
  TOYS: IONICONS.GAME_CONTROLLER,
  WALK: IONICONS.FOOTSTEPS,
};

// ============================================
// 🌸 ICONOS DE CUIDADO PERSONAL
// ============================================

export const SELFCARE_ICONS = {
  MEDITATION: IONICONS.LEAF,
  YOGA: IONICONS.FITNESS,
  RELAXATION: IONICONS.BED,
  SKINCARE: IONICONS.HEART,
  HAIRCARE: IONICONS.CUT,
  MAKEUP: IONICONS.COLOR_PALETTE,
  BATH: IONICONS.WATER,
  SLEEP: IONICONS.BED,
  JOURNAL: IONICONS.BOOK,
  GRATITUDE: IONICONS.HEART,
  MINDFULNESS: IONICONS.LEAF,
  SELF_LOVE: IONICONS.HEART,
};

// ============================================
// 📖 ICONOS DE LECTURA
// ============================================

export const READING_ICONS = {
  BOOK: IONICONS.BOOK,
  LIBRARY: IONICONS.LIBRARY,
  READING: IONICONS.BOOK,
  AUTHOR: IONICONS.PERSON,
  GENRE: IONICONS.PRICE_TAG,
  RATING: IONICONS.STAR,
  REVIEW: IONICONS.CHATBUBBLE,
  BOOKMARK: IONICONS.BOOKMARK,
  PAGE: IONICONS.DOCUMENT,
  CHAPTER: IONICONS.LIST,
  QUOTE: IONICONS.QUOTE,
  NOTE: IONICONS.CREATE,
};

// ============================================
// 🎬 ICONOS DE PELÍCULAS
// ============================================

export const MOVIE_ICONS = {
  FILM: IONICONS.FILM,
  CINEMA: IONICONS.FILM,
  DIRECTOR: IONICONS.PERSON,
  ACTOR: IONICONS.PERSON,
  GENRE: IONICONS.PRICE_TAG,
  RATING: IONICONS.STAR,
  REVIEW: IONICONS.CHATBUBBLE,
  WATCHLIST: IONICONS.BOOKMARK,
  PLAY: IONICONS.PLAY,
  PAUSE: IONICONS.PAUSE,
  POPCORN: IONICONS.RESTAURANT,
  TICKET: IONICONS.TICKET,
};

// ============================================
// 🔔 ICONOS DE NOTIFICACIONES
// ============================================

export const NOTIFICATION_ICONS = {
  REMINDER: IONICONS.ALARM,
  ALERT: IONICONS.WARNING,
  SUCCESS: IONICONS.CHECKMARK_CIRCLE,
  ERROR: IONICONS.CLOSE_CIRCLE,
  INFO: IONICONS.INFORMATION,
  BELL: IONICONS.NOTIFICATIONS,
  BELL_OFF: IONICONS.NOTIFICATIONS_OFF,
  MESSAGE: IONICONS.CHATBUBBLE,
  EMAIL: IONICONS.MAIL,
  PUSH: IONICONS.PHONE_PORTRAIT,
};

// ============================================
// ⚙️ ICONOS DE CONFIGURACIÓN
// ============================================

export const SETTINGS_ICONS = {
  GENERAL: IONICONS.SETTINGS,
  PROFILE: IONICONS.PERSON,
  SECURITY: IONICONS.LOCK,
  PRIVACY: IONICONS.EYE_OFF,
  NOTIFICATIONS: IONICONS.NOTIFICATIONS,
  APPEARANCE: IONICONS.COLOR_PALETTE,
  LANGUAGE: IONICONS.LANGUAGE,
  STORAGE: IONICONS.FOLDER,
  BACKUP: IONICONS.CLOUD_UPLOAD,
  HELP: IONICONS.HELP,
  ABOUT: IONICONS.INFORMATION,
  LOGOUT: IONICONS.LOG_OUT,
};

// ============================================
// 🎯 EXPORTACIÓN PRINCIPAL
// ============================================

export const ICONS = {
  IONICONS,
  CATEGORY_ICONS,
  AUTH_ICONS,
  HEALTH_ICONS,
  WORK_ICONS,
  EDUCATION_ICONS,
  FINANCE_ICONS,
  TRAVEL_ICONS,
  EVENT_ICONS,
  LANGUAGE_ICONS,
  PET_ICONS,
  SELFCARE_ICONS,
  READING_ICONS,
  MOVIE_ICONS,
  NOTIFICATION_ICONS,
  SETTINGS_ICONS,
};

// ============================================
// 🔧 UTILIDADES PARA ICONOS
// ============================================

/**
 * Obtiene el icono de una categoría específica
 */
export const getCategoryIcon = (categoryKey: string) => {
  return CATEGORY_ICONS[categoryKey as keyof typeof CATEGORY_ICONS] || IONICONS.PERSON;
};

/**
 * Obtiene el icono de autenticación según el tipo
 */
export const getAuthIcon = (type: keyof typeof AUTH_ICONS) => {
  return AUTH_ICONS[type];
};

/**
 * Obtiene todos los iconos de una categoría específica
 */
export const getIconsByCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case 'health': return HEALTH_ICONS;
    case 'work': return WORK_ICONS;
    case 'school': return EDUCATION_ICONS;
    case 'finance': return FINANCE_ICONS;
    case 'travel': return TRAVEL_ICONS;
    case 'events': return EVENT_ICONS;
    case 'languages': return LANGUAGE_ICONS;
    case 'pets': return PET_ICONS;
    case 'selfcare': return SELFCARE_ICONS;
    case 'reading': return READING_ICONS;
    case 'movies': return MOVIE_ICONS;
    default: return {};
  }
};

/**
 * Busca un icono por nombre
 */
export const findIcon = (name: string) => {
  const allIcons = { ...IONICONS };
  return allIcons[name as keyof typeof allIcons];
};
