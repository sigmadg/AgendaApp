import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
// IMPORTANTE: Reemplaza estas URLs con las de tu proyecto de Supabase
// Ve a https://supabase.com, crea un proyecto y obtén las credenciales
const supabaseUrl = 'https://rttjjxwsdbeltqxvlnfr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dGpqeHdzZGJlbHRxeHZsbmZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk5MzIsImV4cCI6MjA3NjIwNTkzMn0.9yVt23AqCGrpe3AHQ59wrjCva-1ypM5kJVK0QblZ1vo';

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configuración para React Native
    storage: {
      getItem: async (key) => {
        const { AsyncStorage } = require('@react-native-async-storage/async-storage');
        return await AsyncStorage.getItem(key);
      },
      setItem: async (key, value) => {
        const { AsyncStorage } = require('@react-native-async-storage/async-storage');
        return await AsyncStorage.setItem(key, value);
      },
      removeItem: async (key) => {
        const { AsyncStorage } = require('@react-native-async-storage/async-storage');
        return await AsyncStorage.removeItem(key);
      },
    },
  },
});

// Funciones de autenticación
export const auth = {
  // Registro de usuario
  signUp: async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Inicio de sesión
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Cerrar sesión
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { user, error };
    } catch (error) {
      return { user: null, error };
    }
  },

  // Recuperar contraseña
  resetPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
};

// Funciones de base de datos
export const database = {
  // Obtener datos del usuario
  getUserData: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('*')
        .eq('user_id', userId)
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Guardar datos del usuario
  saveUserData: async (userId, data) => {
    try {
      const { data: result, error } = await supabase
        .from('user_data')
        .upsert({
          user_id: userId,
          data: data,
          updated_at: new Date().toISOString()
        });
      return { data: result, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Actualizar datos del usuario
  updateUserData: async (userId, data) => {
    try {
      const { data: result, error } = await supabase
        .from('user_data')
        .update({
          data: data,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      return { data: result, error };
    } catch (error) {
      return { data: null, error };
    }
  }
};

export default supabase;
