class NutritionMealPlan {
  final String id;
  final DateTime date;
  final String mealType; // 'breakfast', 'lunch', 'dinner', 'snack'
  final String name;
  final int calories;
  final String? notes;

  NutritionMealPlan({
    required this.id,
    required this.date,
    required this.mealType,
    required this.name,
    required this.calories,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'date': date.toIso8601String(),
      'mealType': mealType,
      'name': name,
      'calories': calories,
      'notes': notes,
    };
  }

  factory NutritionMealPlan.fromJson(Map<String, dynamic> json) {
    return NutritionMealPlan(
      id: json['id'] ?? '',
      date: DateTime.parse(json['date']),
      mealType: json['mealType'] ?? '',
      name: json['name'] ?? '',
      calories: json['calories'] ?? 0,
      notes: json['notes'],
    );
  }
}

