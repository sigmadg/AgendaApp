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
  final ProjectOverview? overview;

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
    this.overview,
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
      'overview': overview?.toJson(),
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
      overview: json['overview'] != null
          ? ProjectOverview.fromJson(json['overview'] as Map<String, dynamic>)
          : null,
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
  final String position;
  final String appoint;
  final String status;
  final DateTime? startDate;
  final DateTime? deadline;
  final String? notes;

  ProjectWork({
    required this.id,
    required this.position,
    required this.appoint,
    required this.status,
    this.startDate,
    this.deadline,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'position': position,
      'appoint': appoint,
      'status': status,
      'startDate': startDate?.toIso8601String(),
      'deadline': deadline?.toIso8601String(),
      'notes': notes,
    };
  }

  factory ProjectWork.fromJson(Map<String, dynamic> json) {
    return ProjectWork(
      id: json['id'] ?? '',
      position: json['position'] ?? '',
      appoint: json['appoint'] ?? '',
      status: json['status'] ?? '',
      startDate: json['startDate'] != null ? DateTime.parse(json['startDate']) : null,
      deadline: json['deadline'] != null ? DateTime.parse(json['deadline']) : null,
      notes: json['notes'],
    );
  }
}

class ProjectFunding {
  final String id;
  final String element;
  final double? projectedCost;
  final double? realCost;
  final String? notes;

  ProjectFunding({
    required this.id,
    required this.element,
    this.projectedCost,
    this.realCost,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'element': element,
      'projectedCost': projectedCost,
      'realCost': realCost,
      'notes': notes,
    };
  }

  factory ProjectFunding.fromJson(Map<String, dynamic> json) {
    return ProjectFunding(
      id: json['id'] ?? '',
      element: json['element'] ?? '',
      projectedCost: json['projectedCost']?.toDouble(),
      realCost: json['realCost']?.toDouble(),
      notes: json['notes'],
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

class ProjectOverview {
  final String id;
  final String? businessName;
  final DateTime? date;
  final CustomerCompany? customerCompany;
  final Undertaking? undertaking;
  final String? presumption;
  final String? jobDescription;
  final List<ProjectTarget> projectTargets;
  final List<ProjectOutput> projectOutputs;
  final String? achievements;

  ProjectOverview({
    required this.id,
    this.businessName,
    this.date,
    this.customerCompany,
    this.undertaking,
    this.presumption,
    this.jobDescription,
    this.projectTargets = const [],
    this.projectOutputs = const [],
    this.achievements,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'businessName': businessName,
      'date': date?.toIso8601String(),
      'customerCompany': customerCompany?.toJson(),
      'undertaking': undertaking?.toJson(),
      'presumption': presumption,
      'jobDescription': jobDescription,
      'projectTargets': projectTargets.map((t) => t.toJson()).toList(),
      'projectOutputs': projectOutputs.map((o) => o.toJson()).toList(),
      'achievements': achievements,
    };
  }

  factory ProjectOverview.fromJson(Map<String, dynamic> json) {
    return ProjectOverview(
      id: json['id'] ?? '',
      businessName: json['businessName'],
      date: json['date'] != null ? DateTime.parse(json['date']) : null,
      customerCompany: json['customerCompany'] != null
          ? CustomerCompany.fromJson(json['customerCompany'] as Map<String, dynamic>)
          : null,
      undertaking: json['undertaking'] != null
          ? Undertaking.fromJson(json['undertaking'] as Map<String, dynamic>)
          : null,
      presumption: json['presumption'],
      jobDescription: json['jobDescription'],
      projectTargets: (json['projectTargets'] as List<dynamic>?)
              ?.map((t) => ProjectTarget.fromJson(t as Map<String, dynamic>))
              .toList() ??
          [],
      projectOutputs: (json['projectOutputs'] as List<dynamic>?)
              ?.map((o) => ProjectOutput.fromJson(o as Map<String, dynamic>))
              .toList() ??
          [],
      achievements: json['achievements'],
    );
  }
}

class CustomerCompany {
  final String name;
  final String? phone;
  final String? email;
  final String? address;

  CustomerCompany({
    required this.name,
    this.phone,
    this.email,
    this.address,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'phone': phone,
      'email': email,
      'address': address,
    };
  }

  factory CustomerCompany.fromJson(Map<String, dynamic> json) {
    return CustomerCompany(
      name: json['name'] ?? '',
      phone: json['phone'],
      email: json['email'],
      address: json['address'],
    );
  }
}

class Undertaking {
  final String name;
  final String? customer;
  final String? label;
  final String? notes;

  Undertaking({
    required this.name,
    this.customer,
    this.label,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'customer': customer,
      'label': label,
      'notes': notes,
    };
  }

  factory Undertaking.fromJson(Map<String, dynamic> json) {
    return Undertaking(
      name: json['name'] ?? '',
      customer: json['customer'],
      label: json['label'],
      notes: json['notes'],
    );
  }
}

class ProjectTarget {
  final String id;
  final String text;
  final bool completed;

  ProjectTarget({
    required this.id,
    required this.text,
    this.completed = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
      'completed': completed,
    };
  }

  factory ProjectTarget.fromJson(Map<String, dynamic> json) {
    return ProjectTarget(
      id: json['id'] ?? '',
      text: json['text'] ?? '',
      completed: json['completed'] ?? false,
    );
  }
}

class ProjectOutput {
  final String id;
  final String text;
  final bool completed;

  ProjectOutput({
    required this.id,
    required this.text,
    this.completed = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
      'completed': completed,
    };
  }

  factory ProjectOutput.fromJson(Map<String, dynamic> json) {
    return ProjectOutput(
      id: json['id'] ?? '',
      text: json['text'] ?? '',
      completed: json['completed'] ?? false,
    );
  }
}

