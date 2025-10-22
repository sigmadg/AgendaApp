// Archivo de ejemplo para configuración de Supabase
// Copia este archivo como supabase.js y reemplaza las URLs con las de tu proyecto

import { createClient } from '@supabase/supabase-js';

// PASO 1: Crear proyecto en Supabase
// 1. Ve a https://supabase.com
// 2. Crea una cuenta gratuita
// 3. Crea un nuevo proyecto
// 4. Ve a Settings > API
// 5. Copia la URL y la clave anónima

// PASO 2: Reemplazar estas URLs con las de tu proyecto
const supabaseUrl = 'https://tu-proyecto.supabase.co';
const supabaseAnonKey = 'tu-clave-anonima-aqui';

// PASO 3: Configurar autenticación
// Ve a Authentication > Settings en tu dashboard de Supabase
// Configura los providers que quieras usar (Google, Facebook, etc.)

// PASO 4: Ejecutar el esquema SQL
// Ve a SQL Editor en tu dashboard de Supabase
// Copia y pega el contenido de supabase_schema.sql

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
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

// Ejemplo de uso:
/*
import { supabase } from './config/supabase';

// Registro
const { data, error } = await supabase.auth.signUp({
  email: 'usuario@ejemplo.com',
  password: 'contraseña123'
});

// Inicio de sesión
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@ejemplo.com',
  password: 'contraseña123'
});

// Obtener datos
const { data, error } = await supabase
  .from('user_data')
  .select('*')
  .eq('user_id', userId);
*/
