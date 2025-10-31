class WeeklyTask {
  final String id;
  final String task;
  final DateTime date;
  final bool completed;
  final String? notes;
  final String priority; // 'high', 'medium', 'low'

  WeeklyTask({
    required this.id,
    required this.task,
    required this.date,
    required this.completed,
    this.notes,
    this.priority = 'medium',
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'task': task,
      'date': date.toIso8601String(),
      'completed': completed,
      'notes': notes,
      'priority': priority,
    };
  }

  factory WeeklyTask.fromJson(Map<String, dynamic> json) {
    return WeeklyTask(
      id: json['id'] ?? '',
      task: json['task'] ?? '',
      date: DateTime.parse(json['date']),
      completed: json['completed'] ?? false,
      notes: json['notes'],
      priority: json['priority'] ?? 'medium',
    );
  }
}

