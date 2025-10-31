class Investment {
  final String id;
  final String name;
  final String type;
  final String amount;
  final String currentValue;
  final String profit;
  final String date;

  Investment({
    required this.id,
    required this.name,
    required this.type,
    required this.amount,
    required this.currentValue,
    required this.profit,
    required this.date,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type,
      'amount': amount,
      'currentValue': currentValue,
      'profit': profit,
      'date': date,
    };
  }

  factory Investment.fromJson(Map<String, dynamic> json) {
    return Investment(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      type: json['type'] ?? '',
      amount: json['amount'] ?? '',
      currentValue: json['currentValue'] ?? '',
      profit: json['profit'] ?? '',
      date: json['date'] ?? '',
    );
  }
}

