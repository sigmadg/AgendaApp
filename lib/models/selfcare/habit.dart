class Habit {
  final String id;
  final String text;
  final String priority; // 'high', 'medium', 'low'
  final String category;
  final List<bool> completion; // completado por día de la semana/mes
  final DateTime startDate;

  Habit({
    required this.id,
    required this.text,
    required this.priority,
    required this.category,
    required this.completion,
    required this.startDate,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
      'priority': priority,
      'category': category,
      'completion': completion,
      'startDate': startDate.toIso8601String(),
    };
  }

  factory Habit.fromJson(Map<String, dynamic> json) {
    return Habit(
      id: json['id'] ?? '',
      text: json['text'] ?? '',
      priority: json['priority'] ?? 'medium',
      category: json['category'] ?? '',
      completion: (json['completion'] as List<dynamic>?)
              ?.map((c) => c as bool)
              .toList() ??
          [],
      startDate: DateTime.parse(json['startDate']),
    );
  }
}

