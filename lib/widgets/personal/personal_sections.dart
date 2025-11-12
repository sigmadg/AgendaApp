import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../models/calendar/calendar_task.dart';
import '../../models/event/event_organization.dart';
import '../../auth/providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../../services/event_service.dart';
import '../../services/task_service.dart';
import '../../services/settings_service.dart';
import '../../services/class_schedule_service.dart';
import '../../models/school/class_schedule.dart';
import '../../models/school/academic_task.dart';
import '../calendar/calendar_view.dart';
import '../event/events_sections.dart';
import '../common/navigation_header.dart';

class PersonalSections extends StatefulWidget {
  final String? initialSection;
  
  const PersonalSections({super.key, this.initialSection});

  @override
  State<PersonalSections> createState() => _PersonalSectionsState();
}

class _PersonalSectionsState extends State<PersonalSections> {
  late String _activeSection;
  DateTime _selectedDate = DateTime.now();
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  late ScrollController _dateScrollController;
  String _viewMode = 'day'; // 'day', 'week', 'month'
  
  List<CalendarTask> _tasks = [];
  List<EventOrganization> _events = [];
  final EventService _eventService = EventService();
  final TaskService _taskService = TaskService();
  final SettingsService _settingsService = SettingsService();
  final ClassScheduleService _classScheduleService = ClassScheduleService();
  bool _isLoadingEvents = false;
  bool _isLoadingTasks = false;
  
  // Configuraciones de usuario
  Map<String, dynamic>? _userSettings;
  Map<String, bool> _activeSections = {};
  bool _isLoadingSettings = false;

