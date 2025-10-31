class Birthday {
  final String id;
  final String name;
  final String date;
  final String relationship;
  final String? phone;
  final String? email;
  final String? notes;
  final int? age;
  final int? daysUntil;
  final String? category;
  final DateTime? createdAt;

  Birthday({
    required this.id,
    required this.name,
    required this.date,
    required this.relationship,
    this.phone,
    this.email,
    this.notes,
    this.age,
    this.daysUntil,
    this.category,
    this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'date': date,
      'relationship': relationship,
      'phone': phone,
      'email': email,
      'notes': notes,
      'age': age,
      'daysUntil': daysUntil,
      'category': category,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  factory Birthday.fromJson(Map<String, dynamic> json) {
    return Birthday(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      date: json['date'] ?? '',
      relationship: json['relationship'] ?? '',
      phone: json['phone'],
      email: json['email'],
      notes: json['notes'],
      age: json['age'],
      daysUntil: json['daysUntil'],
      category: json['category'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
    );
  }
}

