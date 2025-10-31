class BudgetCategory {
  final String id;
  final String name;
  final String budget;
  final String spent;
  final String remaining;

  BudgetCategory({
    required this.id,
    required this.name,
    required this.budget,
    required this.spent,
    required this.remaining,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'budget': budget,
      'spent': spent,
      'remaining': remaining,
    };
  }

  factory BudgetCategory.fromJson(Map<String, dynamic> json) {
    return BudgetCategory(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      budget: json['budget'] ?? '',
      spent: json['spent'] ?? '',
      remaining: json['remaining'] ?? '',
    );
  }
}

