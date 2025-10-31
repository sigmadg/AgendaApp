class TravelPlan {
  final String id;
  final String destination;
  final String date;
  final String duration;
  final String status; // 'planning', 'confirmed', 'completed'
  final int progress;
  final List<String> clothing;
  final List<String> items;
  final List<String> personalCare;
  final List<String> documents;
  final List<String> essentials;
  final List<String> shoes;
  final List<String> devices;
  final List<String> reminders;

  TravelPlan({
    required this.id,
    required this.destination,
    required this.date,
    required this.duration,
    required this.status,
    required this.progress,
    required this.clothing,
    required this.items,
    required this.personalCare,
    required this.documents,
    required this.essentials,
    required this.shoes,
    required this.devices,
    required this.reminders,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'destination': destination,
      'date': date,
      'duration': duration,
      'status': status,
      'progress': progress,
      'clothing': clothing,
      'items': items,
      'personalCare': personalCare,
      'documents': documents,
      'essentials': essentials,
      'shoes': shoes,
      'devices': devices,
      'reminders': reminders,
    };
  }

  factory TravelPlan.fromJson(Map<String, dynamic> json) {
    return TravelPlan(
      id: json['id'] ?? '',
      destination: json['destination'] ?? '',
      date: json['date'] ?? '',
      duration: json['duration'] ?? '',
      status: json['status'] ?? 'planning',
      progress: json['progress'] ?? 0,
      clothing: (json['clothing'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      items: (json['items'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      personalCare: (json['personalCare'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      documents: (json['documents'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      essentials: (json['essentials'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      shoes: (json['shoes'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      devices: (json['devices'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      reminders: (json['reminders'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
    );
  }
}

