class BodyMeasurement {
  final String id;
  final String name;
  final String value;
  final DateTime date;

  BodyMeasurement({
    required this.id,
    required this.name,
    required this.value,
    required this.date,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'value': value,
      'date': date.toIso8601String(),
    };
  }

  factory BodyMeasurement.fromJson(Map<String, dynamic> json) {
    return BodyMeasurement(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      value: json['value'] ?? '',
      date: DateTime.parse(json['date']),
    );
  }
}

