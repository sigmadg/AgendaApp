import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../models/school/class_schedule.dart';
import '../../models/school/academic_task.dart';
import '../../models/school/group_project.dart';
import '../../models/school/exam_revision.dart';
import '../../auth/providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../common/navigation_header.dart';

class SchoolSections extends StatefulWidget {
  const SchoolSections({super.key});

  @override
  State<SchoolSections> createState() => _SchoolSectionsState();
}

class _SchoolSectionsState extends State<SchoolSections> {
  String _activeSection = 'timetable';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  
  // Estados para datos
  List<ClassSchedule> _classes = [];
  List<AcademicTask> _academicTasks = [];
  List<GroupProject> _groupProjects = [];
  List<ExamRevision> _examRevisions = [];
  
  // Estados para Materiales del Curso
  List<Map<String, dynamic>> _textbooks = [];
  List<Map<String, dynamic>> _onlineResources = [];
  List<Map<String, dynamic>> _references = [];
  
  // Estados para Resumen de Clase
  Map<String, dynamic> _classOverview = {};
  
  // Estados para Horario Semanal
  int _selectedDayIndex = 0; // 0 = Lunes
  int _selectedHourIndex = 0; // 0 = 7:00 AM
  final List<String> _weekDays = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  final List<String> _timeSlots = [
    '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
    '7:00 PM', '8:00 PM', '9:00 PM'
  ];
  
  // Estados para modales
  bool _showAddClassModal = false;
  bool _showAddTaskModal = false;
  bool _showAddProjectModal = false;
  bool _showAddExamModal = false;
  bool _showAddMaterialModal = false;
  bool _showAddClassOverviewModal = false;
  String _currentModalType = '';
  
  // Controladores para formularios
  final TextEditingController _classSubjectController = TextEditingController();
  final TextEditingController _classClassroomController = TextEditingController();
  final TextEditingController _classProfessorController = TextEditingController();
  String _selectedClassDay = 'LUN';
  String _selectedClassTime = '7:00 AM';
  String _selectedClassDuration = '60';
  
  final TextEditingController _taskController = TextEditingController();
  final TextEditingController _taskSubjectController = TextEditingController();
  final TextEditingController _taskNotesController = TextEditingController();
  DateTime? _selectedTaskDate;
  String _selectedTaskPriority = 'medium';
  String _selectedTaskTime = '1 hora';
  
  final TextEditingController _projectTitleController = TextEditingController();
  final TextEditingController _projectObjectiveController = TextEditingController();
  final TextEditingController _projectResourcesController = TextEditingController();
  final TextEditingController _projectIdeasController = TextEditingController();
  DateTime? _selectedProjectStartDate;
  DateTime? _selectedProjectEndDate;
  List<Map<String, dynamic>> _projectActionSteps = [];
  final TextEditingController _projectStepController = TextEditingController();
  
  final TextEditingController _examTopicController = TextEditingController();
  final TextEditingController _examNotesController = TextEditingController();
  DateTime? _selectedExamDate;
  List<Map<String, dynamic>> _examTodos = [];
  final TextEditingController _examTodoController = TextEditingController();
  
  final TextEditingController _courseNameController = TextEditingController();
  final TextEditingController _courseTimeController = TextEditingController();
  final TextEditingController _courseLocationController = TextEditingController();
  final TextEditingController _courseInstructorController = TextEditingController();
  final TextEditingController _courseContactInfoController = TextEditingController();
  final TextEditingController _courseOfficeHoursController = TextEditingController();
  final TextEditingController _courseAccessAccountController = TextEditingController();
  final TextEditingController _courseAccessLoginController = TextEditingController();
  final TextEditingController _courseAccessPasswordController = TextEditingController();
  final TextEditingController _courseNotesController = TextEditingController();
  final TextEditingController _courseTargetGradeController = TextEditingController();
  final TextEditingController _courseActualGradeController = TextEditingController();
  final TextEditingController _importantDateController = TextEditingController();
  final TextEditingController _gradingComponentNameController = TextEditingController();
  final TextEditingController _gradingComponentWeightController = TextEditingController();
  
  List<Map<String, dynamic>> _importantDates = []; // {id, date, description}
  List<Map<String, dynamic>> _gradingComponents = []; // {id, name, weight}

  final sections = [
    {'id': 'timetable', 'name': 'Horario Semanal', 'icon': Icons.calendar_today},
    {'id': 'todo', 'name': 'Listas de Tareas', 'icon': Icons.list_alt},
    {'id': 'projects', 'name': 'Proyectos Grupales', 'icon': Icons.people},
    {'id': 'exams', 'name': 'Revisión de Exámenes', 'icon': Icons.school},
    {'id': 'materials', 'name': 'Materiales del Curso', 'icon': Icons.folder},
    {'id': 'class', 'name': 'Resumen de Clase', 'icon': Icons.description},
  ];

