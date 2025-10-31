import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/menstrual/period_entry.dart';
import '../../models/menstrual/cycle_reminder.dart';
import '../../theme/app_theme.dart';

class MenstrualSections extends StatefulWidget {
  const MenstrualSections({super.key});

  @override
  State<MenstrualSections> createState() => _MenstrualSectionsState();
}

class _MenstrualSectionsState extends State<MenstrualSections> {
  String _activeSection = 'period-log';
  
  List<PeriodEntry> _periodEntries = [];
  List<CycleReminder> _reminders = [];
  Map<String, int> _cycleLengths = {};
  bool _showPeriodModal = false;
  DateTime _selectedDate = DateTime.now();
  String _selectedFlow = '';
  List<String> _selectedSymptoms = [];
  String _selectedMood = 'okay';
  int _selectedPainLevel = 0;
  String _notes = '';

  final sections = [
    {'id': 'period-log', 'name': 'Registro de Período', 'icon': Icons.calendar_today},
    {'id': 'period-tracker', 'name': 'Seguimiento de Período', 'icon': Icons.list},
    {'id': 'cycle-duration', 'name': 'Duración del Ciclo', 'icon': Icons.timer},
    {'id': 'cycle-reminder', 'name': 'Recordatorio de Ciclo', 'icon': Icons.alarm},
    {'id': 'flow-monitor', 'name': 'Monitor de Flujo', 'icon': Icons.bar_chart},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBackground,
      body: Column(
        children: [
          _buildSectionTabs(),
          Expanded(
            child: _buildActiveSection(),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTabs() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: sections.map((section) {
            final isActive = _activeSection == section['id'];
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: GestureDetector(
                onTap: () => setState(() => _activeSection = section['id'] as String),
                child: Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: isActive ? Colors.pink.shade300 : AppTheme.darkSurface,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    section['icon'] as IconData,
                    color: isActive ? AppTheme.white : AppTheme.white60,
                    size: 20,
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildActiveSection() {
    switch (_activeSection) {
      case 'period-log':
        return _buildPeriodLog();
      case 'period-tracker':
        return _buildPeriodTracker();
      case 'cycle-duration':
        return _buildCycleDuration();
      case 'cycle-reminder':
        return _buildCycleReminder();
      case 'flow-monitor':
        return _buildFlowMonitor();
      default:
        return _buildPeriodLog();
    }
  }

  Widget _buildPeriodLog() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'REGISTRO DE PERÍODO',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add, color: AppTheme.white),
                onPressed: () => setState(() => _showPeriodModal = true),
              ),
            ],
          ),
        ),
        Expanded(
          child: _periodEntries.isEmpty
              ? _buildEmptyState('No hay registros de período', Icons.calendar_today)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _periodEntries.length,
                  itemBuilder: (context, index) => _buildPeriodEntryCard(_periodEntries[index]),
                ),
        ),
      ],
    );
  }

  Widget _buildPeriodTracker() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.list, size: 64, color: AppTheme.white40),
          const SizedBox(height: 16),
          const Text(
            'Seguimiento de Período',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Funcionalidad en desarrollo',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.white60,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCycleDuration() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: const Text(
            'DURACIÓN DEL CICLO',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
        ),
        Expanded(
          child: _cycleLengths.isEmpty
              ? _buildEmptyState('No hay datos de ciclo', Icons.timer)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _cycleLengths.length,
                  itemBuilder: (context, index) {
                    final entry = _cycleLengths.entries.elementAt(index);
                    return _buildCycleDurationCard(entry.key, entry.value);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildCycleReminder() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'RECORDATORIOS DE CICLO',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add, color: AppTheme.white),
                onPressed: () {},
              ),
            ],
          ),
        ),
        Expanded(
          child: _reminders.isEmpty
              ? _buildEmptyState('No hay recordatorios', Icons.alarm)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _reminders.length,
                  itemBuilder: (context, index) => _buildReminderCard(_reminders[index]),
                ),
        ),
      ],
    );
  }

  Widget _buildFlowMonitor() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.analytics, size: 64, color: AppTheme.white40),
          const SizedBox(height: 16),
          const Text(
            'Monitor de Flujo',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Funcionalidad en desarrollo',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.white60,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(String message, IconData icon) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 64, color: AppTheme.white40),
          const SizedBox(height: 16),
          Text(
            message,
            style: const TextStyle(
              fontSize: 16,
              color: AppTheme.white60,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPeriodEntryCard(PeriodEntry entry) {
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  entry.date,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getFlowColor(entry.flow),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getFlowLabel(entry.flow),
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (entry.symptoms.isNotEmpty) ...[
              Wrap(
                spacing: 8,
                children: entry.symptoms.map((symptom) {
                  return Chip(
                    label: Text(symptom),
                    backgroundColor: AppTheme.darkSurfaceVariant,
                    labelStyle: const TextStyle(fontSize: 12, color: AppTheme.white),
                  );
                }).toList(),
              ),
              const SizedBox(height: 12),
            ],
            Row(
              children: [
                Icon(_getMoodIcon(entry.mood), size: 16, color: _getMoodColor(entry.mood)),
                const SizedBox(width: 8),
                Text(
                  _getMoodLabel(entry.mood),
                  style: const TextStyle(fontSize: 14, color: AppTheme.white70),
                ),
                const SizedBox(width: 16),
                const Icon(Icons.water_drop, size: 16, color: Colors.pink),
                const SizedBox(width: 4),
                Text(
                  '${entry.painLevel}/10',
                  style: const TextStyle(fontSize: 14, color: AppTheme.white70),
                ),
              ],
            ),
            if (entry.notes != null && entry.notes!.isNotEmpty) ...[
              const SizedBox(height: 12),
              Text(
                entry.notes!,
                style: const TextStyle(fontSize: 14, color: AppTheme.white70),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildCycleDurationCard(String month, int days) {
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              month,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppTheme.white,
              ),
            ),
            Text(
              '$days días',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppTheme.orangeAccent,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReminderCard(CycleReminder reminder) {
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    reminder.title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: reminder.isActive ? Colors.green : Colors.red,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    reminder.isActive ? 'Activo' : 'Inactivo',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              reminder.description,
              style: const TextStyle(fontSize: 14, color: AppTheme.white70),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16, color: AppTheme.white60),
                const SizedBox(width: 4),
                Text(
                  '${reminder.date} ${reminder.time}',
                  style: const TextStyle(fontSize: 12, color: AppTheme.white60),
                ),
                const SizedBox(width: 16),
                const Icon(Icons.repeat, size: 16, color: AppTheme.white60),
                const SizedBox(width: 4),
                Text(
                  reminder.repeat,
                  style: const TextStyle(fontSize: 12, color: AppTheme.white60),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _getFlowColor(String flow) {
    switch (flow) {
      case 'light':
        return Colors.pink.shade100;
      case 'regular':
        return Colors.pink.shade300;
      case 'heavy':
        return Colors.pink.shade500;
      default:
        return Colors.grey;
    }
  }

  String _getFlowLabel(String flow) {
    switch (flow) {
      case 'light':
        return 'Ligero';
      case 'regular':
        return 'Regular';
      case 'heavy':
        return 'Pesado';
      default:
        return 'N/A';
    }
  }

  IconData _getMoodIcon(String mood) {
    switch (mood) {
      case 'good':
        return Icons.sentiment_very_satisfied;
      case 'okay':
        return Icons.sentiment_neutral;
      case 'tired':
        return Icons.bedtime;
      case 'sad':
        return Icons.sentiment_very_dissatisfied;
      default:
        return Icons.help_outline;
    }
  }

  Color _getMoodColor(String mood) {
    switch (mood) {
      case 'good':
        return Colors.green;
      case 'okay':
        return Colors.orange;
      case 'tired':
        return Colors.purple;
      case 'sad':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _getMoodLabel(String mood) {
    switch (mood) {
      case 'good':
        return 'Bien';
      case 'okay':
        return 'Regular';
      case 'tired':
        return 'Cansada';
      case 'sad':
        return 'Triste';
      default:
        return 'N/A';
    }
  }
}

