class AnimalOrganizer {
  final String id;
  final String name;
  final String type;
  final String breed;
  final String age;
  final String birth;
  final String adoptionDate;
  final String gender;
  final String microchip;
  final String coat;
  final String markings;
  final String vetName;
  final String contactNumber;
  final String foodAllergies;
  final String medicalAllergies;
  final String favoriteToy;
  final String favoriteTreat;
  final String favoriteActivity;
  final String favoriteFood;
  final Map<String, List<bool>> chores; // { washBowls: [], refillWater: [], etc. }
  final String reminders;
  final String? notes;
  final Map<String, dynamic> health; // { weight: '', lastCheckup: '', nextCheckup: '', vaccinations: '', overall: '' }
  final Map<String, String> care; // { feeding: '', exercise: '', grooming: '', training: '' }
  final List<Map<String, dynamic>> tasks; // [{ name: '', completed: false, priority: '' }]
  final Map<String, String> schedule; // { morning: '', afternoon: '', evening: '' }
  final List<String> photos;
  final DateTime createdAt;

  AnimalOrganizer({
    required this.id,
    required this.name,
    required this.type,
    required this.breed,
    required this.age,
    required this.birth,
    required this.adoptionDate,
    required this.gender,
    required this.microchip,
    required this.coat,
    required this.markings,
    required this.vetName,
    required this.contactNumber,
    required this.foodAllergies,
    required this.medicalAllergies,
    required this.favoriteToy,
    required this.favoriteTreat,
    required this.favoriteActivity,
    required this.favoriteFood,
    required this.chores,
    required this.reminders,
    this.notes,
    required this.health,
    required this.care,
    required this.tasks,
    required this.schedule,
    this.photos = const [],
    required this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type,
      'breed': breed,
      'age': age,
      'birth': birth,
      'adoptionDate': adoptionDate,
      'gender': gender,
      'microchip': microchip,
      'coat': coat,
      'markings': markings,
      'vetName': vetName,
      'contactNumber': contactNumber,
      'foodAllergies': foodAllergies,
      'medicalAllergies': medicalAllergies,
      'favoriteToy': favoriteToy,
      'favoriteTreat': favoriteTreat,
      'favoriteActivity': favoriteActivity,
      'favoriteFood': favoriteFood,
      'chores': chores.map((key, value) => MapEntry(key, value)),
      'reminders': reminders,
      'notes': notes,
      'health': health,
      'care': care,
      'tasks': tasks,
      'schedule': schedule,
      'photos': photos,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory AnimalOrganizer.fromJson(Map<String, dynamic> json) {
    return AnimalOrganizer(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      type: json['type'] ?? '',
      breed: json['breed'] ?? '',
      age: json['age'] ?? '',
      birth: json['birth'] ?? '',
      adoptionDate: json['adoptionDate'] ?? '',
      gender: json['gender'] ?? '',
      microchip: json['microchip'] ?? '',
      coat: json['coat'] ?? '',
      markings: json['markings'] ?? '',
      vetName: json['vetName'] ?? '',
      contactNumber: json['contactNumber'] ?? '',
      foodAllergies: json['foodAllergies'] ?? '',
      medicalAllergies: json['medicalAllergies'] ?? '',
      favoriteToy: json['favoriteToy'] ?? '',
      favoriteTreat: json['favoriteTreat'] ?? '',
      favoriteActivity: json['favoriteActivity'] ?? '',
      favoriteFood: json['favoriteFood'] ?? '',
      chores: (json['chores'] as Map<String, dynamic>?)?.map((key, value) => 
        MapEntry(key, (value as List<dynamic>).map((e) => e as bool).toList())
      ) ?? {},
      reminders: json['reminders'] ?? '',
      notes: json['notes'],
      health: Map<String, dynamic>.from(json['health'] ?? {}),
      care: Map<String, String>.from(json['care'] ?? {}),
      tasks: (json['tasks'] as List<dynamic>?)?.map((e) => Map<String, dynamic>.from(e)).toList() ?? [],
      schedule: Map<String, String>.from(json['schedule'] ?? {}),
      photos: (json['photos'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
    );
  }
}

