import axios from 'axios';

class ProfileService {
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
        console.error('ProfileService Error:', error);
        throw new Error(error.response?.data?.message || 'Error en el servicio de perfil');
      }
    );
  }

  // Obtener perfil del usuario
  async getProfile() {
    try {
      const response = await this.api.get('/api/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Retornar datos de ejemplo en caso de error
      return {
        id: '1',
        name: 'Usuario Ejemplo',
        email: 'usuario@ejemplo.com',
        phone: '+1234567890',
        avatar: null,
        preferences: {
          theme: 'system',
          language: 'es',
          timezone: 'UTC',
        },
        settings: {
          notifications: {
            push: true,
            email: true,
            sms: false,
          },
          privacy: {
            profileVisibility: 'public',
            showEmail: false,
            showPhone: false,
          },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  // Actualizar perfil
  async updateProfile(profileData) {
    try {
      const response = await this.api.put('/api/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      // Retornar perfil actualizado localmente en caso de error
      return {
        ...profileData,
        updatedAt: new Date().toISOString(),
      };
    }
  }

  // Actualizar avatar
  async updateAvatar(avatarFile) {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      
      const response = await this.api.post('/api/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  }

  // Actualizar preferencias
  async updatePreferences(preferences) {
    try {
      const response = await this.api.put('/api/profile/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      // Retornar preferencias actualizadas localmente en caso de error
      return {
        preferences: {
          ...preferences,
          updatedAt: new Date().toISOString(),
        },
      };
    }
  }

  // Actualizar configuraciones
  async updateSettings(settings) {
    try {
      const response = await this.api.put('/api/profile/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      // Retornar configuraciones actualizadas localmente en caso de error
      return {
        settings: {
          ...settings,
          updatedAt: new Date().toISOString(),
        },
      };
    }
  }

  // Cambiar contraseña
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await this.api.post('/api/profile/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  // Habilitar autenticación de dos factores
  async enableTwoFactor() {
    try {
      const response = await this.api.post('/api/profile/2fa/enable');
      return response.data;
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      throw error;
    }
  }

  // Deshabilitar autenticación de dos factores
  async disableTwoFactor(code) {
    try {
      const response = await this.api.post('/api/profile/2fa/disable', { code });
      return response.data;
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      throw error;
    }
  }

  // Verificar código de autenticación de dos factores
  async verifyTwoFactorCode(code) {
    try {
      const response = await this.api.post('/api/profile/2fa/verify', { code });
      return response.data;
    } catch (error) {
      console.error('Error verifying 2FA code:', error);
      throw error;
    }
  }

  // Eliminar cuenta
  async deleteAccount(password) {
    try {
      const response = await this.api.delete('/api/profile', {
        data: { password },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  // Exportar datos del usuario
  async exportData() {
    try {
      const response = await this.api.get('/api/profile/export');
      return response.data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  // Obtener historial de actividad
  async getActivityHistory(page = 1, limit = 20) {
    try {
      const response = await this.api.get(`/api/profile/activity?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity history:', error);
      // Retornar historial de ejemplo en caso de error
      return {
        activities: [
          {
            id: '1',
            type: 'profile_update',
            description: 'Perfil actualizado',
            timestamp: new Date().toISOString(),
          },
          {
            id: '2',
            type: 'password_change',
            description: 'Contraseña cambiada',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
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

  // Obtener estadísticas del perfil
  async getProfileStats() {
    try {
      const response = await this.api.get('/api/profile/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile stats:', error);
      // Retornar estadísticas de ejemplo en caso de error
      return {
        accountAge: 30,
        lastLogin: new Date().toISOString(),
        profileCompleteness: 75,
        securityLevel: 60,
        totalLogins: 150,
        averageSessionDuration: 45,
      };
    }
  }

  // Actualizar información de contacto
  async updateContactInfo(contactData) {
    try {
      const response = await this.api.put('/api/profile/contact', contactData);
      return response.data;
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  }

  // Actualizar configuración de privacidad
  async updatePrivacySettings(privacySettings) {
    try {
      const response = await this.api.put('/api/profile/privacy', privacySettings);
      return response.data;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw error;
    }
  }

  // Obtener configuración de notificaciones
  async getNotificationSettings() {
    try {
      const response = await this.api.get('/api/profile/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      // Retornar configuración de ejemplo en caso de error
      return {
        push: true,
        email: true,
        sms: false,
        marketing: false,
        updates: true,
        reminders: true,
      };
    }
  }

  // Actualizar configuración de notificaciones
  async updateNotificationSettings(notificationSettings) {
    try {
      const response = await this.api.put('/api/profile/notifications', notificationSettings);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }

  // Verificar email
  async verifyEmail(token) {
    try {
      const response = await this.api.post('/api/profile/verify-email', { token });
      return response.data;
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  }

  // Reenviar verificación de email
  async resendEmailVerification() {
    try {
      const response = await this.api.post('/api/profile/resend-verification');
      return response.data;
    } catch (error) {
      console.error('Error resending email verification:', error);
      throw error;
    }
  }

  // Obtener sesiones activas
  async getActiveSessions() {
    try {
      const response = await this.api.get('/api/profile/sessions');
      return response.data;
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      // Retornar sesiones de ejemplo en caso de error
      return {
        sessions: [
          {
            id: '1',
            device: 'Chrome on Windows',
            location: 'Madrid, España',
            lastActive: new Date().toISOString(),
            current: true,
          },
        ],
      };
    }
  }

  // Cerrar sesión en otros dispositivos
  async logoutOtherSessions() {
    try {
      const response = await this.api.post('/api/profile/logout-others');
      return response.data;
    } catch (error) {
      console.error('Error logging out other sessions:', error);
      throw error;
    }
  }
}

export { ProfileService };
