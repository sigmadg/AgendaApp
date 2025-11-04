class TripOrganizer {
  final String id;
  final String tripName;
  final String destination;
  final String startDate;
  final String endDate;
  final String duration;
  final String status; // 'planning', 'confirmed', 'completed'
  final String budget;
  final int travelers;
  final String accommodation;
  final String transportation;
  final List<String> activities;
  final List<String> documents;
  final List<String> packingList;
  final List<String> emergencyContacts;
  final String notes;
  final List<TripItineraryDay> itinerary;

  TripOrganizer({
    required this.id,
    required this.tripName,
    required this.destination,
    required this.startDate,
    required this.endDate,
    required this.duration,
    required this.status,
    required this.budget,
    required this.travelers,
    required this.accommodation,
    required this.transportation,
    required this.activities,
    required this.documents,
    required this.packingList,
    required this.emergencyContacts,
    required this.notes,
    required this.itinerary,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tripName': tripName,
      'destination': destination,
      'startDate': startDate,
      'endDate': endDate,
      'duration': duration,
      'status': status,
      'budget': budget,
      'travelers': travelers,
      'accommodation': accommodation,
      'transportation': transportation,
      'activities': activities,
      'documents': documents,
      'packingList': packingList,
      'emergencyContacts': emergencyContacts,
      'notes': notes,
      'itinerary': itinerary.map((i) => i.toJson()).toList(),
    };
  }

  factory TripOrganizer.fromJson(Map<String, dynamic> json) {
    return TripOrganizer(
      id: json['id'] ?? '',
      tripName: json['tripName'] ?? '',
      destination: json['destination'] ?? '',
      startDate: json['startDate'] ?? '',
      endDate: json['endDate'] ?? '',
      duration: json['duration'] ?? '',
      status: json['status'] ?? 'planning',
      budget: json['budget'] ?? '',
      travelers: json['travelers'] ?? 1,
      accommodation: json['accommodation'] ?? '',
      transportation: json['transportation'] ?? '',
      activities: (json['activities'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      documents: (json['documents'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      packingList: (json['packingList'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      emergencyContacts: (json['emergencyContacts'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      notes: json['notes'] ?? '',
      itinerary: (json['itinerary'] as List<dynamic>?)
              ?.map((i) => TripItineraryDay.fromJson(i as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

class TripItineraryDay {
  final int day;
  final String city;
  final String activity;

  TripItineraryDay({
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

  factory TripItineraryDay.fromJson(Map<String, dynamic> json) {
    return TripItineraryDay(
      day: json['day'] ?? 0,
      city: json['city'] ?? '',
      activity: json['activity'] ?? '',
    );
  }
}

