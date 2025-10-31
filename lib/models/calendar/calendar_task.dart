class CalendarTask {
  final String id;
  final String title;
  final DateTime date;
  final bool completed;
  final String? time;
  final String? category;
  final String? priority; // 'high', 'medium', 'low'

  CalendarTask({
    required this.id,
    required this.title,
    required this.date,
    required this.completed,
    this.time,
    this.category,
    this.priority,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'date': date.toIso8601String(),
      'completed': completed,
      'time': time,
      'category': category,
      'priority': priority,
    };
  }

  factory CalendarTask.fromJson(Map<String, dynamic> json) {
    return CalendarTask(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      date: DateTime.parse(json['date']),
      completed: json['completed'] ?? false,
      time: json['time'],
      category: json['category'],
      priority: json['priority'],
    );
  }
}

