class Exercise {
  final String name;
  final String sets;
  final String reps;
  final String? weight;
  final String? rest;

  Exercise({
    required this.name,
    required this.sets,
    required this.reps,
    this.weight,
    this.rest,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'sets': sets,
      'reps': reps,
      'weight': weight,
      'rest': rest,
    };
  }

  factory Exercise.fromJson(Map<String, dynamic> json) {
    return Exercise(
      name: json['name'] ?? '',
      sets: json['sets'] ?? '',
      reps: json['reps'] ?? '',
      weight: json['weight'],
      rest: json['rest'],
    );
  }
}

