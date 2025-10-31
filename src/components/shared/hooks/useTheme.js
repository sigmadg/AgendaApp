import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@agendaapp_theme';

const themes = {
  forest: {
    name: 'Bosque',
    colors: {
      primary: '#2D5016',
      secondary: '#4A7C59',
      accent: '#4A6741',
      background: '#F5F7F0',
      surface: '#F8FAF6',
      light: '#E8F0E3',
      text: '#2D5016',
      textSecondary: '#4A6741',
      textMuted: '#6B7280',
      white: '#FFFFFF',
      error: '#E53E3E',
      success: '#38A169',
      warning: '#D69E2E',
      info: '#3B82F6',
    },
    gradients: {
      primary: ['#2D5016', '#4A7C59'],
      secondary: ['#4A7C59', '#4A6741'],
    },
  },
  ocean: {
    name: 'Océano',
    colors: {
      primary: '#1E3A8A',
      secondary: '#4A90E2',
      accent: '#4A90E2',
      background: '#F0F8FF',
      surface: '#F8FAFC',
      light: '#E8F0F3',
      text: '#1E3A8A',
      textSecondary: '#4A90E2',
      textMuted: '#6B7280',
      white: '#FFFFFF',
      error: '#E53E3E',
      success: '#38A169',
      warning: '#D69E2E',
      info: '#3B82F6',
    },
    gradients: {
      primary: ['#1E3A8A', '#4A90E2'],
      secondary: ['#4A90E2', '#1E3A8A'],
    },
  },
  desert: {
    name: 'Desierto',
    colors: {
      primary: '#8B4513',
      secondary: '#D2691E',
      accent: '#D2691E',
      background: '#FDF5E6',
      surface: '#F8FAF6',
      light: '#F5E6D3',
      text: '#8B4513',
      textSecondary: '#D2691E',
      textMuted: '#6B7280',
      white: '#FFFFFF',
      error: '#E53E3E',
      success: '#38A169',
      warning: '#D69E2E',
      info: '#3B82F6',
    },
    gradients: {
      primary: ['#8B4513', '#D2691E'],
      secondary: ['#D2691E', '#8B4513'],
    },
  },
  mountain: {
    name: 'Montaña',
    colors: {
      primary: '#1E3A5F',
      secondary: '#4A6B8A',
      accent: '#4A6B8A',
      background: '#F8FAFC',
      surface: '#F0F4F7',
      light: '#E8F0F3',
      text: '#1E3A5F',
      textSecondary: '#4A6B8A',
      textMuted: '#6B7280',
      white: '#FFFFFF',
      error: '#E53E3E',
      success: '#38A169',
      warning: '#D69E2E',
      info: '#3B82F6',
    },
    gradients: {
      primary: ['#1E3A5F', '#4A6B8A'],
      secondary: ['#4A6B8A', '#1E3A5F'],
    },
  },
  neutral: {
    name: 'Neutral',
    colors: {
      primary: '#6C757D',
      secondary: '#ADB5BD',
      accent: '#ADB5BD',
      background: '#FFFFFF',
      surface: '#F8F9FA',
      light: '#E9ECEF',
      text: '#212529',
      textSecondary: '#6C757D',
      textMuted: '#6C757D',
      white: '#FFFFFF',
      error: '#E53E3E',
      success: '#38A169',
      warning: '#D69E2E',
      info: '#3B82F6',
    },
    gradients: {
      primary: ['#6C757D', '#ADB5BD'],
      secondary: ['#ADB5BD', '#6C757D'],
    },
  },
};

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('forest');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar tema guardado al inicializar
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error al cargar tema:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTheme = async (theme) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Error al guardar tema:', error);
    }
  };

  const changeTheme = (theme) => {
    if (themes[theme]) {
      setCurrentTheme(theme);
      saveTheme(theme);
    }
  };

  const getTheme = () => {
    return themes[currentTheme] || themes.forest;
  };

  const getThemeColors = () => {
    return getTheme().colors;
  };

  const getThemeGradients = () => {
    return getTheme().gradients;
  };

  const getAvailableThemes = () => {
    return Object.keys(themes).map(key => ({
      key,
      name: themes[key].name,
      colors: themes[key].colors,
    }));
  };

  const isDarkTheme = () => {
    // Determinar si el tema es oscuro basado en el color de fondo
    const theme = getTheme();
    const backgroundColor = theme.colors.background;
    
    // Convertir hex a RGB y calcular luminancia
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };

  const getContrastColor = (backgroundColor) => {
    // Calcular color de contraste para texto
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const getThemeStyle = (component, variant = 'default') => {
    const theme = getTheme();
    const colors = theme.colors;
    
    // Estilos base para componentes
    const componentStyles = {
      button: {
        primary: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          color: colors.white,
        },
        secondary: {
          backgroundColor: colors.secondary,
          borderColor: colors.secondary,
          color: colors.white,
        },
        outline: {
          backgroundColor: 'transparent',
          borderColor: colors.primary,
          color: colors.primary,
        },
      },
      card: {
        default: {
          backgroundColor: colors.surface,
          borderColor: colors.light,
          shadowColor: colors.primary,
        },
        elevated: {
          backgroundColor: colors.surface,
          borderColor: colors.light,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        },
      },
      header: {
        default: {
          backgroundColor: colors.primary,
          borderColor: colors.secondary,
          titleColor: colors.white,
          subtitleColor: colors.white,
        },
      },
    };
    
    return componentStyles[component]?.[variant] || {};
  };

  return {
    currentTheme,
    isLoading,
    changeTheme,
    getTheme,
    getThemeColors,
    getThemeGradients,
    getAvailableThemes,
    isDarkTheme,
    getContrastColor,
    getThemeStyle,
    themes,
  };
};

export default useTheme;
