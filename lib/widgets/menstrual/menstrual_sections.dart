import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../models/menstrual/period_entry.dart';
import '../../models/menstrual/cycle_reminder.dart';
import '../../auth/providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../common/navigation_header.dart';

class MenstrualSections extends StatefulWidget {
  const MenstrualSections({super.key});

  @override
  State<MenstrualSections> createState() => _MenstrualSectionsState();
}

class _MenstrualSectionsState extends State<MenstrualSections> {
  String _activeSection = 'period-log';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  
  List<PeriodEntry> _periodEntries = [];
  List<CycleReminder> _reminders = [];
  Map<String, int> _cycleLengths = {};
  Map<String, Map<String, dynamic>> _monthlyDays = {}; // Para tracking mensual
  
  // Controladores
  final TextEditingController _notesController = TextEditingController();
  final TextEditingController _reminderTitleController = TextEditingController();
  final TextEditingController _reminderDescriptionController = TextEditingController();
  
  DateTime _selectedDate = DateTime.now();
  String _selectedFlow = '';
  List<String> _selectedSymptoms = [];
  String _selectedMood = 'okay';
  int _selectedPainLevel = 0;
  String _selectedReminderType = 'period_start';
  String _selectedReminderRepeat = 'monthly';
  TimeOfDay? _selectedReminderTime;
  
  final sections = [
    {'id': 'period-log', 'name': 'Registro de Período', 'icon': Icons.calendar_today},
    {'id': 'period-tracker', 'name': 'Seguimiento de Período', 'icon': Icons.list},
    {'id': 'cycle-duration', 'name': 'Duración del Ciclo', 'icon': Icons.timer},
    {'id': 'cycle-reminder', 'name': 'Recordatorio de Ciclo', 'icon': Icons.alarm},
    {'id': 'flow-monitor', 'name': 'Monitor de Flujo', 'icon': Icons.bar_chart},
  ];

  final List<String> _symptoms = ['cramps', 'headache', 'acne', 'spotting', 'stress', 'sex'];
  final List<String> _moods = ['good', 'okay', 'tired', 'sad'];
  final List<Map<String, dynamic>> _reminderTypes = [
    {'type': 'period_start', 'label': 'Inicio de Período', 'icon': Icons.play_circle, 'color': Colors.pink},
    {'type': 'period_end', 'label': 'Fin de Período', 'icon': Icons.stop_circle, 'color': Colors.purple},
    {'type': 'ovulation', 'label': 'Ovulación', 'icon': Icons.egg, 'color': Colors.orange},
    {'type': 'medication', 'label': 'Medicamentos', 'icon': Icons.medical_services, 'color': Colors.green},
    {'type': 'appointment', 'label': 'Citas Médicas', 'icon': Icons.calendar_today, 'color': Colors.blue},
  ];

