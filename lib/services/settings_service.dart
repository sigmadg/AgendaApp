import 'package:supabase_flutter/supabase_flutter.dart';

class SettingsService {
  final SupabaseClient _supabase = Supabase.instance.client;

  /// Obtener configuraciones del usuario actual
  Future<Map<String, dynamic>?> getSettings() async {
    try {
      final session = _supabase.auth.currentSession;
      if (session == null || session.user == null) {
        return null;
      }

      final response = await _supabase
          .from('user_settings')
          .select()
          .eq('user_id', session.user!.id)
          .maybeSingle();

      if (response == null) {
        // Si no existe, crear configuraciones por defecto
        return await _createDefaultSettings();
      }

      return _formatSettings(response);
    } catch (e) {
      print('SettingsService: Error getting settings: $e');
      return null;
    }
  }

  /// Crear configuraciones por defecto para el usuario
  Future<Map<String, dynamic>> _createDefaultSettings() async {
    try {
      final session = _supabase.auth.currentSession;
      if (session == null || session.user == null) {
        throw Exception('User not authenticated');
      }

      final defaultSettings = {
        'user_id': session.user!.id,
        'profile_visible': true,
        'show_name': true,
        'show_email': true,
        'share_data': false,
        'allow_analytics': true,
        'allow_notifications': true,
        'active_sections': {
          'personal': true,
          'work': true,
          'school': true,
          'health': true,
          'finance': true,
          'nutrition': true,
          'exercise': true,
          'language': true,
          'menstrual': true,
          'pet': true,
          'selfcare': true,
          'travel': true,
          'reading': true,
          'movies': true,
          'entrepreneurship': true,
        },
      };

      await _supabase.from('user_settings').insert(defaultSettings);

      return _formatSettings(defaultSettings);
    } catch (e) {
      print('SettingsService: Error creating default settings: $e');
      // Retornar valores por defecto en caso de error
      return _getDefaultSettings();
    }
  }

