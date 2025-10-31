import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../models/work/weekly_task.dart';
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
  
  List<WeeklyTask> _weeklyTasks = [];
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
  
  bool _showNotesModal = false;
  WeeklyTask? _editingTask;
  DailyTask? _editingDailyTask;
  bool _showAddProjectModal = false;
  List<ProjectGoal> _tempProjectGoals = [];
  final TextEditingController _tempGoalTextController = TextEditingController();

  final sections = [
    {'id': 'weekly', 'name': 'Tareas Semanales', 'icon': Icons.calendar_view_week},
    {'id': 'daily', 'name': 'Tareas Diarias', 'icon': Icons.today},
    {'id': 'projects', 'name': 'Proyectos', 'icon': Icons.folder},
    {'id': 'strategy', 'name': 'Estrategia', 'icon': Icons.track_changes},
    {'id': 'priorities', 'name': 'Prioridades', 'icon': Icons.priority_high},
    {'id': 'focus', 'name': 'Enfoque', 'icon': Icons.center_focus_strong},
    {'id': 'goals', 'name': 'Objetivos', 'icon': Icons.flag},
    {'id': 'planning', 'name': 'Planificación', 'icon': Icons.assignment},
  ];

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
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppTheme.darkBackground,
      drawer: _buildNavigationDrawer(context),
      appBar: NavigationHeader(currentSection: 'work'),
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
      case 'priorities':
        return _buildPriorities();
      case 'focus':
        return _buildFocus();
      case 'goals':
        return _buildGoals();
      case 'planning':
        return _buildPlanning();
      default:
        return _buildWeeklyTasks();
    }
  }

  Widget _buildWeeklyTasks() {
    final completedTasks = _weeklyTasks.where((t) => t.completed).length;
    final totalTasks = _weeklyTasks.length;
    final overdueTasks = _weeklyTasks.where((t) => !t.completed && t.date.isBefore(DateTime.now().subtract(const Duration(days: 1)))).length;
    
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header mejorado
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.orangeAccent,
                  borderRadius: BorderRadius.circular(16),
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
                      child: const Icon(Icons.calendar_today, color: AppTheme.white, size: 24),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Tareas Semanales',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                          const Text(
                            'Planifica tu semana de trabajo',
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
                      color: Colors.blue,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSummaryCard(
                      icon: Icons.warning_outlined,
                      value: '$overdueTasks',
                      label: 'Vencidas',
                      color: Colors.orange,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              
              // Formulario para agregar tarea
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    TextField(
                      controller: _weeklyTaskController,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        hintText: 'Escribe una nueva tarea...',
                        hintStyle: const TextStyle(color: AppTheme.white60),
                        filled: true,
                        fillColor: AppTheme.darkSurfaceVariant,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () async {
                              final date = await showDatePicker(
                                context: context,
                                initialDate: _selectedWeeklyDate ?? DateTime.now(),
                                firstDate: DateTime(2020),
                                lastDate: DateTime(2030),
                              );
                              if (date != null) {
                                setState(() => _selectedWeeklyDate = date);
                              }
                            },
                            icon: const Icon(Icons.calendar_today, size: 18),
                            label: Text(
                              _selectedWeeklyDate != null
                                  ? '${_selectedWeeklyDate!.day}/${_selectedWeeklyDate!.month}/${_selectedWeeklyDate!.year}'
                                  : 'Seleccionar fecha',
                              style: const TextStyle(fontSize: 12),
                            ),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppTheme.white60,
                              side: const BorderSide(color: AppTheme.white60),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        ElevatedButton.icon(
                          onPressed: _addWeeklyTask,
                          icon: const Icon(Icons.add, size: 20),
                          label: const Text('Agregar'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.orangeAccent,
                            foregroundColor: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              
              // Lista de tareas
              if (_weeklyTasks.isEmpty)
                _buildEmptyState('No hay tareas semanales', Icons.calendar_view_week)
              else
                ..._weeklyTasks.map((task) => _buildWeeklyTaskCard(task)),
            ],
          ),
        ),
        
        // Modal de notas
        if (_showNotesModal) _buildNotesModal(),
      ],
    );
  }
  
  void _addWeeklyTask() {
    if (_weeklyTaskController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingresa una tarea')),
      );
      return;
    }
    
    setState(() {
      _weeklyTasks.add(WeeklyTask(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        task: _weeklyTaskController.text.trim(),
        date: _selectedWeeklyDate ?? DateTime.now(),
        completed: false,
      ));
      _weeklyTaskController.clear();
      _selectedWeeklyDate = DateTime.now();
    });
  }
  
  Widget _buildSummaryCard({
    required IconData icon,
    required String value,
    required String label,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(20),
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
                        _editingTask = null;
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
                  if (_editingTask != null) {
                    setState(() {
                      final index = _weeklyTasks.indexWhere((t) => t.id == _editingTask!.id);
                      if (index != -1) {
                        _weeklyTasks[index] = WeeklyTask(
                          id: _editingTask!.id,
                          task: _editingTask!.task,
                          date: _editingTask!.date,
                          completed: _editingTask!.completed,
                          notes: _notesController.text.trim(),
                          priority: _editingTask!.priority,
                        );
                      }
                    });
                  }
                  setState(() {
                    _showNotesModal = false;
                    _editingTask = null;
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
          // Header mejorado
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.orangeAccent,
              borderRadius: BorderRadius.circular(16),
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
                        'Tareas Diarias',
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
                  color: Colors.blue,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.today,
                  value: '$todayTasks',
                  label: 'Hoy',
                  color: Colors.green,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          // Formulario para agregar tarea diaria
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              children: [
                TextField(
                  controller: _dailyTaskController,
                  style: const TextStyle(color: AppTheme.white),
                  decoration: InputDecoration(
                    hintText: 'Escribe una nueva tarea diaria...',
                    hintStyle: const TextStyle(color: AppTheme.white60),
                    filled: true,
                    fillColor: AppTheme.darkSurfaceVariant,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () async {
                          final date = await showDatePicker(
                            context: context,
                            initialDate: _selectedDailyDate ?? DateTime.now(),
                            firstDate: DateTime(2020),
                            lastDate: DateTime(2030),
                          );
                          if (date != null) {
                            setState(() => _selectedDailyDate = date);
                          }
                        },
                        icon: const Icon(Icons.calendar_today, size: 18),
                        label: Text(
                          _selectedDailyDate != null
                              ? '${_selectedDailyDate!.day}/${_selectedDailyDate!.month}/${_selectedDailyDate!.year}'
                              : 'Fecha',
                          style: const TextStyle(fontSize: 12),
                        ),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.white60,
                          side: const BorderSide(color: AppTheme.white60),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () async {
                          final time = await showTimePicker(
                            context: context,
                            initialTime: _selectedDailyTime ?? TimeOfDay.now(),
                          );
                          if (time != null) {
                            setState(() => _selectedDailyTime = time);
                          }
                        },
                        icon: const Icon(Icons.access_time, size: 18),
                        label: Text(
                          _selectedDailyTime != null
                              ? '${_selectedDailyTime!.hour.toString().padLeft(2, '0')}:${_selectedDailyTime!.minute.toString().padLeft(2, '0')}'
                              : 'Hora',
                          style: const TextStyle(fontSize: 12),
                        ),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.white60,
                          side: const BorderSide(color: AppTheme.white60),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                ElevatedButton.icon(
                  onPressed: _addDailyTask,
                  icon: const Icon(Icons.add, size: 20),
                  label: const Text('Agregar Tarea'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.orangeAccent,
                    foregroundColor: AppTheme.white,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Lista de tareas
          if (_dailyTasks.isEmpty)
            _buildEmptyState('No hay tareas diarias', Icons.today)
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
      ));
      _dailyTaskController.clear();
      _selectedDailyDate = DateTime.now();
      _selectedDailyTime = TimeOfDay.now();
    });
  }

  Widget _buildProjects() {
    final completedProjects = _projects.where((p) {
      if (p.goals.isEmpty) return false;
      return p.goals.every((g) => true); // Simplificado, asumimos completado si todas las metas están hechas
    }).length;
    final activeProjects = _projects.length - completedProjects;
    
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header mejorado
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.orangeAccent,
                  borderRadius: BorderRadius.circular(16),
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
                      child: const Icon(Icons.folder, color: AppTheme.white, size: 24),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Proyectos',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                          const Text(
                            'Gestiona y organiza tus proyectos de trabajo',
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
              
              // Resumen de proyectos
              Row(
                children: [
                  Expanded(
                    child: _buildSummaryCard(
                      icon: Icons.check_circle_outline,
                      value: '$completedProjects/${_projects.length}',
                      label: 'Completados',
                      color: Colors.blue,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSummaryCard(
                      icon: Icons.play_circle_outline,
                      value: '$activeProjects',
                      label: 'Activos',
                      color: Colors.green,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              
              // Botón para agregar proyecto
              ElevatedButton.icon(
                onPressed: () => setState(() => _showAddProjectModal = true),
                icon: const Icon(Icons.add_circle_outline),
                label: const Text('Nuevo Proyecto'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.orangeAccent,
                  foregroundColor: AppTheme.white,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                ),
              ),
              const SizedBox(height: 20),
              
              // Lista de proyectos
              if (_projects.isEmpty)
                _buildEmptyState('No hay proyectos creados\nCrea tu primer proyecto para comenzar', Icons.folder)
              else
                ..._projects.map((project) => _buildProjectCard(project)),
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
    final activeProjects = _projects.length;
    final completedProjects = _projects.where((p) => p.goals.isNotEmpty).length;
    final overdueProjects = _projects.where((p) => 
      p.deadline != null && p.deadline!.isBefore(DateTime.now())
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
              color: AppTheme.orangeAccent,
              borderRadius: BorderRadius.circular(16),
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
                        'Estrategia de Proyectos',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const Text(
                        'Organiza y supervisa tus proyectos profesionales',
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
          
          // Estadísticas del dashboard
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.folder,
                  value: '$activeProjects',
                  label: 'Proyectos Activos',
                  color: AppTheme.orangeAccent,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle,
                  value: '$completedProjects',
                  label: 'Completados',
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.access_time,
                  value: '$overdueProjects',
                  label: 'En Retraso',
                  color: Colors.orange,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          // Lista de proyectos
          if (_projects.isEmpty)
            _buildEmptyState('No hay proyectos creados\nCrea proyectos para ver tu estrategia', Icons.dashboard)
          else
            ..._projects.map((project) => _buildProjectCard(project)),
        ],
      ),
    );
  }

  Widget _buildPriorities() {
    final priorityColors = [Colors.red, Colors.teal, Colors.blue, Colors.green, Colors.amber];
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header mejorado
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.orangeAccent,
              borderRadius: BorderRadius.circular(16),
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
                      backgroundColor: AppTheme.orangeAccent,
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

  Widget _buildFocus() {
    final focusColors = [Colors.indigo, Colors.cyan, Colors.purple, Colors.pink, Colors.orange];
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header mejorado
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.orangeAccent,
              borderRadius: BorderRadius.circular(16),
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
                      backgroundColor: AppTheme.orangeAccent,
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
          // Header mejorado
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.orangeAccent,
              borderRadius: BorderRadius.circular(16),
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
                  color: Colors.blue,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.trending_up,
                  value: '$progressPercentage%',
                  label: 'Progreso',
                  color: Colors.green,
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
                      backgroundColor: AppTheme.orangeAccent,
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
    final totalTasks = _weeklyTasks.length + _dailyTasks.values.expand((t) => t).length;
    final completedTasks = _weeklyTasks.where((t) => t.completed).length + 
                          _dailyTasks.values.expand((t) => t.where((dt) => dt.completed)).length;
    final efficiency = totalTasks > 0 ? (completedTasks / totalTasks * 100).round() : 0;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header mejorado
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.orangeAccent,
              borderRadius: BorderRadius.circular(16),
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
                  final dayTasks = _weeklyTasks.length; // Simplificado
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
                                color: AppTheme.orangeAccent,
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

  Widget _buildWeeklyTaskCard(WeeklyTask task) {
    final isOverdue = !task.completed && task.date.isBefore(DateTime.now().subtract(const Duration(days: 1)));
    
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                GestureDetector(
                  onTap: () {
                    setState(() {
                      final index = _weeklyTasks.indexWhere((t) => t.id == task.id);
                      if (index != -1) {
                        _weeklyTasks[index] = WeeklyTask(
                          id: task.id,
                          task: task.task,
                          date: task.date,
                          completed: !task.completed,
                          notes: task.notes,
                          priority: task.priority,
                        );
                      }
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
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.calendar_today, size: 12, color: AppTheme.white60),
                          const SizedBox(width: 4),
                          Text(
                            '${task.date.day}/${task.date.month}/${task.date.year}',
                            style: const TextStyle(fontSize: 12, color: AppTheme.white60),
                          ),
                          if (isOverdue) ...[
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.orange,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: const Text(
                                'Vencida',
                                style: TextStyle(fontSize: 10, color: AppTheme.white),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: Icon(
                    task.notes != null && task.notes!.isNotEmpty 
                        ? Icons.note 
                        : Icons.note_outlined,
                    color: task.notes != null && task.notes!.isNotEmpty 
                        ? AppTheme.orangeAccent 
                        : AppTheme.white60,
                  ),
                  onPressed: () {
                    _editingTask = task;
                    _notesController.text = task.notes ?? '';
                    setState(() => _showNotesModal = true);
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.delete_outline, color: Colors.red),
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        backgroundColor: AppTheme.darkSurface,
                        title: const Text('Eliminar Tarea', style: TextStyle(color: AppTheme.white)),
                        content: const Text('¿Estás seguro de eliminar esta tarea?', style: TextStyle(color: AppTheme.white60)),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text('Cancelar'),
                          ),
                          TextButton(
                            onPressed: () {
                              setState(() {
                                _weeklyTasks.removeWhere((t) => t.id == task.id);
                              });
                              Navigator.pop(context);
                            },
                            child: const Text('Eliminar', style: TextStyle(color: Colors.red)),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ],
            ),
            if (task.notes != null && task.notes!.isNotEmpty) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurfaceVariant,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  task.notes!,
                  style: const TextStyle(fontSize: 12, color: AppTheme.white70),
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
    
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.calendar_today,
                  size: 16,
                  color: isToday ? AppTheme.orangeAccent : AppTheme.white60,
                ),
                const SizedBox(width: 8),
                Text(
                  isToday 
                      ? 'Hoy - ${date.day}/${date.month}/${date.year}'
                      : '${date.day}/${date.month}/${date.year}',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: isToday ? AppTheme.orangeAccent : AppTheme.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ...sortedTasks.map((task) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    children: [
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            final dateKey = DateTime(date.year, date.month, date.day);
                            if (_dailyTasks.containsKey(dateKey)) {
                              final index = _dailyTasks[dateKey]!.indexWhere((t) => t.id == task.id);
                              if (index != -1) {
                                _dailyTasks[dateKey]![index] = DailyTask(
                                  id: task.id,
                                  task: task.task,
                                  date: task.date,
                                  time: task.time,
                                  completed: !task.completed,
                                  notes: task.notes,
                                );
                              }
                            }
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
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: task.completed ? AppTheme.white40 : AppTheme.white,
                                decoration: task.completed ? TextDecoration.lineThrough : null,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Icon(Icons.access_time, size: 12, color: AppTheme.white60),
                                const SizedBox(width: 4),
                                Text(
                                  '${task.time.hour.toString().padLeft(2, '0')}:${task.time.minute.toString().padLeft(2, '0')}',
                                  style: const TextStyle(fontSize: 12, color: AppTheme.white60),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      if (task.notes != null && task.notes!.isNotEmpty)
                        Icon(Icons.note, size: 18, color: AppTheme.orangeAccent),
                      IconButton(
                        icon: const Icon(Icons.delete_outline, size: 18, color: Colors.red),
                        onPressed: () {
                          setState(() {
                            final dateKey = DateTime(date.year, date.month, date.day);
                            if (_dailyTasks.containsKey(dateKey)) {
                              _dailyTasks[dateKey]!.removeWhere((t) => t.id == task.id);
                              if (_dailyTasks[dateKey]!.isEmpty) {
                                _dailyTasks.remove(dateKey);
                              }
                            }
                          });
                        },
                      ),
                    ],
                  ),
                )),
          ],
        ),
      ),
    );
  }

  Widget _buildProjectCard(WorkProject project) {
    final totalGoals = project.goals.length;
    final isOverdue = project.deadline != null && project.deadline!.isBefore(DateTime.now()) && totalGoals > 0;
    final progressPercentage = totalGoals > 0 ? 50 : 0; // Simplificado
    
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
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
                      if (project.aim.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          project.aim,
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppTheme.white70,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.delete_outline, color: Colors.red),
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        backgroundColor: AppTheme.darkSurface,
                        title: const Text('Eliminar Proyecto', style: TextStyle(color: AppTheme.white)),
                        content: const Text('¿Estás seguro de eliminar este proyecto?', style: TextStyle(color: AppTheme.white60)),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text('Cancelar'),
                          ),
                          TextButton(
                            onPressed: () {
                              setState(() {
                                _projects.removeWhere((p) => p.id == project.id);
                              });
                              Navigator.pop(context);
                            },
                            child: const Text('Eliminar', style: TextStyle(color: Colors.red)),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                if (project.deadline != null) ...[
                  Icon(Icons.calendar_today, size: 14, color: isOverdue ? Colors.red : AppTheme.white60),
                  const SizedBox(width: 4),
                  Text(
                    'Vence: ${project.deadline!.day}/${project.deadline!.month}/${project.deadline!.year}',
                    style: TextStyle(
                      fontSize: 12,
                      color: isOverdue ? Colors.red : AppTheme.white60,
                    ),
                  ),
                  const SizedBox(width: 16),
                ],
                Icon(Icons.flag, size: 14, color: AppTheme.white60),
                const SizedBox(width: 4),
                Text(
                  '$totalGoals metas',
                  style: const TextStyle(fontSize: 12, color: AppTheme.white60),
                ),
              ],
            ),
            if (totalGoals > 0) ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  const Text(
                    'Progreso',
                    style: TextStyle(fontSize: 12, color: AppTheme.white60),
                  ),
                  const Spacer(),
                  Text(
                    '$progressPercentage%',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
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
                  widthFactor: progressPercentage / 100,
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppTheme.orangeAccent,
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ),
                ),
              ),
            ],
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