  @override
  void dispose() {
    _notesController.dispose();
    _reminderTitleController.dispose();
    _reminderDescriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: Colors.transparent,
      drawer: _buildNavigationDrawer(context),
      appBar: NavigationHeader(currentSection: 'menstrual'),
      body: Column(
        children: [
          _buildSectionTabs(),
          Expanded(
            child: _buildActiveSection(),
          ),
        ],
      ),
      floatingActionButton: _buildFloatingActionButton(),
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
          DrawerHeader(
            decoration: BoxDecoration(
              color: AppTheme.darkBackground,
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.pink.withOpacity(0.3),
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
                    color: Colors.pink,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: const Icon(
                    Icons.eco_outlined,
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
                    color: AppTheme.white60,
                  ),
                ),
              ],
            ),
          ),
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
            isActive: true,
            onTap: () {
              Navigator.pop(context);
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
            icon: Icons.favorite_outline,
            title: 'Cuidado Personal',
            color: Colors.pinkAccent,
            onTap: () {
              Navigator.pop(context);
              context.go('/selfcare');
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
          const Divider(color: AppTheme.darkSurfaceVariant, height: 32),
          _buildDrawerItem(
            context,
            icon: Icons.settings_outlined,
            title: 'Configuración',
            color: AppTheme.white60,
            onTap: () {
              Navigator.pop(context);
              context.go('/main?section=settings');
            },
          ),
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
                        ? Colors.pink.withOpacity(0.2)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isActive
                          ? Colors.pink
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
                            ? Colors.pink
                            : AppTheme.white60,
                        size: 20,
                      ),
                      const SizedBox(height: 2),
                      Flexible(
                        child: Text(
                          section['name'] as String,
                          style: TextStyle(
                            fontSize: 10,
                            color: isActive
                                ? Colors.pink
                                : AppTheme.white60,
                            fontWeight: isActive
                                ? FontWeight.w600
                                : FontWeight.normal,
                          ),
                          overflow: TextOverflow.ellipsis,
                          maxLines: 1,
                          textAlign: TextAlign.center,
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

  Widget _buildFloatingActionButton() {
    if (_activeSection == 'period-log') {
      return FloatingActionButton.extended(
        onPressed: () => _showAddPeriodModal(),
        icon: const Icon(Icons.add),
        label: const Text('Agregar Período'),
        backgroundColor: Colors.pink,
      );
    } else if (_activeSection == 'cycle-reminder') {
      return FloatingActionButton.extended(
        onPressed: () => _showAddReminderModal(),
        icon: const Icon(Icons.add),
        label: const Text('Agregar Recordatorio'),
        backgroundColor: Colors.pink,
      );
    }
    return const SizedBox.shrink();
  }

  // ==================== REGISTRO DE PERÍODO ====================
  Widget _buildPeriodLog() {
    final stats = _calculatePeriodStats();
    
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
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.pink.withOpacity(0.2),
                  AppTheme.darkSurface,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: Colors.pink.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.pink.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.calendar_today,
                    color: Colors.pink,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 16),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Registro de Período',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Rastrea tu ciclo menstrual',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white70,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Estadísticas
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  icon: Icons.calendar_today,
                  number: stats['totalDays'].toString(),
                  label: 'Días registrados',
                  color: Colors.pink,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                  icon: Icons.water_drop,
                  number: stats['heavyDays'].toString(),
                  label: 'Días intensos',
                  color: Colors.red,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                  icon: Icons.favorite,
                  number: stats['avgPain'].toString(),
                  label: 'Dolor promedio',
                  color: Colors.purple,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Calendario del mes actual
          _buildMonthCalendar(),
          const SizedBox(height: 24),
          
          // Registros recientes
          if (_periodEntries.isNotEmpty) ...[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Registros Recientes',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('Ver todos', style: TextStyle(color: Colors.pink)),
                      SizedBox(width: 4),
                      Icon(Icons.arrow_forward, size: 16, color: Colors.pink),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ..._periodEntries.take(5).map((entry) => _buildPeriodEntryCard(entry)),
            const SizedBox(height: 24),
          ],
          
          // Notas generales
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.pink.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.notes, color: Colors.pink, size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'Notas Generales',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _notesController,
                  decoration: const InputDecoration(
                    hintText: 'Escribe tus observaciones sobre tu ciclo menstrual...',
                    hintStyle: TextStyle(color: AppTheme.white60),
                    border: InputBorder.none,
                  ),
                  style: const TextStyle(color: AppTheme.white),
                  maxLines: 4,
                  textAlignVertical: TextAlignVertical.top,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String number,
    required String label,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 12),
          Text(
            number,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.white60,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildMonthCalendar() {
    final now = DateTime.now();
    final firstDay = DateTime(now.year, now.month, 1);
    final lastDay = DateTime(now.year, now.month + 1, 0);
    final daysInMonth = lastDay.day;
    final startWeekday = firstDay.weekday % 7; // 0 = Lunes
    
    final weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.pink.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                DateFormat('MMMM yyyy', 'es').format(now),
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              Row(
                children: [
                  _buildLegendItem(Colors.pink.shade100, 'Ligero'),
                  const SizedBox(width: 8),
                  _buildLegendItem(Colors.pink.shade300, 'Regular'),
                  const SizedBox(width: 8),
                  _buildLegendItem(Colors.pink.shade500, 'Pesado'),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Días de la semana
          Row(
            children: weekDays.map((day) => Expanded(
              child: Center(
                child: Text(
                  day,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.white60,
                  ),
                ),
              ),
            )).toList(),
          ),
          const SizedBox(height: 8),
          // Días del mes
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              childAspectRatio: 1,
              mainAxisSpacing: 4,
              crossAxisSpacing: 4,
            ),
            itemCount: daysInMonth + startWeekday,
            itemBuilder: (context, index) {
              if (index < startWeekday) {
                return const SizedBox.shrink();
              }
              final day = index - startWeekday + 1;
              final dateStr = '${now.year}-${now.month.toString().padLeft(2, '0')}-${day.toString().padLeft(2, '0')}';
              final entry = _periodEntries.firstWhere(
                (e) => e.date == dateStr,
                orElse: () => PeriodEntry(
                  id: '',
                  date: '',
                  flow: '',
                  symptoms: [],
                  mood: '',
                  painLevel: 0,
                ),
              );
              final hasEntry = entry.date.isNotEmpty;
              
              return GestureDetector(
                onTap: () {
                  if (hasEntry) {
                    _editPeriodEntry(entry);
                  } else {
                    setState(() {
                      _selectedDate = DateTime(now.year, now.month, day);
                    });
                    _showAddPeriodModal();
                  }
                },
                child: Container(
                  decoration: BoxDecoration(
                    color: hasEntry ? _getFlowColor(entry.flow) : AppTheme.darkSurfaceVariant,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: hasEntry ? Colors.pink : AppTheme.darkSurfaceVariant,
                      width: hasEntry ? 2 : 1,
                    ),
                  ),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          day.toString(),
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: hasEntry ? AppTheme.white : AppTheme.white60,
                          ),
                        ),
                        if (hasEntry && entry.symptoms.isNotEmpty)
                          const Icon(Icons.circle, size: 4, color: AppTheme.white),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildLegendItem(Color color, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: AppTheme.white60,
          ),
        ),
      ],
    );
  }

  Widget _buildPeriodEntryCard(PeriodEntry entry) {
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: Colors.pink.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getFlowColor(entry.flow).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    DateFormat('d MMM', 'es').format(DateTime.parse(entry.date)),
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getFlowColor(entry.flow),
                    borderRadius: BorderRadius.circular(8),
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
            Row(
              children: [
                Icon(_getMoodIcon(entry.mood), size: 16, color: _getMoodColor(entry.mood)),
                const SizedBox(width: 8),
                Text(
                  _getMoodLabel(entry.mood),
                  style: const TextStyle(fontSize: 14, color: AppTheme.white70),
                ),
                const SizedBox(width: 16),
                const Icon(Icons.favorite, size: 16, color: Colors.purple),
                const SizedBox(width: 4),
                Text(
                  '${entry.painLevel}/10',
                  style: const TextStyle(fontSize: 14, color: AppTheme.white70),
                ),
              ],
            ),
            if (entry.symptoms.isNotEmpty) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                children: entry.symptoms.map((symptom) {
                  return Chip(
                    label: Text(_getSymptomLabel(symptom)),
                    backgroundColor: AppTheme.darkSurfaceVariant,
                    labelStyle: const TextStyle(fontSize: 12, color: AppTheme.white),
                  );
                }).toList(),
              ),
            ],
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

  Map<String, dynamic> _calculatePeriodStats() {
    if (_periodEntries.isEmpty) {
      return {'totalDays': 0, 'heavyDays': 0, 'avgPain': 0.0};
    }
    final heavyDays = _periodEntries.where((e) => e.flow == 'heavy').length;
    final avgPain = _periodEntries.map((e) => e.painLevel).reduce((a, b) => a + b) / _periodEntries.length;
    return {
      'totalDays': _periodEntries.length,
      'heavyDays': heavyDays,
      'avgPain': avgPain.toStringAsFixed(1),
    };
  }

  void _showAddPeriodModal() {
    final nameController = TextEditingController();
    DateTime selectedDate = _selectedDate;
    String? selectedFlow;
    List<String> selectedSymptoms = [];
    String selectedMood = 'okay';
    int selectedPainLevel = 0;
    bool isSaving = false;

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: AppTheme.darkSurface,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              title: const Text(
                'Registrar Período',
                style: TextStyle(color: AppTheme.white),
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Fecha
                    ListTile(
                      leading: const Icon(Icons.calendar_today, color: Colors.pink),
                      title: const Text('Fecha', style: TextStyle(color: AppTheme.white)),
                      subtitle: Text(
                        DateFormat('d MMMM yyyy', 'es').format(selectedDate),
                        style: const TextStyle(color: AppTheme.white70),
                      ),
                      onTap: () async {
                        final picked = await showDatePicker(
                          context: context,
                          initialDate: selectedDate,
                          firstDate: DateTime.now().subtract(const Duration(days: 365)),
                          lastDate: DateTime.now().add(const Duration(days: 30)),
                        );
                        if (picked != null) {
                          setDialogState(() {
                            selectedDate = picked;
                          });
                        }
                      },
                    ),
                    const Divider(color: AppTheme.darkSurfaceVariant),
                    
                    // Intensidad del Flujo
                    const Text(
                      'Intensidad del Flujo *',
                      style: TextStyle(color: AppTheme.white, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: _buildFlowOption(
                            'light',
                            'Ligero',
                            Colors.pink.shade100,
                            selectedFlow,
                            (value) => setDialogState(() => selectedFlow = value),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildFlowOption(
                            'regular',
                            'Regular',
                            Colors.pink.shade300,
                            selectedFlow,
                            (value) => setDialogState(() => selectedFlow = value),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: _buildFlowOption(
                            'heavy',
                            'Pesado',
                            Colors.pink.shade500,
                            selectedFlow,
                            (value) => setDialogState(() => selectedFlow = value),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    
                    // Síntomas
                    const Text(
                      'Síntomas',
                      style: TextStyle(color: AppTheme.white, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _symptoms.map((symptom) {
                        final isSelected = selectedSymptoms.contains(symptom);
                        return FilterChip(
                          label: Text(_getSymptomLabel(symptom)),
                          selected: isSelected,
                          onSelected: (selected) {
                            setDialogState(() {
                              if (selected) {
                                selectedSymptoms.add(symptom);
                              } else {
                                selectedSymptoms.remove(symptom);
                              }
                            });
                          },
                          selectedColor: Colors.pink.withOpacity(0.3),
                          checkmarkColor: Colors.pink,
                          labelStyle: TextStyle(
                            color: isSelected ? Colors.pink : AppTheme.white,
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 20),
                    
                    // Estado de ánimo
                    const Text(
                      'Estado de Ánimo',
                      style: TextStyle(color: AppTheme.white, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: _moods.map((mood) {
                        final isSelected = selectedMood == mood;
                        return Expanded(
                          child: GestureDetector(
                            onTap: () => setDialogState(() => selectedMood = mood),
                            child: Container(
                              margin: const EdgeInsets.symmetric(horizontal: 4),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: isSelected ? _getMoodColor(mood).withOpacity(0.3) : AppTheme.darkSurfaceVariant,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isSelected ? _getMoodColor(mood) : Colors.transparent,
                                  width: 2,
                                ),
                              ),
                              child: Column(
                                children: [
                                  Icon(_getMoodIcon(mood), color: _getMoodColor(mood), size: 24),
                                  const SizedBox(height: 4),
                                  Text(
                                    _getMoodLabel(mood),
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: isSelected ? _getMoodColor(mood) : AppTheme.white60,
                                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 20),
                    
                    // Nivel de dolor
                    Text(
                      'Nivel de Dolor: $selectedPainLevel/10',
                      style: const TextStyle(color: AppTheme.white, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    Slider(
                      value: selectedPainLevel.toDouble(),
                      min: 0,
                      max: 10,
                      divisions: 10,
                      label: selectedPainLevel.toString(),
                      activeColor: Colors.pink,
                      onChanged: (value) {
                        setDialogState(() {
                          selectedPainLevel = value.toInt();
                        });
                      },
                    ),
                    const SizedBox(height: 20),
                    
                    // Notas
                    TextField(
                      controller: nameController,
                      decoration: const InputDecoration(
                        labelText: 'Notas',
                        labelStyle: TextStyle(color: AppTheme.white70),
                        border: OutlineInputBorder(),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.darkSurfaceVariant),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.pink),
                        ),
                      ),
                      style: const TextStyle(color: AppTheme.white),
                      maxLines: 3,
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: isSaving ? null : () => Navigator.pop(context),
                  child: const Text('Cancelar', style: TextStyle(color: AppTheme.white60)),
                ),
                ElevatedButton(
                  onPressed: isSaving || selectedFlow == null
                      ? null
                      : () async {
                          setDialogState(() => isSaving = true);
                          final entry = PeriodEntry(
                            id: DateTime.now().millisecondsSinceEpoch.toString(),
                            date: DateFormat('yyyy-MM-dd').format(selectedDate),
                            flow: selectedFlow!,
                            symptoms: selectedSymptoms,
                            mood: selectedMood,
                            painLevel: selectedPainLevel,
                            notes: nameController.text.isEmpty ? null : nameController.text,
                          );
                          setState(() {
                            _periodEntries.insert(0, entry);
                            _periodEntries.sort((a, b) => b.date.compareTo(a.date));
                          });
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Período registrado correctamente')),
                          );
                        },
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.pink),
                  child: isSaving
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.white),
                        )
                      : const Text('Guardar'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Widget _buildFlowOption(String value, String label, Color color, String? selected, Function(String) onSelect) {
    final isSelected = selected == value;
    return GestureDetector(
      onTap: () => onSelect(value),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? color : color.withOpacity(0.3),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? Colors.pink : Colors.transparent,
            width: 2,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            color: isSelected ? AppTheme.white : AppTheme.white60,
          ),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }

  void _editPeriodEntry(PeriodEntry entry) {
    // Similar a _showAddPeriodModal pero prellenando los campos
    _showAddPeriodModal();
  }

  // ==================== SEGUIMIENTO DE PERÍODO ====================
  Widget _buildPeriodTracker() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          _buildSectionHeader(
            title: 'Seguimiento de Período',
            subtitle: 'Análisis detallado de tu ciclo',
            icon: Icons.analytics,
            color: Colors.pink,
          ),
          const SizedBox(height: 20),
          
          // Estadísticas del mes
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  icon: Icons.calendar_today,
                  number: _periodEntries.length.toString(),
                  label: 'Días registrados',
                  color: Colors.pink),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                    icon: Icons.water_drop,
                    number: _periodEntries.where((e) => e.flow == 'heavy').length.toString(),
                    label: 'Días intensos',
                    color: Colors.red),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                    icon: Icons.favorite,
                    number: _periodEntries.isEmpty
                        ? '0'
                        : (_periodEntries.map((e) => e.painLevel).reduce((a, b) => a + b) /
                                _periodEntries.length)
                            .toStringAsFixed(1),
                    label: 'Dolor promedio',
                    color: Colors.purple),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Calendario del mes
          _buildMonthCalendar(),
          const SizedBox(height: 24),
          
          // Análisis de tendencias
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.pink.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.trending_up, color: Colors.pink, size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'Análisis de Tendencias',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildTrendCard(
                  icon: Icons.calendar_today,
                  title: 'Ciclo Regular',
                  description: 'Tu ciclo se mantiene estable con 28-30 días',
                  progress: 0.85,
                  color: Colors.green,
                ),
                const SizedBox(height: 12),
                _buildTrendCard(
                  icon: Icons.water_drop,
                  title: 'Flujo Moderado',
                  description: 'Intensidad promedio de 2.5/3 en la escala',
                  progress: 0.70,
                  color: Colors.orange,
                ),
                const SizedBox(height: 12),
                _buildTrendCard(
                  icon: Icons.favorite,
                  title: 'Dolor Moderado',
                  description: 'Nivel promedio de dolor de 3.2/10',
                  progress: 0.32,
                  color: Colors.red,
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Síntomas más comunes
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.pink.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.medical_services, color: Colors.pink, size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'Síntomas Más Comunes',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ..._calculateSymptomsStats().take(5).map((item) => _buildSymptomItem(item)),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Recomendaciones
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.pink.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.lightbulb, color: Colors.pink, size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'Recomendaciones',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildRecommendationItem(Icons.water_drop, 'Mantén una hidratación adecuada durante tu período'),
                _buildRecommendationItem(Icons.fitness_center, 'El ejercicio ligero puede ayudar con los cólicos'),
                _buildRecommendationItem(Icons.restaurant, 'Consume alimentos ricos en hierro y magnesio'),
                _buildRecommendationItem(Icons.bedtime, 'Prioriza el descanso y el sueño de calidad'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTrendCard({
    required IconData icon,
    required String title,
    required String description,
    required double progress,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurfaceVariant,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppTheme.white60,
                  ),
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: progress,
                    backgroundColor: AppTheme.darkSurfaceVariant,
                    valueColor: AlwaysStoppedAnimation<Color>(color),
                    minHeight: 4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  List<Map<String, dynamic>> _calculateSymptomsStats() {
    final Map<String, int> counts = {};
    for (var entry in _periodEntries) {
      for (var symptom in entry.symptoms) {
        counts[symptom] = (counts[symptom] ?? 0) + 1;
      }
    }
    return counts.entries.map((e) => {
      'symptom': e.key,
      'count': e.value,
      'percentage': (_periodEntries.isEmpty ? 0 : (e.value / _periodEntries.length * 100).round()),
    }).toList()
      ..sort((a, b) => (b['count'] as int).compareTo(a['count'] as int));
  }

  Widget _buildSymptomItem(Map<String, dynamic> item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurfaceVariant,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(_getSymptomIcon(item['symptom'] as String), color: AppTheme.white60, size: 16),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              _getSymptomLabel(item['symptom'] as String),
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppTheme.white,
              ),
            ),
          ),
          Text(
            '${item['count']} días',
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.white60,
            ),
          ),
          const SizedBox(width: 12),
          SizedBox(
            width: 80,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: (item['percentage'] as int) / 100,
                backgroundColor: AppTheme.darkSurfaceVariant,
                valueColor: const AlwaysStoppedAnimation<Color>(Colors.pink),
                minHeight: 4,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRecommendationItem(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: Colors.pink, size: 16),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.white70,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            color.withOpacity(0.2),
            AppTheme.darkSurface,
          ],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white70,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ==================== DURACIÓN DEL CICLO ====================
  Widget _buildCycleDuration() {
    // Datos de ejemplo para el gráfico
    final sampleData = {
      'Enero': 28,
      'Febrero': 30,
      'Marzo': 29,
      'Abril': 27,
      'Mayo': 31,
      'Junio': 28,
    };
    
    final values = sampleData.values.toList();
    final average = (values.reduce((a, b) => a + b) / values.length).round();
    final min = values.reduce((a, b) => a < b ? a : b);
    final max = values.reduce((a, b) => a > b ? a : b);
    final regular = values.where((v) => v >= 26 && v <= 30).length;
    final consistency = ((regular / values.length) * 100).round();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionHeader(
            title: 'Duración del Ciclo',
            subtitle: 'Análisis de la regularidad menstrual',
            icon: Icons.timer,
            color: Colors.pink,
          ),
          const SizedBox(height: 20),
          
          // Estadísticas principales
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                    icon: Icons.calendar_today,
                    number: average.toString(),
                    label: 'Promedio',
                    color: Colors.pink),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                    icon: Icons.trending_up,
                    number: '$consistency%',
                    label: 'Regularidad',
                    color: Colors.green),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                    icon: Icons.warning,
                    number: (values.length - regular).toString(),
                    label: 'Irregulares',
                    color: Colors.orange),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Gráfico de duración
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.pink.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Duración por Mes',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Row(
                      children: [
                        _buildLegendItem(Colors.green, 'Regular'),
                        const SizedBox(width: 8),
                        _buildLegendItem(Colors.orange, 'Corto'),
                        const SizedBox(width: 8),
                        _buildLegendItem(Colors.red, 'Largo'),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                SizedBox(
                  height: 120,
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: sampleData.entries.map((entry) {
                      final days = entry.value;
                      final color = (days >= 26 && days <= 30)
                          ? Colors.green
                          : (days < 26)
                              ? Colors.orange
                              : Colors.red;
                      return Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              Expanded(
                                child: Container(
                                  decoration: BoxDecoration(
                                    color: color,
                                    borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
                                  ),
                                  width: double.infinity,
                                  margin: EdgeInsets.only(
                                    bottom: 0,
                                    top: 100 - ((days / 35) * 100),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                entry.key.substring(0, 3),
                                style: const TextStyle(
                                  fontSize: 10,
                                  color: AppTheme.white60,
                                ),
                              ),
                              Text(
                                '$days',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: color,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Análisis de regularidad
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.pink.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.analytics, color: Colors.pink, size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'Análisis de Regularidad',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: _buildRegularityCard(
                        icon: Icons.check_circle,
                        title: 'Ciclos Regulares',
                        number: regular.toString(),
                        label: 'de ${values.length} meses',
                        progress: regular / values.length,
                        color: Colors.green,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildRegularityCard(
                        icon: Icons.warning,
                        title: 'Ciclos Irregulares',
                        number: (values.length - regular).toString(),
                        label: 'de ${values.length} meses',
                        progress: (values.length - regular) / values.length,
                        color: Colors.orange,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Rango de duración
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.pink.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.compare_arrows, color: Colors.pink, size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'Rango de Duración',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildRangeItem(Icons.arrow_upward, 'Ciclo más largo', '$max días', Colors.red),
                const SizedBox(height: 12),
                _buildRangeItem(Icons.arrow_downward, 'Ciclo más corto', '$min días', Colors.green),
                const SizedBox(height: 12),
                _buildRangeItem(Icons.remove, 'Diferencia', '${max - min} días', Colors.orange),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Recomendaciones
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.pink.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.lightbulb, color: Colors.pink, size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'Recomendaciones',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                if (consistency >= 80)
                  _buildRecommendationItem(Icons.check_circle, '¡Excelente! Tu ciclo es muy regular. Mantén tus hábitos actuales.')
                else if (consistency >= 60)
                  _buildRecommendationItem(Icons.warning, 'Tu ciclo es moderadamente regular. Considera reducir el estrés.')
                else
                  _buildRecommendationItem(Icons.error, 'Tu ciclo es irregular. Consulta con un profesional de la salud.'),
                _buildRecommendationItem(Icons.fitness_center, 'El ejercicio regular puede ayudar a regularizar tu ciclo'),
                _buildRecommendationItem(Icons.bedtime, 'Mantén un horario de sueño consistente para regular tu ciclo'),
                _buildRecommendationItem(Icons.restaurant, 'Una dieta balanceada puede influir en la regularidad del ciclo'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRegularityCard({
    required IconData icon,
    required String title,
    required String number,
    required String label,
    required double progress,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurfaceVariant,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            number,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.white60,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: progress,
              backgroundColor: AppTheme.darkSurfaceVariant,
              valueColor: AlwaysStoppedAnimation<Color>(color),
              minHeight: 4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRangeItem(IconData icon, String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.darkSurfaceVariant,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 16),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.white70,
              ),
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  // ==================== RECORDATORIO DE CICLO ====================
  Widget _buildCycleReminder() {
    final activeReminders = _reminders.where((r) => r.isActive).toList();
    final inactiveReminders = _reminders.where((r) => !r.isActive).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionHeader(
            title: 'Recordatorios de Ciclo',
            subtitle: 'Gestiona tus recordatorios menstruales',
            icon: Icons.alarm,
            color: Colors.pink,
          ),
          const SizedBox(height: 20),
          
          // Estadísticas
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                    icon: Icons.alarm,
                    number: _reminders.length.toString(),
                    label: 'Total',
                    color: Colors.pink),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                    icon: Icons.check_circle,
                    number: activeReminders.length.toString(),
                    label: 'Activos',
                    color: Colors.green),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                    icon: Icons.calendar_today,
                    number: _reminders.where((r) => r.type == 'period_start' || r.type == 'period_end').length.toString(),
                    label: 'Período',
                    color: Colors.orange),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Recordatorios activos
          if (activeReminders.isNotEmpty) ...[
            Row(
              children: [
                const Icon(Icons.check_circle, color: Colors.green, size: 20),
                const SizedBox(width: 8),
                const Text(
                  'Recordatorios Activos',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ...activeReminders.map((reminder) => _buildReminderCard(reminder, true)),
            const SizedBox(height: 24),
          ],
          
          // Recordatorios inactivos
          if (inactiveReminders.isNotEmpty) ...[
            Row(
              children: [
                const Icon(Icons.pause_circle, color: Colors.red, size: 20),
                const SizedBox(width: 8),
                const Text(
                  'Recordatorios Inactivos',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ...inactiveReminders.map((reminder) => _buildReminderCard(reminder, false)),
            const SizedBox(height: 24),
          ],
          
          // Tipos de recordatorios
          Row(
            children: [
              const Icon(Icons.list, color: Colors.pink, size: 20),
              const SizedBox(width: 8),
              const Text(
                'Tipos de Recordatorios',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 1.5,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
            ),
            itemCount: _reminderTypes.length,
            itemBuilder: (context, index) {
              final type = _reminderTypes[index];
              return GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedReminderType = type['type'] as String;
                  });
                  _showAddReminderModal();
                },
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.darkSurfaceVariant,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: (type['color'] as Color).withOpacity(0.3),
                      width: 1,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        type['icon'] as IconData,
                        color: type['color'] as Color,
                        size: 32,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        type['label'] as String,
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppTheme.white,
                          fontWeight: FontWeight.w600,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildReminderCard(CycleReminder reminder, bool isActive) {
    final type = _reminderTypes.firstWhere(
      (t) => t['type'] == reminder.type,
      orElse: () => _reminderTypes[0],
    );

    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: isActive ? Colors.green : Colors.red,
          width: 2,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: (type['color'] as Color).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    type['icon'] as IconData,
                    color: type['color'] as Color,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        reminder.title,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      Text(
                        reminder.description,
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppTheme.white60,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: isActive ? Colors.green : Colors.red,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    isActive ? 'Activo' : 'Inactivo',
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 14, color: AppTheme.white60),
                const SizedBox(width: 4),
                Text(
                  reminder.date,
                  style: const TextStyle(fontSize: 12, color: AppTheme.white60),
                ),
                const SizedBox(width: 16),
                const Icon(Icons.access_time, size: 14, color: AppTheme.white60),
                const SizedBox(width: 4),
                Text(
                  reminder.time,
                  style: const TextStyle(fontSize: 12, color: AppTheme.white60),
                ),
                const SizedBox(width: 16),
                const Icon(Icons.repeat, size: 14, color: AppTheme.white60),
                const SizedBox(width: 4),
                Text(
                  _getRepeatLabel(reminder.repeat),
                  style: const TextStyle(fontSize: 12, color: AppTheme.white60),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showAddReminderModal() {
    _reminderTitleController.clear();
    _reminderDescriptionController.clear();
    DateTime selectedDate = DateTime.now();
    TimeOfDay? selectedTime = TimeOfDay.now();
    String selectedType = _selectedReminderType;
    String selectedRepeat = _selectedReminderRepeat;
    bool isSaving = false;

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: AppTheme.darkSurface,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              title: const Text(
                'Agregar Recordatorio',
                style: TextStyle(color: AppTheme.white),
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: _reminderTitleController,
                      decoration: const InputDecoration(
                        labelText: 'Título *',
                        labelStyle: TextStyle(color: AppTheme.white70),
                        border: OutlineInputBorder(),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.darkSurfaceVariant),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.pink),
                        ),
                      ),
                      style: const TextStyle(color: AppTheme.white),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _reminderDescriptionController,
                      decoration: const InputDecoration(
                        labelText: 'Descripción',
                        labelStyle: TextStyle(color: AppTheme.white70),
                        border: OutlineInputBorder(),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.darkSurfaceVariant),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.pink),
                        ),
                      ),
                      style: const TextStyle(color: AppTheme.white),
                      maxLines: 2,
                    ),
                    const SizedBox(height: 16),
                    ListTile(
                      leading: const Icon(Icons.calendar_today, color: Colors.pink),
                      title: const Text('Fecha', style: TextStyle(color: AppTheme.white)),
                      subtitle: Text(
                        DateFormat('d MMMM yyyy', 'es').format(selectedDate),
                        style: const TextStyle(color: AppTheme.white70),
                      ),
                      onTap: () async {
                        final picked = await showDatePicker(
                          context: context,
                          initialDate: selectedDate,
                          firstDate: DateTime.now(),
                          lastDate: DateTime.now().add(const Duration(days: 365)),
                        );
                        if (picked != null) {
                          setDialogState(() {
                            selectedDate = picked;
                          });
                        }
                      },
                    ),
                    const Divider(color: AppTheme.darkSurfaceVariant),
                    ListTile(
                      leading: const Icon(Icons.access_time, color: Colors.pink),
                      title: const Text('Hora', style: TextStyle(color: AppTheme.white)),
                      subtitle: Text(
                        selectedTime?.format(context) ?? 'Seleccionar hora',
                        style: const TextStyle(color: AppTheme.white70),
                      ),
                      onTap: () async {
                        final picked = await showTimePicker(
                          context: context,
                          initialTime: selectedTime ?? TimeOfDay.now(),
                        );
                        if (picked != null) {
                          setDialogState(() {
                            selectedTime = picked;
                          });
                        }
                      },
                    ),
                    const Divider(color: AppTheme.darkSurfaceVariant),
                    const Text(
                      'Tipo',
                      style: TextStyle(color: AppTheme.white, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: selectedType,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.darkSurfaceVariant),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.pink),
                        ),
                      ),
                      dropdownColor: AppTheme.darkSurface,
                      style: const TextStyle(color: AppTheme.white),
                      items: _reminderTypes.map((type) {
                        return DropdownMenuItem(
                          value: type['type'] as String,
                          child: Row(
                            children: [
                              Icon(type['icon'] as IconData, color: type['color'] as Color, size: 20),
                              const SizedBox(width: 8),
                              Text(type['label'] as String),
                            ],
                          ),
                        );
                      }).toList(),
                      onChanged: (value) {
                        if (value != null) {
                          setDialogState(() => selectedType = value);
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Repetir',
                      style: TextStyle(color: AppTheme.white, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      value: selectedRepeat,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.darkSurfaceVariant),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.pink),
                        ),
                      ),
                      dropdownColor: AppTheme.darkSurface,
                      style: const TextStyle(color: AppTheme.white),
                      items: const [
                        DropdownMenuItem(value: 'daily', child: Text('Diario')),
                        DropdownMenuItem(value: 'weekly', child: Text('Semanal')),
                        DropdownMenuItem(value: 'monthly', child: Text('Mensual')),
                        DropdownMenuItem(value: 'yearly', child: Text('Anual')),
                      ],
                      onChanged: (value) {
                        if (value != null) {
                          setDialogState(() => selectedRepeat = value);
                        }
                      },
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: isSaving ? null : () => Navigator.pop(context),
                  child: const Text('Cancelar', style: TextStyle(color: AppTheme.white60)),
                ),
                ElevatedButton(
                  onPressed: isSaving || _reminderTitleController.text.isEmpty
                      ? null
                      : () async {
                          setDialogState(() => isSaving = true);
                          final reminder = CycleReminder(
                            id: DateTime.now().millisecondsSinceEpoch.toString(),
                            title: _reminderTitleController.text,
                            description: _reminderDescriptionController.text,
                            date: DateFormat('yyyy-MM-dd').format(selectedDate),
                            time: selectedTime?.format(context) ?? '08:00',
                            type: selectedType,
                            isActive: true,
                            repeat: selectedRepeat,
                          );
                          setState(() {
                            _reminders.add(reminder);
                          });
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Recordatorio agregado correctamente')),
                          );
                        },
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.pink),
                  child: isSaving
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: AppTheme.white),
                        )
                      : const Text('Guardar'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  String _getRepeatLabel(String repeat) {
    switch (repeat) {
      case 'daily':
        return 'Diario';
      case 'weekly':
        return 'Semanal';
      case 'monthly':
        return 'Mensual';
      case 'yearly':
        return 'Anual';
      default:
        return 'Personalizado';
    }
  }

  // ==================== MONITOR DE FLUJO ====================
  Widget _buildFlowMonitor() {
    final flowStats = _calculateFlowStats();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildSectionHeader(
            title: 'Monitoreo del Flujo',
            subtitle: 'Análisis detallado de tu flujo menstrual',
            icon: Icons.analytics,
            color: Colors.pink,
          ),
          const SizedBox(height: 20),
          
          // Estadísticas
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                    icon: Icons.calendar_today,
                    number: flowStats['totalDays'].toString(),
                    label: 'Días Registrados',
                    color: Colors.pink),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                    icon: Icons.trending_up,
                    number: flowStats['averageIntensity'],
                    label: 'Intensidad Promedio',
                    color: Colors.orange),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                    icon: Icons.medical_services,
                    number: flowStats['mostCommonSymptom'],
                    label: 'Síntoma Común',
                    color: Colors.purple),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Análisis de intensidad
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.pink.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.bar_chart, color: Colors.pink, size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'Análisis de Intensidad',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildIntensityAnalysisItem(
                  'Pesado',
                  Colors.pink.shade500,
                  flowStats['heavyDays'] as int,
                  flowStats['totalDays'] as int,
                ),
                const SizedBox(height: 12),
                _buildIntensityAnalysisItem(
                  'Regular',
                  Colors.pink.shade300,
                  flowStats['regularDays'] as int,
                  flowStats['totalDays'] as int,
                ),
                const SizedBox(height: 12),
                _buildIntensityAnalysisItem(
                  'Ligero',
                  Colors.pink.shade100,
                  flowStats['lightDays'] as int,
                  flowStats['totalDays'] as int,
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Síntomas registrados
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.pink.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.medical_services, color: Colors.pink, size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'Síntomas Registrados',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ..._calculateSymptomsStats().map((item) => _buildSymptomItem(item)),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Recomendaciones
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.pink.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.lightbulb, color: Colors.pink, size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'Recomendaciones',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildRecommendationItem(Icons.check_circle, 'Mantén un registro diario para identificar patrones'),
                _buildRecommendationItem(Icons.check_circle, 'Consulta con tu médico si notas cambios significativos'),
                _buildRecommendationItem(Icons.check_circle, 'Lleva un diario de síntomas para mejor seguimiento'),
                _buildRecommendationItem(Icons.check_circle, 'Considera cambios en tu dieta y ejercicio'),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Map<String, dynamic> _calculateFlowStats() {
    if (_periodEntries.isEmpty) {
      return {
        'totalDays': 0,
        'heavyDays': 0,
        'regularDays': 0,
        'lightDays': 0,
        'averageIntensity': 'N/A',
        'mostCommonSymptom': 'N/A',
      };
    }
    
    final heavyDays = _periodEntries.where((e) => e.flow == 'heavy').length;
    final regularDays = _periodEntries.where((e) => e.flow == 'regular').length;
    final lightDays = _periodEntries.where((e) => e.flow == 'light').length;
    
    // Calcular intensidad promedio
    String averageIntensity = 'Regular';
    if (heavyDays > regularDays && heavyDays > lightDays) {
      averageIntensity = 'Pesado';
    } else if (lightDays > regularDays && lightDays > heavyDays) {
      averageIntensity = 'Ligero';
    }
    
    // Síntoma más común
    final symptomCounts = _calculateSymptomsStats();
    final mostCommonSymptom = symptomCounts.isEmpty ? 'N/A' : _getSymptomLabel(symptomCounts[0]['symptom'] as String);
    
    return {
      'totalDays': _periodEntries.length,
      'heavyDays': heavyDays,
      'regularDays': regularDays,
      'lightDays': lightDays,
      'averageIntensity': averageIntensity,
      'mostCommonSymptom': mostCommonSymptom,
    };
  }

  Widget _buildIntensityAnalysisItem(String label, Color color, int count, int total) {
    final percentage = total > 0 ? (count / total) : 0.0;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 12,
              height: 12,
              decoration: BoxDecoration(
                color: color,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppTheme.white,
              ),
            ),
            const Spacer(),
            Text(
              '$count días',
              style: const TextStyle(
                fontSize: 12,
                color: AppTheme.white60,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: LinearProgressIndicator(
            value: percentage,
            backgroundColor: AppTheme.darkSurfaceVariant,
            valueColor: AlwaysStoppedAnimation<Color>(color),
            minHeight: 8,
          ),
        ),
      ],
    );
  }

  // Funciones auxiliares
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

  IconData _getSymptomIcon(String symptom) {
    switch (symptom) {
      case 'cramps':
        return Icons.bolt;
      case 'headache':
        return Icons.medical_services;
      case 'acne':
        return Icons.face;
      case 'spotting':
        return Icons.water_drop;
      case 'stress':
        return Icons.trending_down;
      case 'sex':
        return Icons.favorite;
      default:
        return Icons.help_outline;
    }
  }

  String _getSymptomLabel(String symptom) {
    switch (symptom) {
      case 'cramps':
        return 'Cólicos';
      case 'headache':
        return 'Dolor de cabeza';
      case 'acne':
        return 'Acné';
      case 'spotting':
        return 'Manchado';
      case 'stress':
        return 'Estrés';
      case 'sex':
        return 'Sexo';
      default:
        return 'Otro';
    }
  }
}
