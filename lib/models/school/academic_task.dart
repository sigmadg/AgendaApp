class AcademicTask {
  final String id;
  final String task;
  final DateTime date;
  final bool completed;
  final String? notes;
  final String priority; // 'high', 'medium', 'low'
  final String? subject;
  final String? estimatedTime;

  AcademicTask({
    required this.id,
    required this.task,
    required this.date,
    required this.completed,
    this.notes,
    this.priority = 'medium',
    this.subject,
    this.estimatedTime,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'task': task,
      'date': date.toIso8601String(),
      'completed': completed,
      'notes': notes,
      'priority': priority,
      'subject': subject,
      'estimatedTime': estimatedTime,
    };
  }

  factory AcademicTask.fromJson(Map<String, dynamic> json) {
    return AcademicTask(
      id: json['id'] ?? '',
      task: json['task'] ?? '',
      date: DateTime.parse(json['date']),
      completed: json['completed'] ?? false,
      notes: json['notes'],
      priority: json['priority'] ?? 'medium',
      subject: json['subject'],
      estimatedTime: json['estimatedTime'],
    );
  }
}

