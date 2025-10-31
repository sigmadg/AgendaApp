class JourneyPlan {
  final String id;
  final String destination;
  final String travelDates;
  final String duration;
  final String status;
  final String budget;
  final List<String> activities;
  final String transit;
  final String accommodation;
  final String total;
  final int progress;
  final List<String> highlights;
  final String notes;
  final List<JourneyItineraryDay> itinerary;

  JourneyPlan({
    required this.id,
    required this.destination,
    required this.travelDates,
    required this.duration,
    required this.status,
    required this.budget,
    required this.activities,
    required this.transit,
    required this.accommodation,
    required this.total,
    required this.progress,
    required this.highlights,
    required this.notes,
    required this.itinerary,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'destination': destination,
      'travelDates': travelDates,
      'duration': duration,
      'status': status,
      'budget': budget,
      'activities': activities,
      'transit': transit,
      'accommodation': accommodation,
      'total': total,
      'progress': progress,
      'highlights': highlights,
      'notes': notes,
      'itinerary': itinerary.map((i) => i.toJson()).toList(),
    };
  }

  factory JourneyPlan.fromJson(Map<String, dynamic> json) {
    return JourneyPlan(
      id: json['id'] ?? '',
      destination: json['destination'] ?? '',
      travelDates: json['travelDates'] ?? '',
      duration: json['duration'] ?? '',
      status: json['status'] ?? 'planning',
      budget: json['budget'] ?? '',
      activities: (json['activities'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      transit: json['transit'] ?? '',
      accommodation: json['accommodation'] ?? '',
      total: json['total'] ?? '',
      progress: json['progress'] ?? 0,
      highlights: (json['highlights'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      notes: json['notes'] ?? '',
      itinerary: (json['itinerary'] as List<dynamic>?)
              ?.map((i) => JourneyItineraryDay.fromJson(i as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

class JourneyItineraryDay {
  final int day;
  final String city;
  final String activity;

  JourneyItineraryDay({
    required this.day,
    required this.city,
    required this.activity,
  });

  Map<String, dynamic> toJson() {
    return {
      'day': day,
      'city': city,
      'activity': activity,
    };
  }

  factory JourneyItineraryDay.fromJson(Map<String, dynamic> json) {
    return JourneyItineraryDay(
      day: json['day'] ?? 0,
      city: json['city'] ?? '',
      activity: json['activity'] ?? '',
    );
  }
}

