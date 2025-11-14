import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/personal/document_card.dart';

class DocumentService {
  final SupabaseClient _supabase = Supabase.instance.client;

  /// Guardar documento/tarjeta
  Future<Map<String, dynamic>> saveDocument(DocumentCard document) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return {'success': false, 'error': 'Usuario no autenticado'};
      }

      final data = {
        'id': document.id,
        'user_id': userId,
        'type': document.type,
        'name': document.name,
        'number': document.number,
        'issuer': document.issuer,
        'issue_date': document.issueDate?.toIso8601String(),
        'expiry_date': document.expiryDate?.toIso8601String(),
        'notes': document.notes,
      };

      await _supabase.from('document_cards').upsert(data);

      return {'success': true};
    } catch (e) {
      print('DocumentService: Error guardando documento: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  /// Obtener todos los documentos del usuario
  Future<List<DocumentCard>> getDocuments() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return [];
      }

      final response = await _supabase
          .from('document_cards')
          .select()
          .eq('user_id', userId)
          .order('name', ascending: true);

      return (response as List)
          .map((json) => DocumentCard.fromJson(json))
          .toList();
    } catch (e) {
      print('DocumentService: Error obteniendo documentos: $e');
      return [];
    }
  }

  /// Eliminar un documento
  Future<Map<String, dynamic>> deleteDocument(String documentId) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return {'success': false, 'error': 'Usuario no autenticado'};
      }

      await _supabase
          .from('document_cards')
          .delete()
          .eq('id', documentId)
          .eq('user_id', userId);

      return {'success': true};
    } catch (e) {
      print('DocumentService: Error eliminando documento: $e');
      return {'success': false, 'error': e.toString()};
    }
  }
}

