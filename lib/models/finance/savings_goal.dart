class SavingsGoal {
  final String id;
  final String name;
  final String targetAmount;
  final String currentAmount;
  final String deadline;
  final double progress;

  SavingsGoal({
    required this.id,
    required this.name,
    required this.targetAmount,
    required this.currentAmount,
    required this.deadline,
    required this.progress,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'targetAmount': targetAmount,
      'currentAmount': currentAmount,
      'deadline': deadline,
      'progress': progress,
    };
  }

  factory SavingsGoal.fromJson(Map<String, dynamic> json) {
    return SavingsGoal(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      targetAmount: json['targetAmount'] ?? '',
      currentAmount: json['currentAmount'] ?? '',
      deadline: json['deadline'] ?? '',
      progress: (json['progress'] as num?)?.toDouble() ?? 0.0,
    );
  }
}

