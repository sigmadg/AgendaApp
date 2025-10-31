import 'exercise.dart';

class GymRoutine {
  final String id;
  final String name;
  final String description;
  final List<Exercise> exercises;
  final String duration;
  final String difficulty;

  GymRoutine({
    required this.id,
    required this.name,
    required this.description,
    required this.exercises,
    required this.duration,
    required this.difficulty,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'exercises': exercises.map((e) => e.toJson()).toList(),
      'duration': duration,
      'difficulty': difficulty,
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
    );
  }
}

