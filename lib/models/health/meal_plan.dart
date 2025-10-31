class MealPlan {
  final String id;
  final String name;
  final String time;
  final String calories;
  final String notes;

  MealPlan({
    required this.id,
    required this.name,
    required this.time,
    required this.calories,
    required this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'time': time,
      'calories': calories,
      'notes': notes,
    };
  }

  factory MealPlan.fromJson(Map<String, dynamic> json) {
    return MealPlan(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      time: json['time'] ?? '',
      calories: json['calories'] ?? '',
      notes: json['notes'] ?? '',
    );
  }
}

