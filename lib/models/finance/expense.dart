class Expense {
  final String id;
  final String date;
  final String description;
  final String category;
  final String amount;
  final String paymentMethod;

  Expense({
    required this.id,
    required this.date,
    required this.description,
    required this.category,
    required this.amount,
    required this.paymentMethod,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'date': date,
      'description': description,
      'category': category,
      'amount': amount,
      'paymentMethod': paymentMethod,
    };
  }

  factory Expense.fromJson(Map<String, dynamic> json) {
    return Expense(
      id: json['id'] ?? '',
      date: json['date'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? '',
      amount: json['amount'] ?? '',
      paymentMethod: json['paymentMethod'] ?? '',
    );
  }
}

