import 'package:flutter/material.dart';

class PetScheduleActivity {
  final String time;
  final String activity;
  final String type; // 'feeding', 'exercise', 'play', 'care', 'grooming', 'training', 'medical', 'social', 'rest'
  final bool completed;

  PetScheduleActivity({
    required this.time,
    required this.activity,
    required this.type,
    this.completed = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'time': time,
      'activity': activity,
      'type': type,
      'completed': completed,
    };
  }

  factory PetScheduleActivity.fromJson(Map<String, dynamic> json) {
    return PetScheduleActivity(
      time: json['time'] ?? '',
      activity: json['activity'] ?? '',
      type: json['type'] ?? '',
      completed: json['completed'] ?? false,
    );
  }
}

class PetSchedule {
  final String id;
  final String petName;
  final String petType;
  final String breed;
  final String age;
  final String avatar;
  final Color color;
  final Map<String, List<PetScheduleActivity>> schedule; // { monday: [], tuesday: [], etc. }
  final Map<String, dynamic> stats; // { totalActivities: 0, completedActivities: 0, completionRate: 0, streak: 0 }
  final String? notes;

  PetSchedule({
    required this.id,
    required this.petName,
    required this.petType,
    required this.breed,
    required this.age,
    required this.avatar,
    required this.color,
    required this.schedule,
    required this.stats,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'petName': petName,
      'petType': petType,
      'breed': breed,
      'age': age,
      'avatar': avatar,
      'color': color.value,
      'schedule': schedule.map((key, value) => MapEntry(key, value.map((e) => e.toJson()).toList())),
      'stats': stats,
      'notes': notes,
    };
  }

  factory PetSchedule.fromJson(Map<String, dynamic> json) {
    return PetSchedule(
      id: json['id'] ?? '',
      petName: json['petName'] ?? '',
      petType: json['petType'] ?? '',
      breed: json['breed'] ?? '',
      age: json['age'] ?? '',
      avatar: json['avatar'] ?? '',
      color: Color(json['color'] ?? 0xFF2196F3),
      schedule: (json['schedule'] as Map<String, dynamic>?)?.map((key, value) => 
        MapEntry(key, (value as List<dynamic>).map((e) => PetScheduleActivity.fromJson(e)).toList())
      ) ?? {},
      stats: Map<String, dynamic>.from(json['stats'] ?? {}),
      notes: json['notes'],
    );
  }
}
