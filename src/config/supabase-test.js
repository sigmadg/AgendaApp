import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Supabase para pruebas
const supabaseUrl = 'https://rttjjxwsdbeltqxvlnfr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dGpqeHdzZGJlbHRxeHZsbmZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk5MzIsImV4cCI6MjA3NjIwNTkzMn0.9yVt23AqCGrpe3AHQ59wrjCva-1ypM5kJVK0QblZ1vo';

// Crear cliente de Supabase con configuración simplificada
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('user_data').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Supabase connection successful!');
    return { success: true, data };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, error: error.message };
  }
};

export default supabase;
