class JournalEntry {
  final String id;
  final DateTime date;
  final int mood; // 1-5
  final int energy; // 1-5
  final int sleep; // 1-5
  final int stress; // 1-5
  final String? notes;

  JournalEntry({
    required this.id,
    required this.date,
    required this.mood,
    required this.energy,
    required this.sleep,
    required this.stress,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'date': date.toIso8601String(),
      'mood': mood,
      'energy': energy,
      'sleep': sleep,
      'stress': stress,
      'notes': notes,
    };
  }

  factory JournalEntry.fromJson(Map<String, dynamic> json) {
    return JournalEntry(
      id: json['id'] ?? '',
      date: DateTime.parse(json['date']),
      mood: json['mood'] ?? 3,
      energy: json['energy'] ?? 3,
      sleep: json['sleep'] ?? 3,
      stress: json['stress'] ?? 3,
      notes: json['notes'],
    );
  }
}

