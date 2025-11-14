import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../models/work/weekly_task.dart';
import '../../models/work/work_meeting.dart';
import '../../models/work/daily_task.dart';
import '../../models/work/work_project.dart';
import '../../models/event/event_organization.dart';
import '../../auth/providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../../theme/context_ext.dart';
import '../../theme/spacing.dart';
import '../../theme/shadows.dart';
import '../../theme/radius.dart';
import '../../services/event_service.dart';
import '../common/navigation_header.dart';

// part 'work_sections.weekly.part.dart';
// part 'work_sections.daily.part.dart';
// part 'work_sections.projects.part.dart';
// part 'work_sections.strategy.part.dart';
// part 'work_sections.priorities.part.dart';

class WorkSections extends StatefulWidget {
  const WorkSections({super.key});

  @override
  State<WorkSections> createState() => _WorkSectionsState();
}

class _WorkSectionsState extends State<WorkSections> {
  String _activeSection = 'weekly';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  
  List<WorkMeeting> _workMeetings = [];
  Map<DateTime, List<DailyTask>> _dailyTasks = {};
  List<WorkProject> _projects = [];
  List<Map<String, dynamic>> _priorities = []; // {id, text, completed}
  final EventService _eventService = EventService();
  List<Map<String, dynamic>> _focus = []; // {id, text, completed}
  List<Map<String, dynamic>> _goals = []; // {id, text, completed, milestones: [{id, text, completed}]}
  
  // Proyecto seleccionado para estrategia y planificación
  WorkProject? _selectedStrategyProject;
  
  // Estados para formularios y modales
  final TextEditingController _weeklyTaskController = TextEditingController();
  final TextEditingController _dailyTaskController = TextEditingController();
  final TextEditingController _priorityController = TextEditingController();
  final TextEditingController _focusController = TextEditingController();
  final TextEditingController _goalController = TextEditingController();
  final Map<String, TextEditingController> _goalMilestoneControllers = {}; // Para cada objetivo
  final TextEditingController _projectNameController = TextEditingController();
  final TextEditingController _projectDescriptionController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();
  
  DateTime? _selectedWeeklyDate = DateTime.now();
  DateTime? _selectedDailyDate = DateTime.now();
  TimeOfDay? _selectedDailyTime = TimeOfDay.now();
  DateTime? _selectedProjectDeadline;
  String _selectedWeeklyPriority = 'medium';
  String _selectedDailyPriority = 'medium';
  
  DateTime _selectedMeetingDate = DateTime.now();
  final ScrollController _meetingDateScrollController = ScrollController();
  
  bool _showNotesModal = false;
  // WeeklyTask? _editingTask; // Obsoleto - reemplazado por WorkMeeting
  DailyTask? _editingDailyTask;
  bool _showAddProjectModal = false;
  String? _editingProjectId;
  List<ProjectGoal> _tempProjectGoals = [];
  final TextEditingController _tempGoalTextController = TextEditingController();
  final TextEditingController _tempGoalPersonController = TextEditingController();
  DateTime? _tempGoalDate;
  
  // Variables temporales para estrategia del proyecto
  String _activeProjectModalTab = 'basic'; // 'basic', 'goals', 'strategy'
  List<ProjectTeammate> _tempProjectTeammates = [];
  List<ProjectAchievement> _tempProjectAchievements = [];
  List<ProjectWork> _tempProjectWorks = [];
  List<ProjectFunding> _tempProjectFunding = [];
  
  // Controllers para estrategia
  final TextEditingController _tempTeammateNameController = TextEditingController();
  final TextEditingController _tempTeammateRoleController = TextEditingController();
  final TextEditingController _tempAchievementNameController = TextEditingController();
  final TextEditingController _tempAchievementDueDateController = TextEditingController();
  final TextEditingController _tempWorkPositionController = TextEditingController();
  final TextEditingController _tempWorkAppointController = TextEditingController();
  final TextEditingController _tempWorkStatusController = TextEditingController();
  final TextEditingController _tempWorkNotesController = TextEditingController();
  final TextEditingController _tempFundingElementController = TextEditingController();
  final TextEditingController _tempFundingFondoController = TextEditingController();
  final TextEditingController _tempFundingFinanciadoPorController = TextEditingController();
  final TextEditingController _tempFundingNotesController = TextEditingController();
  
  DateTime? _tempAchievementDueDate;
  DateTime? _tempWorkStartDate;
  DateTime? _tempWorkDeadline;

  final sections = [
    {'id': 'weekly', 'name': 'Sesiones', 'icon': Icons.event},
    {'id': 'daily', 'name': 'Tareas', 'icon': Icons.today},
    {'id': 'projects', 'name': 'Proyectos', 'icon': Icons.folder},
    {'id': 'strategy', 'name': 'Estrategia', 'icon': Icons.track_changes},
    {'id': 'priorities-focus-goals', 'name': 'Prioridades', 'icon': Icons.dashboard},
  ];

  String _activeSubSection = 'priorities'; // Para la subsección agrupada