  /// Actualizar configuraciones de privacidad
  Future<Map<String, dynamic>> updatePrivacySettings({
    required bool profileVisible,
    required bool showName,
    required bool showEmail,
    required bool shareData,
    required bool allowAnalytics,
    required bool allowNotifications,
  }) async {
    try {
      final session = _supabase.auth.currentSession;
      if (session == null || session.user == null) {
        return {'success': false, 'error': 'Usuario no autenticado'};
      }

      // Verificar si existe, si no, crearlo primero
      final existing = await _supabase
          .from('user_settings')
          .select()
          .eq('user_id', session.user!.id)
          .maybeSingle();

      final updateData = {
        'profile_visible': profileVisible,
        'show_name': showName,
        'show_email': showEmail,
        'share_data': shareData,
        'allow_analytics': allowAnalytics,
        'allow_notifications': allowNotifications,
      };

      if (existing == null) {
        // Crear con valores por defecto y actualizar
        final defaultSettings = await _createDefaultSettings();
        await _supabase
            .from('user_settings')
            .update(updateData)
            .eq('user_id', session.user!.id);
      } else {
        await _supabase
            .from('user_settings')
            .update(updateData)
            .eq('user_id', session.user!.id);
      }

      print('SettingsService: Privacy settings updated successfully');
      return {'success': true};
    } catch (e) {
      print('SettingsService: Error updating privacy settings: $e');
      String errorMessage = 'Error al actualizar la configuración de privacidad';
      
      if (e.toString().contains('Could not find the table') || 
          e.toString().contains('PGRST205')) {
        errorMessage = 'La tabla "user_settings" no existe en Supabase.\n\n'
            'Por favor ejecuta el script SQL:\n'
            'database/migrations/create_user_settings_table.sql\n\n'
            'En el SQL Editor de Supabase.';
      } else if (e.toString().contains('permission denied') || 
                 e.toString().contains('RLS')) {
        errorMessage = 'Error de permisos. Verifica las políticas RLS en Supabase.';
      } else if (e.toString().contains('network') || 
                 e.toString().contains('connection')) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
      }

      return {'success': false, 'error': errorMessage};
    }
  }

  /// Actualizar estado de secciones activas
  Future<Map<String, dynamic>> updateActiveSections(
    Map<String, bool> activeSections,
  ) async {
    try {
      final session = _supabase.auth.currentSession;
      if (session == null || session.user == null) {
        return {'success': false, 'error': 'Usuario no autenticado'};
      }

      // Verificar si existe, si no, crearlo primero
      final existing = await _supabase
          .from('user_settings')
          .select()
          .eq('user_id', session.user!.id)
          .maybeSingle();

      if (existing == null) {
        await _createDefaultSettings();
      }

      await _supabase
          .from('user_settings')
          .update({'active_sections': activeSections})
          .eq('user_id', session.user!.id);

      print('SettingsService: Active sections updated successfully');
      return {'success': true};
    } catch (e) {
      print('SettingsService: Error updating active sections: $e');
      String errorMessage = 'Error al actualizar las secciones activas';
      
      if (e.toString().contains('Could not find the table') || 
          e.toString().contains('PGRST205')) {
        errorMessage = 'La tabla "user_settings" no existe en Supabase.\n\n'
            'Por favor ejecuta el script SQL:\n'
            'database/migrations/create_user_settings_table.sql\n\n'
            'En el SQL Editor de Supabase.';
      }

      return {'success': false, 'error': errorMessage};
    }
  }

  /// Actualizar una sección específica
  Future<Map<String, dynamic>> updateSectionStatus(
    String sectionId,
    bool isActive,
  ) async {
    try {
      final currentSettings = await getSettings();
      if (currentSettings == null) {
        return {'success': false, 'error': 'No se pudieron cargar las configuraciones'};
      }

      final activeSections = Map<String, bool>.from(
        currentSettings['active_sections'] as Map<String, dynamic>? ?? {},
      );

      activeSections[sectionId] = isActive;

      return await updateActiveSections(activeSections);
    } catch (e) {
      print('SettingsService: Error updating section status: $e');
      return {'success': false, 'error': 'Error al actualizar el estado de la sección'};
    }
  }

  /// Formatear las configuraciones desde la respuesta de Supabase
  Map<String, dynamic> _formatSettings(Map<String, dynamic> data) {
    // Convertir active_sections si viene como JSONB
    dynamic activeSections = data['active_sections'];
    if (activeSections is String) {
      // Si viene como string JSON, parsearlo
      // (Supabase generalmente lo maneja automáticamente, pero por si acaso)
    }

    return {
      'profile_visible': data['profile_visible'] ?? true,
      'show_name': data['show_name'] ?? true,
      'show_email': data['show_email'] ?? true,
      'share_data': data['share_data'] ?? false,
      'allow_analytics': data['allow_analytics'] ?? true,
      'allow_notifications': data['allow_notifications'] ?? true,
      'active_sections': activeSections is Map
          ? Map<String, bool>.from(activeSections)
          : (activeSections ?? _getDefaultActiveSections()),
    };
  }

  /// Obtener valores por defecto para configuraciones
  Map<String, dynamic> _getDefaultSettings() {
    return {
      'profile_visible': true,
      'show_name': true,
      'show_email': true,
      'share_data': false,
      'allow_analytics': true,
      'allow_notifications': true,
      'active_sections': _getDefaultActiveSections(),
    };
  }

  /// Obtener valores por defecto para secciones activas
  Map<String, bool> _getDefaultActiveSections() {
    return {
      'personal': true,
      'work': true,
      'school': true,
      'health': true,
      'finance': true,
      'nutrition': true,
      'exercise': true,
      'language': true,
      'menstrual': true,
      'pet': true,
      'selfcare': true,
      'travel': true,
      'reading': true,
      'movies': true,
      'entrepreneurship': true,
    };
  }
}

