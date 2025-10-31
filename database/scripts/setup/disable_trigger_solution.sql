-- SOLUCIÓN: Deshabilitar el trigger problemático
-- El código de la app creará los perfiles manualmente
-- Ejecuta esto en el SQL Editor de Supabase

-- PASO 1: Deshabilitar el trigger temporalmente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- PASO 2: Verificar que se deshabilitó
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
-- No debería aparecer ningún resultado

-- PASO 3: Opcional - Mantener la función por si la necesitas más tarde
-- La función handle_new_user puede quedarse, simplemente no se ejecutará automáticamente

-- NOTA: El código de la aplicación ahora creará los perfiles manualmente
-- después de que el usuario se registre exitosamente.

