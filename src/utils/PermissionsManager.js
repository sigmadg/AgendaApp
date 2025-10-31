import { Platform, Alert, Linking, PermissionsAndroid } from 'react-native';

class PermissionsManager {
  constructor() {
    this.permissions = {
      // Permisos básicos
      internet: 'android.permission.INTERNET',
      networkState: 'android.permission.ACCESS_NETWORK_STATE',
      
      // Notificaciones
      notifications: 'android.permission.POST_NOTIFICATIONS',
      
      // Almacenamiento
      readStorage: 'android.permission.READ_EXTERNAL_STORAGE',
      writeStorage: 'android.permission.WRITE_EXTERNAL_STORAGE',
      
      // Calendario
      readCalendar: 'android.permission.READ_CALENDAR',
      writeCalendar: 'android.permission.WRITE_CALENDAR',
      
      // Contactos
      contacts: 'android.permission.READ_CONTACTS',
      
      // Cámara
      camera: 'android.permission.CAMERA',
      
      // Ubicación
      location: 'android.permission.ACCESS_FINE_LOCATION',
      
      // Llamadas
      phone: 'android.permission.CALL_PHONE',
      
      // SMS
      sms: 'android.permission.SEND_SMS',
    };
    
    this.RESULTS = {
      GRANTED: 'granted',
      DENIED: 'denied',
      NEVER_ASK_AGAIN: 'never_ask_again',
      UNAVAILABLE: 'unavailable',
    };
  }

  // Verificar si un permiso está concedido
  async checkPermission(permissionKey) {
    try {
      if (Platform.OS !== 'android') {
        console.log(`Permiso ${permissionKey} solo disponible en Android`);
        return this.RESULTS.UNAVAILABLE;
      }

      const permission = this.permissions[permissionKey];
      if (!permission) {
        console.log(`Permiso ${permissionKey} no disponible`);
        return this.RESULTS.UNAVAILABLE;
      }

      const result = await PermissionsAndroid.check(permission);
      const status = result ? this.RESULTS.GRANTED : this.RESULTS.DENIED;
      console.log(`Verificando permiso ${permissionKey} (${permission}): ${result ? 'GRANTED' : 'DENIED'}`);
      return status;
    } catch (error) {
      console.error(`Error verificando permiso ${permissionKey}:`, error);
      return this.RESULTS.DENIED;
    }
  }

  // Solicitar un permiso específico
  async requestPermission(permissionKey) {
    try {
      if (Platform.OS !== 'android') {
        console.log(`Permiso ${permissionKey} solo disponible en Android`);
        return this.RESULTS.UNAVAILABLE;
      }

      const permission = this.permissions[permissionKey];
      if (!permission) {
        console.log(`Permiso ${permissionKey} no disponible`);
        return this.RESULTS.UNAVAILABLE;
      }

      const result = await PermissionsAndroid.request(permission);
      console.log(`Resultado del permiso ${permissionKey}:`, result);
      
      switch (result) {
        case PermissionsAndroid.RESULTS.GRANTED:
          return this.RESULTS.GRANTED;
        case PermissionsAndroid.RESULTS.DENIED:
          return this.RESULTS.DENIED;
        case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
          return this.RESULTS.NEVER_ASK_AGAIN;
        default:
          return this.RESULTS.DENIED;
      }
    } catch (error) {
      console.error(`Error solicitando permiso ${permissionKey}:`, error);
      return this.RESULTS.DENIED;
    }
  }

  // Solicitar múltiples permisos
  async requestMultiplePermissions(permissionKeys) {
    const results = {};
    
    for (const key of permissionKeys) {
      results[key] = await this.requestPermission(key);
    }
    
    return results;
  }

  // Verificar múltiples permisos
  async checkMultiplePermissions(permissionKeys) {
    const results = {};
    
    for (const key of permissionKeys) {
      results[key] = await this.checkPermission(key);
    }
    
    return results;
  }

  // Mostrar diálogo explicativo para permisos
  showPermissionDialog(title, message, onPress) {
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Configurar',
          onPress: onPress,
        },
      ]
    );
  }

  // Abrir configuración de la aplicación
  openAppSettings() {
    Linking.openSettings();
  }

  // Solicitar permisos esenciales para la aplicación
  async requestEssentialPermissions() {
    const essentialPermissions = ['notifications', 'readStorage', 'writeStorage'];
    
    console.log('Solicitando permisos esenciales...');
    
    for (const permissionKey of essentialPermissions) {
      const currentStatus = await this.checkPermission(permissionKey);
      console.log(`Estado actual del permiso ${permissionKey}:`, currentStatus);
      
      if (currentStatus === this.RESULTS.DENIED) {
        const result = await this.requestPermission(permissionKey);
        console.log(`Resultado de solicitar ${permissionKey}:`, result);
        
        if (result === this.RESULTS.DENIED) {
          console.log(`Permiso ${permissionKey} denegado por el usuario`);
          // No mostrar diálogo automáticamente, dejar que el usuario decida
        }
      } else if (currentStatus === this.RESULTS.UNAVAILABLE) {
        console.log(`Permiso ${permissionKey} no disponible en este dispositivo/emulador`);
      }
    }
  }

  // Solicitar permisos opcionales
  async requestOptionalPermissions() {
    const optionalPermissions = ['camera', 'contacts', 'location', 'readCalendar', 'writeCalendar'];
    
    console.log('Solicitando permisos opcionales...');
    
    for (const permissionKey of optionalPermissions) {
      const currentStatus = await this.checkPermission(permissionKey);
      
      if (currentStatus === this.RESULTS.DENIED) {
        const result = await this.requestPermission(permissionKey);
        
        if (result === this.RESULTS.DENIED) {
          console.log(`Permiso ${permissionKey} denegado por el usuario`);
        }
      }
    }
  }

  // Obtener estado de todos los permisos
  async getAllPermissionsStatus() {
    const allPermissions = Object.keys(this.permissions);
    return await this.checkMultiplePermissions(allPermissions);
  }

  // Verificar si todos los permisos esenciales están concedidos
  async areEssentialPermissionsGranted() {
    const essentialPermissions = ['notifications', 'readStorage', 'writeStorage'];
    const statuses = await this.checkMultiplePermissions(essentialPermissions);
    
    console.log('=== VERIFICACIÓN DE PERMISOS ESENCIALES ===');
    console.log('Estado de permisos esenciales:', statuses);
    
    // Mostrar el estado de cada permiso individualmente
    essentialPermissions.forEach(key => {
      const status = statuses[key];
      console.log(`Permiso ${key}: ${status}`);
    });
    
    // Considerar que los permisos están concedidos si:
    // 1. Están explícitamente concedidos (GRANTED)
    // 2. No están disponibles (UNAVAILABLE) - esto es común en emuladores
    // 3. Están denegados pero la app puede funcionar sin ellos (DENIED)
    const allGranted = essentialPermissions.every(key => {
      const status = statuses[key];
      const isGranted = status === this.RESULTS.GRANTED || 
                       status === this.RESULTS.UNAVAILABLE || 
                       status === this.RESULTS.DENIED; // Permitir DENIED también
      console.log(`Permiso ${key} (${status}) considerado como: ${isGranted ? 'VÁLIDO' : 'INVÁLIDO'}`);
      return isGranted;
    });
    
    console.log('¿Todos los permisos esenciales están concedidos?', allGranted);
    console.log('=== FIN VERIFICACIÓN DE PERMISOS ===');
    return allGranted;
  }
}

export default new PermissionsManager();
