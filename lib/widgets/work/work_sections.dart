import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../models/work/weekly_task.dart';
import '../../models/work/work_meeting.dart';
import '../../models/work/daily_task.dart';
import '../../models/work/work_project.dart';
import '../../auth/providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../common/navigation_header.dart';

class WorkSections extends StatefulWidget {
  const WorkSections({super.key});

  @override
  State<WorkSections> createState() => _WorkSectionsState();
}

class _WorkSectionsState extends State<WorkSections> {
  String _activeSection = 'weekly';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  
  // Paleta de colores profesional para trabajo
  static const Color _professionalPrimary = Color(0xFF1E3A8A); // Navy Blue
  static const Color _professionalSecondary = Color(0xFF2563EB); // Professional Blue
  static const Color _professionalAccent = Color(0xFF3B82F6); // Bright Blue
  static const Color _professionalTeal = Color(0xFF0891B2); // Professional Teal
  static const Color _professionalSlate = Color(0xFF475569); // Professional Slate
  static const Color _professionalIndigo = Color(0xFF4338CA); // Deep Indigo
  
  List<WorkMeeting> _workMeetings = [];
  Map<DateTime, List<DailyTask>> _dailyTasks = {};
  List<WorkProject> _projects = [];
  List<Map<String, dynamic>> _priorities = []; // {id, text, completed}
  List<Map<String, dynamic>> _focus = []; // {id, text, completed}
  List<Map<String, dynamic>> _goals = []; // {id, text, completed}
  
  // Estados para formularios y modales
  final TextEditingController _weeklyTaskController = TextEditingController();
  final TextEditingController _dailyTaskController = TextEditingController();
  final TextEditingController _priorityController = TextEditingController();
  final TextEditingController _focusController = TextEditingController();
  final TextEditingController _goalController = TextEditingController();
  final TextEditingController _projectNameController = TextEditingController();
  final TextEditingController _projectDescriptionController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();
  
  DateTime? _selectedWeeklyDate = DateTime.now();
  DateTime? _selectedDailyDate = DateTime.now();
  TimeOfDay? _selectedDailyTime = TimeOfDay.now();
  DateTime? _selectedProjectDeadline;
  String _selectedWeeklyPriority = 'medium';
  String _selectedDailyPriority = 'medium';
  
  bool _showNotesModal = false;
  // WeeklyTask? _editingTask; // Obsoleto - reemplazado por WorkMeeting
  DailyTask? _editingDailyTask;
  bool _showAddProjectModal = false;
  List<ProjectGoal> _tempProjectGoals = [];
  final TextEditingController _tempGoalTextController = TextEditingController();

  final sections = [
    {'id': 'weekly', 'name': 'Sesiones', 'icon': Icons.event},
    {'id': 'daily', 'name': 'Tareas', 'icon': Icons.today},
    {'id': 'projects', 'name': 'Proyectos', 'icon': Icons.folder},
    {'id': 'strategy', 'name': 'Estrategia', 'icon': Icons.track_changes},
    {'id': 'priorities-focus-goals', 'name': 'Prioridades, Enfoque y Objetivos', 'icon': Icons.dashboard},
    {'id': 'planning', 'name': 'Planificación', 'icon': Icons.assignment},
  ];

  String _activeSubSection = 'priorities'; // Para la subsección agrupada

