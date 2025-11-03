class Recipe {
  final String id;
  final String name;
  final String category;
  final String difficulty;
  final int calories;
  final double rating;
  final String prepTime;
  final String ingredients;
  final int servings;
  final String instructions;
  final List<String> tags;

  Recipe({
    required this.id,
    required this.name,
    required this.category,
    required this.difficulty,
    required this.calories,
    required this.rating,
    required this.prepTime,
    required this.ingredients,
    this.servings = 2,
    this.instructions = '',
    this.tags = const [],
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'difficulty': difficulty,
      'calories': calories,
      'rating': rating,
      'prepTime': prepTime,
      'ingredients': ingredients,
      'servings': servings,
      'instructions': instructions,
      'tags': tags,
    };
  }

  factory Recipe.fromJson(Map<String, dynamic> json) {
    return Recipe(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      category: json['category'] ?? '',
      difficulty: json['difficulty'] ?? 'Fácil',
      calories: json['calories'] ?? 0,
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      prepTime: json['prepTime'] ?? '',
      ingredients: json['ingredients'] ?? '',
      servings: json['servings'] ?? 2,
      instructions: json['instructions'] ?? '',
      tags: (json['tags'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
    );
  }
}

