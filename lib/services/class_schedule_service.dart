import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/school/class_schedule.dart';

class ClassScheduleService {
  final SupabaseClient _supabase = Supabase.instance.client;

  /// Agregar una nueva clase al horario
  Future<Map<String, dynamic>> addClassSchedule(ClassSchedule classSchedule) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return {'success': false, 'error': 'Usuario no autenticado'};
      }

      // Preparar datos para insertar, solo incluyendo campos no-null
      final data = <String, dynamic>{
        'id': classSchedule.id,
        'user_id': userId,
        'subject': classSchedule.subject,
        'day': classSchedule.day,
        'time': classSchedule.time,
        'duration': classSchedule.duration,
      };

      // Agregar campos opcionales solo si no son null
      if (classSchedule.classroom != null && classSchedule.classroom!.isNotEmpty) {
        data['classroom'] = classSchedule.classroom;
      }
      if (classSchedule.professor != null && classSchedule.professor!.isNotEmpty) {
        data['professor'] = classSchedule.professor;
      }
      if (classSchedule.link != null && classSchedule.link!.isNotEmpty) {
        data['link'] = classSchedule.link;
      }

      print('ClassScheduleService: Insertando clase con datos: $data');

      await _supabase.from('class_schedules').insert(data);

      print('ClassScheduleService: Clase agregada exitosamente');
      return {'success': true};
    } catch (e) {
      print('ClassScheduleService: Error al agregar clase: $e');
      String errorMessage = 'Error al agregar la clase';
      String errorString = e.toString();

      if (errorString.contains('Could not find the table') || errorString.contains('PGRST205')) {
        errorMessage = 'La tabla "class_schedules" no existe en Supabase.\n\nPor favor ejecuta el script SQL:\ndatabase/migrations/create_class_schedules_table.sql\n\nEn el SQL Editor de Supabase.';
      } else if (errorString.contains('violates') || errorString.contains('constraint')) {
        errorMessage = 'Error de validación. Verifica los datos de la clase.';
      } else if (errorString.contains('permission') || errorString.contains('policy')) {
        errorMessage = 'No tienes permiso para agregar clases. Verifica las políticas RLS en Supabase.';
      } else if (errorString.contains('network') || errorString.contains('connection')) {
        errorMessage = 'Error de conexión. Verifica tu internet.';
      } else {
        errorMessage = 'Error: ${errorString.length > 100 ? errorString.substring(0, 100) + "..." : errorString}';
      }

      return {'success': false, 'error': errorMessage};
    }
  }

  /// Obtener todas las clases del usuario
  Future<List<ClassSchedule>> getClassSchedules() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        print('ClassScheduleService: Usuario no autenticado');
        return [];
      }

      print('ClassScheduleService: Obteniendo clases del usuario');

      final response = await _supabase
          .from('class_schedules')
          .select()
          .eq('user_id', userId)
          .order('day', ascending: true)
          .order('time', ascending: true);

      print('ClassScheduleService: Clases obtenidas: ${(response as List).length}');

      return (response as List)
          .map((json) {
            return ClassSchedule.fromJson(json);
          })
          .toList();
    } catch (e) {
      print('ClassScheduleService: Error al obtener clases: $e');
      return [];
    }
  }

  /// Eliminar una clase
  Future<Map<String, dynamic>> deleteClassSchedule(String classId) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return {'success': false, 'error': 'Usuario no autenticado'};
      }

      await _supabase
          .from('class_schedules')
          .delete()
          .eq('id', classId)
          .eq('user_id', userId);

      print('ClassScheduleService: Clase eliminada exitosamente');
      return {'success': true};
    } catch (e) {
      print('ClassScheduleService: Error al eliminar clase: $e');
      return {'success': false, 'error': 'Error al eliminar la clase'};
    }
  }

  /// Actualizar una clase
  Future<Map<String, dynamic>> updateClassSchedule(ClassSchedule classSchedule) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return {'success': false, 'error': 'Usuario no autenticado'};
      }

      // Preparar datos para actualizar
      final data = <String, dynamic>{
        'subject': classSchedule.subject,
        'day': classSchedule.day,
        'time': classSchedule.time,
        'duration': classSchedule.duration,
      };

      // Agregar campos opcionales
      if (classSchedule.classroom != null && classSchedule.classroom!.isNotEmpty) {
        data['classroom'] = classSchedule.classroom;
      } else {
        data['classroom'] = null;
      }
      if (classSchedule.professor != null && classSchedule.professor!.isNotEmpty) {
        data['professor'] = classSchedule.professor;
      } else {
        data['professor'] = null;
      }
      if (classSchedule.link != null && classSchedule.link!.isNotEmpty) {
        data['link'] = classSchedule.link;
      } else {
        data['link'] = null;
      }

      print('ClassScheduleService: Actualizando clase con datos: $data');
      print('ClassScheduleService: ID de clase: ${classSchedule.id}');

      final response = await _supabase
          .from('class_schedules')
          .update(data)
          .eq('id', classSchedule.id)
          .eq('user_id', userId)
          .select();

      print('ClassScheduleService: Respuesta de actualización: $response');

      if (response.isEmpty) {
        return {'success': false, 'error': 'No se encontró la clase para actualizar o no tienes permisos'};
      }

      print('ClassScheduleService: Clase actualizada exitosamente');
      return {'success': true};
    } catch (e) {
      print('ClassScheduleService: Error al actualizar clase: $e');
      String errorMessage = 'Error al actualizar la clase';
      String errorString = e.toString();

      if (errorString.contains('Could not find the table') || errorString.contains('PGRST205')) {
        errorMessage = 'La tabla "class_schedules" no existe en Supabase.';
      } else if (errorString.contains('violates') || errorString.contains('constraint')) {
        errorMessage = 'Error de validación. Verifica los datos de la clase.';
      } else if (errorString.contains('permission') || errorString.contains('policy')) {
        errorMessage = 'No tienes permiso para actualizar esta clase. Verifica las políticas RLS en Supabase.';
      } else if (errorString.contains('network') || errorString.contains('connection')) {
        errorMessage = 'Error de conexión. Verifica tu internet.';
      } else {
        errorMessage = 'Error: ${errorString.length > 100 ? errorString.substring(0, 100) + "..." : errorString}';
      }

      return {'success': false, 'error': errorMessage};
    }
  }
}