  // Funciones helper para prioridad
  Color _getPriorityColor(String priority) {
    switch (priority) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.orange;
      case 'low':
        return Colors.green;
      default:
        return _professionalAccent;
    }
  }

  IconData _getPriorityIcon(String priority) {
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

  String _getPriorityLabel(String priority) {
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

  @override
  void initState() {
    super.initState();
    // Inicializar la posición del scroll en el día actual
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final todayIndex = 14; // Día 15 (índice 14) es hoy
      _meetingDateScrollController.animateTo(
        todayIndex * 80.0, // Aproximadamente 80px por día
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    });
  }

  @override
  void dispose() {
    _weeklyTaskController.dispose();
    _dailyTaskController.dispose();
    _priorityController.dispose();
    _focusController.dispose();
    _goalController.dispose();
    _projectNameController.dispose();
    _projectDescriptionController.dispose();
    _notesController.dispose();
    _tempGoalTextController.dispose();
    _meetingDateScrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Determinar el FloatingActionButton según la sección activa
    Widget? floatingActionButton;
    if (_activeSection == 'weekly') {
      floatingActionButton = Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              _professionalPrimary,
              _professionalSecondary,
            ],
          ),
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: _professionalSecondary.withOpacity(0.4),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: FloatingActionButton.extended(
          onPressed: () => _showAddMeetingDialog(context),
          backgroundColor: Colors.transparent,
          elevation: 0,
          icon: const Icon(Icons.event, color: AppTheme.white),
          label: const Text(
            'Nueva Sesión',
            style: TextStyle(
              color: AppTheme.white,
              fontWeight: FontWeight.w600,
            ),
          ),
          tooltip: 'Agregar sesión',
        ),
      );
    } else if (_activeSection == 'daily') {
      floatingActionButton = Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              _professionalPrimary,
              _professionalSecondary,
            ],
          ),
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: _professionalSecondary.withOpacity(0.4),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: FloatingActionButton.extended(
          onPressed: () => _showAddDailyTaskDialog(context),
          backgroundColor: Colors.transparent,
          elevation: 0,
          icon: const Icon(Icons.add, color: AppTheme.white),
          label: const Text(
            'Nueva Tarea Diaria',
            style: TextStyle(
              color: AppTheme.white,
              fontWeight: FontWeight.w600,
            ),
          ),
          tooltip: 'Agregar tarea diaria',
        ),
      );
    } else if (_activeSection == 'projects') {
      floatingActionButton = Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              _professionalPrimary,
              _professionalSecondary,
            ],
          ),
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: _professionalSecondary.withOpacity(0.4),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: FloatingActionButton.extended(
          onPressed: () => setState(() => _showAddProjectModal = true),
          backgroundColor: Colors.transparent,
          elevation: 0,
          icon: const Icon(Icons.add, color: AppTheme.white),
          label: const Text(
            'Nuevo Proyecto',
            style: TextStyle(
              color: AppTheme.white,
              fontWeight: FontWeight.w600,
            ),
          ),
          tooltip: 'Agregar proyecto',
        ),
      );
    }

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: Colors.transparent,
      drawer: _buildNavigationDrawer(context),
      appBar: NavigationHeader(currentSection: 'work'),
      floatingActionButton: floatingActionButton,
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
          DrawerHeader(
            decoration: BoxDecoration(
              color: AppTheme.darkBackground,
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  _professionalPrimary.withOpacity(0.4),
                  _professionalSecondary.withOpacity(0.2),
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
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [_professionalSecondary, _professionalAccent],
                    ),
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
            color: _professionalSecondary,
            onTap: () {
              Navigator.pop(context);
              context.go('/main?section=profile');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.work_outline,
            title: 'Trabajo',
            color: _professionalSecondary,
            isActive: true,
            onTap: () {
              Navigator.pop(context);
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
            icon: Icons.restaurant,
            title: 'Nutrición',
            color: Colors.orange,
            onTap: () {
              Navigator.pop(context);
              context.go('/nutrition');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.fitness_center,
            title: 'Ejercicio',
            color: Colors.red,
            onTap: () {
              Navigator.pop(context);
              context.go('/exercise');
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
                    gradient: isActive 
                        ? LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              _professionalSecondary.withOpacity(0.3),
                              _professionalAccent.withOpacity(0.2),
                            ],
                          )
                        : null,
                    color: isActive ? null : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isActive 
                          ? _professionalSecondary 
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
                            ? _professionalAccent 
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
                                ? _professionalAccent 
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
      case 'weekly':
        return _buildWeeklyTasks();
      case 'daily':
        return _buildDailyTasks();
      case 'projects':
        return _buildProjects();
      case 'strategy':
        return _buildStrategy();
      case 'priorities-focus-goals':
        return _buildPrioritiesFocusGoals();
      case 'planning':
        return _buildPlanning();
      default:
        return _buildWeeklyTasks();
    }
  }

  DateTime _selectedMeetingDate = DateTime.now();
  final ScrollController _meetingDateScrollController = ScrollController();

  List<WorkMeeting> _getMeetingsForDate(DateTime date) {
    return _workMeetings.where((meeting) {
      try {
        final meetingDate = DateFormat('yyyy-MM-dd').parse(meeting.date);
        return meetingDate.year == date.year &&
               meetingDate.month == date.month &&
               meetingDate.day == date.day;
      } catch (e) {
        return false;
      }
    }).toList();
  }

  Widget _buildWeeklyTasks() {
    final todayMeetings = _getMeetingsForDate(_selectedMeetingDate);
    final isToday = _selectedMeetingDate.year == DateTime.now().year &&
                    _selectedMeetingDate.month == DateTime.now().month &&
                    _selectedMeetingDate.day == DateTime.now().day;

    return Column(
      children: [
        // Header con selector de fecha
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                _professionalPrimary.withOpacity(0.2),
                _professionalSecondary.withOpacity(0.15),
                _professionalAccent.withOpacity(0.1),
                AppTheme.darkSurface,
              ],
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: _professionalAccent.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.event, size: 16, color: _professionalAccent),
                                  const SizedBox(width: 6),
                                  Text(
                                    isToday ? 'Hoy' : DateFormat('EEEE, d MMMM', 'es').format(_selectedMeetingDate),
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: _professionalAccent,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Sesiones',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        if (todayMeetings.isNotEmpty)
                          Padding(
                            padding: const EdgeInsets.only(top: 4),
                            child: Text(
                              '${todayMeetings.length} evento${todayMeetings.length == 1 ? '' : 's'}',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppTheme.white60,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Selector de fecha con desplazamiento horizontal
                SizedBox(
                  height: 70,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    controller: _meetingDateScrollController,
                    itemCount: 30,
                    itemBuilder: (context, index) {
                      final date = DateTime.now().subtract(const Duration(days: 14)).add(Duration(days: index));
                      final dateIsSelected = _selectedMeetingDate.year == date.year &&
                                           _selectedMeetingDate.month == date.month &&
                                           _selectedMeetingDate.day == date.day;
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: _buildMeetingDateSelector(date, dateIsSelected),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
        Expanded(
          child: todayMeetings.isEmpty
              ? _buildEmptyState('No hay eventos para esta fecha', Icons.event_busy)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: todayMeetings.length,
                  itemBuilder: (context, index) => _buildMeetingCard(todayMeetings[index], index),
                ),
        ),
      ],
    );
  }

  Widget _buildMeetingDateSelector(DateTime date, bool isSelected) {
    final isToday = date.year == DateTime.now().year &&
                    date.month == DateTime.now().month &&
                    date.day == DateTime.now().day;
    
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedMeetingDate = date;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          gradient: isSelected 
              ? LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    _professionalAccent.withOpacity(0.3),
                    _professionalSecondary.withOpacity(0.2),
                  ],
                )
              : null,
          color: isSelected ? null : AppTheme.darkSurfaceVariant.withOpacity(0.5),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected 
                ? _professionalAccent 
                : Colors.transparent,
            width: 2,
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              DateFormat('EEE', 'es').format(date).substring(0, 3).toUpperCase(),
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: isSelected ? _professionalAccent : AppTheme.white60,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              '${date.day}',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: isSelected ? _professionalAccent : AppTheme.white,
              ),
            ),
            if (isToday)
              Container(
                margin: const EdgeInsets.only(top: 4),
                width: 4,
                height: 4,
                decoration: BoxDecoration(
                  color: _professionalAccent,
                  shape: BoxShape.circle,
                ),
              ),
          ],
        ),
      ),
    );
  }

  String _getMeetingTypeLabel(String? type) {
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

  IconData _getMeetingTypeIcon(String? type) {
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

  Widget _buildMeetingCard(WorkMeeting meeting, int index) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 300 + (index * 50)),
      curve: Curves.easeOut,
      builder: (context, value, child) {
        return Transform.translate(
          offset: Offset(0, 20 * (1 - value)),
          child: Opacity(
            opacity: value,
            child: child,
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              _professionalPrimary.withOpacity(0.15),
              _professionalSecondary.withOpacity(0.1),
              _professionalAccent.withOpacity(0.05),
              AppTheme.darkSurface,
            ],
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: _professionalAccent.withOpacity(0.4),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: _professionalSecondary.withOpacity(0.2),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Barra lateral con gradiente profesional
            Positioned(
              left: 0,
              top: 0,
              bottom: 0,
              child: Container(
                width: 6,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      _professionalPrimary,
                      _professionalSecondary,
                      _professionalAccent,
                    ],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    bottomLeft: Radius.circular(20),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Icono del evento
                      Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              _professionalAccent.withOpacity(0.4),
                              _professionalSecondary.withOpacity(0.3),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: _professionalAccent.withOpacity(0.5),
                            width: 1.5,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: _professionalAccent.withOpacity(0.3),
                              blurRadius: 8,
                              spreadRadius: 1,
                            ),
                          ],
                        ),
                        child: Icon(
                          _getMeetingTypeIcon(meeting.type),
                          color: AppTheme.white,
                          size: 28,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              meeting.name,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                            const SizedBox(height: 8),
                            // Tipo de evento
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    _professionalAccent.withOpacity(0.25),
                                    _professionalSecondary.withOpacity(0.15),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: _professionalAccent.withOpacity(0.3),
                                  width: 1,
                                ),
                              ),
                              child: Text(
                                _getMeetingTypeLabel(meeting.type),
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: _professionalAccent,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  if (meeting.time != null || meeting.location != null) ...[
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        if (meeting.time != null) ...[
                          Icon(Icons.access_time, size: 18, color: _professionalAccent,),
                          const SizedBox(width: 8),
                          Text(
                            meeting.time!,
                            style: TextStyle(
                              fontSize: 14,
                              color: AppTheme.white70,
                            ),
                          ),
                          if (meeting.location != null) const SizedBox(width: 16),
                        ],
                        if (meeting.location != null) ...[
                          Icon(Icons.location_on, size: 18, color: _professionalAccent),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              meeting.location!,
                              style: TextStyle(
                                fontSize: 14,
                                color: AppTheme.white70,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
  

  void _showAddMeetingDialog(BuildContext context) {
    final nameController = TextEditingController();
    final timeController = TextEditingController();
    final locationController = TextEditingController();
    String? selectedType;
    TimeOfDay? selectedTime;
    String? errorMessage;
    bool isSaving = false;

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: AppTheme.darkSurface,
              title: const Text(
                'Agregar Junta, Sesión o Cita',
                style: TextStyle(color: AppTheme.white),
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Mensaje de error visible
                    if (errorMessage != null) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.red,
                            width: 1,
                          ),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline, color: Colors.red, size: 20),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                errorMessage!,
                                style: const TextStyle(
                                  color: Colors.red,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.close, color: Colors.red, size: 18),
                              onPressed: () {
                                setDialogState(() {
                                  errorMessage = null;
                                });
                              },
                            ),
                          ],
                        ),
                      ),
                    ],
                    TextField(
                      controller: nameController,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        labelText: 'Nombre',
                        labelStyle: const TextStyle(color: AppTheme.white60),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _professionalAccent),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: selectedType,
                      decoration: InputDecoration(
                        labelText: 'Tipo',
                        labelStyle: const TextStyle(color: AppTheme.white60),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _professionalAccent),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      dropdownColor: AppTheme.darkSurface,
                      style: const TextStyle(color: AppTheme.white),
                      items: const [
                        DropdownMenuItem(value: 'meeting', child: Text('Junta', style: TextStyle(color: AppTheme.white))),
                        DropdownMenuItem(value: 'session', child: Text('Sesión', style: TextStyle(color: AppTheme.white))),
                        DropdownMenuItem(value: 'appointment', child: Text('Cita', style: TextStyle(color: AppTheme.white))),
                      ],
                      onChanged: (value) {
                        setDialogState(() {
                          selectedType = value;
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: timeController,
                            readOnly: true,
                            style: const TextStyle(color: AppTheme.white),
                            decoration: InputDecoration(
                              labelText: 'Hora',
                              labelStyle: const TextStyle(color: AppTheme.white60),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: AppTheme.white60),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: _professionalAccent),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              suffixIcon: const Icon(Icons.access_time, color: AppTheme.white60),
                            ),
                            onTap: () async {
                              final time = await showTimePicker(
                                context: context,
                                initialTime: TimeOfDay.now(),
                                builder: (context, child) {
                                  return Theme(
                                    data: ThemeData.dark().copyWith(
                                      colorScheme: ColorScheme.dark(
                                        primary: _professionalAccent,
                                        onPrimary: AppTheme.white,
                                        surface: AppTheme.darkSurface,
                                        onSurface: AppTheme.white,
                                      ),
                                    ),
                                    child: child!,
                                  );
                                },
                              );
                              if (time != null) {
                                setDialogState(() {
                                  selectedTime = time;
                                  timeController.text = '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
                                });
                              }
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: locationController,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        labelText: 'Ubicación (opcional)',
                        labelStyle: const TextStyle(color: AppTheme.white60),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _professionalAccent),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(dialogContext).pop(),
                  child: const Text(
                    'Cancelar',
                    style: TextStyle(color: AppTheme.white60),
                  ),
                ),
                ElevatedButton(
                  onPressed: isSaving ? null : () async {
                    setDialogState(() {
                      errorMessage = null;
                      isSaving = true;
                    });

                    if (nameController.text.isEmpty) {
                      setDialogState(() {
                        errorMessage = 'Por favor ingresa el nombre';
                        isSaving = false;
                      });
                      return;
                    }

                    setState(() {
                      _workMeetings.add(WorkMeeting(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        name: nameController.text.trim(),
                        date: DateFormat('yyyy-MM-dd').format(_selectedMeetingDate),
                        time: timeController.text.isNotEmpty ? timeController.text : null,
                        location: locationController.text.isNotEmpty ? locationController.text : null,
                        type: selectedType,
                        createdAt: DateTime.now(),
                      ));
                    });

                    Navigator.of(dialogContext).pop();
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Evento agregado exitosamente'),
                          backgroundColor: Colors.green,
                          duration: Duration(seconds: 2),
                        ),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _professionalAccent,
                    foregroundColor: AppTheme.white,
                    disabledBackgroundColor: AppTheme.darkSurfaceVariant,
                  ),
                  child: isSaving
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(AppTheme.white),
                          ),
                        )
                      : const Text('Agregar'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  
  Widget _buildSummaryCard({
    required IconData icon,
    required String value,
    required String label,
    required Color color,
    List<Color>? gradientColors,
  }) {
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
              color: AppTheme.white60,
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildNotesModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.darkSurface,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Notas de la Tarea',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: AppTheme.white),
                    onPressed: () {
                      setState(() {
                        _showNotesModal = false;
                        // _editingTask = null; // Obsoleto
                        _notesController.clear();
                      });
                    },
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _notesController,
                style: const TextStyle(color: AppTheme.white),
                maxLines: 6,
                decoration: InputDecoration(
                  hintText: 'Escribe notas adicionales...',
                  hintStyle: const TextStyle(color: AppTheme.white60),
                  filled: true,
                  fillColor: AppTheme.darkSurfaceVariant,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  // if (_editingTask != null) { // Obsoleto - función de notas para WeeklyTask
                  //   setState(() {
                  //     final index = _weeklyTasks.indexWhere((t) => t.id == _editingTask!.id);
                  //     if (index != -1) {
                  //       _weeklyTasks[index] = WeeklyTask(
                  //         id: _editingTask!.id,
                  //         task: _editingTask!.task,
                  //         date: _editingTask!.date,
                  //         completed: _editingTask!.completed,
                  //         notes: _notesController.text.trim(),
                  //         priority: _editingTask!.priority,
                  //       );
                  //     }
                  //   });
                  // }
                  setState(() {
                    _showNotesModal = false;
                    // _editingTask = null; // Obsoleto
                    _notesController.clear();
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.orangeAccent,
                  foregroundColor: AppTheme.white,
                ),
                child: const Text('Guardar'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDailyTasks() {
    final allTasks = _dailyTasks.values.expand((tasks) => tasks).toList();
    final completedTasks = allTasks.where((t) => t.completed).length;
    final totalTasks = allTasks.length;
    final todayTasks = allTasks.where((t) => 
      t.date.year == DateTime.now().year &&
      t.date.month == DateTime.now().month &&
      t.date.day == DateTime.now().day
    ).length;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header mejorado con paleta profesional
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  _professionalPrimary,
                  _professionalSecondary,
                  _professionalAccent,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: _professionalSecondary.withOpacity(0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: const Icon(Icons.today, color: AppTheme.white, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Tareas',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const Text(
                        'Organiza tu trabajo día a día',
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
          
          // Resumen de tareas
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle_outline,
                  value: '$completedTasks/$totalTasks',
                  label: 'Completadas',
                  color: _professionalTeal,
                  gradientColors: [_professionalTeal, _professionalAccent],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.today,
                  value: '$todayTasks',
                  label: 'Hoy',
                  color: _professionalAccent,
                  gradientColors: [_professionalAccent, _professionalSecondary],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          // Lista de tareas
          if (_dailyTasks.isEmpty)
            _buildEmptyState('No hay tareas', Icons.today)
          else
            ..._dailyTasks.entries.map((entry) => _buildDailyTaskCard(entry.key, entry.value)),
        ],
      ),
    );
  }
  
  void _addDailyTask() {
    if (_dailyTaskController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingresa una tarea')),
      );
      return;
    }
    
    final date = _selectedDailyDate ?? DateTime.now();
    final time = _selectedDailyTime ?? TimeOfDay.now();
    final dateTime = DateTime(
      date.year,
      date.month,
      date.day,
      time.hour,
      time.minute,
    );
    
    setState(() {
      final dateKey = DateTime(date.year, date.month, date.day);
      if (!_dailyTasks.containsKey(dateKey)) {
        _dailyTasks[dateKey] = [];
      }
      _dailyTasks[dateKey]!.add(DailyTask(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        task: _dailyTaskController.text.trim(),
        date: date,
        time: dateTime,
        completed: false,
        priority: _selectedDailyPriority,
      ));
      _dailyTaskController.clear();
      _selectedDailyDate = DateTime.now();
      _selectedDailyTime = TimeOfDay.now();
      _selectedDailyPriority = 'medium';
    });
  }

  void _showAddDailyTaskDialog(BuildContext context) {
    final taskController = TextEditingController();
    final dateController = TextEditingController();
    final timeController = TextEditingController();
    DateTime? selectedDate = DateTime.now();
    TimeOfDay? selectedTime = TimeOfDay.now();
    String? selectedPriority = 'medium';
    String? errorMessage;
    bool isSaving = false;

    // Inicializar los controladores con valores por defecto
    dateController.text = selectedDate != null
        ? '${selectedDate.day}/${selectedDate.month}/${selectedDate.year}'
        : 'Seleccionar fecha';
    timeController.text = selectedTime != null
        ? '${selectedTime.hour.toString().padLeft(2, '0')}:${selectedTime.minute.toString().padLeft(2, '0')}'
        : 'Hora';

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: AppTheme.darkSurface,
              title: const Text(
                'Agregar Tarea Diaria',
                style: TextStyle(color: AppTheme.white),
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Mensaje de error visible
                    if (errorMessage != null) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.red,
                            width: 1,
                          ),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline, color: Colors.red, size: 20),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                errorMessage!,
                                style: const TextStyle(
                                  color: Colors.red,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.close, color: Colors.red, size: 18),
                              onPressed: () {
                                setDialogState(() {
                                  errorMessage = null;
                                });
                              },
                            ),
                          ],
                        ),
                      ),
                    ],
                    TextField(
                      controller: taskController,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        labelText: 'Tarea',
                        labelStyle: const TextStyle(color: AppTheme.white60),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _professionalAccent),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: dateController,
                            readOnly: true,
                            style: const TextStyle(color: AppTheme.white),
                            decoration: InputDecoration(
                              labelText: 'Fecha',
                              labelStyle: const TextStyle(color: AppTheme.white60),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: AppTheme.white60),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: _professionalAccent),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              suffixIcon: const Icon(Icons.calendar_today, color: AppTheme.white60),
                            ),
                            onTap: () async {
                              final date = await showDatePicker(
                                context: context,
                                initialDate: selectedDate ?? DateTime.now(),
                                firstDate: DateTime(2020),
                                lastDate: DateTime(2030),
                                builder: (context, child) {
                                  return Theme(
                                    data: ThemeData.dark().copyWith(
                                      colorScheme: ColorScheme.dark(
                                        primary: _professionalAccent,
                                        onPrimary: AppTheme.white,
                                        surface: AppTheme.darkSurface,
                                        onSurface: AppTheme.white,
                                      ),
                                    ),
                                    child: child!,
                                  );
                                },
                              );
                              if (date != null) {
                                setDialogState(() {
                                  selectedDate = date;
                                  dateController.text = '${date.day}/${date.month}/${date.year}';
                                });
                              }
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: timeController,
                            readOnly: true,
                            style: const TextStyle(color: AppTheme.white),
                            decoration: InputDecoration(
                              labelText: 'Hora',
                              labelStyle: const TextStyle(color: AppTheme.white60),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: AppTheme.white60),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: _professionalAccent),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              suffixIcon: const Icon(Icons.access_time, color: AppTheme.white60),
                            ),
                            onTap: () async {
                              final time = await showTimePicker(
                                context: context,
                                initialTime: selectedTime ?? TimeOfDay.now(),
                                builder: (context, child) {
                                  return Theme(
                                    data: ThemeData.dark().copyWith(
                                      colorScheme: ColorScheme.dark(
                                        primary: _professionalAccent,
                                        onPrimary: AppTheme.white,
                                        surface: AppTheme.darkSurface,
                                        onSurface: AppTheme.white,
                                      ),
                                    ),
                                    child: child!,
                                  );
                                },
                              );
                              if (time != null) {
                                setDialogState(() {
                                  selectedTime = time;
                                  timeController.text = '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
                                });
                              }
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: selectedPriority,
                      decoration: InputDecoration(
                        labelText: 'Prioridad',
                        labelStyle: const TextStyle(color: AppTheme.white60),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _professionalAccent),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      dropdownColor: AppTheme.darkSurface,
                      style: const TextStyle(color: AppTheme.white),
                      items: [
                        DropdownMenuItem(
                          value: 'high',
                          child: Row(
                            children: [
                              Icon(
                                _getPriorityIcon('high'),
                                size: 16,
                                color: _getPriorityColor('high'),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                _getPriorityLabel('high'),
                                style: const TextStyle(color: AppTheme.white),
                              ),
                            ],
                          ),
                        ),
                        DropdownMenuItem(
                          value: 'medium',
                          child: Row(
                            children: [
                              Icon(
                                _getPriorityIcon('medium'),
                                size: 16,
                                color: _getPriorityColor('medium'),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                _getPriorityLabel('medium'),
                                style: const TextStyle(color: AppTheme.white),
                              ),
                            ],
                          ),
                        ),
                        DropdownMenuItem(
                          value: 'low',
                          child: Row(
                            children: [
                              Icon(
                                _getPriorityIcon('low'),
                                size: 16,
                                color: _getPriorityColor('low'),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                _getPriorityLabel('low'),
                                style: const TextStyle(color: AppTheme.white),
                              ),
                            ],
                          ),
                        ),
                      ],
                      onChanged: (value) {
                        setDialogState(() {
                          selectedPriority = value;
                        });
                      },
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(dialogContext).pop(),
                  child: const Text(
                    'Cancelar',
                    style: TextStyle(color: AppTheme.white60),
                  ),
                ),
                ElevatedButton(
                  onPressed: isSaving ? null : () async {
                    // Limpiar error anterior
                    setDialogState(() {
                      errorMessage = null;
                      isSaving = true;
                    });

                    if (taskController.text.trim().isEmpty) {
                      setDialogState(() {
                        errorMessage = 'Por favor ingresa la descripción de la tarea';
                        isSaving = false;
                      });
                      return;
                    }

                    final date = selectedDate ?? DateTime.now();
                    final time = selectedTime ?? TimeOfDay.now();
                    final dateTime = DateTime(
                      date.year,
                      date.month,
                      date.day,
                      time.hour,
                      time.minute,
                    );

                    setState(() {
                      final dateKey = DateTime(date.year, date.month, date.day);
                      if (!_dailyTasks.containsKey(dateKey)) {
                        _dailyTasks[dateKey] = [];
                      }
                      _dailyTasks[dateKey]!.add(DailyTask(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        task: taskController.text.trim(),
                        date: date,
                        time: dateTime,
                        completed: false,
                        priority: selectedPriority ?? 'medium',
                      ));
                    });

                    Navigator.of(dialogContext).pop();
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Tarea diaria agregada exitosamente'),
                          backgroundColor: Colors.green,
                          duration: Duration(seconds: 2),
                        ),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _professionalAccent,
                    foregroundColor: AppTheme.white,
                    disabledBackgroundColor: AppTheme.darkSurfaceVariant,
                  ),
                  child: isSaving
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(AppTheme.white),
                          ),
                        )
                      : const Text('Agregar'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Widget _buildProjects() {
    final completedProjects = _projects.where((p) {
      if (p.goals.isEmpty) return false;
      final completedGoals = p.goals.where((g) => g.completed == true).length;
      return completedGoals == p.goals.length && p.goals.isNotEmpty;
    }).length;
    final activeProjects = _projects.length - completedProjects;
    final totalGoals = _projects.fold(0, (sum, p) => sum + p.goals.length);
    final completedGoals = _projects.fold(0, (sum, p) => sum + p.goals.where((g) => g.completed == true).length);
    
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header mejorado con gradiente profesional
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      _professionalPrimary,
                      _professionalSecondary,
                      _professionalAccent,
                    ],
                  ),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(
                      color: _professionalSecondary.withOpacity(0.3),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Colors.white.withOpacity(0.3),
                            Colors.white.withOpacity(0.1),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(32),
                        border: Border.all(
                          color: Colors.white.withOpacity(0.2),
                          width: 2,
                        ),
                      ),
                      child: const Icon(Icons.folder_special, color: AppTheme.white, size: 32),
                    ),
                    const SizedBox(width: 20),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Proyectos',
                            style: TextStyle(
                              fontSize: 26,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Gestiona y organiza tus proyectos',
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
              
              // Resumen de proyectos mejorado
              Row(
                children: [
                  Expanded(
                    child: _buildSummaryCard(
                      icon: Icons.rocket_launch,
                      value: '$activeProjects',
                      label: 'Proyectos Activos',
                      color: _professionalAccent,
                      gradientColors: [_professionalAccent, _professionalSecondary],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSummaryCard(
                      icon: Icons.check_circle,
                      value: '$completedProjects',
                      label: 'Completados',
                      color: _professionalTeal,
                      gradientColors: [_professionalTeal, Colors.green],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildSummaryCard(
                      icon: Icons.flag,
                      value: '$completedGoals/$totalGoals',
                      label: 'Metas',
                      color: _professionalIndigo,
                      gradientColors: [_professionalIndigo, _professionalAccent],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              
              // Lista de proyectos
              if (_projects.isEmpty)
                _buildEmptyState(
                  'No hay proyectos creados',
                  Icons.folder_open,
                  'Crea tu primer proyecto para comenzar',
                  'Nuevo Proyecto',
                  () {
                    setState(() {
                      _showAddProjectModal = true;
                    });
                  },
                  _professionalAccent,
                  [_professionalPrimary, _professionalSecondary],
                )
              else
                ..._projects.asMap().entries.map((entry) {
                  final index = entry.key;
                  final project = entry.value;
                  return _buildProjectCard(project, index);
                }),
            ],
          ),
        ),
        
        // Modal para agregar proyecto
        if (_showAddProjectModal) _buildAddProjectModal(),
      ],
    );
  }
  
  Widget _buildAddProjectModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.darkSurface,
            borderRadius: BorderRadius.circular(16),
          ),
          constraints: const BoxConstraints(maxHeight: 600),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Nuevo Proyecto',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () {
                        setState(() {
                          _showAddProjectModal = false;
                          _projectNameController.clear();
                          _projectDescriptionController.clear();
                          _tempProjectGoals.clear();
                          _tempGoalTextController.clear();
                          _selectedProjectDeadline = null;
                        });
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                
                // Nombre del proyecto
                TextField(
                  controller: _projectNameController,
                  style: const TextStyle(color: AppTheme.white),
                  decoration: InputDecoration(
                    labelText: 'Nombre del Proyecto *',
                    labelStyle: const TextStyle(color: AppTheme.white60),
                    filled: true,
                    fillColor: AppTheme.darkSurfaceVariant,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                
                // Descripción
                TextField(
                  controller: _projectDescriptionController,
                  style: const TextStyle(color: AppTheme.white),
                  maxLines: 3,
                  decoration: InputDecoration(
                    labelText: 'Descripción',
                    labelStyle: const TextStyle(color: AppTheme.white60),
                    filled: true,
                    fillColor: AppTheme.darkSurfaceVariant,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                
                // Fecha límite
                OutlinedButton.icon(
                  onPressed: () async {
                    final date = await showDatePicker(
                      context: context,
                      initialDate: _selectedProjectDeadline ?? DateTime.now(),
                      firstDate: DateTime(2020),
                      lastDate: DateTime(2030),
                    );
                    if (date != null) {
                      setState(() => _selectedProjectDeadline = date);
                    }
                  },
                  icon: const Icon(Icons.calendar_today),
                  label: Text(
                    _selectedProjectDeadline != null
                        ? 'Fecha límite: ${_selectedProjectDeadline!.day}/${_selectedProjectDeadline!.month}/${_selectedProjectDeadline!.year}'
                        : 'Seleccionar fecha límite',
                  ),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppTheme.white60,
                    side: const BorderSide(color: AppTheme.white60),
                  ),
                ),
                const SizedBox(height: 20),
                
                // Metas del proyecto
                const Text(
                  'Metas del Proyecto',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _tempGoalTextController,
                        style: const TextStyle(color: AppTheme.white),
                        decoration: InputDecoration(
                          hintText: 'Escribe una meta...',
                          hintStyle: const TextStyle(color: AppTheme.white60),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        if (_tempGoalTextController.text.trim().isNotEmpty) {
                          setState(() {
                            _tempProjectGoals.add(ProjectGoal(
                              id: DateTime.now().millisecondsSinceEpoch.toString(),
                              text: _tempGoalTextController.text.trim(),
                            ));
                            _tempGoalTextController.clear();
                          });
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.orangeAccent,
                        foregroundColor: AppTheme.white,
                        shape: const CircleBorder(),
                        padding: const EdgeInsets.all(12),
                      ),
                      child: const Icon(Icons.add),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                if (_tempProjectGoals.isNotEmpty)
                  ..._tempProjectGoals.asMap().entries.map((entry) {
                    final index = entry.key;
                    final goal = entry.value;
                    return Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.darkSurfaceVariant,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          Text(
                            '${index + 1}. ${goal.text}',
                            style: const TextStyle(color: AppTheme.white),
                          ),
                          const Spacer(),
                          IconButton(
                            icon: const Icon(Icons.close, size: 18, color: Colors.red),
                            onPressed: () {
                              setState(() {
                                _tempProjectGoals.removeWhere((g) => g.id == goal.id);
                              });
                            },
                          ),
                        ],
                      ),
                    );
                  }),
                const SizedBox(height: 20),
                
                // Botones de acción
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () {
                        setState(() {
                          _showAddProjectModal = false;
                          _projectNameController.clear();
                          _projectDescriptionController.clear();
                          _tempProjectGoals.clear();
                          _tempGoalTextController.clear();
                          _selectedProjectDeadline = null;
                        });
                      },
                      child: const Text('Cancelar'),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton(
                      onPressed: _addProject,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.orangeAccent,
                        foregroundColor: AppTheme.white,
                      ),
                      child: const Text('Crear Proyecto'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  void _addProject() {
    if (_projectNameController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingresa un nombre para el proyecto')),
      );
      return;
    }
    
    setState(() {
      _projects.add(WorkProject(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: _projectNameController.text.trim(),
        aim: _projectDescriptionController.text.trim(),
        deadline: _selectedProjectDeadline,
        teammates: [],
        achievements: [],
        works: [],
        funding: [],
        goals: _tempProjectGoals,
      ));
      _showAddProjectModal = false;
      _projectNameController.clear();
      _projectDescriptionController.clear();
      _tempProjectGoals.clear();
      _tempGoalTextController.clear();
      _selectedProjectDeadline = null;
    });
  }

  Widget _buildStrategy() {
    final totalProjects = _projects.length;
    final completedProjects = _projects.where((p) {
      if (p.goals.isEmpty) return false;
      final completedGoals = p.goals.where((g) => g.completed == true).length;
      return completedGoals == p.goals.length && p.goals.isNotEmpty;
    }).length;
    final overdueProjects = _projects.where((p) {
      if (p.deadline == null || p.goals.isEmpty) return false;
      final completedGoals = p.goals.where((g) => g.completed == true).length;
      return p.deadline!.isBefore(DateTime.now()) && completedGoals < p.goals.length;
    }).length;
    final activeProjects = totalProjects - completedProjects;
    
    // Calcular estadísticas avanzadas
    final totalGoals = _projects.fold(0, (sum, p) => sum + p.goals.length);
    final completedGoals = _projects.fold(0, (sum, p) => sum + p.goals.where((g) => g.completed == true).length);
    final overallProgress = totalGoals > 0 ? ((completedGoals / totalGoals) * 100).round() : 0;
    
    // Proyectos próximos a vencer (en los próximos 7 días)
    final upcomingDeadlines = _projects.where((p) {
      if (p.deadline == null) return false;
      final daysUntilDeadline = p.deadline!.difference(DateTime.now()).inDays;
      return daysUntilDeadline >= 0 && daysUntilDeadline <= 7;
    }).length;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header mejorado con gradiente profesional
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  _professionalPrimary,
                  _professionalSecondary,
                  _professionalAccent,
                  _professionalIndigo,
                ],
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: _professionalSecondary.withOpacity(0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
                BoxShadow(
                  color: _professionalIndigo.withOpacity(0.2),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Colors.white.withOpacity(0.3),
                        Colors.white.withOpacity(0.1),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(32),
                    border: Border.all(
                      color: Colors.white.withOpacity(0.2),
                      width: 2,
                    ),
                  ),
                  child: const Icon(Icons.track_changes, color: AppTheme.white, size: 32),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Estrategia de Proyectos',
                        style: TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Vista general y supervisión estratégica',
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
          
          // Progreso general mejorado
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  _professionalIndigo.withOpacity(0.15),
                  _professionalAccent.withOpacity(0.1),
                  AppTheme.darkSurface,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: _professionalIndigo.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [_professionalIndigo, _professionalAccent],
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.trending_up, color: AppTheme.white, size: 24),
                        ),
                        const SizedBox(width: 12),
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Progreso General',
                              style: TextStyle(
                                fontSize: 14,
                                color: AppTheme.white60,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Todas las metas',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppTheme.white40,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [_professionalIndigo, _professionalAccent],
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '$overallProgress%',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Container(
                  height: 12,
                  decoration: BoxDecoration(
                    color: AppTheme.darkSurfaceVariant,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Stack(
                    children: [
                      FractionallySizedBox(
                        alignment: Alignment.centerLeft,
                        widthFactor: overallProgress / 100,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                _professionalIndigo,
                                _professionalAccent,
                                _professionalTeal,
                              ],
                            ),
                            borderRadius: BorderRadius.circular(6),
                            boxShadow: [
                              BoxShadow(
                                color: _professionalIndigo.withOpacity(0.6),
                                blurRadius: 8,
                                spreadRadius: 1,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '$completedGoals de $totalGoals metas completadas',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                    Text(
                      '${totalProjects} proyecto${totalProjects == 1 ? '' : 's'}',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Estadísticas del dashboard mejoradas
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.rocket_launch,
                  value: '$activeProjects',
                  label: 'Activos',
                  color: _professionalAccent,
                  gradientColors: [_professionalAccent, _professionalSecondary],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle,
                  value: '$completedProjects',
                  label: 'Completados',
                  color: _professionalTeal,
                  gradientColors: [_professionalTeal, Colors.green],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.warning_amber,
                  value: '$overdueProjects',
                  label: 'En Retraso',
                  color: Colors.red,
                  gradientColors: [Colors.red, Colors.red.shade700],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.access_time,
                  value: '$upcomingDeadlines',
                  label: 'Próximos',
                  color: Colors.orange,
                  gradientColors: [Colors.orange, Colors.deepOrange],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Lista de proyectos con título
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [_professionalPrimary, _professionalSecondary],
                      ),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.folder_special, color: AppTheme.white, size: 20),
                  ),
                  const SizedBox(width: 12),
                  const Text(
                    'Mis Proyectos',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: _professionalAccent.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  '$totalProjects',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: _professionalAccent,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          
          // Lista de proyectos
          if (_projects.isEmpty)
            _buildEmptyState(
              'No hay proyectos creados',
              Icons.dashboard_customize,
              'Crea proyectos para ver tu estrategia',
              'Nuevo Proyecto',
              () {
                setState(() {
                  _showAddProjectModal = true;
                });
              },
              _professionalAccent,
              [_professionalPrimary, _professionalSecondary],
            )
          else
            ..._projects.asMap().entries.map((entry) {
              final index = entry.key;
              final project = entry.value;
              return _buildProjectCard(project, index);
            }),
        ],
      ),
    );
  }

  Widget _buildPriorities() {
    final priorityColors = [
      _professionalIndigo,
      _professionalTeal,
      _professionalSecondary,
      _professionalAccent,
      _professionalSlate,
    ];
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header mejorado con paleta profesional
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  _professionalPrimary,
                  _professionalSecondary,
                  _professionalAccent,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: _professionalSecondary.withOpacity(0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: const Icon(Icons.priority_high, color: AppTheme.white, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Prioridades',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const Text(
                        'Define y gestiona tus prioridades clave',
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
          
          // Formulario para agregar prioridad
          if (_priorities.length < 5)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _priorityController,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        hintText: 'Escribe una nueva prioridad...',
                        hintStyle: const TextStyle(color: AppTheme.white60),
                        filled: true,
                        fillColor: AppTheme.darkSurfaceVariant,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: (_) => _addPriority(),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: _addPriority,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _professionalAccent,
                      foregroundColor: AppTheme.white,
                      shape: const CircleBorder(),
                      padding: const EdgeInsets.all(12),
                    ),
                    child: const Icon(Icons.add),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 20),
          
          // Lista de prioridades
          if (_priorities.isEmpty)
            _buildEmptyState('No hay prioridades definidas\nEscribe una prioridad arriba y toca el botón +', Icons.priority_high)
          else
            ..._priorities.asMap().entries.map((entry) {
              final index = entry.key;
              final priority = entry.value;
              return _buildPriorityCard(priority, index, priorityColors);
            }),
        ],
      ),
    );
  }
  
  void _addPriority() {
    if (_priorityController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingresa una prioridad')),
      );
      return;
    }
    
    if (_priorities.length >= 5) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Solo puedes tener 5 prioridades')),
      );
      return;
    }
    
    setState(() {
      _priorities.add({
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'text': _priorityController.text.trim(),
        'completed': false,
      });
      _priorityController.clear();
    });
  }

  Widget _buildPrioritiesFocusGoals() {
    return Column(
      children: [
        // Header mejorado con paleta profesional
        Container(
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                _professionalPrimary,
                _professionalSecondary,
                _professionalAccent,
              ],
            ),
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: _professionalSecondary.withOpacity(0.3),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: const Icon(Icons.dashboard, color: AppTheme.white, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Gestión de prioridades',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const Text(
                      'Gestiona tus prioridades, áreas de enfoque y objetivos',
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
        
        // Pestañas para navegar entre las tres secciones
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16),
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: AppTheme.darkSurfaceVariant,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Expanded(
                child: _buildSubSectionTab('priorities', 'Prioridades', Icons.priority_high),
              ),
              Expanded(
                child: _buildSubSectionTab('focus', 'Enfoque', Icons.center_focus_strong),
              ),
              Expanded(
                child: _buildSubSectionTab('goals', 'Objetivos', Icons.flag),
              ),
            ],
          ),
        ),
        
        // Contenido según la pestaña activa
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: _activeSubSection == 'priorities'
                ? _buildPrioritiesContent()
                : _activeSubSection == 'focus'
                    ? _buildFocusContent()
                    : _buildGoalsContent(),
          ),
        ),
      ],
    );
  }

  Widget _buildSubSectionTab(String id, String label, IconData icon) {
    final isActive = _activeSubSection == id;
    return GestureDetector(
      onTap: () {
        setState(() {
          _activeSubSection = id;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          gradient: isActive
              ? LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [_professionalPrimary, _professionalSecondary],
                )
              : null,
          color: isActive ? null : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 20,
              color: isActive ? AppTheme.white : AppTheme.white60,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                color: isActive ? AppTheme.white : AppTheme.white60,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPrioritiesContent() {
    final priorityColors = [
      _professionalIndigo,
      _professionalTeal,
      _professionalSecondary,
      _professionalAccent,
      _professionalSlate,
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Formulario para agregar prioridad
        if (_priorities.length < 5)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _priorityController,
                    style: const TextStyle(color: AppTheme.white),
                    decoration: InputDecoration(
                      hintText: 'Escribe una nueva prioridad...',
                      hintStyle: const TextStyle(color: AppTheme.white60),
                      filled: true,
                      fillColor: AppTheme.darkSurfaceVariant,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    onSubmitted: (_) => _addPriority(),
                  ),
                ),
                const SizedBox(width: 12),
                ElevatedButton(
                  onPressed: _addPriority,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _professionalAccent,
                    foregroundColor: AppTheme.white,
                    shape: const CircleBorder(),
                    padding: const EdgeInsets.all(12),
                  ),
                  child: const Icon(Icons.add),
                ),
              ],
            ),
          ),
        const SizedBox(height: 20),
        
        // Lista de prioridades
        if (_priorities.isEmpty)
          _buildEmptyState('No hay prioridades definidas\nEscribe una prioridad arriba y toca el botón +', Icons.priority_high)
        else
          ..._priorities.asMap().entries.map((entry) {
            final index = entry.key;
            final priority = entry.value;
            return _buildPriorityCard(priority, index, priorityColors);
          }),
      ],
    );
  }

  Widget _buildFocusContent() {
    final focusColors = [Colors.indigo, Colors.cyan, Colors.purple, Colors.pink, Colors.orange];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Formulario para agregar enfoque
        if (_focus.length < 5)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _focusController,
                    style: const TextStyle(color: AppTheme.white),
                    decoration: InputDecoration(
                      hintText: 'Escribe un nuevo enfoque...',
                      hintStyle: const TextStyle(color: AppTheme.white60),
                      filled: true,
                      fillColor: AppTheme.darkSurfaceVariant,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    onSubmitted: (_) => _addFocus(),
                  ),
                ),
                const SizedBox(width: 12),
                ElevatedButton(
                  onPressed: _addFocus,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _professionalAccent,
                    foregroundColor: AppTheme.white,
                    shape: const CircleBorder(),
                    padding: const EdgeInsets.all(12),
                  ),
                  child: const Icon(Icons.add),
                ),
              ],
            ),
          ),
        const SizedBox(height: 20),
        
        // Lista de enfoques
        if (_focus.isEmpty)
          _buildEmptyState('No hay enfoques definidos\nEscribe un enfoque arriba y toca el botón +', Icons.center_focus_strong)
        else
          ..._focus.asMap().entries.map((entry) {
            final index = entry.key;
            final focusItem = entry.value;
            return _buildFocusCard(focusItem, index, focusColors);
          }),
      ],
    );
  }

  Widget _buildGoalsContent() {
    final goalsColors = [Colors.green, Colors.teal, Colors.amber, Colors.red, Colors.grey];
    final completedGoals = _goals.where((g) => g['completed'] == true).length;
    final totalGoals = _goals.length;
    final progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals * 100).round() : 0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Resumen de objetivos
        Row(
          children: [
            Expanded(
              child: _buildSummaryCard(
                icon: Icons.check_circle_outline,
                value: '$completedGoals/$totalGoals',
                label: 'Completados',
                color: _professionalTeal,
                gradientColors: [_professionalTeal, _professionalAccent],
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildSummaryCard(
                icon: Icons.trending_up,
                value: '$progressPercentage%',
                label: 'Progreso',
                color: _professionalAccent,
                gradientColors: [_professionalAccent, _professionalSecondary],
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        
        // Formulario para agregar objetivo
        if (_goals.length < 5)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _goalController,
                    style: const TextStyle(color: AppTheme.white),
                    decoration: InputDecoration(
                      hintText: 'Escribe un nuevo objetivo...',
                      hintStyle: const TextStyle(color: AppTheme.white60),
                      filled: true,
                      fillColor: AppTheme.darkSurfaceVariant,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    onSubmitted: (_) => _addGoal(),
                  ),
                ),
                const SizedBox(width: 12),
                ElevatedButton(
                  onPressed: _addGoal,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _professionalAccent,
                    foregroundColor: AppTheme.white,
                    shape: const CircleBorder(),
                    padding: const EdgeInsets.all(12),
                  ),
                  child: const Icon(Icons.add),
                ),
              ],
            ),
          ),
        const SizedBox(height: 20),
        
        // Lista de objetivos
        if (_goals.isEmpty)
          _buildEmptyState('No hay objetivos definidos\nDefine tus objetivos para comenzar', Icons.flag)
        else
          ..._goals.asMap().entries.map((entry) {
            final index = entry.key;
            final goal = entry.value;
            return _buildGoalCard(goal, index, goalsColors);
          }),
      ],
    );
  }

  Widget _buildFocus() {
    final focusColors = [Colors.indigo, Colors.cyan, Colors.purple, Colors.pink, Colors.orange];
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header mejorado con paleta profesional
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  _professionalPrimary,
                  _professionalSecondary,
                  _professionalAccent,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: _professionalSecondary.withOpacity(0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: const Icon(Icons.center_focus_strong, color: AppTheme.white, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Enfoque',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const Text(
                        'Define tus áreas de enfoque y concentración',
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
          
          // Formulario para agregar enfoque
          if (_focus.length < 5)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _focusController,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        hintText: 'Escribe un nuevo enfoque...',
                        hintStyle: const TextStyle(color: AppTheme.white60),
                        filled: true,
                        fillColor: AppTheme.darkSurfaceVariant,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: (_) => _addFocus(),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: _addFocus,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _professionalAccent,
                      foregroundColor: AppTheme.white,
                      shape: const CircleBorder(),
                      padding: const EdgeInsets.all(12),
                    ),
                    child: const Icon(Icons.add),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 20),
          
          // Lista de enfoques
          if (_focus.isEmpty)
            _buildEmptyState('No hay enfoques definidos\nEscribe un enfoque arriba y toca el botón +', Icons.center_focus_strong)
          else
            ..._focus.asMap().entries.map((entry) {
              final index = entry.key;
              final focusItem = entry.value;
              return _buildFocusCard(focusItem, index, focusColors);
            }),
        ],
      ),
    );
  }
  
  void _addFocus() {
    if (_focusController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingresa un enfoque')),
      );
      return;
    }
    
    if (_focus.length >= 5) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Solo puedes tener 5 enfoques')),
      );
      return;
    }
    
    setState(() {
      _focus.add({
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'text': _focusController.text.trim(),
        'completed': false,
      });
      _focusController.clear();
    });
  }

  Widget _buildGoals() {
    final goalsColors = [Colors.green, Colors.teal, Colors.amber, Colors.red, Colors.grey];
    final completedGoals = _goals.where((g) => g['completed'] == true).length;
    final totalGoals = _goals.length;
    final progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals * 100).round() : 0;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header mejorado con paleta profesional
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  _professionalPrimary,
                  _professionalSecondary,
                  _professionalAccent,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: _professionalSecondary.withOpacity(0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: const Icon(Icons.flag, color: AppTheme.white, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Objetivos',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const Text(
                        'Define y gestiona tus objetivos de trabajo',
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
          
          // Resumen de objetivos
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle_outline,
                  value: '$completedGoals/$totalGoals',
                  label: 'Completados',
                  color: _professionalTeal,
                  gradientColors: [_professionalTeal, _professionalAccent],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.trending_up,
                  value: '$progressPercentage%',
                  label: 'Progreso',
                  color: _professionalAccent,
                  gradientColors: [_professionalAccent, _professionalSecondary],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          // Formulario para agregar objetivo
          if (_goals.length < 5)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _goalController,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        hintText: 'Escribe un nuevo objetivo...',
                        hintStyle: const TextStyle(color: AppTheme.white60),
                        filled: true,
                        fillColor: AppTheme.darkSurfaceVariant,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: (_) => _addGoal(),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: _addGoal,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _professionalAccent,
                      foregroundColor: AppTheme.white,
                      shape: const CircleBorder(),
                      padding: const EdgeInsets.all(12),
                    ),
                    child: const Icon(Icons.add),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 20),
          
          // Lista de objetivos
          if (_goals.isEmpty)
            _buildEmptyState('No hay objetivos definidos\nDefine tus objetivos para comenzar', Icons.flag)
          else
            ..._goals.asMap().entries.map((entry) {
              final index = entry.key;
              final goal = entry.value;
              return _buildGoalCard(goal, index, goalsColors);
            }),
        ],
      ),
    );
  }
  
  void _addGoal() {
    if (_goalController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingresa un objetivo')),
      );
      return;
    }
    
    if (_goals.length >= 5) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Solo puedes tener 5 objetivos')),
      );
      return;
    }
    
    setState(() {
      _goals.add({
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'text': _goalController.text.trim(),
        'completed': false,
      });
      _goalController.clear();
    });
  }

  Widget _buildPlanning() {
    // Estadísticas de productividad
    final totalTasks = _workMeetings.length + _dailyTasks.values.expand((t) => t).length;
    final completedTasks = 0 + // Las juntas/sesiones/citas no tienen estado completado
                          _dailyTasks.values.expand((t) => t.where((dt) => dt.completed)).length;
    final efficiency = totalTasks > 0 ? (completedTasks / totalTasks * 100).round() : 0;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header mejorado con paleta profesional
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  _professionalPrimary,
                  _professionalSecondary,
                  _professionalAccent,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: _professionalSecondary.withOpacity(0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: const Icon(Icons.trending_up, color: AppTheme.white, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Planificación de Trabajo',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const Text(
                        'Analiza tu productividad y progreso',
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
          
          // Resumen de productividad
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle_outline,
                  value: '$completedTasks/$totalTasks',
                  label: 'Tareas Completadas',
                  color: Colors.blue,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.trending_up,
                  value: '$efficiency%',
                  label: 'Eficiencia',
                  color: Colors.green,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.access_time,
                  value: '${_projects.length}',
                  label: 'Proyectos',
                  color: Colors.orange,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.flag,
                  value: '${_goals.length}',
                  label: 'Objetivos',
                  color: Colors.purple,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          // Estadísticas semanales
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Resumen Semanal',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 16),
                ...['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day) {
                  final dayTasks = _workMeetings.length; // Simplificado
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              day,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.white,
                              ),
                            ),
                            Text(
                              '$dayTasks tareas',
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppTheme.white60,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Container(
                          height: 6,
                          decoration: BoxDecoration(
                            color: AppTheme.darkSurfaceVariant,
                            borderRadius: BorderRadius.circular(3),
                          ),
                          child: FractionallySizedBox(
                            alignment: Alignment.centerLeft,
                            widthFactor: (dayTasks / 10).clamp(0.0, 1.0),
                            child: Container(
                              decoration: BoxDecoration(
                                color: _professionalSecondary,
                                borderRadius: BorderRadius.circular(3),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(
    String message,
    IconData icon, [
    String? subtitle,
    String? buttonText,
    VoidCallback? onButtonPressed,
    Color? buttonColor,
    List<Color>? gradientColors,
  ]) {
    final colors = gradientColors ?? [buttonColor ?? _professionalAccent, buttonColor ?? _professionalAccent];
    
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
              subtitle,
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.white60,
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
                  buttonText,
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

  // Widget _buildWeeklyTaskCard(WeeklyTask task) { // OBSOLETO - Reemplazado por _buildMeetingCard
  Widget _buildWeeklyTaskCardObsolete(WeeklyTask task) {
    final isOverdue = !task.completed && task.date.isBefore(DateTime.now().subtract(const Duration(days: 1)));
    final isToday = task.date.year == DateTime.now().year &&
                    task.date.month == DateTime.now().month &&
                    task.date.day == DateTime.now().day;
    final isUpcoming = task.date.isAfter(DateTime.now());
    
    return Container(
      margin: const EdgeInsets.only(bottom: 18),
      decoration: BoxDecoration(
        gradient: task.completed
            ? LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.green.withOpacity(0.15),
                  Colors.green.withOpacity(0.05),
                ],
              )
            : isOverdue
                ? LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Colors.red.withOpacity(0.15),
                      Colors.red.withOpacity(0.05),
                    ],
                  )
                : isToday
                    ? LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          _professionalAccent.withOpacity(0.2),
                          _professionalSecondary.withOpacity(0.1),
                        ],
                      )
                    : isUpcoming
                        ? LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              _professionalTeal.withOpacity(0.1),
                              _professionalTeal.withOpacity(0.05),
                            ],
                          )
                        : LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              AppTheme.darkSurfaceVariant.withOpacity(0.3),
                              AppTheme.darkSurface.withOpacity(0.5),
                            ],
                          ),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: task.completed
              ? Colors.green.withOpacity(0.3)
              : isOverdue
                  ? Colors.red.withOpacity(0.3)
                  : isToday
                      ? _professionalAccent.withOpacity(0.4)
                      : _professionalSecondary.withOpacity(0.2),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: (task.completed
                    ? Colors.green
                    : isOverdue
                        ? Colors.red
                        : _professionalSecondary)
                .withOpacity(0.15),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                // Checkbox mejorado con animación
                GestureDetector(
                  onTap: () {
                    // Obsoleto - función para WeeklyTask
                    // setState(() {
                    //   final index = _weeklyTasks.indexWhere((t) => t.id == task.id);
                    //   if (index != -1) {
                    //     _weeklyTasks[index] = WeeklyTask(
                    //       id: task.id,
                    //       task: task.task,
                    //       date: task.date,
                    //       completed: !task.completed,
                    //       notes: task.notes,
                    //       priority: task.priority,
                    //     );
                    //   }
                    // });
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      gradient: task.completed
                          ? LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [Colors.green, Colors.green.shade700],
                            )
                          : null,
                      color: task.completed ? null : Colors.transparent,
                      border: Border.all(
                        color: task.completed
                            ? Colors.green
                            : isOverdue
                                ? Colors.red
                                : _professionalAccent,
                        width: 2.5,
                      ),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: task.completed
                        ? const Icon(Icons.check, size: 18, color: AppTheme.white)
                        : null,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              task.task,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: task.completed
                                    ? AppTheme.white40
                                    : isOverdue
                                        ? Colors.red.shade300
                                        : AppTheme.white,
                                decoration: task.completed
                                    ? TextDecoration.lineThrough
                                    : null,
                                decorationThickness: 2,
                              ),
                            ),
                          ),
                          // Badge de prioridad mejorado
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  _getPriorityColor(task.priority).withOpacity(0.3),
                                  _getPriorityColor(task.priority).withOpacity(0.15),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: _getPriorityColor(task.priority).withOpacity(0.5),
                                width: 1,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  _getPriorityIcon(task.priority),
                                  size: 14,
                                  color: _getPriorityColor(task.priority),
                                ),
                                const SizedBox(width: 5),
                                Text(
                                  _getPriorityLabel(task.priority),
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: _getPriorityColor(task.priority),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          // Badge de fecha mejorado
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              gradient: isToday
                                  ? LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        _professionalAccent.withOpacity(0.3),
                                        _professionalSecondary.withOpacity(0.2),
                                      ],
                                    )
                                  : LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        _professionalSecondary.withOpacity(0.2),
                                        _professionalAccent.withOpacity(0.15),
                                      ],
                                    ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  isToday ? Icons.today : Icons.calendar_today,
                                  size: 14,
                                  color: isToday ? _professionalAccent : AppTheme.white70,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  isToday
                                      ? 'Hoy'
                                      : '${task.date.day}/${task.date.month}/${task.date.year}',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: isToday ? _professionalAccent : AppTheme.white70,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          if (isOverdue && !task.completed) ...[
                            const SizedBox(width: 10),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    Colors.red.withOpacity(0.3),
                                    Colors.red.withOpacity(0.2),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(
                                  color: Colors.red.withOpacity(0.4),
                                  width: 1,
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.warning_rounded,
                                    size: 12,
                                    color: Colors.red.shade300,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Vencida',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.red.shade300,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                          if (isToday && !task.completed) ...[
                            const SizedBox(width: 10),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: _professionalAccent.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                '⚠ Hoy',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: _professionalAccent,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
                // Botones de acción mejorados
                const SizedBox(width: 8),
                Container(
                  decoration: BoxDecoration(
                    color: (task.notes != null && task.notes!.isNotEmpty
                        ? _professionalAccent
                        : AppTheme.darkSurfaceVariant)
                        .withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: IconButton(
                    icon: Icon(
                      task.notes != null && task.notes!.isNotEmpty
                          ? Icons.note
                          : Icons.note_outlined,
                      size: 20,
                      color: task.notes != null && task.notes!.isNotEmpty
                          ? _professionalAccent
                          : AppTheme.white60,
                    ),
                    onPressed: () {
                      // Obsoleto - _editingTask = task;
                      // _notesController.text = task.notes ?? '';
                      // setState(() => _showNotesModal = true);
                    },
                  ),
                ),
                const SizedBox(width: 4),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.red.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.delete_outline, size: 20),
                    color: Colors.red.shade300,
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
                          backgroundColor: AppTheme.darkSurface,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          title: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.red.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(
                                  Icons.warning_amber_rounded,
                                  color: Colors.red,
                                  size: 24,
                                ),
                              ),
                              const SizedBox(width: 12),
                              const Expanded(
                                child: Text(
                                  'Eliminar Tarea',
                                  style: TextStyle(color: AppTheme.white, fontSize: 20),
                                ),
                              ),
                            ],
                          ),
                          content: const Text(
                            '¿Estás seguro de eliminar esta tarea? Esta acción no se puede deshacer.',
                            style: TextStyle(color: AppTheme.white70),
                          ),
                          actions: [
                            OutlinedButton(
                              onPressed: () => Navigator.pop(context),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppTheme.white60,
                                side: BorderSide(color: AppTheme.white60.withOpacity(0.3)),
                              ),
                              child: const Text('Cancelar'),
                            ),
                            const SizedBox(width: 12),
                            ElevatedButton(
                              onPressed: () {
                                // Obsoleto - setState(() {
                                //   _weeklyTasks.removeWhere((t) => t.id == task.id);
                                // });
                                Navigator.pop(context);
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.red,
                                foregroundColor: AppTheme.white,
                              ),
                              child: const Text('Eliminar'),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
            if (task.notes != null && task.notes!.isNotEmpty) ...[
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      _professionalAccent.withOpacity(0.15),
                      _professionalAccent.withOpacity(0.05),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: _professionalAccent.withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      Icons.note,
                      size: 18,
                      color: _professionalAccent,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        task.notes!,
                        style: TextStyle(
                          fontSize: 13,
                          color: AppTheme.white70,
                          height: 1.4,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDailyTaskCard(DateTime date, List<DailyTask> tasks) {
    final sortedTasks = List<DailyTask>.from(tasks)..sort((a, b) => a.time.compareTo(b.time));
    final isToday = date.year == DateTime.now().year &&
                    date.month == DateTime.now().month &&
                    date.day == DateTime.now().day;
    final completedCount = sortedTasks.where((t) => t.completed).length;
    final totalCount = sortedTasks.length;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isToday
              ? [
                  _professionalPrimary.withOpacity(0.3),
                  _professionalSecondary.withOpacity(0.2),
                ]
              : [
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant.withOpacity(0.5),
                ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isToday
              ? _professionalAccent.withOpacity(0.5)
              : _professionalSecondary.withOpacity(0.2),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: isToday
                ? _professionalPrimary.withOpacity(0.2)
                : Colors.black.withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header de fecha mejorado
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            decoration: BoxDecoration(
              gradient: isToday
                  ? LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        _professionalAccent.withOpacity(0.3),
                        _professionalSecondary.withOpacity(0.2),
                      ],
                    )
                  : null,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: isToday
                          ? [_professionalPrimary, _professionalSecondary]
                          : [_professionalSlate, _professionalIndigo],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    isToday ? Icons.today : Icons.calendar_today,
                    size: 20,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          if (isToday) ...[
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: _professionalAccent.withOpacity(0.3),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Text(
                                'HOY',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.white,
                                  letterSpacing: 1,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                          ],
                          Text(
                            '${date.day} ${_getMonthName(date.month)} ${date.year}',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${completedCount}/${totalCount} completadas',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.white70,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: _professionalTeal.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '$totalCount',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: _professionalTeal,
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          // Lista de tareas mejorada
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: sortedTasks.asMap().entries.map((entry) {
                final index = entry.key;
                final task = entry.value;
                final isLast = index == sortedTasks.length - 1;
                
                return _buildDailyTaskItem(task, date, index, isLast: !isLast);
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
  
  String _getMonthName(int month) {
    const months = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    return months[month - 1];
  }
  
  Widget _buildDailyTaskItem(DailyTask task, DateTime date, int index, {bool isLast = false}) {
    final isOverdue = task.time.isBefore(DateTime.now()) && !task.completed;
    // Usar colores profesionales basados en el índice para crear variación
    final professionalColor1 = index % 3 == 0 ? _professionalPrimary : (index % 3 == 1 ? _professionalSecondary : _professionalAccent);
    final professionalColor2 = index % 3 == 1 ? _professionalAccent : (index % 3 == 2 ? _professionalTeal : _professionalSecondary);
    final professionalColor3 = index % 3 == 2 ? _professionalTeal : (index % 3 == 0 ? _professionalIndigo : _professionalAccent);
    
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 300 + (index * 50)),
      curve: Curves.easeOut,
      builder: (context, value, child) {
        return Transform.translate(
          offset: Offset(0, 20 * (1 - value)),
          child: Opacity(
            opacity: value,
            child: child,
          ),
        );
      },
      child: Container(
        margin: EdgeInsets.only(bottom: isLast ? 0 : 16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              professionalColor1.withOpacity(0.15),
              professionalColor2.withOpacity(0.1),
              professionalColor3.withOpacity(0.05),
              AppTheme.darkSurface,
            ],
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: professionalColor1.withOpacity(0.4),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: professionalColor1.withOpacity(0.2),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
            BoxShadow(
              color: professionalColor2.withOpacity(0.15),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Barra lateral con gradiente profesional
            Positioned(
              left: 0,
              top: 0,
              bottom: 0,
              child: Container(
                width: 6,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      professionalColor1,
                      professionalColor2,
                      professionalColor3,
                    ],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    bottomLeft: Radius.circular(20),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Checkbox mejorado (igual que Personal)
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            final dateKey = DateTime(date.year, date.month, date.day);
                            if (_dailyTasks.containsKey(dateKey)) {
                              final taskIndex = _dailyTasks[dateKey]!.indexWhere((t) => t.id == task.id);
                              if (taskIndex != -1) {
                                _dailyTasks[dateKey]![taskIndex] = DailyTask(
                                  id: task.id,
                                  task: task.task,
                                  date: task.date,
                                  time: task.time,
                                  completed: !task.completed,
                                  notes: task.notes,
                                  priority: task.priority,
                                );
                              }
                            }
                          });
                        },
                        child: Container(
                          width: 56,
                          height: 56,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: task.completed
                                  ? [
                                      Colors.green.withOpacity(0.4),
                                      Colors.green.withOpacity(0.2),
                                    ]
                                  : [
                                      professionalColor1.withOpacity(0.4),
                                      professionalColor2.withOpacity(0.3),
                                      professionalColor3.withOpacity(0.2),
                                    ],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: task.completed
                                  ? Colors.green.withOpacity(0.6)
                                  : professionalColor1.withOpacity(0.5),
                              width: 2,
                            ),
                            boxShadow: task.completed ? null : [
                              BoxShadow(
                                color: professionalColor1.withOpacity(0.3),
                                blurRadius: 8,
                                spreadRadius: 1,
                              ),
                            ],
                          ),
                          child: Center(
                            child: task.completed
                                ? const Icon(Icons.check, color: Colors.green, size: 28)
                                : Container(
                                    width: 20,
                                    height: 20,
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        begin: Alignment.topLeft,
                                        end: Alignment.bottomRight,
                                        colors: [
                                          professionalColor1.withOpacity(0.3),
                                          professionalColor2.withOpacity(0.2),
                                        ],
                                      ),
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        color: professionalColor1,
                                        width: 2.5,
                                      ),
                                    ),
                                  ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              task.task,
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: task.completed ? AppTheme.white40 : AppTheme.white,
                                decoration: task.completed ? TextDecoration.lineThrough : null,
                              ),
                            ),
                            const SizedBox(height: 8),
                            // Prioridad con gradiente profesional
                            if (task.priority != null)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      professionalColor1.withOpacity(0.25),
                                      professionalColor2.withOpacity(0.15),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: professionalColor1.withOpacity(0.3),
                                    width: 1,
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      _getPriorityIcon(task.priority!),
                                      size: 14,
                                      color: _getPriorityColor(task.priority!),
                                    ),
                                    const SizedBox(width: 6),
                                    Text(
                                      _getPriorityLabel(task.priority!),
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: professionalColor1,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                          ],
                        ),
                      ),
                      // Botón de opciones (igual que Personal)
                      PopupMenuButton<String>(
                        icon: const Icon(Icons.more_vert, color: AppTheme.white60, size: 20),
                        color: AppTheme.darkSurface,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        onSelected: (value) {
                          if (value == 'delete') {
                            showDialog<bool>(
                              context: context,
                              builder: (context) => AlertDialog(
                                backgroundColor: AppTheme.darkSurface,
                                title: const Text(
                                  'Eliminar tarea',
                                  style: TextStyle(color: AppTheme.white),
                                ),
                                content: Text(
                                  '¿Estás seguro de que quieres eliminar "${task.task}"?',
                                  style: const TextStyle(color: AppTheme.white60),
                                ),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(context, false),
                                    child: const Text(
                                      'Cancelar',
                                      style: TextStyle(color: AppTheme.white60),
                                    ),
                                  ),
                                  ElevatedButton(
                                    onPressed: () => Navigator.pop(context, true),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.red,
                                    ),
                                    child: const Text('Eliminar'),
                                  ),
                                ],
                              ),
                            ).then((confirmed) {
                              if (confirmed == true) {
                                setState(() {
                                  final dateKey = DateTime(date.year, date.month, date.day);
                                  if (_dailyTasks.containsKey(dateKey)) {
                                    _dailyTasks[dateKey]!.removeWhere((t) => t.id == task.id);
                                    if (_dailyTasks[dateKey]!.isEmpty) {
                                      _dailyTasks.remove(dateKey);
                                    }
                                  }
                                });
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Tarea eliminada exitosamente'),
                                    backgroundColor: Colors.green,
                                    duration: Duration(seconds: 2),
                                  ),
                                );
                              }
                            });
                          }
                        },
                        itemBuilder: (context) => [
                          const PopupMenuItem(
                            value: 'delete',
                            child: Row(
                              children: [
                                Icon(Icons.delete, size: 18, color: Colors.red),
                                SizedBox(width: 8),
                                Text('Eliminar', style: TextStyle(color: Colors.red)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Información de la tarea (hora)
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBackground.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    professionalColor2.withOpacity(0.3),
                                    professionalColor3.withOpacity(0.2),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: professionalColor2.withOpacity(0.4),
                                  width: 1,
                                ),
                              ),
                              child: Icon(
                                Icons.access_time,
                                size: 16,
                                color: professionalColor2,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Hora',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: AppTheme.white60,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${task.time.hour.toString().padLeft(2, '0')}:${task.time.minute.toString().padLeft(2, '0')}',
                                    style: const TextStyle(
                                      fontSize: 15,
                                      color: AppTheme.white,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            if (isOverdue && !task.completed)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      Colors.red.withOpacity(0.3),
                                      Colors.red.withOpacity(0.2),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(
                                    color: Colors.red.withOpacity(0.4),
                                    width: 1,
                                  ),
                                ),
                                child: const Text(
                                  'Atrasada',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.red,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProjectCard(WorkProject project, int index) {
    final totalGoals = project.goals.length;
    final completedGoals = project.goals.where((g) => g.completed == true).length;
    final isOverdue = project.deadline != null && project.deadline!.isBefore(DateTime.now()) && completedGoals < totalGoals;
    final progressPercentage = totalGoals > 0 ? ((completedGoals / totalGoals) * 100).round() : 0;
    final isCompleted = totalGoals > 0 && completedGoals == totalGoals;
    
    // Colores profesionales basados en el índice para variación
    final professionalColor1 = index % 3 == 0 ? _professionalPrimary : (index % 3 == 1 ? _professionalSecondary : _professionalAccent);
    final professionalColor2 = index % 3 == 1 ? _professionalAccent : (index % 3 == 2 ? _professionalTeal : _professionalSecondary);
    final professionalColor3 = index % 3 == 2 ? _professionalTeal : (index % 3 == 0 ? _professionalIndigo : _professionalAccent);
    
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 300 + (index * 50)),
      curve: Curves.easeOut,
      builder: (context, value, child) {
        return Transform.translate(
          offset: Offset(0, 20 * (1 - value)),
          child: Opacity(
            opacity: value,
            child: child,
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isCompleted
                ? [
                    Colors.green.withOpacity(0.15),
                    Colors.green.withOpacity(0.08),
                    AppTheme.darkSurface,
                  ]
                : isOverdue
                    ? [
                        Colors.red.withOpacity(0.15),
                        Colors.red.withOpacity(0.08),
                        AppTheme.darkSurface,
                      ]
                    : [
                        professionalColor1.withOpacity(0.15),
                        professionalColor2.withOpacity(0.1),
                        professionalColor3.withOpacity(0.05),
                        AppTheme.darkSurface,
                      ],
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isCompleted
                ? Colors.green.withOpacity(0.4)
                : isOverdue
                    ? Colors.red.withOpacity(0.4)
                    : professionalColor1.withOpacity(0.4),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: (isCompleted
                      ? Colors.green
                      : isOverdue
                          ? Colors.red
                          : professionalColor1)
                  .withOpacity(0.2),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
            BoxShadow(
              color: professionalColor2.withOpacity(0.15),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Barra lateral con gradiente profesional
            Positioned(
              left: 0,
              top: 0,
              bottom: 0,
              child: Container(
                width: 6,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: isCompleted
                        ? [Colors.green, Colors.green.shade700]
                        : isOverdue
                            ? [Colors.red, Colors.red.shade700]
                            : [
                                professionalColor1,
                                professionalColor2,
                                professionalColor3,
                              ],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    bottomLeft: Radius.circular(20),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header del proyecto
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Icono del proyecto con gradiente
                      Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: isCompleted
                                ? [Colors.green.withOpacity(0.4), Colors.green.withOpacity(0.2)]
                                : [
                                    professionalColor1.withOpacity(0.4),
                                    professionalColor2.withOpacity(0.3),
                                    professionalColor3.withOpacity(0.2),
                                  ],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isCompleted
                                ? Colors.green.withOpacity(0.6)
                                : professionalColor1.withOpacity(0.5),
                            width: 2,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: (isCompleted ? Colors.green : professionalColor1).withOpacity(0.3),
                              blurRadius: 8,
                              spreadRadius: 1,
                            ),
                          ],
                        ),
                        child: Icon(
                          isCompleted ? Icons.check_circle : Icons.folder_special,
                          color: AppTheme.white,
                          size: 28,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    project.title,
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.white,
                                      decoration: isCompleted ? TextDecoration.lineThrough : null,
                                    ),
                                  ),
                                ),
                                if (isCompleted) ...[
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [Colors.green, Colors.green.shade700],
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.check, size: 14, color: AppTheme.white),
                                        const SizedBox(width: 4),
                                        const Text(
                                          'Completado',
                                          style: TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.white,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ] else if (isOverdue) ...[
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [Colors.red, Colors.red.shade700],
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.warning, size: 14, color: AppTheme.white),
                                        const SizedBox(width: 4),
                                        const Text(
                                          'Vencido',
                                          style: TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.white,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ],
                            ),
                            if (project.aim.isNotEmpty) ...[
                              const SizedBox(height: 8),
                              Text(
                                project.aim,
                                style: TextStyle(
                                  fontSize: 14,
                                  color: AppTheme.white70,
                                  height: 1.4,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ],
                        ),
                      ),
                      // Botón de opciones
                      PopupMenuButton<String>(
                        icon: const Icon(Icons.more_vert, color: AppTheme.white60, size: 22),
                        color: AppTheme.darkSurface,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        onSelected: (value) {
                          if (value == 'delete') {
                            showDialog<bool>(
                              context: context,
                              builder: (context) => AlertDialog(
                                backgroundColor: AppTheme.darkSurface,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                title: Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(8),
                                      decoration: BoxDecoration(
                                        color: Colors.red.withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: const Icon(
                                        Icons.warning_amber_rounded,
                                        color: Colors.red,
                                        size: 24,
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    const Expanded(
                                      child: Text(
                                        'Eliminar Proyecto',
                                        style: TextStyle(color: AppTheme.white, fontSize: 20),
                                      ),
                                    ),
                                  ],
                                ),
                                content: Text(
                                  '¿Estás seguro de eliminar "${project.title}"? Esta acción no se puede deshacer.',
                                  style: const TextStyle(color: AppTheme.white70),
                                ),
                                actions: [
                                  OutlinedButton(
                                    onPressed: () => Navigator.pop(context, false),
                                    style: OutlinedButton.styleFrom(
                                      foregroundColor: AppTheme.white60,
                                      side: BorderSide(color: AppTheme.white60.withOpacity(0.3)),
                                    ),
                                    child: const Text('Cancelar'),
                                  ),
                                  const SizedBox(width: 12),
                                  ElevatedButton(
                                    onPressed: () => Navigator.pop(context, true),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.red,
                                      foregroundColor: AppTheme.white,
                                    ),
                                    child: const Text('Eliminar'),
                                  ),
                                ],
                              ),
                            ).then((confirmed) {
                              if (confirmed == true) {
                                setState(() {
                                  _projects.removeWhere((p) => p.id == project.id);
                                });
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Proyecto eliminado exitosamente'),
                                    backgroundColor: Colors.green,
                                    duration: Duration(seconds: 2),
                                  ),
                                );
                              }
                            });
                          }
                        },
                        itemBuilder: (context) => [
                          const PopupMenuItem(
                            value: 'delete',
                            child: Row(
                              children: [
                                Icon(Icons.delete, size: 18, color: Colors.red),
                                SizedBox(width: 8),
                                Text('Eliminar', style: TextStyle(color: Colors.red)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  
                  // Información del proyecto
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBackground.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        // Fecha límite y metas
                        Row(
                          children: [
                            if (project.deadline != null) ...[
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      (isOverdue ? Colors.red : professionalColor2).withOpacity(0.3),
                                      (isOverdue ? Colors.red : professionalColor3).withOpacity(0.2),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: (isOverdue ? Colors.red : professionalColor2).withOpacity(0.4),
                                    width: 1,
                                  ),
                                ),
                                child: Icon(
                                  Icons.calendar_today,
                                  size: 16,
                                  color: isOverdue ? Colors.red : professionalColor2,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Fecha límite',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: AppTheme.white60,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      DateFormat('dd MMMM yyyy', 'es').format(project.deadline!),
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: isOverdue ? Colors.red : AppTheme.white,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 16),
                            ],
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    professionalColor3.withOpacity(0.3),
                                    professionalColor1.withOpacity(0.2),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: professionalColor3.withOpacity(0.4),
                                  width: 1,
                                ),
                              ),
                              child: Icon(
                                Icons.flag,
                                size: 16,
                                color: professionalColor3,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Metas',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: AppTheme.white60,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '$completedGoals/$totalGoals completadas',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      color: AppTheme.white,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        if (totalGoals > 0) ...[
                          const SizedBox(height: 16),
                          // Barra de progreso mejorada
                          Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'Progreso',
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: AppTheme.white60,
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                          decoration: BoxDecoration(
                                            gradient: LinearGradient(
                                              colors: isCompleted
                                                  ? [Colors.green, Colors.green.shade700]
                                                  : [
                                                      professionalColor1,
                                                      professionalColor2,
                                                    ],
                                            ),
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: Text(
                                            '$progressPercentage%',
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
                                    Container(
                                      height: 10,
                                      decoration: BoxDecoration(
                                        color: AppTheme.darkSurfaceVariant,
                                        borderRadius: BorderRadius.circular(5),
                                      ),
                                      child: Stack(
                                        children: [
                                          FractionallySizedBox(
                                            alignment: Alignment.centerLeft,
                                            widthFactor: progressPercentage / 100,
                                            child: Container(
                                              decoration: BoxDecoration(
                                                gradient: LinearGradient(
                                                  colors: isCompleted
                                                      ? [Colors.green, Colors.green.shade700]
                                                      : [
                                                          professionalColor1,
                                                          professionalColor2,
                                                          professionalColor3,
                                                        ],
                                                ),
                                                borderRadius: BorderRadius.circular(5),
                                                boxShadow: [
                                                  BoxShadow(
                                                    color: (isCompleted
                                                            ? Colors.green
                                                            : professionalColor1)
                                                        .withOpacity(0.5),
                                                    blurRadius: 8,
                                                    spreadRadius: 1,
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPriorityCard(Map<String, dynamic> priority, int index, List<Color> colors) {
    final color = colors[index % colors.length];
    final isCompleted = priority['completed'] == true;
    
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: color,
          width: 2,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: Text(
                  '${index + 1}',
                  style: const TextStyle(
                    color: AppTheme.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: TextField(
                controller: TextEditingController(text: priority['text']),
                style: TextStyle(
                  fontSize: 16,
                  color: isCompleted ? AppTheme.white40 : AppTheme.white,
                  decoration: isCompleted ? TextDecoration.lineThrough : null,
                ),
                enabled: !isCompleted,
                decoration: const InputDecoration(
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.zero,
                ),
                onChanged: (value) {
                  setState(() {
                    final idx = _priorities.indexWhere((p) => p['id'] == priority['id']);
                    if (idx != -1) {
                      _priorities[idx]['text'] = value;
                    }
                  });
                },
              ),
            ),
            Checkbox(
              value: isCompleted,
              onChanged: (value) {
                setState(() {
                  final idx = _priorities.indexWhere((p) => p['id'] == priority['id']);
                  if (idx != -1) {
                    _priorities[idx]['completed'] = value ?? false;
                  }
                });
              },
              activeColor: AppTheme.orangeAccent,
            ),
            IconButton(
              icon: const Icon(Icons.close, color: Colors.red, size: 20),
              onPressed: () {
                setState(() {
                  _priorities.removeWhere((p) => p['id'] == priority['id']);
                });
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFocusCard(Map<String, dynamic> focus, int index, List<Color> colors) {
    final color = colors[index % colors.length];
    final isCompleted = focus['completed'] == true;
    
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: color,
          width: 2,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: Text(
                  '${index + 1}',
                  style: const TextStyle(
                    color: AppTheme.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: TextField(
                controller: TextEditingController(text: focus['text']),
                style: TextStyle(
                  fontSize: 16,
                  color: isCompleted ? AppTheme.white40 : AppTheme.white,
                  decoration: isCompleted ? TextDecoration.lineThrough : null,
                ),
                enabled: !isCompleted,
                decoration: const InputDecoration(
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.zero,
                ),
                onChanged: (value) {
                  setState(() {
                    final idx = _focus.indexWhere((f) => f['id'] == focus['id']);
                    if (idx != -1) {
                      _focus[idx]['text'] = value;
                    }
                  });
                },
              ),
            ),
            Checkbox(
              value: isCompleted,
              onChanged: (value) {
                setState(() {
                  final idx = _focus.indexWhere((f) => f['id'] == focus['id']);
                  if (idx != -1) {
                    _focus[idx]['completed'] = value ?? false;
                  }
                });
              },
              activeColor: AppTheme.orangeAccent,
            ),
            IconButton(
              icon: const Icon(Icons.close, color: Colors.red, size: 20),
              onPressed: () {
                setState(() {
                  _focus.removeWhere((f) => f['id'] == focus['id']);
                });
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGoalCard(Map<String, dynamic> goal, int index, List<Color> colors) {
    final color = colors[index % colors.length];
    final isCompleted = goal['completed'] == true;
    
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: color,
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
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Center(
                    child: Text(
                      '${index + 1}',
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: TextEditingController(text: goal['text']),
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: isCompleted ? AppTheme.white40 : AppTheme.white,
                      decoration: isCompleted ? TextDecoration.lineThrough : null,
                    ),
                    enabled: !isCompleted,
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.zero,
                    ),
                    onChanged: (value) {
                      setState(() {
                        final idx = _goals.indexWhere((g) => g['id'] == goal['id']);
                        if (idx != -1) {
                          _goals[idx]['text'] = value;
                        }
                      });
                    },
                  ),
                ),
                Checkbox(
                  value: isCompleted,
                  onChanged: (value) {
                    setState(() {
                      final idx = _goals.indexWhere((g) => g['id'] == goal['id']);
                      if (idx != -1) {
                        _goals[idx]['completed'] = value ?? false;
                      }
                    });
                  },
                  activeColor: AppTheme.orangeAccent,
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.red, size: 20),
                  onPressed: () {
                    setState(() {
                      _goals.removeWhere((g) => g['id'] == goal['id']);
                    });
                  },
                ),
              ],
            ),
            const SizedBox(height: 12),
            // Barra de progreso
            Container(
              height: 6,
              decoration: BoxDecoration(
                color: AppTheme.darkSurfaceVariant,
                borderRadius: BorderRadius.circular(3),
              ),
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: isCompleted ? 1.0 : 0.0,
                child: Container(
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              isCompleted ? 'Completado' : 'En Progreso',
              style: TextStyle(
                fontSize: 12,
                color: color,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}