  @override
  void dispose() {
    _classSubjectController.dispose();
    _classClassroomController.dispose();
    _classProfessorController.dispose();
    _taskController.dispose();
    _taskSubjectController.dispose();
    _taskNotesController.dispose();
    _projectTitleController.dispose();
    _projectObjectiveController.dispose();
    _projectResourcesController.dispose();
    _projectIdeasController.dispose();
    _projectStepController.dispose();
    _examTopicController.dispose();
    _examNotesController.dispose();
    _examTodoController.dispose();
    _courseNameController.dispose();
    _courseTimeController.dispose();
    _courseLocationController.dispose();
    _courseInstructorController.dispose();
    _courseContactInfoController.dispose();
    _courseOfficeHoursController.dispose();
    _courseAccessAccountController.dispose();
    _courseAccessLoginController.dispose();
    _courseAccessPasswordController.dispose();
    _courseNotesController.dispose();
    _courseTargetGradeController.dispose();
    _courseActualGradeController.dispose();
    _importantDateController.dispose();
    _gradingComponentNameController.dispose();
    _gradingComponentWeightController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: Colors.transparent,
      drawer: _buildNavigationDrawer(context),
      appBar: NavigationHeader(currentSection: 'school'),
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
                  Colors.purple.withOpacity(0.3),
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
                    color: Colors.purple,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: const Icon(
                    Icons.school,
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
            isActive: true,
            onTap: () {
              Navigator.pop(context);
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
                        ? Colors.purple.withOpacity(0.2)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isActive 
                          ? Colors.purple 
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
                            ? Colors.purple 
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
                                ? Colors.purple 
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
      case 'timetable':
        return _buildTimetable();
      case 'todo':
        return _buildTodoLists();
      case 'projects':
        return _buildGroupProjects();
      case 'exams':
        return _buildExamRevision();
      case 'materials':
        return _buildCourseMaterials();
      case 'class':
        return _buildClassOverview();
      default:
        return _buildTimetable();
    }
  }

  Widget _buildFloatingActionButton() {
    if (_activeSection == 'timetable') {
      return FloatingActionButton.extended(
        onPressed: () {
          _showAddClassDialog();
        },
        icon: const Icon(Icons.add),
        label: const Text('Agregar Clase'),
        backgroundColor: Colors.purple,
      );
    } else if (_activeSection == 'todo') {
      return FloatingActionButton.extended(
        onPressed: () {
          _showAddTaskDialog();
        },
        icon: const Icon(Icons.add),
        label: const Text('Nueva Tarea'),
        backgroundColor: Colors.purple,
      );
    } else if (_activeSection == 'projects') {
      return FloatingActionButton.extended(
        onPressed: () {
          setState(() {
            _projectActionSteps = [];
          });
          _showAddProjectDialog();
        },
        icon: const Icon(Icons.add),
        label: const Text('Nuevo Proyecto'),
        backgroundColor: Colors.purple,
      );
    } else if (_activeSection == 'exams') {
      return FloatingActionButton.extended(
        onPressed: () {
          setState(() {
            _examTodos = [];
          });
          _showAddExamDialog();
        },
        icon: const Icon(Icons.add),
        label: const Text('Nuevo Examen'),
        backgroundColor: Colors.purple,
      );
    } else if (_activeSection == 'materials') {
      return FloatingActionButton(
        onPressed: () {
          _showAddMaterialDialog();
        },
        child: const Icon(Icons.add),
        backgroundColor: Colors.purple,
      );
    } else if (_activeSection == 'class') {
      return FloatingActionButton(
        onPressed: () {
          setState(() {
            _courseNameController.text = _classOverview['course'] ?? '';
            _courseTimeController.text = _classOverview['time'] ?? '';
            _courseLocationController.text = _classOverview['location'] ?? '';
            _courseInstructorController.text = _classOverview['instructor'] ?? '';
          });
          _showAddClassOverviewDialog();
        },
        child: const Icon(Icons.add),
        backgroundColor: Colors.purple,
      );
    }
    return const SizedBox.shrink();
  }

  void _showAddClassDialog() {
    showDialog(
      context: context,
      builder: (context) => _buildAddClassModal(),
    ).then((_) {
      setState(() {
        _showAddClassModal = false;
      });
    });
  }

  void _showAddTaskDialog() {
    showDialog(
      context: context,
      builder: (context) => _buildAddTaskModal(),
    ).then((_) {
      setState(() {
        _showAddTaskModal = false;
      });
    });
  }

  void _showAddProjectDialog() {
    showDialog(
      context: context,
      builder: (context) => _buildAddProjectModal(),
    ).then((_) {
      setState(() {
        _showAddProjectModal = false;
      });
    });
  }

  void _showAddExamDialog() {
    showDialog(
      context: context,
      builder: (context) => _buildAddExamModal(),
    ).then((_) {
      setState(() {
        _showAddExamModal = false;
      });
    });
  }

  void _showAddMaterialDialog() {
    showDialog(
      context: context,
      builder: (context) => _buildAddMaterialModal(),
    ).then((_) {
      setState(() {
        _showAddMaterialModal = false;
      });
    });
  }

  void _showAddClassOverviewDialog() {
    showDialog(
      context: context,
      builder: (context) => _buildAddClassOverviewModal(),
    ).then((_) {
      setState(() {
        _showAddClassOverviewModal = false;
      });
    });
  }

  // ==================== HORARIO SEMANAL ====================
  Widget _buildTimetable() {
    final currentDay = _weekDays[_selectedDayIndex];
    final dayNames = {
      'LUN': 'Lunes',
      'MAR': 'Martes',
      'MIÉ': 'Miércoles',
      'JUE': 'Jueves',
      'VIE': 'Viernes',
      'SÁB': 'Sábado',
      'DOM': 'Domingo'
    };
    final today = DateTime.now();
    final currentDate = DateFormat('EEEE, d \'de\' MMMM \'de\' y', 'es').format(today);
    
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
                  Colors.purple.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.purple.withOpacity(0.3),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.purple.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Icon(
                    Icons.calendar_today,
                    size: 40,
                    color: Colors.purple,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Horario de ${dayNames[currentDay]}',
                  style: const TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  currentDate,
                  style: const TextStyle(
                    fontSize: 15,
                    color: AppTheme.white70,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Navegación del calendario
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                onPressed: () {
                  setState(() {
                    _selectedDayIndex = _selectedDayIndex > 0 ? _selectedDayIndex - 1 : 6;
                  });
                },
                icon: const Icon(Icons.chevron_left, color: Colors.purple),
              ),
              ElevatedButton.icon(
                onPressed: () {
                  final today = DateTime.now();
                  final dayIndex = today.weekday; // 1 = Lunes, 7 = Domingo
                  setState(() {
                    _selectedDayIndex = dayIndex == 7 ? 6 : dayIndex - 1;
                  });
                },
                icon: const Icon(Icons.today, size: 16),
                label: const Text('Hoy'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.purple,
                  foregroundColor: AppTheme.white,
                ),
              ),
              IconButton(
                onPressed: () {
                  setState(() {
                    _selectedDayIndex = _selectedDayIndex < 6 ? _selectedDayIndex + 1 : 0;
                  });
                },
                icon: const Icon(Icons.chevron_right, color: Colors.purple),
              ),
            ],
          ),
          const SizedBox(height: 16),
          
          // Navegación de horas
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                onPressed: () {
                  setState(() {
                    if (_selectedHourIndex > 0) _selectedHourIndex--;
                  });
                },
                icon: const Icon(Icons.keyboard_arrow_up, color: Colors.purple),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.purple.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.purple, width: 2),
                ),
                child: Text(
                  _timeSlots[_selectedHourIndex],
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.purple,
                  ),
                ),
              ),
              IconButton(
                onPressed: () {
                  setState(() {
                    if (_selectedHourIndex < _timeSlots.length - 1) _selectedHourIndex++;
                  });
                },
                icon: const Icon(Icons.keyboard_arrow_down, color: Colors.purple),
              ),
              ElevatedButton.icon(
                onPressed: () {
                  final now = DateTime.now();
                  final hour = now.hour;
                  final index = _timeSlots.indexWhere((slot) {
                    final parts = slot.split(' ');
                    final time = parts[0];
                    final period = parts[1];
                    final slotHour = int.parse(time.split(':')[0]);
                    final slotHour24 = period == 'PM' && slotHour != 12 
                        ? slotHour + 12 
                        : period == 'AM' && slotHour == 12 ? 0 : slotHour;
                    return slotHour24 == hour;
                  });
                  if (index != -1) {
                    setState(() {
                      _selectedHourIndex = index;
                    });
                  }
                },
                icon: const Icon(Icons.access_time, size: 16),
                label: const Text('Ahora'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.purple,
                  foregroundColor: AppTheme.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Resumen del día
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.school,
                  title: 'Clases Programadas',
                  value: '${_classes.length} clases',
                  color: Colors.purple,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.access_time,
                  title: 'Horas Libres',
                  value: '${_timeSlots.length - _classes.length} horas',
                  color: Colors.blue,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Horario
          Container(
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.purple.withOpacity(0.3), width: 1),
            ),
            child: Column(
              children: [
                // Header de la tabla
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.purple,
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(20),
                      topRight: Radius.circular(20),
                    ),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.access_time, color: AppTheme.white, size: 20),
                      const SizedBox(width: 8),
                      const Expanded(
                        child: Text(
                          'Horario',
                          style: TextStyle(
                            color: AppTheme.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ),
                      Text(
                        dayNames[currentDay]!.toUpperCase(),
                        style: const TextStyle(
                          color: AppTheme.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                ),
                // Cuerpo del horario
                Container(
                  constraints: const BoxConstraints(maxHeight: 400),
                  child: ListView.builder(
                    shrinkWrap: true,
                    itemCount: 3, // Mostrar 3 horas: anterior, actual, siguiente
                    itemBuilder: (context, index) {
                      final startIndex = (_selectedHourIndex - 1).clamp(0, _timeSlots.length - 3);
                      final actualIndex = startIndex + index;
                      if (actualIndex >= _timeSlots.length) return const SizedBox.shrink();
                      
                      final time = _timeSlots[actualIndex];
                      final hasClass = _classes.any((c) => 
                        c.day == currentDay && c.time == time
                      );
                      final isCurrentTime = actualIndex == _selectedHourIndex;
                      
                      return Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          border: Border(
                            bottom: BorderSide(
                              color: AppTheme.darkSurfaceVariant,
                              width: 1,
                            ),
                          ),
                          color: hasClass 
                              ? Colors.purple.withOpacity(0.1)
                              : isCurrentTime
                                  ? Colors.purple.withOpacity(0.05)
                                  : Colors.transparent,
                        ),
                        child: Row(
                          children: [
                            SizedBox(
                              width: 80,
                              child: Column(
                                children: [
                                  Icon(
                                    isCurrentTime ? Icons.radio_button_checked : Icons.access_time,
                                    color: hasClass 
                                        ? Colors.purple 
                                        : isCurrentTime
                                            ? Colors.purple
                                            : AppTheme.white60,
                                    size: 18,
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    time,
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: isCurrentTime ? FontWeight.bold : FontWeight.normal,
                                      color: hasClass 
                                          ? Colors.purple 
                                          : isCurrentTime
                                              ? Colors.purple
                                              : AppTheme.white70,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Expanded(
                              child: hasClass
                                  ? _buildClassCardForTimetable(
                                      _classes.firstWhere((c) => 
                                        c.day == currentDay && c.time == time
                                      ),
                                    )
                                  : _buildEmptySlot(isCurrentTime),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildClassCardForTimetable(ClassSchedule classItem) {
    final isCurrentTime = DateTime.now().hour == _convertTo24Hour(classItem.time);
    
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isCurrentTime ? Colors.orange : Colors.purple,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: (isCurrentTime ? Colors.orange : Colors.purple).withOpacity(0.3),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.school, size: 16, color: AppTheme.white),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      classItem.subject,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        'Activa',
                        style: TextStyle(
                          color: AppTheme.white,
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 12,
            runSpacing: 8,
            children: [
              if (classItem.classroom != null)
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.location_on, size: 14, color: AppTheme.white70),
                    const SizedBox(width: 4),
                    Text(
                      classItem.classroom!,
                      style: const TextStyle(fontSize: 12, color: AppTheme.white70),
                    ),
                  ],
                ),
              if (classItem.professor != null)
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.person, size: 14, color: AppTheme.white70),
                    const SizedBox(width: 4),
                    Text(
                      classItem.professor!,
                      style: const TextStyle(fontSize: 12, color: AppTheme.white70),
                    ),
                  ],
                ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.book, size: 14, color: AppTheme.white70),
                  const SizedBox(width: 4),
                  Text(
                    classItem.subject,
                    style: const TextStyle(fontSize: 12, color: AppTheme.white70),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: TextButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Unirse a ${classItem.subject}')),
                      );
                    },
                    icon: const Icon(Icons.videocam, size: 14, color: AppTheme.white),
                    label: const Text(
                      'Unirse',
                      style: TextStyle(
                        fontSize: 11,
                        color: AppTheme.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: TextButton.icon(
                    onPressed: () {
                      setState(() {
                        _activeSection = 'materials';
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Ver materiales del curso')),
                      );
                    },
                    icon: const Icon(Icons.description, size: 14, color: AppTheme.white),
                    label: const Text(
                      'Material',
                      style: TextStyle(
                        fontSize: 11,
                        color: AppTheme.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  int _convertTo24Hour(String timeStr) {
    final parts = timeStr.split(' ');
    final timePart = parts[0];
    final period = parts.length > 1 ? parts[1] : '';
    final time = timePart.split(':');
    var hour24 = int.parse(time[0]);
    
    if (period == 'PM' && hour24 != 12) {
      hour24 += 12;
    } else if (period == 'AM' && hour24 == 12) {
      hour24 = 0;
    }
    return hour24;
  }

  Widget _buildEmptySlot(bool isCurrentTime) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isCurrentTime 
            ? Colors.purple.withOpacity(0.1)
            : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
        border: isCurrentTime 
            ? Border.all(color: Colors.purple, width: 2)
            : null,
      ),
      child: Row(
        children: [
          Icon(
            isCurrentTime ? Icons.radio_button_checked : Icons.radio_button_unchecked,
            color: isCurrentTime ? Colors.purple : AppTheme.white60,
            size: 18,
          ),
          const SizedBox(width: 8),
          Text(
            isCurrentTime ? 'Hora Actual' : 'Libre',
            style: TextStyle(
              fontSize: 14,
              color: isCurrentTime ? Colors.purple : AppTheme.white60,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard({
    required IconData icon,
    required String title,
    required String value,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3), width: 1),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppTheme.white60,
                  ),
                ),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ==================== TAREAS ACADÉMICAS ====================
  Widget _buildTodoLists() {
    final completedTasks = _academicTasks.where((t) => t.completed).length;
    final totalTasks = _academicTasks.length;
    final pendingTasks = _academicTasks.where((t) => !t.completed).length;
    final overdueTasks = _academicTasks.where((t) => 
      !t.completed && t.date.isBefore(DateTime.now().subtract(const Duration(days: 1)))
    ).length;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header mejorado
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.purple,
                  Colors.purple.withOpacity(0.8),
                  Colors.purple.withOpacity(0.6),
                ],
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.purple.withOpacity(0.3),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
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
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.check_circle_outline,
                    size: 24,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Tareas Académicas',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Gestiona tus tareas y proyectos académicos',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white70,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(
                    Icons.school_outlined,
                    size: 16,
                    color: Colors.purple,
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
                  icon: Icons.list,
                  title: 'Total',
                  value: '$totalTasks',
                  color: Colors.blue,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle,
                  title: 'Completadas',
                  value: '$completedTasks',
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.access_time,
                  title: 'Pendientes',
                  value: '$pendingTasks',
                  color: Colors.orange,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.warning,
                  title: 'Urgentes',
                  value: '$overdueTasks',
                  color: Colors.red,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Botón para agregar tarea
          Container(
            margin: const EdgeInsets.only(bottom: 20),
            child: ElevatedButton.icon(
              onPressed: () {
                setState(() {
                  _showAddTaskModal = true;
                });
              },
              icon: const Icon(Icons.add_circle_outline, size: 20),
              label: const Text('Nueva Tarea Académica'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.purple,
                foregroundColor: AppTheme.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 4,
              ),
            ),
          ),
          
          // Lista de tareas
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.purple.withOpacity(0.2), width: 1),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Mis Tareas',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    OutlinedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.filter_list, size: 16),
                      label: const Text('Filtrar'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.purple,
                        side: BorderSide(color: Colors.purple.withOpacity(0.5)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                if (_academicTasks.isEmpty)
                  _buildEmptyState(
                    icon: Icons.description,
                    title: 'No hay tareas académicas',
                    subtitle: 'Agrega tu primera tarea para comenzar a organizarte',
                  )
                else
                  Column(
                    children: _academicTasks.map((task) => _buildTaskCard(task)).toList(),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTaskCard(AcademicTask task) {
    final isOverdue = !task.completed && task.date.isBefore(DateTime.now().subtract(const Duration(days: 1)));
    final isDueToday = !task.completed && 
        task.date.year == DateTime.now().year &&
        task.date.month == DateTime.now().month &&
        task.date.day == DateTime.now().day;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isOverdue 
              ? Colors.red.withOpacity(0.5)
              : isDueToday
                  ? Colors.orange.withOpacity(0.5)
                  : task.completed
                      ? Colors.green.withOpacity(0.5)
                      : AppTheme.darkSurfaceVariant,
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              GestureDetector(
                onTap: () {
                  setState(() {
                    _academicTasks = _academicTasks.map((t) {
                      if (t.id == task.id) {
                        return AcademicTask(
                          id: t.id,
                          task: t.task,
                          date: t.date,
                          completed: !t.completed,
                          notes: t.notes,
                          priority: t.priority,
                          subject: t.subject,
                          estimatedTime: t.estimatedTime,
                        );
                      }
                      return t;
                    }).toList();
                  });
                },
                child: Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: task.completed ? Colors.green : Colors.transparent,
                    border: Border.all(
                      color: task.completed ? Colors.green : AppTheme.white60,
                      width: 2,
                    ),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: task.completed
                      ? const Icon(Icons.check, size: 16, color: AppTheme.white)
                      : null,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      task.task,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: task.completed ? AppTheme.white40 : AppTheme.white,
                        decoration: task.completed ? TextDecoration.lineThrough : null,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 12,
                      runSpacing: 8,
                      children: [
                        if (task.subject != null)
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.book, size: 14, color: AppTheme.white60),
                              const SizedBox(width: 4),
                              Text(
                                task.subject!,
                                style: const TextStyle(fontSize: 12, color: AppTheme.white70),
                              ),
                            ],
                          ),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.calendar_today, size: 14, color: AppTheme.white60),
                            const SizedBox(width: 4),
                            Text(
                              DateFormat('dd/MM/yyyy').format(task.date),
                              style: TextStyle(
                                fontSize: 12,
                                color: isOverdue ? Colors.red : AppTheme.white70,
                                fontWeight: isOverdue ? FontWeight.bold : FontWeight.normal,
                              ),
                            ),
                          ],
                        ),
                        if (task.estimatedTime != null)
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.access_time, size: 14, color: AppTheme.white60),
                              const SizedBox(width: 4),
                              Text(
                                task.estimatedTime!,
                                style: const TextStyle(fontSize: 12, color: AppTheme.white70),
                              ),
                            ],
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Información adicional
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: _getPriorityColor(task.priority).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.circle,
                      size: 8,
                      color: _getPriorityColor(task.priority),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      _getPriorityLabel(task.priority),
                      style: TextStyle(
                        fontSize: 10,
                        color: _getPriorityColor(task.priority),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: task.completed 
                      ? Colors.green.withOpacity(0.2)
                      : isOverdue
                          ? Colors.red.withOpacity(0.2)
                          : isDueToday
                              ? Colors.orange.withOpacity(0.2)
                              : Colors.blue.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      task.completed 
                          ? Icons.check_circle
                          : isOverdue
                              ? Icons.error
                              : isDueToday
                                  ? Icons.warning
                                  : Icons.pending,
                      size: 12,
                      color: task.completed 
                          ? Colors.green
                          : isOverdue
                              ? Colors.red
                              : isDueToday
                                  ? Colors.orange
                                  : Colors.blue,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      task.completed 
                          ? 'Completada'
                          : isOverdue
                              ? 'Vencida'
                              : isDueToday
                                  ? 'Hoy'
                                  : 'Pendiente',
                      style: TextStyle(
                        fontSize: 10,
                        color: task.completed 
                            ? Colors.green
                            : isOverdue
                                ? Colors.red
                                : isDueToday
                                    ? Colors.orange
                                    : Colors.blue,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(),
              IconButton(
                onPressed: () {
                  setState(() {
                    _academicTasks = _academicTasks.where((t) => t.id != task.id).toList();
                  });
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Tarea eliminada')),
                  );
                },
                icon: const Icon(Icons.delete_outline, color: Colors.red, size: 20),
              ),
            ],
          ),
          // Notas
          if (task.notes != null && task.notes!.isNotEmpty) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.darkBackground,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.blue.withOpacity(0.3), width: 1),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.note, size: 16, color: Colors.blue),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      task.notes!,
                      style: const TextStyle(fontSize: 12, color: AppTheme.white70),
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

  Color _getPriorityColor(String priority) {
    switch (priority) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.orange;
      case 'low':
        return Colors.green;
      default:
        return Colors.grey;
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
        return 'Sin prioridad';
    }
  }

  // ==================== PROYECTOS GRUPALES ====================
  Widget _buildGroupProjects() {
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
                  Colors.purple.withOpacity(0.2),
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
                    color: Colors.purple.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(
                    Icons.people,
                    size: 32,
                    color: Colors.purple,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Planificador de Proyectos',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Gestiona proyectos grupales y colaborativos',
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
          
          // Resumen
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.folder,
                  title: 'Proyectos Activos',
                  value: '${_groupProjects.length}',
                  color: Colors.purple,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.people,
                  title: 'Colaboradores',
                  value: '${_groupProjects.length * 3}', // Placeholder - calcular basado en proyectos
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle,
                  title: 'Tareas Completadas',
                  value: '${_groupProjects.fold<int>(0, (sum, p) => sum + p.actionSteps.where((s) => s.completed).length)}',
                  color: Colors.orange,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Lista de proyectos
          if (_groupProjects.isEmpty)
            _buildEmptyState(
              icon: Icons.folder_open,
              title: 'No hay proyectos',
              subtitle: 'Crea tu primer proyecto escolar',
            )
          else
            Column(
              children: _groupProjects.map((project) => _buildProjectCard(project)).toList(),
            ),
        ],
      ),
    );
  }

  Widget _buildProjectCard(GroupProject project) {
    final completedSteps = project.actionSteps.where((s) => s.completed).length;
    final totalSteps = project.actionSteps.length;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.purple.withOpacity(0.3), width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.purple.withOpacity(0.1),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.purple.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.folder, size: 24, color: Colors.purple),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        project.title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.calendar_today, size: 14, color: AppTheme.white60),
                          const SizedBox(width: 4),
                          Text(
                            '${DateFormat('dd/MM').format(project.startDate)} - ${DateFormat('dd/MM/yyyy').format(project.endDate)}',
                            style: const TextStyle(fontSize: 12, color: AppTheme.white70),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: () {
                    setState(() {
                      _groupProjects = _groupProjects.where((p) => p.id != project.id).toList();
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Proyecto eliminado')),
                    );
                  },
                  icon: const Icon(Icons.delete, color: Colors.red),
                ),
              ],
            ),
          ),
          // Contenido
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  project.objective,
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white70,
                  ),
                ),
                if (project.resources != null && project.resources!.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.library_books, size: 16, color: Colors.purple),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Recursos',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.purple,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              project.resources!,
                              style: const TextStyle(fontSize: 12, color: AppTheme.white70),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
                if (project.ideas != null && project.ideas!.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.lightbulb, size: 16, color: Colors.orange),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Ideas',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.orange,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              project.ideas!,
                              style: const TextStyle(fontSize: 12, color: AppTheme.white70),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
                if (project.actionSteps.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.list, size: 16, color: Colors.green),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Pasos de Acción',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.green,
                              ),
                            ),
                            const SizedBox(height: 8),
                            ...project.actionSteps.map((step) => Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: GestureDetector(
                                onTap: () {
                                  setState(() {
                                    final projectIndex = _groupProjects.indexWhere((p) => p.id == project.id);
                                    if (projectIndex != -1) {
                                      final updatedSteps = project.actionSteps.map((s) {
                                        if (s.id == step.id) {
                                          return ActionStep(
                                            id: s.id,
                                            text: s.text,
                                            completed: !s.completed,
                                          );
                                        }
                                        return s;
                                      }).toList();
                                      _groupProjects[projectIndex] = GroupProject(
                                        id: project.id,
                                        title: project.title,
                                        objective: project.objective,
                                        startDate: project.startDate,
                                        endDate: project.endDate,
                                        resources: project.resources,
                                        ideas: project.ideas,
                                        actionSteps: updatedSteps,
                                      );
                                    }
                                  });
                                },
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                                  decoration: BoxDecoration(
                                    color: AppTheme.darkBackground,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        step.completed ? Icons.check_circle : Icons.radio_button_unchecked,
                                        size: 20,
                                        color: step.completed ? Colors.green : AppTheme.white60,
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Text(
                                          step.text,
                                          style: TextStyle(
                                            fontSize: 14,
                                            color: step.completed ? AppTheme.white40 : AppTheme.white,
                                            decoration: step.completed ? TextDecoration.lineThrough : null,
                                          ),
                                        ),
                                      ),
                                      if (step.completed)
                                        Container(
                                          padding: const EdgeInsets.all(4),
                                          decoration: BoxDecoration(
                                            color: Colors.green,
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: const Text(
                                            '✓',
                                            style: TextStyle(
                                              color: AppTheme.white,
                                              fontSize: 12,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                              ),
                            )),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
                const SizedBox(height: 16),
                // Progreso
                Row(
                  children: [
                    Expanded(
                      child: LinearProgressIndicator(
                        value: totalSteps > 0 ? completedSteps / totalSteps : 0,
                        backgroundColor: AppTheme.darkSurfaceVariant,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.green),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      '$completedSteps/$totalSteps',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white70,
                        fontWeight: FontWeight.bold,
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

  // ==================== REVISIÓN DE EXÁMENES ====================
  Widget _buildExamRevision() {
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
                  Colors.purple.withOpacity(0.2),
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
                    color: Colors.purple.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(
                    Icons.school,
                    size: 32,
                    color: Colors.purple,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Exámenes',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Planifica y prepara tus exámenes',
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
          
          // Resumen
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.school,
                  title: 'Exámenes Programados',
                  value: '${_examRevisions.length}',
                  color: Colors.purple,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.access_time,
                  title: 'Próximos',
                  value: '${_examRevisions.where((e) => e.date.isAfter(DateTime.now()) && e.date.isBefore(DateTime.now().add(const Duration(days: 7)))).length}',
                  color: Colors.orange,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle,
                  title: 'Preparados',
                  value: '${_examRevisions.fold<int>(0, (sum, e) => sum + (e.todos.isNotEmpty && e.todos.every((t) => t.completed) ? 1 : 0))}',
                  color: Colors.green,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Lista de exámenes
          if (_examRevisions.isEmpty)
            _buildEmptyState(
              icon: Icons.school_outlined,
              title: 'No hay exámenes',
              subtitle: 'Agrega tu primer examen para planificar',
            )
          else
            Column(
              children: _examRevisions.map((exam) => _buildExamCard(exam)).toList(),
            ),
        ],
      ),
    );
  }

  Widget _buildExamCard(ExamRevision exam) {
    final completedTodos = exam.todos.where((t) => t.completed).length;
    final totalTodos = exam.todos.length;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.purple.withOpacity(0.3), width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.purple.withOpacity(0.1),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.purple.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.school, size: 24, color: Colors.purple),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        exam.topic,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.calendar_today, size: 14, color: AppTheme.white60),
                          const SizedBox(width: 4),
                          Text(
                            DateFormat('dd/MM/yyyy').format(exam.date),
                            style: const TextStyle(fontSize: 12, color: AppTheme.white70),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: () {
                    setState(() {
                      _examRevisions = _examRevisions.where((e) => e.id != exam.id).toList();
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Examen eliminado')),
                    );
                  },
                  icon: const Icon(Icons.delete, color: Colors.red),
                ),
              ],
            ),
          ),
          // Contenido
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (exam.todos.isNotEmpty) ...[
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.list, size: 16, color: Colors.green),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Tareas de Preparación',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.green,
                              ),
                            ),
                            const SizedBox(height: 8),
                            ...exam.todos.map((todo) => Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: GestureDetector(
                                onTap: () {
                                  setState(() {
                                    final examIndex = _examRevisions.indexWhere((e) => e.id == exam.id);
                                    if (examIndex != -1) {
                                      final updatedTodos = exam.todos.map((t) {
                                        if (t.id == todo.id) {
                                          return ExamTodo(
                                            id: t.id,
                                            text: t.text,
                                            completed: !t.completed,
                                          );
                                        }
                                        return t;
                                      }).toList();
                                      _examRevisions[examIndex] = ExamRevision(
                                        id: exam.id,
                                        topic: exam.topic,
                                        date: exam.date,
                                        todos: updatedTodos,
                                        notes: exam.notes,
                                      );
                                    }
                                  });
                                },
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                                  decoration: BoxDecoration(
                                    color: AppTheme.darkBackground,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        todo.completed ? Icons.check_circle : Icons.radio_button_unchecked,
                                        size: 20,
                                        color: todo.completed ? Colors.green : AppTheme.white60,
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Text(
                                          todo.text,
                                          style: TextStyle(
                                            fontSize: 14,
                                            color: todo.completed ? AppTheme.white40 : AppTheme.white,
                                            decoration: todo.completed ? TextDecoration.lineThrough : null,
                                          ),
                                        ),
                                      ),
                                      if (todo.completed)
                                        Container(
                                          padding: const EdgeInsets.all(4),
                                          decoration: BoxDecoration(
                                            color: Colors.green,
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: const Text(
                                            '✓',
                                            style: TextStyle(
                                              color: AppTheme.white,
                                              fontSize: 12,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                ),
                              ),
                            )),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                ],
                if (exam.notes != null && exam.notes!.isNotEmpty) ...[
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBackground,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.orange.withOpacity(0.3), width: 1),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.note, size: 16, color: Colors.orange),
                            SizedBox(width: 8),
                            Text(
                              'Notas de Estudio',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.orange,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          exam.notes!,
                          style: const TextStyle(fontSize: 12, color: AppTheme.white70),
                        ),
                      ],
                    ),
                  ),
                ],
                if (exam.todos.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: LinearProgressIndicator(
                          value: totalTodos > 0 ? completedTodos / totalTodos : 0,
                          backgroundColor: AppTheme.darkSurfaceVariant,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.green),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        '$completedTodos/$totalTodos',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppTheme.white70,
                          fontWeight: FontWeight.bold,
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
    );
  }

  // ==================== MATERIALES DEL CURSO ====================
  Widget _buildCourseMaterials() {
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
                  Colors.purple.withOpacity(0.2),
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
                    color: Colors.purple.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(
                    Icons.folder,
                    size: 32,
                    color: Colors.purple,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Materiales del Curso',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Organiza libros, recursos y materiales',
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
          
          // Resumen
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.book,
                  title: 'Libros de Texto',
                  value: '${_textbooks.length}',
                  color: Colors.purple,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.language,
                  title: 'Recursos Online',
                  value: '${_onlineResources.length}',
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.library_books,
                  title: 'Referencias',
                  value: '${_references.length}',
                  color: Colors.orange,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Libros de Texto
          _buildMaterialSection(
            title: 'Libros de Texto',
            icon: Icons.book,
            color: Colors.purple,
            items: _textbooks,
            onAdd: () {
              setState(() {
                _currentModalType = 'textbook';
                _showAddMaterialModal = true;
              });
            },
            onDelete: (index) {
              setState(() {
                _textbooks.removeAt(index);
              });
            },
          ),
          const SizedBox(height: 16),
          
          // Recursos Online
          _buildMaterialSection(
            title: 'Recursos en Línea',
            icon: Icons.language,
            color: Colors.green,
            items: _onlineResources,
            onAdd: () {
              setState(() {
                _currentModalType = 'online';
                _showAddMaterialModal = true;
              });
            },
            onDelete: (index) {
              setState(() {
                _onlineResources.removeAt(index);
              });
            },
          ),
          const SizedBox(height: 16),
          
          // Referencias
          _buildMaterialSection(
            title: 'Referencias',
            icon: Icons.library_books,
            color: Colors.orange,
            items: _references,
            onAdd: () {
              setState(() {
                _currentModalType = 'reference';
                _showAddMaterialModal = true;
              });
            },
            onDelete: (index) {
              setState(() {
                _references.removeAt(index);
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _buildMaterialSection({
    required String title,
    required IconData icon,
    required Color color,
    required List<Map<String, dynamic>> items,
    required VoidCallback onAdd,
    required Function(int) onDelete,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3), width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(icon, color: color, size: 18),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
                  ),
                ],
              ),
              ElevatedButton.icon(
                onPressed: onAdd,
                icon: const Icon(Icons.add_circle, size: 18),
                label: const Text('Agregar'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: color.withOpacity(0.2),
                  foregroundColor: color,
                  elevation: 0,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (items.isEmpty)
            _buildEmptyState(
              icon: icon,
              title: 'No hay $title',
              subtitle: 'Agrega tus materiales para organizarlos',
            )
          else
            Column(
              children: List.generate(items.length, (index) {
                final item = items[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.darkBackground,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: color.withOpacity(0.2), width: 1),
                  ),
                  child: Row(
                    children: [
                      Icon(icon, color: color, size: 20),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item['title'] ?? item['quote'] ?? item['website'] ?? 'Sin título',
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.white,
                              ),
                            ),
                            if (item['author'] != null || item['book'] != null) ...[
                              const SizedBox(height: 4),
                              Text(
                                item['author'] != null 
                                    ? 'por ${item['author']}'
                                    : item['book'] ?? '',
                                style: const TextStyle(
                                  fontSize: 12, 
                                  color: AppTheme.white70,
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                            ],
                            if (item['genre'] != null || item['price'] != null || item['page'] != null) ...[
                              const SizedBox(height: 8),
                              Wrap(
                                spacing: 12,
                                runSpacing: 8,
                                children: [
                                  if (item['genre'] != null)
                                    Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.library_books, size: 14, color: AppTheme.white60),
                                        const SizedBox(width: 4),
                                        Text(
                                          item['genre'],
                                          style: const TextStyle(fontSize: 11, color: AppTheme.white70),
                                        ),
                                      ],
                                    ),
                                  if (item['price'] != null)
                                    Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.attach_money, size: 14, color: AppTheme.white60),
                                        const SizedBox(width: 4),
                                        Text(
                                          item['price'],
                                          style: const TextStyle(fontSize: 11, color: AppTheme.white70),
                                        ),
                                      ],
                                    ),
                                  if (item['page'] != null)
                                    Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.description, size: 14, color: AppTheme.white60),
                                        const SizedBox(width: 4),
                                        Text(
                                          'Pág. ${item['page']}',
                                          style: const TextStyle(fontSize: 11, color: AppTheme.white70),
                                        ),
                                      ],
                                    ),
                                ],
                              ),
                            ],
                            if (item['notes'] != null && item['notes'].toString().isNotEmpty) ...[
                              const SizedBox(height: 8),
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: AppTheme.darkBackground,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  item['notes'],
                                  style: const TextStyle(
                                    fontSize: 11,
                                    color: AppTheme.white60,
                                    fontStyle: FontStyle.italic,
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            onPressed: () {},
                            icon: const Icon(Icons.edit, color: AppTheme.white60, size: 18),
                          ),
                          IconButton(
                            onPressed: () => onDelete(index),
                            icon: const Icon(Icons.delete, color: Colors.red, size: 18),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              }),
            ),
        ],
      ),
    );
  }

  // ==================== RESUMEN DE CLASE ====================
  Widget _buildClassOverview() {
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
                  Colors.purple.withOpacity(0.2),
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
                    color: Colors.purple.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(
                    Icons.description,
                    size: 32,
                    color: Colors.purple,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Resúmenes de Clase',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Organiza y gestiona tus clases',
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
          
          // Resumen
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.school,
                  title: 'Clases Activas',
                  value: _classOverview['course'] != null ? '1' : '0',
                  color: Colors.purple,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.access_time,
                  title: 'Horas Semanales',
                  value: '15h',
                  color: Colors.orange,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Lista de clases
          if (_classOverview['course'] == null)
            _buildEmptyState(
              icon: Icons.school_outlined,
              title: 'No hay clases registradas',
              subtitle: 'Agrega tu primera clase para comenzar',
            )
          else
            _buildClassOverviewCard(),
          
          const SizedBox(height: 24),
          
          // Accesos Rápidos
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Accesos Rápidos',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: _buildQuickAccessCard(
                        icon: Icons.calendar_today,
                        title: 'Horario',
                        color: Colors.purple,
                        onTap: () {
                          setState(() {
                            _activeSection = 'timetable';
                          });
                        },
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildQuickAccessCard(
                        icon: Icons.library_books,
                        title: 'Materiales',
                        color: Colors.green,
                        onTap: () {
                          setState(() {
                            _activeSection = 'materials';
                          });
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: _buildQuickAccessCard(
                        icon: Icons.description,
                        title: 'Notas',
                        color: Colors.orange,
                        onTap: () {},
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildQuickAccessCard(
                        icon: Icons.people,
                        title: 'Compañeros',
                        color: Colors.blue,
                        onTap: () {},
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

  Widget _buildClassOverviewCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.purple.withOpacity(0.3), width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.purple.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.book, size: 24, color: Colors.purple),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _classOverview['course'] ?? 'Sin nombre',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.green,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'Activa',
                        style: TextStyle(
                          fontSize: 10,
                          color: AppTheme.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (_classOverview['time'] != null)
            _buildClassDetailItem(
              Icons.access_time,
              _classOverview['time'] ?? 'Horario no definido',
            ),
          if (_classOverview['location'] != null)
            _buildClassDetailItem(
              Icons.location_on,
              _classOverview['location'] ?? 'Ubicación no definida',
            ),
          if (_classOverview['instructor'] != null)
            _buildClassDetailItem(
              Icons.person,
              _classOverview['instructor'] ?? '',
            ),
          if (_classOverview['contactInfo'] != null)
            _buildClassDetailItem(
              Icons.contact_mail,
              _classOverview['contactInfo'] ?? '',
            ),
          if (_classOverview['officeHours'] != null)
            _buildClassDetailItem(
              Icons.schedule,
              _classOverview['officeHours'] ?? '',
            ),
          if (_classOverview['targetGrade'] != null || _classOverview['actualGrade'] != null) ...[
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.purple.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.purple.withOpacity(0.3)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  if (_classOverview['targetGrade'] != null)
                    Column(
                      children: [
                        const Text(
                          'Objetivo',
                          style: TextStyle(
                            fontSize: 11,
                            color: AppTheme.white60,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _classOverview['targetGrade'],
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.purple,
                          ),
                        ),
                      ],
                    ),
                  if (_classOverview['targetGrade'] != null && _classOverview['actualGrade'] != null)
                    Container(
                      width: 1,
                      height: 40,
                      color: AppTheme.white.withOpacity(0.2),
                    ),
                  if (_classOverview['actualGrade'] != null)
                    Column(
                      children: [
                        const Text(
                          'Actual',
                          style: TextStyle(
                            fontSize: 11,
                            color: AppTheme.white60,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _classOverview['actualGrade'],
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.green,
                          ),
                        ),
                      ],
                    ),
                ],
              ),
            ),
          ],
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    setState(() {
                      _currentModalType = 'class-overview';
                      _courseNameController.text = _classOverview['course'] ?? '';
                      _courseTimeController.text = _classOverview['time'] ?? '';
                      _courseLocationController.text = _classOverview['location'] ?? '';
                      _courseInstructorController.text = _classOverview['instructor'] ?? '';
                      _courseContactInfoController.text = _classOverview['contactInfo'] ?? '';
                      _courseOfficeHoursController.text = _classOverview['officeHours'] ?? '';
                      _courseAccessAccountController.text = _classOverview['account'] ?? '';
                      _courseAccessLoginController.text = _classOverview['login'] ?? '';
                      _courseAccessPasswordController.text = _classOverview['password'] ?? '';
                      _courseNotesController.text = _classOverview['notes'] ?? '';
                      _courseTargetGradeController.text = _classOverview['targetGrade'] ?? '';
                      _courseActualGradeController.text = _classOverview['actualGrade'] ?? '';
                      _importantDates = _classOverview['importantDates'] != null 
                          ? List<Map<String, dynamic>>.from(_classOverview['importantDates'])
                          : [];
                      _gradingComponents = _classOverview['gradingComponents'] != null
                          ? List<Map<String, dynamic>>.from(_classOverview['gradingComponents'])
                          : [];
                      _showAddClassOverviewModal = true;
                    });
                  },
                  icon: const Icon(Icons.edit, size: 16),
                  label: const Text('Editar'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.purple.withOpacity(0.2),
                    foregroundColor: Colors.purple,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.visibility, size: 16),
                  label: const Text('Ver Detalles'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green.withOpacity(0.2),
                    foregroundColor: Colors.green,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildClassDetailItem(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(icon, size: 14, color: AppTheme.white60),
          const SizedBox(width: 8),
          Text(
            text,
            style: const TextStyle(fontSize: 13, color: AppTheme.white70),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickAccessCard({
    required IconData icon,
    required String title,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.darkBackground,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.3), width: 1),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Container(
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Icon(icon, size: 48, color: AppTheme.white40),
          const SizedBox(height: 16),
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
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
      ),
    );
  }

  // ==================== MODALES ====================
  
  Widget _buildAddClassModal() {
    return AlertDialog(
      backgroundColor: AppTheme.darkSurface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      title: const Text('Agregar Nueva Clase', style: TextStyle(color: AppTheme.white)),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _classSubjectController,
              decoration: const InputDecoration(
                labelText: 'Materia *',
                labelStyle: TextStyle(color: AppTheme.white70),
              ),
              style: const TextStyle(color: AppTheme.white),
            ),
            const SizedBox(height: 16),
            // Selector de día
            const Text('Día de la semana *', style: TextStyle(color: AppTheme.white70)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: _weekDays.map((day) {
                final isSelected = _selectedClassDay == day;
                return ChoiceChip(
                  label: Text(day),
                  selected: isSelected,
                  onSelected: (selected) {
                    if (selected) setState(() => _selectedClassDay = day);
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
            // Selector de hora
            const Text('Hora *', style: TextStyle(color: AppTheme.white70)),
            const SizedBox(height: 8),
            SizedBox(
              height: 120,
              child: ListView.builder(
                itemCount: _timeSlots.length,
                itemBuilder: (context, index) {
                  final time = _timeSlots[index];
                  final isSelected = _selectedClassTime == time;
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: ChoiceChip(
                      label: Text(time),
                      selected: isSelected,
                      onSelected: (selected) {
                        if (selected) setState(() => _selectedClassTime = time);
                      },
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _classClassroomController,
              decoration: const InputDecoration(
                labelText: 'Aula',
                labelStyle: TextStyle(color: AppTheme.white70),
              ),
              style: const TextStyle(color: AppTheme.white),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _classProfessorController,
              decoration: const InputDecoration(
                labelText: 'Profesor',
                labelStyle: TextStyle(color: AppTheme.white70),
              ),
              style: const TextStyle(color: AppTheme.white),
            ),
            const SizedBox(height: 16),
            // Selector de duración
            const Text('Duración (minutos)', style: TextStyle(color: AppTheme.white70)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: ['30', '60', '90', '120'].map((duration) {
                final isSelected = _selectedClassDuration == duration;
                return ChoiceChip(
                  label: Text('$duration min'),
                  selected: isSelected,
                  onSelected: (selected) {
                    if (selected) setState(() => _selectedClassDuration = duration);
                  },
                );
              }).toList(),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            setState(() {
              _showAddClassModal = false;
              _classSubjectController.clear();
              _classClassroomController.clear();
              _classProfessorController.clear();
            });
            Navigator.pop(context);
          },
          child: const Text('Cancelar'),
        ),
        ElevatedButton(
          onPressed: () {
            if (_classSubjectController.text.isNotEmpty) {
              setState(() {
                _classes.add(ClassSchedule(
                  id: DateTime.now().millisecondsSinceEpoch.toString(),
                  subject: _classSubjectController.text,
                  day: _selectedClassDay,
                  time: _selectedClassTime,
                  classroom: _classClassroomController.text.isNotEmpty 
                      ? _classClassroomController.text 
                      : null,
                  professor: _classProfessorController.text.isNotEmpty
                      ? _classProfessorController.text
                      : null,
                  duration: int.parse(_selectedClassDuration),
                ));
                _showAddClassModal = false;
                _classSubjectController.clear();
                _classClassroomController.clear();
                _classProfessorController.clear();
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Clase agregada')),
              );
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Por favor completa todos los campos obligatorios')),
              );
            }
          },
          style: ElevatedButton.styleFrom(backgroundColor: Colors.purple),
          child: const Text('Agregar Clase'),
        ),
      ],
    );
  }

  Widget _buildAddTaskModal() {
    return AlertDialog(
      backgroundColor: AppTheme.darkSurface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      title: const Text('Nueva Tarea Académica', style: TextStyle(color: AppTheme.white)),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _taskController,
              decoration: const InputDecoration(
                labelText: 'Tarea *',
                labelStyle: TextStyle(color: AppTheme.white70),
              ),
              style: const TextStyle(color: AppTheme.white),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _taskSubjectController,
              decoration: const InputDecoration(
                labelText: 'Materia',
                labelStyle: TextStyle(color: AppTheme.white70),
              ),
              style: const TextStyle(color: AppTheme.white),
            ),
            const SizedBox(height: 16),
            // Selector de fecha
            ListTile(
              title: const Text('Fecha de entrega *', style: TextStyle(color: AppTheme.white70)),
              subtitle: Text(
                _selectedTaskDate != null 
                    ? DateFormat('dd/MM/yyyy').format(_selectedTaskDate!)
                    : 'Seleccionar fecha',
                style: const TextStyle(color: AppTheme.white),
              ),
              trailing: const Icon(Icons.calendar_today, color: Colors.purple),
              onTap: () async {
                final date = await showDatePicker(
                  context: context,
                  initialDate: DateTime.now(),
                  firstDate: DateTime.now(),
                  lastDate: DateTime.now().add(const Duration(days: 365)),
                );
                if (date != null) {
                  setState(() => _selectedTaskDate = date);
                }
              },
            ),
            const SizedBox(height: 16),
            // Selector de prioridad
            const Text('Prioridad', style: TextStyle(color: AppTheme.white70)),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: ChoiceChip(
                    label: const Text('Baja'),
                    selected: _selectedTaskPriority == 'low',
                    onSelected: (selected) {
                      if (selected) setState(() => _selectedTaskPriority = 'low');
                    },
                    selectedColor: Colors.green.withOpacity(0.3),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ChoiceChip(
                    label: const Text('Media'),
                    selected: _selectedTaskPriority == 'medium',
                    onSelected: (selected) {
                      if (selected) setState(() => _selectedTaskPriority = 'medium');
                    },
                    selectedColor: Colors.orange.withOpacity(0.3),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ChoiceChip(
                    label: const Text('Alta'),
                    selected: _selectedTaskPriority == 'high',
                    onSelected: (selected) {
                      if (selected) setState(() => _selectedTaskPriority = 'high');
                    },
                    selectedColor: Colors.red.withOpacity(0.3),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Tiempo estimado
            const Text('Tiempo estimado', style: TextStyle(color: AppTheme.white70)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: ['30 min', '1 hora', '2 horas', '3 horas', '4+ horas'].map((time) {
                final isSelected = _selectedTaskTime == time;
                return ChoiceChip(
                  label: Text(time),
                  selected: isSelected,
                  onSelected: (selected) {
                    if (selected) setState(() => _selectedTaskTime = time);
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _taskNotesController,
              decoration: const InputDecoration(
                labelText: 'Notas adicionales',
                labelStyle: TextStyle(color: AppTheme.white70),
              ),
              style: const TextStyle(color: AppTheme.white),
              maxLines: 3,
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            setState(() {
              _showAddTaskModal = false;
              _taskController.clear();
              _taskSubjectController.clear();
              _taskNotesController.clear();
              _selectedTaskDate = null;
            });
            Navigator.pop(context);
          },
          child: const Text('Cancelar'),
        ),
        ElevatedButton(
          onPressed: () {
            if (_taskController.text.isNotEmpty && _selectedTaskDate != null) {
              setState(() {
                _academicTasks.add(AcademicTask(
                  id: DateTime.now().millisecondsSinceEpoch.toString(),
                  task: _taskController.text,
                  date: _selectedTaskDate!,
                  completed: false,
                  notes: _taskNotesController.text.isNotEmpty ? _taskNotesController.text : null,
                  priority: _selectedTaskPriority,
                  subject: _taskSubjectController.text.isNotEmpty ? _taskSubjectController.text : null,
                  estimatedTime: _selectedTaskTime,
                ));
                _showAddTaskModal = false;
                _taskController.clear();
                _taskSubjectController.clear();
                _taskNotesController.clear();
                _selectedTaskDate = null;
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Tarea agregada')),
              );
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Por favor completa los campos obligatorios')),
              );
            }
          },
          style: ElevatedButton.styleFrom(backgroundColor: Colors.purple),
          child: const Text('Agregar Tarea'),
        ),
      ],
    );
  }

  Widget _buildAddProjectModal() {
    return StatefulBuilder(
      builder: (context, setModalState) => AlertDialog(
        backgroundColor: AppTheme.darkSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('Nuevo Proyecto Grupal', style: TextStyle(color: AppTheme.white)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _projectTitleController,
                decoration: const InputDecoration(
                  labelText: 'Título del Proyecto *',
                  labelStyle: TextStyle(color: AppTheme.white70),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _projectObjectiveController,
                decoration: const InputDecoration(
                  labelText: 'Objetivo *',
                  labelStyle: TextStyle(color: AppTheme.white70),
                ),
                style: const TextStyle(color: AppTheme.white),
                maxLines: 3,
              ),
              const SizedBox(height: 16),
              ListTile(
                title: const Text('Fecha de inicio *', style: TextStyle(color: AppTheme.white70)),
                subtitle: Text(
                  _selectedProjectStartDate != null 
                      ? DateFormat('dd/MM/yyyy').format(_selectedProjectStartDate!)
                      : 'Seleccionar fecha',
                  style: const TextStyle(color: AppTheme.white),
                ),
                trailing: const Icon(Icons.calendar_today, color: Colors.purple),
                onTap: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate: DateTime.now(),
                    firstDate: DateTime.now().subtract(const Duration(days: 365)),
                    lastDate: DateTime.now().add(const Duration(days: 730)),
                  );
                  if (date != null) {
                    setModalState(() => _selectedProjectStartDate = date);
                  }
                },
              ),
              ListTile(
                title: const Text('Fecha de finalización *', style: TextStyle(color: AppTheme.white70)),
                subtitle: Text(
                  _selectedProjectEndDate != null 
                      ? DateFormat('dd/MM/yyyy').format(_selectedProjectEndDate!)
                      : 'Seleccionar fecha',
                  style: const TextStyle(color: AppTheme.white),
                ),
                trailing: const Icon(Icons.calendar_today, color: Colors.purple),
                onTap: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate: _selectedProjectStartDate ?? DateTime.now(),
                    firstDate: _selectedProjectStartDate ?? DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 730)),
                  );
                  if (date != null) {
                    setModalState(() => _selectedProjectEndDate = date);
                  }
                },
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _projectResourcesController,
                decoration: const InputDecoration(
                  labelText: 'Recursos',
                  labelStyle: TextStyle(color: AppTheme.white70),
                ),
                style: const TextStyle(color: AppTheme.white),
                maxLines: 2,
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _projectIdeasController,
                decoration: const InputDecoration(
                  labelText: 'Ideas',
                  labelStyle: TextStyle(color: AppTheme.white70),
                ),
                style: const TextStyle(color: AppTheme.white),
                maxLines: 2,
              ),
              const SizedBox(height: 16),
              // Pasos de acción
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Pasos de Acción', style: TextStyle(color: AppTheme.white70)),
                  IconButton(
                    onPressed: () {
                      if (_projectStepController.text.isNotEmpty) {
                        setModalState(() {
                          _projectActionSteps.add({
                            'id': DateTime.now().millisecondsSinceEpoch.toString(),
                            'text': _projectStepController.text,
                            'completed': false,
                          });
                          _projectStepController.clear();
                        });
                      }
                    },
                    icon: const Icon(Icons.add_circle, color: Colors.purple),
                  ),
                ],
              ),
              TextField(
                controller: _projectStepController,
                decoration: const InputDecoration(
                  hintText: 'Agregar paso de acción',
                  hintStyle: TextStyle(color: AppTheme.white40),
                ),
                style: const TextStyle(color: AppTheme.white),
                onSubmitted: (value) {
                  if (value.isNotEmpty) {
                    setModalState(() {
                      _projectActionSteps.add({
                        'id': DateTime.now().millisecondsSinceEpoch.toString(),
                        'text': value,
                        'completed': false,
                      });
                      _projectStepController.clear();
                    });
                  }
                },
              ),
              if (_projectActionSteps.isNotEmpty) ...[
                const SizedBox(height: 8),
                ..._projectActionSteps.map((step) => ListTile(
                  leading: IconButton(
                    onPressed: () {
                      setModalState(() {
                        _projectActionSteps = _projectActionSteps.where((s) => s['id'] != step['id']).toList();
                      });
                    },
                    icon: const Icon(Icons.delete, color: Colors.red, size: 20),
                  ),
                  title: Text(
                    step['text'] as String,
                    style: const TextStyle(fontSize: 14, color: AppTheme.white),
                  ),
                )),
              ],
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                _showAddProjectModal = false;
                _projectTitleController.clear();
                _projectObjectiveController.clear();
                _projectResourcesController.clear();
                _projectIdeasController.clear();
                _projectActionSteps = [];
                _selectedProjectStartDate = null;
                _selectedProjectEndDate = null;
              });
              Navigator.pop(context);
            },
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              if (_projectTitleController.text.isNotEmpty && 
                  _projectObjectiveController.text.isNotEmpty &&
                  _selectedProjectStartDate != null &&
                  _selectedProjectEndDate != null) {
                setState(() {
                  _groupProjects.add(GroupProject(
                    id: DateTime.now().millisecondsSinceEpoch.toString(),
                    title: _projectTitleController.text,
                    objective: _projectObjectiveController.text,
                    startDate: _selectedProjectStartDate!,
                    endDate: _selectedProjectEndDate!,
                    resources: _projectResourcesController.text.isNotEmpty 
                        ? _projectResourcesController.text 
                        : null,
                    ideas: _projectIdeasController.text.isNotEmpty
                        ? _projectIdeasController.text
                        : null,
                    actionSteps: _projectActionSteps.map((step) => ActionStep(
                      id: step['id'] as String,
                      text: step['text'] as String,
                      completed: step['completed'] as bool,
                    )).toList(),
                  ));
                  _showAddProjectModal = false;
                  _projectTitleController.clear();
                  _projectObjectiveController.clear();
                  _projectResourcesController.clear();
                  _projectIdeasController.clear();
                  _projectActionSteps = [];
                  _selectedProjectStartDate = null;
                  _selectedProjectEndDate = null;
                });
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Proyecto agregado')),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Por favor completa todos los campos obligatorios')),
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.purple),
            child: const Text('Agregar Proyecto'),
          ),
        ],
      ),
    );
  }

  Widget _buildAddExamModal() {
    return StatefulBuilder(
      builder: (context, setModalState) => AlertDialog(
        backgroundColor: AppTheme.darkSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('Nuevo Examen', style: TextStyle(color: AppTheme.white)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _examTopicController,
                decoration: const InputDecoration(
                  labelText: 'Tema del Examen *',
                  labelStyle: TextStyle(color: AppTheme.white70),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              ListTile(
                title: const Text('Fecha del Examen *', style: TextStyle(color: AppTheme.white70)),
                subtitle: Text(
                  _selectedExamDate != null 
                      ? DateFormat('dd/MM/yyyy').format(_selectedExamDate!)
                      : 'Seleccionar fecha',
                  style: const TextStyle(color: AppTheme.white),
                ),
                trailing: const Icon(Icons.calendar_today, color: Colors.purple),
                onTap: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate: DateTime.now(),
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                  );
                  if (date != null) {
                    setModalState(() => _selectedExamDate = date);
                  }
                },
              ),
              const SizedBox(height: 16),
              // Tareas de preparación
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Tareas de Preparación', style: TextStyle(color: AppTheme.white70)),
                  IconButton(
                    onPressed: () {
                      if (_examTodoController.text.isNotEmpty) {
                        setModalState(() {
                          _examTodos.add({
                            'id': DateTime.now().millisecondsSinceEpoch.toString(),
                            'text': _examTodoController.text,
                            'completed': false,
                          });
                          _examTodoController.clear();
                        });
                      }
                    },
                    icon: const Icon(Icons.add_circle, color: Colors.purple),
                  ),
                ],
              ),
              TextField(
                controller: _examTodoController,
                decoration: const InputDecoration(
                  hintText: 'Agregar tarea de preparación',
                  hintStyle: TextStyle(color: AppTheme.white40),
                ),
                style: const TextStyle(color: AppTheme.white),
                onSubmitted: (value) {
                  if (value.isNotEmpty) {
                    setModalState(() {
                      _examTodos.add({
                        'id': DateTime.now().millisecondsSinceEpoch.toString(),
                        'text': value,
                        'completed': false,
                      });
                      _examTodoController.clear();
                    });
                  }
                },
              ),
              if (_examTodos.isNotEmpty) ...[
                const SizedBox(height: 8),
                ..._examTodos.map((todo) => ListTile(
                  leading: IconButton(
                    onPressed: () {
                      setModalState(() {
                        _examTodos = _examTodos.where((t) => t['id'] != todo['id']).toList();
                      });
                    },
                    icon: const Icon(Icons.delete, color: Colors.red, size: 20),
                  ),
                  title: Text(
                    todo['text'] as String,
                    style: const TextStyle(fontSize: 14, color: AppTheme.white),
                  ),
                )),
              ],
              const SizedBox(height: 16),
              TextField(
                controller: _examNotesController,
                decoration: const InputDecoration(
                  labelText: 'Notas de Estudio',
                  labelStyle: TextStyle(color: AppTheme.white70),
                ),
                style: const TextStyle(color: AppTheme.white),
                maxLines: 3,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                _showAddExamModal = false;
                _examTopicController.clear();
                _examNotesController.clear();
                _examTodos = [];
                _selectedExamDate = null;
              });
              Navigator.pop(context);
            },
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              if (_examTopicController.text.isNotEmpty && _selectedExamDate != null) {
                setState(() {
                  _examRevisions.add(ExamRevision(
                    id: DateTime.now().millisecondsSinceEpoch.toString(),
                    topic: _examTopicController.text,
                    date: _selectedExamDate!,
                    todos: _examTodos.map((todo) => ExamTodo(
                      id: todo['id'] as String,
                      text: todo['text'] as String,
                      completed: todo['completed'] as bool,
                    )).toList(),
                    notes: _examNotesController.text.isNotEmpty ? _examNotesController.text : null,
                  ));
                  _showAddExamModal = false;
                  _examTopicController.clear();
                  _examNotesController.clear();
                  _examTodos = [];
                  _selectedExamDate = null;
                });
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Examen agregado')),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Por favor completa todos los campos obligatorios')),
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.purple),
            child: const Text('Agregar Examen'),
          ),
        ],
      ),
    );
  }

  Widget _buildAddMaterialModal() {
    final TextEditingController titleController = TextEditingController();
    final TextEditingController authorController = TextEditingController();
    final TextEditingController notesController = TextEditingController();
    
    return AlertDialog(
      backgroundColor: AppTheme.darkSurface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      title: Text(
        _currentModalType == 'textbook' 
            ? 'Agregar Libro de Texto'
            : _currentModalType == 'online'
                ? 'Agregar Recurso Online'
                : 'Agregar Referencia',
        style: const TextStyle(color: AppTheme.white),
      ),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (_currentModalType == 'textbook') ...[
              TextField(
                controller: titleController,
                decoration: const InputDecoration(
                  labelText: 'Título del Libro *',
                  labelStyle: TextStyle(color: AppTheme.white70),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: authorController,
                decoration: const InputDecoration(
                  labelText: 'Autor',
                  labelStyle: TextStyle(color: AppTheme.white70),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
            ] else if (_currentModalType == 'online') ...[
              TextField(
                controller: titleController,
                decoration: const InputDecoration(
                  labelText: 'Sitio Web *',
                  labelStyle: TextStyle(color: AppTheme.white70),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: authorController,
                decoration: const InputDecoration(
                  labelText: 'Usuario/Login',
                  labelStyle: TextStyle(color: AppTheme.white70),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
            ] else ...[
              TextField(
                controller: titleController,
                decoration: const InputDecoration(
                  labelText: 'Cita/Referencia *',
                  labelStyle: TextStyle(color: AppTheme.white70),
                ),
                style: const TextStyle(color: AppTheme.white),
                maxLines: 3,
              ),
              const SizedBox(height: 16),
              TextField(
                controller: authorController,
                decoration: const InputDecoration(
                  labelText: 'Libro/Autor',
                  labelStyle: TextStyle(color: AppTheme.white70),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
            ],
            const SizedBox(height: 16),
            TextField(
              controller: notesController,
              decoration: const InputDecoration(
                labelText: 'Notas',
                labelStyle: TextStyle(color: AppTheme.white70),
              ),
              style: const TextStyle(color: AppTheme.white),
              maxLines: 2,
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () {
            titleController.dispose();
            authorController.dispose();
            notesController.dispose();
            setState(() => _showAddMaterialModal = false);
            Navigator.pop(context);
          },
          child: const Text('Cancelar'),
        ),
        ElevatedButton(
          onPressed: () {
            if (titleController.text.isNotEmpty) {
              setState(() {
                Map<String, dynamic> material;
                
                if (_currentModalType == 'textbook') {
                  material = {
                    'id': DateTime.now().millisecondsSinceEpoch.toString(),
                    'title': titleController.text,
                    'author': authorController.text.isNotEmpty ? authorController.text : null,
                    'notes': notesController.text.isNotEmpty ? notesController.text : null,
                  };
                  _textbooks.add(material);
                } else if (_currentModalType == 'online') {
                  material = {
                    'id': DateTime.now().millisecondsSinceEpoch.toString(),
                    'website': titleController.text,
                    'login': authorController.text.isNotEmpty ? authorController.text : null,
                    'notes': notesController.text.isNotEmpty ? notesController.text : null,
                  };
                  _onlineResources.add(material);
                } else {
                  material = {
                    'id': DateTime.now().millisecondsSinceEpoch.toString(),
                    'quote': titleController.text,
                    'book': authorController.text.isNotEmpty ? authorController.text : null,
                    'notes': notesController.text.isNotEmpty ? notesController.text : null,
                  };
                  _references.add(material);
                }
                
                _showAddMaterialModal = false;
              });
              titleController.dispose();
              authorController.dispose();
              notesController.dispose();
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Material agregado')),
              );
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Por favor completa el título')),
              );
            }
          },
          style: ElevatedButton.styleFrom(backgroundColor: Colors.purple),
          child: const Text('Agregar'),
        ),
      ],
    );
  }

  Widget _buildAddClassOverviewModal() {
    return StatefulBuilder(
      builder: (context, setModalState) => AlertDialog(
        backgroundColor: AppTheme.darkSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('Resumen de Clase', style: TextStyle(color: AppTheme.white)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Información Básica
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.purple.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.purple.withOpacity(0.3)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.info_outline, color: Colors.purple, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Información Básica',
                      style: TextStyle(
                        color: Colors.purple,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseNameController,
                decoration: const InputDecoration(
                  labelText: 'Nombre del Curso *',
                  labelStyle: TextStyle(color: AppTheme.white70),
                  prefixIcon: Icon(Icons.school, color: Colors.purple),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseTimeController,
                decoration: const InputDecoration(
                  labelText: 'Horario',
                  labelStyle: TextStyle(color: AppTheme.white70),
                  prefixIcon: Icon(Icons.access_time, color: Colors.purple),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseLocationController,
                decoration: const InputDecoration(
                  labelText: 'Ubicación',
                  labelStyle: TextStyle(color: AppTheme.white70),
                  prefixIcon: Icon(Icons.location_on, color: Colors.purple),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseInstructorController,
                decoration: const InputDecoration(
                  labelText: 'Instructor',
                  labelStyle: TextStyle(color: AppTheme.white70),
                  prefixIcon: Icon(Icons.person, color: Colors.purple),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseContactInfoController,
                decoration: const InputDecoration(
                  labelText: 'Información de Contacto',
                  labelStyle: TextStyle(color: AppTheme.white70),
                  prefixIcon: Icon(Icons.contact_mail, color: Colors.purple),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseOfficeHoursController,
                decoration: const InputDecoration(
                  labelText: 'Horario de Atención',
                  labelStyle: TextStyle(color: AppTheme.white70),
                  prefixIcon: Icon(Icons.schedule, color: Colors.purple),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 24),
              
              // Información de Acceso
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.orange.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.orange.withOpacity(0.3)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.lock_outline, color: Colors.orange, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Información de Acceso',
                      style: TextStyle(
                        color: Colors.orange,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseAccessAccountController,
                decoration: const InputDecoration(
                  labelText: 'Cuenta/Plataforma',
                  labelStyle: TextStyle(color: AppTheme.white70),
                  prefixIcon: Icon(Icons.account_circle, color: Colors.orange),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseAccessLoginController,
                decoration: const InputDecoration(
                  labelText: 'Usuario/Login',
                  labelStyle: TextStyle(color: AppTheme.white70),
                  prefixIcon: Icon(Icons.person_outline, color: Colors.orange),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseAccessPasswordController,
                decoration: const InputDecoration(
                  labelText: 'Contraseña',
                  labelStyle: TextStyle(color: AppTheme.white70),
                  prefixIcon: Icon(Icons.lock, color: Colors.orange),
                ),
                obscureText: true,
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 24),
              
              // Fechas Importantes
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.green.withOpacity(0.3)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.calendar_today, color: Colors.green, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'Fechas Importantes',
                          style: TextStyle(
                            color: Colors.green,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      onPressed: () {
                        if (_importantDateController.text.isNotEmpty) {
                          setModalState(() {
                            _importantDates.add({
                              'id': DateTime.now().millisecondsSinceEpoch.toString(),
                              'description': _importantDateController.text,
                              'date': DateTime.now(),
                            });
                            _importantDateController.clear();
                          });
                        }
                      },
                      icon: const Icon(Icons.add_circle, color: Colors.green),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _importantDateController,
                decoration: const InputDecoration(
                  hintText: 'Descripción de la fecha importante',
                  hintStyle: TextStyle(color: AppTheme.white40),
                  prefixIcon: Icon(Icons.event, color: Colors.green),
                ),
                style: const TextStyle(color: AppTheme.white),
                onSubmitted: (value) {
                  if (value.isNotEmpty) {
                    setModalState(() {
                      _importantDates.add({
                        'id': DateTime.now().millisecondsSinceEpoch.toString(),
                        'description': value,
                        'date': DateTime.now(),
                      });
                      _importantDateController.clear();
                    });
                  }
                },
              ),
              if (_importantDates.isNotEmpty) ...[
                const SizedBox(height: 8),
                ..._importantDates.map((date) => ListTile(
                  leading: const Icon(Icons.event, color: Colors.green, size: 20),
                  title: Text(
                    date['description'],
                    style: const TextStyle(color: AppTheme.white, fontSize: 14),
                  ),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete, color: Colors.red, size: 18),
                    onPressed: () {
                      setModalState(() {
                        _importantDates = _importantDates.where((d) => d['id'] != date['id']).toList();
                      });
                    },
                  ),
                )),
              ],
              const SizedBox(height: 24),
              
              // Componentes de Calificación
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.blue.withOpacity(0.3)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.grade, color: Colors.blue, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'Componentes de Calificación',
                          style: TextStyle(
                            color: Colors.blue,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    IconButton(
                      onPressed: () {
                        if (_gradingComponentNameController.text.isNotEmpty) {
                          setModalState(() {
                            _gradingComponents.add({
                              'id': DateTime.now().millisecondsSinceEpoch.toString(),
                              'name': _gradingComponentNameController.text,
                              'weight': _gradingComponentWeightController.text.isNotEmpty 
                                  ? _gradingComponentWeightController.text 
                                  : '0%',
                            });
                            _gradingComponentNameController.clear();
                            _gradingComponentWeightController.clear();
                          });
                        }
                      },
                      icon: const Icon(Icons.add_circle, color: Colors.blue),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: TextField(
                      controller: _gradingComponentNameController,
                      decoration: const InputDecoration(
                        hintText: 'Nombre del componente',
                        hintStyle: TextStyle(color: AppTheme.white40),
                        prefixIcon: Icon(Icons.description, color: Colors.blue),
                      ),
                      style: const TextStyle(color: AppTheme.white),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    flex: 2,
                    child: TextField(
                      controller: _gradingComponentWeightController,
                      decoration: const InputDecoration(
                        hintText: 'Peso (%)',
                        hintStyle: TextStyle(color: AppTheme.white40),
                        prefixIcon: Icon(Icons.percent, color: Colors.blue),
                      ),
                      keyboardType: TextInputType.number,
                      style: const TextStyle(color: AppTheme.white),
                    ),
                  ),
                ],
              ),
              if (_gradingComponents.isNotEmpty) ...[
                const SizedBox(height: 8),
                ..._gradingComponents.map((component) => ListTile(
                  leading: const Icon(Icons.check_circle_outline, color: Colors.blue, size: 20),
                  title: Text(
                    component['name'],
                    style: const TextStyle(color: AppTheme.white, fontSize: 14),
                  ),
                  subtitle: Text(
                    'Peso: ${component['weight']}',
                    style: const TextStyle(color: AppTheme.white60, fontSize: 12),
                  ),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete, color: Colors.red, size: 18),
                    onPressed: () {
                      setModalState(() {
                        _gradingComponents = _gradingComponents.where((c) => c['id'] != component['id']).toList();
                      });
                    },
                  ),
                )),
              ],
              const SizedBox(height: 24),
              
              // Calificaciones
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.purple.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.purple.withOpacity(0.3)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.star, color: Colors.purple, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Calificaciones',
                      style: TextStyle(
                        color: Colors.purple,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _courseTargetGradeController,
                      decoration: const InputDecoration(
                        labelText: 'Calificación Objetivo',
                        labelStyle: TextStyle(color: AppTheme.white70),
                        prefixIcon: Icon(Icons.track_changes, color: Colors.purple),
                      ),
                      keyboardType: TextInputType.number,
                      style: const TextStyle(color: AppTheme.white),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextField(
                      controller: _courseActualGradeController,
                      decoration: const InputDecoration(
                        labelText: 'Calificación Actual',
                        labelStyle: TextStyle(color: AppTheme.white70),
                        prefixIcon: Icon(Icons.check_circle, color: Colors.purple),
                      ),
                      keyboardType: TextInputType.number,
                      style: const TextStyle(color: AppTheme.white),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              
              // Notas
              TextField(
                controller: _courseNotesController,
                decoration: const InputDecoration(
                  labelText: 'Notas Adicionales',
                  labelStyle: TextStyle(color: AppTheme.white70),
                  prefixIcon: Icon(Icons.note, color: Colors.purple),
                ),
                style: const TextStyle(color: AppTheme.white),
                maxLines: 4,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                _showAddClassOverviewModal = false;
                _courseNameController.clear();
                _courseTimeController.clear();
                _courseLocationController.clear();
                _courseInstructorController.clear();
                _courseContactInfoController.clear();
                _courseOfficeHoursController.clear();
                _courseAccessAccountController.clear();
                _courseAccessLoginController.clear();
                _courseAccessPasswordController.clear();
                _courseNotesController.clear();
                _courseTargetGradeController.clear();
                _courseActualGradeController.clear();
                _importantDates = [];
                _gradingComponents = [];
                _importantDateController.clear();
                _gradingComponentNameController.clear();
                _gradingComponentWeightController.clear();
              });
              Navigator.pop(context);
            },
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              if (_courseNameController.text.isNotEmpty) {
                setState(() {
                  _classOverview = {
                    'course': _courseNameController.text,
                    'time': _courseTimeController.text.isNotEmpty ? _courseTimeController.text : null,
                    'location': _courseLocationController.text.isNotEmpty ? _courseLocationController.text : null,
                    'instructor': _courseInstructorController.text.isNotEmpty ? _courseInstructorController.text : null,
                    'contactInfo': _courseContactInfoController.text.isNotEmpty ? _courseContactInfoController.text : null,
                    'officeHours': _courseOfficeHoursController.text.isNotEmpty ? _courseOfficeHoursController.text : null,
                    'accessInfo': _courseAccessAccountController.text.isNotEmpty ? _courseAccessAccountController.text : null,
                    'account': _courseAccessAccountController.text.isNotEmpty ? _courseAccessAccountController.text : null,
                    'login': _courseAccessLoginController.text.isNotEmpty ? _courseAccessLoginController.text : null,
                    'password': _courseAccessPasswordController.text.isNotEmpty ? _courseAccessPasswordController.text : null,
                    'notes': _courseNotesController.text.isNotEmpty ? _courseNotesController.text : null,
                    'targetGrade': _courseTargetGradeController.text.isNotEmpty ? _courseTargetGradeController.text : null,
                    'actualGrade': _courseActualGradeController.text.isNotEmpty ? _courseActualGradeController.text : null,
                    'importantDates': List<Map<String, dynamic>>.from(_importantDates),
                    'gradingComponents': List<Map<String, dynamic>>.from(_gradingComponents),
                  };
                  _showAddClassOverviewModal = false;
                });
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Clase guardada')),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Por favor ingresa el nombre del curso')),
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.purple),
            child: const Text('Guardar'),
          ),
        ],
      ),
    );
  }
}
