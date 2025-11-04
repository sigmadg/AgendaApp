class GrammarNote {
  final String id;
  final String title;
  final String content;
  final List<String> examples;
  final String language;
  final String category;
  final String level;
  final String difficulty;
  final bool mastered;
  final int studyCount;
  final DateTime? lastStudied;
  final List<String> tags;
  final DateTime createdAt;

  GrammarNote({
    required this.id,
    required this.title,
    required this.content,
    this.examples = const [],
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
      'title': title,
      'content': content,
      'examples': examples,
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

  factory GrammarNote.fromJson(Map<String, dynamic> json) {
    return GrammarNote(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      examples: (json['examples'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
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

