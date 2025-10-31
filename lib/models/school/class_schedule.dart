class ClassSchedule {
  final String id;
  final String subject;
  final String day;
  final String time;
  final String? classroom;
  final String? professor;
  final int duration; // en minutos

  ClassSchedule({
    required this.id,
    required this.subject,
    required this.day,
    required this.time,
    this.classroom,
    this.professor,
    this.duration = 60,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'subject': subject,
      'day': day,
      'time': time,
      'classroom': classroom,
      'professor': professor,
      'duration': duration,
    };
  }

  factory ClassSchedule.fromJson(Map<String, dynamic> json) {
    return ClassSchedule(
      id: json['id'] ?? '',
      subject: json['subject'] ?? '',
      day: json['day'] ?? '',
      time: json['time'] ?? '',
      classroom: json['classroom'],
      professor: json['professor'],
      duration: json['duration'] ?? 60,
    );
  }
}

