import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

// Constantes de colores profesionales
class WorkColors {
  static const Color professionalPrimary = Color(0xFF1E3A8A); // Navy Blue
  static const Color professionalSecondary = Color(0xFF2563EB); // Professional Blue
  static const Color professionalAccent = Color(0xFF3B82F6); // Bright Blue
  static const Color professionalTeal = Color(0xFF0891B2); // Professional Teal
  static const Color professionalSlate = Color(0xFF475569); // Professional Slate
  static const Color professionalIndigo = Color(0xFF4338CA); // Deep Indigo
}

// Funciones helper para prioridad
class WorkHelpers {
  static Color getPriorityColor(String priority, Color defaultColor) {
    switch (priority) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.orange;
      case 'low':
        return Colors.green;
      default:
        return defaultColor;
    }
  }

  static IconData getPriorityIcon(String priority) {
    switch (priority) {
      case 'high':
        return Icons.priority_high;
      case 'medium':
        return Icons.flag;
      case 'low':
        return Icons.arrow_downward;
      default:
        return Icons.flag;
    }
  }

  static String getPriorityLabel(String priority) {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return 'Media';
    }
  }

  static String getMeetingTypeLabel(String? type) {
    switch (type) {
      case 'meeting':
        return 'Junta';
      case 'session':
        return 'Sesión';
      case 'appointment':
        return 'Cita';
      default:
        return 'Evento';
    }
  }

  static IconData getMeetingTypeIcon(String? type) {
    switch (type) {
      case 'meeting':
        return Icons.groups;
      case 'session':
        return Icons.psychology;
      case 'appointment':
        return Icons.event;
      default:
        return Icons.event;
    }
  }
}

// Widget común para tarjetas de resumen
class WorkSummaryCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;
  final List<Color>? gradientColors;
  final String? subtitle;

  const WorkSummaryCard({
    super.key,
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
    this.gradientColors,
    this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    final colors = gradientColors ?? [color, color];
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            colors[0].withOpacity(0.15),
            colors.length > 1 ? colors[1].withOpacity(0.1) : colors[0].withOpacity(0.05),
            AppTheme.darkSurface,
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.2),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: colors.map((c) => c.withOpacity(0.3)).toList(),
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: color.withOpacity(0.4),
                width: 1,
              ),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.white,
            ),
          ),
          if (subtitle != null) ...[
            const SizedBox(height: 4),
            Text(
              subtitle!,
              style: TextStyle(
                fontSize: 10,
                color: color.withOpacity(0.7),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

// Widget común para estados vacíos
class WorkEmptyState extends StatelessWidget {
  final String message;
  final IconData icon;
  final String? subtitle;
  final String? buttonText;
  final VoidCallback? onButtonPressed;
  final Color? buttonColor;
  final List<Color>? gradientColors;

  const WorkEmptyState({
    super.key,
    required this.message,
    required this.icon,
    this.subtitle,
    this.buttonText,
    this.onButtonPressed,
    this.buttonColor,
    this.gradientColors,
  });

  @override
  Widget build(BuildContext context) {
    final colors = gradientColors ?? [buttonColor ?? WorkColors.professionalAccent, buttonColor ?? WorkColors.professionalAccent];
    
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: colors.map((c) => c.withOpacity(0.2)).toList(),
              ),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 64, color: colors[0].withOpacity(0.6)),
          ),
          const SizedBox(height: 24),
          Text(
            message,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
          if (subtitle != null) ...[
            const SizedBox(height: 8),
            Text(
              subtitle!,
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.white,
              ),
              textAlign: TextAlign.center,
            ),
          ],
          if (buttonText != null && onButtonPressed != null) ...[
            const SizedBox(height: 32),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: colors,
                ),
                borderRadius: BorderRadius.circular(28),
                boxShadow: [
                  BoxShadow(
                    color: colors[0].withOpacity(0.4),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                onPressed: onButtonPressed,
                icon: const Icon(Icons.add, color: AppTheme.white),
                label: Text(
                  buttonText!,
                  style: const TextStyle(
                    color: AppTheme.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(28),
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

