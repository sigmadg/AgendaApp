class GroupProject {
  final String id;
  final String title;
  final String objective;
  final DateTime startDate;
  final DateTime endDate;
  final String? resources;
  final String? ideas;
  final List<ActionStep> actionSteps;

  GroupProject({
    required this.id,
    required this.title,
    required this.objective,
    required this.startDate,
    required this.endDate,
    this.resources,
    this.ideas,
    required this.actionSteps,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'objective': objective,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'resources': resources,
      'ideas': ideas,
      'actionSteps': actionSteps.map((s) => s.toJson()).toList(),
    };
  }

  factory GroupProject.fromJson(Map<String, dynamic> json) {
    return GroupProject(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      objective: json['objective'] ?? '',
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      resources: json['resources'],
      ideas: json['ideas'],
      actionSteps: (json['actionSteps'] as List<dynamic>?)
              ?.map((s) => ActionStep.fromJson(s as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

class ActionStep {
  final String id;
  final String text;
  final bool completed;

  ActionStep({
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

  factory ActionStep.fromJson(Map<String, dynamic> json) {
    return ActionStep(
      id: json['id'] ?? '',
      text: json['text'] ?? '',
      completed: json['completed'] ?? false,
    );
  }
}

