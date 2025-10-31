class Reminder {
  final String id;
  final String title;
  final String date;
  final String? time;
  final String? type;
  final String? description;
  final String? priority;
  final String? status;
  final String? category;
  final int? daysUntil;
  final bool? recurring;
  final String? notification;
  final DateTime? createdAt;

  Reminder({
    required this.id,
    required this.title,
    required this.date,
    this.time,
    this.type,
    this.description,
    this.priority,
    this.status,
    this.category,
    this.daysUntil,
    this.recurring,
    this.notification,
    this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'date': date,
      'time': time,
      'type': type,
      'description': description,
      'priority': priority,
      'status': status,
      'category': category,
      'daysUntil': daysUntil,
      'recurring': recurring,
      'notification': notification,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  factory Reminder.fromJson(Map<String, dynamic> json) {
    return Reminder(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      date: json['date'] ?? '',
      time: json['time'],
      type: json['type'],
      description: json['description'],
      priority: json['priority'],
      status: json['status'],
      category: json['category'],
      daysUntil: json['daysUntil'],
      recurring: json['recurring'],
      notification: json['notification'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
    );
  }
}

