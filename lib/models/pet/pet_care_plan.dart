class PetCarePlan {
  final String id;
  final String petName;
  final String petType;
  final String activity;
  final String time;
  final String frequency;
  final String status; // 'pending', 'completed', 'skipped'
  final String? notes;

  PetCarePlan({
    required this.id,
    required this.petName,
    required this.petType,
    required this.activity,
    required this.time,
    required this.frequency,
    required this.status,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'petName': petName,
      'petType': petType,
      'activity': activity,
      'time': time,
      'frequency': frequency,
      'status': status,
      'notes': notes,
    };
  }

  factory PetCarePlan.fromJson(Map<String, dynamic> json) {
    return PetCarePlan(
      id: json['id'] ?? '',
      petName: json['petName'] ?? '',
      petType: json['petType'] ?? '',
      activity: json['activity'] ?? '',
      time: json['time'] ?? '',
      frequency: json['frequency'] ?? '',
      status: json['status'] ?? 'pending',
      notes: json['notes'],
    );
  }
}

