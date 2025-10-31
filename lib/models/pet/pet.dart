class Pet {
  final String id;
  final String name;
  final String type;
  final String breed;
  final String gender;
  final DateTime birthDate;
  final String? photoUrl;
  final String? notes;

  Pet({
    required this.id,
    required this.name,
    required this.type,
    required this.breed,
    required this.gender,
    required this.birthDate,
    this.photoUrl,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type,
      'breed': breed,
      'gender': gender,
      'birthDate': birthDate.toIso8601String(),
      'photoUrl': photoUrl,
      'notes': notes,
    };
  }

  factory Pet.fromJson(Map<String, dynamic> json) {
    return Pet(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      type: json['type'] ?? '',
      breed: json['breed'] ?? '',
      gender: json['gender'] ?? '',
      birthDate: DateTime.parse(json['birthDate']),
      photoUrl: json['photoUrl'],
      notes: json['notes'],
    );
  }
}

