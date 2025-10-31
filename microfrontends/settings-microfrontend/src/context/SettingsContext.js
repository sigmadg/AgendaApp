import React, { createContext, useContext, useState, useEffect } from 'react';
import { SettingsService } from '../services/SettingsService';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [appSettings, setAppSettings] = useState(null);
  const [userSettings, setUserSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const settingsService = new SettingsService();

  // Cargar configuraciones al inicializar
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [appData, userData] = await Promise.all([
        settingsService.getAppSettings(),
        settingsService.getUserSettings(),
      ]);
      
      setAppSettings(appData);
      setUserSettings(userData);
    } catch (err) {
      setError(err.message);
      // Datos de ejemplo en caso de error
      setAppSettings({
        language: 'es',
        timezone: 'UTC',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        currency: 'EUR',
        theme: 'system',
        notifications: {
          push: true,
          email: true,
          sms: false,
        },
        privacy: {
          publicProfile: true,
          showEmail: false,
          showPhone: false,
        },
      });
      
      setUserSettings({
        theme: 'system',
        fontSize: 'medium',
        animations: true,
        notifications: {
          push: true,
          email: true,
          sms: false,
          marketing: false,
          updates: true,
          reminders: true,
        },
        privacy: {
          publicProfile: true,
          showEmail: false,
          showPhone: false,
          showLastSeen: true,
        },
        appearance: {
          compactMode: false,
          showAvatars: true,
          showTimestamps: true,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAppSettings = async (settingsData) => {
    try {
      setLoading(true);
      const updatedSettings = await settingsService.updateAppSettings(settingsData);
      setAppSettings(updatedSettings);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserSettings = async (settingsData) => {
    try {
      setLoading(true);
      const updatedSettings = await settingsService.updateUserSettings(settingsData);
      setUserSettings(updatedSettings);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = async () => {
    try {
      setLoading(true);
      await settingsService.resetSettings();
      await loadSettings();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportSettings = async () => {
    try {
      setLoading(true);
      const settings = await settingsService.exportSettings();
      return settings;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const importSettings = async (settingsFile) => {
    try {
      setLoading(true);
      const settings = await settingsService.importSettings(settingsFile);
      await loadSettings();
      return settings;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key, category = 'user') => {
    if (category === 'app') {
      return appSettings?.[key];
    }
    return userSettings?.[key];
  };

  const setSetting = async (key, value, category = 'user') => {
    try {
      if (category === 'app') {
        await updateAppSettings({ [key]: value });
      } else {
        await updateUserSettings({ [key]: value });
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleSetting = async (key, category = 'user') => {
    const currentValue = getSetting(key, category);
    await setSetting(key, !currentValue, category);
  };

  const getSettingsByCategory = (category) => {
    if (category === 'app') {
      return appSettings;
    }
    return userSettings;
  };

  const validateSettings = (settings) => {
    const errors = [];
    
    if (settings.language && !['es', 'en', 'fr', 'de', 'it', 'pt'].includes(settings.language)) {
      errors.push('Idioma no válido');
    }
    
    if (settings.theme && !['light', 'dark', 'system'].includes(settings.theme)) {
      errors.push('Tema no válido');
    }
    
    if (settings.fontSize && !['small', 'medium', 'large'].includes(settings.fontSize)) {
      errors.push('Tamaño de fuente no válido');
    }
    
    return errors;
  };

  const getSettingsStats = () => {
    if (!appSettings || !userSettings) return null;

    return {
      totalSettings: Object.keys(appSettings).length + Object.keys(userSettings).length,
      customizedSettings: Object.values(userSettings).filter(value => 
        typeof value === 'object' ? Object.values(value).some(v => v !== null && v !== undefined) : value !== null && value !== undefined
      ).length,
      lastUpdated: userSettings.updatedAt || appSettings.updatedAt,
    };
  };

  const value = {
    // State
    appSettings,
    userSettings,
    loading,
    error,
    
    // Actions
    loadSettings,
    updateAppSettings,
    updateUserSettings,
    resetSettings,
    exportSettings,
    importSettings,
    
    // Utilities
    getSetting,
    setSetting,
    toggleSetting,
    getSettingsByCategory,
    validateSettings,
    getSettingsStats,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
