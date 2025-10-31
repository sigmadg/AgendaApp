-- Script para solucionar el problema del trigger en Supabase
-- Ejecuta esto en el SQL Editor de Supabase

-- PASO 1: Verificar si la tabla profiles existe y tiene la estructura correcta
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- PASO 2: Eliminar el trigger y función existentes (si existen)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- PASO 3: Crear la función con SECURITY DEFINER para que pueda bypassear RLS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Intentar insertar el perfil
  INSERT INTO public.profiles (id, name, email, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Si hay un error, loguearlo pero NO fallar el registro del usuario
  -- Usar RAISE WARNING en lugar de RAISE EXCEPTION
  RAISE WARNING 'Error al crear perfil para usuario %: %', NEW.id, SQLERRM;
  RETURN NEW; -- IMPORTANTE: Retornar NEW para que el registro continúe
END;
$$;

-- PASO 4: Crear el trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- PASO 5: Verificar que el trigger se creó correctamente
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- PASO 6: Verificar que la función se creó correctamente
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'handle_new_user';

-- PASO 7: Probar insertar un usuario de prueba (opcional, luego lo eliminas)
-- Esto te ayudará a ver si el trigger funciona
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES (gen_random_uuid(), 'test@example.com', crypt('test123', gen_salt('bf')), NOW(), NOW(), NOW())
-- ON CONFLICT DO NOTHING;

