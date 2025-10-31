class WritingPractice {
  final String id;
  final String title;
  final String content;
  final String language;
  final String difficulty;
  final DateTime date;

  WritingPractice({
    required this.id,
    required this.title,
    required this.content,
    required this.language,
    required this.difficulty,
    required this.date,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'content': content,
      'language': language,
      'difficulty': difficulty,
      'date': date.toIso8601String(),
    };
  }

  factory WritingPractice.fromJson(Map<String, dynamic> json) {
    return WritingPractice(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      language: json['language'] ?? '',
      difficulty: json['difficulty'] ?? '',
      date: DateTime.parse(json['date']),
    );
  }
}

