# Verificar configuración de Supabase Auth

El error 500 puede ser causado por configuración en el Dashboard de Supabase. Verifica lo siguiente:

## 1. Dashboard → Authentication → Settings

### Email confirmations
- **Si está activado**: Puede causar problemas si no está configurado correctamente
- **Recomendación temporal**: Desactívalo para pruebas (luego lo reactivas)

### Email templates
- Verifica que los templates estén configurados correctamente
- Si hay errores en los templates, puede causar error 500

### Rate limiting
- Verifica que no esté bloqueando muchos intentos de registro

## 2. Dashboard → Database → Extensions

Verifica que estas extensiones estén habilitadas:
- `uuid-ossp` (para UUIDs)
- `pgcrypto` (para funciones criptográficas)

## 3. Dashboard → API Settings

Verifica que:
- La URL de la API sea correcta
- Las keys sean válidas

## 4. Dashboard → Logs

Revisa los logs de autenticación para ver si hay errores específicos:
- Authentication → Logs
- Busca errores alrededor de la hora de tus intentos de registro

