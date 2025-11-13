import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../models/selfcare/wellness_schedule.dart';
import '../../models/selfcare/journal_entry.dart';
import '../../models/selfcare/selfcare_plan.dart';
import '../../models/selfcare/habit.dart';
import '../../auth/providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/common/navigation_header.dart';

class SelfCareSections extends StatefulWidget {
  const SelfCareSections({super.key});

  @override
  State<SelfCareSections> createState() => _SelfCareSectionsState();
}

class _SelfCareSectionsState extends State<SelfCareSections> {
  String _activeSection = 'checklist';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  
  List<WellnessSchedule> _wellnessSchedules = [];
  List<JournalEntry> _journalEntries = [];
  List<SelfCarePlan> _selfCarePlans = [];
  List<Habit> _habits = [];
  
  // Checklist items
  Map<String, List<Map<String, dynamic>>> _checklistItems = {
    'morning': [],
    'afternoon': [],
    'evening': [],
    'anytime': [],
  };

  final sections = [
    {'id': 'checklist', 'name': 'Checklist', 'icon': Icons.checklist},
    {'id': 'wellness', 'name': 'Programador', 'icon': Icons.schedule},
    {'id': 'journal', 'name': 'Diario', 'icon': Icons.book},
    {'id': 'planner', 'name': 'Planificador', 'icon': Icons.calendar_view_week},
    {'id': 'habits', 'name': 'Hábitos', 'icon': Icons.repeat},
    {'id': 'mood', 'name': 'Estado de Ánimo', 'icon': Icons.mood},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppTheme.darkBackground,
      drawer: _buildNavigationDrawer(context),
      appBar: NavigationHeader(currentSection: 'selfcare'),
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

  Widget _buildNavigationDrawer(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;
    
    return Drawer(
      backgroundColor: AppTheme.darkSurface,
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          // Header del Drawer
          DrawerHeader(
            decoration: BoxDecoration(
              color: AppTheme.darkBackground,
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppTheme.orangeAccent.withOpacity(0.3),
                  AppTheme.darkBackground,
                ],
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: AppTheme.orangeAccent,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: const Icon(
                    Icons.person,
                    size: 30,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  user?.name ?? 'Usuario',
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  user?.email ?? 'usuario@ejemplo.com',
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white,
                  ),
                ),
              ],
            ),
          ),
          // Secciones principales
          _buildDrawerItem(
            context,
            icon: Icons.person_outline,
            title: 'Personal',
            color: AppTheme.orangeAccent,
            onTap: () {
              Navigator.pop(context);
              context.go('/main?section=profile');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.work_outline,
            title: 'Trabajo',
            color: Colors.blue,
            onTap: () {
              Navigator.pop(context);
              context.go('/work');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.school,
            title: 'Escuela',
            color: Colors.purple,
            onTap: () {
              Navigator.pop(context);
              context.go('/school');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.health_and_safety_outlined,
            title: 'Salud',
            color: Colors.green,
            onTap: () {
              Navigator.pop(context);
              context.go('/health');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.account_balance_wallet_outlined,
            title: 'Finanzas',
            color: Colors.amber,
            onTap: () {
              Navigator.pop(context);
              context.go('/finance');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.language,
            title: 'Idiomas',
            color: Colors.teal,
            onTap: () {
              Navigator.pop(context);
              context.go('/language');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.eco_outlined,
            title: 'Menstrual',
            color: Colors.pink,
            onTap: () {
              Navigator.pop(context);
              context.go('/menstrual');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.pets,
            title: 'Mascotas',
            color: Colors.brown,
            onTap: () {
              Navigator.pop(context);
              context.go('/pet');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.book,
            title: 'Lectura',
            color: Colors.indigo,
            onTap: () {
              Navigator.pop(context);
              context.go('/reading');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.movie,
            title: 'Películas',
            color: Colors.deepPurple,
            onTap: () {
              Navigator.pop(context);
              context.go('/movies');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.business,
            title: 'Emprendimientos',
            color: Colors.deepPurple,
            onTap: () {
              Navigator.pop(context);
              context.go('/entrepreneurship');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.favorite_outline,
            title: 'Cuidado Personal',
            color: Colors.pinkAccent,
            isActive: true,
            onTap: () {
              Navigator.pop(context);
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.flight,
            title: 'Viajes',
            color: Colors.cyan,
            onTap: () {
              Navigator.pop(context);
              context.go('/travel');
            },
          ),
          const Divider(color: AppTheme.darkSurfaceVariant, height: 32),
          _buildDrawerItem(
            context,
            icon: Icons.logout,
            title: 'Cerrar Sesión',
            color: Colors.red,
            onTap: () {
              Navigator.pop(context);
              authProvider.signOut();
              context.go('/login');
            },
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required Color color,
    required VoidCallback onTap,
    bool isActive = false,
  }) {
    return ListTile(
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: isActive ? color : color.withOpacity(0.2),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(
          icon,
          color: isActive ? AppTheme.white : color,
          size: 22,
        ),
      ),
      title: Text(
        title,
        style: TextStyle(
          fontSize: 16,
          fontWeight: isActive ? FontWeight.w600 : FontWeight.w500,
          color: AppTheme.white,
        ),
      ),
      onTap: onTap,
      hoverColor: AppTheme.darkSurfaceVariant,
    );
  }

  Widget _buildSectionTabs() {
    return Container(
      height: 50,
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
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
                  width: 80,
                  height: 42,
                  decoration: BoxDecoration(
                    color: isActive 
                        ? AppTheme.orangeAccent.withOpacity(0.2)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isActive 
                          ? AppTheme.orangeAccent 
                          : AppTheme.darkSurfaceVariant,
                      width: isActive ? 2 : 1,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        section['icon'] as IconData,
                        color: isActive 
                            ? AppTheme.orangeAccent 
                            : AppTheme.white,
                        size: 20,
                      ),
                      const SizedBox(height: 2),
                      Flexible(
                        child: Text(
                          section['name'] as String,
                          style: TextStyle(
                            fontSize: 10,
                            color: isActive 
                                ? AppTheme.orangeAccent 
                                : AppTheme.white,
                            fontWeight: isActive 
                                ? FontWeight.w600 
                                : FontWeight.w400,
                          ),
                          textAlign: TextAlign.center,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
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
      case 'checklist':
        return _buildChecklist();
      case 'wellness':
        return _buildWellnessScheduler();
      case 'journal':
        return _buildJournal();
      case 'planner':
        return _buildPlanner();
      case 'habits':
        return _buildHabits();
      case 'mood':
        return _buildMoodTracker();
      default:
        return _buildChecklist();
    }
  }

  Widget _buildChecklist() {
    final allItems = [
      ..._checklistItems['morning']!,
      ..._checklistItems['afternoon']!,
      ..._checklistItems['evening']!,
      ..._checklistItems['anytime']!,
    ];
    
    final dayStats = _getDayStats();
    final morningStats = _getPeriodStats('morning');
    final afternoonStats = _getPeriodStats('afternoon');
    final eveningStats = _getPeriodStats('evening');
    final anytimeStats = _getPeriodStats('anytime');
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.pinkAccent.withOpacity(0.3), Colors.pinkAccent.withOpacity(0.1)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: Colors.pinkAccent.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(25),
                  ),
                  child: const Icon(Icons.check_circle, color: Colors.pinkAccent, size: 24),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Lista de Cuidado Personal', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.white)),
                      const SizedBox(height: 5),
                      Text('Tu rutina diaria de bienestar', style: TextStyle(fontSize: 14, color: AppTheme.white)),
                    ],
                  ),
                ),
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text('${dayStats['percentage']}%', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.white)),
                    const Text('Completado', style: TextStyle(fontSize: 12, color: AppTheme.white)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Panel de estadísticas del día
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(_getProgressEmoji(dayStats['percentage'] as int), style: const TextStyle(fontSize: 24)),
                    const SizedBox(width: 8),
                    const Text('Progreso del Día', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.white)),
                  ],
                ),
                const SizedBox(height: 8),
                Text('${dayStats['completed']} de ${dayStats['total']} actividades completadas', style: const TextStyle(fontSize: 14, color: AppTheme.white)),
                const SizedBox(height: 16),
                Stack(
                  children: [
                    Container(
                      height: 12,
                      decoration: BoxDecoration(
                        color: AppTheme.darkSurfaceVariant,
                        borderRadius: BorderRadius.circular(6),
                      ),
                    ),
                    FractionallySizedBox(
                      widthFactor: (dayStats['percentage'] as int) / 100,
                      child: Container(
                        height: 12,
                        decoration: BoxDecoration(
                          color: _getProgressColor(dayStats['percentage'] as int),
                          borderRadius: BorderRadius.circular(6),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  _getMotivationalMessage(dayStats['percentage'] as int),
                  style: const TextStyle(fontSize: 14, color: AppTheme.white, fontStyle: FontStyle.italic),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Estadísticas por período
          Row(
            children: [
              Expanded(child: _buildPeriodStatCard('Mañana', morningStats, Icons.wb_sunny, Colors.orange)),
              const SizedBox(width: 10),
              Expanded(child: _buildPeriodStatCard('Tarde', afternoonStats, Icons.wb_twilight, Colors.amber)),
              const SizedBox(width: 10),
              Expanded(child: _buildPeriodStatCard('Noche', eveningStats, Icons.nightlight, Colors.purple)),
              const SizedBox(width: 10),
              Expanded(child: _buildPeriodStatCard('Flexible', anytimeStats, Icons.access_time, Colors.blue)),
            ],
          ),
          const SizedBox(height: 20),
          // Actividades por período
          _buildChecklistPeriod('Mañana', 'morning', Icons.wb_sunny, Colors.orange),
          const SizedBox(height: 16),
          _buildChecklistPeriod('Tarde', 'afternoon', Icons.wb_twilight, Colors.amber),
          const SizedBox(height: 16),
          _buildChecklistPeriod('Noche', 'evening', Icons.nightlight, Colors.purple),
          const SizedBox(height: 16),
          _buildChecklistPeriod('Cualquier Momento', 'anytime', Icons.access_time, Colors.blue),
          const SizedBox(height: 20),
          // Botones de acción
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildActionButton(Icons.refresh, 'Reiniciar Día', Colors.blue, () {}),
              _buildActionButton(Icons.share, 'Compartir', Colors.green, () {}),
              _buildActionButton(Icons.analytics, 'Estadísticas', Colors.orange, () {}),
            ],
          ),
        ],
      ),
    );
  }
  
  Map<String, dynamic> _getDayStats() {
    final allItems = [
      ..._checklistItems['morning']!,
      ..._checklistItems['afternoon']!,
      ..._checklistItems['evening']!,
      ..._checklistItems['anytime']!,
    ];
    final completed = allItems.where((item) => item['completed'] == true).length;
    final total = allItems.length;
    final percentage = total > 0 ? ((completed / total) * 100).round() : 0;
    return {'completed': completed, 'total': total, 'percentage': percentage};
  }
  
  Map<String, dynamic> _getPeriodStats(String period) {
    final items = _checklistItems[period]!;
    final completed = items.where((item) => item['completed'] == true).length;
    final total = items.length;
    final percentage = total > 0 ? ((completed / total) * 100).round() : 0;
    return {'completed': completed, 'total': total, 'percentage': percentage};
  }
  
  Color _getProgressColor(int percentage) {
    if (percentage >= 80) return Colors.green;
    if (percentage >= 60) return Colors.orange;
    if (percentage >= 40) return Colors.amber;
    return Colors.red;
  }
  
  String _getProgressEmoji(int percentage) {
    if (percentage >= 80) return '🌟';
    if (percentage >= 60) return '😊';
    if (percentage >= 40) return '😐';
    return '😔';
  }
  
  String _getMotivationalMessage(int percentage) {
    if (percentage >= 80) return '¡Excelente! Estás cuidándote muy bien';
    if (percentage >= 60) return '¡Muy bien! Sigue así';
    if (percentage >= 40) return 'Vas por buen camino, ¡no te rindas!';
    return 'Cada pequeño paso cuenta, ¡tú puedes!';
  }
  
  Widget _buildPeriodStatCard(String title, Map<String, dynamic> stats, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text('${stats['completed']}/${stats['total']}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.white)),
          const SizedBox(height: 4),
          Text(title, style: TextStyle(fontSize: 10, color: AppTheme.white)),
          const SizedBox(height: 8),
          Stack(
            children: [
              Container(
                height: 4,
                decoration: BoxDecoration(
                  color: AppTheme.darkSurfaceVariant,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              FractionallySizedBox(
                widthFactor: (stats['percentage'] as int) / 100,
                child: Container(
                  height: 4,
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
  
  Widget _buildChecklistPeriod(String title, String period, IconData icon, Color color) {
    final stats = _getPeriodStats(period);
    final items = _checklistItems[period]!;
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.white)),
                    Text('${stats['completed']} de ${stats['total']} completadas', style: const TextStyle(fontSize: 12, color: AppTheme.white)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text('${stats['percentage']}%', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: color)),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (items.isEmpty)
            Center(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Text('No hay actividades en este período', style: TextStyle(fontSize: 14, color: AppTheme.white)),
              ),
            )
          else
            ...items.asMap().entries.map((entry) {
              final index = entry.key;
              final item = entry.value;
              return _buildChecklistItem(period, item, index);
            }).toList(),
        ],
      ),
    );
  }
  
  Widget _buildChecklistItem(String period, Map<String, dynamic> item, int index) {
    final isCompleted = item['completed'] == true;
    return GestureDetector(
      onTap: () {
        setState(() {
          final items = _checklistItems[period]!;
          final itemIndex = items.indexWhere((i) => i['id'] == item['id']);
          if (itemIndex != -1) {
            items[itemIndex]['completed'] = !isCompleted;
            _checklistItems[period] = List.from(items);
          }
        });
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isCompleted ? AppTheme.darkSurfaceVariant : AppTheme.darkSurface,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isCompleted ? Colors.green.withOpacity(0.3) : AppTheme.darkSurfaceVariant,
            width: 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: isCompleted ? Colors.green : Colors.transparent,
                border: Border.all(
                  color: isCompleted ? Colors.green : AppTheme.white,
                  width: 2,
                ),
                borderRadius: BorderRadius.circular(6),
              ),
              child: isCompleted ? const Icon(Icons.check, size: 16, color: AppTheme.white) : null,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                item['text'] ?? '',
                style: TextStyle(
                  fontSize: 14,
                  color: isCompleted ? AppTheme.white : AppTheme.white,
                  decoration: isCompleted ? TextDecoration.lineThrough : null,
                ),
              ),
            ),
            const SizedBox(width: 12),
            Text(
              '${(index + 1).toString().padLeft(2, '0')}',
              style: TextStyle(fontSize: 12, color: AppTheme.white),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildActionButton(IconData icon, String label, Color color, VoidCallback onTap) {
    return ElevatedButton.icon(
      onPressed: onTap,
      icon: Icon(icon, size: 16),
      label: Text(label),
      style: ElevatedButton.styleFrom(
        backgroundColor: color.withOpacity(0.2),
        foregroundColor: color,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      ),
    );
  }

  Widget _buildWellnessScheduler() {
    final overallStats = _getWellnessStats();
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.pinkAccent.withOpacity(0.3), Colors.pinkAccent.withOpacity(0.1)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(color: Colors.pinkAccent.withOpacity(0.2), borderRadius: BorderRadius.circular(25)),
                  child: const Icon(Icons.calendar_today, color: Colors.pinkAccent, size: 24),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Programador de Bienestar Personal', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white)),
                      const SizedBox(height: 5),
                      Text('Organiza tu rutina de bienestar diaria', style: TextStyle(fontSize: 14, color: AppTheme.white)),
                    ],
                  ),
                ),
                IconButton(
                  icon: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(color: Colors.pinkAccent.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                    child: const Icon(Icons.add, color: Colors.pinkAccent, size: 20),
                  ),
                  onPressed: () {},
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Panel de estadísticas
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(16)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(_getProgressEmoji(overallStats['percentage'] as int), style: const TextStyle(fontSize: 24)),
                    const SizedBox(width: 8),
                    const Text('Tu Bienestar Hoy', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.white)),
                  ],
                ),
                const SizedBox(height: 8),
                Text('${overallStats['completed']} de ${overallStats['total']} actividades completadas', style: const TextStyle(fontSize: 14, color: AppTheme.white)),
                const SizedBox(height: 16),
                Stack(
                  children: [
                    Container(
                      height: 12,
                      decoration: BoxDecoration(color: AppTheme.darkSurfaceVariant, borderRadius: BorderRadius.circular(6)),
                    ),
                    FractionallySizedBox(
                      widthFactor: (overallStats['percentage'] as int) / 100,
                      child: Container(
                        height: 12,
                        decoration: BoxDecoration(color: _getProgressColor(overallStats['percentage'] as int), borderRadius: BorderRadius.circular(6)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(_getMotivationalMessage(overallStats['percentage'] as int), style: const TextStyle(fontSize: 14, color: AppTheme.white, fontStyle: FontStyle.italic)),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Estadísticas detalladas
          Row(
            children: [
              Expanded(child: _buildStatCard(Icons.list, overallStats['totalRoutines'].toString(), 'Rutinas', Colors.blue)),
              const SizedBox(width: 10),
              Expanded(child: _buildStatCard(Icons.check_circle, overallStats['completed'].toString(), 'Completadas', Colors.green)),
              const SizedBox(width: 10),
              Expanded(child: _buildStatCard(Icons.local_fire_department, overallStats['streak'].toString(), 'Racha', Colors.orange)),
              const SizedBox(width: 10),
              Expanded(child: _buildStatCard(Icons.trending_up, overallStats['total'].toString(), 'Actividades', Colors.purple)),
            ],
          ),
          const SizedBox(height: 20),
          // Lista de rutinas
          if (_wellnessSchedules.isEmpty)
            _buildWellnessEmptyState()
          else
            ..._wellnessSchedules.map((schedule) => Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: _buildDetailedWellnessCard(schedule),
                )),
          const SizedBox(height: 20),
          // Botones de acción
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildActionButton(Icons.add_circle, 'Nueva Rutina', Colors.blue, () {}),
              _buildActionButton(Icons.analytics, 'Estadísticas', Colors.green, () {}),
              _buildActionButton(Icons.settings, 'Configurar', Colors.orange, () {}),
            ],
          ),
        ],
      ),
    );
  }
  
  Map<String, dynamic> _getWellnessStats() {
    final totalRoutines = _wellnessSchedules.length;
    final total = _wellnessSchedules.length;
    final completed = _wellnessSchedules.where((s) => s.completed).length;
    final streak = 0; // No hay campo streak en el modelo
    final percentage = total > 0 ? ((completed / total) * 100).round() : 0;
    return {'totalRoutines': totalRoutines, 'total': total, 'completed': completed, 'streak': streak, 'percentage': percentage};
  }
  
  Widget _buildStatCard(IconData icon, String value, String label, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(12)),
      child: Column(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.white)),
          const SizedBox(height: 4),
          Text(label, style: TextStyle(fontSize: 10, color: AppTheme.white)),
        ],
      ),
    );
  }
  
  Widget _buildDetailedWellnessCard(WellnessSchedule schedule) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(color: Colors.pinkAccent.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                child: const Icon(Icons.favorite, color: Colors.pinkAccent, size: 24),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(schedule.activity, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.white)),
                    Text('${schedule.time} • ${schedule.frequency}', style: const TextStyle(fontSize: 12, color: AppTheme.white)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: schedule.completed ? Colors.green.withOpacity(0.2) : Colors.grey.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  schedule.completed ? 'Completado' : 'Pendiente',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: schedule.completed ? Colors.green : Colors.grey,
                  ),
                ),
              ),
            ],
          ),
          if (schedule.notes != null && schedule.notes!.isNotEmpty) ...[
            const SizedBox(height: 12),
            Text(schedule.notes!, style: const TextStyle(fontSize: 14, color: AppTheme.white)),
          ],
        ],
      ),
    );
  }
  
  Widget _buildWellnessEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(color: AppTheme.darkSurfaceVariant, borderRadius: BorderRadius.circular(60)),
            child: const Icon(Icons.schedule, size: 64, color: AppTheme.white),
          ),
          const SizedBox(height: 24),
          const Text('No hay rutinas programadas', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white), textAlign: TextAlign.center),
          const SizedBox(height: 12),
          Text('Crea tu primera rutina de bienestar', style: TextStyle(fontSize: 14, color: AppTheme.white), textAlign: TextAlign.center),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.add),
            label: const Text('Crear Rutina'),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.pinkAccent, foregroundColor: AppTheme.white, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12)),
          ),
        ],
      ),
    );
  }

  Widget _buildJournal() {
    final journalStats = _getJournalStats();
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.pinkAccent.withOpacity(0.3), Colors.pinkAccent.withOpacity(0.1)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(color: Colors.pinkAccent.withOpacity(0.2), borderRadius: BorderRadius.circular(25)),
                  child: const Icon(Icons.book, color: Colors.pinkAccent, size: 24),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Diario de Cuidado Personal', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white)),
                      const SizedBox(height: 5),
                      Text('Reflexiona sobre tu día y cuida tu bienestar', style: TextStyle(fontSize: 14, color: AppTheme.white)),
                    ],
                  ),
                ),
                IconButton(
                  icon: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(color: Colors.pinkAccent.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                    child: const Icon(Icons.add, color: Colors.pinkAccent, size: 20),
                  ),
                  onPressed: () {},
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Panel de estadísticas
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(16)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Text('📊', style: TextStyle(fontSize: 24)),
                    SizedBox(width: 8),
                    Text('Tu Bienestar Esta Semana', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.white)),
                  ],
                ),
                const SizedBox(height: 8),
                Text('${journalStats['totalEntries']} entradas • ${journalStats['gratefulItems']} cosas por las que agradecer', style: const TextStyle(fontSize: 14, color: AppTheme.white)),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(child: _buildJournalStatItem(Icons.bolt, '${journalStats['avgEnergy']}/10', 'Energía', _getEnergyColor(journalStats['avgEnergy'] as int))),
                    const SizedBox(width: 10),
                    Expanded(child: _buildJournalStatItem(Icons.bedtime, '${journalStats['avgSleep']}/10', 'Sueño', _getSleepColor(journalStats['avgSleep'] as int))),
                    const SizedBox(width: 10),
                    Expanded(child: _buildJournalStatItem(Icons.warning, '${journalStats['avgStress']}/10', 'Estrés', _getStressColor(journalStats['avgStress'] as int))),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Lista de entradas
          if (_journalEntries.isEmpty)
            _buildJournalEmptyState()
          else
            ..._journalEntries.map((entry) => Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: _buildDetailedJournalCard(entry),
                )),
        ],
      ),
    );
  }
  
  Map<String, dynamic> _getJournalStats() {
    final totalEntries = _journalEntries.length;
    if (totalEntries == 0) {
      return {'totalEntries': 0, 'avgEnergy': 0, 'avgSleep': 0, 'avgStress': 0, 'gratefulItems': 0};
    }
    final avgEnergy = (_journalEntries.fold<int>(0, (sum, e) => sum + e.energy) / totalEntries).round();
    final avgSleep = (_journalEntries.fold<int>(0, (sum, e) => sum + e.sleep) / totalEntries).round();
    final avgStress = (_journalEntries.fold<int>(0, (sum, e) => sum + e.stress) / totalEntries).round();
    return {'totalEntries': totalEntries, 'avgEnergy': avgEnergy, 'avgSleep': avgSleep, 'avgStress': avgStress, 'gratefulItems': 0};
  }
  
  Color _getEnergyColor(int level) {
    if (level >= 8) return Colors.green;
    if (level >= 6) return Colors.orange;
    if (level >= 4) return Colors.amber;
    return Colors.red;
  }
  
  Color _getSleepColor(int level) {
    if (level >= 8) return Colors.green;
    if (level >= 6) return Colors.orange;
    if (level >= 4) return Colors.amber;
    return Colors.red;
  }
  
  Color _getStressColor(int level) {
    if (level <= 3) return Colors.green;
    if (level <= 5) return Colors.orange;
    if (level <= 7) return Colors.amber;
    return Colors.red;
  }
  
  Widget _buildJournalStatItem(IconData icon, String value, String label, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: AppTheme.darkSurfaceVariant, borderRadius: BorderRadius.circular(12)),
      child: Column(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.white)),
          const SizedBox(height: 4),
          Text(label, style: TextStyle(fontSize: 10, color: AppTheme.white)),
        ],
      ),
    );
  }
  
  Widget _buildDetailedJournalCard(JournalEntry entry) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(entry.date.toString().split(' ')[0], style: const TextStyle(fontSize: 14, color: AppTheme.white)),
              Row(
                children: [
                  _buildMoodIndicator('Estado', entry.mood),
                  const SizedBox(width: 12),
                  _buildMoodIndicator('Energía', entry.energy),
                ],
              ),
            ],
          ),
          if (entry.notes != null) ...[
            const SizedBox(height: 12),
            Text(entry.notes!, style: const TextStyle(fontSize: 14, color: AppTheme.white)),
          ],
        ],
      ),
    );
  }
  
  Widget _buildJournalEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(color: AppTheme.darkSurfaceVariant, borderRadius: BorderRadius.circular(60)),
            child: const Icon(Icons.book, size: 64, color: AppTheme.white),
          ),
          const SizedBox(height: 24),
          const Text('No hay entradas en el diario', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white), textAlign: TextAlign.center),
          const SizedBox(height: 12),
          Text('Comienza a escribir sobre tu día', style: TextStyle(fontSize: 14, color: AppTheme.white), textAlign: TextAlign.center),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.add),
            label: const Text('Nueva Entrada'),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.pinkAccent, foregroundColor: AppTheme.white, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12)),
          ),
        ],
      ),
    );
  }

  Widget _buildPlanner() {
    final plannerStats = _getPlannerStats();
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.pinkAccent.withOpacity(0.3), Colors.pinkAccent.withOpacity(0.1)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(color: Colors.pinkAccent.withOpacity(0.2), borderRadius: BorderRadius.circular(25)),
                  child: const Icon(Icons.calendar_view_week, color: Colors.pinkAccent, size: 24),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Planificador de Autocuidado', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white)),
                      const SizedBox(height: 5),
                      Text('Organiza tus actividades de bienestar', style: TextStyle(fontSize: 14, color: AppTheme.white)),
                    ],
                  ),
                ),
                IconButton(
                  icon: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(color: Colors.pinkAccent.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                    child: const Icon(Icons.add, color: Colors.pinkAccent, size: 20),
                  ),
                  onPressed: () {},
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Estadísticas
          Row(
            children: [
              Expanded(child: _buildStatCard(Icons.list, plannerStats['totalPlans'].toString(), 'Planes', Colors.blue)),
              const SizedBox(width: 10),
              Expanded(child: _buildStatCard(Icons.check_circle, '${plannerStats['completed']}/${plannerStats['total']}', 'Tareas', Colors.green)),
              const SizedBox(width: 10),
              Expanded(child: _buildStatCard(Icons.bolt, '${plannerStats['avgEnergy']}/10', 'Energía', Colors.orange)),
              const SizedBox(width: 10),
              Expanded(child: _buildStatCard(Icons.sentiment_satisfied, '${plannerStats['avgSatisfaction']}/10', 'Satisfacción', Colors.purple)),
            ],
          ),
          const SizedBox(height: 20),
          // Lista de planes
          if (_selfCarePlans.isEmpty)
            _buildPlannerEmptyState()
          else
            ..._selfCarePlans.map((plan) => Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: _buildDetailedPlanCard(plan),
                )),
        ],
      ),
    );
  }
  
  Map<String, dynamic> _getPlannerStats() {
    final totalPlans = _selfCarePlans.length;
    if (totalPlans == 0) {
      return {'totalPlans': 0, 'total': 0, 'completed': 0, 'avgEnergy': 0, 'avgSatisfaction': 0};
    }
    // Usar valores por defecto si no existen en el modelo
    return {'totalPlans': totalPlans, 'total': totalPlans * 6, 'completed': totalPlans * 4, 'avgEnergy': 7, 'avgSatisfaction': 8};
  }
  
  Widget _buildDetailedPlanCard(SelfCarePlan plan) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(plan.activity, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.white)),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: _getPriorityColor(plan.priority).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  plan.priority.toUpperCase(),
                  style: TextStyle(fontSize: 12, color: _getPriorityColor(plan.priority), fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(plan.date.toString().split(' ')[0], style: const TextStyle(fontSize: 12, color: AppTheme.white)),
        ],
      ),
    );
  }
  
  Widget _buildPlannerEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(color: AppTheme.darkSurfaceVariant, borderRadius: BorderRadius.circular(60)),
            child: const Icon(Icons.calendar_view_week, size: 64, color: AppTheme.white),
          ),
          const SizedBox(height: 24),
          const Text('No hay planes de autocuidado', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white), textAlign: TextAlign.center),
          const SizedBox(height: 12),
          Text('Crea tu primer plan de bienestar', style: TextStyle(fontSize: 14, color: AppTheme.white), textAlign: TextAlign.center),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.add),
            label: const Text('Crear Plan'),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.pinkAccent, foregroundColor: AppTheme.white, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12)),
          ),
        ],
      ),
    );
  }

  Widget _buildHabits() {
    final habitsStats = _getHabitsStats();
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.pinkAccent.withOpacity(0.3), Colors.pinkAccent.withOpacity(0.1)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(color: Colors.pinkAccent.withOpacity(0.2), borderRadius: BorderRadius.circular(25)),
                  child: const Icon(Icons.repeat, color: Colors.pinkAccent, size: 24),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Seguimiento de Hábitos', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white)),
                      const SizedBox(height: 5),
                      Text('Construye hábitos positivos día a día', style: TextStyle(fontSize: 14, color: AppTheme.white)),
                    ],
                  ),
                ),
                IconButton(
                  icon: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(color: Colors.pinkAccent.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                    child: const Icon(Icons.add, color: Colors.pinkAccent, size: 20),
                  ),
                  onPressed: () {},
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Estadísticas
          Row(
            children: [
              Expanded(child: _buildStatCard(Icons.repeat, habitsStats['totalHabits'].toString(), 'Hábitos', Colors.blue)),
              const SizedBox(width: 10),
              Expanded(child: _buildStatCard(Icons.check_circle, '${habitsStats['completed']}/${habitsStats['total']}', 'Completados', Colors.green)),
              const SizedBox(width: 10),
              Expanded(child: _buildStatCard(Icons.trending_up, '${habitsStats['progress']}%', 'Progreso', Colors.orange)),
            ],
          ),
          const SizedBox(height: 20),
          // Lista de hábitos
          if (_habits.isEmpty)
            _buildHabitsEmptyState()
          else
            ..._habits.map((habit) => Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: _buildDetailedHabitCard(habit),
                )),
        ],
      ),
    );
  }
  
  Map<String, dynamic> _getHabitsStats() {
    final totalHabits = _habits.length;
    if (totalHabits == 0) {
      return {'totalHabits': 0, 'total': 0, 'completed': 0, 'progress': 0};
    }
    final allCompletions = _habits.expand((h) => h.completion).toList();
    final total = allCompletions.length;
    final completed = allCompletions.where((c) => c == true).length;
    final progress = total > 0 ? ((completed / total) * 100).round() : 0;
    return {'totalHabits': totalHabits, 'total': total, 'completed': completed, 'progress': progress};
  }
  
  Widget _buildDetailedHabitCard(Habit habit) {
    final completedCount = habit.completion.where((c) => c).length;
    final totalCount = habit.completion.length;
    final progress = totalCount > 0 ? (completedCount / totalCount) : 0.0;
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(habit.text, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.white)),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: _getPriorityColor(habit.priority).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  habit.priority.toUpperCase(),
                  style: TextStyle(fontSize: 12, color: _getPriorityColor(habit.priority), fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text('$completedCount de $totalCount días completados', style: const TextStyle(fontSize: 12, color: AppTheme.white)),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: progress,
            backgroundColor: AppTheme.darkSurfaceVariant,
            valueColor: AlwaysStoppedAnimation<Color>(_getPriorityColor(habit.priority)),
            minHeight: 8,
            borderRadius: BorderRadius.circular(4),
          ),
        ],
      ),
    );
  }
  
  Widget _buildHabitsEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(color: AppTheme.darkSurfaceVariant, borderRadius: BorderRadius.circular(60)),
            child: const Icon(Icons.repeat, size: 64, color: AppTheme.white),
          ),
          const SizedBox(height: 24),
          const Text('No hay hábitos registrados', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white), textAlign: TextAlign.center),
          const SizedBox(height: 12),
          Text('Comienza a construir hábitos positivos', style: TextStyle(fontSize: 14, color: AppTheme.white), textAlign: TextAlign.center),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.add),
            label: const Text('Agregar Hábito'),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.pinkAccent, foregroundColor: AppTheme.white, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12)),
          ),
        ],
      ),
    );
  }

  Widget _buildMoodTracker() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.pinkAccent.withOpacity(0.3), Colors.pinkAccent.withOpacity(0.1)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(color: Colors.pinkAccent.withOpacity(0.2), borderRadius: BorderRadius.circular(25)),
                  child: const Icon(Icons.favorite, color: Colors.pinkAccent, size: 24),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Seguimiento del Estado de Ánimo', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white)),
                      const SizedBox(height: 5),
                      Text('Conecta con tus emociones diariamente', style: TextStyle(fontSize: 14, color: AppTheme.white)),
                    ],
                  ),
                ),
                IconButton(
                  icon: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(color: Colors.pinkAccent.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                    child: const Icon(Icons.add, color: Colors.pinkAccent, size: 20),
                  ),
                  onPressed: () {},
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Estado de ánimo actual
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(16)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Text('😊', style: TextStyle(fontSize: 24)),
                    SizedBox(width: 8),
                    Text('Tu Estado de Ánimo Hoy', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.white)),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildMoodButton('😊', 'Feliz', Colors.green),
                    _buildMoodButton('😌', 'Tranquilo', Colors.blue),
                    _buildMoodButton('😐', 'Neutral', Colors.grey),
                    _buildMoodButton('😔', 'Triste', Colors.orange),
                    _buildMoodButton('😴', 'Cansado', Colors.purple),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Estadísticas semanales
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(16)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Text('📊', style: TextStyle(fontSize: 24)),
                    SizedBox(width: 8),
                    Text('Estadísticas de la Semana', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.white)),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(child: _buildStatCard(Icons.trending_up, '4', 'Días Felices', Colors.green)),
                    const SizedBox(width: 10),
                    Expanded(child: _buildStatCard(Icons.trending_down, '1', 'Días Tristes', Colors.orange)),
                    const SizedBox(width: 10),
                    Expanded(child: _buildStatCard(Icons.pause, '2', 'Días Neutros', Colors.blue)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Gráfico de estados de ánimo semanal
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(16)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Estados de Ánimo Esta Semana', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.white)),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildWeeklyMoodItem('L', '😊', Colors.green),
                    _buildWeeklyMoodItem('M', '😌', Colors.blue),
                    _buildWeeklyMoodItem('X', '😔', Colors.orange),
                    _buildWeeklyMoodItem('J', '😊', Colors.green),
                    _buildWeeklyMoodItem('V', '😴', Colors.purple),
                    _buildWeeklyMoodItem('S', '😄', Colors.amber),
                    _buildWeeklyMoodItem('D', '😌', Colors.blue),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildMoodButton(String emoji, String label, Color color) {
    return GestureDetector(
      onTap: () {},
      child: Column(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(color: color.withOpacity(0.2), borderRadius: BorderRadius.circular(25)),
            child: Center(child: Text(emoji, style: const TextStyle(fontSize: 24))),
          ),
          const SizedBox(height: 8),
          Text(label, style: TextStyle(fontSize: 12, color: AppTheme.white)),
        ],
      ),
    );
  }
  
  Widget _buildWeeklyMoodItem(String day, String emoji, Color color) {
    return Column(
      children: [
        Text(day, style: TextStyle(fontSize: 12, color: AppTheme.white)),
        const SizedBox(height: 8),
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(color: color.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
          child: Center(child: Text(emoji, style: const TextStyle(fontSize: 20))),
        ),
      ],
    );
  }

  Widget _buildEmptyState(String message, IconData icon) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 64, color: AppTheme.white),
          const SizedBox(height: 16),
          Text(
            message,
            style: const TextStyle(
              fontSize: 16,
              color: AppTheme.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWellnessCard(WellnessSchedule wellness) {
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                color: wellness.completed ? Colors.green : Colors.transparent,
                border: Border.all(
                  color: wellness.completed ? Colors.green : AppTheme.white,
                  width: 2,
                ),
                borderRadius: BorderRadius.circular(6),
              ),
              child: wellness.completed
                  ? const Icon(Icons.check, size: 16, color: AppTheme.white)
                  : null,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    wellness.activity,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${wellness.time} • ${wellness.frequency}',
                    style: const TextStyle(fontSize: 12, color: AppTheme.white),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildJournalCard(JournalEntry entry) {
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
                  entry.date.toString().split(' ')[0],
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white,
                  ),
                ),
                Row(
                  children: [
                    _buildMoodIndicator('Estado de ánimo', entry.mood),
                    const SizedBox(width: 12),
                    _buildMoodIndicator('Energía', entry.energy),
                  ],
                ),
              ],
            ),
            if (entry.notes != null) ...[
              const SizedBox(height: 12),
              Text(
                entry.notes!,
                style: const TextStyle(
                  fontSize: 14,
                  color: AppTheme.white,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildMoodIndicator(String label, int value) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 10, color: AppTheme.white),
        ),
        const SizedBox(height: 4),
        Row(
          children: List.generate(5, (index) {
            return Icon(
              index < value ? Icons.star : Icons.star_border,
              size: 12,
              color: AppTheme.orangeAccent,
            );
          }),
        ),
      ],
    );
  }

  Widget _buildPlanCard(SelfCarePlan plan) {
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
            Text(
              plan.activity,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppTheme.white,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getPriorityColor(plan.priority).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    plan.priority.toUpperCase(),
                    style: TextStyle(
                      fontSize: 10,
                      color: _getPriorityColor(plan.priority),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Text(
                  plan.date.toString().split(' ')[0],
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppTheme.white,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHabitCard(Habit habit) {
    final completedCount = habit.completion.where((c) => c).length;
    final totalCount = habit.completion.length;
    final progress = totalCount > 0 ? completedCount / totalCount : 0.0;

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
                    habit.text,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.white,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getPriorityColor(habit.priority).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    habit.priority.toUpperCase(),
                    style: TextStyle(
                      fontSize: 10,
                      color: _getPriorityColor(habit.priority),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              '$completedCount de $totalCount días completados',
              style: const TextStyle(
                fontSize: 12,
                color: AppTheme.white,
              ),
            ),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: progress,
              backgroundColor: AppTheme.darkSurfaceVariant,
              valueColor: AlwaysStoppedAnimation<Color>(_getPriorityColor(habit.priority)),
              minHeight: 8,
              borderRadius: BorderRadius.circular(4),
            ),
          ],
        ),
      ),
    );
  }

  Color _getPriorityColor(String priority) {
    switch (priority) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.orange;
      case 'low':
        return Colors.green;
      default:
        return AppTheme.orangeAccent;
    }
  }
}

