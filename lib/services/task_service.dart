import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/calendar/calendar_task.dart';
import 'package:intl/intl.dart';

class TaskService {
  final SupabaseClient _supabase = Supabase.instance.client;

  /// Agregar una nueva tarea
  Future<Map<String, dynamic>> addTask(CalendarTask task) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return {'success': false, 'error': 'Usuario no autenticado'};
      }

      // Preparar datos para insertar, solo incluyendo campos no-null
      final data = <String, dynamic>{
        'id': task.id,
        'user_id': userId,
        'title': task.title,
        'date': DateFormat('yyyy-MM-dd').format(task.date),
        'completed': task.completed,
      };

      // Agregar campos opcionales solo si no son null
      if (task.time != null && task.time!.isNotEmpty) {
        data['time'] = task.time;
      }
      if (task.category != null && task.category!.isNotEmpty) {
        data['category'] = task.category;
      }
      if (task.priority != null && task.priority!.isNotEmpty) {
        data['priority'] = task.priority;
      }

      print('TaskService: Insertando tarea con datos: $data');

      await _supabase.from('tasks').insert(data);

      print('TaskService: Tarea agregada exitosamente');
      return {'success': true};
    } catch (e) {
      print('TaskService: Error al agregar tarea: $e');
      String errorMessage = 'Error al agregar la tarea';
      String errorString = e.toString();

      if (errorString.contains('Could not find the table') || errorString.contains('PGRST205')) {
        errorMessage = 'La tabla "tasks" no existe en Supabase.\n\nPor favor ejecuta el script SQL:\ndatabase/migrations/create_tasks_table.sql\n\nEn el SQL Editor de Supabase.';
      } else if (errorString.contains('violates') || errorString.contains('constraint')) {
        errorMessage = 'Error de validación. Verifica los datos de la tarea.';
      } else if (errorString.contains('permission') || errorString.contains('policy')) {
        errorMessage = 'No tienes permiso para agregar tareas. Verifica las políticas RLS en Supabase.';
      } else if (errorString.contains('network') || errorString.contains('connection')) {
        errorMessage = 'Error de conexión. Verifica tu internet.';
      } else {
        errorMessage = 'Error: ${errorString.length > 100 ? errorString.substring(0, 100) + "..." : errorString}';
      }

      return {'success': false, 'error': errorMessage};
    }
  }

  /// Obtener tareas para una fecha específica
  Future<List<CalendarTask>> getTasksForDate(DateTime date) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        print('TaskService: Usuario no autenticado');
        return [];
      }

      final dateString = DateFormat('yyyy-MM-dd').format(date);
      print('TaskService: Obteniendo tareas para la fecha: $dateString');

      final response = await _supabase
          .from('tasks')
          .select()
          .eq('user_id', userId)
          .eq('date', dateString)
          .order('time', ascending: true);

      print('TaskService: Tareas obtenidas: ${(response as List).length}');

      return (response as List)
          .map((json) {
            return CalendarTask(
              id: json['id'] ?? '',
              title: json['title'] ?? '',
              date: DateTime.parse(json['date']),
              completed: json['completed'] ?? false,
              time: json['time'],
              category: json['category'],
              priority: json['priority'],
            );
          })
          .toList();
    } catch (e) {
      print('TaskService: Error al obtener tareas para la fecha: $e');
      return [];
    }
  }

  /// Obtener todas las tareas del usuario
  Future<List<CalendarTask>> getAllTasks() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        print('TaskService: Usuario no autenticado');
        return [];
      }

      print('TaskService: Obteniendo todas las tareas');

      final response = await _supabase
          .from('tasks')
          .select()
          .eq('user_id', userId)
          .order('date', ascending: true)
          .order('time', ascending: true);

      print('TaskService: Tareas obtenidas: ${(response as List).length}');

      return (response as List)
          .map((json) {
            return CalendarTask(
              id: json['id'] ?? '',
              title: json['title'] ?? '',
              date: DateTime.parse(json['date']),
              completed: json['completed'] ?? false,
              time: json['time'],
              category: json['category'],
              priority: json['priority'],
            );
          })
          .toList();
    } catch (e) {
      print('TaskService: Error al obtener todas las tareas: $e');
      return [];
    }
  }

  /// Actualizar una tarea existente
  Future<Map<String, dynamic>> updateTask(CalendarTask task) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return {'success': false, 'error': 'Usuario no autenticado'};
      }

      // Preparar datos para actualizar
      final data = <String, dynamic>{
        'title': task.title,
        'date': DateFormat('yyyy-MM-dd').format(task.date),
        'completed': task.completed,
        'updated_at': DateTime.now().toIso8601String(),
      };

      // Agregar campos opcionales
      if (task.time != null && task.time!.isNotEmpty) {
        data['time'] = task.time;
      } else {
        data['time'] = null;
      }
      if (task.category != null && task.category!.isNotEmpty) {
        data['category'] = task.category;
      } else {
        data['category'] = null;
      }
      if (task.priority != null && task.priority!.isNotEmpty) {
        data['priority'] = task.priority;
      } else {
        data['priority'] = null;
      }

      print('TaskService: Actualizando tarea ${task.id} con datos: $data');

      await _supabase
          .from('tasks')
          .update(data)
          .eq('id', task.id)
          .eq('user_id', userId);

      print('TaskService: Tarea actualizada exitosamente');
      return {'success': true};
    } catch (e) {
      print('TaskService: Error al actualizar tarea: $e');
      return {
        'success': false,
        'error': 'Error al actualizar la tarea: ${e.toString()}'
      };
    }
  }

  /// Eliminar una tarea
  Future<bool> deleteTask(String taskId) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        print('TaskService: Usuario no autenticado');
        return false;
      }

      print('TaskService: Eliminando tarea: $taskId');

      await _supabase
          .from('tasks')
          .delete()
          .eq('id', taskId)
          .eq('user_id', userId);

      print('TaskService: Tarea eliminada exitosamente');
      return true;
    } catch (e) {
      print('TaskService: Error al eliminar tarea: $e');
      return false;
    }
  }
}

