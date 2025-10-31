import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración mínima de Supabase para React Native
const supabaseUrl = 'https://rttjjxwsdbeltqxvlnfr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dGpqeHdzZGJlbHRxeHZsbmZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2Mjk5MzIsImV4cCI6MjA3NjIwNTkzMn0.9yVt23AqCGrpe3AHQ59wrjCva-1ypM5kJVK0QblZ1vo';

// Función simple para probar la conexión usando fetch nativo
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Probar una consulta simple usando fetch nativo
    const response = await fetch(`${supabaseUrl}/rest/v1/user_data?select=count`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Supabase connection successful!');
    return { success: true, data };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// Función para obtener datos del usuario
export const getUserData = async (userId) => {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/user_data?user_id=eq.${userId}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data: data[0]?.data || null };
  } catch (error) {
    console.error('Error getting user data:', error);
    return { success: false, error: error.message };
  }
};

// Función para guardar datos del usuario
export const saveUserData = async (userId, data) => {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/user_data`, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        user_id: userId,
        data: data,
        updated_at: new Date().toISOString()
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving user data:', error);
    return { success: false, error: error.message };
  }
};

export default {
  testSupabaseConnection,
  getUserData,
  saveUserData
};
