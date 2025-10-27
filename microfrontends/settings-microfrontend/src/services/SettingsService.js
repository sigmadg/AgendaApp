import axios from 'axios';

class SettingsService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_GATEWAY_URL || 'http://localhost:3000';
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('SettingsService Error:', error);
        throw new Error(error.response?.data?.message || 'Error en el servicio de configuración');
      }
    );
  }

  // Obtener configuración de la aplicación
  async getAppSettings() {
    try {
      const response = await this.api.get('/api/settings/app');
      return response.data;
    } catch (error) {
      console.error('Error fetching app settings:', error);
      // Retornar configuración de ejemplo en caso de error
      return {
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
      };
    }
  }

  // Obtener configuración del usuario
  async getUserSettings() {
    try {
      const response = await this.api.get('/api/settings/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      // Retornar configuración de ejemplo en caso de error
      return {
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
      };
    }
  }

  // Actualizar configuración de la aplicación
  async updateAppSettings(settingsData) {
    try {
      const response = await this.api.put('/api/settings/app', settingsData);
      return response.data;
    } catch (error) {
      console.error('Error updating app settings:', error);
      // Retornar configuración actualizada localmente en caso de error
      return {
        ...settingsData,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  // Actualizar configuración del usuario
  async updateUserSettings(settingsData) {
    try {
      const response = await this.api.put('/api/settings/user', settingsData);
      return response.data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      // Retornar configuración actualizada localmente en caso de error
      return {
        ...settingsData,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  // Restablecer configuración
  async resetSettings() {
    try {
      const response = await this.api.post('/api/settings/reset');
      return response.data;
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  }

  // Exportar configuración
  async exportSettings() {
    try {
      const response = await this.api.get('/api/settings/export');
      return response.data;
    } catch (error) {
      console.error('Error exporting settings:', error);
      // Retornar configuración de ejemplo en caso de error
      return {
        appSettings: {
          language: 'es',
          timezone: 'UTC',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          currency: 'EUR',
        },
        userSettings: {
          theme: 'system',
          fontSize: 'medium',
          animations: true,
          notifications: {
            push: true,
            email: true,
            sms: false,
          },
        },
        exportedAt: new Date().toISOString(),
      };
    }
  }

  // Importar configuración
  async importSettings(settingsFile) {
    try {
      const formData = new FormData();
      formData.append('settings', settingsFile);
      
      const response = await this.api.post('/api/settings/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error importing settings:', error);
      throw error;
    }
  }

  // Obtener configuración por categoría
  async getSettingsByCategory(category) {
    try {
      const response = await this.api.get(`/api/settings/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${category} settings:`, error);
      throw error;
    }
  }

  // Actualizar configuración por categoría
  async updateSettingsByCategory(category, settingsData) {
    try {
      const response = await this.api.put(`/api/settings/${category}`, settingsData);
      return response.data;
    } catch (error) {
      console.error(`Error updating ${category} settings:`, error);
      throw error;
    }
  }

  // Obtener configuración específica
  async getSetting(key, category = 'user') {
    try {
      const response = await this.api.get(`/api/settings/${category}/${key}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${key} setting:`, error);
      throw error;
    }
  }

  // Actualizar configuración específica
  async updateSetting(key, value, category = 'user') {
    try {
      const response = await this.api.put(`/api/settings/${category}/${key}`, { value });
      return response.data;
    } catch (error) {
      console.error(`Error updating ${key} setting:`, error);
      throw error;
    }
  }

  // Eliminar configuración específica
  async deleteSetting(key, category = 'user') {
    try {
      const response = await this.api.delete(`/api/settings/${category}/${key}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ${key} setting:`, error);
      throw error;
    }
  }

  // Validar configuración
  async validateSettings(settings) {
    try {
      const response = await this.api.post('/api/settings/validate', settings);
      return response.data;
    } catch (error) {
      console.error('Error validating settings:', error);
      throw error;
    }
  }

  // Obtener estadísticas de configuración
  async getSettingsStats() {
    try {
      const response = await this.api.get('/api/settings/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings stats:', error);
      // Retornar estadísticas de ejemplo en caso de error
      return {
        totalSettings: 25,
        customizedSettings: 12,
        lastUpdated: new Date().toISOString(),
        categories: {
          app: 8,
          user: 17,
        },
      };
    }
  }

  // Obtener historial de cambios
  async getSettingsHistory(page = 1, limit = 20) {
    try {
      const response = await this.api.get(`/api/settings/history?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching settings history:', error);
      // Retornar historial de ejemplo en caso de error
      return {
        history: [
          {
            id: '1',
            setting: 'theme',
            oldValue: 'light',
            newValue: 'dark',
            changedAt: new Date().toISOString(),
          },
          {
            id: '2',
            setting: 'language',
            oldValue: 'en',
            newValue: 'es',
            changedAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          pages: 1,
        },
      };
    }
  }

  // Revertir configuración a versión anterior
  async revertSetting(settingId) {
    try {
      const response = await this.api.post(`/api/settings/revert/${settingId}`);
      return response.data;
    } catch (error) {
      console.error('Error reverting setting:', error);
      throw error;
    }
  }

  // Sincronizar configuración entre dispositivos
  async syncSettings() {
    try {
      const response = await this.api.post('/api/settings/sync');
      return response.data;
    } catch (error) {
      console.error('Error syncing settings:', error);
      throw error;
    }
  }

  // Obtener configuración por defecto
  async getDefaultSettings() {
    try {
      const response = await this.api.get('/api/settings/defaults');
      return response.data;
    } catch (error) {
      console.error('Error fetching default settings:', error);
      // Retornar configuración por defecto en caso de error
      return {
        app: {
          language: 'es',
          timezone: 'UTC',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '24h',
          currency: 'EUR',
        },
        user: {
          theme: 'system',
          fontSize: 'medium',
          animations: true,
          notifications: {
            push: true,
            email: true,
            sms: false,
          },
        },
      };
    }
  }

  // Aplicar configuración por defecto
  async applyDefaultSettings(category) {
    try {
      const response = await this.api.post(`/api/settings/apply-defaults/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error applying default settings:', error);
      throw error;
    }
  }
}

export { SettingsService };
