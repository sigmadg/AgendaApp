class CreditCard {
  final String id;
  final String name;
  final String bank;
  final String limit;
  final String balance;
  final String dueDate;
  final String minPayment;

  CreditCard({
    required this.id,
    required this.name,
    required this.bank,
    required this.limit,
    required this.balance,
    required this.dueDate,
    required this.minPayment,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'bank': bank,
      'limit': limit,
      'balance': balance,
      'dueDate': dueDate,
      'minPayment': minPayment,
    };
  }

  factory CreditCard.fromJson(Map<String, dynamic> json) {
    return CreditCard(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      bank: json['bank'] ?? '',
      limit: json['limit'] ?? '',
      balance: json['balance'] ?? '',
      dueDate: json['dueDate'] ?? '',
      minPayment: json['minPayment'] ?? '',
    );
  }
}

