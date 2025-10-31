class SelfCarePlan {
  final String id;
  final String activity;
  final String priority; // 'high', 'medium', 'low'
  final DateTime date;
  final int mood; // 1-5
  final int energy; // 1-5
  final int satisfaction; // 1-5
  final String? notes;

  SelfCarePlan({
    required this.id,
    required this.activity,
    required this.priority,
    required this.date,
    required this.mood,
    required this.energy,
    required this.satisfaction,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'activity': activity,
      'priority': priority,
      'date': date.toIso8601String(),
      'mood': mood,
      'energy': energy,
      'satisfaction': satisfaction,
      'notes': notes,
    };
  }

  factory SelfCarePlan.fromJson(Map<String, dynamic> json) {
    return SelfCarePlan(
      id: json['id'] ?? '',
      activity: json['activity'] ?? '',
      priority: json['priority'] ?? 'medium',
      date: DateTime.parse(json['date']),
      mood: json['mood'] ?? 3,
      energy: json['energy'] ?? 3,
      satisfaction: json['satisfaction'] ?? 3,
      notes: json['notes'],
    );
  }
}