  @override
  void initState() {
    super.initState();
    _activeSection = widget.initialSection ?? 'events';
    _selectedDate = DateTime.now(); // Inicializar con la fecha actual
    _dateScrollController = ScrollController();
    // Inicializar scroll al día de hoy después de que se construya el widget
    WidgetsBinding.instance.addPostFrameCallback((_) {
      // Scroll inicial: centrar el día actual (día 14 de 30)
      // Cada día ocupa aproximadamente 63px de ancho (55px + 8px padding)
      if (_dateScrollController.hasClients) {
        final dayWidth = 63.0; // 55px width + 8px padding
        final todayIndex = 14; // El día actual está en el índice 14
        // Centrar el día actual en la pantalla
        final scrollPosition = todayIndex * dayWidth;
        _dateScrollController.animateTo(
          scrollPosition.clamp(0.0, _dateScrollController.position.maxScrollExtent),
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
    _loadEvents();
    _loadTasks();
    _loadSettings();
    _syncClassesToEvents(); // Sincronizar clases existentes como eventos
  }

  @override
  void dispose() {
    _dateScrollController.dispose();
    super.dispose();
  }

  final sections = [
    {'id': 'events', 'name': 'Eventos del día', 'icon': Icons.calendar_today},
    {'id': 'tasks', 'name': 'Tareas', 'icon': Icons.check_circle},
    {'id': 'profile', 'name': 'Perfil', 'icon': Icons.person},
    {'id': 'settings', 'name': 'Configuración', 'icon': Icons.settings},
  ];

  // Color rojo carmesí pastel rosado
  static const Color _carminePastel = Color(0xFFFF8FA3);
  
  // Colores del arcoíris
  List<Color> get _rainbowColors => [
    Colors.red,
    _carminePastel,
    Colors.amber,
    Colors.green,
    Colors.blue,
    Colors.indigo,
    Colors.purple,
  ];

  // Gradiente arcoíris
  LinearGradient get _rainbowGradient => LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: _rainbowColors,
  );

  // Obtener color arcoíris por índice (cíclico)
  Color _getRainbowColor(int index) {
    return _rainbowColors[index % _rainbowColors.length];
  }

  // Obtener color arcoíris para sección
  Color _getRainbowColorForSection(String sectionId) {
    final index = sections.indexWhere((s) => s['id'] == sectionId);
    return index >= 0 ? _getRainbowColor(index) : _carminePastel;
  }

  Color _getEventColor(String? type) {
    // Usar colores arcoíris para eventos
    switch (type) {
      case 'work':
        return Colors.blue;
      case 'personal':
        return Colors.purple;
      case 'health':
        return Colors.green;
      case 'finance':
        return _carminePastel;
      case 'education':
        return Colors.indigo;
      case 'social':
        return Colors.pink;
      case 'travel':
        return Colors.cyan;
      default:
        return Colors.amber;
    }
  }

  String _getEventEmoji(String? type) {
    switch (type) {
      case 'work':
        return '💼';
      case 'personal':
        return '👤';
      case 'health':
        return '🏥';
      case 'finance':
        return '💰';
      case 'education':
        return '📚';
      case 'social':
        return '👥';
      case 'travel':
        return '✈️';
      default:
        return '📅';
    }
  }

  String _getEventTypeLabel(String? type) {
    switch (type) {
      case 'work':
        return 'Trabajo';
      case 'personal':
        return 'Personal';
      case 'health':
        return 'Salud';
      case 'finance':
        return 'Finanzas';
      case 'education':
        return 'Educación';
      case 'social':
        return 'Social';
      case 'travel':
        return 'Viaje';
      default:
        return 'General';
    }
  }

  Color _getTaskColor(String? priority) {
    switch (priority) {
      case 'high':
        return Colors.red;
      case 'medium':
        return _carminePastel;
      case 'low':
        return Colors.green;
      default:
        return AppTheme.white60;
    }
  }

  String _getTaskPriorityEmoji(String? priority) {
    switch (priority) {
      case 'high':
        return '🔥';
      case 'medium':
        return '⭐';
      case 'low':
        return '🌱';
      default:
        return '📝';
    }
  }

  String _getTaskPriorityLabel(String? priority) {
    switch (priority) {
      case 'high':
        return 'Alta Prioridad';
      case 'medium':
        return 'Media Prioridad';
      case 'low':
        return 'Baja Prioridad';
      default:
        return 'Sin Prioridad';
    }
  }

  List<EventOrganization> _getEventsForDate(DateTime date) {
    return _events.where((event) {
      try {
        final eventDate = DateFormat('yyyy-MM-dd').parse(event.date);
        return eventDate.year == date.year &&
               eventDate.month == date.month &&
               eventDate.day == date.day;
      } catch (e) {
        return false;
      }
    }).toList();
  }

  // Obtener eventos para una semana
  List<EventOrganization> _getEventsForWeek(DateTime startDate) {
    final endDate = startDate.add(const Duration(days: 6));
    return _events.where((event) {
      try {
        final eventDate = DateFormat('yyyy-MM-dd').parse(event.date);
        return eventDate.isAfter(startDate.subtract(const Duration(days: 1))) &&
               eventDate.isBefore(endDate.add(const Duration(days: 1)));
      } catch (e) {
        return false;
      }
    }).toList();
  }

  // Obtener eventos para un mes
  List<EventOrganization> _getEventsForMonth(DateTime date) {
    final firstDay = DateTime(date.year, date.month, 1);
    final lastDay = DateTime(date.year, date.month + 1, 0);
    return _events.where((event) {
      try {
        final eventDate = DateFormat('yyyy-MM-dd').parse(event.date);
        return eventDate.isAfter(firstDay.subtract(const Duration(days: 1))) &&
               eventDate.isBefore(lastDay.add(const Duration(days: 1)));
      } catch (e) {
        return false;
      }
    }).toList();
  }

  // Obtener el inicio de la semana (lunes)
  DateTime _getWeekStart(DateTime date) {
    final weekday = date.weekday;
    return date.subtract(Duration(days: weekday - 1));
  }

  // Obtener el número de semana del año (1-52/53)
  int _getWeekNumber(DateTime date) {
    final weekStart = _getWeekStart(date);
    final yearStart = DateTime(date.year, 1, 1);
    final firstWeekStart = _getWeekStart(yearStart);
    final daysDifference = weekStart.difference(firstWeekStart).inDays;
    return (daysDifference ~/ 7) + 1;
  }

  List<CalendarTask> _getTasksForDate(DateTime date) {
    return _tasks.where((task) {
      return task.date.year == date.year &&
             task.date.month == date.month &&
             task.date.day == date.day;
    }).toList();
  }

  // Obtener tareas para una semana
  List<CalendarTask> _getTasksForWeek(DateTime startDate) {
    final endDate = startDate.add(const Duration(days: 6));
    return _tasks.where((task) {
      return task.date.isAfter(startDate.subtract(const Duration(days: 1))) &&
             task.date.isBefore(endDate.add(const Duration(days: 1)));
    }).toList();
  }

  // Obtener tareas para un mes
  List<CalendarTask> _getTasksForMonth(DateTime date) {
    final firstDay = DateTime(date.year, date.month, 1);
    final lastDay = DateTime(date.year, date.month + 1, 0);
    return _tasks.where((task) {
      return task.date.isAfter(firstDay.subtract(const Duration(days: 1))) &&
             task.date.isBefore(lastDay.add(const Duration(days: 1)));
    }).toList();
  }

  // Cargar configuraciones desde Supabase
  Future<void> _loadSettings() async {
    setState(() {
      _isLoadingSettings = true;
    });

    try {
      final settings = await _settingsService.getSettings();
      if (settings != null) {
        setState(() {
          _userSettings = settings;
          _activeSections = Map<String, bool>.from(
            settings['active_sections'] as Map<String, dynamic>? ?? {},
          );
          _isLoadingSettings = false;
        });
        print('Settings loaded: ${_activeSections}');
      } else {
        // Si no hay configuraciones, usar valores por defecto
        setState(() {
          _activeSections = {
            'personal': true,
            'work': true,
            'school': true,
            'health': true,
            'finance': true,
            'language': true,
            'menstrual': true,
            'pet': true,
            'selfcare': true,
            'travel': true,
            'reading': true,
            'movies': true,
            'entrepreneurship': true,
          };
          _isLoadingSettings = false;
        });
      }
    } catch (e) {
      print('Error al cargar configuraciones: $e');
      setState(() {
        _isLoadingSettings = false;
      });
    }
  }

  // Función helper para convertir fecha a día de la semana
  String _convertDateToDay(String dateString) {
    try {
      final date = DateFormat('yyyy-MM-dd').parse(dateString);
      final weekday = date.weekday;
      final dayMap = {
        1: 'LUN',
        2: 'MAR',
        3: 'MIÉ',
        4: 'JUE',
        5: 'VIE',
        6: 'SÁB',
        7: 'DOM',
      };
      return dayMap[weekday] ?? 'LUN';
    } catch (e) {
      return 'LUN';
    }
  }

  // Función helper para convertir CalendarTask a AcademicTask
  AcademicTask? _calendarTaskToAcademicTask(CalendarTask calendarTask) {
    // Solo convertir si es una tarea de escuela
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

  // Función helper para convertir EventOrganization a ClassSchedule
  ClassSchedule? _eventToClass(EventOrganization event) {
    // Solo convertir si es un evento de educación/escuela
    if (event.type != 'education' && event.category != 'school') {
      return null;
    }

    // Necesitamos al menos nombre y hora para crear una clase
    if (event.eventName.isEmpty || event.time == null || event.time!.isEmpty) {
      return null;
    }

    final day = _convertDateToDay(event.date);
    
    // Extraer información del aula desde location o notes
    String? classroom;
    String? professor;
    
    if (event.location != null && event.location!.isNotEmpty) {
      classroom = event.location;
    }
    
    if (event.notes != null && event.notes!.isNotEmpty) {
      // Intentar extraer profesor de las notas
      final notes = event.notes!;
      if (notes.contains('Profesor:')) {
        final professorMatch = RegExp(r'Profesor:\s*(.+)').firstMatch(notes);
        if (professorMatch != null) {
          professor = professorMatch.group(1)?.trim();
        }
      }
      if (notes.contains('Aula:')) {
        final classroomMatch = RegExp(r'Aula:\s*(.+)').firstMatch(notes);
        if (classroomMatch != null && classroom == null) {
          classroom = classroomMatch.group(1)?.trim();
        }
      }
    }

    // Si el evento ya tiene un ID de clase, usarlo; si no, crear uno nuevo
    final classId = event.id.endsWith('_class') 
        ? event.id.replaceAll('_class', '')
        : '${event.id}_class';
    
    return ClassSchedule(
      id: classId,
      subject: event.eventName,
      day: day,
      time: event.time!,
      classroom: classroom,
      professor: professor,
      duration: 60, // Duración por defecto
      link: null,
    );
  }

  // Sincronizar clases existentes como eventos
  Future<void> _syncClassesToEvents() async {
    try {
      final classes = await _classScheduleService.getClassSchedules();
      final existingEvents = await _eventService.getAllEvents();
      
      // Crear eventos para clases que no tienen evento asociado
      for (final classItem in classes) {
        final eventId = '${classItem.id}_event';
        final hasEvent = existingEvents.any((e) => e.id == eventId);
        
        if (!hasEvent) {
          try {
            final date = _convertDayToDateForClass(classItem.day);
            final notes = <String>[];
            if (classItem.professor != null && classItem.professor!.isNotEmpty) {
              notes.add('Profesor: ${classItem.professor}');
            }
            if (classItem.classroom != null && classItem.classroom!.isNotEmpty) {
              notes.add('Aula: ${classItem.classroom}');
            }
            if (classItem.link != null && classItem.link!.isNotEmpty) {
              notes.add('Link: ${classItem.link}');
            }
            
            final event = EventOrganization(
              id: eventId,
              eventName: classItem.subject,
              date: date,
              time: classItem.time,
              location: classItem.classroom,
              category: 'school',
              type: 'class',
              notes: notes.isNotEmpty ? notes.join('\n') : null,
            );
            
            await _eventService.addEvent(event);
            print('Evento sincronizado para clase: ${classItem.subject}');
          } catch (e) {
            print('Error al sincronizar evento para clase: $e');
          }
        }
      }
    } catch (e) {
      print('Error al sincronizar clases: $e');
    }
  }

  // Función helper para convertir día de la semana a fecha (próxima ocurrencia)
  String _convertDayToDateForClass(String day) {
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

  // Cargar eventos desde Supabase
  Future<void> _loadEvents() async {
    setState(() {
      _isLoadingEvents = true;
    });

    try {
      final events = await _eventService.getAllEvents();
      setState(() {
        _events = events;
        _isLoadingEvents = false;
      });
    } catch (e) {
      print('Error al cargar eventos: $e');
      setState(() {
        _isLoadingEvents = false;
      });
    }
  }

  // Función para verificar empalmes de eventos
  Future<List<EventOrganization>> _checkEventOverlaps(String date, String? time) async {
    if (time == null || time.isEmpty) return [];
    
    try {
      return _events.where((event) {
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
              style: TextStyle(color: AppTheme.white70),
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
              style: TextStyle(color: AppTheme.white70, fontWeight: FontWeight.w500),
            ),
          ],
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
              backgroundColor: Colors.orange,
              foregroundColor: AppTheme.white,
            ),
            child: const Text('Crear de todas formas'),
          ),
        ],
      ),
    ) ?? false;
  }

  // Cargar tareas desde Supabase
  Future<void> _loadTasks() async {
    setState(() {
      _isLoadingTasks = true;
    });

    try {
      final tasks = await _taskService.getAllTasks();
      setState(() {
        _tasks = tasks;
        _isLoadingTasks = false;
      });
      print('Tareas cargadas: ${tasks.length}');
    } catch (e) {
      print('Error al cargar tareas: $e');
      setState(() {
        _isLoadingTasks = false;
      });
    }
  }

  // Cargar tareas para la fecha seleccionada
  Future<void> _loadTasksForDate(DateTime date) async {
    try {
      final tasks = await _taskService.getTasksForDate(date);
      setState(() {
        // Actualizar solo las tareas de esta fecha, mantener las demás
        _tasks.removeWhere((t) {
          return t.date.year == date.year &&
                 t.date.month == date.month &&
                 t.date.day == date.day;
        });
        _tasks.addAll(tasks);
      });
    } catch (e) {
      print('Error al cargar tareas para la fecha: $e');
    }
  }

  // Cargar eventos para la fecha seleccionada
  Future<void> _loadEventsForDate(DateTime date) async {
    try {
      final events = await _eventService.getEventsForDate(date);
      setState(() {
        // Actualizar solo los eventos de esta fecha, mantener los demás
        _events.removeWhere((e) {
          try {
            final eventDate = DateFormat('yyyy-MM-dd').parse(e.date);
            return eventDate.year == date.year &&
                   eventDate.month == date.month &&
                   eventDate.day == date.day;
          } catch (_) {
            return false;
          }
        });
        _events.addAll(events);
      });
    } catch (e) {
      print('Error al cargar eventos para la fecha: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;

    // Obtener eventos y tareas para la fecha seleccionada para mostrar/ocultar los botones
    final eventsForSelectedDate = _getEventsForDate(_selectedDate);
    final tasksForSelectedDate = _getTasksForDate(_selectedDate);
    
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: Colors.transparent,
      drawer: _buildNavigationDrawer(context, authProvider),
      appBar: NavigationHeader(currentSection: 'personal'),
      floatingActionButton: _activeSection == 'events' && eventsForSelectedDate.isNotEmpty
          ? Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Colors.red,
                    _carminePastel,
                  ],
                ),
                borderRadius: BorderRadius.circular(28),
                boxShadow: [
                  BoxShadow(
                    color: Colors.red.withOpacity(0.4),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: FloatingActionButton.extended(
                onPressed: () => _showAddEventDialog(context),
                backgroundColor: Colors.transparent,
                elevation: 0,
                icon: const Icon(Icons.event, color: AppTheme.white),
                label: const Text(
                  'Nuevo Evento',
              style: TextStyle(
                    color: AppTheme.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                tooltip: 'Agregar evento',
              ),
            )
          : _activeSection == 'tasks' && tasksForSelectedDate.isNotEmpty
              ? Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Colors.blue,
                        Colors.indigo,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(28),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.blue.withOpacity(0.4),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: FloatingActionButton.extended(
                    onPressed: () => _showAddTaskDialog(context),
                    backgroundColor: Colors.transparent,
                    elevation: 0,
                    icon: const Icon(Icons.task, color: AppTheme.white),
                    label: const Text(
                      '+ Tarea',
                      style: TextStyle(
                        color: AppTheme.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    tooltip: 'Agregar tarea',
                  ),
                )
              : null,
      body: Column(
        children: [
          _buildSectionTabs(),
          Expanded(
            child: _buildActiveSection(user),
          ),
        ],
      ),
    );
  }

  Widget _buildNavigationDrawer(BuildContext context, AuthProvider authProvider) {
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
                  _carminePastel.withOpacity(0.3),
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
                    color: _carminePastel,
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
          // Secciones principales
          _buildDrawerItem(
            context,
            icon: Icons.person_outline,
            title: 'Personal',
            color: _carminePastel,
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
          // Configuración
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
          // Cerrar sesión
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
  }) {
    return ListTile(
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: color.withOpacity(0.2),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(
          icon,
          color: color,
          size: 22,
        ),
      ),
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
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
        child: Row(
        mainAxisSize: MainAxisSize.max,
        children: sections.asMap().entries.map((entry) {
          final index = entry.key;
          final section = entry.value;
            final isActive = _activeSection == section['id'];
          final rainbowColor = _getRainbowColor(index);
          return Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _activeSection = section['id'] as String),
                child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                  decoration: BoxDecoration(
                  gradient: isActive 
                      ? LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            rainbowColor.withOpacity(0.3),
                            rainbowColor.withOpacity(0.15),
                          ],
                        )
                      : null,
                  color: isActive ? null : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isActive 
                        ? rainbowColor 
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
                          ? rainbowColor 
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
                              ? rainbowColor 
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
    );
  }

  Widget _buildActiveSection(user) {
    switch (_activeSection) {
      case 'events':
        return _buildEvents();
      case 'tasks':
        return _buildTasks();
      case 'profile':
        return _buildProfile(user);
      case 'settings':
        return _buildSettings();
      default:
        return _buildEvents();
    }
  }

  Widget _buildEvents() {
    return Column(
      children: [
        // Header mejorado con selector de vista y fecha
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.red.withOpacity(0.2),
                _carminePastel.withOpacity(0.15),
                Colors.amber.withOpacity(0.1),
                AppTheme.darkSurface,
              ],
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Selector de vista (Día, Semana, Mes)
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  decoration: BoxDecoration(
                    color: AppTheme.darkSurface.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildViewModeButton('day', 'Día', Icons.calendar_today),
                      const SizedBox(width: 8),
                      _buildViewModeButton('week', 'Semana', Icons.view_week),
                      const SizedBox(width: 8),
                      _buildViewModeButton('month', 'Mes', Icons.calendar_month),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                // Información de la fecha/vista seleccionada
                _buildViewHeader(),
                const SizedBox(height: 16),
                // Selector de fecha (solo para vista día)
                if (_viewMode == 'day')
                  SizedBox(
                    height: 60,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      controller: _dateScrollController,
                      physics: const BouncingScrollPhysics(),
                      itemCount: 30,
                      itemBuilder: (context, index) {
                        final date = DateTime.now().subtract(const Duration(days: 14)).add(Duration(days: index));
                        final dateIsSelected = _selectedDate.year == date.year &&
                                             _selectedDate.month == date.month &&
                                             _selectedDate.day == date.day;
                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          child: _buildDateSelector(date, dateIsSelected),
                        );
                      },
                    ),
                  ),
              ],
            ),
          ),
        ),
        Expanded(
          child: _buildEventsContent(),
        ),
      ],
    );
  }


  Widget _buildViewModeButton(String mode, String label, IconData icon) {
    final isSelected = _viewMode == mode;
    return GestureDetector(
      onTap: () {
        setState(() {
          _viewMode = mode;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          gradient: isSelected
              ? LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Colors.red.withOpacity(0.4),
                    _carminePastel.withOpacity(0.3),
                  ],
                )
              : null,
          color: isSelected ? null : AppTheme.darkSurfaceVariant.withOpacity(0.6),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isSelected ? _carminePastel.withOpacity(0.6) : AppTheme.white60.withOpacity(0.3),
            width: isSelected ? 2 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: _carminePastel.withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 18, color: isSelected ? _carminePastel : AppTheme.white70),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 15,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected ? _carminePastel : AppTheme.white70,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildViewHeader() {
    final isToday = _selectedDate.year == DateTime.now().year &&
                    _selectedDate.month == DateTime.now().month &&
                    _selectedDate.day == DateTime.now().day;
    
    String title;
    String subtitle;
    int eventCount = 0;

    switch (_viewMode) {
      case 'day':
        final dayEvents = _getEventsForDate(_selectedDate);
        eventCount = dayEvents.length;
        title = isToday ? 'Hoy' : DateFormat('EEEE, d MMMM', 'es').format(_selectedDate);
        subtitle = 'Eventos del ${DateFormat('EEEE', 'es').format(_selectedDate).toLowerCase()}';
        break;
      case 'week':
        final weekStart = _getWeekStart(_selectedDate);
        final weekEnd = weekStart.add(const Duration(days: 6));
        final weekEvents = _getEventsForWeek(weekStart);
        eventCount = weekEvents.length;
        title = '${DateFormat('d MMM', 'es').format(weekStart)} - ${DateFormat('d MMM yyyy', 'es').format(weekEnd)}';
        // Calcular número de semana
        final weekNumber = _getWeekNumber(weekStart);
        subtitle = 'Eventos de la semana $weekNumber';
        break;
      case 'month':
        final monthEvents = _getEventsForMonth(_selectedDate);
        eventCount = monthEvents.length;
        title = DateFormat('MMMM yyyy', 'es').format(_selectedDate);
        subtitle = 'Eventos de ${DateFormat('MMMM', 'es').format(_selectedDate).toLowerCase()}';
        break;
      default:
        title = '';
        subtitle = '';
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Colors.red.withOpacity(0.3),
                    _carminePastel.withOpacity(0.25),
                  ],
                ),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: _carminePastel.withOpacity(0.5),
                  width: 1,
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.calendar_today, size: 16, color: Colors.amber),
                  const SizedBox(width: 6),
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: _carminePastel,
                    ),
                  ),
                ],
              ),
            ),
            // Botones de navegación para semana y mes
            if (_viewMode == 'week' || _viewMode == 'month')
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.chevron_left, color: AppTheme.white70),
                    onPressed: () {
                      setState(() {
                        if (_viewMode == 'week') {
                          _selectedDate = _selectedDate.subtract(const Duration(days: 7));
                        } else if (_viewMode == 'month') {
                          _selectedDate = DateTime(_selectedDate.year, _selectedDate.month - 1, _selectedDate.day);
                        }
                      });
                    },
                    tooltip: _viewMode == 'week' ? 'Semana anterior' : 'Mes anterior',
                  ),
                  IconButton(
                    icon: const Icon(Icons.today, color: AppTheme.white70),
                    onPressed: () {
                      setState(() {
                        _selectedDate = DateTime.now();
                      });
                    },
                    tooltip: 'Hoy',
                  ),
                  IconButton(
                    icon: const Icon(Icons.chevron_right, color: AppTheme.white70),
                    onPressed: () {
                      setState(() {
                        if (_viewMode == 'week') {
                          _selectedDate = _selectedDate.add(const Duration(days: 7));
                        } else if (_viewMode == 'month') {
                          _selectedDate = DateTime(_selectedDate.year, _selectedDate.month + 1, _selectedDate.day);
                        }
                      });
                    },
                    tooltip: _viewMode == 'week' ? 'Semana siguiente' : 'Mes siguiente',
                  ),
                ],
              ),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          subtitle,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: AppTheme.white,
          ),
        ),
        if (eventCount > 0)
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Text(
              '$eventCount ${eventCount == 1 ? 'evento' : 'eventos'}',
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.white60,
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildEventsContent() {
    switch (_viewMode) {
      case 'day':
        return _buildDayView();
      case 'week':
        return _buildWeekView();
      case 'month':
        return _buildMonthView();
      default:
        return _buildDayView();
    }
  }

  Widget _buildDayView() {
    final todayEvents = _getEventsForDate(_selectedDate);
    final isToday = _selectedDate.year == DateTime.now().year &&
                    _selectedDate.month == DateTime.now().month &&
                    _selectedDate.day == DateTime.now().day;

    if (todayEvents.isEmpty) {
      return _buildEmptyState(
        isToday 
            ? 'No hay eventos programados para hoy' 
            : 'No hay eventos para esta fecha',
        Icons.event_busy,
        'Agrega un nuevo evento usando el botón +',
        'Agregar Evento',
        () => _showAddEventDialog(context),
        Colors.red,
        gradientColors: [Colors.red, _carminePastel],
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: todayEvents.length,
      itemBuilder: (context, index) => _buildEventCard(todayEvents[index], index),
    );
  }

  Widget _buildWeekView() {
    final weekStart = _getWeekStart(_selectedDate);
    final weekEvents = _getEventsForWeek(weekStart);

    if (weekEvents.isEmpty) {
      return _buildEmptyState(
        'No hay eventos esta semana',
        Icons.event_busy,
        'Agrega un nuevo evento usando el botón +',
        'Agregar Evento',
        () => _showAddEventDialog(context),
        Colors.red,
        gradientColors: [Colors.red, _carminePastel],
      );
    }

    // Agrupar eventos por día
    final eventsByDay = <DateTime, List<EventOrganization>>{};
    for (var i = 0; i < 7; i++) {
      final day = weekStart.add(Duration(days: i));
      eventsByDay[day] = _getEventsForDate(day);
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 7,
      itemBuilder: (context, index) {
        final day = weekStart.add(Duration(days: index));
        final dayEvents = eventsByDay[day] ?? [];
        final isToday = day.year == DateTime.now().year &&
                        day.month == DateTime.now().month &&
                        day.day == DateTime.now().day;
        final isSelected = day.year == _selectedDate.year &&
                          day.month == _selectedDate.month &&
                          day.day == _selectedDate.day;

        return GestureDetector(
          onTap: () {
            setState(() {
              _selectedDate = day;
              _viewMode = 'day';
            });
          },
          child: Container(
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              gradient: isSelected
                  ? LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        _carminePastel.withOpacity(0.15),
                        _carminePastel.withOpacity(0.08),
                        AppTheme.darkSurface,
                      ],
                    )
                  : null,
              color: isSelected ? null : AppTheme.darkSurfaceVariant.withOpacity(0.3),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isSelected ? _carminePastel.withOpacity(0.4) : Colors.transparent,
                width: 1.5,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: isToday
                              ? Colors.red.withOpacity(0.3)
                              : AppTheme.darkSurfaceVariant.withOpacity(0.5),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          DateFormat('EEE', 'es').format(day).toUpperCase(),
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: isToday ? Colors.red : AppTheme.white70,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        DateFormat('d MMM', 'es').format(day),
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: isToday ? Colors.red : AppTheme.white,
                        ),
                      ),
                      const Spacer(),
                      if (dayEvents.isNotEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: _carminePastel.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '${dayEvents.length}',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: _carminePastel,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                if (dayEvents.isNotEmpty)
                  ...dayEvents.map((event) => Padding(
                    padding: const EdgeInsets.only(left: 12, right: 12, bottom: 8),
                    child: _buildEventCard(event, dayEvents.indexOf(event)),
                  )),
            ],
          ),
          ),
        );
      },
    );
  }

  Widget _buildMonthView() {
    final monthEvents = _getEventsForMonth(_selectedDate);
    final firstDay = DateTime(_selectedDate.year, _selectedDate.month, 1);
    final lastDay = DateTime(_selectedDate.year, _selectedDate.month + 1, 0);

    if (monthEvents.isEmpty) {
      return _buildEmptyState(
        'No hay eventos este mes',
        Icons.event_busy,
        'Agrega un nuevo evento usando el botón +',
        'Agregar Evento',
        () => _showAddEventDialog(context),
        Colors.red,
        gradientColors: [Colors.red, _carminePastel],
      );
    }

    // Agrupar eventos por día
    final eventsByDay = <DateTime, List<EventOrganization>>{};
    for (var i = 0; i <= lastDay.difference(firstDay).inDays; i++) {
      final day = firstDay.add(Duration(days: i));
      final dayEvents = _getEventsForDate(day);
      if (dayEvents.isNotEmpty) {
        eventsByDay[day] = dayEvents;
      }
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: eventsByDay.length,
      itemBuilder: (context, index) {
        final day = eventsByDay.keys.elementAt(index);
        final dayEvents = eventsByDay[day]!;
        final isToday = day.year == DateTime.now().year &&
                        day.month == DateTime.now().month &&
                        day.day == DateTime.now().day;

        return GestureDetector(
          onTap: () {
            setState(() {
              _selectedDate = day;
              _viewMode = 'day';
            });
          },
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            decoration: BoxDecoration(
              color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isToday ? Colors.red.withOpacity(0.4) : Colors.transparent,
                width: 1.5,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      Text(
                        DateFormat('EEEE, d MMMM', 'es').format(day),
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: isToday ? Colors.red : AppTheme.white,
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _carminePastel.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '${dayEvents.length}',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: _carminePastel,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                ...dayEvents.map((event) => Padding(
                  padding: const EdgeInsets.only(left: 12, right: 12, bottom: 8),
                  child: _buildEventCard(event, dayEvents.indexOf(event)),
                )),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildDateSelector(DateTime date, bool isSelected) {
    final isToday = date.year == DateTime.now().year &&
                    date.month == DateTime.now().month &&
                    date.day == DateTime.now().day;
    
    return GestureDetector(
      onTap: () async {
        setState(() {
          _selectedDate = date;
        });
        // Cargar eventos o tareas según la sección activa
        if (_activeSection == 'events') {
          await _loadEventsForDate(date);
        } else if (_activeSection == 'tasks') {
          await _loadTasksForDate(date);
        }
      },
      child: SizedBox(
        height: 55,
        width: 55,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            gradient: isSelected 
                ? LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      _carminePastel.withOpacity(0.3),
                      _carminePastel.withOpacity(0.2),
                    ],
                  )
                : null,
            color: isSelected ? null : AppTheme.darkSurfaceVariant.withOpacity(0.5),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected 
                  ? _carminePastel 
                  : Colors.transparent,
              width: 2,
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                DateFormat('EEE', 'es').format(date).substring(0, 3).toUpperCase(),
                style: TextStyle(
                  fontSize: 8,
                  fontWeight: FontWeight.w600,
                  color: isSelected ? _carminePastel : AppTheme.white60,
                  height: 1.0,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 0),
              Text(
                '${date.day}',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: isSelected ? _carminePastel : AppTheme.white,
                  height: 1.0,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              if (isToday)
                Container(
                  margin: const EdgeInsets.only(top: 0),
                  width: 3,
                  height: 3,
                  decoration: BoxDecoration(
                    color: Colors.amber,
                    shape: BoxShape.circle,
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTasks() {
    return Column(
      children: [
        // Header mejorado con selector de vista y fecha
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.blue.withOpacity(0.2),
                Colors.indigo.withOpacity(0.15),
                Colors.purple.withOpacity(0.1),
                AppTheme.darkSurface,
              ],
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                // Selector de vista (Día, Semana, Mes)
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  decoration: BoxDecoration(
                    color: AppTheme.darkSurface.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildViewModeButton('day', 'Día', Icons.calendar_today),
                      const SizedBox(width: 8),
                      _buildViewModeButton('week', 'Semana', Icons.view_week),
                      const SizedBox(width: 8),
                      _buildViewModeButton('month', 'Mes', Icons.calendar_month),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                // Información de la fecha/vista seleccionada
                _buildTasksViewHeader(),
                const SizedBox(height: 16),
                // Selector de fecha (solo para vista día)
                if (_viewMode == 'day')
                  SizedBox(
                    height: 60,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      controller: _dateScrollController,
                      physics: const BouncingScrollPhysics(),
                      itemCount: 30,
                      itemBuilder: (context, index) {
                        final date = DateTime.now().subtract(const Duration(days: 14)).add(Duration(days: index));
                        final dateIsSelected = _selectedDate.year == date.year &&
                                             _selectedDate.month == date.month &&
                                             _selectedDate.day == date.day;
                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          child: _buildDateSelector(date, dateIsSelected),
                        );
                      },
                    ),
                  ),
              ],
            ),
          ),
        ),
        Expanded(
          child: _buildTasksContent(),
        ),
      ],
    );
  }

  Widget _buildTasksViewHeader() {
    final isToday = _selectedDate.year == DateTime.now().year &&
                    _selectedDate.month == DateTime.now().month &&
                    _selectedDate.day == DateTime.now().day;
    
    String title;
    String subtitle;
    int totalTasks = 0;
    int completedTasks = 0;
    int pendingTasks = 0;

    switch (_viewMode) {
      case 'day':
        final dayTasks = _getTasksForDate(_selectedDate);
        totalTasks = dayTasks.length;
        completedTasks = dayTasks.where((t) => t.completed).length;
        pendingTasks = dayTasks.where((t) => !t.completed).length;
        title = isToday ? 'Hoy' : DateFormat('EEEE, d MMMM', 'es').format(_selectedDate);
        subtitle = 'Tareas del ${DateFormat('EEEE', 'es').format(_selectedDate).toLowerCase()}';
        break;
      case 'week':
        final weekStart = _getWeekStart(_selectedDate);
        final weekEnd = weekStart.add(const Duration(days: 6));
        final weekTasks = _getTasksForWeek(weekStart);
        totalTasks = weekTasks.length;
        completedTasks = weekTasks.where((t) => t.completed).length;
        pendingTasks = weekTasks.where((t) => !t.completed).length;
        title = '${DateFormat('d MMM', 'es').format(weekStart)} - ${DateFormat('d MMM yyyy', 'es').format(weekEnd)}';
        // Calcular número de semana
        final weekNumber = _getWeekNumber(weekStart);
        subtitle = 'Tareas de la semana $weekNumber';
        break;
      case 'month':
        final monthTasks = _getTasksForMonth(_selectedDate);
        totalTasks = monthTasks.length;
        completedTasks = monthTasks.where((t) => t.completed).length;
        pendingTasks = monthTasks.where((t) => !t.completed).length;
        title = DateFormat('MMMM yyyy', 'es').format(_selectedDate);
        subtitle = 'Tareas de ${DateFormat('MMMM', 'es').format(_selectedDate).toLowerCase()}';
        break;
      default:
        title = '';
        subtitle = '';
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: _carminePastel.withOpacity(0.2),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.check_circle, size: 16, color: _carminePastel),
                  const SizedBox(width: 6),
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: _carminePastel,
                    ),
                  ),
                ],
              ),
            ),
            // Botones de navegación para semana y mes
            if (_viewMode == 'week' || _viewMode == 'month')
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.chevron_left, color: AppTheme.white70),
                    onPressed: () {
                      setState(() {
                        if (_viewMode == 'week') {
                          _selectedDate = _selectedDate.subtract(const Duration(days: 7));
                        } else if (_viewMode == 'month') {
                          _selectedDate = DateTime(_selectedDate.year, _selectedDate.month - 1, _selectedDate.day);
                        }
                      });
                    },
                    tooltip: _viewMode == 'week' ? 'Semana anterior' : 'Mes anterior',
                  ),
                  IconButton(
                    icon: const Icon(Icons.today, color: AppTheme.white70),
                    onPressed: () {
                      setState(() {
                        _selectedDate = DateTime.now();
                      });
                    },
                    tooltip: 'Hoy',
                  ),
                  IconButton(
                    icon: const Icon(Icons.chevron_right, color: AppTheme.white70),
                    onPressed: () {
                      setState(() {
                        if (_viewMode == 'week') {
                          _selectedDate = _selectedDate.add(const Duration(days: 7));
                        } else if (_viewMode == 'month') {
                          _selectedDate = DateTime(_selectedDate.year, _selectedDate.month + 1, _selectedDate.day);
                        }
                      });
                    },
                    tooltip: _viewMode == 'week' ? 'Semana siguiente' : 'Mes siguiente',
                  ),
                ],
              ),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          subtitle,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: AppTheme.white,
          ),
        ),
        if (totalTasks > 0)
          Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Row(
              children: [
                if (pendingTasks > 0) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _carminePastel.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '$pendingTasks pendiente${pendingTasks == 1 ? '' : 's'}',
                      style: TextStyle(
                        fontSize: 12,
                        color: _carminePastel,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  if (completedTasks > 0) const SizedBox(width: 8),
                ],
                if (completedTasks > 0)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '$completedTasks completada${completedTasks == 1 ? '' : 's'}',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.green,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildTasksContent() {
    switch (_viewMode) {
      case 'day':
        return _buildTasksDayView();
      case 'week':
        return _buildTasksWeekView();
      case 'month':
        return _buildTasksMonthView();
      default:
        return _buildTasksDayView();
    }
  }

  Widget _buildTasksDayView() {
    final todayTasks = _getTasksForDate(_selectedDate);
    final isToday = _selectedDate.year == DateTime.now().year &&
                    _selectedDate.month == DateTime.now().month &&
                    _selectedDate.day == DateTime.now().day;

    if (todayTasks.isEmpty) {
      return _buildEmptyState(
        isToday 
            ? 'No hay tareas pendientes para hoy' 
            : 'No hay tareas para esta fecha',
        Icons.check_circle,
        'Agrega una nueva tarea usando el botón +',
        'Agregar Tarea',
        () => _showAddTaskDialog(context),
        Colors.blue,
        gradientColors: [Colors.blue, Colors.indigo],
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: todayTasks.length,
      itemBuilder: (context, index) => _buildTaskCard(todayTasks[index], index),
    );
  }

  Widget _buildTasksWeekView() {
    final weekStart = _getWeekStart(_selectedDate);
    final weekTasks = _getTasksForWeek(weekStart);

    if (weekTasks.isEmpty) {
      return _buildEmptyState(
        'No hay tareas esta semana',
        Icons.check_circle,
        'Agrega una nueva tarea usando el botón +',
        'Agregar Tarea',
        () => _showAddTaskDialog(context),
        Colors.blue,
        gradientColors: [Colors.blue, Colors.indigo],
      );
    }

    // Agrupar tareas por día
    final tasksByDay = <DateTime, List<CalendarTask>>{};
    for (var i = 0; i < 7; i++) {
      final day = weekStart.add(Duration(days: i));
      tasksByDay[day] = _getTasksForDate(day);
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 7,
      itemBuilder: (context, index) {
        final day = weekStart.add(Duration(days: index));
        final dayTasks = tasksByDay[day] ?? [];
        final isToday = day.year == DateTime.now().year &&
                        day.month == DateTime.now().month &&
                        day.day == DateTime.now().day;
        final isSelected = day.year == _selectedDate.year &&
                          day.month == _selectedDate.month &&
                          day.day == _selectedDate.day;
        final completedTasks = dayTasks.where((t) => t.completed).length;
        final pendingTasks = dayTasks.where((t) => !t.completed).length;

        return GestureDetector(
          onTap: () {
            setState(() {
              _selectedDate = day;
              _viewMode = 'day';
            });
          },
          child: Container(
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              gradient: isSelected
                  ? LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        Colors.blue.withOpacity(0.15),
                        Colors.indigo.withOpacity(0.08),
                        AppTheme.darkSurface,
                      ],
                    )
                  : null,
              color: isSelected ? null : AppTheme.darkSurfaceVariant.withOpacity(0.3),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isSelected ? Colors.blue.withOpacity(0.4) : Colors.transparent,
                width: 1.5,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: isToday
                              ? Colors.blue.withOpacity(0.3)
                              : AppTheme.darkSurfaceVariant.withOpacity(0.5),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          DateFormat('EEE', 'es').format(day).toUpperCase(),
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: isToday ? Colors.blue : AppTheme.white70,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        DateFormat('d MMM', 'es').format(day),
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: isToday ? Colors.blue : AppTheme.white,
                        ),
                      ),
                      const Spacer(),
                      if (dayTasks.isNotEmpty)
                        Row(
                          children: [
                            if (pendingTasks > 0)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: _carminePastel.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  '$pendingTasks',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: _carminePastel,
                                  ),
                                ),
                              ),
                            if (pendingTasks > 0 && completedTasks > 0) const SizedBox(width: 6),
                            if (completedTasks > 0)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.green.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  '$completedTasks',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.green,
                                  ),
                                ),
                              ),
                          ],
                        ),
                    ],
                  ),
                ),
                if (dayTasks.isNotEmpty)
                  ...dayTasks.map((task) => Padding(
                    padding: const EdgeInsets.only(left: 12, right: 12, bottom: 8),
                    child: _buildTaskCard(task, dayTasks.indexOf(task)),
                  )),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildTasksMonthView() {
    final monthTasks = _getTasksForMonth(_selectedDate);
    final firstDay = DateTime(_selectedDate.year, _selectedDate.month, 1);
    final lastDay = DateTime(_selectedDate.year, _selectedDate.month + 1, 0);

    if (monthTasks.isEmpty) {
      return _buildEmptyState(
        'No hay tareas este mes',
        Icons.check_circle,
        'Agrega una nueva tarea usando el botón +',
        'Agregar Tarea',
        () => _showAddTaskDialog(context),
        Colors.blue,
        gradientColors: [Colors.blue, Colors.indigo],
      );
    }

    // Agrupar tareas por día
    final tasksByDay = <DateTime, List<CalendarTask>>{};
    for (var i = 0; i <= lastDay.difference(firstDay).inDays; i++) {
      final day = firstDay.add(Duration(days: i));
      final dayTasks = _getTasksForDate(day);
      if (dayTasks.isNotEmpty) {
        tasksByDay[day] = dayTasks;
      }
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: tasksByDay.length,
      itemBuilder: (context, index) {
        final day = tasksByDay.keys.elementAt(index);
        final dayTasks = tasksByDay[day]!;
        final isToday = day.year == DateTime.now().year &&
                        day.month == DateTime.now().month &&
                        day.day == DateTime.now().day;
        final completedTasks = dayTasks.where((t) => t.completed).length;
        final pendingTasks = dayTasks.where((t) => !t.completed).length;

        return GestureDetector(
          onTap: () {
            setState(() {
              _selectedDate = day;
              _viewMode = 'day';
            });
          },
          child: Container(
            margin: const EdgeInsets.only(bottom: 12),
            decoration: BoxDecoration(
              color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isToday ? Colors.blue.withOpacity(0.4) : Colors.transparent,
                width: 1.5,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      Text(
                        DateFormat('EEEE, d MMMM', 'es').format(day),
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: isToday ? Colors.blue : AppTheme.white,
                        ),
                      ),
                      const Spacer(),
                      Row(
                        children: [
                          if (pendingTasks > 0)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: _carminePastel.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '$pendingTasks',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: _carminePastel,
                                ),
                              ),
                            ),
                          if (pendingTasks > 0 && completedTasks > 0) const SizedBox(width: 6),
                          if (completedTasks > 0)
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.green.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '$completedTasks',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
                ...dayTasks.map((task) => Padding(
                  padding: const EdgeInsets.only(left: 12, right: 12, bottom: 8),
                  child: _buildTaskCard(task, dayTasks.indexOf(task)),
                )),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildProfile(user) {
    final completedTasks = _tasks.where((t) => t.completed).length;
    final totalTasks = _tasks.length;
    final todayEvents = _getEventsForDate(DateTime.now()).length;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Header mejorado con gradiente arcoíris
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.red.withOpacity(0.3),
                  _carminePastel.withOpacity(0.25),
                  Colors.amber.withOpacity(0.2),
                  Colors.green.withOpacity(0.15),
                  Colors.blue.withOpacity(0.1),
                  Colors.indigo.withOpacity(0.1),
                  Colors.purple.withOpacity(0.1),
                  AppTheme.darkSurface,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.purple.withOpacity(0.4),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
                BoxShadow(
                  color: Colors.red.withOpacity(0.3),
                  blurRadius: 15,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  // Avatar mejorado con decoración
                  Stack(
                children: [
                  Container(
                        width: 100,
                        height: 100,
                    decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              Colors.red,
                              _carminePastel,
                              Colors.amber,
                              Colors.green,
                              Colors.blue,
                              Colors.indigo,
                              Colors.purple,
                            ],
                          ),
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.purple.withOpacity(0.6),
                              blurRadius: 20,
                              spreadRadius: 4,
                            ),
                            BoxShadow(
                              color: Colors.red.withOpacity(0.4),
                              blurRadius: 15,
                              spreadRadius: 2,
                            ),
                          ],
                    ),
                    child: const Icon(
                      Icons.person,
                          size: 50,
                      color: AppTheme.white,
                    ),
                  ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: Colors.green,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: AppTheme.darkSurface,
                              width: 3,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.3),
                                blurRadius: 8,
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.check,
                            size: 18,
                            color: AppTheme.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  // Nombre del usuario
                        Text(
                          user?.name ?? 'Usuario',
                          style: const TextStyle(
                      fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Email
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.email_outlined, size: 16, color: AppTheme.white60),
                      const SizedBox(width: 8),
                        Text(
                          user?.email ?? 'usuario@ejemplo.com',
                          style: const TextStyle(
                          fontSize: 15,
                            color: AppTheme.white70,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Badge de verificado mejorado con gradiente arcoíris
                        Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Colors.green,
                          Colors.blue,
                          Colors.purple,
                        ],
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.green.withOpacity(0.4),
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        ),
                        BoxShadow(
                          color: Colors.purple.withOpacity(0.3),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                        Icon(Icons.verified_user, size: 18, color: AppTheme.white),
                        SizedBox(width: 6),
                              Text(
                          'Cuenta Verificada',
                                style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                                  color: AppTheme.white,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
          ),
          const SizedBox(height: 24),
          // Estadísticas del usuario
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  icon: Icons.event,
                  value: todayEvents.toString(),
                  label: 'Eventos Hoy',
                  color: Colors.red,
                  gradientColors: [Colors.red, _carminePastel],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCard(
                  icon: Icons.task_alt,
                  value: '$completedTasks/$totalTasks',
                  label: 'Tareas',
                  color: Colors.blue,
                  gradientColors: [Colors.blue, Colors.indigo],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          // Opciones de perfil mejoradas
          _buildProfileOption(
            icon: Icons.edit_outlined,
            title: 'Editar Perfil',
            subtitle: 'Actualiza tu información personal',
            color: Colors.blue,
            gradientColors: [Colors.blue, Colors.indigo],
            onTap: () {
              _showEditProfileDialog(context, user);
            },
          ),
          const SizedBox(height: 12),
          _buildProfileOption(
            icon: Icons.lock_outline,
            title: 'Cambiar Contraseña',
            subtitle: 'Actualiza tu contraseña de seguridad',
            color: _carminePastel,
            gradientColors: [_carminePastel, Colors.amber],
            onTap: () {
              _showChangePasswordDialog(context);
            },
          ),
          const SizedBox(height: 12),
          _buildProfileOption(
            icon: Icons.notifications_outlined,
            title: 'Notificaciones',
            subtitle: 'Configura tus preferencias',
            color: Colors.pink,
            gradientColors: [Colors.pink, Colors.purple],
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Funcionalidad de notificaciones próximamente'),
                  duration: Duration(seconds: 2),
                ),
              );
            },
          ),
          const SizedBox(height: 12),
          _buildProfileOption(
            icon: Icons.shield_outlined,
            title: 'Privacidad',
            subtitle: 'Controla tu privacidad',
            color: Colors.green,
            gradientColors: [Colors.green, Colors.teal],
            onTap: () {
              _showPrivacyDialog(context);
            },
          ),
          const SizedBox(height: 12),
          _buildProfileOption(
            icon: Icons.info_outline,
            title: 'Información de la App',
            subtitle: 'Versión y detalles de la aplicación',
            color: Colors.purple,
            gradientColors: [Colors.purple, Colors.indigo],
            onTap: () {
              _showAppInfoDialog(context);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String value,
    required String label,
    required Color color,
    List<Color>? gradientColors,
  }) {
    final colors = gradientColors ?? [color, color];
    return Container(
      padding: const EdgeInsets.all(20),
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
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.2),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: colors.map((c) => c.withOpacity(0.3)).toList(),
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              icon,
              color: color,
              size: 28,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
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
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildProfileOption({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
    List<Color>? gradientColors,
  }) {
    final colors = gradientColors ?? [color, color];
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: const Duration(milliseconds: 300),
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
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              colors[0].withOpacity(0.1),
              colors.length > 1 ? colors[1].withOpacity(0.05) : colors[0].withOpacity(0.02),
              AppTheme.darkSurface,
            ],
          ),
        borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: color.withOpacity(0.3),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.2),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Material(
          color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Padding(
              padding: const EdgeInsets.all(18),
          child: Row(
            children: [
              Container(
                    width: 52,
                    height: 52,
                decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: colors.map((c) => c.withOpacity(0.4)).toList(),
                      ),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: color.withOpacity(0.4),
                        width: 1,
                      ),
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
                            fontSize: 17,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.white,
                            letterSpacing: 0.3,
                      ),
                    ),
                        const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: const TextStyle(
                            fontSize: 13,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
              ),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(
                Icons.chevron_right,
                      color: color,
                      size: 20,
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

  void _showEditProfileDialog(BuildContext context, user) {
    final nameController = TextEditingController(text: user?.name ?? '');
    final emailController = TextEditingController(text: user?.email ?? '');
    bool isSaving = false;

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: AppTheme.darkSurface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              title: const Text(
                'Editar Perfil',
                style: TextStyle(
                  color: AppTheme.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
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
                          borderSide: BorderSide(color: _carminePastel),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: emailController,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        labelText: 'Email',
                        labelStyle: const TextStyle(color: AppTheme.white60),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _carminePastel),
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
                      isSaving = true;
                    });

                    final authProvider = Provider.of<AuthProvider>(context, listen: false);
                    final result = await authProvider.updateProfile({
                      'name': nameController.text,
                      'email': emailController.text,
                    });

                    if (!dialogContext.mounted) return;
                    
                    if (result['success'] == true) {
                      Navigator.of(dialogContext).pop();
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Perfil actualizado exitosamente'),
                            backgroundColor: Colors.green,
                            duration: Duration(seconds: 2),
                          ),
                        );
                      }
                    } else {
                      setDialogState(() {
                        isSaving = false;
                      });
                      if (dialogContext.mounted) {
                        ScaffoldMessenger.of(dialogContext).showSnackBar(
                          SnackBar(
                            content: Text(result['error'] ?? 'Error al actualizar el perfil'),
                            backgroundColor: Colors.red,
                            duration: const Duration(seconds: 2),
                          ),
                        );
                      }
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _carminePastel,
                    foregroundColor: AppTheme.white,
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
                      : const Text('Guardar'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _showChangePasswordDialog(BuildContext context) {
    final currentPasswordController = TextEditingController();
    final newPasswordController = TextEditingController();
    final confirmPasswordController = TextEditingController();
    bool isSaving = false;
    String? errorMessage;

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: AppTheme.darkSurface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              title: const Text(
                'Cambiar Contraseña',
                style: TextStyle(
                  color: AppTheme.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (errorMessage != null) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.red, width: 1),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline, color: Colors.red, size: 20),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                errorMessage!,
                                style: const TextStyle(color: Colors.red, fontSize: 14),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                    TextField(
                      controller: currentPasswordController,
                      obscureText: true,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        labelText: 'Contraseña Actual',
                        labelStyle: const TextStyle(color: AppTheme.white60),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _carminePastel),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: newPasswordController,
                      obscureText: true,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        labelText: 'Nueva Contraseña',
                        labelStyle: const TextStyle(color: AppTheme.white60),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _carminePastel),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: confirmPasswordController,
                      obscureText: true,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        labelText: 'Confirmar Nueva Contraseña',
                        labelStyle: const TextStyle(color: AppTheme.white60),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _carminePastel),
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

                    if (newPasswordController.text != confirmPasswordController.text) {
                      setDialogState(() {
                        errorMessage = 'Las contraseñas no coinciden';
                        isSaving = false;
                      });
                      return;
                    }

                    if (newPasswordController.text.length < 6) {
                      setDialogState(() {
                        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
                        isSaving = false;
                      });
                      return;
                    }

                    final authProvider = Provider.of<AuthProvider>(context, listen: false);
                    final result = await authProvider.updatePassword(
                      currentPasswordController.text,
                      newPasswordController.text,
                    );

                    if (!dialogContext.mounted) return;

                    if (result['success'] == true) {
                      Navigator.of(dialogContext).pop();
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Contraseña actualizada exitosamente'),
                            backgroundColor: Colors.green,
                            duration: Duration(seconds: 2),
                          ),
                        );
                      }
                    } else {
                      setDialogState(() {
                        errorMessage = result['error'] ?? 'Error al cambiar la contraseña';
                        isSaving = false;
                      });
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _carminePastel,
                    foregroundColor: AppTheme.white,
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
                      : const Text('Cambiar'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _showAppInfoDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: AppTheme.darkSurface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          title: const Text(
            'Información de la App',
            style: TextStyle(
              color: AppTheme.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildInfoRow(Icons.apps, 'AgendaApp', 'Versión 1.0.0'),
              const SizedBox(height: 12),
              _buildInfoRow(Icons.calendar_today, 'Eventos', 'Gestión de eventos personalizados'),
              const SizedBox(height: 12),
              _buildInfoRow(Icons.task_alt, 'Tareas', 'Organización de tareas diarias'),
              const SizedBox(height: 12),
              _buildInfoRow(Icons.business, 'Emprendimientos', 'Seguimiento de proyectos'),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: _carminePastel.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.favorite, color: _carminePastel, size: 20),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Hecho con ❤️ para organizar tu vida',
                        style: TextStyle(
                color: AppTheme.white60,
                          fontSize: 13,
                        ),
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
                'Cerrar',
                style: TextStyle(color: _carminePastel),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildInfoRow(IconData icon, String title, String subtitle) {
    return Row(
      children: [
        Icon(icon, color: _carminePastel, size: 20),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: AppTheme.white,
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Text(
                subtitle,
                style: const TextStyle(
                  color: AppTheme.white60,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  void _showPrivacyDialog(BuildContext context) {
    // Cargar valores desde _userSettings o usar valores por defecto
    bool profileVisible = _userSettings?['profile_visible'] ?? true;
    bool shareData = _userSettings?['share_data'] ?? false;
    bool allowAnalytics = _userSettings?['allow_analytics'] ?? true;
    bool allowNotifications = _userSettings?['allow_notifications'] ?? true;
    bool showEmail = _userSettings?['show_email'] ?? true;
    bool showName = _userSettings?['show_name'] ?? true;
    bool isSaving = false;

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: AppTheme.darkSurface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              title: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.green.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.shield_outlined,
                      color: Colors.green,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Text(
                      'Configuración de Privacidad',
                      style: TextStyle(
                        color: AppTheme.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Controla quién puede ver tu información y cómo se utilizan tus datos.',
                      style: TextStyle(
                        color: AppTheme.white60,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 24),
                    
                    // Visibilidad del Perfil
                    _buildPrivacySection(
                      'Visibilidad del Perfil',
                      'Controla qué información es visible',
                      Icons.visibility_outlined,
                      Colors.blue,
                    ),
                    const SizedBox(height: 16),
                    _buildPrivacySwitch(
                      'Mostrar nombre completo',
                      'Tu nombre será visible para otros usuarios',
                      Icons.person_outline,
                      showName,
                      (value) {
                        setDialogState(() {
                          showName = value;
                        });
                      },
                    ),
                    const SizedBox(height: 12),
                    _buildPrivacySwitch(
                      'Mostrar email',
                      'Tu email será visible en tu perfil',
                      Icons.email_outlined,
                      showEmail,
                      (value) {
                        setDialogState(() {
                          showEmail = value;
                        });
                      },
                    ),
                    const SizedBox(height: 12),
                    _buildPrivacySwitch(
                      'Perfil visible',
                      'Permite que otros usuarios vean tu perfil',
                      Icons.visibility,
                      profileVisible,
                      (value) {
                        setDialogState(() {
                          profileVisible = value;
                        });
                      },
                    ),
                    
                    const SizedBox(height: 24),
                    _buildPrivacySection(
                      'Privacidad de Datos',
                      'Controla cómo se utilizan tus datos',
                      Icons.data_usage_outlined,
                      Colors.purple,
                    ),
                    const SizedBox(height: 16),
                    _buildPrivacySwitch(
                      'Compartir datos con terceros',
                      'Permite compartir datos anónimos con servicios de análisis',
                      Icons.share_outlined,
                      shareData,
                      (value) {
                        setDialogState(() {
                          shareData = value;
                        });
                      },
                    ),
                    const SizedBox(height: 12),
                    _buildPrivacySwitch(
                      'Permitir análisis de uso',
                      'Ayuda a mejorar la aplicación con datos de uso anónimos',
                      Icons.analytics_outlined,
                      allowAnalytics,
                      (value) {
                        setDialogState(() {
                          allowAnalytics = value;
                        });
                      },
                    ),
                    
                    const SizedBox(height: 24),
                    _buildPrivacySection(
                      'Notificaciones',
                      'Controla las notificaciones',
                      Icons.notifications_outlined,
                      _carminePastel,
                    ),
                    const SizedBox(height: 16),
                    _buildPrivacySwitch(
                      'Permitir notificaciones',
                      'Recibe notificaciones sobre eventos y recordatorios',
                      Icons.notifications_active,
                      allowNotifications,
                      (value) {
                        setDialogState(() {
                          allowNotifications = value;
                        });
                      },
                    ),
                    
                    const SizedBox(height: 24),
                    // Información adicional
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: Colors.blue.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.info_outline,
                            color: Colors.blue,
                            size: 20,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              'Tus datos están protegidos con encriptación. Solo tú tienes acceso completo a tu información.',
                              style: TextStyle(
                                color: Colors.blue.shade200,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
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
                      isSaving = true;
                    });

                    final result = await _settingsService.updatePrivacySettings(
                      profileVisible: profileVisible,
                      showName: showName,
                      showEmail: showEmail,
                      shareData: shareData,
                      allowAnalytics: allowAnalytics,
                      allowNotifications: allowNotifications,
                    );

                    if (!dialogContext.mounted) return;

                    if (result['success'] == true) {
                      // Recargar configuraciones
                      await _loadSettings();

                      Navigator.of(dialogContext).pop();
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Configuración de privacidad guardada exitosamente'),
                            backgroundColor: Colors.green,
                            duration: Duration(seconds: 2),
                          ),
                        );
                      }
                    } else {
                      setDialogState(() {
                        isSaving = false;
                      });
                      if (dialogContext.mounted) {
                        ScaffoldMessenger.of(dialogContext).showSnackBar(
                          SnackBar(
                            content: Text(result['error'] ?? 'Error al guardar la configuración'),
                            backgroundColor: Colors.red,
                            duration: const Duration(seconds: 3),
                          ),
                        );
                      }
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: AppTheme.white,
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
                      : const Text('Guardar'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Widget _buildPrivacySection(String title, String subtitle, IconData icon, Color color) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withOpacity(0.2),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(icon, color: color, size: 22),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  color: AppTheme.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Text(
                subtitle,
                style: const TextStyle(
                  color: AppTheme.white60,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildPrivacySwitch(
    String title,
    String description,
    IconData icon,
    bool value,
    ValueChanged<bool> onChanged,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkBackground.withOpacity(0.5),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppTheme.darkSurfaceVariant,
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: _carminePastel.withOpacity(0.2),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              icon,
              color: _carminePastel,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: AppTheme.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: const TextStyle(
                    color: AppTheme.white60,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: Colors.green,
            activeTrackColor: Colors.green.withOpacity(0.5),
            inactiveThumbColor: AppTheme.white60,
            inactiveTrackColor: AppTheme.darkSurfaceVariant,
          ),
        ],
      ),
    );
  }

  Widget _buildSettings() {
    final activeCount = _activeSections.values.where((v) => v == true).length;
    final totalCount = _activeSections.length;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header mejorado con estadísticas
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  _carminePastel.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: _carminePastel.withOpacity(0.3),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: _carminePastel.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Icon(
                      Icons.settings,
                      size: 40,
                      color: _carminePastel,
                    ),
                  ),
                  const SizedBox(height: 16),
          const Text(
                    'Configuración',
            style: TextStyle(
                      fontSize: 28,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Personaliza tu experiencia',
            style: TextStyle(
                      fontSize: 15,
                      color: AppTheme.white70,
            ),
          ),
          const SizedBox(height: 16),
                  // Estadísticas
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBackground.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.check_circle, color: Colors.green, size: 20),
                        const SizedBox(width: 8),
          Text(
                          '$activeCount de $totalCount secciones activas',
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
            ),
          ),
          const SizedBox(height: 24),
          
          // Sección de secciones disponibles
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
            color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: _carminePastel.withOpacity(0.3),
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
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(
                        Icons.dashboard_outlined,
                        color: Colors.blue,
                        size: 24,
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Secciones Disponibles',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Activa solo las secciones que necesitas',
                            style: TextStyle(
                              fontSize: 13,
                              color: AppTheme.white60,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                if (_isLoadingSettings)
                  const Center(
                    child: Padding(
                      padding: EdgeInsets.all(32.0),
                      child: CircularProgressIndicator(),
                    ),
                  )
                else
                  Column(
                    children: [
                      _buildSettingsSection('Personal', 'Mi Perfil', Icons.person, 'personal', _carminePastel),
                      const SizedBox(height: 12),
                      _buildSettingsSection('Trabajo', 'Trabajo y proyectos', Icons.work, 'work', Colors.blue),
                      const SizedBox(height: 12),
                      _buildSettingsSection('Escuela', 'Estudios y educación', Icons.school, 'school', Colors.purple),
                      const SizedBox(height: 12),
                      _buildSettingsSection('Salud', 'Salud y bienestar', Icons.health_and_safety, 'health', Colors.green),
                      const SizedBox(height: 12),
                      _buildSettingsSection('Finanzas', 'Finanzas personales', Icons.account_balance_wallet, 'finance', Colors.amber),
                      const SizedBox(height: 12),
                      _buildSettingsSection('Idiomas', 'Aprendizaje de idiomas', Icons.language, 'language', Colors.teal),
                      const SizedBox(height: 12),
                      _buildSettingsSection('Menstrual', 'Calendario menstrual', Icons.eco_outlined, 'menstrual', Colors.pink),
                      const SizedBox(height: 12),
                      _buildSettingsSection('Mascotas', 'Cuidado de mascotas', Icons.pets, 'pet', Colors.brown),
                      const SizedBox(height: 12),
                      _buildSettingsSection('Cuidado Personal', 'Autocuidado', Icons.favorite_outline, 'selfcare', Colors.pinkAccent),
                      const SizedBox(height: 12),
                      _buildSettingsSection('Viajes', 'Viajes y aventuras', Icons.flight, 'travel', Colors.cyan),
                      const SizedBox(height: 12),
                      _buildSettingsSection('Lectura', 'Libros y lectura', Icons.book, 'reading', Colors.indigo),
                      const SizedBox(height: 12),
                      _buildSettingsSection('Películas', 'Películas y series', Icons.movie, 'movies', Colors.deepPurple),
                      const SizedBox(height: 12),
                      _buildSettingsSection('Emprendimientos', 'Negocios y proyectos', Icons.business, 'entrepreneurship', Colors.deepPurple),
                    ],
                  ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          
          // Sección de cerrar sesión mejorada
          SizedBox(
            width: double.infinity,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.red.withOpacity(0.2),
                    AppTheme.darkSurface,
                  ],
                ),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: Colors.red.withOpacity(0.3),
                  width: 1,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.red.withOpacity(0.2),
                    blurRadius: 15,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.red.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(
                    Icons.logout,
                    size: 32,
                    color: Colors.red,
                  ),
                ),
                const SizedBox(height: 16),
                  const Text(
                    'Cerrar Sesión',
                    style: TextStyle(
                    fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Sal de tu cuenta de forma segura',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppTheme.white60,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 20),
                ElevatedButton.icon(
                  onPressed: () async {
                    if (!context.mounted) return;
                    
                    try {
                      final confirmed = await showDialog<bool>(
                        context: context,
                        barrierDismissible: false,
                        barrierColor: Colors.black.withOpacity(0.7),
                        builder: (BuildContext dialogContext) {
                          return PopScope(
                            canPop: false,
                            child: AlertDialog(
                              backgroundColor: AppTheme.darkSurface,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(24),
                              ),
                              insetPadding: const EdgeInsets.symmetric(horizontal: 2, vertical: 24),
                              titlePadding: const EdgeInsets.fromLTRB(24, 24, 24, 16),
                              contentPadding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
                              actionsPadding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
                              title: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: _carminePastel.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Icon(
                                      Icons.warning_amber_rounded,
                                      color: _carminePastel,
                                      size: 32,
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  const Expanded(
                                    child: Text(
                                      'Confirmar Cierre de Sesión',
                                      style: TextStyle(
                                        color: AppTheme.white,
                                        fontSize: 22,
                                        fontWeight: FontWeight.bold,
                                        letterSpacing: 0.3,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              content: SizedBox(
                                width: double.maxFinite,
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      '¿Estás seguro de que quieres cerrar sesión?',
                                      style: TextStyle(
                                        color: AppTheme.white,
                                        fontSize: 18,
                                        fontWeight: FontWeight.w500,
                                        height: 1.5,
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    Container(
                                      padding: const EdgeInsets.all(16),
                                      decoration: BoxDecoration(
                                        color: _carminePastel.withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(12),
                                        border: Border.all(
                                          color: _carminePastel.withOpacity(0.3),
                                          width: 1,
                                        ),
                                      ),
                                      child: Row(
                                        children: [
                                          Icon(
                                            Icons.info_outline,
                                            color: _carminePastel,
                                            size: 20,
                                          ),
                                          const SizedBox(width: 12),
                                          const Expanded(
                                            child: Text(
                                              'Tendrás que iniciar sesión nuevamente para acceder a tu cuenta.',
                                              style: TextStyle(
                                                color: AppTheme.white70,
                                                fontSize: 14,
                                                height: 1.4,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              actions: [
                                Expanded(
                                  child: OutlinedButton(
                                    onPressed: () => Navigator.of(dialogContext).pop(false),
                                    style: OutlinedButton.styleFrom(
                                      foregroundColor: AppTheme.white60,
                                      side: BorderSide(
                                        color: AppTheme.white60.withOpacity(0.3),
                                      ),
                                      padding: const EdgeInsets.symmetric(vertical: 16),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(16),
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
                                  child: ElevatedButton.icon(
                                    onPressed: () => Navigator.of(dialogContext).pop(true),
                                    icon: const Icon(Icons.logout, size: 20),
                                    label: const Text(
                                      'Cerrar Sesión',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.red,
                                      foregroundColor: AppTheme.white,
                                      padding: const EdgeInsets.symmetric(vertical: 16),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(16),
                                      ),
                                      elevation: 4,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      );

                      if (confirmed == true && context.mounted) {
                        final authProvider = Provider.of<AuthProvider>(context, listen: false);
                        
                        // Mostrar indicador de carga
                        showDialog(
                          context: context,
                          barrierDismissible: false,
                          barrierColor: Colors.black.withOpacity(0.8),
                          builder: (BuildContext loadingContext) {
                            return PopScope(
                              canPop: false,
                              child: const Center(
                                child: Card(
                                  color: AppTheme.darkSurface,
                                  child: Padding(
                                    padding: EdgeInsets.all(24),
                                    child: Column(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        CircularProgressIndicator(),
                                        SizedBox(height: 16),
                                        Text(
                                          'Cerrando sesión...',
                                          style: TextStyle(color: AppTheme.white),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            );
                          },
                        );

                        try {
                          final result = await authProvider.signOut();
                          
                          // Cerrar el indicador de carga
                          if (context.mounted && Navigator.canPop(context)) {
                            Navigator.of(context, rootNavigator: true).pop();
                          }
                          
                          if (result['success'] == true) {
                            // Esperar un momento para que el estado se actualice
                            await Future.delayed(const Duration(milliseconds: 300));
                            
                            // Navegar al login - go reemplazará toda la pila de navegación
                            if (context.mounted) {
                              context.go('/login');
                            }
                          } else {
                            // Error al cerrar sesión
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Error al cerrar sesión: ${result['error'] ?? 'Error desconocido'}'),
                                  backgroundColor: Colors.red,
                                  duration: const Duration(seconds: 3),
                                ),
                              );
                            }
                          }
                        } catch (error) {
                          // Cerrar el indicador de carga si hay error
                          if (context.mounted && Navigator.canPop(context)) {
                            Navigator.of(context, rootNavigator: true).pop();
                          }
                          
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Error al cerrar sesión: $error'),
                                backgroundColor: Colors.red,
                                duration: const Duration(seconds: 3),
                              ),
                            );
                          }
                        }
                      }
                    } catch (e) {
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Error: $e'),
                            backgroundColor: Colors.red,
                            duration: const Duration(seconds: 3),
                          ),
                        );
                      }
                    }
                  },
                  icon: const Icon(Icons.logout, size: 20),
                  label: const Text(
                      'Cerrar Sesión',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: AppTheme.white,
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    elevation: 8,
                  ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsSection(String name, String description, IconData icon, String sectionId, Color sectionColor) {
    final isActive = _activeSections[sectionId] ?? true;
    final isSaving = _isLoadingSettings;

    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: const Duration(milliseconds: 300),
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
        decoration: BoxDecoration(
          color: AppTheme.darkSurface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isActive 
                ? sectionColor.withOpacity(0.4)
                : AppTheme.darkSurfaceVariant,
            width: isActive ? 2 : 1,
          ),
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: sectionColor.withOpacity(0.2),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ]
              : [],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: isSaving ? null : () async {
              final newStatus = !isActive;
              setState(() {
                _activeSections[sectionId] = newStatus;
              });

              final result = await _settingsService.updateSectionStatus(sectionId, newStatus);

              if (result['success'] != true) {
                // Revertir el cambio si falló
                setState(() {
                  _activeSections[sectionId] = isActive;
                });

                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(result['error'] ?? 'Error al actualizar la sección'),
                      backgroundColor: Colors.red,
                      duration: const Duration(seconds: 2),
                    ),
                  );
                }
              }
            },
            borderRadius: BorderRadius.circular(20),
            child: Padding(
              padding: const EdgeInsets.all(18),
      child: Row(
        children: [
                  // Icono con gradiente
          Container(
                    width: 56,
                    height: 56,
            decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: isActive
                            ? [
                                sectionColor.withOpacity(0.3),
                                sectionColor.withOpacity(0.1),
                              ]
                            : [
                                AppTheme.darkSurfaceVariant,
                                AppTheme.darkBackground,
                              ],
                      ),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isActive 
                            ? sectionColor.withOpacity(0.5)
                            : AppTheme.darkSurfaceVariant,
                        width: 1,
                      ),
                    ),
                    child: Icon(
                      icon,
                      color: isActive ? sectionColor : AppTheme.white60,
                      size: 28,
                    ),
          ),
          const SizedBox(width: 16),
                  // Información
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                          style: TextStyle(
                            fontSize: 17,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.white,
                            letterSpacing: 0.3,
                  ),
                ),
                        const SizedBox(height: 4),
                Text(
                  description,
                  style: const TextStyle(
                            fontSize: 13,
                    color: AppTheme.white60,
                  ),
                ),
              ],
            ),
          ),
                  const SizedBox(width: 12),
                  // Switch mejorado
          Container(
                    padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
                      color: isActive 
                          ? Colors.green.withOpacity(0.1)
                          : AppTheme.darkSurfaceVariant.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Switch(
                      value: isActive,
                      onChanged: isSaving ? null : (value) async {
                        setState(() {
                          _activeSections[sectionId] = value;
                        });

                        final result = await _settingsService.updateSectionStatus(sectionId, value);

                        if (result['success'] != true) {
                          // Revertir el cambio si falló
                          setState(() {
                            _activeSections[sectionId] = !value;
                          });

                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(result['error'] ?? 'Error al actualizar la sección'),
                                backgroundColor: Colors.red,
                                duration: const Duration(seconds: 2),
                              ),
                            );
                          }
                        }
                      },
                      activeColor: Colors.green,
                      activeTrackColor: Colors.green.withOpacity(0.5),
                      inactiveThumbColor: AppTheme.white60,
                      inactiveTrackColor: AppTheme.darkSurfaceVariant,
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

  Widget _buildEventCard(EventOrganization event, int index) {
    final eventColor = _getEventColor(event.type);
    // Obtener colores arcoíris basados en el índice para crear variación
    final rainbowColor1 = _getRainbowColor(index % _rainbowColors.length);
    final rainbowColor2 = _getRainbowColor((index + 1) % _rainbowColors.length);
    final rainbowColor3 = _getRainbowColor((index + 2) % _rainbowColors.length);
    
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
              rainbowColor1.withOpacity(0.15),
              rainbowColor2.withOpacity(0.1),
              rainbowColor3.withOpacity(0.05),
              AppTheme.darkSurface,
            ],
          ),
        borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: rainbowColor1.withOpacity(0.4),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: rainbowColor1.withOpacity(0.2),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
            BoxShadow(
              color: rainbowColor2.withOpacity(0.15),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Barra lateral con gradiente arcoíris
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
                      rainbowColor1,
                      rainbowColor2,
                      rainbowColor3,
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
                      // Icono del evento con fondo arcoíris
                      Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              rainbowColor1.withOpacity(0.4),
                              rainbowColor2.withOpacity(0.3),
                              rainbowColor3.withOpacity(0.2),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: rainbowColor1.withOpacity(0.5),
                            width: 1.5,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: rainbowColor1.withOpacity(0.3),
                              blurRadius: 8,
                              spreadRadius: 1,
                            ),
                          ],
                        ),
                        child: Center(
                          child: Text(
                            _getEventEmoji(event.type ?? ''),
                            style: const TextStyle(fontSize: 28),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                          event.eventName,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                              ),
                            ),
                            const SizedBox(height: 8),
                            // Tipo de evento con gradiente arcoíris
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    rainbowColor1.withOpacity(0.25),
                                    rainbowColor2.withOpacity(0.15),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: rainbowColor1.withOpacity(0.3),
                                  width: 1,
                                ),
                              ),
                              child: Text(
                                _getEventTypeLabel(event.type),
                                style: TextStyle(
                                  fontSize: 12,
                                  color: rainbowColor1,
                                  fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                      ),
                      // Botón de opciones
                      PopupMenuButton<String>(
                        icon: const Icon(Icons.more_vert, color: AppTheme.white60, size: 20),
                        color: AppTheme.darkSurface,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        onSelected: (value) async {
                          if (value == 'delete') {
                            final confirmed = await showDialog<bool>(
                              context: context,
                              builder: (context) => AlertDialog(
                                backgroundColor: AppTheme.darkSurface,
                                title: const Text(
                                  'Eliminar evento',
                                  style: TextStyle(color: AppTheme.white),
                                ),
                                content: Text(
                                  '¿Estás seguro de que quieres eliminar "${event.eventName}"?',
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
                            );

                            if (confirmed == true) {
                              // Si es un evento de escuela creado desde personal, eliminar la clase asociada
                              if ((event.type == 'education' || event.category == 'school') && event.id.endsWith('_event')) {
                                try {
                                  final classId = event.id.replaceAll('_event', '');
                                  await _classScheduleService.deleteClassSchedule(classId);
                                  print('Clase eliminada automáticamente para evento: ${event.eventName}');
                                } catch (e) {
                                  print('Error al eliminar clase para evento: $e');
                                  // Continuar con la eliminación del evento aunque falle la clase
                                }
                              }
                              // Si el evento termina en '_class', fue creado directamente desde personal, no hay clase asociada
                              
                              final success = await _eventService.deleteEvent(event.id);
                              if (success) {
                                setState(() {
                                  _events.removeWhere((e) => e.id == event.id);
                                });
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Evento eliminado exitosamente'),
                                    backgroundColor: Colors.green,
                                    duration: Duration(seconds: 2),
                                  ),
                                );
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Error al eliminar el evento'),
                                    backgroundColor: Colors.red,
                                    duration: Duration(seconds: 2),
                                  ),
                                );
                              }
                            }
                          } else if (value == 'edit') {
                            // TODO: Implementar edición de evento
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Edición de eventos próximamente'),
                                backgroundColor: _carminePastel,
                                duration: Duration(seconds: 2),
                              ),
                            );
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
                  const SizedBox(height: 16),
                  // Información del evento
                  if (event.time != null || event.location != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.darkBackground.withOpacity(0.5),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        children: [
            if (event.time != null) ...[
              Row(
                children: [
                                Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        rainbowColor2.withOpacity(0.3),
                                        rainbowColor3.withOpacity(0.2),
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(
                                      color: rainbowColor2.withOpacity(0.4),
                                      width: 1,
                                    ),
                                  ),
                                  child: Icon(
                                    Icons.access_time,
                                    size: 16,
                                    color: rainbowColor2,
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
                    event.time!,
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
                            if (event.location != null) const SizedBox(height: 12),
            ],
            if (event.location != null) ...[
              Row(
                children: [
                                Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        rainbowColor3.withOpacity(0.3),
                                        rainbowColor1.withOpacity(0.2),
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(
                                      color: rainbowColor3.withOpacity(0.4),
                                      width: 1,
                                    ),
                                  ),
                                  child: Icon(
                                    Icons.location_on,
                                    size: 16,
                                    color: rainbowColor3,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Ubicación',
                                        style: TextStyle(
                                          fontSize: 11,
                                          color: AppTheme.white60,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                  Text(
                    event.location!,
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
                          ],
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTaskCard(CalendarTask task, int index) {
    final taskColor = _getTaskColor(task.priority);
    // Obtener colores arcoíris basados en el índice para crear variación
    final rainbowColor1 = _getRainbowColor(index % _rainbowColors.length);
    final rainbowColor2 = _getRainbowColor((index + 1) % _rainbowColors.length);
    final rainbowColor3 = _getRainbowColor((index + 2) % _rainbowColors.length);
    
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
              rainbowColor1.withOpacity(0.15),
              rainbowColor2.withOpacity(0.1),
              rainbowColor3.withOpacity(0.05),
              AppTheme.darkSurface,
            ],
          ),
        borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: rainbowColor1.withOpacity(0.4),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: rainbowColor1.withOpacity(0.2),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
            BoxShadow(
              color: rainbowColor2.withOpacity(0.15),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Barra lateral con gradiente arcoíris
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
                      rainbowColor1,
                      rainbowColor2,
                      rainbowColor3,
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
                      // Checkbox mejorado
            GestureDetector(
                        onTap: () async {
                          final updatedTask = CalendarTask(
                            id: task.id,
                            title: task.title,
                            date: task.date,
                            completed: !task.completed,
                            time: task.time,
                            category: task.category,
                            priority: task.priority,
                          );

                          // Si es una tarea de escuela, también se actualizará en la sección de escuela
                          // (se actualizará automáticamente cuando se recargue school_sections)
                          
                          // Actualizar en Supabase
                          final result = await _taskService.updateTask(updatedTask);
                          
                          if (result['success'] == true) {
                setState(() {
                  _tasks = _tasks.map((t) {
                    if (t.id == task.id) {
                                  return updatedTask;
                    }
                    return t;
                  }).toList();
                });
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(result['error'] ?? 'Error al actualizar la tarea'),
                                backgroundColor: Colors.red,
                                duration: const Duration(seconds: 2),
                              ),
                            );
                          }
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
                                      rainbowColor1.withOpacity(0.4),
                                      rainbowColor2.withOpacity(0.3),
                                      rainbowColor3.withOpacity(0.2),
                                    ],
                            ),
                            borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                              color: task.completed
                                  ? Colors.green.withOpacity(0.6)
                                  : rainbowColor1.withOpacity(0.5),
                    width: 2,
                  ),
                            boxShadow: task.completed ? null : [
                              BoxShadow(
                                color: rainbowColor1.withOpacity(0.3),
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
                                          rainbowColor1.withOpacity(0.3),
                                          rainbowColor2.withOpacity(0.2),
                                        ],
                                      ),
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        color: rainbowColor1,
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
                    task.title,
                    style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                      color: task.completed ? AppTheme.white40 : AppTheme.white,
                      decoration: task.completed ? TextDecoration.lineThrough : null,
                    ),
                  ),
                    const SizedBox(height: 8),
                            // Prioridad con gradiente arcoíris
                            if (task.priority != null)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      rainbowColor1.withOpacity(0.25),
                                      rainbowColor2.withOpacity(0.15),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: rainbowColor1.withOpacity(0.3),
                                    width: 1,
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      _getTaskPriorityEmoji(task.priority ?? ''),
                                      style: const TextStyle(fontSize: 14),
                                    ),
                                    const SizedBox(width: 6),
                                    Text(
                                      _getTaskPriorityLabel(task.priority),
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: rainbowColor1,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                ],
              ),
            ),
                      // Botón de opciones
                      PopupMenuButton<String>(
                        icon: const Icon(Icons.more_vert, color: AppTheme.white60, size: 20),
                        color: AppTheme.darkSurface,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        onSelected: (value) async {
                          if (value == 'delete') {
                            final confirmed = await showDialog<bool>(
                              context: context,
                              builder: (context) => AlertDialog(
                                backgroundColor: AppTheme.darkSurface,
                                title: const Text(
                                  'Eliminar tarea',
                                  style: TextStyle(color: AppTheme.white),
                                ),
                                content: Text(
                                  '¿Estás seguro de que quieres eliminar "${task.title}"?',
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
                            );

                            if (confirmed == true) {
                              // Si es una tarea de escuela, también se eliminará de la sección de escuela
                              // (se actualizará automáticamente cuando se recargue school_sections)
                              
                              // Eliminar de Supabase
                              final success = await _taskService.deleteTask(task.id);
                              
                              if (success) {
                setState(() {
                  _tasks.removeWhere((t) => t.id == task.id);
                });
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Tarea eliminada exitosamente'),
                                    backgroundColor: Colors.green,
                                    duration: Duration(seconds: 2),
                                  ),
                                );
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Error al eliminar la tarea'),
                                    backgroundColor: Colors.red,
                                    duration: Duration(seconds: 2),
                                  ),
                                );
                              }
                            }
                          } else if (value == 'edit') {
                            // TODO: Implementar edición de tarea
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Edición de tareas próximamente'),
                                backgroundColor: _carminePastel,
                                duration: Duration(seconds: 2),
                              ),
                            );
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
                  const SizedBox(height: 16),
                  // Información de la tarea
                  if (task.time != null || task.category != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.darkBackground.withOpacity(0.5),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        children: [
                          if (task.time != null) ...[
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        rainbowColor2.withOpacity(0.3),
                                        rainbowColor3.withOpacity(0.2),
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(
                                      color: rainbowColor2.withOpacity(0.4),
                                      width: 1,
                                    ),
                                  ),
                                  child: Icon(
                                    Icons.access_time,
                                    size: 16,
                                    color: rainbowColor2,
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
                                        task.time!,
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
                            if (task.category != null) const SizedBox(height: 12),
                          ],
                          if (task.category != null) ...[
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        rainbowColor3.withOpacity(0.3),
                                        rainbowColor1.withOpacity(0.2),
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(
                                      color: rainbowColor3.withOpacity(0.4),
                                      width: 1,
                                    ),
                                  ),
                                  child: Icon(
                                    Icons.category,
                                    size: 16,
                                    color: rainbowColor3,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Categoría',
                                        style: TextStyle(
                                          fontSize: 11,
                                          color: AppTheme.white60,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        task.category!,
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
                          ],
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(
    String message,
    IconData icon,
    String subtitle,
    String buttonText,
    VoidCallback onButtonPressed,
    Color buttonColor, {
    List<Color>? gradientColors,
  }) {
    final colors = gradientColors ?? [buttonColor, buttonColor];
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
              border: Border.all(
                color: colors[0].withOpacity(0.3),
                width: 2,
              ),
            ),
            child: Icon(
              icon,
              size: 64,
              color: colors[0],
            ),
          ),
          const SizedBox(height: 24),
          Text(
            message,
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
          const SizedBox(height: 32),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: colors,
              ),
              borderRadius: BorderRadius.circular(20),
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
              icon: Icon(
                icon == Icons.check_circle ? Icons.task : Icons.event,
                size: 20,
              ),
              label: Text(buttonText),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                foregroundColor: AppTheme.white,
                shadowColor: Colors.transparent,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showAddEventDialog(BuildContext context) {
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
                'Agregar Evento',
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
                        labelText: 'Nombre del evento',
                        labelStyle: const TextStyle(color: AppTheme.white60),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _carminePastel),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: selectedType,
                      decoration: InputDecoration(
                        labelText: 'Tipo de evento',
                        labelStyle: const TextStyle(color: AppTheme.white60),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _carminePastel),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      dropdownColor: AppTheme.darkSurface,
                      style: const TextStyle(color: AppTheme.white),
                      items: const [
                        DropdownMenuItem(value: 'work', child: Text('Trabajo', style: TextStyle(color: AppTheme.white))),
                        DropdownMenuItem(value: 'personal', child: Text('Personal', style: TextStyle(color: AppTheme.white))),
                        DropdownMenuItem(value: 'health', child: Text('Salud', style: TextStyle(color: AppTheme.white))),
                        DropdownMenuItem(value: 'finance', child: Text('Finanzas', style: TextStyle(color: AppTheme.white))),
                        DropdownMenuItem(value: 'education', child: Text('Educación', style: TextStyle(color: AppTheme.white))),
                        DropdownMenuItem(value: 'social', child: Text('Social', style: TextStyle(color: AppTheme.white))),
                        DropdownMenuItem(value: 'travel', child: Text('Viaje', style: TextStyle(color: AppTheme.white))),
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
                                borderSide: BorderSide(color: _carminePastel),
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
                                        primary: _carminePastel,
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
                          borderSide: BorderSide(color: _carminePastel),
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
                    // Limpiar error anterior
                    setDialogState(() {
                      errorMessage = null;
                      isSaving = true;
                    });

                    if (nameController.text.isEmpty) {
                      setDialogState(() {
                        errorMessage = 'Por favor ingresa el nombre del evento';
                        isSaving = false;
                      });
                      return;
                    }

                    print('PersonalSections: Intentando agregar evento...');
                    print('PersonalSections: Nombre: ${nameController.text}');
                    print('PersonalSections: Fecha: ${DateFormat('yyyy-MM-dd').format(_selectedDate)}');

                    final eventDate = DateFormat('yyyy-MM-dd').format(_selectedDate);
                    final eventTime = timeController.text.isNotEmpty ? timeController.text : null;
                    
                    // Verificar empalmes
                    final overlappingEvents = await _checkEventOverlaps(eventDate, eventTime);
                    if (overlappingEvents.isNotEmpty) {
                      final shouldContinue = await _showOverlapWarning(context, overlappingEvents);
                      if (!shouldContinue) {
                        setDialogState(() {
                          isSaving = false;
                        });
                        return;
                      }
                    }

                    final newEvent = EventOrganization(
                      id: DateTime.now().millisecondsSinceEpoch.toString(),
                      eventName: nameController.text,
                      date: eventDate,
                      time: eventTime,
                      location: locationController.text.isNotEmpty ? locationController.text : null,
                      type: selectedType,
                      category: selectedType == 'education' ? 'school' : null,
                      createdAt: DateTime.now(),
                    );

                    print('PersonalSections: Evento creado, llamando a addEvent...');

                    // Guardar en Supabase
                    try {
                      final result = await _eventService.addEvent(newEvent);
                      
                      print('PersonalSections: Resultado de addEvent: $result');
                      
                      if (result['success'] == true) {
                        setState(() {
                          _events.add(newEvent);
                        });

                        // Si es un evento de educación, crear clase en horario
                        if (selectedType == 'education' && eventTime != null && eventTime.isNotEmpty) {
                          try {
                            final classSchedule = _eventToClass(newEvent);
                            if (classSchedule != null) {
                              final classResult = await _classScheduleService.addClassSchedule(classSchedule);
                              if (classResult['success'] == true) {
                                print('Clase creada automáticamente para evento: ${newEvent.eventName}');
                                
                                // Actualizar el evento con referencia a la clase para futuras sincronizaciones
                                final updatedEvent = EventOrganization(
                                  id: '${classSchedule.id}_event',
                                  eventName: newEvent.eventName,
                                  date: newEvent.date,
                                  time: newEvent.time,
                                  location: newEvent.location,
                                  type: newEvent.type,
                                  category: 'school',
                                  notes: newEvent.notes,
                                  createdAt: newEvent.createdAt,
                                );
                                
                                // Reemplazar el evento en la lista y en Supabase
                                await _eventService.deleteEvent(newEvent.id);
                                await _eventService.addEvent(updatedEvent);
                                
                                setState(() {
                                  _events.removeWhere((e) => e.id == newEvent.id);
                                  _events.add(updatedEvent);
                                });
                              }
                            }
                          } catch (e) {
                            print('Error al crear clase para evento: $e');
                            // No fallar si no se puede crear la clase
                          }
                        }

                        Navigator.of(dialogContext).pop();
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                selectedType == 'work'
                                    ? 'Evento agregado exitosamente y sincronizado con sesiones de trabajo'
                                    : selectedType == 'education'
                                        ? 'Evento agregado exitosamente y sincronizado con horario'
                                        : 'Evento agregado exitosamente',
                              ),
                              backgroundColor: Colors.green,
                              duration: const Duration(seconds: 2),
                            ),
                          );
                        }
                      } else {
                        // Mostrar error en el diálogo
                        setDialogState(() {
                          errorMessage = result['error'] ?? 'Error al agregar el evento. Intenta nuevamente.';
                          isSaving = false;
                        });
                        print('PersonalSections: Error al agregar evento: ${result['error']}');
                      }
                    } catch (e) {
                      print('PersonalSections: Excepción al agregar evento: $e');
                      setDialogState(() {
                        errorMessage = 'Error inesperado: $e';
                        isSaving = false;
                      });
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _carminePastel,
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

  void _showAddTaskDialog(BuildContext context) {
    final titleController = TextEditingController();
    final timeController = TextEditingController();
    String? selectedPriority;
    String? selectedSection;
    TimeOfDay? selectedTime;
    String? errorMessage;
    bool isSaving = false;

    // Lista de secciones disponibles
    final availableSections = [
      {'id': 'personal', 'name': 'Personal', 'icon': '👤'},
      {'id': 'work', 'name': 'Trabajo', 'icon': '💼'},
      {'id': 'school', 'name': 'Escuela', 'icon': '🎓'},
      {'id': 'health', 'name': 'Salud', 'icon': '🏥'},
      {'id': 'finance', 'name': 'Finanzas', 'icon': '💰'},
      {'id': 'language', 'name': 'Idiomas', 'icon': '🌍'},
      {'id': 'menstrual', 'name': 'Menstrual', 'icon': '🌸'},
      {'id': 'entrepreneurship', 'name': 'Emprendimientos', 'icon': '🚀'},
    ];

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: AppTheme.darkSurface,
              title: const Text(
                'Agregar Tarea',
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
                      controller: titleController,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontSize: 16,
                      ),
                      decoration: InputDecoration(
                        labelText: 'Título de la tarea',
                        labelStyle: const TextStyle(
                          color: AppTheme.white60,
                          fontSize: 16,
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _carminePastel),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: selectedSection,
                      decoration: InputDecoration(
                        labelText: 'Sección',
                        labelStyle: const TextStyle(
                          color: AppTheme.white60,
                          fontSize: 16,
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _carminePastel),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      dropdownColor: AppTheme.darkSurface,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontSize: 16,
                      ),
                      items: [
                        const DropdownMenuItem(
                          value: null,
                          child: Text(
                            'Sin sección',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 16,
                            ),
                          ),
                        ),
                        ...availableSections.map((section) => DropdownMenuItem(
                          value: section['id'] as String,
                          child: Text(
                            '${section['icon']} ${section['name']}',
                            style: const TextStyle(
                              color: AppTheme.white,
                              fontSize: 16,
                            ),
                          ),
                        )),
                      ],
                      onChanged: (value) {
                        setDialogState(() {
                          selectedSection = value;
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: selectedPriority,
                      decoration: InputDecoration(
                        labelText: 'Prioridad',
                        labelStyle: const TextStyle(
                          color: AppTheme.white60,
                          fontSize: 16,
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _carminePastel),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      dropdownColor: AppTheme.darkSurface,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontSize: 16,
                      ),
                      items: const [
                        DropdownMenuItem(
                          value: 'high',
                          child: Text(
                            '🔥 Alta',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 16,
                            ),
                          ),
                        ),
                        DropdownMenuItem(
                          value: 'medium',
                          child: Text(
                            '⭐ Media',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 16,
                            ),
                          ),
                        ),
                        DropdownMenuItem(
                          value: 'low',
                          child: Text(
                            '🌱 Baja',
                            style: TextStyle(
                              color: AppTheme.white,
                              fontSize: 16,
                            ),
                          ),
                        ),
                      ],
                      onChanged: (value) {
                        setDialogState(() {
                          selectedPriority = value;
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: timeController,
                      readOnly: true,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontSize: 16,
                      ),
                      decoration: InputDecoration(
                        labelText: 'Hora (opcional)',
                        labelStyle: const TextStyle(
                          color: AppTheme.white60,
                          fontSize: 16,
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: _carminePastel),
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
                                  primary: _carminePastel,
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

                    if (titleController.text.isEmpty) {
                      setDialogState(() {
                        errorMessage = 'Por favor ingresa el título de la tarea';
                        isSaving = false;
                      });
                      return;
                    }

                    // Obtener el nombre de la sección seleccionada
                    String? sectionName;
                    if (selectedSection != null) {
                      try {
                        final section = availableSections.firstWhere(
                          (s) => s['id'] == selectedSection,
                        );
                        sectionName = section['name'] as String?;
                      } catch (e) {
                        sectionName = selectedSection;
                      }
                    }

                    final newTask = CalendarTask(
                      id: DateTime.now().millisecondsSinceEpoch.toString(),
                      title: titleController.text,
                      date: _selectedDate,
                      completed: false,
                      time: timeController.text.isNotEmpty ? timeController.text : null,
                      category: selectedSection != null ? sectionName : null,
                      priority: selectedPriority,
                    );

                    // Guardar en Supabase
                    final result = await _taskService.addTask(newTask);

                    if (result['success'] == true) {
                      setState(() {
                        _tasks.add(newTask);
                      });

                      // Si es una tarea de escuela, también se reflejará en la sección de escuela
                      // (se cargará automáticamente cuando se abra school_sections)
                      if (selectedSection == 'school') {
                        print('Tarea de escuela agregada, se reflejará en la sección de escuela');
                      }

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
                    } else {
                      // Mostrar error en el diálogo
                      setDialogState(() {
                        errorMessage = result['error'] ?? 'Error al agregar la tarea. Intenta nuevamente.';
                        isSaving = false;
                      });
                      print('PersonalSections: Error al agregar tarea: ${result['error']}');
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _carminePastel,
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
}

