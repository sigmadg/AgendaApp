class Invitation {
  final String id;
  final String eventName;
  final String guestName;
  final String? email;
  final String? phone;
  final String status;
  final DateTime? responseDate;
  final DateTime? invitationDate;
  final String? message;
  final String? category;
  final String? priority;
  final bool? plusOne;
  final String? dietaryRestrictions;
  final String? rsvpDeadline;
  final DateTime? createdAt;

  Invitation({
    required this.id,
    required this.eventName,
    required this.guestName,
    this.email,
    this.phone,
    required this.status,
    this.responseDate,
    this.invitationDate,
    this.message,
    this.category,
    this.priority,
    this.plusOne,
    this.dietaryRestrictions,
    this.rsvpDeadline,
    this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'eventName': eventName,
      'guestName': guestName,
      'email': email,
      'phone': phone,
      'status': status,
      'responseDate': responseDate?.toIso8601String(),
      'invitationDate': invitationDate?.toIso8601String(),
      'message': message,
      'category': category,
      'priority': priority,
      'plusOne': plusOne,
      'dietaryRestrictions': dietaryRestrictions,
      'rsvpDeadline': rsvpDeadline,
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  factory Invitation.fromJson(Map<String, dynamic> json) {
    return Invitation(
      id: json['id'] ?? '',
      eventName: json['eventName'] ?? '',
      guestName: json['guestName'] ?? '',
      email: json['email'],
      phone: json['phone'],
      status: json['status'] ?? 'pending',
      responseDate: json['responseDate'] != null
          ? DateTime.parse(json['responseDate'])
          : null,
      invitationDate: json['invitationDate'] != null
          ? DateTime.parse(json['invitationDate'])
          : null,
      message: json['message'],
      category: json['category'],
      priority: json['priority'],
      plusOne: json['plusOne'],
      dietaryRestrictions: json['dietaryRestrictions'],
      rsvpDeadline: json['rsvpDeadline'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
    );
  }
}