  // Funciones helper para prioridad
  Color _getPriorityColor(String priority, BuildContext context) {
    switch (priority) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.orange;
      case 'low':
        return Colors.green;
      default:
        return context.pro.accent;
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

  // Función para verificar empalmes de eventos
  Future<List<EventOrganization>> _checkEventOverlaps(String date, String? time) async {
    if (time == null || time.isEmpty) return [];
    
    try {
      final allEvents = await _eventService.getAllEvents();
      return allEvents.where((event) {
        if (event.date != date) return false;
        if (event.time == null || event.time!.isEmpty) return false;
        return event.time == time;
      }).toList();
    } catch (e) {
      print('Error al verificar empalmes: $e');
      return [];
    }
  }
  
  // Función para mostrar advertencia de empalme
  Future<bool> _showOverlapWarning(BuildContext context, List<EventOrganization> overlappingEvents) async {
    if (overlappingEvents.isEmpty) return true;
    
    return await showDialog<bool>(
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
                color: Colors.orange.withOpacity(0.2),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.warning_amber_rounded,
                color: Colors.orange,
                size: 24,
              ),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Text(
                'Evento Empalmado',
                style: TextStyle(color: AppTheme.white, fontSize: 20),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Ya existe un evento a la misma hora y fecha:',
              style: TextStyle(color: AppTheme.white),
            ),
            const SizedBox(height: 12),
            ...overlappingEvents.map((event) => Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.darkSurfaceVariant.withOpacity(0.5),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: Colors.orange.withOpacity(0.3),
                  width: 1,
                ),
              ),
              child: Row(
                children: [
                  Icon(Icons.event, size: 16, color: Colors.orange),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      event.eventName,
                      style: const TextStyle(color: AppTheme.white),
                    ),
                  ),
                ],
              ),
            )).toList(),
            const SizedBox(height: 12),
            const Text(
              '¿Deseas crear el evento de todas formas?',
              style: TextStyle(color: AppTheme.white, fontWeight: FontWeight.w500),
            ),
          ],
        ),
        actions: [
          OutlinedButton(
            onPressed: () => Navigator.pop(context, false),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppTheme.white,
              side: BorderSide(color: AppTheme.white.withOpacity(0.3)),
            ),
            child: const Text('Cancelar'),
          ),
          const SizedBox(width: 12),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.orange,
              foregroundColor: AppTheme.white,
            ),
            child: const Text('Crear de todas formas'),
          ),
        ],
      ),
    ) ?? false;
  }
  
  // Cargar eventos de trabajo desde Supabase
  Future<void> _loadWorkEvents() async {
    try {
      final allEvents = await _eventService.getAllEvents();
      final workEvents = allEvents.where((event) => event.type == 'work').toList();
      
      // Convertir EventOrganization a WorkMeeting y agregar si no existe
      for (final event in workEvents) {
        final exists = _workMeetings.any((meeting) => meeting.id == event.id);
        if (!exists) {
          _workMeetings.add(WorkMeeting(
            id: event.id,
            name: event.eventName,
            date: event.date,
            time: event.time,
            location: event.location,
            type: event.type,
            notes: event.notes,
            createdAt: event.createdAt,
          ));
        }
      }
      
      if (mounted) {
        setState(() {});
      }
    } catch (e) {
      print('Error al cargar eventos de trabajo: $e');
    }
  }
  
  @override
  void initState() {
    super.initState();
    _loadWorkEvents();
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
    _tempGoalPersonController.dispose();
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
              context.pro.primary,
              context.pro.secondary,
            ],
          ),
          borderRadius: AppRadius.circleAll,
          boxShadow: AppShadows.elevated(context.pro.secondary),
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
              context.pro.primary,
              context.pro.secondary,
            ],
          ),
          borderRadius: AppRadius.circleAll,
          boxShadow: AppShadows.elevated(context.pro.secondary),
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
      if (_projects.isNotEmpty) {
        floatingActionButton = Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                context.pro.primary,
                context.pro.secondary,
              ],
            ),
            borderRadius: AppRadius.circleAll,
            boxShadow: AppShadows.elevated(context.pro.secondary),
          ),
          child: FloatingActionButton.extended(
            onPressed: () => setState(() => _showAddProjectModal = true),
            backgroundColor: Colors.transparent,
            elevation: 0,
            icon: const Icon(Icons.add, color: AppTheme.white),
            label: const Text(
              'Agregar Proyecto',
              style: TextStyle(
                color: AppTheme.white,
                fontWeight: FontWeight.w600,
              ),
            ),
            tooltip: 'Agregar proyecto',
          ),
        );
      }
    }

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: Colors.transparent,
      drawer: _buildNavigationDrawer(context),
      appBar: NavigationHeader(currentSection: 'work'),
      floatingActionButton: _showAddProjectModal ? null : floatingActionButton,
      body: Column(
        children: [
          _buildSectionTabs(),
          Expanded(
                child: _buildActiveSection(context),
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
                  context.pro.primary.withOpacity(0.4),
                  context.pro.secondary.withOpacity(0.2),
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
                      colors: [context.pro.secondary, context.pro.accent],
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
                    color: AppTheme.white,
                  ),
                ),
              ],
            ),
          ),
          _buildDrawerItem(
            context,
            icon: Icons.person_outline,
            title: 'Personal',
            color: context.pro.secondary,
            onTap: () {
              Navigator.pop(context);
              context.go('/main?section=profile');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.work_outline,
            title: 'Trabajo',
            color: context.pro.secondary,
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
                              context.pro.secondary.withOpacity(0.3),
                              context.pro.accent.withOpacity(0.2),
                            ],
                          )
                        : null,
                    color: isActive ? null : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isActive 
                          ? context.pro.secondary 
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
                            ? context.pro.accent 
                            : AppTheme.white,
                        size: 20,
                      ),
                      const SizedBox(height: 2),
                      Flexible(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 2),
                          child: Text(
                            section['name'] as String,
                            style: TextStyle(
                              fontSize: 9,
                              color: isActive 
                                  ? context.pro.accent 
                                  : AppTheme.white,
                              fontWeight: isActive 
                                  ? FontWeight.w600 
                                  : FontWeight.normal,
                            ),
                            overflow: TextOverflow.ellipsis,
                            maxLines: 1,
                            textAlign: TextAlign.center,
                          ),
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

  Widget _buildActiveSection(BuildContext context) {
    switch (_activeSection) {
      case 'weekly':
        return _buildWeeklyTasks(context);
      case 'daily':
        return _buildDailyTasks(context);
      case 'projects':
        return _buildProjects(context);
      case 'strategy':
        return _buildStrategy(context);
      case 'priorities-focus-goals':
        return _buildPrioritiesFocusGoals(context);
      default:
        return _buildWeeklyTasks(context);
    }
  }
  
  Widget _buildSummaryCard({
    required IconData icon,
    required String value,
    required String label,
    required Color color,
    List<Color>? gradientColors,
    String? subtitle,
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
              color: AppTheme.white,
            ),
          ),
          if (subtitle != null) ...[
            const SizedBox(height: 4),
            Text(
              subtitle,
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
                  hintStyle: const TextStyle(color: AppTheme.white),
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

  Widget _buildWeeklyTasks(BuildContext context) {
    final todayMeetings = _getMeetingsForDate(_selectedMeetingDate);
    final isToday = _selectedMeetingDate.year == DateTime.now().year &&
                    _selectedMeetingDate.month == DateTime.now().month &&
                    _selectedMeetingDate.day == DateTime.now().day;

    return Column(
      children: [
        // Header mejorado con paleta profesional
        Container(
          padding: const EdgeInsets.all(20),
          margin: const EdgeInsets.only(top: 16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.blue.withOpacity(0.2),
                AppTheme.darkSurface,
                AppTheme.darkSurfaceVariant,
              ],
            ),
            borderRadius: BorderRadius.circular(24),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(
                  Icons.event,
                  size: 32,
                  color: AppTheme.white,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Sesiones',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Organiza tus reuniones y citas profesionales.',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        // Selector de fecha con fondo
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                context.pro.primary.withOpacity(0.2),
                context.pro.secondary.withOpacity(0.15),
                context.pro.accent.withOpacity(0.1),
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
                                color: context.pro.accent.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.event, size: 16, color: context.pro.accent),
                                  const SizedBox(width: 6),
                                  Text(
                                    isToday ? 'Hoy' : DateFormat('EEEE, d MMMM', 'es').format(_selectedMeetingDate),
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: context.pro.accent,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        if (todayMeetings.isNotEmpty)
                          Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: Text(
                              '${todayMeetings.length} evento${todayMeetings.length == 1 ? '' : 's'}',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppTheme.white,
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
                  height: 55,
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
        constraints: const BoxConstraints(
          minWidth: 50,
          maxHeight: 55,
          maxWidth: 60,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          gradient: isSelected 
              ? LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    context.pro.accent.withOpacity(0.3),
                    context.pro.secondary.withOpacity(0.2),
                  ],
                )
              : null,
          color: isSelected ? null : AppTheme.darkSurfaceVariant.withOpacity(0.5),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected 
                ? context.pro.accent 
                : Colors.transparent,
            width: 2,
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              DateFormat('EEE', 'es').format(date).substring(0, 3).toUpperCase(),
              style: TextStyle(
                fontSize: 8,
                fontWeight: FontWeight.w600,
                color: isSelected ? context.pro.accent : AppTheme.white,
                height: 1.0,
              ),
            ),
            const SizedBox(height: 1),
            Text(
              '${date.day}',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: isSelected ? context.pro.accent : AppTheme.white,
                height: 1.0,
              ),
            ),
            if (isToday)
              Container(
                margin: const EdgeInsets.only(top: 1),
                width: 3,
                height: 3,
                decoration: BoxDecoration(
                  color: context.pro.accent,
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
              context.pro.primary.withOpacity(0.15),
              context.pro.secondary.withOpacity(0.1),
              context.pro.accent.withOpacity(0.05),
              AppTheme.darkSurface,
            ],
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: context.pro.accent.withOpacity(0.4),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: context.pro.secondary.withOpacity(0.2),
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
                      context.pro.primary,
                      context.pro.secondary,
                      context.pro.accent,
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
                              context.pro.accent.withOpacity(0.4),
                              context.pro.secondary.withOpacity(0.3),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: context.pro.accent.withOpacity(0.5),
                            width: 1.5,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: context.pro.accent.withOpacity(0.3),
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
                                    context.pro.accent.withOpacity(0.25),
                                    context.pro.secondary.withOpacity(0.15),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: context.pro.accent.withOpacity(0.3),
                                  width: 1,
                                ),
                              ),
                              child: Text(
                                _getMeetingTypeLabel(meeting.type),
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: context.pro.accent,
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
                          Icon(Icons.access_time, size: 18, color: context.pro.accent,),
                          const SizedBox(width: 8),
                          Text(
                            meeting.time!,
                            style: TextStyle(
                              fontSize: 14,
                              color: AppTheme.white,
                            ),
                          ),
                          if (meeting.location != null) const SizedBox(width: 16),
                        ],
                        if (meeting.location != null) ...[
                          Icon(Icons.location_on, size: 18, color: context.pro.accent),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              meeting.location!,
                              style: TextStyle(
                                fontSize: 14,
                                color: AppTheme.white,
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
                'Agregar sesión',
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
                        labelStyle: const TextStyle(color: AppTheme.white),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: context.pro.accent),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: selectedType,
                      decoration: InputDecoration(
                        labelText: 'Tipo',
                        labelStyle: const TextStyle(color: AppTheme.white),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: context.pro.accent),
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
                              labelStyle: const TextStyle(color: AppTheme.white),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: AppTheme.white),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: context.pro.accent),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              suffixIcon: const Icon(Icons.access_time, color: AppTheme.white),
                            ),
                            onTap: () async {
                              final time = await showTimePicker(
                                context: context,
                                initialTime: TimeOfDay.now(),
                                builder: (context, child) {
                                  return Theme(
                                    data: ThemeData.dark().copyWith(
                                      colorScheme: ColorScheme.dark(
                                        primary: context.pro.accent,
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
                        labelStyle: const TextStyle(color: AppTheme.white),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: context.pro.accent),
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
                    style: TextStyle(color: AppTheme.white),
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

                    final meetingDate = DateFormat('yyyy-MM-dd').format(_selectedMeetingDate);
                    final meetingTime = timeController.text.isNotEmpty ? timeController.text : null;
                    
                    // Verificar empalmes
                    final overlappingEvents = await _checkEventOverlaps(meetingDate, meetingTime);
                    if (overlappingEvents.isNotEmpty) {
                      final shouldContinue = await _showOverlapWarning(context, overlappingEvents);
                      if (!shouldContinue) {
                        setDialogState(() {
                          isSaving = false;
                        });
                        return;
                      }
                    }

                    final meetingId = DateTime.now().millisecondsSinceEpoch.toString();
                    
                    // Crear WorkMeeting
                    final newMeeting = WorkMeeting(
                      id: meetingId,
                      name: nameController.text.trim(),
                      date: meetingDate,
                      time: meetingTime,
                      location: locationController.text.isNotEmpty ? locationController.text : null,
                      type: selectedType,
                      createdAt: DateTime.now(),
                    );

                    // Crear EventOrganization para sincronizar con personal
                    final syncEvent = EventOrganization(
                      id: meetingId,
                      eventName: nameController.text.trim(),
                      date: meetingDate,
                      time: meetingTime,
                      location: locationController.text.isNotEmpty ? locationController.text : null,
                      type: 'work',
                      createdAt: DateTime.now(),
                    );

                    // Guardar en Supabase
                    try {
                      final result = await _eventService.addEvent(syncEvent);
                      if (result['success'] == true) {
                        setState(() {
                          _workMeetings.add(newMeeting);
                        });

                        Navigator.of(dialogContext).pop();
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Sesión agregada exitosamente y sincronizada con eventos personales'),
                              backgroundColor: Colors.green,
                              duration: Duration(seconds: 2),
                            ),
                          );
                        }
                      } else {
                        setDialogState(() {
                          errorMessage = result['error'] ?? 'Error al sincronizar con eventos personales';
                          isSaving = false;
                        });
                      }
                    } catch (e) {
                      setDialogState(() {
                        errorMessage = 'Error al sincronizar: $e';
                        isSaving = false;
                      });
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: context.pro.accent,
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

  Widget _buildDailyTasks(BuildContext context) {
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
                  Colors.blue.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.blue.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(
                    Icons.today,
                    size: 32,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Tareas',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Organiza tu trabajo día a día',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
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
                  color: context.pro.teal,
                  gradientColors: [context.pro.teal, context.pro.accent],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.today,
                  value: '$todayTasks',
                  label: 'Hoy',
                  color: context.pro.accent,
                  gradientColors: [context.pro.accent, context.pro.secondary],
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
                        labelStyle: const TextStyle(color: AppTheme.white),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: context.pro.accent),
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
                              labelStyle: const TextStyle(color: AppTheme.white),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: AppTheme.white),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: context.pro.accent),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              suffixIcon: const Icon(Icons.calendar_today, color: AppTheme.white),
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
                                        primary: context.pro.accent,
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
                              labelStyle: const TextStyle(color: AppTheme.white),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: AppTheme.white),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: context.pro.accent),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              suffixIcon: const Icon(Icons.access_time, color: AppTheme.white),
                            ),
                            onTap: () async {
                              final time = await showTimePicker(
                                context: context,
                                initialTime: selectedTime ?? TimeOfDay.now(),
                                builder: (context, child) {
                                  return Theme(
                                    data: ThemeData.dark().copyWith(
                                      colorScheme: ColorScheme.dark(
                                        primary: context.pro.accent,
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
                        labelStyle: const TextStyle(color: AppTheme.white),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: context.pro.accent),
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
                                color: _getPriorityColor('high', context),
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
                                color: _getPriorityColor('medium', context),
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
                                color: _getPriorityColor('low', context),
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
                    style: TextStyle(color: AppTheme.white),
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
                    backgroundColor: context.pro.accent,
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


  Widget _buildProjects(BuildContext context) {
    final completedProjects = _projects.where((p) {
      if (p.goals.isEmpty) return false;
      final completedGoals = p.goals.where((g) => g.completed == true).length;
      return completedGoals == p.goals.length && p.goals.isNotEmpty;
    }).length;
    final activeProjects = _projects.length - completedProjects;
    final totalGoals = _projects.fold(0, (sum, p) => sum + p.goals.length);
    final completedGoals = _projects.fold(0, (sum, p) => sum + p.goals.where((g) => g.completed == true).length);
    
    final content = SingleChildScrollView(
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
                      Colors.blue.withOpacity(0.2),
                      AppTheme.darkSurface,
                      AppTheme.darkSurfaceVariant,
                    ],
                  ),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(
                        Icons.folder_special,
                        size: 32,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Proyectos',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Gestiona y organiza tus proyectos',
                            style: TextStyle(
                              fontSize: 14,
                              color: AppTheme.white,
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
                      color: context.pro.accent,
                      gradientColors: [context.pro.accent, context.pro.secondary],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSummaryCard(
                      icon: Icons.check_circle,
                      value: '$completedProjects',
                      label: 'Completados',
                      color: context.pro.teal,
                      gradientColors: [context.pro.teal, Colors.green],
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
                      color: AppTheme.white,
                      gradientColors: [context.pro.indigo, context.pro.accent],
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
                  context.pro.accent,
                  [context.pro.primary, context.pro.secondary],
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
    
    // Envolver en Stack para mostrar el modal
    return Stack(
      children: [
        content,
        if (_showAddProjectModal) _buildAddProjectModal(),
      ],
    );
  }
  
  Widget _buildAddProjectModal() {
    return Container(
      color: Colors.black.withOpacity(0.85),
      child: SafeArea(
        child: Center(
          child: Container(
            margin: const EdgeInsets.all(16),
            constraints: BoxConstraints(
              maxHeight: MediaQuery.of(context).size.height * 0.92,
              maxWidth: 500,
            ),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant.withOpacity(0.8),
                  context.pro.primary.withOpacity(0.1),
                  AppTheme.darkSurface,
                ],
                stops: const [0.0, 0.3, 0.7, 1.0],
              ),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(
                color: context.pro.accent.withOpacity(0.4),
                width: 2,
              ),
              boxShadow: [
                BoxShadow(
                  color: context.pro.primary.withOpacity(0.4),
                  blurRadius: 30,
                  spreadRadius: 8,
                  offset: const Offset(0, 8),
                ),
                BoxShadow(
                  color: context.pro.accent.withOpacity(0.2),
                  blurRadius: 15,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: ClipRRect(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                // Header mejorado con gradiente
                Container(
                  padding: const EdgeInsets.fromLTRB(28, 28, 28, 24),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        context.pro.primary,
                        context.pro.secondary,
                        context.pro.accent,
                        context.pro.secondary,
                      ],
                      stops: const [0.0, 0.3, 0.7, 1.0],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: context.pro.primary.withOpacity(0.3),
                        blurRadius: 15,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              Colors.white.withOpacity(0.25),
                              Colors.white.withOpacity(0.15),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.4),
                            width: 1.5,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.folder_special,
                          color: AppTheme.white,
                          size: 32,
                        ),
                      ),
                      const SizedBox(width: 18),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _editingProjectId != null ? 'Editar Proyecto' : 'Agregar Proyecto',
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                                letterSpacing: 0.8,
                                shadows: [
                                  Shadow(
                                    color: Colors.black26,
                                    blurRadius: 4,
                                    offset: Offset(0, 2),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              _editingProjectId != null
                                  ? 'Modifica los datos del proyecto.'
                                  : 'Crea un proyecto.',
                              style: TextStyle(
                                fontSize: 14,
                                color: AppTheme.white.withOpacity(0.85),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              Colors.white.withOpacity(0.25),
                              Colors.white.withOpacity(0.15),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.3),
                            width: 1.5,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.15),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.close, color: AppTheme.white),
                          onPressed: () {
                            setState(() {
                              _showAddProjectModal = false;
                              _clearProjectModal();
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                ),
                
                // Tabs para navegar entre secciones
                Container(
                  margin: const EdgeInsets.fromLTRB(24, 0, 24, 8),
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        AppTheme.darkSurfaceVariant.withOpacity(0.6),
                        AppTheme.darkSurface.withOpacity(0.8),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: context.pro.accent.withOpacity(0.2),
                      width: 1.2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: _buildProjectModalTab('basic', 'Básica'),
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: _buildProjectModalTab('goals', 'Metas'),
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: _buildProjectModalTab('strategy', 'Estrategia'),
                      ),
                    ],
                  ),
                ),
                
                // Contenido con scroll
                Flexible(
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      maxHeight: MediaQuery.of(context).size.height * 0.5,
                    ),
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.fromLTRB(24, 8, 24, 16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (_activeProjectModalTab == 'basic') ...[
                        // Sección: Información Básica
                        Container(
                          margin: const EdgeInsets.only(top: 8),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                context.pro.primary.withOpacity(0.15),
                                context.pro.secondary.withOpacity(0.1),
                                AppTheme.darkSurfaceVariant.withOpacity(0.3),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: context.pro.primary.withOpacity(0.3),
                              width: 1,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [context.pro.primary, context.pro.secondary],
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Icon(
                                      Icons.info_outline,
                                      color: AppTheme.white,
                                      size: 20,
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  const Text(
                                    'Información Básica',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.white,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 20),
                              
                              // Nombre del proyecto
                              TextField(
                                controller: _projectNameController,
                                style: const TextStyle(
                                  color: AppTheme.white,
                                  fontSize: 16,
                                ),
                                decoration: InputDecoration(
                                  labelText: 'Nombre del Proyecto',
                                  labelStyle: TextStyle(
                                    color: AppTheme.white,
                                    fontWeight: FontWeight.w500,
                                  ),
                                  hintText: 'Ej: Desarrollo Web App',
                                  hintStyle: TextStyle(
                                    color: AppTheme.white,
                                  ),
                                  prefixIcon: Icon(
                                    Icons.title,
                                    color: context.pro.accent,
                                  ),
                                  filled: true,
                                  fillColor: AppTheme.darkSurface.withOpacity(0.6),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.accent.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.accent.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.accent,
                                      width: 2,
                                    ),
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 16,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),
                              
                              // Descripción
                              TextField(
                                controller: _projectDescriptionController,
                                style: const TextStyle(
                                  color: AppTheme.white,
                                  fontSize: 15,
                                ),
                                maxLines: 4,
                                decoration: InputDecoration(
                                  labelText: 'Descripción del Proyecto',
                                  labelStyle: TextStyle(
                                    color: AppTheme.white,
                                    fontWeight: FontWeight.w500,
                                  ),
                                  hintText: 'Describe brevemente el objetivo del proyecto...',
                                  hintStyle: TextStyle(
                                    color: AppTheme.white,
                                  ),
                                  prefixIcon: Padding(
                                    padding: const EdgeInsets.only(bottom: 60),
                                    child: Icon(
                                      Icons.description,
                                      color: context.pro.accent,
                                    ),
                                  ),
                                  filled: true,
                                  fillColor: AppTheme.darkSurface.withOpacity(0.6),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.accent.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.accent.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.accent,
                                      width: 2,
                                    ),
                                  ),
                                  contentPadding: const EdgeInsets.all(16),
                                ),
                              ),
                              const SizedBox(height: 16),
                              
                              // Fecha límite mejorada
                              GestureDetector(
                                onTap: () async {
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
                                child: Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: _selectedProjectDeadline != null
                                          ? [
                                              context.pro.teal.withOpacity(0.3),
                                              context.pro.accent.withOpacity(0.2),
                                            ]
                                          : [
                                              AppTheme.darkSurface.withOpacity(0.6),
                                              AppTheme.darkSurfaceVariant.withOpacity(0.4),
                                            ],
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: _selectedProjectDeadline != null
                                          ? context.pro.teal.withOpacity(0.5)
                                          : context.pro.accent.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                          gradient: LinearGradient(
                                            colors: _selectedProjectDeadline != null
                                                ? [context.pro.teal, context.pro.accent]
                                                : [
                                                    context.pro.accent.withOpacity(0.5),
                                                    context.pro.secondary.withOpacity(0.5),
                                                  ],
                                          ),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Icon(
                                          Icons.calendar_today,
                                          color: AppTheme.white,
                                          size: 20,
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              'Fecha Límite',
                                              style: TextStyle(
                                                fontSize: 12,
                                                color: AppTheme.white,
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              _selectedProjectDeadline != null
                                                  ? DateFormat('EEEE, d MMMM yyyy', 'es').format(_selectedProjectDeadline!)
                                                  : 'Toca para seleccionar fecha',
                                              style: TextStyle(
                                                fontSize: 14,
                                                color: _selectedProjectDeadline != null
                                                    ? AppTheme.white
                                                    : AppTheme.white,
                                                fontWeight: _selectedProjectDeadline != null
                                                    ? FontWeight.w600
                                                    : FontWeight.normal,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Icon(
                                        Icons.arrow_forward_ios,
                                        size: 16,
                                        color: context.pro.accent,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                          ],
                          if (_activeProjectModalTab == 'goals') ...[
                        // Sección: Metas del Proyecto
                        Container(
                          margin: const EdgeInsets.only(top: 8),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                context.pro.indigo.withOpacity(0.15),
                                context.pro.accent.withOpacity(0.1),
                                AppTheme.darkSurfaceVariant.withOpacity(0.3),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: context.pro.indigo.withOpacity(0.3),
                              width: 1,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [context.pro.indigo, context.pro.accent],
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Icon(
                                      Icons.flag,
                                      color: AppTheme.white,
                                      size: 20,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  const Text(
                                    'Metas del Proyecto',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.white,
                                    ),
                                  ),
                                  const Spacer(),
                                  if (_tempProjectGoals.isNotEmpty)
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        gradient: LinearGradient(
                                          colors: [context.pro.indigo, context.pro.accent],
                                        ),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        '${_tempProjectGoals.length}',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                          color: AppTheme.white,
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                              const SizedBox(height: 20),
                              
                              // Campo de texto de la meta
                              TextField(
                                controller: _tempGoalTextController,
                                style: const TextStyle(
                                  color: AppTheme.white,
                                  fontSize: 15,
                                ),
                                decoration: InputDecoration(
                                  labelText: 'Descripción de la Meta',
                                  labelStyle: TextStyle(
                                    color: AppTheme.white,
                                    fontWeight: FontWeight.w500,
                                  ),
                                  hintText: 'Ej: Completar diseño de interfaz',
                                  hintStyle: TextStyle(
                                    color: AppTheme.white,
                                  ),
                                  prefixIcon: Icon(
                                    Icons.flag,
                                    color: context.pro.indigo,
                                  ),
                                  filled: true,
                                  fillColor: AppTheme.darkSurface.withOpacity(0.6),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.indigo.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.indigo.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.indigo,
                                      width: 2,
                                    ),
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 16,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 12),
                              
                              // Campo para responsable
                              TextField(
                                controller: _tempGoalPersonController,
                                style: const TextStyle(
                                  color: AppTheme.white,
                                  fontSize: 14,
                                ),
                                decoration: InputDecoration(
                                  labelText: 'Responsable',
                                  labelStyle: TextStyle(
                                    color: AppTheme.white,
                                    fontWeight: FontWeight.w500,
                                  ),
                                  hintText: 'Nombre',
                                  hintStyle: TextStyle(
                                    color: AppTheme.white,
                                  ),
                                  prefixIcon: Icon(
                                    Icons.person,
                                    color: context.pro.teal,
                                    size: 20,
                                  ),
                                  filled: true,
                                  fillColor: AppTheme.darkSurface.withOpacity(0.6),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.teal.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.teal.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.teal,
                                      width: 2,
                                    ),
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 16,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 12),
                              
                              // Campo para fecha
                              GestureDetector(
                                onTap: () async {
                                  final date = await showDatePicker(
                                    context: context,
                                    initialDate: _tempGoalDate ?? DateTime.now(),
                                    firstDate: DateTime(2020),
                                    lastDate: DateTime(2030),
                                  );
                                  if (date != null) {
                                    setState(() => _tempGoalDate = date);
                                  }
                                },
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: _tempGoalDate != null
                                          ? [
                                              context.pro.teal.withOpacity(0.3),
                                              context.pro.accent.withOpacity(0.2),
                                            ]
                                          : [
                                              AppTheme.darkSurface.withOpacity(0.6),
                                              AppTheme.darkSurfaceVariant.withOpacity(0.4),
                                            ],
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: _tempGoalDate != null
                                          ? context.pro.teal.withOpacity(0.5)
                                          : context.pro.teal.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.calendar_today,
                                        color: _tempGoalDate != null
                                            ? context.pro.teal
                                            : AppTheme.white,
                                        size: 18,
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          _tempGoalDate != null
                                              ? DateFormat('dd/MM/yyyy').format(_tempGoalDate!)
                                              : 'Fecha',
                                          style: TextStyle(
                                            fontSize: 14,
                                            color: _tempGoalDate != null
                                                ? AppTheme.white
                                                : AppTheme.white,
                                            fontWeight: _tempGoalDate != null
                                                ? FontWeight.w600
                                                : FontWeight.normal,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),
                              
                              // Botón para agregar meta mejorado
                              SizedBox(
                                width: double.infinity,
                                child: Container(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        context.pro.indigo,
                                        context.pro.accent,
                                        context.pro.teal,
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                    boxShadow: [
                                      BoxShadow(
                                        color: context.pro.indigo.withOpacity(0.4),
                                        blurRadius: 8,
                                        offset: const Offset(0, 4),
                                      ),
                                    ],
                                  ),
                                  child: ElevatedButton.icon(
                                  onPressed: () {
                                    if (_tempGoalTextController.text.trim().isNotEmpty) {
                                      // Validar que la fecha de la meta no sea posterior a la fecha límite del proyecto
                                      if (_selectedProjectDeadline != null && _tempGoalDate != null) {
                                        // Comparar solo las fechas (sin hora)
                                        final goalDateOnly = DateTime(_tempGoalDate!.year, _tempGoalDate!.month, _tempGoalDate!.day);
                                        final deadlineDateOnly = DateTime(_selectedProjectDeadline!.year, _selectedProjectDeadline!.month, _selectedProjectDeadline!.day);
                                        
                                        if (goalDateOnly.isAfter(deadlineDateOnly)) {
                                          // Mostrar diálogo de advertencia
                                          showDialog(
                                            context: context,
                                            builder: (BuildContext context) {
                                              return AlertDialog(
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
                                                        borderRadius: BorderRadius.circular(8),
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
                                                        'Fecha Inválida',
                                                        style: TextStyle(
                                                          color: AppTheme.white,
                                                          fontSize: 18,
                                                          fontWeight: FontWeight.bold,
                                                        ),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                content: Column(
                                                  mainAxisSize: MainAxisSize.min,
                                                  crossAxisAlignment: CrossAxisAlignment.start,
                                                  children: [
                                                    const Text(
                                                      'La fecha de la meta no puede ser posterior a la fecha límite del proyecto.',
                                                      style: TextStyle(
                                                        color: AppTheme.white,
                                                        fontSize: 14,
                                                      ),
                                                    ),
                                                    const SizedBox(height: 16),
                                                    Container(
                                                      padding: const EdgeInsets.all(12),
                                                      decoration: BoxDecoration(
                                                        color: AppTheme.darkBackground,
                                                        borderRadius: BorderRadius.circular(8),
                                                      ),
                                                      child: Column(
                                                        crossAxisAlignment: CrossAxisAlignment.start,
                                                        children: [
                                                          Row(
                                                            children: [
                                                              const Icon(Icons.calendar_today, size: 16, color: AppTheme.white),
                                                              const SizedBox(width: 8),
                                                              const Text(
                                                                'Fecha de la meta:',
                                                                style: TextStyle(
                                                                  color: AppTheme.white,
                                                                  fontSize: 12,
                                                                ),
                                                              ),
                                                            ],
                                                          ),
                                                          const SizedBox(height: 4),
                                                          Text(
                                                            DateFormat('EEEE, d MMMM yyyy', 'es').format(_tempGoalDate!),
                                                            style: const TextStyle(
                                                              color: AppTheme.white,
                                                              fontSize: 14,
                                                              fontWeight: FontWeight.w600,
                                                            ),
                                                          ),
                                                          const SizedBox(height: 12),
                                                          Row(
                                                            children: [
                                                              const Icon(Icons.event_busy, size: 16, color: AppTheme.white),
                                                              const SizedBox(width: 8),
                                                              const Text(
                                                                'Fecha límite del proyecto:',
                                                                style: TextStyle(
                                                                  color: AppTheme.white,
                                                                  fontSize: 12,
                                                                ),
                                                              ),
                                                            ],
                                                          ),
                                                          const SizedBox(height: 4),
                                                          Text(
                                                            DateFormat('EEEE, d MMMM yyyy', 'es').format(_selectedProjectDeadline!),
                                                            style: const TextStyle(
                                                              color: AppTheme.white,
                                                              fontSize: 14,
                                                              fontWeight: FontWeight.w600,
                                                            ),
                                                          ),
                                                        ],
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                actions: [
                                                  TextButton(
                                                    onPressed: () => Navigator.of(context).pop(),
                                                    child: const Text(
                                                      'Entendido',
                                                      style: TextStyle(
                                                        color: AppTheme.orangeAccent,
                                                        fontWeight: FontWeight.bold,
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                              );
                                            },
                                          );
                                          return;
                                        }
                                      }
                                      
                                      setState(() {
                                        _tempProjectGoals.add(ProjectGoal(
                                          id: DateTime.now().millisecondsSinceEpoch.toString(),
                                          text: _tempGoalTextController.text.trim(),
                                          person: _tempGoalPersonController.text.trim().isNotEmpty
                                              ? _tempGoalPersonController.text.trim()
                                              : null,
                                          date: _tempGoalDate,
                                        ));
                                        _tempGoalTextController.clear();
                                        _tempGoalPersonController.clear();
                                        _tempGoalDate = null;
                                      });
                                    } else {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(content: Text('Por favor ingresa una descripción para la meta')),
                                      );
                                    }
                                  },
                                  icon: const Icon(Icons.add_circle_outline, size: 22),
                                  label: const Text(
                                    'Agregar Meta',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.transparent,
                                    foregroundColor: AppTheme.white,
                                    shadowColor: Colors.transparent,
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 24,
                                      vertical: 14,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                              const SizedBox(height: 16),
                              
                              // Lista de metas agregadas mejorada
                              if (_tempProjectGoals.isNotEmpty)
                                Container(
                                  padding: const EdgeInsets.all(20),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        context.pro.indigo.withOpacity(0.25),
                                        context.pro.accent.withOpacity(0.18),
                                        AppTheme.darkSurfaceVariant.withOpacity(0.35),
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: context.pro.indigo.withOpacity(0.5),
                                      width: 1.5,
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: context.pro.indigo.withOpacity(0.15),
                                        blurRadius: 12,
                                        offset: const Offset(0, 4),
                                      ),
                                    ],
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.all(8),
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                colors: [context.pro.indigo, context.pro.accent],
                                              ),
                                              borderRadius: BorderRadius.circular(10),
                                            ),
                                            child: const Icon(
                                              Icons.checklist_rounded,
                                              color: AppTheme.white,
                                              size: 20,
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: Text(
                                              'Metas Agregadas',
                                              style: TextStyle(
                                                fontSize: 16,
                                                fontWeight: FontWeight.bold,
                                                color: AppTheme.white,
                                                letterSpacing: 0.5,
                                              ),
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                colors: [context.pro.indigo, context.pro.accent],
                                              ),
                                              borderRadius: BorderRadius.circular(12),
                                              boxShadow: [
                                                BoxShadow(
                                                  color: context.pro.indigo.withOpacity(0.4),
                                                  blurRadius: 6,
                                                  offset: const Offset(0, 2),
                                                ),
                                              ],
                                            ),
                                            child: Text(
                                              '${_tempProjectGoals.length}',
                                              style: const TextStyle(
                                                fontSize: 13,
                                                fontWeight: FontWeight.bold,
                                                color: AppTheme.white,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 16),
                                      ..._tempProjectGoals.asMap().entries.map((entry) {
                                        final index = entry.key;
                                        final goal = entry.value;
                                        return TweenAnimationBuilder<double>(
                                          tween: Tween(begin: 0.0, end: 1.0),
                                          duration: Duration(milliseconds: 300 + (index * 50)),
                                          builder: (context, value, child) {
                                            return Opacity(
                                              opacity: value,
                                              child: Transform.translate(
                                                offset: Offset(0, 20 * (1 - value)),
                                                child: child,
                                              ),
                                            );
                                          },
                                          child: Container(
                                            margin: const EdgeInsets.only(bottom: 12),
                                            padding: const EdgeInsets.all(16),
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                begin: Alignment.topLeft,
                                                end: Alignment.bottomRight,
                                                colors: [
                                                  AppTheme.darkSurface.withOpacity(0.9),
                                                  AppTheme.darkSurfaceVariant.withOpacity(0.7),
                                                ],
                                              ),
                                              borderRadius: BorderRadius.circular(14),
                                              border: Border.all(
                                                color: context.pro.indigo.withOpacity(0.4),
                                                width: 1.5,
                                              ),
                                              boxShadow: [
                                                BoxShadow(
                                                  color: context.pro.indigo.withOpacity(0.15),
                                                  blurRadius: 10,
                                                  offset: const Offset(0, 3),
                                                ),
                                              ],
                                            ),
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Row(
                                                  children: [
                                                    Container(
                                                      width: 36,
                                                      height: 36,
                                                      decoration: BoxDecoration(
                                                        gradient: LinearGradient(
                                                          colors: [context.pro.indigo, context.pro.accent],
                                                        ),
                                                        borderRadius: BorderRadius.circular(18),
                                                        boxShadow: [
                                                          BoxShadow(
                                                            color: context.pro.indigo.withOpacity(0.5),
                                                            blurRadius: 6,
                                                            offset: const Offset(0, 3),
                                                          ),
                                                        ],
                                                      ),
                                                      child: Center(
                                                        child: Text(
                                                          '${index + 1}',
                                                          style: const TextStyle(
                                                            fontSize: 15,
                                                            fontWeight: FontWeight.bold,
                                                            color: AppTheme.white,
                                                          ),
                                                        ),
                                                      ),
                                                    ),
                                                    const SizedBox(width: 14),
                                                    Expanded(
                                                      child: Text(
                                                        goal.text,
                                                        style: const TextStyle(
                                                          color: AppTheme.white,
                                                          fontSize: 16,
                                                          fontWeight: FontWeight.w600,
                                                          letterSpacing: 0.2,
                                                        ),
                                                      ),
                                                    ),
                                                    const SizedBox(width: 8),
                                                    Container(
                                                      decoration: BoxDecoration(
                                                        color: Colors.red.withOpacity(0.15),
                                                        borderRadius: BorderRadius.circular(10),
                                                        border: Border.all(
                                                          color: Colors.red.withOpacity(0.3),
                                                          width: 1,
                                                        ),
                                                      ),
                                                      child: IconButton(
                                                        icon: const Icon(Icons.close_rounded, size: 18, color: Colors.red),
                                                        padding: const EdgeInsets.all(8),
                                                        constraints: const BoxConstraints(),
                                                        onPressed: () {
                                                          setState(() {
                                                            _tempProjectGoals.removeWhere((g) => g.id == goal.id);
                                                          });
                                                        },
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                if (goal.person != null || goal.date != null) ...[
                                                  const SizedBox(height: 16),
                                                  Container(
                                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                                    decoration: BoxDecoration(
                                                      gradient: LinearGradient(
                                                        begin: Alignment.topLeft,
                                                        end: Alignment.bottomRight,
                                                        colors: [
                                                          context.pro.indigo.withOpacity(0.15),
                                                          context.pro.accent.withOpacity(0.1),
                                                        ],
                                                      ),
                                                      borderRadius: BorderRadius.circular(10),
                                                      border: Border.all(
                                                        color: context.pro.indigo.withOpacity(0.3),
                                                        width: 1,
                                                      ),
                                                    ),
                                                    child: Column(
                                                      crossAxisAlignment: CrossAxisAlignment.start,
                                                      children: [
                                                        if (goal.person != null) ...[
                                                          Row(
                                                            children: [
                                                              Container(
                                                                padding: const EdgeInsets.all(7),
                                                                decoration: BoxDecoration(
                                                                  gradient: LinearGradient(
                                                                    colors: [context.pro.teal, context.pro.accent],
                                                                  ),
                                                                  borderRadius: BorderRadius.circular(8),
                                                                  boxShadow: [
                                                                    BoxShadow(
                                                                      color: context.pro.teal.withOpacity(0.3),
                                                                      blurRadius: 4,
                                                                      offset: const Offset(0, 2),
                                                                    ),
                                                                  ],
                                                                ),
                                                                child: const Icon(
                                                                  Icons.person_rounded,
                                                                  size: 16,
                                                                  color: AppTheme.white,
                                                                ),
                                                              ),
                                                              const SizedBox(width: 10),
                                                              Expanded(
                                                                child: Text(
                                                                  goal.person!,
                                                                  style: const TextStyle(
                                                                    fontSize: 14,
                                                                    color: AppTheme.white,
                                                                    fontWeight: FontWeight.w600,
                                                                  ),
                                                                ),
                                                              ),
                                                            ],
                                                          ),
                                                        ],
                                                        if (goal.person != null && goal.date != null)
                                                          const SizedBox(height: 12),
                                                        if (goal.date != null) ...[
                                                          Row(
                                                            children: [
                                                              Container(
                                                                padding: const EdgeInsets.all(7),
                                                                decoration: BoxDecoration(
                                                                  gradient: LinearGradient(
                                                                    colors: [context.pro.teal, context.pro.accent],
                                                                  ),
                                                                  borderRadius: BorderRadius.circular(8),
                                                                  boxShadow: [
                                                                    BoxShadow(
                                                                      color: context.pro.teal.withOpacity(0.3),
                                                                      blurRadius: 4,
                                                                      offset: const Offset(0, 2),
                                                                    ),
                                                                  ],
                                                                ),
                                                                child: const Icon(
                                                                  Icons.calendar_today_rounded,
                                                                  size: 16,
                                                                  color: AppTheme.white,
                                                                ),
                                                              ),
                                                              const SizedBox(width: 10),
                                                              Expanded(
                                                                child: Text(
                                                                  DateFormat('dd MMM yyyy', 'es').format(goal.date!),
                                                                  style: const TextStyle(
                                                                    fontSize: 14,
                                                                    color: AppTheme.white,
                                                                    fontWeight: FontWeight.w600,
                                                                  ),
                                                                ),
                                                              ),
                                                            ],
                                                          ),
                                                        ],
                                                      ],
                                                    ),
                                                  ),
                                                ],
                                              ],
                                            ),
                                          ),
                                        );
                                      }),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          ],
                          if (_activeProjectModalTab == 'strategy') ...[
                        // Sección: Estrategia del Proyecto
                        Container(
                          margin: const EdgeInsets.only(top: 8),
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                context.pro.indigo.withOpacity(0.2),
                                context.pro.accent.withOpacity(0.15),
                                AppTheme.darkSurfaceVariant.withOpacity(0.35),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: context.pro.indigo.withOpacity(0.4),
                              width: 1.5,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: context.pro.indigo.withOpacity(0.15),
                                blurRadius: 12,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [context.pro.indigo, context.pro.accent],
                                      ),
                                      borderRadius: BorderRadius.circular(12),
                                      boxShadow: [
                                        BoxShadow(
                                          color: context.pro.indigo.withOpacity(0.4),
                                          blurRadius: 8,
                                          offset: const Offset(0, 3),
                                        ),
                                      ],
                                    ),
                                    child: const Icon(
                                      Icons.track_changes_rounded,
                                      color: AppTheme.white,
                                      size: 22,
                                    ),
                                  ),
                                  const SizedBox(width: 14),
                                  const Expanded(
                                    child: Text(
                                      'Estrategia del Proyecto',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.white,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 24),
                              
                              // COMPAÑEROS DE EQUIPO
                              _buildStrategySectionHeader('Compañeros de equipo', Icons.people),
                              const SizedBox(height: 12),
                              _buildAddTeammateForm(),
                              const SizedBox(height: 12),
                              if (_tempProjectTeammates.isNotEmpty)
                                ..._tempProjectTeammates.map((teammate) => _buildTeammateCard(teammate)),
                              
                              const SizedBox(height: 24),
                              
                              // LOGROS
                              _buildStrategySectionHeader('Logros', Icons.star),
                              const SizedBox(height: 12),
                              _buildAddAchievementForm(),
                              const SizedBox(height: 12),
                              if (_tempProjectAchievements.isNotEmpty)
                                ..._tempProjectAchievements.map((achievement) => _buildAchievementCard(achievement)),
                              
                              const SizedBox(height: 24),
                              
                              // TRABAJOS
                              _buildStrategySectionHeader('Actividades', Icons.work),
                              const SizedBox(height: 12),
                              _buildAddWorkForm(),
                              const SizedBox(height: 12),
                              if (_tempProjectWorks.isNotEmpty)
                                ..._tempProjectWorks.map((work) => _buildWorkCard(work)),
                              
                              const SizedBox(height: 24),
                              
                              // FINANCIAMIENTO
                              _buildStrategySectionHeader('Financiamiento', null),
                              const SizedBox(height: 12),
                              _buildAddFundingForm(),
                              const SizedBox(height: 12),
                              if (_tempProjectFunding.isNotEmpty)
                                ..._tempProjectFunding.map((funding) => _buildFundingCard(funding)),
                            ],
                          ),
                        ),
                          ],
                        ],
                    ),
                  ),
                ),
                ),
                
                // Footer con botones de acción mejorados
                Container(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 40),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        AppTheme.darkSurface.withOpacity(0.8),
                        AppTheme.darkSurface,
                      ],
                    ),
                    border: Border(
                      top: BorderSide(
                        color: context.pro.accent.withOpacity(0.2),
                        width: 1,
                      ),
                    ),
                  ),
                  child: SafeArea(
                    top: false,
                    child: Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              setState(() {
                                _showAddProjectModal = false;
                                _projectNameController.clear();
                                _projectDescriptionController.clear();
                                _tempProjectGoals.clear();
                                _tempGoalTextController.clear();
                                _tempGoalPersonController.clear();
                                _tempGoalDate = null;
                                _selectedProjectDeadline = null;
                                _activeProjectModalTab = 'basic';
                                _tempProjectTeammates.clear();
                                _tempProjectAchievements.clear();
                                _tempProjectWorks.clear();
                                _tempProjectFunding.clear();
                                _tempTeammateNameController.clear();
                                _tempTeammateRoleController.clear();
                                _tempAchievementNameController.clear();
                                _tempAchievementDueDateController.clear();
                                _tempWorkPositionController.clear();
                                _tempWorkAppointController.clear();
                                _tempWorkStatusController.clear();
                                _tempWorkNotesController.clear();
                                _tempFundingElementController.clear();
                                _tempFundingNotesController.clear();
                                _tempAchievementDueDate = null;
                                _tempWorkStartDate = null;
                                _tempWorkDeadline = null;
                              });
                            },
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppTheme.white,
                              side: BorderSide(
                                color: AppTheme.white.withOpacity(0.3),
                                width: 1.5,
                              ),
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text(
                              'Cancelar',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          flex: 2,
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  context.pro.primary,
                                  context.pro.secondary,
                                  context.pro.accent,
                                ],
                              ),
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color: context.pro.accent.withOpacity(0.4),
                                  blurRadius: 12,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: ElevatedButton.icon(
                              onPressed: _addProject,
                              icon: Container(
                                padding: const EdgeInsets.all(4),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Icon(
                                  _editingProjectId != null ? Icons.save : Icons.add_task,
                                  size: 22,
                                ),
                              ),
                              label: Text(
                                _editingProjectId != null ? 'Guardar Cambios' : 'Crear Proyecto',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.5,
                                  shadows: [
                                    Shadow(
                                      color: Colors.black26,
                                      blurRadius: 4,
                                      offset: Offset(0, 2),
                                    ),
                                  ],
                                ),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                foregroundColor: AppTheme.white,
                                shadowColor: Colors.transparent,
                                padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                  side: BorderSide(
                                    color: Colors.white.withOpacity(0.3),
                                    width: 1.5,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      ),
    );
  }
  
  void _editProject(WorkProject project) {
    setState(() {
      _editingProjectId = project.id;
      _projectNameController.text = project.title;
      _projectDescriptionController.text = project.aim;
      _selectedProjectDeadline = project.deadline;
      _tempProjectTeammates = List.from(project.teammates);
      _tempProjectAchievements = List.from(project.achievements);
      _tempProjectWorks = List.from(project.works);
      _tempProjectFunding = List.from(project.funding);
      _tempProjectGoals = List.from(project.goals);
      _activeProjectModalTab = 'basic';
      _showAddProjectModal = true;
    });
  }
  
  void _clearProjectModal() {
    _editingProjectId = null;
    _projectNameController.clear();
    _projectDescriptionController.clear();
    _tempProjectGoals.clear();
    _tempGoalTextController.clear();
    _tempGoalPersonController.clear();
    _tempGoalDate = null;
    _selectedProjectDeadline = null;
    _activeProjectModalTab = 'basic';
    _tempProjectTeammates.clear();
    _tempProjectAchievements.clear();
    _tempProjectWorks.clear();
    _tempProjectFunding.clear();
    _tempTeammateNameController.clear();
    _tempTeammateRoleController.clear();
    _tempAchievementNameController.clear();
    _tempAchievementDueDateController.clear();
    _tempWorkPositionController.clear();
    _tempWorkAppointController.clear();
    _tempWorkStatusController.clear();
    _tempWorkNotesController.clear();
    _tempFundingElementController.clear();
    _tempFundingFondoController.clear();
    _tempFundingFinanciadoPorController.clear();
    _tempFundingNotesController.clear();
    _tempAchievementDueDate = null;
    _tempWorkStartDate = null;
    _tempWorkDeadline = null;
  }
  
  void _addProject() {
    if (_projectNameController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingresa un nombre para el proyecto')),
      );
      return;
    }
    
    setState(() {
      if (_editingProjectId != null) {
        // Actualizar proyecto existente
        final projectIndex = _projects.indexWhere((p) => p.id == _editingProjectId);
        if (projectIndex != -1) {
          final existingProject = _projects[projectIndex];
          _projects[projectIndex] = WorkProject(
            id: existingProject.id,
            title: _projectNameController.text.trim(),
            aim: _projectDescriptionController.text.trim(),
            startDate: existingProject.startDate,
            deadline: _selectedProjectDeadline,
            teammates: List<ProjectTeammate>.from(_tempProjectTeammates),
            achievements: List<ProjectAchievement>.from(_tempProjectAchievements),
            works: List<ProjectWork>.from(_tempProjectWorks),
            funding: List<ProjectFunding>.from(_tempProjectFunding),
            goals: List<ProjectGoal>.from(_tempProjectGoals),
            overview: existingProject.overview,
          );
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Proyecto actualizado exitosamente'),
              backgroundColor: Colors.green,
              duration: Duration(seconds: 2),
            ),
          );
        }
      } else {
        // Crear nuevo proyecto con copias de las listas para evitar referencias
        _projects.add(WorkProject(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          title: _projectNameController.text.trim(),
          aim: _projectDescriptionController.text.trim(),
          startDate: DateTime.now(),
          deadline: _selectedProjectDeadline,
          teammates: List<ProjectTeammate>.from(_tempProjectTeammates),
          achievements: List<ProjectAchievement>.from(_tempProjectAchievements),
          works: List<ProjectWork>.from(_tempProjectWorks),
          funding: List<ProjectFunding>.from(_tempProjectFunding),
          goals: List<ProjectGoal>.from(_tempProjectGoals),
          overview: null,
        ));
      }
      _showAddProjectModal = false;
      _clearProjectModal();
    });
  }

  Widget _buildProjectModalTab(String tabId, String label) {
    final isActive = _activeProjectModalTab == tabId;
    
    // Asignar icono según el tabId
    IconData icon;
    switch (tabId) {
      case 'basic':
        icon = Icons.info_outline;
        break;
      case 'goals':
        icon = Icons.flag;
        break;
      case 'strategy':
        icon = Icons.track_changes;
        break;
      default:
        icon = Icons.circle;
    }
    
    return GestureDetector(
      onTap: () {
        setState(() {
          _activeProjectModalTab = tabId;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
        decoration: BoxDecoration(
          gradient: isActive
              ? LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    context.pro.primary,
                    context.pro.secondary,
                    context.pro.accent,
                  ],
                  stops: const [0.0, 0.5, 1.0],
                )
              : null,
          color: isActive ? null : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          border: isActive
              ? Border.all(
                  color: Colors.white.withOpacity(0.3),
                  width: 1.2,
                )
              : null,
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: context.pro.primary.withOpacity(0.4),
                    blurRadius: 8,
                    spreadRadius: 0.5,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              padding: const EdgeInsets.all(3),
              decoration: BoxDecoration(
                color: isActive
                    ? Colors.white.withOpacity(0.2)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(5),
              ),
              child: Icon(
                icon,
                size: 14,
                color: isActive ? AppTheme.white : AppTheme.white,
              ),
            ),
            const SizedBox(width: 4),
            Flexible(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
                  color: isActive ? AppTheme.white : AppTheme.white,
                  letterSpacing: 0.2,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildStrategySectionHeader(String title, IconData? icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            context.pro.indigo.withOpacity(0.35),
            context.pro.accent.withOpacity(0.25),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.5),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.2),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          if (icon != null) ...[
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [context.pro.teal, context.pro.accent],
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: AppTheme.white, size: 18),
            ),
            const SizedBox(width: 12),
          ],
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: AppTheme.white,
                letterSpacing: 0.3,
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAddTeammateForm() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurfaceVariant.withOpacity(0.4),
            AppTheme.darkSurface.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          TextField(
            controller: _tempTeammateNameController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Nombre',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _tempTeammateRoleController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Rol/Puesto',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [context.pro.indigo, context.pro.accent],
                ),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: context.pro.indigo.withOpacity(0.4),
                    blurRadius: 6,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                onPressed: () {
                  if (_tempTeammateNameController.text.trim().isNotEmpty &&
                      _tempTeammateRoleController.text.trim().isNotEmpty) {
                    setState(() {
                      _tempProjectTeammates.add(ProjectTeammate(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        name: _tempTeammateNameController.text.trim(),
                        role: _tempTeammateRoleController.text.trim(),
                      ));
                      _tempTeammateNameController.clear();
                      _tempTeammateRoleController.clear();
                    });
                  }
                },
                icon: const Icon(Icons.add_rounded, color: AppTheme.white, size: 20),
                label: const Text(
                  'Agregar Compañero',
                  style: TextStyle(
                    color: AppTheme.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildTeammateCard(ProjectTeammate teammate) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurface.withOpacity(0.8),
            AppTheme.darkSurfaceVariant.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [context.pro.teal, context.pro.accent],
              ),
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: context.pro.teal.withOpacity(0.3),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const Icon(
              Icons.person_rounded,
              color: AppTheme.white,
              size: 18,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  teammate.name,
                  style: const TextStyle(
                    color: AppTheme.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.2,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  teammate.role,
                  style: TextStyle(
                    color: AppTheme.white,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: Colors.red.withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: Colors.red.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: IconButton(
              icon: const Icon(Icons.close_rounded, size: 18, color: Colors.red),
              padding: const EdgeInsets.all(8),
              constraints: const BoxConstraints(),
              onPressed: () {
                setState(() {
                  _tempProjectTeammates.removeWhere((t) => t.id == teammate.id);
                });
              },
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAddAchievementForm() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurfaceVariant.withOpacity(0.4),
            AppTheme.darkSurface.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          TextField(
            controller: _tempAchievementNameController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Nombre del logro',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          GestureDetector(
            onTap: () async {
              final date = await showDatePicker(
                context: context,
                initialDate: _tempAchievementDueDate ?? DateTime.now(),
                firstDate: DateTime(2020),
                lastDate: DateTime(2030),
              );
              if (date != null) {
                setState(() {
                  _tempAchievementDueDate = date;
                  _tempAchievementDueDateController.text = DateFormat('dd/MM/yyyy').format(date);
                });
              }
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    context.pro.indigo.withOpacity(0.3),
                    context.pro.accent.withOpacity(0.2),
                  ],
                ),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: context.pro.indigo.withOpacity(0.4),
                  width: 1.5,
                ),
              ),
              child: Row(
                children: [
                  Icon(Icons.calendar_today_rounded, size: 16, color: context.pro.indigo),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _tempAchievementDueDate != null
                          ? DateFormat('dd/MM/yyyy').format(_tempAchievementDueDate!)
                          : 'Fecha',
                      style: TextStyle(
                        color: _tempAchievementDueDate != null
                            ? AppTheme.white
                            : AppTheme.white,
                        fontSize: 13,
                        fontWeight: _tempAchievementDueDate != null
                            ? FontWeight.w600
                            : FontWeight.normal,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [context.pro.indigo, context.pro.accent],
                ),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: context.pro.indigo.withOpacity(0.4),
                    blurRadius: 6,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                onPressed: () {
                  if (_tempAchievementNameController.text.trim().isNotEmpty) {
                    setState(() {
                      _tempProjectAchievements.add(ProjectAchievement(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        text: _tempAchievementNameController.text.trim(),
                        date: _tempAchievementDueDate,
                      ));
                      _tempAchievementNameController.clear();
                      _tempAchievementDueDateController.clear();
                      _tempAchievementDueDate = null;
                    });
                  }
                },
                icon: const Icon(Icons.add_rounded, color: AppTheme.white, size: 20),
                label: const Text(
                  'Agregar Logro',
                  style: TextStyle(
                    color: AppTheme.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAchievementCard(ProjectAchievement achievement) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurface.withOpacity(0.8),
            AppTheme.darkSurfaceVariant.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [context.pro.teal, context.pro.accent],
              ),
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: context.pro.teal.withOpacity(0.3),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const Icon(
              Icons.star_rounded,
              color: AppTheme.white,
              size: 18,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  achievement.text,
                  style: const TextStyle(
                    color: AppTheme.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.2,
                  ),
                ),
                if (achievement.date != null) ...[
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Icon(Icons.calendar_today_rounded, size: 14, color: AppTheme.white),
                      const SizedBox(width: 6),
                      Text(
                        DateFormat('dd MMM yyyy', 'es').format(achievement.date!),
                        style: TextStyle(
                          color: AppTheme.white,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: Colors.red.withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: Colors.red.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: IconButton(
              icon: const Icon(Icons.close_rounded, size: 18, color: Colors.red),
              padding: const EdgeInsets.all(8),
              constraints: const BoxConstraints(),
              onPressed: () {
                setState(() {
                  _tempProjectAchievements.removeWhere((a) => a.id == achievement.id);
                });
              },
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAddWorkForm() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurfaceVariant.withOpacity(0.4),
            AppTheme.darkSurface.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          TextField(
            controller: _tempWorkPositionController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Posición',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _tempWorkAppointController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Asignación',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _tempWorkStatusController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Estado',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          GestureDetector(
            onTap: () async {
              final date = await showDatePicker(
                context: context,
                initialDate: _tempWorkStartDate ?? DateTime.now(),
                firstDate: DateTime(2020),
                lastDate: DateTime(2030),
              );
              if (date != null) {
                setState(() => _tempWorkStartDate = date);
              }
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    context.pro.indigo.withOpacity(0.3),
                    context.pro.accent.withOpacity(0.2),
                  ],
                ),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: context.pro.indigo.withOpacity(0.4),
                  width: 1.5,
                ),
              ),
              child: Row(
                children: [
                  Icon(Icons.calendar_today_rounded, size: 16, color: context.pro.indigo),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _tempWorkStartDate != null
                          ? DateFormat('dd/MM/yyyy').format(_tempWorkStartDate!)
                          : 'Fecha de Inicio',
                      style: TextStyle(
                        color: _tempWorkStartDate != null
                            ? AppTheme.white
                            : AppTheme.white,
                        fontSize: 13,
                        fontWeight: _tempWorkStartDate != null
                            ? FontWeight.w600
                            : FontWeight.normal,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),
          GestureDetector(
            onTap: () async {
              final date = await showDatePicker(
                context: context,
                initialDate: _tempWorkDeadline ?? DateTime.now(),
                firstDate: DateTime(2020),
                lastDate: DateTime(2030),
              );
              if (date != null) {
                setState(() => _tempWorkDeadline = date);
              }
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    context.pro.indigo.withOpacity(0.3),
                    context.pro.accent.withOpacity(0.2),
                  ],
                ),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: context.pro.indigo.withOpacity(0.4),
                  width: 1.5,
                ),
              ),
              child: Row(
                children: [
                  Icon(Icons.event_rounded, size: 16, color: context.pro.indigo),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _tempWorkDeadline != null
                          ? DateFormat('dd/MM/yyyy').format(_tempWorkDeadline!)
                          : 'Fecha Límite',
                      style: TextStyle(
                        color: _tempWorkDeadline != null
                            ? AppTheme.white
                            : AppTheme.white,
                        fontSize: 13,
                        fontWeight: _tempWorkDeadline != null
                            ? FontWeight.w600
                            : FontWeight.normal,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _tempWorkNotesController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            maxLines: 3,
            decoration: InputDecoration(
              hintText: 'Notas (opcional)',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [context.pro.indigo, context.pro.accent],
                ),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: context.pro.indigo.withOpacity(0.4),
                    blurRadius: 6,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                onPressed: () {
                  if (_tempWorkPositionController.text.trim().isNotEmpty &&
                      _tempWorkAppointController.text.trim().isNotEmpty &&
                      _tempWorkStatusController.text.trim().isNotEmpty) {
                    setState(() {
                      _tempProjectWorks.add(ProjectWork(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        position: _tempWorkPositionController.text.trim(),
                        appoint: _tempWorkAppointController.text.trim(),
                        status: _tempWorkStatusController.text.trim(),
                        startDate: _tempWorkStartDate,
                        deadline: _tempWorkDeadline,
                        notes: _tempWorkNotesController.text.trim().isNotEmpty
                            ? _tempWorkNotesController.text.trim()
                            : null,
                      ));
                      _tempWorkPositionController.clear();
                      _tempWorkAppointController.clear();
                      _tempWorkStatusController.clear();
                      _tempWorkNotesController.clear();
                      _tempWorkStartDate = null;
                      _tempWorkDeadline = null;
                    });
                  }
                },
                icon: const Icon(Icons.add_rounded, color: AppTheme.white, size: 20),
                label: const Text(
                  'Agregar Actividad',
                  style: TextStyle(
                    color: AppTheme.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildWorkCard(ProjectWork work) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurface.withOpacity(0.8),
            AppTheme.darkSurfaceVariant.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [context.pro.teal, context.pro.accent],
                  ),
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: context.pro.teal.withOpacity(0.3),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.work_rounded,
                  color: AppTheme.white,
                  size: 18,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      work.position,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.2,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      work.appoint,
                      style: TextStyle(
                        color: AppTheme.white,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: Colors.red.withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: IconButton(
                  icon: const Icon(Icons.close_rounded, size: 18, color: Colors.red),
                  padding: const EdgeInsets.all(8),
                  constraints: const BoxConstraints(),
                  onPressed: () {
                    setState(() {
                      _tempProjectWorks.removeWhere((w) => w.id == work.id);
                    });
                  },
                ),
              ),
            ],
          ),
          if (work.status.isNotEmpty) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [context.pro.indigo.withOpacity(0.3), context.pro.accent.withOpacity(0.2)],
                ),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: context.pro.indigo.withOpacity(0.4),
                  width: 1,
                ),
              ),
              child: Text(
                'Estado: ${work.status}',
                style: const TextStyle(
                  color: AppTheme.white,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
          if (work.startDate != null || work.deadline != null) ...[
            const SizedBox(height: 12),
            Row(
              children: [
                if (work.startDate != null) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          context.pro.indigo.withOpacity(0.2),
                          context.pro.accent.withOpacity(0.15),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: context.pro.indigo.withOpacity(0.3),
                        width: 1,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.calendar_today_rounded, size: 14, color: context.pro.indigo),
                        const SizedBox(width: 6),
                        Text(
                          DateFormat('dd/MM/yyyy').format(work.startDate!),
                          style: const TextStyle(
                            color: AppTheme.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                if (work.startDate != null && work.deadline != null)
                  const SizedBox(width: 10),
                if (work.deadline != null) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          context.pro.indigo.withOpacity(0.2),
                          context.pro.accent.withOpacity(0.15),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: context.pro.indigo.withOpacity(0.3),
                        width: 1,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.event_rounded, size: 14, color: context.pro.indigo),
                        const SizedBox(width: 6),
                        Text(
                          DateFormat('dd/MM/yyyy').format(work.deadline!),
                          style: const TextStyle(
                            color: AppTheme.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ],
          if (work.notes != null && work.notes!.isNotEmpty) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    context.pro.indigo.withOpacity(0.15),
                    context.pro.accent.withOpacity(0.1),
                  ],
                ),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.note_rounded, size: 14, color: AppTheme.white),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      work.notes!,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontSize: 12,
                        fontStyle: FontStyle.italic,
                      ),
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
  
  Widget _buildAddFundingForm() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurfaceVariant.withOpacity(0.4),
            AppTheme.darkSurface.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          TextField(
            controller: _tempFundingElementController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              prefixIcon: Container(
                margin: const EdgeInsets.all(8),
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [context.pro.indigo.withOpacity(0.4), context.pro.accent.withOpacity(0.3)],
                  ),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: context.pro.indigo.withOpacity(0.5),
                    width: 1,
                  ),
                ),
                child: const Icon(
                  Icons.attach_money_rounded,
                  color: AppTheme.white,
                  size: 18,
                ),
              ),
              hintText: 'Elemento',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _tempFundingFondoController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Fondo a financiar',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _tempFundingFinanciadoPorController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Por quién',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _tempFundingNotesController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            maxLines: 3,
            decoration: InputDecoration(
              hintText: 'Notas (opcional)',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [context.pro.indigo, context.pro.accent],
                ),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: context.pro.indigo.withOpacity(0.4),
                    blurRadius: 6,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                onPressed: () {
                  if (_tempFundingElementController.text.trim().isNotEmpty) {
                    setState(() {
                      _tempProjectFunding.add(ProjectFunding(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        element: _tempFundingElementController.text.trim(),
                        fondo: _tempFundingFondoController.text.trim().isNotEmpty
                            ? _tempFundingFondoController.text.trim()
                            : null,
                        financiadoPor: _tempFundingFinanciadoPorController.text.trim().isNotEmpty
                            ? _tempFundingFinanciadoPorController.text.trim()
                            : null,
                        notes: _tempFundingNotesController.text.trim().isNotEmpty
                            ? _tempFundingNotesController.text.trim()
                            : null,
                      ));
                      _tempFundingElementController.clear();
                      _tempFundingFondoController.clear();
                      _tempFundingFinanciadoPorController.clear();
                      _tempFundingNotesController.clear();
                    });
                  }
                },
                icon: const Icon(Icons.add_rounded, color: AppTheme.white, size: 20),
                label: const Text(
                  'Agregar Financiamiento',
                  style: TextStyle(
                    color: AppTheme.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildFundingCard(ProjectFunding funding) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurface.withOpacity(0.8),
            AppTheme.darkSurfaceVariant.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [context.pro.teal, context.pro.accent],
              ),
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: context.pro.teal.withOpacity(0.3),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const Icon(
              Icons.attach_money_rounded,
              color: AppTheme.white,
              size: 18,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  funding.element,
                  style: const TextStyle(
                    color: AppTheme.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.2,
                  ),
                ),
                if (funding.fondo != null || funding.financiadoPor != null) ...[
                  const SizedBox(height: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (funding.fondo != null) ...[
                        Row(
                          children: [
                            Icon(Icons.account_balance_wallet_rounded, size: 14, color: AppTheme.white),
                            const SizedBox(width: 6),
                            Text(
                              'Fondo: ${funding.fondo}',
                              style: TextStyle(
                                color: AppTheme.white,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ],
                      if (funding.fondo != null && funding.financiadoPor != null)
                        const SizedBox(height: 6),
                      if (funding.financiadoPor != null) ...[
                        Row(
                          children: [
                            Icon(Icons.person_rounded, size: 14, color: AppTheme.white),
                            const SizedBox(width: 6),
                            Text(
                              'Por: ${funding.financiadoPor}',
                              style: TextStyle(
                                color: AppTheme.white,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),
                ],
                if (funding.projectedCost != null || funding.realCost != null) ...[
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      if (funding.projectedCost != null) ...[
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                context.pro.indigo.withOpacity(0.3),
                                context.pro.accent.withOpacity(0.2),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: context.pro.indigo.withOpacity(0.4),
                              width: 1,
                            ),
                          ),
                          child: Text(
                            'Proyectado: \$${funding.projectedCost!.toStringAsFixed(2)}',
                            style: const TextStyle(
                              color: AppTheme.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                      if (funding.projectedCost != null && funding.realCost != null)
                        const SizedBox(width: 10),
                      if (funding.realCost != null) ...[
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                context.pro.teal.withOpacity(0.3),
                                context.pro.accent.withOpacity(0.2),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: context.pro.teal.withOpacity(0.4),
                              width: 1,
                            ),
                          ),
                          child: Text(
                            'Real: \$${funding.realCost!.toStringAsFixed(2)}',
                            style: const TextStyle(
                              color: AppTheme.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
                if (funding.notes != null && funding.notes!.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          context.pro.indigo.withOpacity(0.15),
                          context.pro.accent.withOpacity(0.1),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: context.pro.indigo.withOpacity(0.3),
                        width: 1,
                      ),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(Icons.note_rounded, size: 14, color: AppTheme.white),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            funding.notes!,
                            style: const TextStyle(
                              color: AppTheme.white,
                              fontSize: 12,
                              fontStyle: FontStyle.italic,
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
          Container(
            decoration: BoxDecoration(
              color: Colors.red.withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: Colors.red.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: IconButton(
              icon: const Icon(Icons.close_rounded, size: 18, color: Colors.red),
              padding: const EdgeInsets.all(8),
              constraints: const BoxConstraints(),
              onPressed: () {
                setState(() {
                  _tempProjectFunding.removeWhere((f) => f.id == funding.id);
                });
              },
            ),
          ),
        ],
      ),
    );
  }


  Widget _buildStrategy(BuildContext context) {
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
    
    // Estadísticas de productividad para planificación
    final totalDailyTasks = _dailyTasks.values.expand((t) => t).length;
    final completedDailyTasks = _dailyTasks.values.expand((t) => t.where((dt) => dt.completed)).length;
    final totalMeetings = _workMeetings.length;
    final totalTasks = totalDailyTasks;
    final efficiency = totalTasks > 0 ? ((completedDailyTasks / totalTasks) * 100).round() : 0;
    
    // Resumen semanal - calcular tareas por día de la semana
    final now = DateTime.now();
    final weekStart = now.subtract(Duration(days: now.weekday - 1));
    final weekDays = List.generate(5, (index) => weekStart.add(Duration(days: index)));
    
    // Si hay un proyecto seleccionado, mostrar el formulario de estrategia
    if (_selectedStrategyProject != null) {
      return _buildProjectStrategyForm(_selectedStrategyProject!);
    }
    
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
                  Colors.blue.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.blue.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(
                    Icons.track_changes,
                    size: 32,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Estrategia y Planificación',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Vista general estratégica y análisis de productividad',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
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
                  context.pro.indigo.withOpacity(0.15),
                  context.pro.accent.withOpacity(0.1),
                  AppTheme.darkSurface,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: context.pro.indigo.withOpacity(0.3),
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
                              colors: [context.pro.indigo, context.pro.accent],
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
                                color: AppTheme.white,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Todas las metas',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppTheme.white,
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
                          colors: [context.pro.indigo, context.pro.accent],
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
                                context.pro.indigo,
                                context.pro.accent,
                                context.pro.teal,
                              ],
                            ),
                            borderRadius: BorderRadius.circular(6),
                            boxShadow: [
                              BoxShadow(
                                color: context.pro.indigo.withOpacity(0.6),
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
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '${totalProjects} proyecto${totalProjects == 1 ? '' : 's'}',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
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
                  color: context.pro.accent,
                  gradientColors: [context.pro.accent, context.pro.secondary],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle,
                  value: '$completedProjects',
                  label: 'Completados',
                  color: context.pro.teal,
                  gradientColors: [context.pro.teal, Colors.green],
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
          
          // Sección de Planificación (Análisis de Productividad)
          // Tarjeta de eficiencia mejorada
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  context.pro.teal.withOpacity(0.15),
                  context.pro.accent.withOpacity(0.1),
                  AppTheme.darkSurface,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: context.pro.teal.withOpacity(0.3),
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
                              colors: [context.pro.teal, context.pro.accent],
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.speed, color: AppTheme.white, size: 24),
                        ),
                        const SizedBox(width: 12),
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Eficiencia General',
                              style: TextStyle(
                                fontSize: 14,
                                color: AppTheme.white,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Tareas completadas',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppTheme.white,
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
                          colors: efficiency >= 70
                              ? [Colors.green, Colors.green.shade700]
                              : efficiency >= 50
                                  ? [context.pro.teal, context.pro.accent]
                                  : [Colors.orange, Colors.deepOrange],
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '$efficiency%',
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
                        widthFactor: efficiency / 100,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: efficiency >= 70
                                  ? [Colors.green, Colors.green.shade700]
                                  : efficiency >= 50
                                      ? [context.pro.teal, context.pro.accent]
                                      : [Colors.orange, Colors.deepOrange],
                            ),
                            borderRadius: BorderRadius.circular(6),
                            boxShadow: [
                              BoxShadow(
                                color: (efficiency >= 70
                                        ? Colors.green
                                        : efficiency >= 50
                                            ? context.pro.teal
                                            : Colors.orange)
                                    .withOpacity(0.6),
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
                      '$completedDailyTasks de $totalTasks tareas completadas',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '$totalMeetings sesiones',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Resumen de productividad mejorado
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.task_alt,
                  value: '$completedDailyTasks/$totalTasks',
                  label: 'Tareas',
                  color: context.pro.accent,
                  gradientColors: [context.pro.accent, context.pro.secondary],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.event,
                  value: '$totalMeetings',
                  label: 'Sesiones',
                  color: context.pro.teal,
                  gradientColors: [context.pro.teal, context.pro.accent],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.folder_special,
                  value: '$completedProjects/$totalProjects',
                  label: 'Proyectos',
                  color: context.pro.indigo,
                  gradientColors: [context.pro.indigo, context.pro.accent],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.flag,
                  value: '${_goals.length}',
                  label: 'Objetivos',
                  color: Colors.purple,
                  gradientColors: [Colors.purple, Colors.deepPurple],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Resumen Semanal mejorado
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  context.pro.primary.withOpacity(0.15),
                  context.pro.secondary.withOpacity(0.1),
                  AppTheme.darkSurface,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: context.pro.secondary.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [context.pro.primary, context.pro.secondary],
                        ),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.calendar_view_week, color: AppTheme.white, size: 20),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'Resumen Semanal',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                ...weekDays.asMap().entries.map((entry) {
                  final index = entry.key;
                  final date = entry.value;
                  final dayName = DateFormat('EEEE', 'es').format(date);
                  final isToday = date.year == now.year && 
                                  date.month == now.month && 
                                  date.day == now.day;
                  
                  // Calcular tareas para este día
                  final dateKey = DateTime(date.year, date.month, date.day);
                  final dayTasks = _dailyTasks[dateKey] ?? [];
                  final completedDayTasks = dayTasks.where((t) => t.completed).length;
                  final dayMeetings = _workMeetings.where((m) {
                    try {
                      final meetingDate = DateFormat('yyyy-MM-dd').parse(m.date);
                      return meetingDate.year == date.year &&
                             meetingDate.month == date.month &&
                             meetingDate.day == date.day;
                    } catch (e) {
                      return false;
                    }
                  }).length;
                  
                  // Calcular proyectos completados (proyectos donde todas las metas están completadas)
                  final completedProjects = _projects.where((p) {
                    if (p.goals.isEmpty) return false;
                    final completedGoals = p.goals.where((g) => g.completed == true).length;
                    return completedGoals == p.goals.length && p.goals.isNotEmpty;
                  }).length;
                  
                  // Calcular progreso de proyectos (basado en metas completadas)
                  final totalProjectGoals = _projects.fold(0, (sum, p) => sum + p.goals.length);
                  final completedProjectGoals = _projects.fold(0, (sum, p) => sum + p.goals.where((g) => g.completed == true).length);
                  final projectProgress = totalProjectGoals > 0 ? ((completedProjectGoals / totalProjectGoals) * 100).round() : 0;
                  
                  final totalDayItems = dayTasks.length + dayMeetings;
                  final completedDayItems = completedDayTasks;
                  final dayProgress = totalDayItems > 0 ? ((completedDayItems / totalDayItems) * 100).round() : 0;
                  
                  return Container(
                    margin: EdgeInsets.only(bottom: index < weekDays.length - 1 ? 16 : 0),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: isToday
                            ? [
                                context.pro.accent.withOpacity(0.2),
                                context.pro.secondary.withOpacity(0.15),
                                AppTheme.darkSurface,
                              ]
                            : [
                                AppTheme.darkSurfaceVariant.withOpacity(0.3),
                                AppTheme.darkSurface.withOpacity(0.5),
                              ],
                      ),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isToday
                            ? context.pro.accent.withOpacity(0.4)
                            : AppTheme.darkSurfaceVariant.withOpacity(0.2),
                        width: isToday ? 1.5 : 1,
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
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: isToday
                                          ? [context.pro.accent, context.pro.secondary]
                                          : [context.pro.slate, context.pro.indigo],
                                    ),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Icon(
                                    isToday ? Icons.today : Icons.calendar_today,
                                    color: AppTheme.white,
                                    size: 16,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Text(
                                          dayName.substring(0, 1).toUpperCase() + dayName.substring(1),
                                          style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.white,
                                          ),
                                        ),
                                        if (isToday) ...[
                                          const SizedBox(width: 8),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: context.pro.accent.withOpacity(0.3),
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: Text(
                                              'HOY',
                                              style: TextStyle(
                                                fontSize: 9,
                                                fontWeight: FontWeight.bold,
                                                color: context.pro.accent,
                                                letterSpacing: 0.5,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ],
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      DateFormat('d MMM', 'es').format(date),
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: AppTheme.white,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            Row(
                              children: [
                                if (completedProjects > 0) ...[
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [Colors.green, Colors.green.shade700],
                                      ),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.check_circle, size: 14, color: AppTheme.white),
                                        const SizedBox(width: 4),
                                        Text(
                                          '$completedProjects',
                                          style: const TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.white,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                ],
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: isToday
                                          ? [context.pro.accent, context.pro.secondary]
                                          : [context.pro.teal, context.pro.accent],
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    '$totalDayItems',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.white,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        if (totalDayItems > 0 || _projects.isNotEmpty) ...[
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              if (totalDayItems > 0) ...[
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            'Progreso Tareas',
                                            style: TextStyle(
                                              fontSize: 11,
                                              color: AppTheme.white,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                          Text(
                                            '$dayProgress%',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                              color: AppTheme.white,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      Container(
                                        height: 6,
                                        decoration: BoxDecoration(
                                          color: AppTheme.darkSurfaceVariant,
                                          borderRadius: BorderRadius.circular(3),
                                        ),
                                        child: FractionallySizedBox(
                                          alignment: Alignment.centerLeft,
                                          widthFactor: dayProgress / 100,
                                          child: Container(
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                colors: isToday
                                                    ? [context.pro.accent, context.pro.secondary]
                                                    : dayProgress >= 70
                                                        ? [Colors.green, Colors.green.shade700]
                                                        : [context.pro.teal, context.pro.accent],
                                              ),
                                              borderRadius: BorderRadius.circular(3),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                              if (_projects.isNotEmpty) ...[
                                if (totalDayItems > 0) const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            'Progreso Proyectos',
                                            style: TextStyle(
                                              fontSize: 11,
                                              color: AppTheme.white,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                          Text(
                                            '$projectProgress%',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                              color: AppTheme.white,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      Container(
                                        height: 6,
                                        decoration: BoxDecoration(
                                          color: AppTheme.darkSurfaceVariant,
                                          borderRadius: BorderRadius.circular(3),
                                        ),
                                        child: FractionallySizedBox(
                                          alignment: Alignment.centerLeft,
                                          widthFactor: projectProgress / 100,
                                          child: Container(
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                colors: projectProgress >= 100
                                                    ? [Colors.green, Colors.green.shade700]
                                                    : projectProgress >= 70
                                                        ? [context.pro.teal, context.pro.accent]
                                                        : [context.pro.indigo, context.pro.secondary],
                                              ),
                                              borderRadius: BorderRadius.circular(3),
                                            ),
                                          ),
                                        ),
                                      ),
                                      if (completedProjects > 0) ...[
                                        const SizedBox(height: 6),
                                        Row(
                                          children: [
                                            Icon(Icons.check_circle, size: 11, color: Colors.green),
                                            const SizedBox(width: 4),
                                            Expanded(
                                              child: Text(
                                                '$completedProjects/${_projects.length} completados',
                                                style: TextStyle(
                                                  fontSize: 9,
                                                  color: Colors.green,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                              ],
                            ],
                          ),
                          if (totalDayItems > 0) ...[
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                if (dayTasks.isNotEmpty) ...[
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: context.pro.accent.withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(Icons.task, size: 12, color: context.pro.accent),
                                          const SizedBox(width: 4),
                                          Text(
                                            '${dayTasks.length}',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                              color: context.pro.accent,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                ],
                                if (dayMeetings > 0) ...[
                                    if (dayTasks.isNotEmpty) const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: context.pro.teal.withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(Icons.event, size: 12, color: context.pro.teal),
                                          const SizedBox(width: 4),
                                          Text(
                                            '$dayMeetings',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                              color: context.pro.teal,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ],
                          ],
                        ],
                      ),
                  );
                }).toList(),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Mostrar formulario de estrategia si hay un proyecto seleccionado
          if (_selectedStrategyProject != null)
            _buildProjectStrategyForm(_selectedStrategyProject!),
        ],
      ),
    );
  }

  Widget _buildProjectStrategyForm(WorkProject project) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Botón para volver
          Row(
            children: [
              TextButton.icon(
                onPressed: () {
                  setState(() {
                    _selectedStrategyProject = null;
                  });
                },
                icon: Icon(Icons.arrow_back, color: context.pro.accent),
                label: Text(
                  'Volver',
                  style: TextStyle(color: context.pro.accent),
                ),
              ),
              const Spacer(),
              Text(
                project.title,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          // PROJECT STRATEGY Section
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  context.pro.primary.withOpacity(0.2),
                  context.pro.secondary.withOpacity(0.15),
                  AppTheme.darkSurface,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: context.pro.primary.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [context.pro.primary, context.pro.secondary],
                        ),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.track_changes, color: AppTheme.white, size: 20),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'PROJECT STRATEGY',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                
                // PROJECT TITLE
                _buildFormField('PROJECT TITLE:', project.title),
                const SizedBox(height: 16),
                
                // PROJECT AIM
                _buildFormField('PROJECT AIM:', project.aim, subtitle: 'Brief introduction of the project'),
                const SizedBox(height: 16),
                
                // START DATE
                Row(
                  children: [
                    Expanded(
                      child: _buildFormField(
                        'START DATE:',
                        project.startDate != null
                            ? DateFormat('dd/MM/yyyy').format(project.startDate!)
                            : 'No definida',
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildFormField(
                        'DEADLINE:',
                        project.deadline != null
                            ? DateFormat('dd/MM/yyyy').format(project.deadline!)
                            : 'No definida',
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                
                // Tabla de Compañeros de Equipo
                _buildTableHeader('COMPAÑEROS DE EQUIPO'),
                const SizedBox(height: 12),
                _buildTeammatesTable(project.teammates),
                const SizedBox(height: 24),
                
                // Tabla de Logros
                _buildTableHeader('LOGROS'),
                const SizedBox(height: 12),
                _buildAchievementsTable(project.achievements),
                const SizedBox(height: 24),
                
                // Tabla de Trabajos
                _buildTableHeader('TRABAJOS'),
                const SizedBox(height: 12),
                _buildWorksTable(project.works),
                const SizedBox(height: 24),
                
                // Tabla de Financiamiento
                _buildTableHeader('FINANCIAMIENTO'),
                const SizedBox(height: 12),
                _buildFundingTable(project.funding),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // PROJECT OVERVIEW Section
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  context.pro.teal.withOpacity(0.2),
                  context.pro.accent.withOpacity(0.15),
                  AppTheme.darkSurface,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: context.pro.teal.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [context.pro.teal, context.pro.accent],
                        ),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.description, color: AppTheme.white, size: 20),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'PROJECT OVERVIEW',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                
                // BUSINESS NAME and DATE
                Row(
                  children: [
                    Expanded(
                      child: _buildFormField(
                        'BUSINESS NAME:',
                        project.overview?.businessName ?? '',
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildFormField(
                        'DATE:',
                        project.overview?.date != null
                            ? DateFormat('dd/MM/yyyy').format(project.overview!.date!)
                            : DateFormat('dd/MM/yyyy').format(DateTime.now()),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                
                // CUSTOMER COMPANY, UNDERTAKING, PRESUMPTION
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.orange.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'CUSTOMER COMPANY',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          _buildFormField('Name:', project.overview?.customerCompany?.name ?? ''),
                          const SizedBox(height: 8),
                          _buildFormField('Phone:', project.overview?.customerCompany?.phone ?? ''),
                          const SizedBox(height: 8),
                          _buildFormField('Email:', project.overview?.customerCompany?.email ?? ''),
                          const SizedBox(height: 8),
                          _buildFormField('Address:', project.overview?.customerCompany?.address ?? ''),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.orange.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'UNDERTAKING',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          _buildFormField('Name:', project.overview?.undertaking?.name ?? ''),
                          const SizedBox(height: 8),
                          _buildFormField('Customer:', project.overview?.undertaking?.customer ?? ''),
                          const SizedBox(height: 8),
                          _buildFormField('Label:', project.overview?.undertaking?.label ?? ''),
                          const SizedBox(height: 8),
                          _buildFormField('Notes:', project.overview?.undertaking?.notes ?? ''),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.lightBlue.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'PRESUMPTION',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          // Primer text area de PRESUMPTION
                          Container(
                            height: 100,
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.lightBlue.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: Colors.lightBlue.withOpacity(0.4),
                                width: 1,
                              ),
                            ),
                            child: SingleChildScrollView(
                              child: Text(
                                project.overview?.presumption ?? '',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.white,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          // Segundo text area de PRESUMPTION
                          Container(
                            height: 100,
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.lightBlue.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: Colors.lightBlue.withOpacity(0.4),
                                width: 1,
                              ),
                            ),
                            child: SingleChildScrollView(
                              child: Text(
                                '', // Segundo text area vacío por ahora
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.white,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                
                // JOB DESCRIPTION and PROJECT TARGETS
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.lightBlue.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'JOB DESCRIPTION',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            height: 150,
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.lightBlue.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: Colors.lightBlue.withOpacity(0.4),
                                width: 1,
                              ),
                            ),
                            child: SingleChildScrollView(
                              child: Text(
                                project.overview?.jobDescription ?? '',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.white,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.lightBlue.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'PROJECT OUTPUTS',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          if (project.overview?.projectOutputs.isEmpty ?? true)
                            // Mostrar 3 líneas vacías con checkboxes y campos de entrada
                            ...List.generate(3, (index) {
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 8),
                                child: Row(
                                  children: [
                                    Checkbox(
                                      value: false,
                                      onChanged: null,
                                      fillColor: MaterialStateProperty.all(
                                        AppTheme.darkSurfaceVariant,
                                      ),
                                    ),
                                    Expanded(
                                      child: Container(
                                        height: 32,
                                        padding: const EdgeInsets.symmetric(horizontal: 8),
                                        decoration: BoxDecoration(
                                          color: AppTheme.darkSurfaceVariant.withOpacity(0.5),
                                          borderRadius: BorderRadius.circular(4),
                                          border: Border.all(
                                            color: Colors.lightBlue.withOpacity(0.3),
                                            width: 1,
                                          ),
                                        ),
                                        child: Align(
                                          alignment: Alignment.centerLeft,
                                          child: Text(
                                            '',
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: AppTheme.white,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            })
                          else
                            ...project.overview!.projectOutputs.map((output) {
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 8),
                                child: Row(
                                  children: [
                                    Checkbox(
                                      value: output.completed,
                                      onChanged: null,
                                      fillColor: MaterialStateProperty.all(
                                        output.completed ? Colors.lightBlue : AppTheme.darkSurfaceVariant,
                                      ),
                                    ),
                                    Expanded(
                                      child: Container(
                                        height: 32,
                                        padding: const EdgeInsets.symmetric(horizontal: 8),
                                        decoration: BoxDecoration(
                                          color: AppTheme.darkSurfaceVariant.withOpacity(0.5),
                                          borderRadius: BorderRadius.circular(4),
                                          border: Border.all(
                                            color: Colors.lightBlue.withOpacity(0.3),
                                            width: 1,
                                          ),
                                        ),
                                        child: Align(
                                          alignment: Alignment.centerLeft,
                                          child: Text(
                                            output.text,
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: output.completed ? AppTheme.white : AppTheme.white,
                                              decoration: output.completed ? TextDecoration.lineThrough : null,
                                            ),
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
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.orange.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'PROJECT TARGETS',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.orange.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: Colors.orange.withOpacity(0.3),
                                width: 1,
                              ),
                            ),
                            child: Column(
                              children: project.overview?.projectTargets.isEmpty ?? true
                                  ? List.generate(5, (index) {
                                      return Padding(
                                        padding: const EdgeInsets.only(bottom: 8),
                                        child: Container(
                                          height: 24,
                                          decoration: BoxDecoration(
                                            border: Border(
                                              bottom: BorderSide(
                                                color: AppTheme.white.withOpacity(0.3),
                                                width: 1,
                                              ),
                                            ),
                                          ),
                                        ),
                                      );
                                    })
                                  : project.overview!.projectTargets.map((target) {
                                      return Padding(
                                        padding: const EdgeInsets.only(bottom: 8),
                                        child: Container(
                                          height: 24,
                                          decoration: BoxDecoration(
                                            border: Border(
                                              bottom: BorderSide(
                                                color: AppTheme.white.withOpacity(0.3),
                                                width: 1,
                                              ),
                                            ),
                                          ),
                                          child: Align(
                                            alignment: Alignment.centerLeft,
                                            child: Text(
                                              target.text,
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: AppTheme.white,
                                              ),
                                            ),
                                          ),
                                        ),
                                      );
                                    }).toList(),
                            ),
                          ),
                          const SizedBox(height: 16),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.orange.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'ACHIEVEMENTS',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            height: 150,
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.orange.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: Colors.orange.withOpacity(0.3),
                                width: 1,
                              ),
                            ),
                            child: SingleChildScrollView(
                              child: Text(
                                project.overview?.achievements ?? '',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.white,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFormField(String label, String value, {String? subtitle}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: AppTheme.white,
          ),
        ),
        if (subtitle != null) ...[
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 10,
              color: AppTheme.white,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
        const SizedBox(height: 4),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppTheme.darkSurfaceVariant.withOpacity(0.5),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: context.pro.secondary.withOpacity(0.3),
              width: 1,
            ),
          ),
          child: Text(
            value.isEmpty ? 'Sin definir' : value,
            style: TextStyle(
              fontSize: 14,
              color: value.isEmpty ? AppTheme.white : AppTheme.white,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTableHeader(String title) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [context.pro.primary, context.pro.secondary],
        ),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: AppTheme.white,
        ),
      ),
    );
  }

  Widget _buildTeammatesTable(List<ProjectTeammate> teammates) {
    if (teammates.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Center(
          child: Text(
            'Sin compañeros de equipo',
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.white,
              fontStyle: FontStyle.italic,
            ),
          ),
        ),
      );
    }
    
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: context.pro.secondary.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Table(
        border: TableBorder(
          horizontalInside: BorderSide(
            color: AppTheme.darkSurfaceVariant.withOpacity(0.5),
            width: 1,
          ),
        ),
        children: [
          TableRow(
            decoration: BoxDecoration(
              color: context.pro.primary.withOpacity(0.2),
            ),
            children: [
              _buildTableCell('STT', isHeader: true),
              _buildTableCell('POSITION', isHeader: true),
              _buildTableCell('NAME', isHeader: true),
            ],
          ),
          ...teammates.asMap().entries.map((entry) {
            final index = entry.key;
            final teammate = entry.value;
            return TableRow(
              children: [
                _buildTableCell('${index + 1}'),
                _buildTableCell(teammate.role),
                _buildTableCell(teammate.name),
              ],
            );
          }),
        ],
      ),
    );
  }

  Widget _buildAchievementsTable(List<ProjectAchievement> achievements) {
    if (achievements.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Center(
          child: Text(
            'Sin logros definidos',
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.white,
              fontStyle: FontStyle.italic,
            ),
          ),
        ),
      );
    }
    
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: context.pro.secondary.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Table(
        border: TableBorder(
          horizontalInside: BorderSide(
            color: AppTheme.darkSurfaceVariant.withOpacity(0.5),
            width: 1,
          ),
        ),
        children: [
          TableRow(
            decoration: BoxDecoration(
              color: context.pro.primary.withOpacity(0.2),
            ),
            children: [
              _buildTableCell('STT', isHeader: true),
              _buildTableCell('ACHIEVEMENT NAME', isHeader: true),
              _buildTableCell('DUE DATE', isHeader: true),
            ],
          ),
          ...achievements.asMap().entries.map((entry) {
            final index = entry.key;
            final achievement = entry.value;
            return TableRow(
              children: [
                _buildTableCell('${index + 1}'),
                _buildTableCell(achievement.text),
                _buildTableCell(
                  achievement.date != null
                      ? DateFormat('dd/MM/yyyy').format(achievement.date!)
                      : 'Sin fecha',
                ),
              ],
            );
          }),
        ],
      ),
    );
  }

  Widget _buildWorksTable(List<ProjectWork> works) {
    if (works.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Center(
          child: Text(
            'Sin trabajos definidos',
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.white,
              fontStyle: FontStyle.italic,
            ),
          ),
        ),
      );
    }
    
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: context.pro.secondary.withOpacity(0.2),
            width: 1,
          ),
        ),
        child: Table(
          border: TableBorder(
            horizontalInside: BorderSide(
              color: AppTheme.darkSurfaceVariant.withOpacity(0.5),
              width: 1,
            ),
          ),
          columnWidths: const {
            0: FlexColumnWidth(1.5),
            1: FlexColumnWidth(1.5),
            2: FlexColumnWidth(1),
            3: FlexColumnWidth(1.2),
            4: FlexColumnWidth(1.2),
            5: FlexColumnWidth(2),
          },
          children: [
            TableRow(
              decoration: BoxDecoration(
                color: context.pro.primary.withOpacity(0.2),
              ),
              children: [
                _buildTableCell('POSITION', isHeader: true),
                _buildTableCell('APPOINT', isHeader: true),
                _buildTableCell('STATUS', isHeader: true),
                _buildTableCell('START DATE', isHeader: true),
                _buildTableCell('DEADLINE', isHeader: true),
                _buildTableCell('NOTES', isHeader: true),
              ],
            ),
            ...works.map((work) {
              return TableRow(
                children: [
                  _buildTableCell(work.position),
                  _buildTableCell(work.appoint),
                  _buildTableCell(work.status),
                  _buildTableCell(
                    work.startDate != null
                        ? DateFormat('dd/MM/yyyy').format(work.startDate!)
                        : 'Sin fecha',
                  ),
                  _buildTableCell(
                    work.deadline != null
                        ? DateFormat('dd/MM/yyyy').format(work.deadline!)
                        : 'Sin fecha',
                  ),
                  _buildTableCell(work.notes ?? ''),
                ],
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildFundingTable(List<ProjectFunding> funding) {
    if (funding.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Center(
          child: Text(
            'Sin financiamiento definido',
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.white,
              fontStyle: FontStyle.italic,
            ),
          ),
        ),
      );
    }
    
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: context.pro.secondary.withOpacity(0.2),
            width: 1,
          ),
        ),
        child: Table(
          border: TableBorder(
            horizontalInside: BorderSide(
              color: AppTheme.darkSurfaceVariant.withOpacity(0.5),
              width: 1,
            ),
          ),
          columnWidths: const {
            0: FlexColumnWidth(2),
            1: FlexColumnWidth(1.5),
            2: FlexColumnWidth(1.5),
            3: FlexColumnWidth(2),
          },
          children: [
            TableRow(
              decoration: BoxDecoration(
                color: context.pro.primary.withOpacity(0.2),
              ),
              children: [
                _buildTableCell('ELEMENT', isHeader: true),
                _buildTableCell('PROJECTED COST', isHeader: true),
                _buildTableCell('REAL COST', isHeader: true),
                _buildTableCell('NOTES', isHeader: true),
              ],
            ),
            ...funding.map((fund) {
              return TableRow(
                children: [
                  _buildTableCell(fund.element),
                  _buildTableCell(
                    fund.projectedCost != null
                        ? '\$${fund.projectedCost!.toStringAsFixed(2)}'
                        : 'Sin definir',
                  ),
                  _buildTableCell(
                    fund.realCost != null
                        ? '\$${fund.realCost!.toStringAsFixed(2)}'
                        : 'Sin definir',
                  ),
                  _buildTableCell(fund.notes ?? ''),
                ],
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildTableCell(String text, {bool isHeader = false}) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Text(
        text,
        style: TextStyle(
          fontSize: isHeader ? 11 : 10,
          fontWeight: isHeader ? FontWeight.bold : FontWeight.normal,
          color: isHeader ? AppTheme.white : AppTheme.white,
        ),
      ),
    );
  }

  Widget _buildPrioritiesFocusGoals(BuildContext context) {
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
                Colors.blue.withOpacity(0.2),
                AppTheme.darkSurface,
                AppTheme.darkSurfaceVariant,
              ],
            ),
            borderRadius: BorderRadius.circular(24),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Icon(
                  Icons.dashboard,
                  size: 32,
                  color: AppTheme.white,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Gestión de prioridades',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Gestiona tus prioridades, áreas de enfoque y objetivos',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.white,
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
                  colors: [context.pro.primary, context.pro.secondary],
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
              color: isActive ? AppTheme.white : AppTheme.white,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                color: isActive ? AppTheme.white : AppTheme.white,
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
      context.pro.indigo,
      context.pro.teal,
      context.pro.secondary,
      context.pro.accent,
      context.pro.slate,
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Formulario para agregar prioridad
        if (_priorities.length < 5)
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  context.pro.primary.withOpacity(0.2),
                  context.pro.secondary.withOpacity(0.15),
                  AppTheme.darkSurface.withOpacity(0.8),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: context.pro.accent.withOpacity(0.3),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: context.pro.accent.withOpacity(0.15),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _priorityController,
                    style: const TextStyle(
                      color: AppTheme.white,
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                    ),
                    decoration: InputDecoration(
                      hintText: 'Escribe una nueva prioridad...',
                      hintStyle: TextStyle(
                        color: AppTheme.white,
                        fontSize: 15,
                      ),
                      filled: true,
                      fillColor: AppTheme.darkBackground.withOpacity(0.5),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: context.pro.accent.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: context.pro.accent.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: context.pro.accent,
                          width: 2,
                        ),
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    ),
                    onSubmitted: (_) => _addPriority(),
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [context.pro.accent, context.pro.secondary],
                    ),
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                        color: context.pro.accent.withOpacity(0.4),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: ElevatedButton(
                    onPressed: _addPriority,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      foregroundColor: AppTheme.white,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                      padding: const EdgeInsets.all(14),
                    ),
                    child: const Icon(Icons.add_rounded, size: 24),
                  ),
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
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.indigo.withOpacity(0.2),
                  Colors.purple.withOpacity(0.15),
                  AppTheme.darkSurface.withOpacity(0.8),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.indigo.withOpacity(0.3),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.indigo.withOpacity(0.15),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _focusController,
                    style: const TextStyle(
                      color: AppTheme.white,
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                    ),
                    decoration: InputDecoration(
                      hintText: 'Escribe un nuevo enfoque...',
                      hintStyle: TextStyle(
                        color: AppTheme.white,
                        fontSize: 15,
                      ),
                      filled: true,
                      fillColor: AppTheme.darkBackground.withOpacity(0.5),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: Colors.indigo.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: Colors.indigo.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: Colors.indigo,
                          width: 2,
                        ),
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    ),
                    onSubmitted: (_) => _addFocus(),
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.indigo, Colors.purple],
                    ),
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.indigo.withOpacity(0.4),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: ElevatedButton(
                    onPressed: _addFocus,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      foregroundColor: AppTheme.white,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                      padding: const EdgeInsets.all(14),
                    ),
                    child: const Icon(Icons.add_rounded, size: 24),
                  ),
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
    final goalsColors = [const Color(0xFF6366F1), Colors.teal, Colors.amber, Colors.red, Colors.grey];
    // Calcular progreso basado en metas completadas
    final totalMilestones = _goals.fold<int>(0, (sum, goal) {
      final milestones = goal['milestones'] as List<dynamic>? ?? [];
      return sum + milestones.length;
    });
    final completedMilestones = _goals.fold<int>(0, (sum, goal) {
      final milestones = goal['milestones'] as List<dynamic>? ?? [];
      return sum + milestones.where((m) => m['completed'] == true).length;
    });
    final progressPercentage = totalMilestones > 0 
        ? ((completedMilestones / totalMilestones) * 100).round() 
        : 0;
    final completedGoals = _goals.where((g) {
      final milestones = g['milestones'] as List<dynamic>? ?? [];
      if (milestones.isEmpty) return false;
      return milestones.every((m) => m['completed'] == true);
    }).length;
    final totalGoals = _goals.length;

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
                label: 'Objetivos',
                color: context.pro.teal,
                gradientColors: [context.pro.teal, context.pro.accent],
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildSummaryCard(
                icon: Icons.trending_up,
                value: '$progressPercentage%',
                label: 'Progreso',
                subtitle: '$completedMilestones/$totalMilestones metas',
                color: context.pro.accent,
                gradientColors: [context.pro.accent, context.pro.secondary],
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        
          // Formulario para agregar objetivo
          if (_goals.length < 5)
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    context.pro.teal.withOpacity(0.2),
                    context.pro.accent.withOpacity(0.15),
                    AppTheme.darkSurface.withOpacity(0.8),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: context.pro.teal.withOpacity(0.3),
                  width: 1.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: context.pro.teal.withOpacity(0.15),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _goalController,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                      ),
                      decoration: InputDecoration(
                        hintText: 'Escribe un nuevo objetivo...',
                        hintStyle: TextStyle(
                          color: AppTheme.white,
                          fontSize: 15,
                        ),
                        filled: true,
                        fillColor: AppTheme.darkBackground.withOpacity(0.5),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(
                            color: context.pro.teal.withOpacity(0.3),
                            width: 1,
                          ),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(
                            color: context.pro.teal.withOpacity(0.3),
                            width: 1,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(
                            color: context.pro.teal,
                            width: 2,
                          ),
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      ),
                      onSubmitted: (_) => _addGoal(),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [context.pro.teal, context.pro.accent],
                      ),
                      borderRadius: BorderRadius.circular(14),
                      boxShadow: [
                        BoxShadow(
                          color: context.pro.teal.withOpacity(0.4),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: ElevatedButton(
                      onPressed: _addGoal,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        foregroundColor: AppTheme.white,
                        shadowColor: Colors.transparent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                        padding: const EdgeInsets.all(14),
                      ),
                      child: const Icon(Icons.add_rounded, size: 24),
                    ),
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
                  Colors.blue.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.blue.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(
                    Icons.center_focus_strong,
                    size: 32,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Enfoque',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Define tus áreas de enfoque y concentración',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
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
                        hintStyle: const TextStyle(color: AppTheme.white),
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
                      backgroundColor: context.pro.accent,
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
    final goalsColors = [const Color(0xFF6366F1), Colors.teal, Colors.amber, Colors.red, Colors.grey];
    // Calcular progreso basado en metas completadas
    final totalMilestones = _goals.fold<int>(0, (sum, goal) {
      final milestones = goal['milestones'] as List<dynamic>? ?? [];
      return sum + milestones.length;
    });
    final completedMilestones = _goals.fold<int>(0, (sum, goal) {
      final milestones = goal['milestones'] as List<dynamic>? ?? [];
      return sum + milestones.where((m) => m['completed'] == true).length;
    });
    final progressPercentage = totalMilestones > 0 
        ? ((completedMilestones / totalMilestones) * 100).round() 
        : 0;
    final completedGoals = _goals.where((g) {
      final milestones = g['milestones'] as List<dynamic>? ?? [];
      if (milestones.isEmpty) return false;
      return milestones.every((m) => m['completed'] == true);
    }).length;
    final totalGoals = _goals.length;
    
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
                  Colors.blue.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.blue.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(
                    Icons.flag,
                    size: 32,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Objetivos',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Define y gestiona tus objetivos de trabajo',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
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
                  label: 'Objetivos',
                  color: context.pro.teal,
                  gradientColors: [context.pro.teal, context.pro.accent],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.trending_up,
                  value: '$progressPercentage%',
                  label: 'Progreso',
                  subtitle: '$completedMilestones/$totalMilestones metas',
                  color: context.pro.accent,
                  gradientColors: [context.pro.accent, context.pro.secondary],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          // Formulario para agregar objetivo
          if (_goals.length < 5)
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    context.pro.teal.withOpacity(0.2),
                    context.pro.accent.withOpacity(0.15),
                    AppTheme.darkSurface.withOpacity(0.8),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: context.pro.teal.withOpacity(0.3),
                  width: 1.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: context.pro.teal.withOpacity(0.15),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _goalController,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                      ),
                      decoration: InputDecoration(
                        hintText: 'Escribe un nuevo objetivo...',
                        hintStyle: TextStyle(
                          color: AppTheme.white,
                          fontSize: 15,
                        ),
                        filled: true,
                        fillColor: AppTheme.darkBackground.withOpacity(0.5),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(
                            color: context.pro.teal.withOpacity(0.3),
                            width: 1,
                          ),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(
                            color: context.pro.teal.withOpacity(0.3),
                            width: 1,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide(
                            color: context.pro.teal,
                            width: 2,
                          ),
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      ),
                      onSubmitted: (_) => _addGoal(),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [context.pro.teal, context.pro.accent],
                      ),
                      borderRadius: BorderRadius.circular(14),
                      boxShadow: [
                        BoxShadow(
                          color: context.pro.teal.withOpacity(0.4),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: ElevatedButton(
                      onPressed: _addGoal,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        foregroundColor: AppTheme.white,
                        shadowColor: Colors.transparent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                        padding: const EdgeInsets.all(14),
                      ),
                      child: const Icon(Icons.add_rounded, size: 24),
                    ),
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
      final goalId = DateTime.now().millisecondsSinceEpoch.toString();
      _goals.add({
        'id': goalId,
        'text': _goalController.text.trim(),
        'completed': false,
        'milestones': <Map<String, dynamic>>[],
      });
      _goalMilestoneControllers[goalId] = TextEditingController();
      _goalController.clear();
    });
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
    final colors = gradientColors ?? [buttonColor ?? context.pro.accent, buttonColor ?? context.pro.accent];
    
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
                          context.pro.accent.withOpacity(0.2),
                          context.pro.secondary.withOpacity(0.1),
                        ],
                      )
                    : isUpcoming
                        ? LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              context.pro.teal.withOpacity(0.1),
                              context.pro.teal.withOpacity(0.05),
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
                      ? context.pro.accent.withOpacity(0.4)
                      : context.pro.secondary.withOpacity(0.2),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: (task.completed
                    ? Colors.green
                    : isOverdue
                        ? Colors.red
                        : context.pro.secondary)
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
                                : context.pro.accent,
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
                                    ? AppTheme.white
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
                                  _getPriorityColor(task.priority, context).withOpacity(0.3),
                                  _getPriorityColor(task.priority, context).withOpacity(0.15),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: _getPriorityColor(task.priority, context).withOpacity(0.5),
                                width: 1,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  _getPriorityIcon(task.priority),
                                  size: 14,
                                  color: _getPriorityColor(task.priority, context),
                                ),
                                const SizedBox(width: 5),
                                Text(
                                  _getPriorityLabel(task.priority),
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: _getPriorityColor(task.priority, context),
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
                                        context.pro.accent.withOpacity(0.3),
                                        context.pro.secondary.withOpacity(0.2),
                                      ],
                                    )
                                  : LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        context.pro.secondary.withOpacity(0.2),
                                        context.pro.accent.withOpacity(0.15),
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
                                  color: isToday ? context.pro.accent : AppTheme.white,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  isToday
                                      ? 'Hoy'
                                      : '${task.date.day}/${task.date.month}/${task.date.year}',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: isToday ? context.pro.accent : AppTheme.white,
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
                                color: context.pro.accent.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                '⚠ Hoy',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: context.pro.accent,
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
                        ? context.pro.accent
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
                          ? context.pro.accent
                          : AppTheme.white,
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
                            style: TextStyle(color: AppTheme.white),
                          ),
                          actions: [
                            OutlinedButton(
                              onPressed: () => Navigator.pop(context),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppTheme.white,
                                side: BorderSide(color: AppTheme.white.withOpacity(0.3)),
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
                      context.pro.accent.withOpacity(0.15),
                      context.pro.accent.withOpacity(0.05),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: context.pro.accent.withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      Icons.note,
                      size: 18,
                      color: context.pro.accent,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        task.notes!,
                        style: TextStyle(
                          fontSize: 13,
                          color: AppTheme.white,
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
                  context.pro.primary.withOpacity(0.3),
                  context.pro.secondary.withOpacity(0.2),
                ]
              : [
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant.withOpacity(0.5),
                ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isToday
              ? context.pro.accent.withOpacity(0.5)
              : context.pro.secondary.withOpacity(0.2),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: isToday
                ? context.pro.primary.withOpacity(0.2)
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
                        context.pro.accent.withOpacity(0.3),
                        context.pro.secondary.withOpacity(0.2),
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
                          ? [context.pro.primary, context.pro.secondary]
                          : [context.pro.slate, context.pro.indigo],
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
                                color: context.pro.accent.withOpacity(0.3),
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
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: context.pro.teal.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '$totalCount',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: context.pro.teal,
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
    final professionalColor1 = index % 3 == 0 ? context.pro.primary : (index % 3 == 1 ? context.pro.secondary : context.pro.accent);
    final professionalColor2 = index % 3 == 1 ? context.pro.accent : (index % 3 == 2 ? context.pro.teal : context.pro.secondary);
    final professionalColor3 = index % 3 == 2 ? context.pro.teal : (index % 3 == 0 ? context.pro.indigo : context.pro.accent);
    
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
                                color: task.completed ? AppTheme.white : AppTheme.white,
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
                                      color: _getPriorityColor(task.priority!, context),
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
                        icon: const Icon(Icons.more_vert, color: AppTheme.white, size: 20),
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
                                  style: const TextStyle(color: AppTheme.white),
                                ),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(context, false),
                                    child: const Text(
                                      'Cancelar',
                                      style: TextStyle(color: AppTheme.white),
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
                                color: AppTheme.white,
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
                                      color: AppTheme.white,
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
    final professionalColor1 = index % 3 == 0 ? context.pro.primary : (index % 3 == 1 ? context.pro.secondary : context.pro.accent);
    final professionalColor2 = index % 3 == 1 ? context.pro.accent : (index % 3 == 2 ? context.pro.teal : context.pro.secondary);
    final professionalColor3 = index % 3 == 2 ? context.pro.teal : (index % 3 == 0 ? context.pro.indigo : context.pro.accent);
    
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
                                ],
                                if (isOverdue) ...[
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
                                  color: AppTheme.white,
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
                        icon: const Icon(Icons.more_vert, color: AppTheme.white, size: 22),
                        color: AppTheme.darkSurface,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        onSelected: (value) {
                          if (value == 'edit') {
                            _editProject(project);
                          } else if (value == 'delete') {
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
                                  style: const TextStyle(color: AppTheme.white),
                                ),
                                actions: [
                                  OutlinedButton(
                                    onPressed: () => Navigator.pop(context, false),
                                    style: OutlinedButton.styleFrom(
                                      foregroundColor: AppTheme.white,
                                      side: BorderSide(color: AppTheme.white.withOpacity(0.3)),
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
                            value: 'edit',
                            child: Row(
                              children: [
                                Icon(Icons.edit, size: 18, color: AppTheme.white),
                                SizedBox(width: 8),
                                Text('Editar', style: TextStyle(color: AppTheme.white)),
                              ],
                            ),
                          ),
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
                                        color: AppTheme.white,
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
                                      color: AppTheme.white,
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
                                            color: AppTheme.white,
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
                        // Lista de metas individuales
                        if (project.goals.isNotEmpty) ...[
                          const SizedBox(height: 20),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: AppTheme.darkBackground.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: professionalColor1.withOpacity(0.3),
                                width: 1,
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Icon(
                                      Icons.flag_rounded,
                                      size: 16,
                                      color: professionalColor3,
                                    ),
                                    const SizedBox(width: 8),
                                    const Text(
                                      'Metas del Proyecto',
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w600,
                                        color: AppTheme.white,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                ...project.goals.asMap().entries.map((entry) {
                                  final goal = entry.value;
                                  return Container(
                                    margin: const EdgeInsets.only(bottom: 8),
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: goal.completed
                                          ? Colors.green.withOpacity(0.1)
                                          : AppTheme.darkSurface.withOpacity(0.5),
                                      borderRadius: BorderRadius.circular(10),
                                      border: Border.all(
                                        color: goal.completed
                                            ? Colors.green.withOpacity(0.3)
                                            : professionalColor1.withOpacity(0.2),
                                        width: 1,
                                      ),
                                    ),
                                    child: Row(
                                      children: [
                                        Checkbox(
                                          value: goal.completed,
                                          onChanged: (value) {
                                            setState(() {
                                              final projectIndex = _projects.indexWhere((p) => p.id == project.id);
                                              if (projectIndex != -1) {
                                                final updatedGoals = project.goals.map((g) {
                                                  if (g.id == goal.id) {
                                                    return ProjectGoal(
                                                      id: g.id,
                                                      text: g.text,
                                                      date: g.date,
                                                      person: g.person,
                                                      position: g.position,
                                                      completed: value ?? false,
                                                    );
                                                  }
                                                  return g;
                                                }).toList();
                                                
                                                _projects[projectIndex] = WorkProject(
                                                  id: project.id,
                                                  title: project.title,
                                                  aim: project.aim,
                                                  startDate: project.startDate,
                                                  deadline: project.deadline,
                                                  teammates: project.teammates,
                                                  achievements: project.achievements,
                                                  works: project.works,
                                                  funding: project.funding,
                                                  goals: updatedGoals,
                                                  overview: project.overview,
                                                );
                                              }
                                            });
                                          },
                                          activeColor: Colors.green,
                                          checkColor: AppTheme.white,
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                goal.text,
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  color: goal.completed
                                                      ? AppTheme.white
                                                      : AppTheme.white,
                                                  decoration: goal.completed
                                                      ? TextDecoration.lineThrough
                                                      : null,
                                                  fontWeight: goal.completed
                                                      ? FontWeight.normal
                                                      : FontWeight.w500,
                                                ),
                                              ),
                                              if (goal.person != null || goal.date != null) ...[
                                                const SizedBox(height: 6),
                                                Row(
                                                  children: [
                                                    if (goal.person != null) ...[
                                                      Icon(
                                                        Icons.person_rounded,
                                                        size: 12,
                                                        color: AppTheme.white,
                                                      ),
                                                      const SizedBox(width: 4),
                                                      Text(
                                                        goal.person!,
                                                        style: TextStyle(
                                                          fontSize: 11,
                                                          color: AppTheme.white,
                                                        ),
                                                      ),
                                                    ],
                                                    if (goal.person != null && goal.date != null)
                                                      const SizedBox(width: 12),
                                                    if (goal.date != null) ...[
                                                      Icon(
                                                        Icons.calendar_today_rounded,
                                                        size: 12,
                                                        color: AppTheme.white,
                                                      ),
                                                      const SizedBox(width: 4),
                                                      Text(
                                                        DateFormat('dd MMM yyyy', 'es').format(goal.date!),
                                                        style: TextStyle(
                                                          fontSize: 11,
                                                          color: AppTheme.white,
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
                                  );
                                }).toList(),
                              ],
                            ),
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
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
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
              : [
                  color.withOpacity(0.15),
                  color.withOpacity(0.08),
                  AppTheme.darkSurface,
                ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isCompleted
              ? Colors.green.withOpacity(0.4)
              : color.withOpacity(0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: (isCompleted ? Colors.green : color).withOpacity(0.2),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
          BoxShadow(
            color: color.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: isCompleted
                      ? [Colors.green, Colors.green.shade700]
                      : [color, color.withOpacity(0.8)],
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: color.withOpacity(0.4),
                    blurRadius: 8,
                    spreadRadius: 1,
                  ),
                ],
              ),
              child: Center(
                child: Text(
                  '${index + 1}',
                  style: const TextStyle(
                    color: AppTheme.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextField(
                controller: TextEditingController(text: priority['text']),
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: isCompleted ? AppTheme.white : AppTheme.white,
                  decoration: isCompleted ? TextDecoration.lineThrough : null,
                  letterSpacing: 0.2,
                ),
                enabled: !isCompleted,
                decoration: const InputDecoration(
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.only(left: 8),
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
            const SizedBox(width: 12),
            Container(
              decoration: BoxDecoration(
                color: isCompleted
                    ? Colors.green.withOpacity(0.2)
                    : AppTheme.darkSurfaceVariant.withOpacity(0.5),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: isCompleted
                      ? Colors.green.withOpacity(0.4)
                      : color.withOpacity(0.3),
                  width: 1.5,
                ),
              ),
              child: Checkbox(
                value: isCompleted,
                onChanged: (value) {
                  setState(() {
                    final idx = _priorities.indexWhere((p) => p['id'] == priority['id']);
                    if (idx != -1) {
                      _priorities[idx]['completed'] = value ?? false;
                    }
                  });
                },
                activeColor: Colors.green,
                checkColor: AppTheme.white,
                side: BorderSide(
                  color: isCompleted ? Colors.green : color.withOpacity(0.5),
                  width: 2,
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: Colors.red.withOpacity(0.3),
                  width: 1,
                ),
              ),
              child: IconButton(
                icon: const Icon(Icons.close_rounded, color: Colors.red, size: 20),
                padding: const EdgeInsets.all(8),
                constraints: const BoxConstraints(),
                onPressed: () {
                  setState(() {
                    _priorities.removeWhere((p) => p['id'] == priority['id']);
                  });
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFocusCard(Map<String, dynamic> focus, int index, List<Color> colors) {
    final color = colors[index % colors.length];
    final isCompleted = focus['completed'] == true;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
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
              : [
                  color.withOpacity(0.15),
                  color.withOpacity(0.08),
                  AppTheme.darkSurface,
                ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isCompleted
              ? Colors.green.withOpacity(0.4)
              : color.withOpacity(0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: (isCompleted ? Colors.green : color).withOpacity(0.2),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
          BoxShadow(
            color: color.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: isCompleted
                      ? [Colors.green, Colors.green.shade700]
                      : [color, color.withOpacity(0.8)],
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: color.withOpacity(0.4),
                    blurRadius: 8,
                    spreadRadius: 1,
                  ),
                ],
              ),
              child: Center(
                child: Icon(
                  Icons.center_focus_strong_rounded,
                  color: AppTheme.white,
                  size: 24,
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextField(
                controller: TextEditingController(text: focus['text']),
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: isCompleted ? AppTheme.white : AppTheme.white,
                  decoration: isCompleted ? TextDecoration.lineThrough : null,
                  letterSpacing: 0.2,
                ),
                enabled: !isCompleted,
                decoration: const InputDecoration(
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.only(left: 8),
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
            const SizedBox(width: 12),
            Container(
              decoration: BoxDecoration(
                color: isCompleted
                    ? Colors.green.withOpacity(0.2)
                    : AppTheme.darkSurfaceVariant.withOpacity(0.5),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: isCompleted
                      ? Colors.green.withOpacity(0.4)
                      : color.withOpacity(0.3),
                  width: 1.5,
                ),
              ),
              child: Checkbox(
                value: isCompleted,
                onChanged: (value) {
                  setState(() {
                    final idx = _focus.indexWhere((f) => f['id'] == focus['id']);
                    if (idx != -1) {
                      _focus[idx]['completed'] = value ?? false;
                    }
                  });
                },
                activeColor: Colors.green,
                checkColor: AppTheme.white,
                side: BorderSide(
                  color: isCompleted ? Colors.green : color.withOpacity(0.5),
                  width: 2,
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.15),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: Colors.red.withOpacity(0.3),
                  width: 1,
                ),
              ),
              child: IconButton(
                icon: const Icon(Icons.close_rounded, color: Colors.red, size: 20),
                padding: const EdgeInsets.all(8),
                constraints: const BoxConstraints(),
                onPressed: () {
                  setState(() {
                    _focus.removeWhere((f) => f['id'] == focus['id']);
                  });
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGoalCard(Map<String, dynamic> goal, int index, List<Color> colors) {
    final color = colors[index % colors.length];
    final milestones = (goal['milestones'] as List<dynamic>?) ?? [];
    final completedMilestones = milestones.where((m) => m['completed'] == true).length;
    final totalMilestones = milestones.length;
    final progressPercentage = totalMilestones > 0 
        ? (completedMilestones / totalMilestones) 
        : 0.0;
    final isCompleted = totalMilestones > 0 && completedMilestones == totalMilestones;
    
    // Asegurar que el controller existe
    if (!_goalMilestoneControllers.containsKey(goal['id'])) {
      _goalMilestoneControllers[goal['id']] = TextEditingController();
    }
    final milestoneController = _goalMilestoneControllers[goal['id']]!;
    
    // Capturar referencias para usar en closures
    final goals = _goals;
    final goalId = goal['id'];
    
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isCompleted
              ? [
                  const Color(0xFF6366F1).withOpacity(0.2),
                  const Color(0xFF6366F1).withOpacity(0.12),
                  AppTheme.darkSurface,
                ]
              : [
                  color.withOpacity(0.2),
                  color.withOpacity(0.12),
                  AppTheme.darkSurface,
                ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isCompleted
              ? const Color(0xFF6366F1).withOpacity(0.5)
              : color.withOpacity(0.5),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: (isCompleted ? const Color(0xFF6366F1) : color).withOpacity(0.25),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
          BoxShadow(
            color: color.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: isCompleted
                          ? [const Color(0xFF6366F1), const Color(0xFF4F46E5)]
                          : [color, color.withOpacity(0.8)],
                    ),
                    borderRadius: BorderRadius.circular(18),
                    boxShadow: [
                      BoxShadow(
                        color: color.withOpacity(0.5),
                        blurRadius: 10,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                  child: Center(
                    child: Icon(
                      Icons.flag_rounded,
                      color: AppTheme.white,
                      size: 28,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: TextField(
                    controller: TextEditingController(text: goal['text']),
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: isCompleted ? AppTheme.white : AppTheme.white,
                      decoration: isCompleted ? TextDecoration.lineThrough : null,
                      letterSpacing: 0.3,
                    ),
                    enabled: !isCompleted,
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.only(left: 8),
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
                if (isCompleted)
                  Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.green, Colors.green.shade700],
                      ),
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.green.withOpacity(0.3),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.check_circle_rounded, color: AppTheme.white, size: 16),
                        SizedBox(width: 6),
                        Text(
                          'Completado',
                          style: TextStyle(
                            color: AppTheme.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.red.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: Colors.red.withOpacity(0.3),
                      width: 1,
                    ),
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.close_rounded, color: Colors.red, size: 20),
                    padding: const EdgeInsets.all(8),
                    constraints: const BoxConstraints(),
                    onPressed: () {
                      setState(() {
                        final goalId = goal['id'];
                        _goals.removeWhere((g) => g['id'] == goalId);
                        _goalMilestoneControllers.remove(goalId)?.dispose();
                      });
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // Barra de progreso mejorada
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppTheme.darkSurfaceVariant.withOpacity(0.4),
                    AppTheme.darkSurface.withOpacity(0.6),
                  ],
                ),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: color.withOpacity(0.3),
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
                          Icon(
                            Icons.track_changes_rounded,
                            size: 16,
                            color: color,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Progreso',
                            style: TextStyle(
                              fontSize: 12,
                              color: AppTheme.white,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: isCompleted
                                ? [Colors.green, Colors.green.shade700]
                                : [color, color.withOpacity(0.8)],
                          ),
                          borderRadius: BorderRadius.circular(10),
                          boxShadow: [
                            BoxShadow(
                              color: color.withOpacity(0.3),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Text(
                          '${(progressPercentage * 100).round()}%',
                          style: const TextStyle(
                            fontSize: 13,
                            color: AppTheme.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Container(
                    height: 10,
                    decoration: BoxDecoration(
                      color: AppTheme.darkSurfaceVariant,
                      borderRadius: BorderRadius.circular(5),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.2),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: FractionallySizedBox(
                      alignment: Alignment.centerLeft,
                      widthFactor: progressPercentage,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: isCompleted
                                ? [Colors.green, Colors.green.shade700]
                                : [color, color.withOpacity(0.8)],
                          ),
                          borderRadius: BorderRadius.circular(5),
                          boxShadow: [
                            BoxShadow(
                              color: color.withOpacity(0.5),
                              blurRadius: 8,
                              spreadRadius: 1,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(
                        Icons.checklist_rounded,
                        size: 14,
                        color: AppTheme.white,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '$completedMilestones/$totalMilestones metas completadas',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            
            // Lista de metas
            if (milestones.isNotEmpty) ...[
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [color.withOpacity(0.4), color.withOpacity(0.2)],
                      ),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      Icons.flag_rounded,
                      size: 16,
                      color: color,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    'Metas:',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                      letterSpacing: 0.3,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ...milestones.asMap().entries.map((entry) {
                final milestoneIndex = entry.key;
                final milestone = entry.value;
                final milestoneCompleted = milestone['completed'] == true;
                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: milestoneCompleted
                          ? [
                              const Color(0xFF6366F1).withOpacity(0.15),
                              const Color(0xFF6366F1).withOpacity(0.08),
                              AppTheme.darkSurface.withOpacity(0.8),
                            ]
                          : [
                              color.withOpacity(0.15),
                              color.withOpacity(0.08),
                              AppTheme.darkSurface.withOpacity(0.8),
                            ],
                    ),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: milestoneCompleted 
                          ? const Color(0xFF6366F1).withOpacity(0.4)
                          : color.withOpacity(0.4),
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: (milestoneCompleted ? const Color(0xFF6366F1) : color).withOpacity(0.15),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          color: milestoneCompleted
                              ? const Color(0xFF6366F1).withOpacity(0.2)
                              : AppTheme.darkSurfaceVariant.withOpacity(0.5),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: milestoneCompleted
                                ? const Color(0xFF6366F1).withOpacity(0.4)
                                : color.withOpacity(0.3),
                            width: 1.5,
                          ),
                        ),
                        child: Checkbox(
                          value: milestoneCompleted,
                          onChanged: (value) {
                            setState(() {
                              final goalIdx = _goals.indexWhere((g) => g['id'] == goal['id']);
                              if (goalIdx != -1) {
                                final milestonesList = _goals[goalIdx]['milestones'] as List<dynamic>;
                                final milestoneIdx = milestonesList.indexWhere(
                                  (m) => m['id'] == milestone['id']
                                );
                                if (milestoneIdx != -1) {
                                  milestonesList[milestoneIdx]['completed'] = value ?? false;
                                }
                              }
                            });
                          },
                          activeColor: const Color(0xFF6366F1),
                          checkColor: AppTheme.white,
                          side: BorderSide(
                            color: milestoneCompleted ? const Color(0xFF6366F1) : color.withOpacity(0.5),
                            width: 2,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          milestone['text'] ?? '',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: milestoneCompleted 
                                ? AppTheme.white 
                                : AppTheme.white,
                            decoration: milestoneCompleted 
                                ? TextDecoration.lineThrough 
                                : null,
                            letterSpacing: 0.2,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: Colors.red.withOpacity(0.3),
                            width: 1,
                          ),
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.close_rounded, size: 18, color: Colors.red),
                          padding: const EdgeInsets.all(6),
                          constraints: const BoxConstraints(),
                          onPressed: () {
                            setState(() {
                              final goalIdx = _goals.indexWhere((g) => g['id'] == goal['id']);
                              if (goalIdx != -1) {
                                final milestonesList = _goals[goalIdx]['milestones'] as List<dynamic>;
                                milestonesList.removeWhere(
                                  (m) => m['id'] == milestone['id']
                                );
                              }
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                );
              }),
              const SizedBox(height: 16),
            ],
            
            // Formulario para agregar meta
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    color.withOpacity(0.2),
                    color.withOpacity(0.1),
                    AppTheme.darkSurfaceVariant.withOpacity(0.4),
                  ],
                ),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: color.withOpacity(0.4),
                  width: 1.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: color.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: milestoneController,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                      decoration: InputDecoration(
                        hintText: 'Agregar meta...',
                        hintStyle: TextStyle(
                          color: AppTheme.white,
                          fontSize: 14,
                        ),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        filled: true,
                        fillColor: AppTheme.darkBackground.withOpacity(0.5),
                      ),
                      onSubmitted: (_) {
                        if (milestoneController.text.trim().isNotEmpty) {
                          final goalIdx = goals.indexWhere((g) => g['id'] == goalId);
                          if (goalIdx != -1) {
                            final milestonesList = goals[goalIdx]['milestones'] as List<dynamic>;
                            milestonesList.add({
                              'id': DateTime.now().millisecondsSinceEpoch.toString(),
                              'text': milestoneController.text.trim(),
                              'completed': false,
                            });
                            milestoneController.clear();
                            setState(() {});
                          }
                        }
                      },
                    ),
                  ),
                  const SizedBox(width: 10),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [color, color.withOpacity(0.8)],
                      ),
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: color.withOpacity(0.4),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: ElevatedButton.icon(
                      onPressed: () {
                        if (milestoneController.text.trim().isNotEmpty) {
                          final goalIdx = goals.indexWhere((g) => g['id'] == goalId);
                          if (goalIdx != -1) {
                            final milestonesList = goals[goalIdx]['milestones'] as List<dynamic>;
                            milestonesList.add({
                              'id': DateTime.now().millisecondsSinceEpoch.toString(),
                              'text': milestoneController.text.trim(),
                              'completed': false,
                            });
                            milestoneController.clear();
                            setState(() {});
                          }
                        }
                      },
                      icon: const Icon(Icons.add_rounded, color: AppTheme.white, size: 20),
                      label: const Text(
                        'Agregar',
                        style: TextStyle(
                          color: AppTheme.white,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        foregroundColor: AppTheme.white,
                        shadowColor: Colors.transparent,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
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

  Widget _buildPriorities() {
    final priorityColors = [
      context.pro.indigo,
      context.pro.teal,
      context.pro.secondary,
      context.pro.accent,
      context.pro.slate,
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
                  Colors.blue.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.blue.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(
                    Icons.priority_high,
                    size: 32,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Prioridades',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Define y gestiona tus prioridades clave',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
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
                        hintStyle: const TextStyle(color: AppTheme.white),
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
                      backgroundColor: context.pro.accent,
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


}