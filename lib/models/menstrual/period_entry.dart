class PeriodEntry {
  final String id;
  final String date;
  final String flow; // 'light', 'regular', 'heavy'
  final List<String> symptoms;
  final String mood; // 'good', 'okay', 'tired', 'sad'
  final int painLevel; // 0-10
  final String? notes;

  PeriodEntry({
    required this.id,
    required this.date,
    required this.flow,
    required this.symptoms,
    required this.mood,
    required this.painLevel,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'date': date,
      'flow': flow,
      'symptoms': symptoms,
      'mood': mood,
      'painLevel': painLevel,
      'notes': notes,
    };
  }

  factory PeriodEntry.fromJson(Map<String, dynamic> json) {
    return PeriodEntry(
      id: json['id'] ?? '',
      date: json['date'] ?? '',
      flow: json['flow'] ?? 'regular',
      symptoms: (json['symptoms'] as List<dynamic>?)?.cast<String>() ?? [],
      mood: json['mood'] ?? 'okay',
      painLevel: json['painLevel'] ?? 0,
      notes: json['notes'],
    );
  }
}

