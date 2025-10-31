class NutritionShoppingItem {
  final String id;
  final String name;
  final int quantity;
  final bool purchased;
  final String category; // 'fruits', 'vegetables', 'dairy', 'meat', 'grains', 'snacks'

  NutritionShoppingItem({
    required this.id,
    required this.name,
    required this.quantity,
    required this.purchased,
    required this.category,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'quantity': quantity,
      'purchased': purchased,
      'category': category,
    };
  }

  factory NutritionShoppingItem.fromJson(Map<String, dynamic> json) {
    return NutritionShoppingItem(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      quantity: json['quantity'] ?? 1,
      purchased: json['purchased'] ?? false,
      category: json['category'] ?? 'snacks',
    );
  }
}

