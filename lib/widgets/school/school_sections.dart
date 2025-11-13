import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../models/school/class_schedule.dart';
import '../../models/school/academic_task.dart';
import '../../models/school/group_project.dart';
import '../../models/school/exam_revision.dart';
import '../../auth/providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../../theme/context_ext.dart';
import '../../theme/spacing.dart';
import '../../theme/shadows.dart';
import '../../theme/radius.dart';
import '../../services/class_schedule_service.dart';
import '../../services/event_service.dart';
import '../../services/task_service.dart';
import '../../models/event/event_organization.dart';
import '../../models/calendar/calendar_task.dart';
import '../../models/school/academic_task.dart';
import '../common/navigation_header.dart';

class SchoolSections extends StatefulWidget {
  const SchoolSections({super.key});

  @override
  State<SchoolSections> createState() => _SchoolSectionsState();
}

class _SchoolSectionsState extends State<SchoolSections> {
  String _activeSection = 'timetable';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  
  // Servicios
  final ClassScheduleService _classScheduleService = ClassScheduleService();
  final EventService _eventService = EventService();
  final TaskService _taskService = TaskService();
  
  // Estados para datos
  List<ClassSchedule> _classes = [];
  bool _isLoadingClasses = false;
  bool _classesLoaded = false; // Bandera para evitar múltiples cargas
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
  int? _editingMaterialIndex;
  
  // Controladores para formularios
  final TextEditingController _classSubjectController = TextEditingController();
  final TextEditingController _classClassroomController = TextEditingController();
  final TextEditingController _classProfessorController = TextEditingController();
  final TextEditingController _classLinkController = TextEditingController();
  List<String> _selectedClassDays = []; // Lista para selección múltiple de días
  String _selectedClassTime = '7:00 AM';
  String _selectedClassDuration = '60';
  
  final TextEditingController _taskController = TextEditingController();
  final TextEditingController _taskSubjectController = TextEditingController();
  final TextEditingController _taskNotesController = TextEditingController();
  DateTime? _selectedTaskDate;
  String _selectedTaskPriority = 'medium';
  String? _selectedTaskTime = '1 hora';
  
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
  final TextEditingController _courseNotesUrlController = TextEditingController();
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
  void initState() {
    super.initState();
    _loadClasses();
    _syncPersonalTasksToAcademicTasks(); // Sincronizar tareas personales de escuela
  }

  // Función helper para convertir día de la semana a fecha (próxima ocurrencia)
  String _convertDayToDate(String day) {
    final dayMap = {
      'LUN': 1,
      'MAR': 2,
      'MIÉ': 3,
      'JUE': 4,
      'VIE': 5,
      'SÁB': 6,
      'DOM': 7,
    };
    
    final targetWeekday = dayMap[day] ?? 1;
    final now = DateTime.now();
    final currentWeekday = now.weekday;
    
    int daysToAdd = targetWeekday - currentWeekday;
    if (daysToAdd <= 0) {
      daysToAdd += 7; // Si ya pasó este día, ir a la próxima semana
    }
    
    final targetDate = now.add(Duration(days: daysToAdd));
    return DateFormat('yyyy-MM-dd').format(targetDate);
  }

  // Función helper para convertir CalendarTask a AcademicTask
  AcademicTask? _calendarTaskToAcademicTask(CalendarTask calendarTask) {
    if (calendarTask.category != 'Escuela' && calendarTask.category != 'school') {
      return null;
    }

    return AcademicTask(
      id: calendarTask.id.endsWith('_task') 
          ? calendarTask.id.replaceAll('_task', '')
          : calendarTask.id,
      task: calendarTask.title,
      date: calendarTask.date,
      completed: calendarTask.completed,
      notes: null,
      priority: calendarTask.priority ?? 'medium',
      subject: null,
      estimatedTime: calendarTask.time,
    );
  }

  // Sincronizar tareas personales de escuela como tareas académicas
  Future<void> _syncPersonalTasksToAcademicTasks() async {
    try {
      final allTasks = await _taskService.getAllTasks();
      final schoolTasks = allTasks.where((t) => t.category == 'Escuela' || t.category == 'school').toList();
      
      // Convertir tareas personales de escuela a tareas académicas
      for (final task in schoolTasks) {
        // Solo agregar si no existe ya en _academicTasks
        final taskId = task.id.endsWith('_task') 
            ? task.id.replaceAll('_task', '')
            : task.id;
        
        final exists = _academicTasks.any((at) => at.id == taskId || at.id == task.id);
        
        if (!exists) {
          final academicTask = _calendarTaskToAcademicTask(task);
          if (academicTask != null) {
            setState(() {
              _academicTasks.add(academicTask);
            });
            print('Tarea académica sincronizada desde personal: ${academicTask.task}');
          }
        }
      }
    } catch (e) {
      print('Error al sincronizar tareas personales: $e');
    }
  }

  // Función helper para convertir AcademicTask a CalendarTask
  CalendarTask _academicTaskToCalendarTask(AcademicTask academicTask) {
    return CalendarTask(
      id: '${academicTask.id}_task',
      title: academicTask.task,
      date: academicTask.date,
      completed: academicTask.completed,
      time: academicTask.estimatedTime,
      category: 'Escuela',
      priority: academicTask.priority,
    );
  }

  // Función helper para convertir ClassSchedule a EventOrganization
  EventOrganization _classToEvent(ClassSchedule classSchedule) {
    final date = _convertDayToDate(classSchedule.day);
    final notes = <String>[];
    if (classSchedule.professor != null && classSchedule.professor!.isNotEmpty) {
      notes.add('Profesor: ${classSchedule.professor}');
    }
    if (classSchedule.classroom != null && classSchedule.classroom!.isNotEmpty) {
      notes.add('Aula: ${classSchedule.classroom}');
    }
    if (classSchedule.link != null && classSchedule.link!.isNotEmpty) {
      notes.add('Link: ${classSchedule.link}');
    }
    
    return EventOrganization(
      id: '${classSchedule.id}_event',
      eventName: classSchedule.subject,
      date: date,
      time: classSchedule.time,
      location: classSchedule.classroom,
      category: 'school',
      type: 'class',
      notes: notes.isNotEmpty ? notes.join('\n') : null,
    );
  }

  EventOrganization _examToEvent(ExamRevision exam) {
    final notes = <String>[];
    if (exam.notes != null && exam.notes!.isNotEmpty) {
      notes.add(exam.notes!);
    }
    if (exam.todos.isNotEmpty) {
      notes.add('Tareas de preparación: ${exam.todos.length}');
    }
    
    return EventOrganization(
      id: '${exam.id}_event',
      eventName: 'Examen: ${exam.topic}',
      date: DateFormat('yyyy-MM-dd').format(exam.date),
      time: null,
      location: null,
      category: 'school',
      type: 'exam',
      notes: notes.isNotEmpty ? notes.join('\n') : null,
    );
  }

  EventOrganization _projectToEvent(GroupProject project) {
    final notes = <String>[];
    notes.add('Objetivo: ${project.objective}');
    if (project.resources != null && project.resources!.isNotEmpty) {
      notes.add('Recursos: ${project.resources}');
    }
    if (project.ideas != null && project.ideas!.isNotEmpty) {
      notes.add('Ideas: ${project.ideas}');
    }
    if (project.actionSteps.isNotEmpty) {
      final completed = project.actionSteps.where((s) => s.completed).length;
      notes.add('Pasos: $completed/${project.actionSteps.length} completados');
    }
    
    return EventOrganization(
      id: '${project.id}_event',
      eventName: 'Proyecto: ${project.title}',
      date: DateFormat('yyyy-MM-dd').format(project.startDate),
      time: null,
      location: null,
      category: 'school',
      type: 'project',
      notes: notes.isNotEmpty ? notes.join('\n') : null,
    );
  }

  // Cargar clases desde Supabase
  Future<void> _loadClasses() async {
    // Evitar múltiples cargas simultáneas
    if (_isLoadingClasses || _classesLoaded) {
      return;
    }
    
    setState(() {
      _isLoadingClasses = true;
    });
    
    try {
      final classes = await _classScheduleService.getClassSchedules();
      setState(() {
        _classes = classes;
        _isLoadingClasses = false;
        _classesLoaded = true; // Marcar como cargado
      });
    } catch (e) {
      print('Error al cargar clases: $e');
      setState(() {
        _isLoadingClasses = false;
        _classesLoaded = true; // Marcar como cargado incluso si hay error
      });
    }
  }

  @override
  void dispose() {
    _classSubjectController.dispose();
    _classClassroomController.dispose();
    _classProfessorController.dispose();
    _classLinkController.dispose();
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
    _courseNotesUrlController.dispose();
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
      // Solo mostrar el botón si hay tareas académicas
      if (_academicTasks.isEmpty) {
        return const SizedBox.shrink();
      }
      return Container(
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
          onPressed: () => _showAddTaskDialog(),
          backgroundColor: Colors.transparent,
          elevation: 0,
          icon: const Icon(Icons.add, color: AppTheme.white),
          label: const Text(
            'Nueva Tarea Académica',
            style: TextStyle(
              color: AppTheme.white,
              fontWeight: FontWeight.w600,
            ),
          ),
          tooltip: 'Agregar tarea académica',
        ),
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
      return const SizedBox.shrink();
    } else if (_activeSection == 'class') {
      return FloatingActionButton.extended(
        onPressed: () {
          setState(() {
            _courseNameController.text = _classOverview['course'] ?? '';
            _courseTimeController.text = _classOverview['time'] ?? '';
            _courseLocationController.text = _classOverview['location'] ?? '';
            _courseInstructorController.text = _classOverview['instructor'] ?? '';
          });
          _showAddClassOverviewDialog();
        },
        icon: const Icon(Icons.add),
        label: const Text('Resumen de Clase'),
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
    );
  }

