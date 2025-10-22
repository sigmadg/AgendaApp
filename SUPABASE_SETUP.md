# 🚀 Configuración de Supabase para Cortexa

## 📋 Pasos para configurar Supabase

### 1. Crear cuenta en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Crea una cuenta gratuita
4. Verifica tu email

### 2. Crear nuevo proyecto
1. Haz clic en "New Project"
2. Elige tu organización
3. Nombre del proyecto: `cortexa-app`
4. Contraseña de la base de datos: (guárdala segura)
5. Región: Elige la más cercana a ti
6. Haz clic en "Create new project"

### 3. Obtener credenciales
1. Ve a **Settings** > **API**
2. Copia la **Project URL**
3. Copia la **anon public** key
4. Guarda estas credenciales

### 4. Configurar la aplicación
1. Copia `src/config/supabase.example.js` a `src/config/supabase.js`
2. Reemplaza las URLs con las de tu proyecto:

```javascript
const supabaseUrl = 'https://tu-proyecto-id.supabase.co';
const supabaseAnonKey = 'tu-clave-anonima-aqui';
```

### 5. Configurar la base de datos
1. Ve a **SQL Editor** en tu dashboard
2. Copia todo el contenido de `supabase_schema.sql`
3. Pégalo en el editor SQL
4. Haz clic en **Run**

### 6. Configurar autenticación
1. Ve a **Authentication** > **Settings**
2. En **Site URL** agrega: `http://localhost:3000`
3. En **Redirect URLs** agrega: `http://localhost:3000/auth/callback`

### 7. Configurar providers (opcional)
Para usar Google Sign-In:
1. Ve a **Authentication** > **Providers**
2. Habilita **Google**
3. Agrega tu Client ID y Client Secret de Google Console

## 🔧 Integración en la aplicación

### Usar el hook useUserData
```javascript
import useUserData from '../hooks/useUserData';

const MyComponent = () => {
  const { userData, loading, saveUserData, updateSection } = useUserData();

  const handleSave = async () => {
    await updateSection('work', {
      priorities: [...newPriorities]
    });
  };

  if (loading) return <Loading />;
  
  return (
    // Tu componente aquí
  );
};
```

### Autenticación
```javascript
import { auth } from '../config/supabase';

// Registro
const handleSignUp = async (email, password) => {
  const { data, error } = await auth.signUp(email, password, {
    name: 'Nombre Usuario'
  });
};

// Inicio de sesión
const handleSignIn = async (email, password) => {
  const { data, error } = await auth.signIn(email, password);
};

// Cerrar sesión
const handleSignOut = async () => {
  const { error } = await auth.signOut();
};
```

## 📊 Estructura de datos

Los datos se almacenan en formato JSON en la tabla `user_data`:

```json
{
  "work": {
    "priorities": [],
    "goals": [],
    "focus": [],
    "projects": [],
    "dailyTasks": []
  },
  "school": {
    "timetable": {},
    "tasks": { "academic": [] },
    "projects": [],
    "exams": [],
    "materials": {
      "textbooks": [],
      "onlineResources": []
    }
  },
  "health": {
    "meals": [],
    "water": { "goal": 8, "current": 0 },
    "exercise": [],
    "nutrition": {
      "recipes": [],
      "mealPlans": [],
      "shoppingList": []
    }
  },
  "personal": {
    "profile": {
      "name": "",
      "email": "",
      "avatar": null
    },
    "settings": {
      "activeSections": {
        "work": true,
        "school": true,
        "health": true,
        "personal": true
      }
    }
  }
}
```

## 🔄 Sincronización

La aplicación funciona de la siguiente manera:

1. **Online**: Los datos se guardan en Supabase y AsyncStorage
2. **Offline**: Los datos se guardan solo en AsyncStorage
3. **Reconexión**: Los datos pendientes se sincronizan automáticamente

## 🛡️ Seguridad

- **RLS (Row Level Security)**: Cada usuario solo puede acceder a sus propios datos
- **Autenticación**: Integrada con Supabase Auth
- **Encriptación**: Los datos se transmiten de forma segura

## 📱 Ventajas de Supabase

✅ **Gratis**: Plan gratuito generoso (500MB de base de datos)  
✅ **Real-time**: Sincronización automática entre dispositivos  
✅ **Offline**: Funciona sin conexión a internet  
✅ **Escalable**: Maneja millones de usuarios  
✅ **Fácil**: API simple y documentación excelente  
✅ **Seguro**: Autenticación y autorización integradas  

## 🆘 Solución de problemas

### Error de conexión
- Verifica que las URLs en `supabase.js` sean correctas
- Asegúrate de que el proyecto esté activo en Supabase

### Error de autenticación
- Verifica la configuración de providers
- Revisa las URLs de redirección

### Error de base de datos
- Ejecuta el esquema SQL completo
- Verifica que RLS esté habilitado

## 📞 Soporte

- [Documentación de Supabase](https://supabase.com/docs)
- [Discord de Supabase](https://discord.supabase.com)
- [GitHub de Supabase](https://github.com/supabase/supabase)
