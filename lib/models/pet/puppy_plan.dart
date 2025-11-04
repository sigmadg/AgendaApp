class PuppyPlan {
  final String id;
  final String puppyName;
  final String breed;
  final String age;
  final String sex;
  final String ownerName;
  final String phone;
  final String address;
  final String emergencyContact;
  final String localVet;
  final String? vetPhoto;
  final String emergencyVet;
  final String emergencyVetPhone;
  final String microchipped;
  final String needsMedicine;
  final String morningActivity;
  final String afternoonActivity;
  final String eveningActivity;
  final List<String> behaviors;
  final Map<String, dynamic> training; // { level: '', commands: [], progress: 0, nextGoals: [] }
  final Map<String, dynamic> health; // { weight: '', lastVaccination: '', nextVaccination: '', deworming: '', overall: '' }
  final Map<String, String> schedule; // { wakeUp: '', breakfast: '', firstWalk: '', nap: '', lunch: '', playtime: '', secondWalk: '', dinner: '', bedtime: '' }
  final String? notes;
  final List<String> photos;
  final List<String> reminders;
  final DateTime createdAt;

  PuppyPlan({
    required this.id,
    required this.puppyName,
    required this.breed,
    required this.age,
    required this.sex,
    required this.ownerName,
    required this.phone,
    required this.address,
    required this.emergencyContact,
    required this.localVet,
    this.vetPhoto,
    required this.emergencyVet,
    required this.emergencyVetPhone,
    required this.microchipped,
    required this.needsMedicine,
    required this.morningActivity,
    required this.afternoonActivity,
    required this.eveningActivity,
    required this.behaviors,
    required this.training,
    required this.health,
    required this.schedule,
    this.notes,
    this.photos = const [],
    this.reminders = const [],
    required this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'puppyName': puppyName,
      'breed': breed,
      'age': age,
      'sex': sex,
      'ownerName': ownerName,
      'phone': phone,
      'address': address,
      'emergencyContact': emergencyContact,
      'localVet': localVet,
      'vetPhoto': vetPhoto,
      'emergencyVet': emergencyVet,
      'emergencyVetPhone': emergencyVetPhone,
      'microchipped': microchipped,
      'needsMedicine': needsMedicine,
      'morningActivity': morningActivity,
      'afternoonActivity': afternoonActivity,
      'eveningActivity': eveningActivity,
      'behaviors': behaviors,
      'training': training,
      'health': health,
      'schedule': schedule,
      'notes': notes,
      'photos': photos,
      'reminders': reminders,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory PuppyPlan.fromJson(Map<String, dynamic> json) {
    return PuppyPlan(
      id: json['id'] ?? '',
      puppyName: json['puppyName'] ?? '',
      breed: json['breed'] ?? '',
      age: json['age'] ?? '',
      sex: json['sex'] ?? '',
      ownerName: json['ownerName'] ?? '',
      phone: json['phone'] ?? '',
      address: json['address'] ?? '',
      emergencyContact: json['emergencyContact'] ?? '',
      localVet: json['localVet'] ?? '',
      vetPhoto: json['vetPhoto'],
      emergencyVet: json['emergencyVet'] ?? '',
      emergencyVetPhone: json['emergencyVetPhone'] ?? '',
      microchipped: json['microchipped'] ?? '',
      needsMedicine: json['needsMedicine'] ?? '',
      morningActivity: json['morningActivity'] ?? '',
      afternoonActivity: json['afternoonActivity'] ?? '',
      eveningActivity: json['eveningActivity'] ?? '',
      behaviors: (json['behaviors'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      training: Map<String, dynamic>.from(json['training'] ?? {}),
      health: Map<String, dynamic>.from(json['health'] ?? {}),
      schedule: Map<String, String>.from(json['schedule'] ?? {}),
      notes: json['notes'],
      photos: (json['photos'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      reminders: (json['reminders'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
    );
  }
}

