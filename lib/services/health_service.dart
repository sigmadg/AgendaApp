import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:intl/intl.dart';

class HealthService {
  final SupabaseClient _supabase = Supabase.instance.client;

  /// Guardar plan de comidas
  Future<Map<String, dynamic>> saveMealPlan(String date, Map<String, dynamic> mealData) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return {'success': false, 'error': 'Usuario no autenticado'};
      }

      final data = {
        'user_id': userId,
        'date': date,
        'breakfast': mealData['breakfast'],
        'lunch': mealData['lunch'],
        'dinner': mealData['dinner'],
        'water_glasses': mealData['waterGlasses'] ?? 0,
      };

      // Verificar si ya existe un plan para esta fecha
      final existing = await _supabase
          .from('meal_plans')
          .select()
          .eq('user_id', userId)
          .eq('date', date)
          .maybeSingle();

      if (existing != null) {
        await _supabase
            .from('meal_plans')
            .update(data)
            .eq('user_id', userId)
            .eq('date', date);
      } else {
        await _supabase.from('meal_plans').insert(data);
      }

      return {'success': true};
    } catch (e) {
      print('HealthService: Error guardando plan de comidas: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  /// Obtener plan de comidas para una fecha
  Future<Map<String, dynamic>?> getMealPlan(String date) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return null;
      }

      final response = await _supabase
          .from('meal_plans')
          .select()
          .eq('user_id', userId)
          .eq('date', date)
          .maybeSingle();

      if (response == null) {
        return null;
      }

      return {
        'breakfast': response['breakfast'],
        'lunch': response['lunch'],
        'dinner': response['dinner'],
        'waterGlasses': response['water_glasses'] ?? 0,
      };
    } catch (e) {
      print('HealthService: Error obteniendo plan de comidas: $e');
      return null;
    }
  }

  /// Obtener todos los planes de comidas
  Future<Map<String, Map<String, dynamic>>> getAllMealPlans() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return {};
      }

      final response = await _supabase
          .from('meal_plans')
          .select()
          .eq('user_id', userId)
          .order('date', ascending: false);

      final Map<String, Map<String, dynamic>> mealPlans = {};
      for (var row in response) {
        final date = row['date'] as String;
        mealPlans[date] = {
          'breakfast': row['breakfast'],
          'lunch': row['lunch'],
          'dinner': row['dinner'],
          'waterGlasses': row['water_glasses'] ?? 0,
        };
      }

      return mealPlans;
    } catch (e) {
      print('HealthService: Error obteniendo planes de comidas: $e');
      return {};
    }
  }

  /// Guardar lista de compras
  Future<Map<String, dynamic>> saveShoppingList(Map<String, List<Map<String, dynamic>>> marketList) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return {'success': false, 'error': 'Usuario no autenticado'};
      }

      final data = {
        'user_id': userId,
        'items': marketList,
      };

      // Verificar si ya existe
      final existing = await _supabase
          .from('shopping_lists')
          .select()
          .eq('user_id', userId)
          .maybeSingle();

      if (existing != null) {
        await _supabase
            .from('shopping_lists')
            .update(data)
            .eq('user_id', userId);
      } else {
        await _supabase.from('shopping_lists').insert(data);
      }

      return {'success': true};
    } catch (e) {
      print('HealthService: Error guardando lista de compras: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  /// Obtener lista de compras
  Future<Map<String, List<Map<String, dynamic>>>?> getShoppingList() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return null;
      }

      final response = await _supabase
          .from('shopping_lists')
          .select()
          .eq('user_id', userId)
          .maybeSingle();

      if (response == null || response['items'] == null) {
        return null;
      }

      return Map<String, List<Map<String, dynamic>>>.from(
        response['items'] as Map,
      );
    } catch (e) {
      print('HealthService: Error obteniendo lista de compras: $e');
      return null;
    }
  }

  /// Guardar receta
  Future<Map<String, dynamic>> saveRecipe(Map<String, dynamic> recipeData) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return {'success': false, 'error': 'Usuario no autenticado'};
      }

      final data = {
        'user_id': userId,
        'id': recipeData['id'],
        'name': recipeData['name'],
        'category': recipeData['category'],
        'difficulty': recipeData['difficulty'],
        'prep_time': recipeData['prepTime'],
        'servings': recipeData['servings'],
        'calories': recipeData['calories'],
        'rating': recipeData['rating'],
        'ingredients': recipeData['ingredients'],
        'instructions': recipeData['instructions'],
        'tags': recipeData['tags'],
      };

      await _supabase.from('recipes').upsert(data);

      return {'success': true};
    } catch (e) {
      print('HealthService: Error guardando receta: $e');
      return {'success': false, 'error': e.toString()};
    }
  }

  /// Obtener todas las recetas del usuario
  Future<List<Map<String, dynamic>>> getRecipes() async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return [];
      }

      final response = await _supabase
          .from('recipes')
          .select()
          .eq('user_id', userId)
          .order('name', ascending: true);

      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      print('HealthService: Error obteniendo recetas: $e');
      return [];
    }
  }

  /// Eliminar una receta
  Future<Map<String, dynamic>> deleteRecipe(String recipeId) async {
    try {
      final userId = _supabase.auth.currentUser?.id;
      if (userId == null) {
        return {'success': false, 'error': 'Usuario no autenticado'};
      }

      await _supabase
          .from('recipes')
          .delete()
          .eq('id', recipeId)
          .eq('user_id', userId);

      return {'success': true};
    } catch (e) {
      print('HealthService: Error eliminando receta: $e');
      return {'success': false, 'error': e.toString()};
    }
  }
}

