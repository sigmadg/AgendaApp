class PronunciationExercise {
  final String id;
  final String word;
  final String phonetic;
  final String category;
  final String difficulty;
  final String level;
  final bool mastered;
  final int practiceCount;
  final DateTime? lastPracticed;
  final String? audioUrl;
  final String description;
  final String tips;
  final DateTime createdAt;

  PronunciationExercise({
    required this.id,
    required this.word,
    required this.phonetic,
    required this.category,
    required this.difficulty,
    required this.level,
    this.mastered = false,
    this.practiceCount = 0,
    this.lastPracticed,
    this.audioUrl,
    this.description = '',
    this.tips = '',
    required this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'word': word,
      'phonetic': phonetic,
      'category': category,
      'difficulty': difficulty,
      'level': level,
      'mastered': mastered,
      'practiceCount': practiceCount,
      'lastPracticed': lastPracticed?.toIso8601String(),
      'audioUrl': audioUrl,
      'description': description,
      'tips': tips,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory PronunciationExercise.fromJson(Map<String, dynamic> json) {
    return PronunciationExercise(
      id: json['id'] ?? '',
      word: json['word'] ?? '',
      phonetic: json['phonetic'] ?? '',
      category: json['category'] ?? '',
      difficulty: json['difficulty'] ?? '',
      level: json['level'] ?? '',
      mastered: json['mastered'] ?? false,
      practiceCount: json['practiceCount'] ?? 0,
      lastPracticed: json['lastPracticed'] != null ? DateTime.parse(json['lastPracticed']) : null,
      audioUrl: json['audioUrl'],
      description: json['description'] ?? '',
      tips: json['tips'] ?? '',
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

