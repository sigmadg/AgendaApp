class ExamRevision {
  final String id;
  final String topic;
  final DateTime date;
  final List<ExamTodo> todos;
  final String? notes;

  ExamRevision({
    required this.id,
    required this.topic,
    required this.date,
    required this.todos,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'topic': topic,
      'date': date.toIso8601String(),
      'todos': todos.map((t) => t.toJson()).toList(),
      'notes': notes,
    };
  }

  factory ExamRevision.fromJson(Map<String, dynamic> json) {
    return ExamRevision(
      id: json['id'] ?? '',
      topic: json['topic'] ?? '',
      date: DateTime.parse(json['date']),
      todos: (json['todos'] as List<dynamic>?)
              ?.map((t) => ExamTodo.fromJson(t as Map<String, dynamic>))
              .toList() ??
          [],
      notes: json['notes'],
    );
  }
}

class ExamTodo {
  final String id;
  final String text;
  final bool completed;

  ExamTodo({
    required this.id,
    required this.text,
    required this.completed,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
      'completed': completed,
    };
  }

  factory ExamTodo.fromJson(Map<String, dynamic> json) {
    return ExamTodo(
      id: json['id'] ?? '',
      text: json['text'] ?? '',
      completed: json['completed'] ?? false,
    );
  }
}

