class GrammarNote {
  final String id;
  final String title;
  final String content;
  final String language;
  final String category;
  final String level;
  final String difficulty;
  final DateTime createdAt;

  GrammarNote({
    required this.id,
    required this.title,
    required this.content,
    required this.language,
    required this.category,
    required this.level,
    required this.difficulty,
    required this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'content': content,
      'language': language,
      'category': category,
      'level': level,
      'difficulty': difficulty,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory GrammarNote.fromJson(Map<String, dynamic> json) {
    return GrammarNote(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      language: json['language'] ?? '',
      category: json['category'] ?? '',
      level: json['level'] ?? '',
      difficulty: json['difficulty'] ?? '',
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

