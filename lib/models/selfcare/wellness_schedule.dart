class WellnessSchedule {
  final String id;
  final String activity;
  final String time;
  final String frequency;
  final bool completed;
  final String? notes;

  WellnessSchedule({
    required this.id,
    required this.activity,
    required this.time,
    required this.frequency,
    required this.completed,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'activity': activity,
      'time': time,
      'frequency': frequency,
      'completed': completed,
      'notes': notes,
    };
  }

  factory WellnessSchedule.fromJson(Map<String, dynamic> json) {
    return WellnessSchedule(
      id: json['id'] ?? '',
      activity: json['activity'] ?? '',
      time: json['time'] ?? '',
      frequency: json['frequency'] ?? '',
      completed: json['completed'] ?? false,
      notes: json['notes'],
    );
  }
}

