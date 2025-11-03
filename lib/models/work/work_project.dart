class WorkProject {
  final String id;
  final String title;
  final String aim;
  final DateTime? startDate;
  final DateTime? deadline;
  final List<ProjectTeammate> teammates;
  final List<ProjectAchievement> achievements;
  final List<ProjectWork> works;
  final List<ProjectFunding> funding;
  final List<ProjectGoal> goals;

  WorkProject({
    required this.id,
    required this.title,
    required this.aim,
    this.startDate,
    this.deadline,
    required this.teammates,
    required this.achievements,
    required this.works,
    required this.funding,
    required this.goals,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'aim': aim,
      'startDate': startDate?.toIso8601String(),
      'deadline': deadline?.toIso8601String(),
      'teammates': teammates.map((t) => t.toJson()).toList(),
      'achievements': achievements.map((a) => a.toJson()).toList(),
      'works': works.map((w) => w.toJson()).toList(),
      'funding': funding.map((f) => f.toJson()).toList(),
      'goals': goals.map((g) => g.toJson()).toList(),
    };
  }

  factory WorkProject.fromJson(Map<String, dynamic> json) {
    return WorkProject(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      aim: json['aim'] ?? '',
      startDate: json['startDate'] != null ? DateTime.parse(json['startDate']) : null,
      deadline: json['deadline'] != null ? DateTime.parse(json['deadline']) : null,
      teammates: (json['teammates'] as List<dynamic>?)
              ?.map((t) => ProjectTeammate.fromJson(t as Map<String, dynamic>))
              .toList() ??
          [],
      achievements: (json['achievements'] as List<dynamic>?)
              ?.map((a) => ProjectAchievement.fromJson(a as Map<String, dynamic>))
              .toList() ??
          [],
      works: (json['works'] as List<dynamic>?)
              ?.map((w) => ProjectWork.fromJson(w as Map<String, dynamic>))
              .toList() ??
          [],
      funding: (json['funding'] as List<dynamic>?)
              ?.map((f) => ProjectFunding.fromJson(f as Map<String, dynamic>))
              .toList() ??
          [],
      goals: (json['goals'] as List<dynamic>?)
              ?.map((g) => ProjectGoal.fromJson(g as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}

class ProjectTeammate {
  final String id;
  final String name;
  final String role;

  ProjectTeammate({
    required this.id,
    required this.name,
    required this.role,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'role': role,
    };
  }

  factory ProjectTeammate.fromJson(Map<String, dynamic> json) {
    return ProjectTeammate(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      role: json['role'] ?? '',
    );
  }
}

class ProjectAchievement {
  final String id;
  final String text;
  final DateTime? date;
  final String? person;
  final String? position;

  ProjectAchievement({
    required this.id,
    required this.text,
    this.date,
    this.person,
    this.position,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
      'date': date?.toIso8601String(),
      'person': person,
      'position': position,
    };
  }

  factory ProjectAchievement.fromJson(Map<String, dynamic> json) {
    return ProjectAchievement(
      id: json['id'] ?? '',
      text: json['text'] ?? '',
      date: json['date'] != null ? DateTime.parse(json['date']) : null,
      person: json['person'],
      position: json['position'],
    );
  }
}

class ProjectWork {
  final String id;
  final String description;

  ProjectWork({
    required this.id,
    required this.description,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'description': description,
    };
  }

  factory ProjectWork.fromJson(Map<String, dynamic> json) {
    return ProjectWork(
      id: json['id'] ?? '',
      description: json['description'] ?? '',
    );
  }
}

class ProjectFunding {
  final String id;
  final String description;
  final double? amount;

  ProjectFunding({
    required this.id,
    required this.description,
    this.amount,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'description': description,
      'amount': amount,
    };
  }

  factory ProjectFunding.fromJson(Map<String, dynamic> json) {
    return ProjectFunding(
      id: json['id'] ?? '',
      description: json['description'] ?? '',
      amount: json['amount']?.toDouble(),
    );
  }
}

class ProjectGoal {
  final String id;
  final String text;
  final DateTime? date;
  final String? person;
  final String? position;
  final bool completed;

  ProjectGoal({
    required this.id,
    required this.text,
    this.date,
    this.person,
    this.position,
    this.completed = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
      'date': date?.toIso8601String(),
      'person': person,
      'position': position,
      'completed': completed,
    };
  }

  factory ProjectGoal.fromJson(Map<String, dynamic> json) {
    return ProjectGoal(
      id: json['id'] ?? '',
      text: json['text'] ?? '',
      date: json['date'] != null ? DateTime.parse(json['date']) : null,
      person: json['person'],
      position: json['position'],
      completed: json['completed'] ?? false,
    );
  }
}

