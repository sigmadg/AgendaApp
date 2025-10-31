class Recipe {
  final String id;
  final String name;
  final String category;
  final String difficulty;
  final int calories;
  final double rating;
  final String prepTime;
  final String ingredients;

  Recipe({
    required this.id,
    required this.name,
    required this.category,
    required this.difficulty,
    required this.calories,
    required this.rating,
    required this.prepTime,
    required this.ingredients,
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
    );
  }
}

