import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración simplificada de Supabase para React Native
const supabaseUrl = 'https://rttjjxwsdbeltqxvlnfr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dGpqeHdzZGJlbHRxeHZsbmZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk5MzIsImV4cCI6MjA3NjIwNTkzMn0.9yVt23AqCGrpe3AHQ59wrjCva-1ypM5kJVK0QblZ1vo';

// Crear cliente de Supabase con configuración mínima
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Función simple para probar la conexión
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Probar una consulta simple
    const { data, error } = await supabase
      .from('user_data')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase error:', error);
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
