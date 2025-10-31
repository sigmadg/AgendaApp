import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProfileService } from '../services/ProfileService';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const profileService = new ProfileService();

  // Cargar perfil al inicializar
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await profileService.getProfile();
      setUserProfile(profile);
    } catch (err) {
      setError(err.message);
      // Datos de ejemplo en caso de error
      setUserProfile({
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
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const updatedProfile = await profileService.updateProfile(profileData);
      setUserProfile(updatedProfile);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async (avatarFile) => {
    try {
      setLoading(true);
      const updatedProfile = await profileService.updateAvatar(avatarFile);
      setUserProfile(updatedProfile);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      setLoading(true);
      const updatedProfile = await profileService.updatePreferences(preferences);
      setUserProfile(updatedProfile);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (settings) => {
    try {
      setLoading(true);
      const updatedProfile = await profileService.updateSettings(settings);
      setUserProfile(updatedProfile);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      await profileService.changePassword(currentPassword, newPassword);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const enableTwoFactor = async () => {
    try {
      setLoading(true);
      const result = await profileService.enableTwoFactor();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disableTwoFactor = async (code) => {
    try {
      setLoading(true);
      await profileService.disableTwoFactor(code);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (password) => {
    try {
      setLoading(true);
      await profileService.deleteAccount(password);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      setLoading(true);
      const data = await profileService.exportData();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProfileStats = () => {
    if (!userProfile) return null;

    return {
      accountAge: Math.floor((new Date() - new Date(userProfile.createdAt)) / (1000 * 60 * 60 * 24)),
      lastLogin: userProfile.lastLogin,
      profileCompleteness: calculateProfileCompleteness(userProfile),
      securityLevel: calculateSecurityLevel(userProfile),
    };
  };

  const calculateProfileCompleteness = (profile) => {
    const fields = ['name', 'email', 'phone', 'avatar'];
    const completedFields = fields.filter(field => profile[field] && profile[field] !== '');
    return (completedFields.length / fields.length) * 100;
  };

  const calculateSecurityLevel = (profile) => {
    let score = 0;
    if (profile.email) score += 25;
    if (profile.phone) score += 25;
    if (profile.twoFactorEnabled) score += 50;
    return Math.min(score, 100);
  };

  const value = {
    // State
    userProfile,
    loading,
    error,
    
    // Actions
    loadProfile,
    updateProfile,
    updateAvatar,
    updatePreferences,
    updateSettings,
    changePassword,
    enableTwoFactor,
    disableTwoFactor,
    deleteAccount,
    exportData,
    
    // Utilities
    getProfileStats,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
