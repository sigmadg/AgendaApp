class SportsGoal {
  final String id;
  final String sport;
  final String objective;
  final DateTime targetDate;
  final String currentProgress;
  final String? notes;

  SportsGoal({
    required this.id,
    required this.sport,
    required this.objective,
    required this.targetDate,
    required this.currentProgress,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'sport': sport,
      'objective': objective,
      'targetDate': targetDate.toIso8601String(),
      'currentProgress': currentProgress,
      'notes': notes,
    };
  }

  factory SportsGoal.fromJson(Map<String, dynamic> json) {
    return SportsGoal(
      id: json['id'] ?? '',
      sport: json['sport'] ?? '',
      objective: json['objective'] ?? '',
      targetDate: DateTime.parse(json['targetDate']),
      currentProgress: json['currentProgress'] ?? '',
      notes: json['notes'],
    );
  }
}

