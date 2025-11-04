class ConversationPhrase {
  final String speaker;
  final String text;
  final String translation;

  ConversationPhrase({
    required this.speaker,
    required this.text,
    required this.translation,
  });

  Map<String, dynamic> toJson() {
    return {
      'speaker': speaker,
      'text': text,
      'translation': translation,
    };
  }

  factory ConversationPhrase.fromJson(Map<String, dynamic> json) {
    return ConversationPhrase(
      speaker: json['speaker'] ?? '',
      text: json['text'] ?? '',
      translation: json['translation'] ?? '',
    );
  }
}

