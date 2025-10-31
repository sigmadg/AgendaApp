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
  
  List<CalendarTask> _tasks = [];
  List<EventOrganization> _events = [];
  final EventService _eventService = EventService();
  final TaskService _taskService = TaskService();
  bool _isLoadingEvents = false;
  bool _isLoadingTasks = false;

  final sections = [
    {'id': 'events', 'name': 'Eventos del día', 'icon': Icons.calendar_today},
    {'id': 'tasks', 'name': 'Tareas', 'icon': Icons.check_circle},
    {'id': 'profile', 'name': 'Perfil', 'icon': Icons.person},
    {'id': 'settings', 'name': 'Configuración', 'icon': Icons.settings},
  ];

  Color _getEventColor(String? type) {
    switch (type) {
      case 'work':
        return Colors.blue;
      case 'personal':
        return Colors.purple;
      case 'health':
        return Colors.green;
      case 'finance':
        return Colors.orange;
      case 'education':
        return Colors.teal;
      case 'social':
        return Colors.pink;
      case 'travel':
        return Colors.cyan;
      default:
        return AppTheme.orangeAccent;
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
        return Colors.orange;
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

  List<CalendarTask> _getTasksForDate(DateTime date) {
    return _tasks.where((task) {
      return task.date.year == date.year &&
             task.date.month == date.month &&
             task.date.day == date.day;
    }).toList();
  }

  @override
  void initState() {
    super.initState();
    _activeSection = widget.initialSection ?? 'events';
    _loadEvents();
    _loadTasks();
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

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: Colors.transparent,
      drawer: _buildNavigationDrawer(context, authProvider),
      appBar: NavigationHeader(currentSection: 'personal'),
      floatingActionButton: _activeSection == 'events'
          ? FloatingActionButton.extended(
              onPressed: () => _showAddEventDialog(context),
              backgroundColor: AppTheme.orangeAccent,
              icon: const Icon(Icons.event, color: AppTheme.white),
              label: const Text(
                'Nuevo Evento',
                style: TextStyle(
                  color: AppTheme.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
              tooltip: 'Agregar evento',
              elevation: 8,
            )
          : _activeSection == 'tasks'
              ? FloatingActionButton.extended(
                  onPressed: () => _showAddTaskDialog(context),
                  backgroundColor: Colors.blue,
                  icon: const Icon(Icons.task, color: AppTheme.white),
                  label: const Text(
                    'Nueva Tarea',
                    style: TextStyle(
                      color: AppTheme.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  tooltip: 'Agregar tarea',
                  elevation: 8,
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
              // TODO: Navegar a HealthSections cuando esté creado
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.account_balance_wallet_outlined,
            title: 'Finanzas',
            color: Colors.amber,
            onTap: () {
              Navigator.pop(context);
              // TODO: Navegar a FinanceSections cuando esté creado
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.restaurant,
            title: 'Nutrición',
            color: Colors.orange,
            onTap: () {
              Navigator.pop(context);
              // TODO: Navegar a NutritionSections cuando esté creado
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.fitness_center,
            title: 'Ejercicio',
            color: Colors.red,
            onTap: () {
              Navigator.pop(context);
              // TODO: Navegar a ExerciseSections cuando esté creado
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.language,
            title: 'Idiomas',
            color: Colors.teal,
            onTap: () {
              Navigator.pop(context);
              // TODO: Navegar a LanguageSections cuando esté creado
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.eco_outlined,
            title: 'Menstrual',
            color: Colors.pink,
            onTap: () {
              Navigator.pop(context);
              // TODO: Navegar a MenstrualSections cuando esté creado
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.pets,
            title: 'Mascotas',
            color: Colors.brown,
            onTap: () {
              Navigator.pop(context);
              // TODO: Navegar a PetSections cuando esté creado
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.book,
            title: 'Lectura',
            color: Colors.indigo,
            onTap: () {
              Navigator.pop(context);
              // TODO: Navegar a ReadingSections cuando esté creado
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.movie,
            title: 'Películas',
            color: Colors.deepPurple,
            onTap: () {
              Navigator.pop(context);
              // TODO: Navegar a MoviesSections cuando esté creado
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
        children: sections.map((section) {
          final isActive = _activeSection == section['id'];
          return Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _activeSection = section['id'] as String),
              child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
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
                              ? AppTheme.orangeAccent 
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
    final todayEvents = _getEventsForDate(_selectedDate);
    final isToday = _selectedDate.year == DateTime.now().year &&
                    _selectedDate.month == DateTime.now().month &&
                    _selectedDate.day == DateTime.now().day;

    return Column(
      children: [
        // Header mejorado con selector de fecha
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                AppTheme.orangeAccent.withOpacity(0.15),
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
                                color: AppTheme.orangeAccent.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.calendar_today, size: 16, color: AppTheme.orangeAccent),
                                  const SizedBox(width: 6),
                                  Text(
                                    isToday ? 'Hoy' : DateFormat('EEEE, d MMMM', 'es').format(_selectedDate),
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: AppTheme.orangeAccent,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Eventos - ${DateFormat('EEEE', 'es').format(_selectedDate)}',
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        if (todayEvents.isNotEmpty)
                          Padding(
                            padding: const EdgeInsets.only(top: 4),
                            child: Text(
                              '${todayEvents.length} ${todayEvents.length == 1 ? 'evento' : 'eventos'}',
                              style: const TextStyle(
                                fontSize: 14,
                                color: AppTheme.white60,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Selector de fecha mejorado
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildDateSelector(DateTime.now(), isToday),
                    if (!isToday)
                      _buildDateSelector(
                        DateTime.now().subtract(const Duration(days: 1)),
                        false,
                      ),
                    if (!isToday)
                      _buildDateSelector(
                        DateTime.now().add(const Duration(days: 1)),
                        false,
                      ),
                  ],
                ),
              ],
            ),
          ),
        ),
        Expanded(
          child: todayEvents.isEmpty
              ? _buildEmptyState(
                  isToday 
                      ? 'No hay eventos programados para hoy' 
                      : 'No hay eventos para esta fecha',
                  Icons.event_busy,
                  'Agrega un nuevo evento usando el botón +',
                  'Agregar Evento',
                  () => _showAddEventDialog(context),
                  AppTheme.orangeAccent,
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: todayEvents.length,
                  itemBuilder: (context, index) => _buildEventCard(todayEvents[index], index),
                ),
        ),
      ],
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
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected 
              ? AppTheme.orangeAccent.withOpacity(0.2)
              : AppTheme.darkSurfaceVariant.withOpacity(0.5),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected 
                ? AppTheme.orangeAccent 
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
                color: isSelected ? AppTheme.orangeAccent : AppTheme.white60,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              '${date.day}',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: isSelected ? AppTheme.orangeAccent : AppTheme.white,
              ),
            ),
            if (isToday)
              Container(
                margin: const EdgeInsets.only(top: 4),
                width: 4,
                height: 4,
                decoration: BoxDecoration(
                  color: AppTheme.orangeAccent,
                  shape: BoxShape.circle,
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildTasks() {
    final todayTasks = _getTasksForDate(_selectedDate);
    final isToday = _selectedDate.year == DateTime.now().year &&
                    _selectedDate.month == DateTime.now().month &&
                    _selectedDate.day == DateTime.now().day;
    final completedTasks = todayTasks.where((t) => t.completed).length;
    final pendingTasks = todayTasks.where((t) => !t.completed).length;

    return Column(
      children: [
        // Header mejorado con selector de fecha
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.blue.withOpacity(0.15),
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
                                color: Colors.blue.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.check_circle, size: 16, color: Colors.blue),
                                  const SizedBox(width: 6),
                                  Text(
                                    isToday ? 'Hoy' : DateFormat('EEEE, d MMMM', 'es').format(_selectedDate),
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.blue,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Tareas - ${DateFormat('EEEE', 'es').format(_selectedDate)}',
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        if (todayTasks.isNotEmpty)
                          Padding(
                            padding: const EdgeInsets.only(top: 4),
                            child: Row(
                              children: [
                                if (pendingTasks > 0) ...[
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: Colors.orange.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      '$pendingTasks pendiente${pendingTasks == 1 ? '' : 's'}',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.orange,
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
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Selector de fecha mejorado
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildDateSelector(DateTime.now(), isToday),
                    if (!isToday)
                      _buildDateSelector(
                        DateTime.now().subtract(const Duration(days: 1)),
                        false,
                      ),
                    if (!isToday)
                      _buildDateSelector(
                        DateTime.now().add(const Duration(days: 1)),
                        false,
                      ),
                  ],
                ),
              ],
            ),
          ),
        ),
        Expanded(
          child: todayTasks.isEmpty
              ? _buildEmptyState(
                  isToday 
                      ? 'No hay tareas pendientes para hoy' 
                      : 'No hay tareas para esta fecha',
                  Icons.check_circle,
                  'Agrega una nueva tarea usando el botón +',
                  'Agregar Tarea',
                  () => _showAddTaskDialog(context),
                  Colors.blue,
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: todayTasks.length,
                  itemBuilder: (context, index) => _buildTaskCard(todayTasks[index], index),
                ),
        ),
      ],
    );
  }

  Widget _buildProfile(user) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Card(
            color: AppTheme.darkSurface,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: AppTheme.orangeAccent,
                      borderRadius: BorderRadius.circular(36),
                    ),
                    child: const Icon(
                      Icons.person,
                      size: 36,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
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
                            color: AppTheme.white70,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.green,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.check_circle, size: 14, color: AppTheme.white),
                              SizedBox(width: 4),
                              Text(
                                'Verificado',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.white,
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
          const SizedBox(height: 16),
          _buildProfileOption(
            icon: Icons.edit,
            title: 'Editar Perfil',
            subtitle: 'Actualiza tu información personal',
            color: Colors.blue,
            onTap: () {},
          ),
          const SizedBox(height: 12),
          _buildProfileOption(
            icon: Icons.lock_outline,
            title: 'Cambiar Contraseña',
            subtitle: 'Actualiza tu contraseña de seguridad',
            color: Colors.orange,
            onTap: () {},
          ),
          const SizedBox(height: 12),
          _buildProfileOption(
            icon: Icons.notifications_outlined,
            title: 'Notificaciones',
            subtitle: 'Configura tus preferencias',
            color: Colors.pink,
            onTap: () {},
          ),
          const SizedBox(height: 12),
          _buildProfileOption(
            icon: Icons.shield_outlined,
            title: 'Privacidad',
            subtitle: 'Controla tu privacidad',
            color: Colors.green,
            onTap: () {},
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
  }) {
    return Card(
      color: AppTheme.darkSurface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 20),
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
                        fontWeight: FontWeight.w600,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.chevron_right,
                color: AppTheme.white60,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSettings() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'CONFIGURACIÓN',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Secciones Disponibles',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Activa solo las secciones que necesitas para tu organización personal',
            style: const TextStyle(
              fontSize: 14,
              color: AppTheme.white60,
            ),
          ),
          const SizedBox(height: 24),
          Card(
            color: AppTheme.darkSurface,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _buildSettingsSection('Personal', 'Mi Perfil', Icons.person, true),
                  _buildSettingsSection('Trabajo', 'Trabajo y proyectos', Icons.work, true),
                  _buildSettingsSection('Escuela', 'Estudios y educación', Icons.school, true),
                  _buildSettingsSection('Salud', 'Salud y bienestar', Icons.health_and_safety, true),
                  _buildSettingsSection('Finanzas', 'Finanzas personales', Icons.account_balance_wallet, true),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          Card(
            color: AppTheme.darkSurface,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  const Text(
                    'Cerrar Sesión',
                    style: TextStyle(
                      fontSize: 18,
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
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      final authProvider = Provider.of<AuthProvider>(context, listen: false);
                      authProvider.signOut();
                      context.go('/login');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                      foregroundColor: AppTheme.white,
                      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    child: const Text(
                      'Cerrar Sesión',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
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

  Widget _buildSettingsSection(String name, String description, IconData icon, bool isActive) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: isActive ? AppTheme.orangeAccent : AppTheme.darkSurfaceVariant,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: AppTheme.white, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.white,
                  ),
                ),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white60,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: isActive ? Colors.green : AppTheme.darkSurfaceVariant,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              isActive ? 'ON' : 'OFF',
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: AppTheme.white,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEventCard(EventOrganization event, int index) {
    final eventColor = _getEventColor(event.type);
    
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
          color: AppTheme.darkSurface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: eventColor.withOpacity(0.3),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: eventColor.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Barra lateral de color
            Positioned(
              left: 0,
              top: 0,
              bottom: 0,
              child: Container(
                width: 4,
                decoration: BoxDecoration(
                  color: eventColor,
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
                      // Icono del evento con fondo mejorado
                      Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              eventColor.withOpacity(0.3),
                              eventColor.withOpacity(0.1),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: eventColor.withOpacity(0.3),
                            width: 1,
                          ),
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
                            // Tipo de evento mejorado
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: eventColor.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                _getEventTypeLabel(event.type),
                                style: TextStyle(
                                  fontSize: 12,
                                  color: eventColor,
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
                                backgroundColor: AppTheme.orangeAccent,
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
                                    color: eventColor.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Icon(
                                    Icons.access_time,
                                    size: 16,
                                    color: eventColor,
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
                                    color: eventColor.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Icon(
                                    Icons.location_on,
                                    size: 16,
                                    color: eventColor,
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
          color: AppTheme.darkSurface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: taskColor.withOpacity(0.3),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: taskColor.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Barra lateral de color según prioridad
            Positioned(
              left: 0,
              top: 0,
              bottom: 0,
              child: Container(
                width: 4,
                decoration: BoxDecoration(
                  color: taskColor,
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
                                      Colors.green.withOpacity(0.3),
                                      Colors.green.withOpacity(0.1),
                                    ]
                                  : [
                                      taskColor.withOpacity(0.3),
                                      taskColor.withOpacity(0.1),
                                    ],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: task.completed
                                  ? Colors.green.withOpacity(0.5)
                                  : taskColor.withOpacity(0.5),
                              width: 2,
                            ),
                          ),
                          child: Center(
                            child: task.completed
                                ? const Icon(Icons.check, color: Colors.green, size: 28)
                                : Container(
                                    width: 20,
                                    height: 20,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        color: taskColor,
                                        width: 2,
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
                            // Prioridad mejorada
                            if (task.priority != null)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: taskColor.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(8),
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
                                        color: taskColor,
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
                                backgroundColor: AppTheme.orangeAccent,
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
                                    color: taskColor.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Icon(
                                    Icons.access_time,
                                    size: 16,
                                    color: taskColor,
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
                                    color: taskColor.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Icon(
                                    Icons.category,
                                    size: 16,
                                    color: taskColor,
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
    Color buttonColor,
  ) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: buttonColor.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              size: 64,
              color: buttonColor.withOpacity(0.6),
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
          ElevatedButton.icon(
            onPressed: onButtonPressed,
            icon: Icon(
              icon == Icons.check_circle ? Icons.task : Icons.event,
              size: 20,
            ),
            label: Text(buttonText),
            style: ElevatedButton.styleFrom(
              backgroundColor: buttonColor,
              foregroundColor: AppTheme.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
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
                          borderSide: BorderSide(color: AppTheme.orangeAccent),
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
                          borderSide: BorderSide(color: AppTheme.orangeAccent),
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
                                borderSide: BorderSide(color: AppTheme.orangeAccent),
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
                                        primary: AppTheme.orangeAccent,
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
                          borderSide: BorderSide(color: AppTheme.orangeAccent),
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

                    final newEvent = EventOrganization(
                      id: DateTime.now().millisecondsSinceEpoch.toString(),
                      eventName: nameController.text,
                      date: DateFormat('yyyy-MM-dd').format(_selectedDate),
                      time: timeController.text.isNotEmpty ? timeController.text : null,
                      location: locationController.text.isNotEmpty ? locationController.text : null,
                      type: selectedType,
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
                    backgroundColor: AppTheme.orangeAccent,
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
      {'id': 'nutrition', 'name': 'Nutrición', 'icon': '🍎'},
      {'id': 'exercise', 'name': 'Ejercicio', 'icon': '💪'},
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
                          borderSide: BorderSide(color: AppTheme.orangeAccent),
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
                          borderSide: BorderSide(color: AppTheme.orangeAccent),
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
                          borderSide: BorderSide(color: AppTheme.orangeAccent),
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
                          borderSide: BorderSide(color: AppTheme.orangeAccent),
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
                                  primary: AppTheme.orangeAccent,
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
                    backgroundColor: AppTheme.orangeAccent,
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

