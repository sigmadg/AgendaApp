import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/event/event_organization.dart';

class EventService {
  final SupabaseClient _supabase = Supabase.instance.client;

  // Obtener eventos del usuario para una fecha específica
  Future<List<EventOrganization>> getEventsForDate(DateTime date) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return [];
      }

      final dateString = '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
      
      final response = await _supabase
          .from('events')
          .select()
          .eq('user_id', userId)
          .eq('date', dateString)
          .order('time', ascending: true);

      return (response as List)
          .map((json) {
            // Convertir event_name a eventName para el modelo
            if (json['event_name'] != null && json['eventName'] == null) {
              json['eventName'] = json['event_name'];
            }
            return EventOrganization.fromJson(json);
          })
          .toList();
    } catch (e) {
      print('Error al obtener eventos: $e');
      return [];
    }
  }

  // Obtener todos los eventos del usuario
  Future<List<EventOrganization>> getAllEvents() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return [];
      }

      final response = await _supabase
          .from('events')
          .select()
          .eq('user_id', userId)
          .order('date', ascending: true)
          .order('time', ascending: true);

      return (response as List)
          .map((json) {
            // Convertir event_name a eventName para el modelo
            if (json['event_name'] != null && json['eventName'] == null) {
              json['eventName'] = json['event_name'];
            }
            return EventOrganization.fromJson(json);
          })
          .toList();
    } catch (e) {
      print('Error al obtener todos los eventos: $e');
      return [];
    }
  }

  // Agregar un nuevo evento
  Future<Map<String, dynamic>> addEvent(EventOrganization event) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return {'success': false, 'error': 'Usuario no autenticado'};
      }

      // Preparar datos para insertar, solo incluyendo campos no-null
      final data = <String, dynamic>{
        'id': event.id,
        'user_id': userId,
        'event_name': event.eventName,
        'date': event.date,
      };

      // Agregar campos opcionales solo si no son null
      if (event.time != null && event.time!.isNotEmpty) {
        data['time'] = event.time;
      }
      if (event.location != null && event.location!.isNotEmpty) {
        data['location'] = event.location;
      }
      if (event.type != null && event.type!.isNotEmpty) {
        data['type'] = event.type;
      }
      if (event.guests != null) {
        data['guests'] = event.guests;
      }
      if (event.budget != null && event.budget!.isNotEmpty) {
        data['budget'] = event.budget;
      }
      if (event.notes != null && event.notes!.isNotEmpty) {
        data['notes'] = event.notes;
      }
      if (event.status != null && event.status!.isNotEmpty) {
        data['status'] = event.status;
      }
      if (event.priority != null && event.priority!.isNotEmpty) {
        data['priority'] = event.priority;
      }
      if (event.progress != null) {
        data['progress'] = event.progress;
      }
      if (event.category != null && event.category!.isNotEmpty) {
        data['category'] = event.category;
      }

      print('EventService: Insertando evento con datos: $data');

      await _supabase.from('events').insert(data);

      print('EventService: Evento agregado exitosamente');
      return {'success': true};
    } catch (e) {
      print('EventService: Error al agregar evento: $e');
      String errorMessage = 'Error al agregar el evento';
      String errorString = e.toString();
      
      if (errorString.contains('Could not find the table') || errorString.contains('PGRST205')) {
        errorMessage = 'La tabla "events" no existe en Supabase.\n\nPor favor ejecuta el script SQL:\ndatabase/migrations/create_events_table.sql\n\nEn el SQL Editor de Supabase.';
      } else if (errorString.contains('violates') || errorString.contains('constraint')) {
        errorMessage = 'Error de validación. Verifica los datos del evento.';
      } else if (errorString.contains('permission') || errorString.contains('policy')) {
        errorMessage = 'No tienes permiso para agregar eventos. Verifica las políticas RLS en Supabase.';
      } else if (errorString.contains('network') || errorString.contains('connection')) {
        errorMessage = 'Error de conexión. Verifica tu internet.';
      } else {
        errorMessage = 'Error: ${errorString.length > 100 ? errorString.substring(0, 100) + "..." : errorString}';
      }
      
      return {'success': false, 'error': errorMessage};
    }
  }

  // Actualizar un evento
  Future<bool> updateEvent(EventOrganization event) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return false;
      }

      await _supabase
          .from('events')
          .update({
            'event_name': event.eventName,
            'date': event.date,
            'time': event.time,
            'location': event.location,
            'type': event.type,
            'guests': event.guests,
            'budget': event.budget,
            'notes': event.notes,
            'status': event.status,
            'priority': event.priority,
            'progress': event.progress,
            'category': event.category,
            'updated_at': DateTime.now().toIso8601String(),
          })
          .eq('id', event.id)
          .eq('user_id', userId);

      return true;
    } catch (e) {
      print('Error al actualizar evento: $e');
      return false;
    }
  }

  // Eliminar un evento
  Future<bool> deleteEvent(String eventId) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return false;
      }

      await _supabase
          .from('events')
          .delete()
          .eq('id', eventId)
          .eq('user_id', userId);

      return true;
    } catch (e) {
      print('Error al eliminar evento: $e');
      return false;
    }
  }
}

