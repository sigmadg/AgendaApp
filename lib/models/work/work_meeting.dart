class WorkMeeting {
  final String id;
  final String name;
  final String date;
  final String? time;
  final String? location;
  final String? type; // 'meeting', 'session', 'appointment'
  final String? notes;
  final DateTime? createdAt;

  WorkMeeting({
    required this.id,
    required this.name,
    required this.date,
    this.time,
    this.location,
    this.type,
    this.notes,
    this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'date': date,
      'time': time,
      'location': location,
      'type': type,
      'notes': notes,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  factory WorkMeeting.fromJson(Map<String, dynamic> json) {
    return WorkMeeting(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      date: json['date'] ?? '',
      time: json['time'],
      location: json['location'],
      type: json['type'],
      notes: json['notes'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
    );
  }
}

