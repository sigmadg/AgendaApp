class NutritionRecipe {
  final String id;
  final String name;
  final String category;
  final String difficulty;
  final int calories;
  final double rating;
  final String prepTime;
  final String ingredients;
  final String? instructions;
  final String? imageUrl;

  NutritionRecipe({
    required this.id,
    required this.name,
    required this.category,
    required this.difficulty,
    required this.calories,
    required this.rating,
    required this.prepTime,
    required this.ingredients,
    this.instructions,
    this.imageUrl,
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
      'instructions': instructions,
      'imageUrl': imageUrl,
    };
  }

  factory NutritionRecipe.fromJson(Map<String, dynamic> json) {
    return NutritionRecipe(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      category: json['category'] ?? '',
      difficulty: json['difficulty'] ?? 'Fácil',
      calories: json['calories'] ?? 0,
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      prepTime: json['prepTime'] ?? '',
      ingredients: json['ingredients'] ?? '',
      instructions: json['instructions'],
      imageUrl: json['imageUrl'],
    );
  }
}

