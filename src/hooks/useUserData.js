import { useState, useEffect, useCallback } from 'react';
import dataService from '../services/DataService';
import { auth } from '../config/supabase';

export const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Obtener usuario actual
  const getCurrentUser = useCallback(async () => {
    try {
      const { user, error } = await auth.getCurrentUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }, []);

  // Cargar datos del usuario
  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = await getCurrentUser();
      if (!user) {
        setUserId(null);
        setUserData(null);
        return;
      }

      setUserId(user.id);
      const data = await dataService.getUserData(user.id);
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [getCurrentUser]);

  // Guardar datos del usuario
  const saveUserData = useCallback(async (newData) => {
    if (!userId) return { success: false, error: 'No user logged in' };

    try {
      setError(null);
      const result = await dataService.saveUserData(userId, newData);
      
      if (result.success) {
        setUserData(newData);
      }
      
      return result;
    } catch (error) {
      console.error('Error saving user data:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  }, [userId]);

  // Actualizar sección específica
  const updateSection = useCallback(async (section, data) => {
    if (!userData) return { success: false, error: 'No user data loaded' };

    const newUserData = {
      ...userData,
      [section]: {
        ...userData[section],
        ...data
      }
    };

    return await saveUserData(newUserData);
  }, [userData, saveUserData]);

  // Sincronizar datos pendientes
  const syncData = useCallback(async () => {
    try {
      await dataService.syncPendingData();
    } catch (error) {
      console.error('Sync error:', error);
    }
  }, []);

  // Exportar datos
  const exportData = useCallback(async () => {
    if (!userId) return null;
    return await dataService.exportUserData(userId);
  }, [userId]);

  // Importar datos
  const importData = useCallback(async (importedData) => {
    if (!userId) return { success: false, error: 'No user logged in' };
    return await dataService.importUserData(userId, importedData);
  }, [userId]);

  // Limpiar datos
  const clearData = useCallback(async () => {
    if (!userId) return { success: false, error: 'No user logged in' };
    
    const result = await dataService.clearUserData(userId);
    if (result.success) {
      setUserData(dataService.getDefaultUserData());
    }
    return result;
  }, [userId]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Sincronizar cuando la app vuelve a estar activa
  useEffect(() => {
    const handleAppStateChange = () => {
      if (userId) {
        syncData();
      }
    };

    // Aquí podrías agregar un listener para AppState si es necesario
    // AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [userId, syncData]);

  return {
    userData,
    loading,
    error,
    userId,
    saveUserData,
    updateSection,
    syncData,
    exportData,
    importData,
    clearData,
    refreshData: loadUserData
  };
};

export default useUserData;
