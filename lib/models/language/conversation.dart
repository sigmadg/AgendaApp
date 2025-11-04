import 'conversation_phrase.dart';

class Conversation {
  final String id;
  final String title;
  final String category;
  final String difficulty;
  final String level;
  final int participants;
  final String duration;
  final bool mastered;
  final int practiceCount;
  final DateTime? lastPracticed;
  final String description;
  final List<ConversationPhrase> phrases;
  final DateTime createdAt;

  Conversation({
    required this.id,
    required this.title,
    required this.category,
    required this.difficulty,
    required this.level,
    required this.participants,
    required this.duration,
    this.mastered = false,
    this.practiceCount = 0,
    this.lastPracticed,
    this.description = '',
    this.phrases = const [],
    required this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'category': category,
      'difficulty': difficulty,
      'level': level,
      'participants': participants,
      'duration': duration,
      'mastered': mastered,
      'practiceCount': practiceCount,
      'lastPracticed': lastPracticed?.toIso8601String(),
      'description': description,
      'phrases': phrases.map((p) => p.toJson()).toList(),
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      category: json['category'] ?? '',
      difficulty: json['difficulty'] ?? '',
      level: json['level'] ?? '',
      participants: json['participants'] ?? 2,
      duration: json['duration'] ?? '',
      mastered: json['mastered'] ?? false,
      practiceCount: json['practiceCount'] ?? 0,
      lastPracticed: json['lastPracticed'] != null ? DateTime.parse(json['lastPracticed']) : null,
      description: json['description'] ?? '',
      phrases: (json['phrases'] as List<dynamic>?)
          ?.map((p) => ConversationPhrase.fromJson(p))
          .toList() ?? [],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

