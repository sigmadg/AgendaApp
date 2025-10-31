class TourPlan {
  final String id;
  final String destination;
  final String date;
  final String day;
  final String duration;
  final String status;
  final List<String> sites;
  final String breakfast;
  final String lunch;
  final String dinner;
  final String other;
  final String notes;
  final List<TourActivity> activities;

  TourPlan({
    required this.id,
    required this.destination,
    required this.date,
    required this.day,
    required this.duration,
    required this.status,
    required this.sites,
    required this.breakfast,
    required this.lunch,
    required this.dinner,
    required this.other,
    required this.notes,
    required this.activities,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'destination': destination,
      'date': date,
      'day': day,
      'duration': duration,
      'status': status,
      'sites': sites,
      'breakfast': breakfast,
      'lunch': lunch,
      'dinner': dinner,
      'other': other,
      'notes': notes,
      'activities': activities.map((a) => a.toJson()).toList(),
    };
  }

  factory TourPlan.fromJson(Map<String, dynamic> json) {
    return TourPlan(
      id: json['id'] ?? '',
      destination: json['destination'] ?? '',
      date: json['date'] ?? '',
      day: json['day'] ?? '',
      duration: json['duration'] ?? '',
      status: json['status'] ?? 'planning',
      sites: (json['sites'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      breakfast: json['breakfast'] ?? '',
      lunch: json['lunch'] ?? '',
      dinner: json['dinner'] ?? '',
      other: json['other'] ?? '',
      notes: json['notes'] ?? '',
      activities: (json['activities'] as List<dynamic>?)
              ?.map((a) => TourActivity.fromJson(a as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

class TourActivity {
  final String time;
  final String activity;
  final String type; // 'meal', 'sightseeing', 'walking', etc.

  TourActivity({
    required this.time,
    required this.activity,
    required this.type,
  });

  Map<String, dynamic> toJson() {
    return {
      'time': time,
      'activity': activity,
      'type': type,
    };
  }

  factory TourActivity.fromJson(Map<String, dynamic> json) {
    return TourActivity(
      time: json['time'] ?? '',
      activity: json['activity'] ?? '',
      type: json['type'] ?? '',
    );
  }
}

