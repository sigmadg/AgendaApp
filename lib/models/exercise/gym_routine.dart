import 'exercise.dart';

class GymRoutine {
  final String id;
  final String name;
  final String description;
  final List<Exercise> exercises;
  final String duration;
  final String difficulty;
  final bool isRecurring;
  final String? recurrenceType; // 'daily', 'weekly', 'monthly'
  final List<int>? recurrenceDays; // Para weekly: [1,3,5] = lunes, miércoles, viernes
  final DateTime? startDate;
  final DateTime? endDate;

  GymRoutine({
    required this.id,
    required this.name,
    required this.description,
    required this.exercises,
    required this.duration,
    required this.difficulty,
    this.isRecurring = false,
    this.recurrenceType,
    this.recurrenceDays,
    this.startDate,
    this.endDate,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'exercises': exercises.map((e) => e.toJson()).toList(),
      'duration': duration,
      'difficulty': difficulty,
      'isRecurring': isRecurring,
      'recurrenceType': recurrenceType,
      'recurrenceDays': recurrenceDays,
      'startDate': startDate?.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
    };
  }

  factory GymRoutine.fromJson(Map<String, dynamic> json) {
    return GymRoutine(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      exercises: (json['exercises'] as List?)
              ?.map((e) => Exercise.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      duration: json['duration'] ?? '',
      difficulty: json['difficulty'] ?? 'Principiante',
      isRecurring: json['isRecurring'] ?? false,
      recurrenceType: json['recurrenceType'],
      recurrenceDays: json['recurrenceDays'] != null 
          ? List<int>.from(json['recurrenceDays'])
          : null,
      startDate: json['startDate'] != null 
          ? DateTime.tryParse(json['startDate'])
          : null,
      endDate: json['endDate'] != null 
          ? DateTime.tryParse(json['endDate'])
          : null,
    );
  }
}