  void _showEditMaterialDialog(Map<String, dynamic> material) {
    showDialog(
      context: context,
      builder: (context) => _buildAddMaterialModal(material: material),
    );
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

  void _showEditClassModal(ClassSchedule classItem) {
    // Llenar los controladores con los datos de la clase
    _classSubjectController.text = classItem.subject;
    _classClassroomController.text = classItem.classroom ?? '';
    _classProfessorController.text = classItem.professor ?? '';
    _classLinkController.text = classItem.link ?? '';
    _selectedClassTime = classItem.time;
    _selectedClassDuration = classItem.duration.toString();
    _selectedClassDays = [classItem.day];

    showDialog(
      context: context,
      builder: (context) => _buildEditClassModal(classItem),
    );
  }

  void _showDeleteClassDialog(ClassSchedule classItem) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.darkSurface,
        title: const Text(
          'Eliminar Clase',
          style: TextStyle(color: AppTheme.white),
        ),
        content: Text(
          '¿Estás seguro de que deseas eliminar la clase "${classItem.subject}"?',
          style: const TextStyle(color: AppTheme.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar', style: TextStyle(color: AppTheme.white70)),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              
              // Mostrar indicador de carga
              showDialog(
                context: context,
                barrierDismissible: false,
                builder: (context) => const Center(
                  child: CircularProgressIndicator(),
                ),
              );

              final result = await _classScheduleService.deleteClassSchedule(classItem.id);

              // Eliminar evento en personal si existe
              if (result['success'] == true) {
                try {
                  await _eventService.deleteEvent('${classItem.id}_event');
                  print('Evento eliminado automáticamente para clase: ${classItem.subject}');
                } catch (e) {
                  print('Error al eliminar evento para clase: $e');
                  // No fallar si no se puede eliminar el evento
                }
              }

              if (context.mounted) {
                Navigator.pop(context); // Cerrar indicador de carga

                if (result['success'] == true) {
                  // Recargar clases
                  await _loadClasses();
                  
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Clase eliminada exitosamente'),
                      backgroundColor: Colors.green,
                    ),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Error al eliminar la clase: ${result['error'] ?? 'Error desconocido'}'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              }
            },
            child: const Text('Eliminar', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
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
    final todayWeekday = today.weekday; // 1 = Lunes, 7 = Domingo
    final todayIndex = todayWeekday == 7 ? 6 : todayWeekday - 1;
    
    if (_isLoadingClasses) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header mejorado
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.purple.withOpacity(0.3),
                  Colors.deepPurple.withOpacity(0.2),
                  AppTheme.darkSurface,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.purple.withOpacity(0.4),
                  blurRadius: 24,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.purple.withOpacity(0.4),
                            Colors.deepPurple.withOpacity(0.3),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: Colors.purple.withOpacity(0.5),
                          width: 2,
                        ),
                      ),
                      child: const Icon(
                        Icons.calendar_today,
                        size: 32,
                        color: Colors.purple,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Horario Semanal',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            currentDate,
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
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Selector de días mejorado
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: Colors.purple.withOpacity(0.2),
                width: 1,
              ),
            ),
            child: Row(
              children: _weekDays.asMap().entries.map((entry) {
                final index = entry.key;
                final day = entry.value;
                final isSelected = index == _selectedDayIndex;
                final isToday = index == todayIndex;
                
                return Expanded(
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedDayIndex = index;
                      });
                    },
                    child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 2),
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                      decoration: BoxDecoration(
                        gradient: isSelected
                            ? LinearGradient(
                                colors: [
                                  Colors.purple.withOpacity(0.4),
                                  Colors.deepPurple.withOpacity(0.3),
                                ],
                              )
                            : null,
                        color: isToday && !isSelected
                            ? Colors.purple.withOpacity(0.15)
                            : null,
                        borderRadius: BorderRadius.circular(12),
                        border: isSelected
                            ? Border.all(
                                color: Colors.purple.withOpacity(0.6),
                                width: 2,
                              )
                            : isToday
                                ? Border.all(
                                    color: Colors.purple.withOpacity(0.3),
                                    width: 1,
                                  )
                                : null,
                      ),
                      child: Column(
                        children: [
                          Text(
                            day,
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                              color: isSelected
                                  ? Colors.purple
                                  : isToday
                                      ? Colors.purple.withOpacity(0.8)
                                      : AppTheme.white70,
                              letterSpacing: 0.5,
                            ),
                          ),
                          if (isToday && !isSelected)
                            Container(
                              margin: const EdgeInsets.only(top: 4),
                              width: 4,
                              height: 4,
                              decoration: BoxDecoration(
                                color: Colors.purple,
                                shape: BoxShape.circle,
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
          const SizedBox(height: 24),
          
          // Resumen del día mejorado
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.school,
                  value: '${_classes.where((c) => c.day == currentDay).length}',
                  color: Colors.purple,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.access_time,
                  value: '${_timeSlots.length}',
                  color: Colors.blue,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.event_available,
                  value: '${_classes.length}',
                  color: Colors.green,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Horario mejorado
          Container(
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: Colors.purple.withOpacity(0.3),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.purple.withOpacity(0.2),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              children: [
                // Header de la tabla mejorado
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Colors.purple,
                        Colors.deepPurple,
                      ],
                    ),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(24),
                      topRight: Radius.circular(24),
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.access_time,
                          color: AppTheme.white,
                          size: 24,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Horario',
                              style: TextStyle(
                                color: AppTheme.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                                letterSpacing: 0.5,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              dayNames[currentDay]!,
                              style: TextStyle(
                                color: AppTheme.white.withOpacity(0.9),
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          '${_classes.where((c) => c.day == currentDay).length} clases',
                          style: const TextStyle(
                            color: AppTheme.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                // Cuerpo del horario mejorado
                Container(
                  constraints: const BoxConstraints(maxHeight: 500),
                  child: ListView.builder(
                    shrinkWrap: true,
                    padding: const EdgeInsets.all(16),
                    itemCount: _timeSlots.length,
                    itemBuilder: (context, index) {
                      final time = _timeSlots[index];
                      final hasClass = _classes.any((c) => 
                        c.day == currentDay && c.time == time
                      );
                      final classItem = hasClass
                          ? _classes.firstWhere((c) => 
                              c.day == currentDay && c.time == time
                            )
                          : null;
                      
                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Columna de tiempo mejorada
                            Container(
                              width: 90,
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              child: Column(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 6,
                                    ),
                                    decoration: BoxDecoration(
                                      color: hasClass
                                          ? Colors.purple.withOpacity(0.2)
                                          : AppTheme.darkSurfaceVariant.withOpacity(0.3),
                                      borderRadius: BorderRadius.circular(10),
                                      border: Border.all(
                                        color: hasClass
                                            ? Colors.purple.withOpacity(0.4)
                                            : AppTheme.darkSurfaceVariant,
                                        width: 1,
                                      ),
                                    ),
                                    child: Text(
                                      time,
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: hasClass
                                            ? FontWeight.bold
                                            : FontWeight.w500,
                                        color: hasClass
                                            ? Colors.purple
                                            : AppTheme.white70,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            // Contenido de la clase o slot vacío
                            Expanded(
                              child: hasClass && classItem != null
                                  ? _buildClassCardForTimetable(classItem)
                                  : _buildEmptySlot(false),
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
    final classColor = isCurrentTime ? Colors.orange : Colors.purple;
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            classColor,
            classColor.withOpacity(0.8),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: classColor.withOpacity(0.4),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(
          color: Colors.white.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.25),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: Colors.white.withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: const Icon(
                  Icons.school,
                  size: 20,
                  color: AppTheme.white,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      classItem.subject,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        letterSpacing: 0.3,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.25),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            decoration: BoxDecoration(
                              color: Colors.greenAccent,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 6),
                          const Text(
                            'En curso',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 0.5,
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
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.15),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                if (classItem.classroom != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(
                            Icons.location_on,
                            size: 16,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            classItem.classroom!,
                            style: const TextStyle(
                              fontSize: 13,
                              color: AppTheme.white,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                if (classItem.professor != null)
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(
                          Icons.person,
                          size: 16,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          classItem.professor!,
                          style: const TextStyle(
                            fontSize: 13,
                            color: AppTheme.white,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.25),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: Colors.white.withOpacity(0.3),
                      width: 1,
                    ),
                  ),
                  child: IconButton(
                    onPressed: () async {
                      if (classItem.link != null && classItem.link!.isNotEmpty) {
                        try {
                          final uri = Uri.parse(classItem.link!);
                          if (await canLaunchUrl(uri)) {
                            await launchUrl(uri, mode: LaunchMode.externalApplication);
                          } else {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('No se pudo abrir el link'),
                                  backgroundColor: Colors.red,
                                ),
                              );
                            }
                          }
                        } catch (e) {
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Error al abrir el link: $e'),
                                backgroundColor: Colors.red,
                              ),
                            );
                          }
                        }
                      } else {
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('No hay link disponible para esta clase'),
                              backgroundColor: Colors.orange,
                            ),
                          );
                        }
                      }
                    },
                    icon: const Icon(Icons.videocam, size: 16, color: AppTheme.white),
                    padding: const EdgeInsets.all(10),
                    constraints: const BoxConstraints(),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.25),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: Colors.white.withOpacity(0.3),
                      width: 1,
                    ),
                  ),
                  child: IconButton(
                    onPressed: () {
                      _showEditClassModal(classItem);
                    },
                    icon: const Icon(Icons.edit, size: 16, color: AppTheme.white),
                    padding: const EdgeInsets.all(10),
                    constraints: const BoxConstraints(),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: Colors.red.withOpacity(0.5),
                    width: 1,
                  ),
                ),
                child: IconButton(
                  onPressed: () {
                    _showDeleteClassDialog(classItem);
                  },
                  icon: const Icon(Icons.delete, size: 18, color: Colors.redAccent),
                  padding: const EdgeInsets.all(10),
                  constraints: const BoxConstraints(),
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
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isCurrentTime 
            ? Colors.purple.withOpacity(0.15)
            : AppTheme.darkSurfaceVariant.withOpacity(0.2),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isCurrentTime 
              ? Colors.purple.withOpacity(0.4)
              : AppTheme.darkSurfaceVariant.withOpacity(0.3),
          width: 1.5,
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: isCurrentTime
                  ? Colors.purple.withOpacity(0.2)
                  : AppTheme.darkSurfaceVariant.withOpacity(0.3),
              shape: BoxShape.circle,
            ),
            child: Icon(
              isCurrentTime ? Icons.access_time : Icons.event_available,
              color: isCurrentTime ? Colors.purple : AppTheme.white60,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Text(
            isCurrentTime ? 'Hora Actual' : 'Hora Libre',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: isCurrentTime ? Colors.purple : AppTheme.white70,
              letterSpacing: 0.3,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard({
    required IconData icon,
    String? title,
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
                if (title != null)
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
    
    // Agrupar tareas por fecha (igual que en trabajo)
    final Map<DateTime, List<AcademicTask>> tasksByDate = {};
    for (var task in _academicTasks) {
      final dateKey = DateTime(task.date.year, task.date.month, task.date.day);
      if (!tasksByDate.containsKey(dateKey)) {
        tasksByDate[dateKey] = [];
      }
      tasksByDate[dateKey]!.add(task);
    }
    
    // Ordenar fechas
    final sortedDates = tasksByDate.keys.toList()..sort();
    
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
                    Icons.assignment,
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
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Resumen
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.assignment,
                  value: '$totalTasks',
                  color: Colors.purple,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle,
                  value: '$completedTasks',
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.pending_actions,
                  value: '$pendingTasks',
                  color: Colors.orange,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.warning_rounded,
                  value: '$overdueTasks',
                  color: Colors.red,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Lista de tareas
          if (_academicTasks.isEmpty)
            _buildEmptyState(
              'No hay tareas académicas',
              Icons.description,
              'Agrega tu primera tarea para comenzar a organizarte',
            )
          else
            Column(
              children: sortedDates.map((date) => _buildAcademicTaskCard(date, tasksByDate[date]!)).toList(),
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

  Widget _buildAcademicTaskCard(DateTime date, List<AcademicTask> tasks) {
    final sortedTasks = List<AcademicTask>.from(tasks)..sort((a, b) => a.date.compareTo(b.date));
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
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                        ],
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
                
                return _buildAcademicTaskItem(task, date, index, isLast: !isLast);
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAcademicTaskItem(AcademicTask task, DateTime date, int index, {bool isLast = false}) {
    final isOverdue = !task.completed && task.date.isBefore(DateTime.now().subtract(const Duration(days: 1)));
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
                      // Checkbox mejorado (igual que trabajo)
                      GestureDetector(
                        onTap: () async {
                          setState(() {
                            _academicTasks = _academicTasks.map((t) {
                              if (t.id == task.id) {
                                final updatedTask = AcademicTask(
                                  id: t.id,
                                  task: t.task,
                                  date: t.date,
                                  completed: !t.completed,
                                  notes: t.notes,
                                  priority: t.priority,
                                  subject: t.subject,
                                  estimatedTime: t.estimatedTime,
                                );
                                
                                // Actualizar tarea en personal
                                _taskService.updateTask(_academicTaskToCalendarTask(updatedTask)).then((_) {
                                  print('Tarea personal actualizada automáticamente: ${updatedTask.task}');
                                }).catchError((e) {
                                  print('Error al actualizar tarea personal: $e');
                                });
                                
                                return updatedTask;
                              }
                              return t;
                            }).toList();
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
                            // Badge de completada
                            if (task.completed)
                              Container(
                                margin: const EdgeInsets.only(bottom: 8),
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      Colors.green.withOpacity(0.3),
                                      Colors.green.withOpacity(0.2),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: Colors.green.withOpacity(0.5),
                                    width: 1,
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(
                                      Icons.check_circle,
                                      size: 14,
                                      color: Colors.green,
                                    ),
                                    const SizedBox(width: 6),
                                    const Text(
                                      'Completada',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.green,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            // Prioridad con gradiente profesional
                            if (task.priority != null)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      _getPriorityColor(task.priority).withOpacity(0.25),
                                      _getPriorityColor(task.priority).withOpacity(0.15),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: _getPriorityColor(task.priority).withOpacity(0.4),
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
                                    const SizedBox(width: 6),
                                    Text(
                                      _getPriorityLabel(task.priority),
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: _getPriorityColor(task.priority),
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                          ],
                        ),
                      ),
                      // Botón de opciones (igual que trabajo)
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
                            ).then((confirmed) async {
                              if (confirmed == true) {
                                // Eliminar tarea personal asociada
                                try {
                                  await _taskService.deleteTask('${task.id}_task');
                                  print('Tarea personal eliminada automáticamente para tarea académica: ${task.task}');
                                } catch (e) {
                                  print('Error al eliminar tarea personal: $e');
                                  // Continuar con la eliminación aunque falle
                                }
                                
                                setState(() {
                                  _academicTasks = _academicTasks.where((t) => t.id != task.id).toList();
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
                  // Información de la tarea (estilo igual que trabajo)
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBackground.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        if (task.subject != null) ...[
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
                                child: const Icon(
                                  Icons.book,
                                  size: 16,
                                  color: AppTheme.white,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'Materia',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: AppTheme.white,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      task.subject!,
                                      style: const TextStyle(
                                        fontSize: 15,
                                        color: AppTheme.white,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                        ],
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
                              child: const Icon(
                                Icons.calendar_today,
                                size: 16,
                                color: AppTheme.white,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Fecha',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: AppTheme.white,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    DateFormat('dd/MM/yyyy').format(task.date),
                                    style: TextStyle(
                                      fontSize: 15,
                                      color: isOverdue ? Colors.red : AppTheme.white,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            if (task.estimatedTime != null) ...[
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
                                child: const Icon(
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
                                    const Text(
                                      'Tiempo',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: AppTheme.white,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      task.estimatedTime!,
                                      style: const TextStyle(
                                        fontSize: 15,
                                        color: AppTheme.white,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                            if (isOverdue && !task.completed)
                              Container(
                                margin: const EdgeInsets.only(left: 12),
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
                  // Notas
                  if (task.notes != null && task.notes!.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            professionalColor3.withOpacity(0.2),
                            professionalColor3.withOpacity(0.1),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: professionalColor3.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [professionalColor3, professionalColor2],
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(Icons.note, size: 16, color: AppTheme.white),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              task.notes!,
                              style: const TextStyle(
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
          ],
        ),
      ),
    );
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

  Widget _buildTaskSummaryCard({
    required IconData icon,
    String? title,
    required String value,
    required Color color,
    required LinearGradient gradient,
  }) {
    final colors = [gradient.colors[0], gradient.colors.length > 1 ? gradient.colors[1] : gradient.colors[0]];
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
          if (title != null)
            Text(
              title!,
              style: const TextStyle(
                fontSize: 12,
                color: AppTheme.white60,
              ),
            ),
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
                  value: '${_groupProjects.length}',
                  color: Colors.purple,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.people,
                  value: '${_groupProjects.length * 3}', // Placeholder - calcular basado en proyectos
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle,
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
              'No hay proyectos',
              Icons.folder_open,
              'Crea tu primer proyecto escolar',
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
                  onPressed: () async {
                    // Eliminar evento en personal si existe
                    try {
                      await _eventService.deleteEvent('${project.id}_event');
                      print('Evento eliminado automáticamente para proyecto: ${project.title}');
                    } catch (e) {
                      print('Error al eliminar evento para proyecto: $e');
                      // Continuar con la eliminación aunque falle
                    }
                    
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
                  value: '${_examRevisions.length}',
                  color: Colors.purple,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.access_time,
                  value: '${_examRevisions.where((e) => e.date.isAfter(DateTime.now()) && e.date.isBefore(DateTime.now().add(const Duration(days: 7)))).length}',
                  color: Colors.orange,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle,
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
              'No hay exámenes',
              Icons.school_outlined,
              'Agrega tu primer examen para planificar',
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
                  onPressed: () async {
                    // Eliminar evento en personal si existe
                    try {
                      await _eventService.deleteEvent('${exam.id}_event');
                      print('Evento eliminado automáticamente para examen: ${exam.topic}');
                    } catch (e) {
                      print('Error al eliminar evento para examen: $e');
                      // Continuar con la eliminación aunque falle
                    }
                    
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
                  value: '${_textbooks.length}',
                  color: Colors.purple,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.language,
                  value: '${_onlineResources.length}',
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.library_books,
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
                _editingMaterialIndex = null;
              });
              _showAddMaterialDialog();
            },
            onDelete: (index) {
              setState(() {
                _textbooks.removeAt(index);
              });
            },
            onEdit: (index, item) {
              setState(() {
                _currentModalType = 'textbook';
                _editingMaterialIndex = index;
              });
              _showEditMaterialDialog(item);
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
                _editingMaterialIndex = null;
              });
              _showAddMaterialDialog();
            },
            onDelete: (index) {
              setState(() {
                _onlineResources.removeAt(index);
              });
            },
            onEdit: (index, item) {
              setState(() {
                _currentModalType = 'online';
                _editingMaterialIndex = index;
              });
              _showEditMaterialDialog(item);
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
                _editingMaterialIndex = null;
              });
              _showAddMaterialDialog();
            },
            onDelete: (index) {
              setState(() {
                _references.removeAt(index);
              });
            },
            onEdit: (index, item) {
              setState(() {
                _currentModalType = 'reference';
                _editingMaterialIndex = index;
              });
              _showEditMaterialDialog(item);
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
    Function(int, Map<String, dynamic>)? onEdit,
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
              'No hay $title',
              icon,
              'Agrega tus materiales para organizarlos',
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
                            if (item['className'] != null) ...[
                              const SizedBox(height: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      Colors.blue.withOpacity(0.3),
                                      Colors.blue.withOpacity(0.2),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: Colors.blue.withOpacity(0.4),
                                    width: 1,
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(
                                      Icons.school,
                                      size: 14,
                                      color: Colors.blue,
                                    ),
                                    const SizedBox(width: 6),
                                    Text(
                                      item['className'] as String,
                                      style: const TextStyle(
                                        fontSize: 12,
                                        color: Colors.blue,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
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
                          if (onEdit != null)
                            IconButton(
                              onPressed: () => onEdit(index, item),
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
                  value: _classOverview['course'] != null ? '1' : '0',
                  color: Colors.purple,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.access_time,
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
              'No hay clases registradas',
              Icons.school_outlined,
              'Agrega tu primera clase para comenzar',
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
          if (_classOverview['notesUrl'] != null)
            GestureDetector(
              onTap: () async {
                final url = Uri.parse(_classOverview['notesUrl']);
                if (await canLaunchUrl(url)) {
                  await launchUrl(url, mode: LaunchMode.externalApplication);
                } else {
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('No se pudo abrir la URL'),
                        backgroundColor: Colors.red,
                      ),
                    );
                  }
                }
              },
              child: Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.blue.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.link,
                        color: Colors.blue,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Apuntes Digitales',
                            style: TextStyle(
                              fontSize: 12,
                              color: AppTheme.white60,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _classOverview['notesUrl'],
                            style: const TextStyle(
                              fontSize: 14,
                              color: Colors.blue,
                              fontWeight: FontWeight.w600,
                              decoration: TextDecoration.underline,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    const Icon(
                      Icons.open_in_new,
                      color: Colors.blue,
                      size: 18,
                    ),
                  ],
                ),
              ),
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
                      _courseNotesUrlController.text = _classOverview['notesUrl'] ?? '';
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

  // ==================== MODALES ====================
  
  Widget _buildAddClassModal() {
    return StatefulBuilder(
      builder: (context, setModalState) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 500),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                AppTheme.darkSurface,
                AppTheme.darkSurfaceVariant,
              ],
            ),
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(
                color: Colors.purple.withOpacity(0.3),
                blurRadius: 24,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header mejorado
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.purple,
                      Colors.deepPurple,
                    ],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(28),
                    topRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(
                        Icons.add_circle_outline,
                        color: AppTheme.white,
                        size: 28,
                      ),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Agregar Nueva Clase',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.5,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Completa los datos de tu clase',
                            style: TextStyle(
                              color: AppTheme.white70,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              // Contenido
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Campo Materia
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.purple.withOpacity(0.2),
                            width: 1,
                          ),
                        ),
                        child: TextField(
                          controller: _classSubjectController,
                          decoration: InputDecoration(
                            labelText: 'Materia *',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(
                              Icons.school,
                              color: Colors.purple,
                            ),
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: InputBorder.none,
                          ),
                          style: const TextStyle(color: AppTheme.white, fontSize: 16),
                        ),
                      ),
                      const SizedBox(height: 20),
                      
                      // Selector de días (múltiple)
                      Row(
                        children: [
                          const Icon(Icons.calendar_today, size: 18, color: Colors.purple),
                          const SizedBox(width: 8),
                          const Text(
                            'Días de la semana *',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const Spacer(),
                          if (_selectedClassDays.isNotEmpty)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.purple.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '${_selectedClassDays.length} seleccionado${_selectedClassDays.length > 1 ? 's' : ''}',
                                style: const TextStyle(
                                  color: Colors.purple,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.purple.withOpacity(0.2),
                            width: 1,
                          ),
                        ),
                        child: Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: _weekDays.map((day) {
                            final isSelected = _selectedClassDays.contains(day);
                            return GestureDetector(
                              onTap: () {
                                setModalState(() {
                                  if (isSelected) {
                                    _selectedClassDays.remove(day);
                                  } else {
                                    _selectedClassDays.add(day);
                                  }
                                });
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                                decoration: BoxDecoration(
                                  gradient: isSelected
                                      ? LinearGradient(
                                          colors: [
                                            Colors.purple,
                                            Colors.deepPurple,
                                          ],
                                        )
                                      : null,
                                  color: isSelected
                                      ? null
                                      : AppTheme.darkSurface.withOpacity(0.5),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: isSelected
                                        ? Colors.purple.withOpacity(0.5)
                                        : Colors.purple.withOpacity(0.2),
                                    width: 1.5,
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    if (isSelected)
                                      const Icon(
                                        Icons.check_circle,
                                        size: 16,
                                        color: AppTheme.white,
                                      )
                                    else
                                      Container(
                                        width: 16,
                                        height: 16,
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          border: Border.all(
                                            color: AppTheme.white70,
                                            width: 2,
                                          ),
                                        ),
                                      ),
                                    const SizedBox(width: 6),
                                    Text(
                                      day,
                                      style: TextStyle(
                                        color: isSelected
                                            ? AppTheme.white
                                            : AppTheme.white70,
                                        fontWeight: isSelected
                                            ? FontWeight.bold
                                            : FontWeight.w500,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(height: 20),
                      
                      // Selector de hora
                      const Row(
                        children: [
                          Icon(Icons.access_time, size: 18, color: Colors.purple),
                          SizedBox(width: 8),
                          Text(
                            'Hora *',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Container(
                        height: 140,
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.purple.withOpacity(0.2),
                            width: 1,
                          ),
                        ),
                        child: GridView.builder(
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 3,
                            childAspectRatio: 2.5,
                            crossAxisSpacing: 8,
                            mainAxisSpacing: 8,
                          ),
                          itemCount: _timeSlots.length,
                          itemBuilder: (context, index) {
                            final time = _timeSlots[index];
                            final isSelected = _selectedClassTime == time;
                            return GestureDetector(
                              onTap: () {
                                setModalState(() {
                                  _selectedClassTime = time;
                                });
                              },
                              child: Container(
                                decoration: BoxDecoration(
                                  gradient: isSelected
                                      ? LinearGradient(
                                          colors: [
                                            Colors.purple,
                                            Colors.deepPurple,
                                          ],
                                        )
                                      : null,
                                  color: isSelected
                                      ? null
                                      : AppTheme.darkSurface.withOpacity(0.5),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(
                                    color: isSelected
                                        ? Colors.purple.withOpacity(0.5)
                                        : Colors.purple.withOpacity(0.2),
                                    width: 1.5,
                                  ),
                                ),
                                child: Center(
                                  child: Text(
                                    time,
                                    style: TextStyle(
                                      color: isSelected
                                          ? AppTheme.white
                                          : AppTheme.white70,
                                      fontWeight: isSelected
                                          ? FontWeight.bold
                                          : FontWeight.w500,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(height: 20),
                      
                      // Campos opcionales
                      Row(
                        children: [
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: Colors.purple.withOpacity(0.2),
                                  width: 1,
                                ),
                              ),
                              child: TextField(
                                controller: _classClassroomController,
                                decoration: const InputDecoration(
                                  labelText: 'Aula',
                                  labelStyle: TextStyle(color: AppTheme.white70),
                                  prefixIcon: Icon(
                                    Icons.location_on,
                                    color: Colors.purple,
                                    size: 20,
                                  ),
                                  border: InputBorder.none,
                                  enabledBorder: InputBorder.none,
                                  focusedBorder: InputBorder.none,
                                ),
                                style: const TextStyle(color: AppTheme.white, fontSize: 15),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: Colors.purple.withOpacity(0.2),
                                  width: 1,
                                ),
                              ),
                              child: TextField(
                                controller: _classProfessorController,
                                decoration: const InputDecoration(
                                  labelText: 'Profesor',
                                  labelStyle: TextStyle(color: AppTheme.white70),
                                  prefixIcon: Icon(
                                    Icons.person,
                                    color: Colors.purple,
                                    size: 20,
                                  ),
                                  border: InputBorder.none,
                                  enabledBorder: InputBorder.none,
                                  focusedBorder: InputBorder.none,
                                ),
                                style: const TextStyle(color: AppTheme.white, fontSize: 15),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      
                      // Campo de link
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.purple.withOpacity(0.2),
                            width: 1,
                          ),
                        ),
                        child: TextField(
                          controller: _classLinkController,
                          decoration: const InputDecoration(
                            labelText: 'Link para unirse (Zoom, Meet, etc.)',
                            labelStyle: TextStyle(color: AppTheme.white70),
                            hintText: 'https://meet.google.com/...',
                            hintStyle: TextStyle(color: AppTheme.white60),
                            prefixIcon: Icon(
                              Icons.link,
                              color: Colors.purple,
                              size: 20,
                            ),
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: InputBorder.none,
                          ),
                          style: const TextStyle(color: AppTheme.white, fontSize: 15),
                          keyboardType: TextInputType.url,
                        ),
                      ),
                      const SizedBox(height: 20),
                      
                      // Selector de duración
                      const Row(
                        children: [
                          Icon(Icons.timer, size: 18, color: Colors.purple),
                          SizedBox(width: 8),
                          Text(
                            'Duración',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.purple.withOpacity(0.2),
                            width: 1,
                          ),
                        ),
                        child: Row(
                          children: ['30', '60', '90', '120'].map((duration) {
                            final isSelected = _selectedClassDuration == duration;
                            return Expanded(
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 4),
                                child: GestureDetector(
                                  onTap: () {
                                    setModalState(() {
                                      _selectedClassDuration = duration;
                                    });
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(vertical: 12),
                                    decoration: BoxDecoration(
                                      gradient: isSelected
                                          ? LinearGradient(
                                              colors: [
                                                Colors.purple,
                                                Colors.deepPurple,
                                              ],
                                            )
                                          : null,
                                      color: isSelected
                                          ? null
                                          : AppTheme.darkSurface.withOpacity(0.5),
                                      borderRadius: BorderRadius.circular(12),
                                      border: Border.all(
                                        color: isSelected
                                            ? Colors.purple.withOpacity(0.5)
                                            : Colors.purple.withOpacity(0.2),
                                        width: 1.5,
                                      ),
                                    ),
                                    child: Center(
                                      child: Text(
                                        '$duration min',
                                        style: TextStyle(
                                          color: isSelected
                                              ? AppTheme.white
                                              : AppTheme.white70,
                                          fontWeight: isSelected
                                              ? FontWeight.bold
                                              : FontWeight.w500,
                                          fontSize: 13,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              // Botones
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(28),
                    bottomRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () {
                        _classSubjectController.clear();
                        _classClassroomController.clear();
                        _classProfessorController.clear();
                        _selectedClassDays.clear();
                        _selectedClassTime = '7:00 AM';
                        _selectedClassDuration = '60';
                        Navigator.pop(context);
                      },
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      ),
                      child: const Text(
                        'Cancelar',
                        style: TextStyle(
                          color: AppTheme.white70,
                          fontSize: 15,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton(
                      onPressed: () async {
                        try {
                          // Validar campos obligatorios
                          if (_classSubjectController.text.trim().isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Por favor completa todos los campos obligatorios'),
                                backgroundColor: Colors.red,
                              ),
                            );
                            return;
                          }

                          if (_selectedClassDays.isEmpty || _selectedClassTime.isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Por favor selecciona al menos un día y la hora'),
                                backgroundColor: Colors.red,
                              ),
                            );
                            return;
                          }

                          // Mostrar indicador de carga
                          showDialog(
                            context: context,
                            barrierDismissible: false,
                            builder: (loadingContext) => const Center(
                              child: CircularProgressIndicator(),
                            ),
                          );

                          // Guardar el número de días antes de limpiar
                          final totalDays = _selectedClassDays.length;
                          
                          // Crear una clase por cada día seleccionado
                          int successCount = 0;
                          int errorCount = 0;
                          String? lastError;
                          final List<ClassSchedule> newClasses = [];

                          for (int i = 0; i < _selectedClassDays.length; i++) {
                            try {
                              final day = _selectedClassDays[i];
                              final newClass = ClassSchedule(
                                id: '${DateTime.now().millisecondsSinceEpoch}_$i',
                                subject: _classSubjectController.text.trim(),
                                day: day,
                                time: _selectedClassTime,
                                classroom: _classClassroomController.text.trim().isNotEmpty 
                                    ? _classClassroomController.text.trim() 
                                    : null,
                                professor: _classProfessorController.text.trim().isNotEmpty
                                    ? _classProfessorController.text.trim()
                                    : null,
                                duration: int.parse(_selectedClassDuration),
                                link: _classLinkController.text.trim().isNotEmpty
                                    ? _classLinkController.text.trim()
                                    : null,
                              );

                              // Guardar en Supabase
                              final result = await _classScheduleService.addClassSchedule(newClass);

                              if (result['success'] == true) {
                                successCount++;
                                newClasses.add(newClass);
                                
                                // Crear evento en personal automáticamente
                                try {
                                  final event = _classToEvent(newClass);
                                  await _eventService.addEvent(event);
                                  print('Evento creado automáticamente para clase: ${newClass.subject}');
                                } catch (e) {
                                  print('Error al crear evento para clase: $e');
                                  // No fallar si no se puede crear el evento
                                }
                              } else {
                                errorCount++;
                                lastError = result['error'] ?? 'Error desconocido';
                                print('Error al agregar clase para $day: $lastError');
                              }
                            } catch (e) {
                              errorCount++;
                              lastError = e.toString();
                              print('Excepción al agregar clase: $e');
                            }
                          }

                          // Cerrar indicador de carga
                          if (context.mounted) {
                            Navigator.pop(context);
                          }

                          // Recargar clases desde Supabase si hubo al menos un éxito
                          if (successCount > 0) {
                            try {
                              final loadedClasses = await _classScheduleService.getClassSchedules();
                              if (context.mounted) {
                                setState(() {
                                  _classes = loadedClasses;
                                });
                              }
                            } catch (e) {
                              print('Error al recargar clases: $e');
                              // Agregar clases exitosas localmente como fallback
                              if (context.mounted) {
                                setState(() {
                                  _classes.addAll(newClasses);
                                });
                              }
                            }
                          }

                          // Limpiar formulario usando setModalState
                          setModalState(() {
                            _classSubjectController.clear();
                            _classClassroomController.clear();
                            _classProfessorController.clear();
                            _classLinkController.clear();
                            _selectedClassDays.clear();
                            _selectedClassTime = '7:00 AM';
                            _selectedClassDuration = '60';
                          });

                          // Cerrar modal y mostrar mensaje
                          if (context.mounted) {
                            Navigator.pop(context);
                            
                            if (successCount == totalDays) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    successCount == 1
                                        ? 'Clase agregada exitosamente'
                                        : '$successCount clases agregadas exitosamente',
                                  ),
                                  backgroundColor: Colors.green,
                                ),
                              );
                            } else if (successCount > 0) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    '$successCount de $totalDays clases agregadas. $errorCount errores.${lastError != null ? "\nÚltimo error: ${lastError.length > 50 ? lastError.substring(0, 50) + "..." : lastError}" : ""}',
                                  ),
                                  backgroundColor: Colors.orange,
                                  duration: const Duration(seconds: 5),
                                ),
                              );
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(
                                    'Error al agregar las clases.${lastError != null ? "\nError: ${lastError.length > 80 ? lastError.substring(0, 80) + "..." : lastError}" : ""}',
                                  ),
                                  backgroundColor: Colors.red,
                                  duration: const Duration(seconds: 5),
                                ),
                              );
                            }
                          }
                        } catch (e) {
                          print('Error general al agregar clase: $e');
                          
                          // Asegurar que se cierren los diálogos
                          if (context.mounted) {
                            try {
                              Navigator.pop(context); // Cerrar indicador de carga si existe
                            } catch (_) {}
                            try {
                              Navigator.pop(context); // Cerrar modal si existe
                            } catch (_) {}
                            
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  'Error inesperado: ${e.toString().length > 100 ? e.toString().substring(0, 100) + "..." : e.toString()}',
                                ),
                                backgroundColor: Colors.red,
                                duration: const Duration(seconds: 5),
                              ),
                            );
                          }
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.purple,
                        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        elevation: 4,
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.add, size: 20),
                          SizedBox(width: 8),
                          Text(
                            'Agregar Clase',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
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
        ),
      ),
    );
  }

  Widget _buildEditClassModal(ClassSchedule classItem) {
    return StatefulBuilder(
      builder: (context, setModalState) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 500),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                AppTheme.darkSurface,
                AppTheme.darkSurfaceVariant,
              ],
            ),
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(
                color: Colors.purple.withOpacity(0.3),
                blurRadius: 24,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.purple,
                      Colors.deepPurple,
                    ],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(28),
                    topRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(
                        Icons.edit,
                        color: AppTheme.white,
                        size: 28,
                      ),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Editar Clase',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.5,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Modifica los datos de tu clase',
                            style: TextStyle(
                              color: AppTheme.white70,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              // Contenido - reutilizando la misma estructura del modal de agregar
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Campo Materia
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.purple.withOpacity(0.2),
                            width: 1,
                          ),
                        ),
                        child: TextField(
                          controller: _classSubjectController,
                          decoration: const InputDecoration(
                            labelText: 'Materia *',
                            labelStyle: TextStyle(color: AppTheme.white70),
                            prefixIcon: Icon(
                              Icons.school,
                              color: Colors.purple,
                              size: 20,
                            ),
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: InputBorder.none,
                          ),
                          style: const TextStyle(color: AppTheme.white, fontSize: 15),
                        ),
                      ),
                      const SizedBox(height: 20),
                      // Selector de día (solo uno para edición)
                      const Row(
                        children: [
                          Icon(Icons.calendar_today, size: 18, color: Colors.purple),
                          SizedBox(width: 8),
                          Text(
                            'Día',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: _weekDays.map((day) {
                          final isSelected = _selectedClassDays.contains(day);
                          return ChoiceChip(
                            label: Text(day),
                            selected: isSelected,
                            onSelected: (selected) {
                              setModalState(() {
                                if (selected) {
                                  _selectedClassDays = [day];
                                } else {
                                  _selectedClassDays = [];
                                }
                              });
                            },
                            selectedColor: Colors.purple,
                            labelStyle: TextStyle(
                              color: isSelected ? AppTheme.white : AppTheme.white70,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                            ),
                            backgroundColor: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 20),
                      // Selector de hora
                      const Row(
                        children: [
                          Icon(Icons.access_time, size: 18, color: Colors.purple),
                          SizedBox(width: 8),
                          Text(
                            'Hora',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.purple.withOpacity(0.2),
                            width: 1,
                          ),
                        ),
                        child: GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 4,
                            crossAxisSpacing: 8,
                            mainAxisSpacing: 8,
                            childAspectRatio: 2.5,
                          ),
                          itemCount: _timeSlots.length,
                          itemBuilder: (context, index) {
                            final time = _timeSlots[index];
                            final isSelected = _selectedClassTime == time;
                            return GestureDetector(
                              onTap: () {
                                setModalState(() {
                                  _selectedClassTime = time;
                                });
                              },
                              child: Container(
                                decoration: BoxDecoration(
                                  gradient: isSelected
                                      ? LinearGradient(
                                          colors: [
                                            Colors.purple,
                                            Colors.deepPurple,
                                          ],
                                        )
                                      : null,
                                  color: isSelected
                                      ? null
                                      : AppTheme.darkSurface.withOpacity(0.5),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(
                                    color: isSelected
                                        ? Colors.purple.withOpacity(0.5)
                                        : Colors.purple.withOpacity(0.2),
                                    width: 1.5,
                                  ),
                                ),
                                child: Center(
                                  child: Text(
                                    time,
                                    style: TextStyle(
                                      color: isSelected
                                          ? AppTheme.white
                                          : AppTheme.white70,
                                      fontWeight: isSelected
                                          ? FontWeight.bold
                                          : FontWeight.w500,
                                      fontSize: 12,
                                    ),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(height: 20),
                      // Campos opcionales
                      Row(
                        children: [
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: Colors.purple.withOpacity(0.2),
                                  width: 1,
                                ),
                              ),
                              child: TextField(
                                controller: _classClassroomController,
                                decoration: const InputDecoration(
                                  labelText: 'Aula',
                                  labelStyle: TextStyle(color: AppTheme.white70),
                                  prefixIcon: Icon(
                                    Icons.location_on,
                                    color: Colors.purple,
                                    size: 20,
                                  ),
                                  border: InputBorder.none,
                                  enabledBorder: InputBorder.none,
                                  focusedBorder: InputBorder.none,
                                ),
                                style: const TextStyle(color: AppTheme.white, fontSize: 15),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: Colors.purple.withOpacity(0.2),
                                  width: 1,
                                ),
                              ),
                              child: TextField(
                                controller: _classProfessorController,
                                decoration: const InputDecoration(
                                  labelText: 'Profesor',
                                  labelStyle: TextStyle(color: AppTheme.white70),
                                  prefixIcon: Icon(
                                    Icons.person,
                                    color: Colors.purple,
                                    size: 20,
                                  ),
                                  border: InputBorder.none,
                                  enabledBorder: InputBorder.none,
                                  focusedBorder: InputBorder.none,
                                ),
                                style: const TextStyle(color: AppTheme.white, fontSize: 15),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      // Campo de link
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.purple.withOpacity(0.2),
                            width: 1,
                          ),
                        ),
                        child: TextField(
                          controller: _classLinkController,
                          decoration: const InputDecoration(
                            labelText: 'Link para unirse (Zoom, Meet, etc.)',
                            labelStyle: TextStyle(color: AppTheme.white70),
                            hintText: 'https://meet.google.com/...',
                            hintStyle: TextStyle(color: AppTheme.white60),
                            prefixIcon: Icon(
                              Icons.link,
                              color: Colors.purple,
                              size: 20,
                            ),
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: InputBorder.none,
                          ),
                          style: const TextStyle(color: AppTheme.white, fontSize: 15),
                          keyboardType: TextInputType.url,
                        ),
                      ),
                      const SizedBox(height: 20),
                      // Selector de duración
                      const Row(
                        children: [
                          Icon(Icons.timer, size: 18, color: Colors.purple),
                          SizedBox(width: 8),
                          Text(
                            'Duración',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.purple.withOpacity(0.2),
                            width: 1,
                          ),
                        ),
                        child: Row(
                          children: ['30', '60', '90', '120'].map((duration) {
                            final isSelected = _selectedClassDuration == duration;
                            return Expanded(
                              child: GestureDetector(
                                onTap: () {
                                  setModalState(() {
                                    _selectedClassDuration = duration;
                                  });
                                },
                                child: Container(
                                  margin: const EdgeInsets.symmetric(horizontal: 4),
                                  padding: const EdgeInsets.symmetric(vertical: 12),
                                  decoration: BoxDecoration(
                                    gradient: isSelected
                                        ? LinearGradient(
                                            colors: [
                                              Colors.purple,
                                              Colors.deepPurple,
                                            ],
                                          )
                                        : null,
                                    color: isSelected
                                        ? null
                                        : Colors.transparent,
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(
                                      color: isSelected
                                          ? Colors.purple.withOpacity(0.5)
                                          : Colors.purple.withOpacity(0.2),
                                      width: 1,
                                    ),
                                  ),
                                  child: Center(
                                    child: Text(
                                      '$duration min',
                                      style: TextStyle(
                                        color: isSelected
                                            ? AppTheme.white
                                            : AppTheme.white70,
                                        fontWeight: isSelected
                                            ? FontWeight.bold
                                            : FontWeight.normal,
                                        fontSize: 13,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                      const SizedBox(height: 24),
                      // Botones
                      Row(
                        children: [
                          Expanded(
                            child: TextButton(
                              onPressed: () => Navigator.pop(context),
                              style: TextButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  side: BorderSide(
                                    color: Colors.purple.withOpacity(0.5),
                                    width: 1,
                                  ),
                                ),
                              ),
                              child: const Text(
                                'Cancelar',
                                style: TextStyle(
                                  color: AppTheme.white70,
                                  fontSize: 15,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () async {
                                try {
                                  if (_classSubjectController.text.trim().isEmpty) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('Por favor completa todos los campos obligatorios'),
                                        backgroundColor: Colors.red,
                                      ),
                                    );
                                    return;
                                  }

                                  if (_selectedClassDays.isEmpty || _selectedClassTime.isEmpty) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('Por favor selecciona el día y la hora'),
                                        backgroundColor: Colors.red,
                                      ),
                                    );
                                    return;
                                  }

                                  showDialog(
                                    context: context,
                                    barrierDismissible: false,
                                    builder: (loadingContext) => const Center(
                                      child: CircularProgressIndicator(),
                                    ),
                                  );

                                  final updatedClass = ClassSchedule(
                                    id: classItem.id,
                                    subject: _classSubjectController.text.trim(),
                                    day: _selectedClassDays.first,
                                    time: _selectedClassTime,
                                    classroom: _classClassroomController.text.trim().isNotEmpty 
                                        ? _classClassroomController.text.trim() 
                                        : null,
                                    professor: _classProfessorController.text.trim().isNotEmpty
                                        ? _classProfessorController.text.trim()
                                        : null,
                                    duration: int.parse(_selectedClassDuration),
                                    link: _classLinkController.text.trim().isNotEmpty
                                        ? _classLinkController.text.trim()
                                        : null,
                                  );

                                    final result = await _classScheduleService.updateClassSchedule(updatedClass);

                                    // Actualizar evento en personal si existe
                                    if (result['success'] == true) {
                                      try {
                                        final event = _classToEvent(updatedClass);
                                        // Buscar y actualizar el evento existente
                                        final allEvents = await _eventService.getAllEvents();
                                        final existingEvent = allEvents.firstWhere(
                                          (e) => e.id == '${updatedClass.id}_event',
                                          orElse: () => event,
                                        );
                                        
                                        if (existingEvent.id == '${updatedClass.id}_event') {
                                          final updatedEvent = EventOrganization(
                                            id: existingEvent.id,
                                            eventName: event.eventName,
                                            date: event.date,
                                            time: event.time,
                                            location: event.location,
                                            category: 'school',
                                            type: 'class',
                                            notes: event.notes,
                                          );
                                          await _eventService.updateEvent(updatedEvent);
                                        } else {
                                          // Si no existe, crearlo
                                          await _eventService.addEvent(event);
                                        }
                                      } catch (e) {
                                        print('Error al actualizar evento para clase: $e');
                                        // No fallar si no se puede actualizar el evento
                                      }
                                    }

                                    if (context.mounted) {
                                    try {
                                      Navigator.pop(context); // Cerrar indicador de carga
                                    } catch (_) {}

                                    if (result['success'] == true) {
                                      // Recargar clases
                                      try {
                                        await _loadClasses();
                                      } catch (e) {
                                        print('Error al recargar clases después de actualizar: $e');
                                      }
                                      
                                      if (context.mounted) {
                                        try {
                                          Navigator.pop(context); // Cerrar modal
                                        } catch (_) {}
                                        
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          const SnackBar(
                                            content: Text('Clase actualizada exitosamente'),
                                            backgroundColor: Colors.green,
                                            duration: Duration(seconds: 3),
                                          ),
                                        );
                                      }
                                    } else {
                                      // Mostrar error específico
                                      final errorMessage = result['error'] ?? 'Error desconocido';
                                      print('Error al actualizar clase: $errorMessage');
                                      
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(
                                          content: Text(
                                            'Error al actualizar la clase:\n$errorMessage',
                                            maxLines: 3,
                                          ),
                                          backgroundColor: Colors.red,
                                          duration: const Duration(seconds: 5),
                                        ),
                                      );
                                    }
                                  }
                                } catch (e) {
                                  print('Excepción al actualizar clase: $e');
                                  
                                  if (context.mounted) {
                                    try {
                                      Navigator.pop(context); // Cerrar indicador de carga
                                    } catch (_) {}
                                    
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text(
                                          'Error inesperado: ${e.toString().length > 150 ? e.toString().substring(0, 150) + "..." : e.toString()}',
                                          maxLines: 3,
                                        ),
                                        backgroundColor: Colors.red,
                                        duration: const Duration(seconds: 5),
                                      ),
                                    );
                                  }
                                }
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.purple,
                                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                elevation: 4,
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.save, size: 20),
                                  SizedBox(width: 8),
                                  Text(
                                    'Guardar Cambios',
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAddTaskModal() {
    String? errorMessage;
    bool isSaving = false;
    
    return StatefulBuilder(
      builder: (BuildContext dialogContext, StateSetter setDialogState) {
        return Dialog(
          backgroundColor: Colors.transparent,
          child: Container(
            constraints: const BoxConstraints(maxWidth: 500),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(28),
              boxShadow: [
                BoxShadow(
                  color: Colors.purple.withOpacity(0.3),
                  blurRadius: 24,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header mejorado
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.purple,
                        Colors.deepPurple,
                      ],
                    ),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(28),
                      topRight: Radius.circular(28),
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: const Icon(
                          Icons.assignment,
                          color: AppTheme.white,
                          size: 28,
                        ),
                      ),
                      const SizedBox(width: 16),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Agregar Tarea Académica',
                              style: TextStyle(
                                color: AppTheme.white,
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'Organiza tus tareas académicas',
                              style: TextStyle(
                                color: AppTheme.white70,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: () => Navigator.of(dialogContext).pop(),
                        icon: const Icon(Icons.close, color: AppTheme.white),
                      ),
                    ],
                  ),
                ),
                // Contenido
                Flexible(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(24),
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
                  controller: _taskController,
                  style: const TextStyle(color: AppTheme.white),
                  decoration: InputDecoration(
                    labelText: 'Tarea *',
                    labelStyle: const TextStyle(color: AppTheme.white70),
                    prefixIcon: const Icon(Icons.assignment, color: Colors.purple),
                    filled: true,
                    fillColor: AppTheme.darkBackground.withOpacity(0.5),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: Colors.purple, width: 2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _taskSubjectController,
                  style: const TextStyle(color: AppTheme.white),
                  decoration: InputDecoration(
                    labelText: 'Materia',
                    labelStyle: const TextStyle(color: AppTheme.white70),
                    prefixIcon: const Icon(Icons.school, color: Colors.purple),
                    filled: true,
                    fillColor: AppTheme.darkBackground.withOpacity(0.5),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: Colors.purple, width: 2),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                // Fecha y Prioridad
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.blue.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.blue.withOpacity(0.3)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.schedule, color: Colors.blue, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'Fecha y Prioridad',
                        style: TextStyle(
                          color: Colors.blue,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                // Selector de fecha
                TextField(
                  readOnly: true,
                  style: const TextStyle(color: AppTheme.white),
                  decoration: InputDecoration(
                    labelText: 'Fecha de entrega *',
                    labelStyle: const TextStyle(color: AppTheme.white70),
                    hintText: _selectedTaskDate != null 
                        ? DateFormat('dd/MM/yyyy').format(_selectedTaskDate!)
                        : 'Seleccionar fecha',
                    hintStyle: TextStyle(
                      color: _selectedTaskDate != null ? AppTheme.white : AppTheme.white60,
                    ),
                    prefixIcon: const Icon(Icons.calendar_today, color: Colors.blue),
                    filled: true,
                    fillColor: AppTheme.darkBackground.withOpacity(0.5),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.blue.withOpacity(0.3)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.blue.withOpacity(0.3)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: Colors.blue, width: 2),
                    ),
                  ),
                  onTap: () async {
                    final date = await showDatePicker(
                      context: context,
                      initialDate: _selectedTaskDate ?? DateTime.now(),
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
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
                        _selectedTaskDate = date;
                      });
                    }
                  },
                ),
                const SizedBox(height: 16),
                // Selector de prioridad
                DropdownButtonFormField<String>(
                  value: _selectedTaskPriority,
                  decoration: InputDecoration(
                    labelText: 'Prioridad',
                    labelStyle: const TextStyle(color: AppTheme.white70),
                    prefixIcon: Icon(
                      _getPriorityIcon(_selectedTaskPriority),
                      color: _getPriorityColor(_selectedTaskPriority),
                    ),
                    filled: true,
                    fillColor: AppTheme.darkBackground.withOpacity(0.5),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.blue.withOpacity(0.3)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.blue.withOpacity(0.3)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: Colors.blue, width: 2),
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
                      _selectedTaskPriority = value ?? 'medium';
                    });
                  },
                ),
                const SizedBox(height: 24),
                // Tiempo y Notas
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.orange.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.orange.withOpacity(0.3)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.access_time, color: Colors.orange, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'Tiempo y Notas',
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
                // Tiempo estimado
                TextField(
                  readOnly: true,
                  style: const TextStyle(color: AppTheme.white),
                  decoration: InputDecoration(
                    labelText: 'Tiempo estimado',
                    labelStyle: const TextStyle(color: AppTheme.white70),
                    hintText: _selectedTaskTime ?? 'Seleccionar tiempo',
                    hintStyle: TextStyle(
                      color: _selectedTaskTime != null ? AppTheme.white : AppTheme.white60,
                    ),
                    prefixIcon: const Icon(Icons.access_time, color: Colors.orange),
                    filled: true,
                    fillColor: AppTheme.darkBackground.withOpacity(0.5),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: Colors.orange, width: 2),
                    ),
                  ),
                  onTap: () {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        backgroundColor: AppTheme.darkSurface,
                        title: const Text('Tiempo estimado', style: TextStyle(color: AppTheme.white)),
                        content: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: ['30 min', '1 hora', '2 horas', '3 horas', '4+ horas'].map((time) {
                            return ListTile(
                              title: Text(time, style: const TextStyle(color: AppTheme.white)),
                              selected: _selectedTaskTime == time,
                              onTap: () {
                                setDialogState(() {
                                  _selectedTaskTime = time;
                                });
                                Navigator.pop(context);
                              },
                            );
                          }).toList(),
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _taskNotesController,
                  style: const TextStyle(color: AppTheme.white),
                  maxLines: 3,
                  decoration: InputDecoration(
                    labelText: 'Notas adicionales',
                    labelStyle: const TextStyle(color: AppTheme.white70),
                    prefixIcon: const Icon(Icons.note_add, color: Colors.orange),
                    filled: true,
                    fillColor: AppTheme.darkBackground.withOpacity(0.5),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: Colors.orange, width: 2),
                    ),
                  ),
                ),
                      ],
                    ),
                  ),
                ),
                // Botones de acción
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppTheme.darkBackground.withOpacity(0.3),
                    borderRadius: const BorderRadius.only(
                      bottomLeft: Radius.circular(28),
                      bottomRight: Radius.circular(28),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      TextButton(
                        onPressed: () => Navigator.of(dialogContext).pop(),
                        child: const Text(
                          'Cancelar',
                          style: TextStyle(color: AppTheme.white60, fontSize: 16),
                        ),
                      ),
                      const SizedBox(width: 12),
                      ElevatedButton(
                        onPressed: isSaving ? null : () async {
                // Limpiar error anterior
                setDialogState(() {
                  errorMessage = null;
                  isSaving = true;
                });

                if (_taskController.text.trim().isEmpty) {
                  setDialogState(() {
                    errorMessage = 'Por favor ingresa la descripción de la tarea';
                    isSaving = false;
                  });
                  return;
                }

                if (_selectedTaskDate == null) {
                  setDialogState(() {
                    errorMessage = 'Por favor selecciona una fecha de entrega';
                    isSaving = false;
                  });
                  return;
                }

                final newAcademicTask = AcademicTask(
                  id: DateTime.now().millisecondsSinceEpoch.toString(),
                  task: _taskController.text.trim(),
                  date: _selectedTaskDate!,
                  completed: false,
                  notes: _taskNotesController.text.trim().isNotEmpty ? _taskNotesController.text.trim() : null,
                  priority: _selectedTaskPriority,
                  subject: _taskSubjectController.text.trim().isNotEmpty ? _taskSubjectController.text.trim() : null,
                  estimatedTime: _selectedTaskTime,
                );

                // Crear tarea en personal automáticamente
                try {
                  final calendarTask = _academicTaskToCalendarTask(newAcademicTask);
                  await _taskService.addTask(calendarTask);
                  print('Tarea personal creada automáticamente para tarea académica: ${newAcademicTask.task}');
                } catch (e) {
                  print('Error al crear tarea personal para tarea académica: $e');
                  // No fallar si no se puede crear la tarea personal
                }

                // Actualizar el estado principal fuera del modal
                setState(() {
                  _academicTasks.add(newAcademicTask);
                });

                _taskController.clear();
                _taskSubjectController.clear();
                _taskNotesController.clear();
                _selectedTaskDate = null;
                _selectedTaskTime = null;

                Navigator.of(dialogContext).pop();
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Tarea agregada exitosamente'),
                      backgroundColor: Colors.green,
                      duration: Duration(seconds: 2),
                    ),
                  );
                }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.purple,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
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
                          : const Text(
                              'Agregar',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
      },
    );
  }

  Widget _buildAddProjectModal() {
    return StatefulBuilder(
      builder: (context, setModalState) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 500),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                AppTheme.darkSurface,
                AppTheme.darkSurfaceVariant,
              ],
            ),
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(
                color: Colors.purple.withOpacity(0.3),
                blurRadius: 24,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header mejorado
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.purple,
                      Colors.deepPurple,
                    ],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(28),
                    topRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(Icons.people, color: AppTheme.white, size: 28),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Nuevo Proyecto Grupal',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Crea un proyecto colaborativo',
                            style: TextStyle(
                              color: AppTheme.white70,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
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
                      icon: const Icon(Icons.close, color: AppTheme.white),
                    ),
                  ],
                ),
              ),
              // Contenido
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
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
                        controller: _projectTitleController,
                        decoration: InputDecoration(
                          labelText: 'Título del Proyecto *',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.title, color: Colors.purple),
                          filled: true,
                          fillColor: AppTheme.darkBackground.withOpacity(0.5),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Colors.purple, width: 2),
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _projectObjectiveController,
                        decoration: InputDecoration(
                          labelText: 'Objetivo *',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.track_changes, color: Colors.purple),
                          filled: true,
                          fillColor: AppTheme.darkBackground.withOpacity(0.5),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Colors.purple, width: 2),
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                        maxLines: 3,
                      ),
                      const SizedBox(height: 24),
                      // Fechas
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.blue.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.blue.withOpacity(0.3)),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.calendar_today, color: Colors.blue, size: 20),
                            SizedBox(width: 8),
                            Text(
                              'Fechas del Proyecto',
                              style: TextStyle(
                                color: Colors.blue,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      GestureDetector(
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
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppTheme.darkBackground.withOpacity(0.5),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.blue.withOpacity(0.3)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.play_arrow, color: Colors.blue, size: 24),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'Fecha de inicio *',
                                      style: TextStyle(
                                        color: AppTheme.white70,
                                        fontSize: 12,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      _selectedProjectStartDate != null 
                                          ? DateFormat('dd/MM/yyyy').format(_selectedProjectStartDate!)
                                          : 'Seleccionar fecha',
                                      style: TextStyle(
                                        color: _selectedProjectStartDate != null 
                                            ? AppTheme.white 
                                            : AppTheme.white40,
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const Icon(Icons.calendar_today, color: Colors.blue),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      GestureDetector(
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
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppTheme.darkBackground.withOpacity(0.5),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.blue.withOpacity(0.3)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.stop, color: Colors.blue, size: 24),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'Fecha de finalización *',
                                      style: TextStyle(
                                        color: AppTheme.white70,
                                        fontSize: 12,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      _selectedProjectEndDate != null 
                                          ? DateFormat('dd/MM/yyyy').format(_selectedProjectEndDate!)
                                          : 'Seleccionar fecha',
                                      style: TextStyle(
                                        color: _selectedProjectEndDate != null 
                                            ? AppTheme.white 
                                            : AppTheme.white40,
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const Icon(Icons.calendar_today, color: Colors.blue),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      // Recursos e Ideas
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.green.withOpacity(0.3)),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.library_books, color: Colors.green, size: 20),
                            SizedBox(width: 8),
                            Text(
                              'Recursos e Ideas',
                              style: TextStyle(
                                color: Colors.green,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _projectResourcesController,
                        decoration: InputDecoration(
                          labelText: 'Recursos',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.library_books, color: Colors.green),
                          filled: true,
                          fillColor: AppTheme.darkBackground.withOpacity(0.5),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.green.withOpacity(0.3)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.green.withOpacity(0.3)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Colors.green, width: 2),
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                        maxLines: 2,
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _projectIdeasController,
                        decoration: InputDecoration(
                          labelText: 'Ideas',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.lightbulb, color: Colors.orange),
                          filled: true,
                          fillColor: AppTheme.darkBackground.withOpacity(0.5),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Colors.orange, width: 2),
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                        maxLines: 2,
                      ),
                      const SizedBox(height: 24),
                      // Pasos de acción
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.orange.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.orange.withOpacity(0.3)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Row(
                              children: [
                                Icon(Icons.list, color: Colors.orange, size: 20),
                                SizedBox(width: 8),
                                Text(
                                  'Pasos de Acción',
                                  style: TextStyle(
                                    color: Colors.orange,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                              ],
                            ),
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
                              icon: const Icon(Icons.add_circle, color: Colors.orange, size: 28),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _projectStepController,
                        decoration: InputDecoration(
                          hintText: 'Agregar paso de acción',
                          hintStyle: const TextStyle(color: AppTheme.white40),
                          prefixIcon: const Icon(Icons.add_task, color: Colors.orange),
                          filled: true,
                          fillColor: AppTheme.darkBackground.withOpacity(0.5),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Colors.orange, width: 2),
                          ),
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
                        const SizedBox(height: 12),
                        ..._projectActionSteps.map((step) => Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppTheme.darkBackground.withOpacity(0.5),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.orange.withOpacity(0.2)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.check_circle_outline, color: Colors.orange, size: 20),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  step['text'] as String,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    color: AppTheme.white,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                              IconButton(
                                onPressed: () {
                                  setModalState(() {
                                    _projectActionSteps = _projectActionSteps.where((s) => s['id'] != step['id']).toList();
                                  });
                                },
                                icon: const Icon(Icons.delete, color: Colors.red, size: 20),
                                padding: EdgeInsets.zero,
                                constraints: const BoxConstraints(),
                              ),
                            ],
                          ),
                        )),
                      ],
                    ],
                  ),
                ),
              ),
              // Botones de acción
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppTheme.darkBackground.withOpacity(0.3),
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(28),
                    bottomRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
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
                      child: const Text(
                        'Cancelar',
                        style: TextStyle(color: AppTheme.white60, fontSize: 16),
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton(
                      onPressed: () async {
                        if (_projectTitleController.text.isNotEmpty && 
                            _projectObjectiveController.text.isNotEmpty &&
                            _selectedProjectStartDate != null &&
                            _selectedProjectEndDate != null) {
                          final newProject = GroupProject(
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
                          );
                          
                          setState(() {
                            _groupProjects.add(newProject);
                            _showAddProjectModal = false;
                            _projectTitleController.clear();
                            _projectObjectiveController.clear();
                            _projectResourcesController.clear();
                            _projectIdeasController.clear();
                            _projectActionSteps = [];
                            _selectedProjectStartDate = null;
                            _selectedProjectEndDate = null;
                          });
                          
                          // Crear evento en personal
                          try {
                            final event = _projectToEvent(newProject);
                            await _eventService.addEvent(event);
                            print('Evento creado automáticamente para proyecto: ${newProject.title}');
                          } catch (e) {
                            print('Error al crear evento para proyecto: $e');
                          }
                          
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Proyecto agregado exitosamente'),
                              backgroundColor: Colors.green,
                            ),
                          );
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Por favor completa todos los campos obligatorios'),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.purple,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Agregar Proyecto',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAddExamModal() {
    return StatefulBuilder(
      builder: (context, setModalState) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 500),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                AppTheme.darkSurface,
                AppTheme.darkSurfaceVariant,
              ],
            ),
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(
                color: Colors.purple.withOpacity(0.3),
                blurRadius: 24,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header mejorado
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.purple,
                      Colors.deepPurple,
                    ],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(28),
                    topRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(Icons.school, color: AppTheme.white, size: 28),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Nuevo Examen',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Planifica y prepara tu examen',
                            style: TextStyle(
                              color: AppTheme.white70,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
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
                      icon: const Icon(Icons.close, color: AppTheme.white),
                    ),
                  ],
                ),
              ),
              // Contenido
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
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
                        controller: _examTopicController,
                        decoration: InputDecoration(
                          labelText: 'Tema del Examen *',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.topic, color: Colors.purple),
                          filled: true,
                          fillColor: AppTheme.darkBackground.withOpacity(0.5),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Colors.purple, width: 2),
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 24),
                      // Fecha del Examen
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.blue.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.blue.withOpacity(0.3)),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.calendar_today, color: Colors.blue, size: 20),
                            SizedBox(width: 8),
                            Text(
                              'Fecha del Examen',
                              style: TextStyle(
                                color: Colors.blue,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      GestureDetector(
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
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppTheme.darkBackground.withOpacity(0.5),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.blue.withOpacity(0.3)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.event, color: Colors.blue, size: 24),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'Fecha del Examen *',
                                      style: TextStyle(
                                        color: AppTheme.white70,
                                        fontSize: 12,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      _selectedExamDate != null 
                                          ? DateFormat('dd/MM/yyyy').format(_selectedExamDate!)
                                          : 'Seleccionar fecha',
                                      style: TextStyle(
                                        color: _selectedExamDate != null 
                                            ? AppTheme.white 
                                            : AppTheme.white40,
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const Icon(Icons.calendar_today, color: Colors.blue),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      // Tareas de Preparación
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
                                Icon(Icons.checklist, color: Colors.green, size: 20),
                                SizedBox(width: 8),
                                Text(
                                  'Tareas de Preparación',
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
                              icon: const Icon(Icons.add_circle, color: Colors.green, size: 28),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _examTodoController,
                        decoration: InputDecoration(
                          hintText: 'Agregar tarea de preparación',
                          hintStyle: const TextStyle(color: AppTheme.white40),
                          prefixIcon: const Icon(Icons.add_task, color: Colors.green),
                          filled: true,
                          fillColor: AppTheme.darkBackground.withOpacity(0.5),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.green.withOpacity(0.3)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.green.withOpacity(0.3)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Colors.green, width: 2),
                          ),
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
                        const SizedBox(height: 12),
                        ..._examTodos.map((todo) => Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppTheme.darkBackground.withOpacity(0.5),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.green.withOpacity(0.2)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.check_circle_outline, color: Colors.green, size: 20),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  todo['text'] as String,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    color: AppTheme.white,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                              IconButton(
                                onPressed: () {
                                  setModalState(() {
                                    _examTodos = _examTodos.where((t) => t['id'] != todo['id']).toList();
                                  });
                                },
                                icon: const Icon(Icons.delete, color: Colors.red, size: 20),
                                padding: EdgeInsets.zero,
                                constraints: const BoxConstraints(),
                              ),
                            ],
                          ),
                        )),
                      ],
                      const SizedBox(height: 24),
                      // Notas de Estudio
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.orange.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.orange.withOpacity(0.3)),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.note, color: Colors.orange, size: 20),
                            SizedBox(width: 8),
                            Text(
                              'Notas de Estudio',
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
                        controller: _examNotesController,
                        decoration: InputDecoration(
                          labelText: 'Notas de Estudio',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.note_add, color: Colors.orange),
                          filled: true,
                          fillColor: AppTheme.darkBackground.withOpacity(0.5),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Colors.orange, width: 2),
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                        maxLines: 3,
                      ),
                    ],
                  ),
                ),
              ),
              // Botones de acción
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppTheme.darkBackground.withOpacity(0.3),
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(28),
                    bottomRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
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
                      child: const Text(
                        'Cancelar',
                        style: TextStyle(color: AppTheme.white60, fontSize: 16),
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton(
                      onPressed: () async {
                        if (_examTopicController.text.isNotEmpty && _selectedExamDate != null) {
                          final newExam = ExamRevision(
                            id: DateTime.now().millisecondsSinceEpoch.toString(),
                            topic: _examTopicController.text,
                            date: _selectedExamDate!,
                            todos: _examTodos.map((todo) => ExamTodo(
                              id: todo['id'] as String,
                              text: todo['text'] as String,
                              completed: todo['completed'] as bool,
                            )).toList(),
                            notes: _examNotesController.text.isNotEmpty ? _examNotesController.text : null,
                          );
                          
                          setState(() {
                            _examRevisions.add(newExam);
                            _showAddExamModal = false;
                            _examTopicController.clear();
                            _examNotesController.clear();
                            _examTodos = [];
                            _selectedExamDate = null;
                          });
                          
                          // Crear evento en personal
                          try {
                            final event = _examToEvent(newExam);
                            await _eventService.addEvent(event);
                            print('Evento creado automáticamente para examen: ${newExam.topic}');
                          } catch (e) {
                            print('Error al crear evento para examen: $e');
                          }
                          
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Examen agregado exitosamente'),
                              backgroundColor: Colors.green,
                            ),
                          );
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Por favor completa todos los campos obligatorios'),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.purple,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Agregar Examen',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAddMaterialModal({Map<String, dynamic>? material}) {
    final TextEditingController titleController = TextEditingController();
    final TextEditingController authorController = TextEditingController();
    final TextEditingController notesController = TextEditingController();
    String? selectedClassId;
    final BuildContext parentContext = context;
    
    // Si estamos editando, llenar los controladores con los datos existentes
    if (material != null) {
      titleController.text = material['title'] ?? material['quote'] ?? material['website'] ?? '';
      authorController.text = material['author'] ?? material['book'] ?? material['login'] ?? '';
      notesController.text = material['notes'] ?? '';
      selectedClassId = material['classId'];
    }
    
    return StatefulBuilder(
      builder: (dialogContext, setModalState) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 500),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                AppTheme.darkSurface,
                AppTheme.darkSurfaceVariant,
              ],
            ),
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(
                color: Colors.purple.withOpacity(0.3),
                blurRadius: 24,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header mejorado
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.purple,
                      Colors.deepPurple,
                    ],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(28),
                    topRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Icon(
                        _currentModalType == 'textbook' 
                            ? Icons.book
                            : _currentModalType == 'online'
                                ? Icons.language
                                : Icons.library_books,
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
                            _editingMaterialIndex != null
                                ? (_currentModalType == 'textbook' 
                                    ? 'Editar Libro de Texto'
                                    : _currentModalType == 'online'
                                        ? 'Editar Recurso Online'
                                        : 'Editar Referencia')
                                : (_currentModalType == 'textbook' 
                                    ? 'Agregar Libro de Texto'
                                    : _currentModalType == 'online'
                                        ? 'Agregar Recurso Online'
                                        : 'Agregar Referencia'),
                            style: const TextStyle(
                              color: AppTheme.white,
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _editingMaterialIndex != null
                                ? 'Modifica la información del material'
                                : (_currentModalType == 'textbook' 
                                    ? 'Organiza tus libros de texto'
                                    : _currentModalType == 'online'
                                        ? 'Guarda recursos en línea'
                                        : 'Agrega referencias bibliográficas'),
                            style: const TextStyle(
                              color: AppTheme.white70,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      onPressed: () {
                        Navigator.pop(dialogContext);
                        if (mounted) {
                          setState(() {
                            _editingMaterialIndex = null;
                          });
                        }
                      },
                      icon: const Icon(Icons.close, color: AppTheme.white),
                    ),
                  ],
                ),
              ),
              // Contenido
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
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
                      if (_currentModalType == 'textbook') ...[
                        TextField(
                          controller: titleController,
                          decoration: InputDecoration(
                            labelText: 'Título del Libro *',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.book, color: Colors.purple),
                            filled: true,
                            fillColor: AppTheme.darkBackground.withOpacity(0.5),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Colors.purple, width: 2),
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: authorController,
                          decoration: InputDecoration(
                            labelText: 'Autor',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.person, color: Colors.purple),
                            filled: true,
                            fillColor: AppTheme.darkBackground.withOpacity(0.5),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Colors.purple, width: 2),
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                      ] else if (_currentModalType == 'online') ...[
                        TextField(
                          controller: titleController,
                          decoration: InputDecoration(
                            labelText: 'Sitio Web *',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.language, color: Colors.green),
                            filled: true,
                            fillColor: AppTheme.darkBackground.withOpacity(0.5),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.green.withOpacity(0.3)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.green.withOpacity(0.3)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Colors.green, width: 2),
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: authorController,
                          decoration: InputDecoration(
                            labelText: 'Usuario/Login',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.person, color: Colors.green),
                            filled: true,
                            fillColor: AppTheme.darkBackground.withOpacity(0.5),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.green.withOpacity(0.3)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.green.withOpacity(0.3)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Colors.green, width: 2),
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                      ] else ...[
                        TextField(
                          controller: titleController,
                          decoration: InputDecoration(
                            labelText: 'Cita/Referencia *',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.format_quote, color: Colors.orange),
                            filled: true,
                            fillColor: AppTheme.darkBackground.withOpacity(0.5),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Colors.orange, width: 2),
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                          maxLines: 3,
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: authorController,
                          decoration: InputDecoration(
                            labelText: 'Libro/Autor',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.book, color: Colors.orange),
                            filled: true,
                            fillColor: AppTheme.darkBackground.withOpacity(0.5),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Colors.orange, width: 2),
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                      ],
                      const SizedBox(height: 24),
                      // Relación con Clase
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.blue.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.blue.withOpacity(0.3)),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.school, color: Colors.blue, size: 20),
                            SizedBox(width: 8),
                            Text(
                              'Relación con Clase',
                              style: TextStyle(
                                color: Colors.blue,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      if (_classes.isEmpty)
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppTheme.darkBackground.withOpacity(0.5),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.blue.withOpacity(0.2)),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.info_outline, color: Colors.blue, size: 20),
                              SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  'No hay clases registradas. Ve a "Horario" para agregar clases.',
                                  style: TextStyle(
                                    color: AppTheme.white70,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        )
                      else
                        GestureDetector(
                          onTap: () {
                            showDialog(
                              context: dialogContext,
                              builder: (selectContext) => AlertDialog(
                                backgroundColor: AppTheme.darkSurface,
                                title: const Text(
                                  'Seleccionar Clase',
                                  style: TextStyle(color: AppTheme.white),
                                ),
                                content: SizedBox(
                                  width: double.maxFinite,
                                  child: ListView.builder(
                                    shrinkWrap: true,
                                    itemCount: _classes.length,
                                    itemBuilder: (context, index) {
                                      final classItem = _classes[index];
                                      final isSelected = selectedClassId == classItem.id;
                                      return ListTile(
                                        leading: Icon(
                                          Icons.school,
                                          color: isSelected ? Colors.blue : AppTheme.white70,
                                        ),
                                        title: Text(
                                          classItem.subject,
                                          style: TextStyle(
                                            color: isSelected ? Colors.blue : AppTheme.white,
                                            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                          ),
                                        ),
                                        subtitle: Text(
                                          '${classItem.day} - ${classItem.time}',
                                          style: const TextStyle(color: AppTheme.white60),
                                        ),
                                        trailing: isSelected
                                            ? const Icon(Icons.check_circle, color: Colors.blue)
                                            : null,
                                        onTap: () {
                                          setModalState(() {
                                            selectedClassId = classItem.id;
                                          });
                                          Navigator.pop(selectContext);
                                        },
                                      );
                                    },
                                  ),
                                ),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(selectContext),
                                    child: const Text('Cancelar'),
                                  ),
                                  if (selectedClassId != null)
                                    TextButton(
                                      onPressed: () {
                                        setModalState(() {
                                          selectedClassId = null;
                                        });
                                        Navigator.pop(selectContext);
                                      },
                                      child: const Text('Limpiar'),
                                    ),
                                ],
                              ),
                            );
                          },
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppTheme.darkBackground.withOpacity(0.5),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.blue.withOpacity(0.3)),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.school, color: Colors.blue, size: 24),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Clase relacionada',
                                        style: TextStyle(
                                          color: AppTheme.white70,
                                          fontSize: 12,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        selectedClassId != null
                                            ? _classes.firstWhere((c) => c.id == selectedClassId).subject
                                            : 'Seleccionar clase (opcional)',
                                        style: TextStyle(
                                          color: selectedClassId != null 
                                              ? AppTheme.white 
                                              : AppTheme.white40,
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                      if (selectedClassId != null) ...[
                                        const SizedBox(height: 4),
                                        Text(
                                          '${_classes.firstWhere((c) => c.id == selectedClassId).day} - ${_classes.firstWhere((c) => c.id == selectedClassId).time}',
                                          style: const TextStyle(
                                            color: AppTheme.white60,
                                            fontSize: 12,
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                                Icon(
                                  selectedClassId != null ? Icons.check_circle : Icons.arrow_forward_ios,
                                  color: selectedClassId != null ? Colors.blue : AppTheme.white60,
                                  size: 20,
                                ),
                              ],
                            ),
                          ),
                        ),
                      const SizedBox(height: 24),
                      // Notas
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.orange.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.orange.withOpacity(0.3)),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.note, color: Colors.orange, size: 20),
                            SizedBox(width: 8),
                            Text(
                              'Notas',
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
                        controller: notesController,
                        decoration: InputDecoration(
                          labelText: 'Notas',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.note_add, color: Colors.orange),
                          filled: true,
                          fillColor: AppTheme.darkBackground.withOpacity(0.5),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: Colors.orange, width: 2),
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                        maxLines: 2,
                      ),
                    ],
                  ),
                ),
              ),
              // Botones de acción
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppTheme.darkBackground.withOpacity(0.3),
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(28),
                    bottomRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () {
                        Navigator.pop(dialogContext);
                        if (mounted) {
                          setState(() {
                            _editingMaterialIndex = null;
                          });
                        }
                      },
                      child: const Text(
                        'Cancelar',
                        style: TextStyle(color: AppTheme.white60, fontSize: 16),
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton(
                      onPressed: () {
                        if (titleController.text.isNotEmpty) {
                          final isEditing = _editingMaterialIndex != null;
                          Map<String, dynamic> material;
                          
                          if (_currentModalType == 'textbook') {
                            material = {
                              'id': isEditing && _textbooks[_editingMaterialIndex!]['id'] != null
                                  ? _textbooks[_editingMaterialIndex!]['id']
                                  : DateTime.now().millisecondsSinceEpoch.toString(),
                              'title': titleController.text,
                              'author': authorController.text.isNotEmpty ? authorController.text : null,
                              'notes': notesController.text.isNotEmpty ? notesController.text : null,
                              'classId': selectedClassId,
                              'className': selectedClassId != null 
                                  ? _classes.firstWhere((c) => c.id == selectedClassId).subject
                                  : null,
                            };
                            if (isEditing) {
                              _textbooks[_editingMaterialIndex!] = material;
                            } else {
                              _textbooks.add(material);
                            }
                          } else if (_currentModalType == 'online') {
                            material = {
                              'id': isEditing && _onlineResources[_editingMaterialIndex!]['id'] != null
                                  ? _onlineResources[_editingMaterialIndex!]['id']
                                  : DateTime.now().millisecondsSinceEpoch.toString(),
                              'website': titleController.text,
                              'login': authorController.text.isNotEmpty ? authorController.text : null,
                              'notes': notesController.text.isNotEmpty ? notesController.text : null,
                              'classId': selectedClassId,
                              'className': selectedClassId != null 
                                  ? _classes.firstWhere((c) => c.id == selectedClassId).subject
                                  : null,
                            };
                            if (isEditing) {
                              _onlineResources[_editingMaterialIndex!] = material;
                            } else {
                              _onlineResources.add(material);
                            }
                          } else {
                            material = {
                              'id': isEditing && _references[_editingMaterialIndex!]['id'] != null
                                  ? _references[_editingMaterialIndex!]['id']
                                  : DateTime.now().millisecondsSinceEpoch.toString(),
                              'quote': titleController.text,
                              'book': authorController.text.isNotEmpty ? authorController.text : null,
                              'notes': notesController.text.isNotEmpty ? notesController.text : null,
                              'classId': selectedClassId,
                              'className': selectedClassId != null 
                                  ? _classes.firstWhere((c) => c.id == selectedClassId).subject
                                  : null,
                            };
                            if (isEditing) {
                              _references[_editingMaterialIndex!] = material;
                            } else {
                              _references.add(material);
                            }
                          }
                          
                          // Cerrar el diálogo primero
                          Navigator.pop(dialogContext);
                          
                          // Actualizar el estado del widget padre después de cerrar el diálogo
                          Future.delayed(const Duration(milliseconds: 100), () {
                            if (mounted) {
                              setState(() {
                                _editingMaterialIndex = null;
                                // Forzar actualización de la UI
                              });
                              ScaffoldMessenger.of(parentContext).showSnackBar(
                                SnackBar(
                                  content: Text(isEditing 
                                      ? 'Material actualizado exitosamente'
                                      : 'Material agregado exitosamente'),
                                  backgroundColor: Colors.green,
                                ),
                              );
                            }
                          });
                        } else {
                          ScaffoldMessenger.of(dialogContext).showSnackBar(
                            const SnackBar(
                              content: Text('Por favor completa el título'),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.purple,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        _editingMaterialIndex != null ? 'Guardar' : 'Agregar',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAddClassOverviewModal() {
    return StatefulBuilder(
      builder: (context, setModalState) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 600, maxHeight: 700),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                AppTheme.darkSurface,
                AppTheme.darkSurfaceVariant,
              ],
            ),
            borderRadius: BorderRadius.circular(28),
            boxShadow: [
              BoxShadow(
                color: Colors.purple.withOpacity(0.3),
                blurRadius: 24,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header mejorado
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.purple,
                      Colors.deepPurple,
                    ],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(28),
                    topRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(
                        Icons.school,
                        color: AppTheme.white,
                        size: 28,
                      ),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Resumen de Clase',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Organiza toda la información de tu curso',
                            style: TextStyle(
                              color: AppTheme.white70,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
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
                          _courseNotesUrlController.clear();
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
                      icon: const Icon(Icons.close, color: AppTheme.white),
                    ),
                  ],
                ),
              ),
              // Contenido
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
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
                decoration: InputDecoration(
                  labelText: 'Nombre del Curso *',
                  labelStyle: const TextStyle(color: AppTheme.white70),
                  prefixIcon: const Icon(Icons.school, color: Colors.purple),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.purple, width: 2),
                  ),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseTimeController,
                decoration: InputDecoration(
                  labelText: 'Horario',
                  labelStyle: const TextStyle(color: AppTheme.white70),
                  prefixIcon: const Icon(Icons.access_time, color: Colors.purple),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.purple, width: 2),
                  ),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseLocationController,
                decoration: InputDecoration(
                  labelText: 'Ubicación',
                  labelStyle: const TextStyle(color: AppTheme.white70),
                  prefixIcon: const Icon(Icons.location_on, color: Colors.purple),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.purple, width: 2),
                  ),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseInstructorController,
                decoration: InputDecoration(
                  labelText: 'Instructor',
                  labelStyle: const TextStyle(color: AppTheme.white70),
                  prefixIcon: const Icon(Icons.person, color: Colors.purple),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.purple, width: 2),
                  ),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseContactInfoController,
                decoration: InputDecoration(
                  labelText: 'Información de Contacto',
                  labelStyle: const TextStyle(color: AppTheme.white70),
                  prefixIcon: const Icon(Icons.contact_mail, color: Colors.purple),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.purple, width: 2),
                  ),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseOfficeHoursController,
                decoration: InputDecoration(
                  labelText: 'Horario de Atención',
                  labelStyle: const TextStyle(color: AppTheme.white70),
                  prefixIcon: const Icon(Icons.schedule, color: Colors.purple),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.purple, width: 2),
                  ),
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
                decoration: InputDecoration(
                  labelText: 'Cuenta/Plataforma',
                  labelStyle: const TextStyle(color: AppTheme.white70),
                  prefixIcon: const Icon(Icons.account_circle, color: Colors.orange),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.orange, width: 2),
                  ),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseAccessLoginController,
                decoration: InputDecoration(
                  labelText: 'Usuario/Login',
                  labelStyle: const TextStyle(color: AppTheme.white70),
                  prefixIcon: const Icon(Icons.person_outline, color: Colors.orange),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.orange, width: 2),
                  ),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseAccessPasswordController,
                decoration: InputDecoration(
                  labelText: 'Contraseña',
                  labelStyle: const TextStyle(color: AppTheme.white70),
                  prefixIcon: const Icon(Icons.lock, color: Colors.orange),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.orange.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.orange, width: 2),
                  ),
                ),
                obscureText: true,
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 24),
              
              // Apuntes Digitales
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.blue.withOpacity(0.3)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.description, color: Colors.blue, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Apuntes Digitales',
                      style: TextStyle(
                        color: Colors.blue,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseNotesUrlController,
                decoration: InputDecoration(
                  labelText: 'URL de Apuntes Digitales',
                  labelStyle: const TextStyle(color: AppTheme.white70),
                  hintText: 'https://ejemplo.com/apuntes',
                  hintStyle: const TextStyle(color: AppTheme.white40),
                  prefixIcon: const Icon(Icons.link, color: Colors.blue),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.blue.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.blue.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.blue, width: 2),
                  ),
                ),
                keyboardType: TextInputType.url,
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
                decoration: InputDecoration(
                  hintText: 'Descripción de la fecha importante',
                  hintStyle: const TextStyle(color: AppTheme.white40),
                  prefixIcon: const Icon(Icons.event, color: Colors.green),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.green.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.green.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.green, width: 2),
                  ),
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
                const SizedBox(height: 12),
                ..._importantDates.map((date) => Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.green.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.event, color: Colors.green, size: 18),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          date['description'],
                          style: const TextStyle(color: AppTheme.white, fontSize: 14, fontWeight: FontWeight.w500),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete, color: Colors.red, size: 20),
                        onPressed: () {
                          setModalState(() {
                            _importantDates = _importantDates.where((d) => d['id'] != date['id']).toList();
                          });
                        },
                      ),
                    ],
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
              TextField(
                controller: _gradingComponentNameController,
                decoration: InputDecoration(
                  labelText: 'Nombre del componente',
                  labelStyle: const TextStyle(color: AppTheme.white70),
                  prefixIcon: const Icon(Icons.description, color: Colors.blue),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.blue.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.blue.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.blue, width: 2),
                  ),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _gradingComponentWeightController,
                decoration: InputDecoration(
                  labelText: 'Peso (%)',
                  labelStyle: const TextStyle(color: AppTheme.white70),
                  prefixIcon: const Icon(Icons.percent, color: Colors.blue),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.blue.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.blue.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.blue, width: 2),
                  ),
                ),
                keyboardType: TextInputType.number,
                style: const TextStyle(color: AppTheme.white),
              ),
              if (_gradingComponents.isNotEmpty) ...[
                const SizedBox(height: 12),
                ..._gradingComponents.map((component) => Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.blue.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.blue.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.blue.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.check_circle_outline, color: Colors.blue, size: 18),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              component['name'],
                              style: const TextStyle(color: AppTheme.white, fontSize: 14, fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Peso: ${component['weight']}',
                              style: const TextStyle(color: AppTheme.white60, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete, color: Colors.red, size: 20),
                        onPressed: () {
                          setModalState(() {
                            _gradingComponents = _gradingComponents.where((c) => c['id'] != component['id']).toList();
                          });
                        },
                      ),
                    ],
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
              TextField(
                controller: _courseTargetGradeController,
                decoration: InputDecoration(
                  labelText: 'Calificación Objetivo',
                  labelStyle: const TextStyle(color: AppTheme.white70),
                  prefixIcon: const Icon(Icons.track_changes, color: Colors.purple),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.purple, width: 2),
                  ),
                ),
                keyboardType: TextInputType.number,
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _courseActualGradeController,
                decoration: InputDecoration(
                  labelText: 'Calificación Actual',
                  labelStyle: const TextStyle(color: AppTheme.white70),
                  prefixIcon: const Icon(Icons.check_circle, color: Colors.purple),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.purple, width: 2),
                  ),
                ),
                keyboardType: TextInputType.number,
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 24),
              
              // Notas
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.purple.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.purple.withOpacity(0.3)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.note, color: Colors.purple, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Notas Adicionales',
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
                controller: _courseNotesController,
                decoration: InputDecoration(
                  labelText: 'Notas Adicionales',
                  labelStyle: const TextStyle(color: AppTheme.white70),
                  prefixIcon: const Icon(Icons.note_add, color: Colors.purple),
                  filled: true,
                  fillColor: AppTheme.darkBackground.withOpacity(0.5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.purple.withOpacity(0.3)),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.purple, width: 2),
                  ),
                ),
                style: const TextStyle(color: AppTheme.white),
                maxLines: 4,
              ),
                    ],
                  ),
                ),
              ),
              // Botones de acción
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppTheme.darkBackground.withOpacity(0.3),
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(28),
                    bottomRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
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
                          _courseNotesUrlController.clear();
                          _importantDates = [];
                          _gradingComponents = [];
                          _importantDateController.clear();
                          _gradingComponentNameController.clear();
                          _gradingComponentWeightController.clear();
                        });
                        Navigator.pop(context);
                      },
                      child: const Text(
                        'Cancelar',
                        style: TextStyle(color: AppTheme.white60, fontSize: 16),
                      ),
                    ),
                    const SizedBox(width: 12),
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
                              'notesUrl': _courseNotesUrlController.text.isNotEmpty ? _courseNotesUrlController.text : null,
                              'targetGrade': _courseTargetGradeController.text.isNotEmpty ? _courseTargetGradeController.text : null,
                              'actualGrade': _courseActualGradeController.text.isNotEmpty ? _courseActualGradeController.text : null,
                              'importantDates': List<Map<String, dynamic>>.from(_importantDates),
                              'gradingComponents': List<Map<String, dynamic>>.from(_gradingComponents),
                            };
                            _showAddClassOverviewModal = false;
                          });
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Clase guardada exitosamente'),
                              backgroundColor: Colors.green,
                            ),
                          );
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Por favor ingresa el nombre del curso'),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.purple,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Guardar',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
