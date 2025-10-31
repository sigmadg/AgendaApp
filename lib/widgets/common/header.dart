import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class Header extends StatelessWidget {
  final VoidCallback? onOpenSidebar;
  final String? selectedCategory;
  final String userName;

  const Header({
    super.key,
    this.onOpenSidebar,
    this.selectedCategory,
    this.userName = 'Usuario',
  });

  String _getCurrentGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) {
      return 'Buenos días';
    } else if (hour < 18) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  }

  String _getCategoryName(String? category) {
    const categoryNames = {
      'personal': 'Mi Perfil',
      'work': 'Trabajo',
      'school': 'Escuela',
      'nutrition': 'Alimentación',
      'exercise': 'Ejercicio',
      'languages': 'Idiomas',
      'menstrual': 'Calendario Menstrual',
      'finance': 'Finanzas',
      'health': 'Salud',
    };
    return categoryNames[category] ?? 'Personal';
  }

  IconData _getCategoryIcon(String? category) {
    final categoryIcons = <String, IconData>{
      'personal': Icons.person_outline,
      'work': Icons.work_outline,
      'school': Icons.school,
      'nutrition': Icons.restaurant,
      'exercise': Icons.fitness_center,
      'languages': Icons.language,
      'menstrual': Icons.eco_outlined,
      'finance': Icons.account_balance_wallet_outlined,
      'health': Icons.health_and_safety_outlined,
    };
    return categoryIcons[category] ?? Icons.person_outline;
  }

  Color _getCategoryColor(String? category) {
    final categoryColors = <String, Color>{
      'personal': AppTheme.orangeAccent,
      'work': Colors.blue,
      'school': Colors.purple,
      'nutrition': Colors.green,
      'exercise': Colors.red,
      'languages': Colors.teal,
      'menstrual': Colors.pink,
      'finance': Colors.amber,
      'health': Colors.cyan,
    };
    return categoryColors[category] ?? AppTheme.orangeAccent;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        border: Border(
          bottom: BorderSide(color: AppTheme.darkSurfaceVariant, width: 1),
        ),
      ),
      child: Column(
        children: [
          // Top Section
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _getCurrentGreeting(),
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.white60,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      userName,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
              ),
              if (onOpenSidebar != null)
                IconButton(
                  icon: const Icon(Icons.menu, color: AppTheme.white),
                  onPressed: onOpenSidebar,
                ),
            ],
          ),
          // Category Section
          if (selectedCategory != null) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _getCategoryColor(selectedCategory).withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: _getCategoryColor(selectedCategory).withOpacity(0.3),
                  width: 1,
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: _getCategoryColor(selectedCategory),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      _getCategoryIcon(selectedCategory),
                      size: 18,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Categoría activa',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppTheme.white60,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          _getCategoryName(selectedCategory),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppTheme.darkSurfaceVariant,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.star, size: 14, color: AppTheme.orangeAccent),
                        SizedBox(width: 4),
                        Text(
                          '¡Bienvenido a tu agenda!',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppTheme.white70,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}

