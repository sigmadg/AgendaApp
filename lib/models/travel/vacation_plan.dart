class VacationPlan {
  final String id;
  final String destination;
  final String vacationType; // 'Playa', 'Aventura', 'Cultural', 'Relajación'
  final String startDate;
  final String endDate;
  final String duration;
  final String status; // 'planning', 'confirmed', 'completed'
  final String budget;
  final String accommodation;
  final List<String> activities;
  final List<String> highlights;
  final VacationWeather weather;
  final List<String> packingList;
  final String notes;
  final List<VacationItineraryDay> itinerary;

  VacationPlan({
    required this.id,
    required this.destination,
    required this.vacationType,
    required this.startDate,
    required this.endDate,
    required this.duration,
    required this.status,
    required this.budget,
    required this.accommodation,
    required this.activities,
    required this.highlights,
    required this.weather,
    required this.packingList,
    required this.notes,
    required this.itinerary,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'destination': destination,
      'vacationType': vacationType,
      'startDate': startDate,
      'endDate': endDate,
      'duration': duration,
      'status': status,
      'budget': budget,
      'accommodation': accommodation,
      'activities': activities,
      'highlights': highlights,
      'weather': weather.toJson(),
      'packingList': packingList,
      'notes': notes,
      'itinerary': itinerary.map((i) => i.toJson()).toList(),
    };
  }

  factory VacationPlan.fromJson(Map<String, dynamic> json) {
    return VacationPlan(
      id: json['id'] ?? '',
      destination: json['destination'] ?? '',
      vacationType: json['vacationType'] ?? '',
      startDate: json['startDate'] ?? '',
      endDate: json['endDate'] ?? '',
      duration: json['duration'] ?? '',
      status: json['status'] ?? 'planning',
      budget: json['budget'] ?? '',
      accommodation: json['accommodation'] ?? '',
      activities: (json['activities'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      highlights: (json['highlights'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      weather: json['weather'] != null ? VacationWeather.fromJson(json['weather'] as Map<String, dynamic>) : VacationWeather(temperature: '', condition: '', humidity: ''),
      packingList: (json['packingList'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      notes: json['notes'] ?? '',
      itinerary: (json['itinerary'] as List<dynamic>?)
              ?.map((i) => VacationItineraryDay.fromJson(i as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

class VacationWeather {
  final String temperature;
  final String condition;
  final String humidity;

  VacationWeather({
    required this.temperature,
    required this.condition,
    required this.humidity,
  });

  Map<String, dynamic> toJson() {
    return {
      'temperature': temperature,
      'condition': condition,
      'humidity': humidity,
    };
  }

  factory VacationWeather.fromJson(Map<String, dynamic> json) {
    return VacationWeather(
      temperature: json['temperature'] ?? '',
      condition: json['condition'] ?? '',
      humidity: json['humidity'] ?? '',
    );
  }
}

class VacationItineraryDay {
  final int day;
  final String activity;

  VacationItineraryDay({
    required this.day,
    required this.activity,
  });

  Map<String, dynamic> toJson() {
    return {
      'day': day,
      'activity': activity,
    };
  }

  factory VacationItineraryDay.fromJson(Map<String, dynamic> json) {
    return VacationItineraryDay(
      day: json['day'] ?? 0,
      activity: json['activity'] ?? '',
    );
  }
}

