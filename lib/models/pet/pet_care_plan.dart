class PetCarePlan {
  final String id;
  final String petName;
  final String petType;
  final String breed;
  final String age;
  final String ownerName;
  final String date;
  final String status; // 'completed', 'in_progress', 'pending'
  final Map<String, String> meals; // { morning: '', evening: '' }
  final String treats;
  final String dayRating;
  final List<String> outdoorTime;
  final List<String> bedtime;
  final List<String> toiletAccess;
  final List<String> favoriteThings;
  final List<String> activities;
  final Map<String, String> health; // { mood: '', energy: '', appetite: '', sleep: '' }
  final String? notes;
  final List<String> photos;
  final List<String> reminders;
  final DateTime createdAt;

  PetCarePlan({
    required this.id,
    required this.petName,
    required this.petType,
    required this.breed,
    required this.age,
    required this.ownerName,
    required this.date,
    required this.status,
    required this.meals,
    required this.treats,
    required this.dayRating,
    required this.outdoorTime,
    required this.bedtime,
    required this.toiletAccess,
    required this.favoriteThings,
    required this.activities,
    required this.health,
    this.notes,
    this.photos = const [],
    this.reminders = const [],
    required this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'petName': petName,
      'petType': petType,
      'breed': breed,
      'age': age,
      'ownerName': ownerName,
      'date': date,
      'status': status,
      'meals': meals,
      'treats': treats,
      'dayRating': dayRating,
      'outdoorTime': outdoorTime,
      'bedtime': bedtime,
      'toiletAccess': toiletAccess,
      'favoriteThings': favoriteThings,
      'activities': activities,
      'health': health,
      'notes': notes,
      'photos': photos,
      'reminders': reminders,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory PetCarePlan.fromJson(Map<String, dynamic> json) {
    return PetCarePlan(
      id: json['id'] ?? '',
      petName: json['petName'] ?? '',
      petType: json['petType'] ?? '',
      breed: json['breed'] ?? '',
      age: json['age'] ?? '',
      ownerName: json['ownerName'] ?? '',
      date: json['date'] ?? '',
      status: json['status'] ?? 'pending',
      meals: Map<String, String>.from(json['meals'] ?? {}),
      treats: json['treats'] ?? '',
      dayRating: json['dayRating'] ?? '',
      outdoorTime: (json['outdoorTime'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      bedtime: (json['bedtime'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      toiletAccess: (json['toiletAccess'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      favoriteThings: (json['favoriteThings'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      activities: (json['activities'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      health: Map<String, String>.from(json['health'] ?? {}),
      notes: json['notes'],
      photos: (json['photos'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      reminders: (json['reminders'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
    );
  }
}
