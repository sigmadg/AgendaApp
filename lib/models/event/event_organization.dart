class EventOrganization {
  final String id;
  final String eventName;
  final String date;
  final String? time;
  final String? location;
  final String? type;
  final int? guests;
  final String? budget;
  final String? notes;
  final String? status;
  final String? priority;
  final int? progress;
  final String? category;
  final DateTime? createdAt;

  EventOrganization({
    required this.id,
    required this.eventName,
    required this.date,
    this.time,
    this.location,
    this.type,
    this.guests,
    this.budget,
    this.notes,
    this.status,
    this.priority,
    this.progress,
    this.category,
    this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'eventName': eventName,
      'date': date,
      'time': time,
      'location': location,
      'type': type,
      'guests': guests,
      'budget': budget,
      'notes': notes,
      'status': status,
      'priority': priority,
      'progress': progress,
      'category': category,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  factory EventOrganization.fromJson(Map<String, dynamic> json) {
    return EventOrganization(
      id: json['id'] ?? '',
      eventName: json['eventName'] ?? '',
      date: json['date'] ?? '',
      time: json['time'],
      location: json['location'],
      type: json['type'],
      guests: json['guests'],
      budget: json['budget'],
      notes: json['notes'],
      status: json['status'],
      priority: json['priority'],
      progress: json['progress'],
      category: json['category'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
    );
  }
}

