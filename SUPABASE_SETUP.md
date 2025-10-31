# Configuración de Supabase para Autenticación

Este proyecto utiliza Supabase para la autenticación de usuarios. Sigue estos pasos para configurarlo:

## Paso 1: Crear un proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Crea un nuevo proyecto
4. Espera a que el proyecto se configure completamente

## Paso 2: Obtener las credenciales

1. En tu proyecto de Supabase, ve a **Settings** → **API**
2. Copia los siguientes valores:
   - **Project URL** (ejemplo: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (ejemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Paso 3: Configurar las credenciales en el proyecto

1. Abre el archivo `lib/config/supabase_config.dart`
2. Reemplaza los valores de `YOUR_SUPABASE_URL` y `YOUR_SUPABASE_ANON_KEY` con tus credenciales:

```dart
class SupabaseConfig {
  static const String supabaseUrl = 'https://tu-proyecto.supabase.co';
  static const String supabaseAnonKey = 'tu-clave-anon-aqui';
}
```

## Paso 4: Configurar la base de datos

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Copia y pega el contenido del archivo `supabase_setup.sql`
3. Ejecuta el script SQL

Este script creará:
- La tabla `profiles` para almacenar los datos del perfil del usuario
- Las políticas de seguridad (Row Level Security)
- Un trigger para crear automáticamente un perfil cuando se registra un nuevo usuario

## Paso 5: Verificar la configuración

1. Ejecuta `flutter pub get` (ya ejecutado)
2. Compila la aplicación
3. Prueba el registro de un nuevo usuario

## Características implementadas

- ✅ Inicio de sesión con email y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Cierre de sesión
- ✅ Verificación de sesión activa
- ✅ Actualización de perfil
- ✅ Recuperación de contraseña (envío de email)
- ✅ Restablecimiento de contraseña
- ✅ Sincronización con datos locales

## Notas importantes

- Las credenciales de Supabase son públicas (anon key) y están seguras gracias a Row Level Security
- No expongas la `service_role` key en el cliente
- El perfil del usuario se crea automáticamente al registrarse

