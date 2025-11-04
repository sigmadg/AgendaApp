class Vocabulary {
  final String id;
  final String word;
  final String phonetics;
  final String meaning;
  final String translation;
  final String example;
  final String language;
  final String category;
  final String level;
  final String difficulty;
  final bool mastered;
  final int studyCount;
  final DateTime? lastStudied;
  final List<String> tags;
  final DateTime createdAt;

  Vocabulary({
    required this.id,
    required this.word,
    this.phonetics = '',
    this.meaning = '',
    required this.translation,
    this.example = '',
    required this.language,
    required this.category,
    required this.level,
    required this.difficulty,
    this.mastered = false,
    this.studyCount = 0,
    this.lastStudied,
    this.tags = const [],
    required this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'word': word,
      'phonetics': phonetics,
      'meaning': meaning,
      'translation': translation,
      'example': example,
      'language': language,
      'category': category,
      'level': level,
      'difficulty': difficulty,
      'mastered': mastered,
      'studyCount': studyCount,
      'lastStudied': lastStudied?.toIso8601String(),
      'tags': tags,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory Vocabulary.fromJson(Map<String, dynamic> json) {
    return Vocabulary(
      id: json['id'] ?? '',
      word: json['word'] ?? '',
      phonetics: json['phonetics'] ?? '',
      meaning: json['meaning'] ?? '',
      translation: json['translation'] ?? '',
      example: json['example'] ?? '',
      language: json['language'] ?? '',
      category: json['category'] ?? '',
      level: json['level'] ?? '',
      difficulty: json['difficulty'] ?? '',
      mastered: json['mastered'] ?? false,
      studyCount: json['studyCount'] ?? 0,
      lastStudied: json['lastStudied'] != null ? DateTime.parse(json['lastStudied']) : null,
      tags: (json['tags'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

