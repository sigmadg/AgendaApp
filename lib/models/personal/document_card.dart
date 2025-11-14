import 'package:flutter/material.dart';

class DocumentCard {
  final String id;
  final String type; // 'id', 'passport', 'license', 'insurance', 'other'
  final String name;
  final String number;
  final String? issuer; // Emisor (ej: "DNI", "Secretaría de Tránsito")
  final DateTime? issueDate;
  final DateTime? expiryDate;
  final String? notes;

  DocumentCard({
    required this.id,
    required this.type,
    required this.name,
    required this.number,
    this.issuer,
    this.issueDate,
    this.expiryDate,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'name': name,
      'number': number,
      'issuer': issuer,
      'issue_date': issueDate?.toIso8601String(),
      'expiry_date': expiryDate?.toIso8601String(),
      'notes': notes,
    };
  }

  factory DocumentCard.fromJson(Map<String, dynamic> json) {
    return DocumentCard(
      id: json['id'] ?? '',
      type: json['type'] ?? 'other',
      name: json['name'] ?? '',
      number: json['number'] ?? '',
      issuer: json['issuer'],
      issueDate: json['issue_date'] != null 
          ? DateTime.tryParse(json['issue_date']) 
          : null,
      expiryDate: json['expiry_date'] != null 
          ? DateTime.tryParse(json['expiry_date']) 
          : null,
      notes: json['notes'],
    );
  }

  String get typeLabel {
    switch (type) {
      case 'id':
        return 'Identificación';
      case 'passport':
        return 'Pasaporte';
      case 'license':
        return 'Licencia de Conducir';
      case 'insurance':
        return 'Seguro';
      case 'other':
        return 'Otro';
      default:
        return 'Documento';
    }
  }

  IconData get typeIcon {
    switch (type) {
      case 'id':
        return Icons.badge;
      case 'passport':
        return Icons.airplane_ticket;
      case 'license':
        return Icons.drive_eta;
      case 'insurance':
        return Icons.health_and_safety;
      case 'other':
        return Icons.description;
      default:
        return Icons.credit_card;
    }
  }
}

