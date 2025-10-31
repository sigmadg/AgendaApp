class Vocabulary {
  final String id;
  final String word;
  final String translation;
  final String language;
  final String category;
  final String level;
  final String difficulty;
  final DateTime createdAt;

  Vocabulary({
    required this.id,
    required this.word,
    required this.translation,
    required this.language,
    required this.category,
    required this.level,
    required this.difficulty,
    required this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'word': word,
      'translation': translation,
      'language': language,
      'category': category,
      'level': level,
      'difficulty': difficulty,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory Vocabulary.fromJson(Map<String, dynamic> json) {
    return Vocabulary(
      id: json['id'] ?? '',
      word: json['word'] ?? '',
      translation: json['translation'] ?? '',
      language: json['language'] ?? '',
      category: json['category'] ?? '',
      level: json['level'] ?? '',
      difficulty: json['difficulty'] ?? '',
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

