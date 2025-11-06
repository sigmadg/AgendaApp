import 'package:flutter/material.dart';

class AppShadows {
  static BoxShadow small(Color color) => BoxShadow(
    color: color.withOpacity(0.2),
    blurRadius: 8,
    offset: const Offset(0, 2),
  );

  static BoxShadow medium(Color color) => BoxShadow(
    color: color.withOpacity(0.3),
    blurRadius: 12,
    offset: const Offset(0, 4),
  );

  static BoxShadow large(Color color) => BoxShadow(
    color: color.withOpacity(0.4),
    blurRadius: 16,
    offset: const Offset(0, 6),
  );

  static List<BoxShadow> card(Color color) => [
    BoxShadow(
      color: color.withOpacity(0.2),
      blurRadius: 10,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> elevated(Color color) => [
    BoxShadow(
      color: color.withOpacity(0.3),
      blurRadius: 12,
      offset: const Offset(0, 4),
    ),
  ];
}

