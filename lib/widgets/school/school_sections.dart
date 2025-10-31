import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../models/school/class_schedule.dart';
import '../../models/school/academic_task.dart';
import '../../models/school/group_project.dart';
import '../../models/school/exam_revision.dart';
import '../../auth/providers/auth_provider.dart';
import '../../theme/app_theme.dart';

class SchoolSections extends StatefulWidget {
  const SchoolSections({super.key});

  @override
  State<SchoolSections> createState() => _SchoolSectionsState();
}

class _SchoolSectionsState extends State<SchoolSections> {
  String _activeSection = 'timetable';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  
  List<ClassSchedule> _classes = [];
  List<AcademicTask> _academicTasks = [];
  List<GroupProject> _groupProjects = [];
  List<ExamRevision> _examRevisions = [];

  final sections = [
    {'id': 'timetable', 'name': 'Horario Semanal', 'icon': Icons.calendar_today},
    {'id': 'todo', 'name': 'Listas de Tareas', 'icon': Icons.list_alt},
    {'id': 'projects', 'name': 'Proyectos Grupales', 'icon': Icons.people},
    {'id': 'exams', 'name': 'Revisión de Exámenes', 'icon': Icons.school},
    {'id': 'materials', 'name': 'Materiales del Curso', 'icon': Icons.folder},
    {'id': 'class', 'name': 'Resumen de Clase', 'icon': Icons.description},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppTheme.darkBackground,
      drawer: _buildNavigationDrawer(context),
      appBar: AppBar(
        backgroundColor: AppTheme.darkBackground,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.menu, color: AppTheme.white),
          onPressed: () => _scaffoldKey.currentState?.openDrawer(),
        ),
        title: Row(
          children: [
            Text(
              'Cortex',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppTheme.orangeAccent,
              ),
            ),
          ],
        ),
      ),
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
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: isActive ? AppTheme.orangeAccent : AppTheme.darkSurface,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        section['icon'] as IconData,
                        color: isActive ? AppTheme.white : AppTheme.white60,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        section['name'] as String,
                        style: TextStyle(
                          color: isActive ? AppTheme.white : AppTheme.white60,
                          fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
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

  Widget _buildTimetable() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'HORARIO SEMANAL',
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
          child: _classes.isEmpty
              ? _buildEmptyState('No hay clases programadas', Icons.calendar_today)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _classes.length,
                  itemBuilder: (context, index) => _buildClassCard(_classes[index]),
                ),
        ),
      ],
    );
  }

  Widget _buildTodoLists() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'TAREAS ACADÉMICAS',
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
          child: _academicTasks.isEmpty
              ? _buildEmptyState('No hay tareas académicas', Icons.list_alt)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _academicTasks.length,
                  itemBuilder: (context, index) => _buildTaskCard(_academicTasks[index]),
                ),
        ),
      ],
    );
  }

  Widget _buildGroupProjects() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'PROYECTOS GRUPALES',
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
          child: _groupProjects.isEmpty
              ? _buildEmptyState('No hay proyectos grupales', Icons.people)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _groupProjects.length,
                  itemBuilder: (context, index) => _buildProjectCard(_groupProjects[index]),
                ),
        ),
      ],
    );
  }

  Widget _buildExamRevision() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'REVISIÓN DE EXÁMENES',
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
          child: _examRevisions.isEmpty
              ? _buildEmptyState('No hay exámenes programados', Icons.school)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _examRevisions.length,
                  itemBuilder: (context, index) => _buildExamCard(_examRevisions[index]),
                ),
        ),
      ],
    );
  }

  Widget _buildCourseMaterials() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.folder, size: 64, color: AppTheme.white40),
          const SizedBox(height: 16),
          const Text(
            'Materiales del Curso',
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

  Widget _buildClassOverview() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.description, size: 64, color: AppTheme.white40),
          const SizedBox(height: 16),
          const Text(
            'Resumen de Clase',
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

  Widget _buildClassCard(ClassSchedule classItem) {
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
                    classItem.subject,
                    style: const TextStyle(
                      fontSize: 18,
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
                const Icon(Icons.access_time, size: 16, color: AppTheme.white60),
                const SizedBox(width: 4),
                Text(
                  '${classItem.day} - ${classItem.time}',
                  style: const TextStyle(fontSize: 14, color: AppTheme.white70),
                ),
                if (classItem.classroom != null) ...[
                  const SizedBox(width: 16),
                  const Icon(Icons.location_on, size: 16, color: AppTheme.white60),
                  const SizedBox(width: 4),
                  Text(
                    classItem.classroom!,
                    style: const TextStyle(fontSize: 14, color: AppTheme.white70),
                  ),
                ],
              ],
            ),
            if (classItem.professor != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.person, size: 16, color: AppTheme.white60),
                  const SizedBox(width: 4),
                  Text(
                    classItem.professor!,
                    style: const TextStyle(fontSize: 14, color: AppTheme.white70),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildTaskCard(AcademicTask task) {
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
                  if (task.subject != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      task.subject!,
                      style: const TextStyle(fontSize: 12, color: AppTheme.white60),
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

  Widget _buildProjectCard(GroupProject project) {
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
              project.title,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppTheme.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              project.objective,
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.white70,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              '${project.actionSteps.where((s) => s.completed).length} de ${project.actionSteps.length} pasos completados',
              style: const TextStyle(
                fontSize: 12,
                color: AppTheme.white60,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExamCard(ExamRevision exam) {
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
              exam.topic,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppTheme.white,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16, color: AppTheme.white60),
                const SizedBox(width: 4),
                Text(
                  exam.date.toString().split(' ')[0],
                  style: const TextStyle(fontSize: 14, color: AppTheme.white70),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              '${exam.todos.where((t) => t.completed).length} de ${exam.todos.length} tareas completadas',
              style: const TextStyle(
                fontSize: 12,
                color: AppTheme.white60,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

