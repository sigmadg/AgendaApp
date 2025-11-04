class WellnessPlan {
  final String id;
  final String petName;
  final String petType;
  final String breed;
  final String age;
  final String birth;
  final String coat;
  final String petOwner;
  final String clinic;
  final String veterinarian;
  final String personality;
  final String markings;
  final String favoriteThings;
  final String medicineAllergies;
  final String dailyRoutine;
  final Map<String, dynamic> health; // { weight: '', lastCheckup: '', nextCheckup: '', vaccinations: [], medications: [], allergies: [], conditions: [], overall: '' }
  final Map<String, String> wellness; // { exercise: '', grooming: '', dental: '', nutrition: '', mental: '' }
  final Map<String, dynamic> schedule; // { feeding: {}, exercise: {}, grooming: {} }
  final String? notes;
  final List<String> photos;
  final List<String> reminders;
  final DateTime createdAt;

  WellnessPlan({
    required this.id,
    required this.petName,
    required this.petType,
    required this.breed,
    required this.age,
    required this.birth,
    required this.coat,
    required this.petOwner,
    required this.clinic,
    required this.veterinarian,
    required this.personality,
    required this.markings,
    required this.favoriteThings,
    required this.medicineAllergies,
    required this.dailyRoutine,
    required this.health,
    required this.wellness,
    required this.schedule,
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
      'birth': birth,
      'coat': coat,
      'petOwner': petOwner,
      'clinic': clinic,
      'veterinarian': veterinarian,
      'personality': personality,
      'markings': markings,
      'favoriteThings': favoriteThings,
      'medicineAllergies': medicineAllergies,
      'dailyRoutine': dailyRoutine,
      'health': health,
      'wellness': wellness,
      'schedule': schedule,
      'notes': notes,
      'photos': photos,
      'reminders': reminders,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory WellnessPlan.fromJson(Map<String, dynamic> json) {
    return WellnessPlan(
      id: json['id'] ?? '',
      petName: json['petName'] ?? '',
      petType: json['petType'] ?? '',
      breed: json['breed'] ?? '',
      age: json['age'] ?? '',
      birth: json['birth'] ?? '',
      coat: json['coat'] ?? '',
      petOwner: json['petOwner'] ?? '',
      clinic: json['clinic'] ?? '',
      veterinarian: json['veterinarian'] ?? '',
      personality: json['personality'] ?? '',
      markings: json['markings'] ?? '',
      favoriteThings: json['favoriteThings'] ?? '',
      medicineAllergies: json['medicineAllergies'] ?? '',
      dailyRoutine: json['dailyRoutine'] ?? '',
      health: Map<String, dynamic>.from(json['health'] ?? {}),
      wellness: Map<String, String>.from(json['wellness'] ?? {}),
      schedule: Map<String, dynamic>.from(json['schedule'] ?? {}),
      notes: json['notes'],
      photos: (json['photos'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      reminders: (json['reminders'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
    );
  }
}

