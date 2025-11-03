class DailyTask {
  final String id;
  final String task;
  final DateTime date;
  final DateTime time;
  final bool completed;
  final String? notes;
  final String priority; // 'high', 'medium', 'low'

  DailyTask({
    required this.id,
    required this.task,
    required this.date,
    required this.time,
    required this.completed,
    this.notes,
    this.priority = 'medium',
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'task': task,
      'date': date.toIso8601String(),
      'time': time.toIso8601String(),
      'completed': completed,
      'notes': notes,
      'priority': priority,
    };
  }

  factory DailyTask.fromJson(Map<String, dynamic> json) {
    return DailyTask(
      id: json['id'] ?? '',
      task: json['task'] ?? '',
      date: DateTime.parse(json['date']),
      time: DateTime.parse(json['time']),
      completed: json['completed'] ?? false,
      notes: json['notes'],
      priority: json['priority'] ?? 'medium',
    );
  }
}

