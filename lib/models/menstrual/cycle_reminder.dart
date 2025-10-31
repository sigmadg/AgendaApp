class CycleReminder {
  final String id;
  final String title;
  final String description;
  final String date;
  final String time;
  final String type; // 'period_start', 'period_end', 'ovulation', 'medication', 'appointment'
  final bool isActive;
  final String repeat; // 'daily', 'weekly', 'monthly', 'yearly'

  CycleReminder({
    required this.id,
    required this.title,
    required this.description,
    required this.date,
    required this.time,
    required this.type,
    required this.isActive,
    required this.repeat,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'date': date,
      'time': time,
      'type': type,
      'isActive': isActive,
      'repeat': repeat,
    };
  }

  factory CycleReminder.fromJson(Map<String, dynamic> json) {
    return CycleReminder(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      date: json['date'] ?? '',
      time: json['time'] ?? '',
      type: json['type'] ?? '',
      isActive: json['isActive'] ?? false,
      repeat: json['repeat'] ?? 'monthly',
    );
  }
}

