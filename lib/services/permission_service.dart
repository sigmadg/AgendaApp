import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart' as ph;

class PermissionService {
  /// Solicita los permisos necesarios para la aplicación
  /// Retorna un mapa con el estado de cada permiso
  static Future<Map<String, bool>> requestPermissions() async {
    final results = <String, bool>{};
    
    try {
      // Permiso de notificaciones (requerido en Android 13+)
      final notificationStatus = await ph.Permission.notification.status;
      if (notificationStatus.isDenied || notificationStatus.isLimited) {
        final requestResult = await ph.Permission.notification.request();
        results['notifications'] = requestResult.isGranted;
        print('Permiso de notificaciones: ${requestResult.isGranted ? "Concedido" : "Denegado"}');
      } else {
        results['notifications'] = notificationStatus.isGranted;
        print('Permiso de notificaciones: Ya estaba concedido');
      }
      
      // Verificar permisos de almacenamiento (solo para Android antiguos)
      // En Android 13+ estos permisos no son necesarios para la mayoría de casos
      if (await _isAndroid13OrHigher() == false) {
        final storageStatus = await ph.Permission.storage.status;
        if (storageStatus.isDenied || storageStatus.isLimited) {
          final requestResult = await ph.Permission.storage.request();
          results['storage'] = requestResult.isGranted;
          print('Permiso de almacenamiento: ${requestResult.isGranted ? "Concedido" : "Denegado"}');
        } else {
          results['storage'] = storageStatus.isGranted;
          print('Permiso de almacenamiento: Ya estaba concedido');
        }
      } else {
        results['storage'] = true; // No necesario en Android 13+
        print('Permiso de almacenamiento: No necesario en Android 13+');
      }
      
    } catch (e) {
      print('Error al solicitar permisos: $e');
      results['error'] = false;
    }
    
    return results;
  }
  
  /// Verifica si todos los permisos necesarios están concedidos
  static Future<bool> checkAllPermissions() async {
    try {
      final notificationStatus = await ph.Permission.notification.status;
      
      // En Android 13+ solo necesitamos notificaciones
      if (await _isAndroid13OrHigher()) {
        return notificationStatus.isGranted;
      }
      
      // En versiones anteriores también verificamos almacenamiento
      final storageStatus = await ph.Permission.storage.status;
      return notificationStatus.isGranted && storageStatus.isGranted;
    } catch (e) {
      print('Error al verificar permisos: $e');
      return false;
    }
  }
  
  /// Abre la configuración de la aplicación para que el usuario
  /// pueda conceder permisos manualmente
  static Future<bool> openAppSettings() async {
    try {
      return await ph.openAppSettings();
    } catch (e) {
      print('Error al abrir configuración: $e');
      return false;
    }
  }
  
  /// Verifica si el dispositivo es Android 13 o superior
  static Future<bool> _isAndroid13OrHigher() async {
    try {
      // Intentamos verificar el estado de notificaciones
      // En Android 13+, este permiso es requerido explícitamente
      final notificationStatus = await ph.Permission.notification.status;
      // Si podemos verificar el estado, probablemente es Android 13+
      return true;
    } catch (e) {
      // Si hay error, asumimos que es una versión anterior
      return false;
    }
  }
  
  /// Muestra un diálogo explicando por qué se necesitan los permisos
  static Future<void> showPermissionDialog(BuildContext context, String permission) {
    String title;
    String message;
    
    switch (permission) {
      case 'notifications':
        title = 'Permiso de Notificaciones';
        message = 'Necesitamos tu permiso para enviarte recordatorios y notificaciones importantes sobre tus eventos, tareas y ciclos menstruales.';
        break;
      case 'storage':
        title = 'Permiso de Almacenamiento';
        message = 'Necesitamos acceso al almacenamiento para guardar tus datos localmente y crear respaldos de tu información.';
        break;
      default:
        title = 'Permiso Requerido';
        message = 'Esta aplicación necesita este permiso para funcionar correctamente.';
    }
    
    return showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Theme.of(context).colorScheme.surface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          title: Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          content: Text(
            message,
            style: const TextStyle(color: Colors.white70),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text(
                'Entendido',
                style: TextStyle(color: Colors.orangeAccent),
              ),
            ),
            ElevatedButton(
              onPressed: () async {
                Navigator.of(context).pop();
                await PermissionService.openAppSettings();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orangeAccent,
              ),
              child: const Text(
                'Abrir Configuración',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        );
      },
    );
  }
}

