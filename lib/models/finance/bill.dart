class Bill {
  final String id;
  final String name;
  final String amount;
  final String dueDate;
  final String status; // 'paid' or 'pending'
  final String category;

  Bill({
    required this.id,
    required this.name,
    required this.amount,
    required this.dueDate,
    required this.status,
    required this.category,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'amount': amount,
      'dueDate': dueDate,
      'status': status,
      'category': category,
    };
  }

  factory Bill.fromJson(Map<String, dynamic> json) {
    return Bill(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      amount: json['amount'] ?? '',
      dueDate: json['dueDate'] ?? '',
      status: json['status'] ?? 'pending',
      category: json['category'] ?? '',
    );
  }
}

