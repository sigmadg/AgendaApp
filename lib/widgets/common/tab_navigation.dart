import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class TabNavigation extends StatelessWidget {
  final String activeTab;
  final Function(String) onTabChange;

  const TabNavigation({
    super.key,
    required this.activeTab,
    required this.onTabChange,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: _buildTab(
              'tasks',
              Icons.check_circle_outline,
              'Tareas',
            ),
          ),
          Expanded(
            child: _buildTab(
              'events',
              Icons.calendar_today,
              'Eventos',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTab(String tabId, IconData icon, String label) {
    final isActive = activeTab == tabId;
    return GestureDetector(
      onTap: () => onTabChange(tabId),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
        decoration: BoxDecoration(
          color: isActive ? AppTheme.orangeAccent : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 20,
              color: isActive ? AppTheme.white : AppTheme.white,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: isActive ? AppTheme.white : AppTheme.white,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

