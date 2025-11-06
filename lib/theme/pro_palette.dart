import 'package:flutter/material.dart';

@immutable
class ProPalette extends ThemeExtension<ProPalette> {
  final Color primary;
  final Color secondary;
  final Color accent;
  final Color indigo;
  final Color teal;
  final Color slate;

  const ProPalette({
    required this.primary,
    required this.secondary,
    required this.accent,
    required this.indigo,
    required this.teal,
    required this.slate,
  });

  @override
  ProPalette copyWith({
    Color? primary,
    Color? secondary,
    Color? accent,
    Color? indigo,
    Color? teal,
    Color? slate,
  }) {
    return ProPalette(
      primary: primary ?? this.primary,
      secondary: secondary ?? this.secondary,
      accent: accent ?? this.accent,
      indigo: indigo ?? this.indigo,
      teal: teal ?? this.teal,
      slate: slate ?? this.slate,
    );
  }

  @override
  ProPalette lerp(ThemeExtension<ProPalette>? other, double t) {
    if (other is! ProPalette) return this;
    return ProPalette(
      primary: Color.lerp(primary, other.primary, t)!,
      secondary: Color.lerp(secondary, other.secondary, t)!,
      accent: Color.lerp(accent, other.accent, t)!,
      indigo: Color.lerp(indigo, other.indigo, t)!,
      teal: Color.lerp(teal, other.teal, t)!,
      slate: Color.lerp(slate, other.slate, t)!,
    );
  }

  // Factory para crear la paleta profesional de trabajo
  static const ProPalette work = ProPalette(
    primary: Color(0xFF1E3A8A), // Navy Blue - _professionalPrimary
    secondary: Color(0xFF2563EB), // Professional Blue - _professionalSecondary
    accent: Color(0xFF3B82F6), // Bright Blue - _professionalAccent
    indigo: Color(0xFF4338CA), // Deep Indigo - _professionalIndigo
    teal: Color(0xFF0891B2), // Professional Teal - _professionalTeal
    slate: Color(0xFF475569), // Professional Slate - _professionalSlate
  );
}

