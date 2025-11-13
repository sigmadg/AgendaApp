import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../models/pet/pet_care_plan.dart';
import '../../models/pet/pet.dart';
import '../../models/pet/puppy_plan.dart';
import '../../models/pet/wellness_plan.dart';
import '../../models/pet/animal_organizer.dart';
import '../../models/pet/pet_schedule.dart';
import '../../theme/app_theme.dart';
import '../../widgets/common/header.dart';
import '../../widgets/common/navigation_header.dart';
import '../../auth/providers/auth_provider.dart';

class PetSections extends StatefulWidget {
  const PetSections({super.key});

  @override
  State<PetSections> createState() => _PetSectionsState();
}

class _PetSectionsState extends State<PetSections> {
  String _activeSection = 'pet-care-planner';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  
  // Pet Care Planner
  List<PetCarePlan> _carePlans = [];
  bool _showAddPetCareModal = false;
  
  // Puppy Planner
  List<PuppyPlan> _puppyPlans = [];
  bool _showAddPuppyModal = false;
  
  // Wellness Scheduler
  List<WellnessPlan> _wellnessPlans = [];
  bool _showAddWellnessModal = false;
  
  // Animal Organizer
  List<AnimalOrganizer> _animalOrganizers = [];
  bool _showAddOrganizerModal = false;
  
  // Pet Schedule
  List<PetSchedule> _petSchedules = [];
  String _selectedPetSchedule = '1';
  String _selectedDay = 'monday';
  
  // Controllers for Pet Care Plan
  final TextEditingController _petCarePetNameController = TextEditingController();
  final TextEditingController _petCareOwnerNameController = TextEditingController();
  final TextEditingController _petCareDateController = TextEditingController();
  final TextEditingController _petCareMorningMealController = TextEditingController();
  final TextEditingController _petCareEveningMealController = TextEditingController();
  final TextEditingController _petCareTreatsController = TextEditingController();
  final TextEditingController _petCareNotesController = TextEditingController();
  
  // Controllers for Puppy Plan
  final TextEditingController _puppyNameController = TextEditingController();
  final TextEditingController _puppyBreedController = TextEditingController();
  final TextEditingController _puppyAgeController = TextEditingController();
  final TextEditingController _puppyOwnerNameController = TextEditingController();
  final TextEditingController _puppyPhoneController = TextEditingController();
  final TextEditingController _puppyAddressController = TextEditingController();
  
  // Controllers for Wellness Plan
  final TextEditingController _wellnessPetNameController = TextEditingController();
  final TextEditingController _wellnessPetOwnerController = TextEditingController();
  final TextEditingController _wellnessBirthController = TextEditingController();
  final TextEditingController _wellnessClinicController = TextEditingController();
  
  // Controllers for Animal Organizer
  final TextEditingController _organizerNameController = TextEditingController();
  final TextEditingController _organizerBreedController = TextEditingController();
  final TextEditingController _organizerBirthController = TextEditingController();
  final TextEditingController _organizerGenderController = TextEditingController();
  
  String _selectedPetCareStatus = 'pending';
  String _selectedPetCareDayRating = 'Bueno';
  String _selectedPetCareMood = 'Feliz';
  String _selectedPetCareEnergy = 'Media';
  String _selectedPetCareAppetite = 'Normal';
  String _selectedPuppySex = 'Macho';
  String _selectedPuppyTrainingLevel = 'Principiante';
  String _selectedPuppyHealthStatus = 'Excelente';
  String _selectedWellnessHealthStatus = 'Excelente';

  final sections = [
    {'id': 'pet-care-planner', 'name': 'Planificador de Cuidado', 'icon': Icons.pets},
    {'id': 'puppy-planner', 'name': 'Planificador de Cachorros', 'icon': Icons.cake},
    {'id': 'wellness-scheduler', 'name': 'Programador de Bienestar', 'icon': Icons.favorite},
    {'id': 'animal-organizer', 'name': 'Organizador de Animales', 'icon': Icons.auto_awesome},
    {'id': 'pet-schedule', 'name': 'Horario de Mascotas', 'icon': Icons.schedule},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppTheme.darkBackground,
      drawer: _buildNavigationDrawer(context),
      appBar: NavigationHeader(currentSection: 'pet'),
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
                  const Color(0xFFFF6B35).withOpacity(0.4),
                  const Color(0xFFFF6B35).withOpacity(0.2),
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
                      colors: [const Color(0xFFFF6B35), const Color(0xFFFF6B35).withOpacity(0.7)],
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
            color: const Color(0xFFC62828),
            onTap: () {
              Navigator.pop(context);
              context.go('/main?section=profile');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.work_outline,
            title: 'Trabajo',
            color: const Color(0xFF2196F3),
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
            color: const Color(0xFFFF6B35),
            isActive: true,
            onTap: () {
              Navigator.pop(context);
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
            color: Colors.blueGrey,
            onTap: () {
              Navigator.pop(context);
              context.go('/entrepreneurship');
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
            icon: Icons.spa,
            title: 'Autocuidado',
            color: Colors.purpleAccent,
            onTap: () {
              Navigator.pop(context);
              context.go('/selfcare');
            },
          ),
          const Divider(color: AppTheme.darkSurfaceVariant, height: 32),
          _buildDrawerItem(
            context,
            icon: Icons.settings_outlined,
            title: 'Configuración',
            color: AppTheme.white,
            onTap: () {
              Navigator.pop(context);
              context.go('/main?section=settings');
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
          color: isActive ? color.withOpacity(0.2) : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          border: isActive ? Border.all(color: color, width: 2) : null,
        ),
        child: Icon(
          icon,
          color: AppTheme.white,
          size: 20,
        ),
      ),
      title: Text(
        title,
        style: TextStyle(
          color: AppTheme.white,
          fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
          fontSize: 16,
        ),
      ),
      onTap: onTap,
      selected: isActive,
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
      case 'pet-care-planner':
        return _buildPetCarePlanner();
      case 'puppy-planner':
        return _buildPuppyPlanner();
      case 'wellness-scheduler':
        return _buildWellnessScheduler();
      case 'animal-organizer':
        return _buildAnimalOrganizer();
      case 'pet-schedule':
        return _buildPetSchedule();
      default:
        return _buildPetCarePlanner();
    }
  }

  Widget _buildPetCarePlanner() {
    final careStats = {
      'totalPlans': _carePlans.length,
      'completedPlans': _carePlans.where((plan) => plan.status == 'completed').length,
      'inProgressPlans': _carePlans.where((plan) => plan.status == 'in_progress').length,
      'totalPets': _carePlans.map((plan) => plan.petName).toSet().length,
      'totalActivities': _carePlans.fold<int>(0, (sum, plan) => sum + plan.activities.length),
    };
    
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [const Color(0xFFFF6B35), const Color(0xFFFF6B35).withOpacity(0.8)],
                  ),
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
                      child: const Icon(Icons.pets, color: Colors.white, size: 24),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Planificador de Cuidados',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Organiza el cuidado diario de tus mascotas',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.white.withOpacity(0.8),
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
                      child: Center(
                        child: Text(
                          '${_carePlans.length}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
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
                    child: _buildPetStatCard(
                      Icons.pets,
                      '${careStats['totalPlans']}',
                      'Planes Totales',
                      const Color(0xFFFF6B35),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildPetStatCard(
                      Icons.check_circle,
                      '${careStats['completedPlans']}',
                      'Completados',
                      Colors.green,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildPetStatCard(
                      Icons.pets,
                      '${careStats['totalPets']}',
                      'Mascotas',
                      const Color(0xFF9C27B0),
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 20),
              
              // Botón agregar
              ElevatedButton.icon(
                onPressed: () => setState(() => _showAddPetCareModal = true),
                icon: const Icon(Icons.add, size: 20),
                label: const Text('Nuevo Plan de Cuidado'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFF6B35),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Lista de planes
              if (_carePlans.isEmpty)
                _buildPetCareEmptyState()
              else
                ..._carePlans.map((plan) => _buildPetCarePlanCard(plan)),
            ],
          ),
        ),
        if (_showAddPetCareModal) _buildAddPetCareModal(),
      ],
    );
  }

  Widget _buildPuppyPlanner() {
    final puppyStats = {
      'totalPuppies': _puppyPlans.length,
      'trainingProgress': _puppyPlans.isEmpty
          ? 0
          : (_puppyPlans.fold<int>(0, (sum, plan) => sum + ((plan.training['progress'] as int?) ?? 0)) /
                  _puppyPlans.length)
              .round(),
      'vaccinated': _puppyPlans.where((plan) => (plan.health['lastVaccination'] as String?)?.isNotEmpty ?? false).length,
      'microchipped': _puppyPlans.where((plan) => plan.microchipped.contains('Sí')).length,
    };
    
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [const Color(0xFFE91E63), const Color(0xFFE91E63).withOpacity(0.8)],
                  ),
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
                      child: const Icon(Icons.favorite, color: Colors.white, size: 24),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Planificador de Cachorros',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Cuidado especializado para cachorros',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.white.withOpacity(0.8),
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
                      child: Center(
                        child: Text(
                          '${_puppyPlans.length}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
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
                    child: _buildPetStatCard(
                      Icons.favorite,
                      '${puppyStats['totalPuppies']}',
                      'Cachorros',
                      const Color(0xFFE91E63),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildPetStatCard(
                      Icons.emoji_events,
                      '${puppyStats['trainingProgress']}%',
                      'Progreso',
                      Colors.orange,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildPetStatCard(
                      Icons.verified,
                      '${puppyStats['vaccinated']}',
                      'Vacunados',
                      Colors.green,
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 20),
              
              // Botón agregar
              ElevatedButton.icon(
                onPressed: () => setState(() => _showAddPuppyModal = true),
                icon: const Icon(Icons.add, size: 20),
                label: const Text('Nuevo Plan de Cachorro'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFE91E63),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Lista de planes
              if (_puppyPlans.isEmpty)
                _buildPuppyEmptyState()
              else
                ..._puppyPlans.map((plan) => _buildPuppyPlanCard(plan)),
            ],
          ),
        ),
        if (_showAddPuppyModal) _buildAddPuppyModal(),
      ],
    );
  }
  
  Widget _buildPuppyEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        children: [
          Icon(Icons.favorite, size: 64, color: AppTheme.white),
          const SizedBox(height: 16),
          const Text(
            'No hay planes de cachorro',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Crea tu primer plan de cuidado para tu cachorro',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
  
  Widget _buildPuppyPlanCard(PuppyPlan plan) {
    final trainingProgress = (plan.training['progress'] as int?) ?? 0;
    final trainingLevel = (plan.training['level'] as String?) ?? 'Principiante';
    final commands = (plan.training['commands'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [];
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border(
          left: BorderSide(
            color: _getTrainingLevelColor(trainingLevel),
            width: 6,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: _getBreedColor(plan.breed),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Icon(
                    _getBreedIcon(plan.breed),
                    color: Colors.white,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        plan.puppyName,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${plan.breed} • ${plan.age} • ${plan.sex}',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getTrainingLevelColor(trainingLevel),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    trainingLevel,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 16),
            
            // Progreso de entrenamiento
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.school, size: 16, color: Colors.blue),
                          const SizedBox(width: 8),
                          const Text(
                            'Progreso de Entrenamiento',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        '$trainingProgress%',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: trainingProgress / 100,
                      backgroundColor: Colors.blue.withOpacity(0.2),
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                      minHeight: 8,
                    ),
                  ),
                  if (commands.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Text(
                      'Comandos aprendidos:',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: commands.map((cmd) => Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.green.withOpacity(0.3)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.check_circle, size: 14, color: Colors.green),
                            const SizedBox(width: 4),
                            Text(
                              cmd,
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppTheme.white,
                              ),
                            ),
                          ],
                        ),
                      )).toList(),
                    ),
                  ],
                ],
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Estado de salud
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.green.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.favorite, size: 16, color: Colors.green),
                          const SizedBox(width: 8),
                          const Text(
                            'Estado de Salud',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _getHealthStatusColor(plan.health['overall']?.toString() ?? 'Excelente'),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          plan.health['overall']?.toString() ?? 'Excelente',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      _buildHealthItem(Icons.scale, 'Peso:', plan.health['weight']?.toString() ?? ''),
                      _buildHealthItem(Icons.verified, 'Última vacuna:', plan.health['lastVaccination']?.toString() ?? ''),
                      _buildHealthItem(Icons.calendar_today, 'Próxima vacuna:', plan.health['nextVaccination']?.toString() ?? ''),
                      _buildHealthItem(Icons.bug_report, 'Desparasitación:', plan.health['deworming']?.toString() ?? ''),
                    ],
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Actividades diarias
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.green.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.fitness_center, size: 16, color: Colors.green),
                      const SizedBox(width: 8),
                      const Text(
                        'Actividades Diarias',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  if (plan.morningActivity.isNotEmpty)
                    _buildActivityItem(Icons.wb_sunny, 'Mañana', plan.morningActivity),
                  if (plan.afternoonActivity.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    _buildActivityItem(Icons.wb_sunny_outlined, 'Tarde', plan.afternoonActivity),
                  ],
                  if (plan.eveningActivity.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    _buildActivityItem(Icons.nightlight, 'Noche', plan.eveningActivity),
                  ],
                ],
              ),
            ),
            
            if (plan.notes != null && plan.notes!.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurfaceVariant,
                  borderRadius: BorderRadius.circular(12),
                  border: Border(
                    left: BorderSide(color: AppTheme.white, width: 4),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.note, size: 16, color: AppTheme.white),
                        const SizedBox(width: 8),
                        const Text(
                          'Notas del Entrenador',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      plan.notes!,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.white,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
            ],
            
            const SizedBox(height: 16),
            
            // Botones de acción
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.edit, size: 18),
                    label: const Text('Editar'),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: AppTheme.white),
                      foregroundColor: AppTheme.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.share, size: 18),
                    label: const Text('Compartir'),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: AppTheme.white),
                      foregroundColor: AppTheme.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildActivityItem(IconData icon, String time, String activity) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 14, color: Colors.green),
        const SizedBox(width: 8),
        SizedBox(
          width: 70,
          child: Text(
            time,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
        ),
        Expanded(
          child: Text(
            activity,
            style: const TextStyle(
              fontSize: 14,
              color: AppTheme.white,
            ),
          ),
        ),
      ],
    );
  }
  
  Color _getTrainingLevelColor(String level) {
    switch (level) {
      case 'Principiante':
        return Colors.orange;
      case 'Intermedio':
        return Colors.blue;
      case 'Avanzado':
        return Colors.green;
      default:
        return AppTheme.darkSurfaceVariant;
    }
  }
  
  Color _getHealthStatusColor(String status) {
    switch (status) {
      case 'Excelente':
        return Colors.green;
      case 'Muy bueno':
        return Colors.lightGreen;
      case 'Bueno':
        return Colors.amber;
      case 'Regular':
        return Colors.orange;
      case 'Malo':
        return Colors.red;
      default:
        return AppTheme.darkSurfaceVariant;
    }
  }
  
  IconData _getBreedIcon(String breed) {
    if (breed.contains('Labrador')) return Icons.pets;
    if (breed.contains('Border Collie')) return Icons.bolt;
    if (breed.contains('Golden')) return Icons.star;
    return Icons.favorite;
  }
  
  Color _getBreedColor(String breed) {
    if (breed.contains('Labrador')) return const Color(0xFFFF6B35);
    if (breed.contains('Border Collie')) return const Color(0xFF9C27B0);
    if (breed.contains('Golden')) return Colors.amber;
    return const Color(0xFF4CAF50);
  }
  
  Widget _buildAddPuppyModal() {
    return Container(
      color: Colors.black.withOpacity(0.7),
      child: SafeArea(
        child: Center(
          child: Container(
            margin: const EdgeInsets.all(20),
            constraints: BoxConstraints(
              maxHeight: MediaQuery.of(context).size.height * 0.85,
              maxWidth: 500,
            ),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [const Color(0xFFE91E63), const Color(0xFFE91E63).withOpacity(0.8)],
                    ),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(20),
                      topRight: Radius.circular(20),
                    ),
                  ),
                  child: Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Nuevo Plan de Cachorro',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white),
                        onPressed: () => setState(() => _showAddPuppyModal = false),
                      ),
                    ],
                  ),
                ),
                
                // Body
                Flexible(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        TextField(
                          controller: _puppyNameController,
                          decoration: InputDecoration(
                            labelText: 'Nombre del Cachorro',
                            labelStyle: TextStyle(color: AppTheme.white),
                            filled: true,
                            fillColor: AppTheme.darkSurfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _puppyBreedController,
                          decoration: InputDecoration(
                            labelText: 'Raza',
                            labelStyle: TextStyle(color: AppTheme.white),
                            filled: true,
                            fillColor: AppTheme.darkSurfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _puppyAgeController,
                          decoration: InputDecoration(
                            labelText: 'Edad',
                            labelStyle: TextStyle(color: AppTheme.white),
                            filled: true,
                            fillColor: AppTheme.darkSurfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _puppyOwnerNameController,
                          decoration: InputDecoration(
                            labelText: 'Nombre del Dueño',
                            labelStyle: TextStyle(color: AppTheme.white),
                            filled: true,
                            fillColor: AppTheme.darkSurfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _puppyPhoneController,
                          decoration: InputDecoration(
                            labelText: 'Teléfono',
                            labelStyle: TextStyle(color: AppTheme.white),
                            filled: true,
                            fillColor: AppTheme.darkSurfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _puppyAddressController,
                          decoration: InputDecoration(
                            labelText: 'Dirección',
                            labelStyle: TextStyle(color: AppTheme.white),
                            filled: true,
                            fillColor: AppTheme.darkSurfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                          maxLines: 2,
                        ),
                      ],
                    ),
                  ),
                ),
                
                // Footer
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    border: Border(
                      top: BorderSide(color: AppTheme.white.withOpacity(0.2)),
                    ),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => setState(() => _showAddPuppyModal = false),
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: AppTheme.white),
                            foregroundColor: AppTheme.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text('Cancelar'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        flex: 2,
                        child: ElevatedButton(
                          onPressed: () {
                            if (_puppyNameController.text.isNotEmpty &&
                                _puppyOwnerNameController.text.isNotEmpty) {
                              final plan = PuppyPlan(
                                id: DateTime.now().millisecondsSinceEpoch.toString(),
                                puppyName: _puppyNameController.text,
                                breed: _puppyBreedController.text.isNotEmpty
                                    ? _puppyBreedController.text
                                    : 'Sin especificar',
                                age: _puppyAgeController.text.isNotEmpty
                                    ? _puppyAgeController.text
                                    : 'Sin especificar',
                                sex: _selectedPuppySex,
                                ownerName: _puppyOwnerNameController.text,
                                phone: _puppyPhoneController.text,
                                address: _puppyAddressController.text,
                                emergencyContact: '',
                                localVet: '',
                                emergencyVet: '',
                                emergencyVetPhone: '',
                                microchipped: 'No',
                                needsMedicine: 'No',
                                morningActivity: '',
                                afternoonActivity: '',
                                eveningActivity: '',
                                behaviors: [],
                                training: {
                                  'level': _selectedPuppyTrainingLevel,
                                  'commands': [],
                                  'progress': 0,
                                  'nextGoals': [],
                                },
                                health: {
                                  'weight': '',
                                  'lastVaccination': '',
                                  'nextVaccination': '',
                                  'deworming': '',
                                  'overall': _selectedPuppyHealthStatus,
                                },
                                schedule: {},
                                notes: null,
                                reminders: [],
                                createdAt: DateTime.now(),
                              );
                              
                              setState(() {
                                _puppyPlans.add(plan);
                                _showAddPuppyModal = false;
                                _puppyNameController.clear();
                                _puppyBreedController.clear();
                                _puppyAgeController.clear();
                                _puppyOwnerNameController.clear();
                                _puppyPhoneController.clear();
                                _puppyAddressController.clear();
                              });
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFE91E63),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text('Guardar'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildWellnessScheduler() {
    final wellnessStats = {
      'totalPets': _wellnessPlans.length,
      'healthyPets': _wellnessPlans.where((plan) {
        final overall = plan.health['overall']?.toString() ?? '';
        return overall == 'Excelente' || overall == 'Muy bueno';
      }).length,
      'upcomingCheckups': _wellnessPlans.length, // Simplified
      'onMedications': _wellnessPlans.where((plan) {
        final medications = plan.health['medications'] as List<dynamic>?;
        return medications != null && medications.isNotEmpty;
      }).length,
    };
    
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.green, Colors.green.withOpacity(0.8)],
                  ),
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
                      child: const Icon(Icons.medical_services, color: Colors.white, size: 24),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Programador de Bienestar',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Seguimiento completo de la salud de tus mascotas',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.white.withOpacity(0.8),
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
                      child: Center(
                        child: Text(
                          '${_wellnessPlans.length}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
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
                    child: _buildPetStatCard(
                      Icons.pets,
                      '${wellnessStats['totalPets']}',
                      'Mascotas',
                      Colors.green,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildPetStatCard(
                      Icons.verified,
                      '${wellnessStats['healthyPets']}',
                      'Saludables',
                      Colors.green,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildPetStatCard(
                      Icons.calendar_today,
                      '${wellnessStats['upcomingCheckups']}',
                      'Próximas',
                      Colors.orange,
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 20),
              
              // Botón agregar
              ElevatedButton.icon(
                onPressed: () => setState(() => _showAddWellnessModal = true),
                icon: const Icon(Icons.add, size: 20),
                label: const Text('Nuevo Plan de Bienestar'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Lista de planes
              if (_wellnessPlans.isEmpty)
                _buildWellnessEmptyState()
              else
                ..._wellnessPlans.map((plan) => _buildWellnessPlanCard(plan)),
            ],
          ),
        ),
        if (_showAddWellnessModal) _buildAddWellnessModal(),
      ],
    );
  }
  
  Widget _buildWellnessEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        children: [
          Icon(Icons.medical_services, size: 64, color: AppTheme.white),
          const SizedBox(height: 16),
          const Text(
            'No hay planes de bienestar',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Crea tu primer plan de bienestar para tu mascota',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
  
  Widget _buildWellnessPlanCard(WellnessPlan plan) {
    final vaccinations = (plan.health['vaccinations'] as List<dynamic>?) ?? [];
    final medications = (plan.health['medications'] as List<dynamic>?) ?? [];
    final overall = plan.health['overall']?.toString() ?? 'Excelente';
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border(
          left: BorderSide(
            color: _getHealthStatusColor(overall),
            width: 6,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: _getPetTypeColor(plan.petType),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Icon(
                    _getPetTypeIcon(plan.petType),
                    color: Colors.white,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        plan.petName,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${plan.petType} • ${plan.breed} • ${plan.age}',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getHealthStatusColor(overall),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    overall,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 16),
            
            // Información básica
            Row(
              children: [
                Icon(Icons.person, size: 16, color: AppTheme.white),
                const SizedBox(width: 4),
                Text(
                  plan.petOwner,
                  style: TextStyle(
                    fontSize: 14,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(width: 16),
                Icon(Icons.scale, size: 16, color: AppTheme.white),
                const SizedBox(width: 4),
                Text(
                  plan.health['weight']?.toString() ?? '',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppTheme.white,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 16),
            
            // Estado de salud
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.green.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.medical_services, size: 16, color: Colors.green),
                      const SizedBox(width: 8),
                      const Text(
                        'Estado de Salud',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      _buildHealthItem(Icons.calendar_today, 'Última revisión:', plan.health['lastCheckup']?.toString() ?? ''),
                      _buildHealthItem(Icons.calendar_today, 'Próxima revisión:', plan.health['nextCheckup']?.toString() ?? ''),
                      _buildHealthItem(Icons.bug_report, 'Alergias:', (plan.health['allergies'] as List<dynamic>?)?.join(', ') ?? 'Ninguna'),
                      _buildHealthItem(Icons.warning, 'Condiciones:', (plan.health['conditions'] as List<dynamic>?)?.join(', ') ?? 'Ninguna'),
                    ],
                  ),
                ],
              ),
            ),
            
            if (vaccinations.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.verified, size: 16, color: Colors.blue),
                        const SizedBox(width: 8),
                        const Text(
                          'Vacunaciones',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ...vaccinations.map((vaccination) {
                      final vax = vaccination as Map<String, dynamic>;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.05),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      vax['name']?.toString() ?? '',
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.white,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'Última: ${vax['date']?.toString() ?? ''} | Próxima: ${vax['next']?.toString() ?? ''}',
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: AppTheme.white,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.green,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Text(
                                  'Vigente',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                  ],
                ),
              ),
            ],
            
            if (medications.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.medication, size: 16, color: Colors.blue),
                        const SizedBox(width: 8),
                        const Text(
                          'Medicamentos',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ...medications.map((medication) {
                      final med = medication as Map<String, dynamic>;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.05),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Text(
                                      med['name']?.toString() ?? '',
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.white,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: med['duration']?.toString() == 'Continuo' ? Colors.blue : Colors.orange,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      med['duration']?.toString() ?? '',
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                med['dosage']?.toString() ?? '',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.white,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                  ],
                ),
              ),
            ],
            
            if (plan.notes != null && plan.notes!.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurfaceVariant,
                  borderRadius: BorderRadius.circular(12),
                  border: Border(
                    left: BorderSide(color: AppTheme.white, width: 4),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.note, size: 16, color: AppTheme.white),
                        const SizedBox(width: 8),
                        const Text(
                          'Notas del Veterinario',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      plan.notes!,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.white,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
            ],
            
            const SizedBox(height: 16),
            
            // Botones de acción
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.edit, size: 18),
                    label: const Text('Editar'),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: AppTheme.white),
                      foregroundColor: AppTheme.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.share, size: 18),
                    label: const Text('Compartir'),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: AppTheme.white),
                      foregroundColor: AppTheme.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildAddWellnessModal() {
    return Container(
      color: Colors.black.withOpacity(0.7),
      child: SafeArea(
        child: Center(
          child: Container(
            margin: const EdgeInsets.all(20),
            constraints: BoxConstraints(
              maxHeight: MediaQuery.of(context).size.height * 0.85,
              maxWidth: 500,
            ),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.green, Colors.green.withOpacity(0.8)],
                    ),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(20),
                      topRight: Radius.circular(20),
                    ),
                  ),
                  child: Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Nuevo Plan de Bienestar',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white),
                        onPressed: () => setState(() => _showAddWellnessModal = false),
                      ),
                    ],
                  ),
                ),
                
                // Body
                Flexible(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        TextField(
                          controller: _wellnessPetNameController,
                          decoration: InputDecoration(
                            labelText: 'Nombre de la Mascota',
                            labelStyle: TextStyle(color: AppTheme.white),
                            filled: true,
                            fillColor: AppTheme.darkSurfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _wellnessPetOwnerController,
                          decoration: InputDecoration(
                            labelText: 'Dueño',
                            labelStyle: TextStyle(color: AppTheme.white),
                            filled: true,
                            fillColor: AppTheme.darkSurfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _wellnessBirthController,
                          decoration: InputDecoration(
                            labelText: 'Fecha de Nacimiento',
                            labelStyle: TextStyle(color: AppTheme.white),
                            filled: true,
                            fillColor: AppTheme.darkSurfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                            suffixIcon: Icon(Icons.calendar_today, color: AppTheme.white),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                          readOnly: true,
                          onTap: () async {
                            final date = await showDatePicker(
                              context: context,
                              initialDate: DateTime.now(),
                              firstDate: DateTime(2000),
                              lastDate: DateTime.now(),
                            );
                            if (date != null) {
                              _wellnessBirthController.text = DateFormat('dd MMMM yyyy', 'es').format(date);
                            }
                          },
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _wellnessClinicController,
                          decoration: InputDecoration(
                            labelText: 'Clínica',
                            labelStyle: TextStyle(color: AppTheme.white),
                            filled: true,
                            fillColor: AppTheme.darkSurfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                      ],
                    ),
                  ),
                ),
                
                // Footer
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    border: Border(
                      top: BorderSide(color: AppTheme.white.withOpacity(0.2)),
                    ),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => setState(() => _showAddWellnessModal = false),
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: AppTheme.white),
                            foregroundColor: AppTheme.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text('Cancelar'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        flex: 2,
                        child: ElevatedButton(
                          onPressed: () {
                            if (_wellnessPetNameController.text.isNotEmpty &&
                                _wellnessPetOwnerController.text.isNotEmpty) {
                              final plan = WellnessPlan(
                                id: DateTime.now().millisecondsSinceEpoch.toString(),
                                petName: _wellnessPetNameController.text,
                                petType: 'Perro',
                                breed: 'Sin especificar',
                                age: 'Sin especificar',
                                birth: _wellnessBirthController.text.isNotEmpty
                                    ? _wellnessBirthController.text
                                    : DateFormat('dd MMMM yyyy', 'es').format(DateTime.now()),
                                coat: '',
                                petOwner: _wellnessPetOwnerController.text,
                                clinic: _wellnessClinicController.text,
                                veterinarian: '',
                                personality: '',
                                markings: '',
                                favoriteThings: '',
                                medicineAllergies: '',
                                dailyRoutine: '',
                                health: {
                                  'weight': '',
                                  'lastCheckup': '',
                                  'nextCheckup': '',
                                  'vaccinations': [],
                                  'medications': [],
                                  'allergies': [],
                                  'conditions': [],
                                  'overall': _selectedWellnessHealthStatus,
                                },
                                wellness: {
                                  'exercise': '',
                                  'grooming': '',
                                  'dental': '',
                                  'nutrition': '',
                                  'mental': '',
                                },
                                schedule: {},
                                notes: null,
                                reminders: [],
                                createdAt: DateTime.now(),
                              );
                              
                              setState(() {
                                _wellnessPlans.add(plan);
                                _showAddWellnessModal = false;
                                _wellnessPetNameController.clear();
                                _wellnessPetOwnerController.clear();
                                _wellnessBirthController.clear();
                                _wellnessClinicController.clear();
                              });
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text('Guardar'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAnimalOrganizer() {
    final organizerStats = {
      'totalAnimals': _animalOrganizers.length,
      'completedTasks': _animalOrganizers.fold<int>(0, (sum, animal) => 
        sum + animal.tasks.where((task) => task['completed'] == true).length
      ),
      'totalTasks': _animalOrganizers.fold<int>(0, (sum, animal) => sum + animal.tasks.length),
    };
    
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [const Color(0xFF9C27B0), const Color(0xFF9C27B0).withOpacity(0.8)],
                  ),
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
                      child: const Icon(Icons.list, color: Colors.white, size: 24),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Organizador de Animales',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Gestión completa de tus mascotas',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.white.withOpacity(0.8),
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
                      child: Center(
                        child: Text(
                          '${_animalOrganizers.length}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
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
                    child: _buildPetStatCard(
                      Icons.pets,
                      '${organizerStats['totalAnimals']}',
                      'Animales',
                      const Color(0xFF9C27B0),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildPetStatCard(
                      Icons.check_circle,
                      '${organizerStats['completedTasks']}',
                      'Tareas',
                      Colors.green,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildPetStatCard(
                      Icons.assignment,
                      '${organizerStats['totalTasks']}',
                      'Total',
                      Colors.orange,
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 20),
              
              // Botón agregar
              ElevatedButton.icon(
                onPressed: () => setState(() => _showAddOrganizerModal = true),
                icon: const Icon(Icons.add, size: 20),
                label: const Text('Nuevo Animal'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF9C27B0),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Lista de animales
              if (_animalOrganizers.isEmpty)
                _buildAnimalOrganizerEmptyState()
              else
                ..._animalOrganizers.map((animal) => _buildAnimalOrganizerCard(animal)),
            ],
          ),
        ),
        if (_showAddOrganizerModal) _buildAddOrganizerModal(),
      ],
    );
  }
  
  Widget _buildAnimalOrganizerEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        children: [
          Icon(Icons.list, size: 64, color: AppTheme.white),
          const SizedBox(height: 16),
          const Text(
            'No hay animales registrados',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Agrega tu primer animal al organizador',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
  
  Widget _buildAnimalOrganizerCard(AnimalOrganizer animal) {
    final completedTasks = animal.tasks.where((task) => task['completed'] == true).length;
    final totalTasks = animal.tasks.length;
    final taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) : 0.0;
    final overall = animal.health['overall']?.toString() ?? 'Excelente';
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border(
          left: BorderSide(
            color: _getHealthStatusColor(overall),
            width: 6,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: _getPetTypeColor(animal.type),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Icon(
                    _getPetTypeIcon(animal.type),
                    color: Colors.white,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        animal.name,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${animal.type} • ${animal.breed} • ${animal.age}',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getHealthStatusColor(overall),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    overall,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 16),
            
            // Información básica
            Wrap(
              spacing: 16,
              runSpacing: 12,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      animal.gender == 'Macho' ? Icons.male : Icons.female,
                      size: 16,
                      color: animal.gender == 'Macho' ? Colors.blue : Colors.pink,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      animal.gender,
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.scale, size: 16, color: AppTheme.white),
                    const SizedBox(width: 4),
                    Text(
                      animal.health['weight']?.toString() ?? '',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.verified, size: 16, color: AppTheme.white),
                    const SizedBox(width: 4),
                    Text(
                      animal.microchip,
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            
            const SizedBox(height: 16),
            
            // Preferencias
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.purple.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.favorite, size: 16, color: Colors.purple),
                      const SizedBox(width: 8),
                      const Text(
                        'Preferencias',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      _buildPreferenceItem(Icons.toys, 'Juguete favorito:', animal.favoriteToy),
                      _buildPreferenceItem(Icons.card_giftcard, 'Premio favorito:', animal.favoriteTreat),
                      _buildPreferenceItem(Icons.fitness_center, 'Actividad favorita:', animal.favoriteActivity),
                      _buildPreferenceItem(Icons.restaurant, 'Comida favorita:', animal.favoriteFood),
                    ],
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Progreso de tareas
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.assignment, size: 16, color: Colors.blue),
                          const SizedBox(width: 8),
                          const Text(
                            'Tareas Diarias',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        '$completedTasks/$totalTasks',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: taskProgress,
                      backgroundColor: Colors.blue.withOpacity(0.2),
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                      minHeight: 8,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...animal.tasks.take(5).map((task) {
                    final taskName = task['name']?.toString() ?? '';
                    final completed = task['completed'] == true;
                    final priority = task['priority']?.toString() ?? 'medium';
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          Checkbox(
                            value: completed,
                            onChanged: (value) {
                              setState(() {
                                final animalIndex = _animalOrganizers.indexWhere((a) => a.id == animal.id);
                                if (animalIndex != -1) {
                                  final updatedTasks = animal.tasks.map((t) {
                                    if (t == task) {
                                      final updatedTask = Map<String, dynamic>.from(t);
                                      updatedTask['completed'] = value ?? false;
                                      return updatedTask;
                                    }
                                    return t;
                                  }).toList();
                                  
                                  _animalOrganizers[animalIndex] = AnimalOrganizer(
                                    id: animal.id,
                                    name: animal.name,
                                    type: animal.type,
                                    breed: animal.breed,
                                    age: animal.age,
                                    birth: animal.birth,
                                    adoptionDate: animal.adoptionDate,
                                    gender: animal.gender,
                                    microchip: animal.microchip,
                                    coat: animal.coat,
                                    markings: animal.markings,
                                    vetName: animal.vetName,
                                    contactNumber: animal.contactNumber,
                                    foodAllergies: animal.foodAllergies,
                                    medicalAllergies: animal.medicalAllergies,
                                    favoriteToy: animal.favoriteToy,
                                    favoriteTreat: animal.favoriteTreat,
                                    favoriteActivity: animal.favoriteActivity,
                                    favoriteFood: animal.favoriteFood,
                                    chores: animal.chores,
                                    reminders: animal.reminders,
                                    notes: animal.notes,
                                    health: animal.health,
                                    care: animal.care,
                                    tasks: updatedTasks,
                                    schedule: animal.schedule,
                                    photos: animal.photos,
                                    createdAt: animal.createdAt,
                                  );
                                }
                              });
                            },
                            activeColor: Colors.green,
                          ),
                          Expanded(
                            child: Text(
                              taskName,
                              style: TextStyle(
                                fontSize: 14,
                                color: completed ? AppTheme.white : AppTheme.white,
                                decoration: completed ? TextDecoration.lineThrough : null,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: _getTaskPriorityColor(priority).withOpacity(0.2),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: _getTaskPriorityColor(priority),
                                width: 1,
                              ),
                            ),
                            child: Text(
                              _getTaskPriorityLabel(priority),
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: _getTaskPriorityColor(priority),
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                  if (animal.tasks.length > 5)
                    TextButton(
                      onPressed: () {},
                      child: const Text(
                        'Ver todas las tareas',
                        style: TextStyle(color: Colors.blue),
                      ),
                    ),
                ],
              ),
            ),
            
            if (animal.notes != null && animal.notes!.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurfaceVariant,
                  borderRadius: BorderRadius.circular(12),
                  border: Border(
                    left: BorderSide(color: AppTheme.white, width: 4),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.note, size: 16, color: AppTheme.white),
                        const SizedBox(width: 8),
                        const Text(
                          'Notas',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      animal.notes!,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.white,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
            ],
            
            const SizedBox(height: 16),
            
            // Botones de acción
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.edit, size: 18),
                    label: const Text('Editar'),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: AppTheme.white),
                      foregroundColor: AppTheme.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.share, size: 18),
                    label: const Text('Compartir'),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: AppTheme.white),
                      foregroundColor: AppTheme.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildPreferenceItem(IconData icon, String label, String value) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: Colors.purple),
        const SizedBox(width: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: AppTheme.white,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: AppTheme.white,
          ),
        ),
      ],
    );
  }
  
  Color _getTaskPriorityColor(String priority) {
    switch (priority) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.orange;
      case 'low':
        return Colors.green;
      default:
        return AppTheme.darkSurfaceVariant;
    }
  }
  
  String _getTaskPriorityLabel(String priority) {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority;
    }
  }
  
  Widget _buildAddOrganizerModal() {
    return Container(
      color: Colors.black.withOpacity(0.7),
      child: SafeArea(
        child: Center(
          child: Container(
            margin: const EdgeInsets.all(20),
            constraints: BoxConstraints(
              maxHeight: MediaQuery.of(context).size.height * 0.85,
              maxWidth: 500,
            ),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [const Color(0xFF9C27B0), const Color(0xFF9C27B0).withOpacity(0.8)],
                    ),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(20),
                      topRight: Radius.circular(20),
                    ),
                  ),
                  child: Row(
                    children: [
                      const Expanded(
                        child: Text(
                          'Nuevo Animal',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white),
                        onPressed: () => setState(() => _showAddOrganizerModal = false),
                      ),
                    ],
                  ),
                ),
                
                // Body
                Flexible(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        TextField(
                          controller: _organizerNameController,
                          decoration: InputDecoration(
                            labelText: 'Nombre del Animal',
                            labelStyle: TextStyle(color: AppTheme.white),
                            filled: true,
                            fillColor: AppTheme.darkSurfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _organizerBreedController,
                          decoration: InputDecoration(
                            labelText: 'Raza',
                            labelStyle: TextStyle(color: AppTheme.white),
                            filled: true,
                            fillColor: AppTheme.darkSurfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _organizerBirthController,
                          decoration: InputDecoration(
                            labelText: 'Fecha de Nacimiento',
                            labelStyle: TextStyle(color: AppTheme.white),
                            filled: true,
                            fillColor: AppTheme.darkSurfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                            suffixIcon: Icon(Icons.calendar_today, color: AppTheme.white),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                          readOnly: true,
                          onTap: () async {
                            final date = await showDatePicker(
                              context: context,
                              initialDate: DateTime.now(),
                              firstDate: DateTime(2000),
                              lastDate: DateTime.now(),
                            );
                            if (date != null) {
                              _organizerBirthController.text = DateFormat('dd MMMM yyyy', 'es').format(date);
                            }
                          },
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          controller: _organizerGenderController,
                          decoration: InputDecoration(
                            labelText: 'Género',
                            labelStyle: TextStyle(color: AppTheme.white),
                            filled: true,
                            fillColor: AppTheme.darkSurfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                      ],
                    ),
                  ),
                ),
                
                // Footer
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    border: Border(
                      top: BorderSide(color: AppTheme.white.withOpacity(0.2)),
                    ),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => setState(() => _showAddOrganizerModal = false),
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: AppTheme.white),
                            foregroundColor: AppTheme.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text('Cancelar'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        flex: 2,
                        child: ElevatedButton(
                          onPressed: () {
                            if (_organizerNameController.text.isNotEmpty) {
                              final organizer = AnimalOrganizer(
                                id: DateTime.now().millisecondsSinceEpoch.toString(),
                                name: _organizerNameController.text,
                                type: 'Perro',
                                breed: _organizerBreedController.text.isNotEmpty
                                    ? _organizerBreedController.text
                                    : 'Sin especificar',
                                age: 'Sin especificar',
                                birth: _organizerBirthController.text.isNotEmpty
                                    ? _organizerBirthController.text
                                    : DateFormat('dd MMMM yyyy', 'es').format(DateTime.now()),
                                adoptionDate: DateFormat('dd MMMM yyyy', 'es').format(DateTime.now()),
                                gender: _organizerGenderController.text.isNotEmpty
                                    ? _organizerGenderController.text
                                    : 'Sin especificar',
                                microchip: 'No',
                                coat: '',
                                markings: '',
                                vetName: '',
                                contactNumber: '',
                                foodAllergies: '',
                                medicalAllergies: '',
                                favoriteToy: '',
                                favoriteTreat: '',
                                favoriteActivity: '',
                                favoriteFood: '',
                                chores: {},
                                reminders: '',
                                notes: null,
                                health: {
                                  'weight': '',
                                  'lastCheckup': '',
                                  'nextCheckup': '',
                                  'vaccinations': '',
                                  'overall': 'Excelente',
                                },
                                care: {
                                  'feeding': '',
                                  'exercise': '',
                                  'grooming': '',
                                  'training': '',
                                },
                                tasks: [],
                                schedule: {
                                  'morning': '',
                                  'afternoon': '',
                                  'evening': '',
                                },
                                createdAt: DateTime.now(),
                              );
                              
                              setState(() {
                                _animalOrganizers.add(organizer);
                                _showAddOrganizerModal = false;
                                _organizerNameController.clear();
                                _organizerBreedController.clear();
                                _organizerBirthController.clear();
                                _organizerGenderController.clear();
                              });
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF9C27B0),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text('Guardar'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPetSchedule() {
    final days = [
      {'key': 'monday', 'label': 'Lunes', 'short': 'L'},
      {'key': 'tuesday', 'label': 'Martes', 'short': 'M'},
      {'key': 'wednesday', 'label': 'Miércoles', 'short': 'X'},
      {'key': 'thursday', 'label': 'Jueves', 'short': 'J'},
      {'key': 'friday', 'label': 'Viernes', 'short': 'V'},
      {'key': 'saturday', 'label': 'Sábado', 'short': 'S'},
      {'key': 'sunday', 'label': 'Domingo', 'short': 'D'},
    ];
    
    final selectedSchedule = _petSchedules.firstWhere(
      (schedule) => schedule.id == _selectedPetSchedule,
      orElse: () => _petSchedules.isNotEmpty ? _petSchedules.first : PetSchedule(
        id: '1',
        petName: 'Sin mascota',
        petType: 'Perro',
        breed: '',
        age: '',
        avatar: '🐕',
        color: Colors.orange,
        schedule: {},
        stats: {'totalActivities': 0, 'completedActivities': 0, 'completionRate': 0, 'streak': 0},
      ),
    );
    
    final currentDayActivities = selectedSchedule.schedule[_selectedDay] ?? [];
    final dayStats = {
      'completed': currentDayActivities.where((activity) => activity.completed).length,
      'total': currentDayActivities.length,
      'percentage': currentDayActivities.isNotEmpty 
          ? ((currentDayActivities.where((activity) => activity.completed).length / currentDayActivities.length) * 100).round()
          : 0,
    };
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.blue, Colors.blue.withOpacity(0.8)],
              ),
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
                  child: const Icon(Icons.calendar_today, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Horario de Mascotas',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Organiza las actividades diarias de tus mascotas',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.white.withOpacity(0.8),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Selector de mascotas
          if (_petSchedules.isNotEmpty) ...[
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _petSchedules.map((schedule) {
                  final isSelected = schedule.id == _selectedPetSchedule;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedPetSchedule = schedule.id),
                    child: Container(
                      margin: const EdgeInsets.only(right: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isSelected ? schedule.color : AppTheme.darkSurface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: schedule.color,
                          width: isSelected ? 3 : 1,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            schedule.avatar,
                            style: const TextStyle(fontSize: 24),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            schedule.petName,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: isSelected ? Colors.white : AppTheme.white,
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
          ],
          
          // Estadísticas del día seleccionado
          if (selectedSchedule.stats.isNotEmpty) ...[
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: _buildPetStatCard(
                      Icons.assignment,
                      '${selectedSchedule.stats['totalActivities'] ?? 0}',
                      'Total',
                      Colors.blue,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildPetStatCard(
                      Icons.check_circle,
                      '${selectedSchedule.stats['completedActivities'] ?? 0}',
                      'Completadas',
                      Colors.green,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildPetStatCard(
                      Icons.trending_up,
                      '${selectedSchedule.stats['completionRate'] ?? 0}%',
                      'Progreso',
                      Colors.orange,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
          ],
          
          // Selector de días
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: days.map((day) {
                final isSelected = day['key'] == _selectedDay;
                return GestureDetector(
                  onTap: () => setState(() => _selectedDay = day['key'] as String),
                  child: Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    decoration: BoxDecoration(
                      color: isSelected ? Colors.blue : AppTheme.darkSurface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isSelected ? Colors.blue : AppTheme.white,
                        width: isSelected ? 2 : 1,
                      ),
                    ),
                    child: Text(
                      day['label'] as String,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : AppTheme.white,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Estadísticas del día
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.green.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(Icons.calendar_today, size: 16, color: Colors.green),
                    const SizedBox(width: 8),
                    Text(
                      days.firstWhere((d) => d['key'] == _selectedDay)['label'] as String,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                Text(
                  '${dayStats['completed']}/${dayStats['total']} (${dayStats['percentage']}%)',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Lista de actividades del día
          if (currentDayActivities.isEmpty)
            _buildPetScheduleEmptyState()
          else
            ...currentDayActivities.map((activity) => _buildPetScheduleActivityCard(activity)),
        ],
      ),
    );
  }
  
  Widget _buildPetScheduleEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        children: [
          Icon(Icons.calendar_today, size: 64, color: AppTheme.white),
          const SizedBox(height: 16),
          const Text(
            'No hay actividades programadas',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Agrega actividades para este día',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
  
  Widget _buildPetScheduleActivityCard(PetScheduleActivity activity) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(12),
        border: Border(
          left: BorderSide(
            color: _getActivityColor(activity.type),
            width: 4,
          ),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: _getActivityColor(activity.type).withOpacity(0.2),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Icon(
                _getActivityIcon(activity.type),
                color: _getActivityColor(activity.type),
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        activity.time,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: _getActivityColor(activity.type),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _getActivityColor(activity.type).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          _getActivityLabel(activity.type),
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: _getActivityColor(activity.type),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    activity.activity,
                    style: TextStyle(
                      fontSize: 14,
                      color: activity.completed ? AppTheme.white : AppTheme.white,
                      decoration: activity.completed ? TextDecoration.lineThrough : null,
                    ),
                  ),
                ],
              ),
            ),
            Checkbox(
              value: activity.completed,
              onChanged: (value) {
                setState(() {
                  final scheduleIndex = _petSchedules.indexWhere(
                    (s) => s.id == _selectedPetSchedule,
                  );
                  if (scheduleIndex != -1) {
                    final schedule = _petSchedules[scheduleIndex];
                    final daySchedule = List<PetScheduleActivity>.from(schedule.schedule[_selectedDay] ?? []);
                    final activityIndex = daySchedule.indexWhere((a) => 
                      a.time == activity.time && 
                      a.activity == activity.activity && 
                      a.type == activity.type
                    );
                    if (activityIndex != -1) {
                      daySchedule[activityIndex] = PetScheduleActivity(
                        time: activity.time,
                        activity: activity.activity,
                        type: activity.type,
                        completed: value ?? false,
                      );
                      final updatedSchedule = Map<String, List<PetScheduleActivity>>.from(schedule.schedule);
                      updatedSchedule[_selectedDay] = daySchedule;
                      _petSchedules[scheduleIndex] = PetSchedule(
                        id: schedule.id,
                        petName: schedule.petName,
                        petType: schedule.petType,
                        breed: schedule.breed,
                        age: schedule.age,
                        avatar: schedule.avatar,
                        color: schedule.color,
                        schedule: updatedSchedule,
                        stats: schedule.stats,
                        notes: schedule.notes,
                      );
                    }
                  }
                });
              },
              activeColor: Colors.green,
            ),
          ],
        ),
      ),
    );
  }
  
  IconData _getActivityIcon(String type) {
    switch (type) {
      case 'feeding':
        return Icons.restaurant;
      case 'exercise':
        return Icons.fitness_center;
      case 'play':
        return Icons.sports_esports;
      case 'care':
        return Icons.favorite;
      case 'grooming':
        return Icons.content_cut;
      case 'training':
        return Icons.school;
      case 'medical':
        return Icons.medical_services;
      case 'social':
        return Icons.people;
      case 'rest':
        return Icons.bedtime;
      default:
        return Icons.access_time;
    }
  }
  
  Color _getActivityColor(String type) {
    switch (type) {
      case 'feeding':
        return const Color(0xFFFF6B35);
      case 'exercise':
        return Colors.green;
      case 'play':
        return Colors.orange;
      case 'care':
        return const Color(0xFFE91E63);
      case 'grooming':
        return const Color(0xFF9C27B0);
      case 'training':
        return Colors.blue;
      case 'medical':
        return Colors.red;
      case 'social':
        return Colors.cyan;
      case 'rest':
        return Colors.brown;
      default:
        return AppTheme.darkSurfaceVariant;
    }
  }
  
  String _getActivityLabel(String type) {
    switch (type) {
      case 'feeding':
        return 'Alimentación';
      case 'exercise':
        return 'Ejercicio';
      case 'play':
        return 'Juego';
      case 'care':
        return 'Cuidado';
      case 'grooming':
        return 'Aseo';
      case 'training':
        return 'Entrenamiento';
      case 'medical':
        return 'Médico';
      case 'social':
        return 'Social';
      case 'rest':
        return 'Descanso';
      default:
        return 'General';
    }
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

  Widget _buildPetStatCard(IconData icon, String value, String label, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
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
                  style: TextStyle(
                    fontSize: 12,
                    color: AppTheme.white,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildPetCareEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        children: [
          Icon(Icons.pets, size: 64, color: AppTheme.white),
          const SizedBox(height: 16),
          const Text(
            'No hay planes de cuidado',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Crea tu primer plan de cuidado para tu mascota',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
  
  Widget _buildPetCarePlanCard(PetCarePlan plan) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border(
          left: BorderSide(
            color: _getPetCareStatusColor(plan.status),
            width: 6,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: _getPetTypeColor(plan.petType),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Icon(
                    _getPetTypeIcon(plan.petType),
                    color: Colors.white,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        plan.petName,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        plan.date,
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${plan.petType} • ${plan.breed} • ${plan.age}',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getPetCareStatusColor(plan.status),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    _getPetCareStatusLabel(plan.status),
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 16),
            
            // Información de la mascota
            Row(
              children: [
                Icon(Icons.person, size: 16, color: AppTheme.white),
                const SizedBox(width: 4),
                Text(
                  plan.ownerName,
                  style: TextStyle(
                    fontSize: 14,
                    color: AppTheme.white,
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 16),
            
            // Estado de salud
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.green.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.favorite, size: 16, color: Colors.green),
                      const SizedBox(width: 8),
                      const Text(
                        'Estado de Salud',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      _buildHealthItem(Icons.mood, 'Estado de ánimo:', plan.health['mood'] ?? ''),
                      _buildHealthItem(Icons.bolt, 'Energía:', plan.health['energy'] ?? ''),
                      _buildHealthItem(Icons.restaurant, 'Apetito:', plan.health['appetite'] ?? ''),
                      _buildHealthItem(Icons.bedtime, 'Sueño:', plan.health['sleep'] ?? ''),
                    ],
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Comidas
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.orange.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.restaurant, size: 16, color: Colors.orange),
                      const SizedBox(width: 8),
                      const Text(
                        'Comidas del Día',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  if (plan.meals['morning']?.isNotEmpty ?? false)
                    _buildMealItem(Icons.wb_sunny, 'Mañana', plan.meals['morning'] ?? ''),
                  if (plan.meals['evening']?.isNotEmpty ?? false) ...[
                    const SizedBox(height: 8),
                    _buildMealItem(Icons.nightlight, 'Noche', plan.meals['evening'] ?? ''),
                  ],
                ],
              ),
            ),
            
            if (plan.treats.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.purple.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.card_giftcard, size: 16, color: Colors.purple),
                        const SizedBox(width: 8),
                        const Text(
                          'Premios',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      plan.treats,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
              ),
            ],
            
            if (plan.activities.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.fitness_center, size: 16, color: Colors.green),
                        const SizedBox(width: 8),
                        const Text(
                          'Actividades',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ...plan.activities.map((activity) => Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          Icon(Icons.check_circle_outline, size: 16, color: Colors.green),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              activity,
                              style: const TextStyle(
                                fontSize: 14,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                    )),
                  ],
                ),
              ),
            ],
            
            if (plan.reminders.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.orange.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.alarm, size: 16, color: Colors.orange),
                        const SizedBox(width: 8),
                        const Text(
                          'Recordatorios',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    ...plan.reminders.map((reminder) => Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          Icon(Icons.calendar_today, size: 16, color: Colors.orange),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              reminder,
                              style: const TextStyle(
                                fontSize: 14,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                    )),
                  ],
                ),
              ),
            ],
            
            if (plan.notes != null && plan.notes!.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurfaceVariant,
                  borderRadius: BorderRadius.circular(12),
                  border: Border(
                    left: BorderSide(color: AppTheme.white, width: 4),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.note, size: 16, color: AppTheme.white),
                        const SizedBox(width: 8),
                        const Text(
                          'Notas del Día',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      plan.notes!,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.white,
                        height: 1.5,
                      ),
                    ),
                  ],
                ),
              ),
            ],
            
            const SizedBox(height: 16),
            
            // Botones de acción
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.edit, size: 18),
                    label: const Text('Editar'),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: AppTheme.white),
                      foregroundColor: AppTheme.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.share, size: 18),
                    label: const Text('Compartir'),
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: AppTheme.white),
                      foregroundColor: AppTheme.white,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildHealthItem(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 14, color: Colors.green),
        const SizedBox(width: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: AppTheme.white,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: AppTheme.white,
          ),
        ),
      ],
    );
  }
  
  Widget _buildMealItem(IconData icon, String time, String meal) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 14, color: Colors.orange),
        const SizedBox(width: 8),
        SizedBox(
          width: 60,
          child: Text(
            time,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
        ),
        Expanded(
          child: Text(
            meal,
            style: const TextStyle(
              fontSize: 14,
              color: AppTheme.white,
            ),
          ),
        ),
      ],
    );
  }
  
  Color _getPetCareStatusColor(String status) {
    switch (status) {
      case 'completed':
        return Colors.green;
      case 'in_progress':
        return Colors.orange;
      case 'pending':
        return Colors.blue;
      default:
        return AppTheme.darkSurfaceVariant;
    }
  }
  
  String _getPetCareStatusLabel(String status) {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in_progress':
        return 'En Progreso';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  }
  
  IconData _getPetTypeIcon(String type) {
    switch (type) {
      case 'Perro':
        return Icons.pets;
      case 'Gato':
        return Icons.favorite;
      case 'Pájaro':
        return Icons.air;
      case 'Pez':
        return Icons.water;
      default:
        return Icons.pets;
    }
  }
  
  Color _getPetTypeColor(String type) {
    switch (type) {
      case 'Perro':
        return const Color(0xFFFF6B35);
      case 'Gato':
        return const Color(0xFF9C27B0);
      case 'Pájaro':
        return Colors.green;
      case 'Pez':
        return Colors.blue;
      default:
        return AppTheme.darkSurfaceVariant;
    }
  }

  Widget _buildPetCard(Pet pet) {
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
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: AppTheme.orangeAccent.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.pets,
                size: 32,
                color: AppTheme.orangeAccent,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    pet.name,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${pet.type} • ${pet.breed}',
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    pet.gender,
                    style: const TextStyle(
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
    );
  }

  Widget _buildAddPetCareModal() {
    return Container(
      color: Colors.black.withOpacity(0.7),
      child: SafeArea(
        child: Center(
          child: Container(
            margin: const EdgeInsets.all(20),
            constraints: BoxConstraints(
              maxHeight: MediaQuery.of(context).size.height * 0.85,
              maxWidth: 500,
            ),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
              // Header
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [const Color(0xFFFF6B35), const Color(0xFFFF6B35).withOpacity(0.8)],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    topRight: Radius.circular(20),
                  ),
                ),
                child: Row(
                  children: [
                    const Expanded(
                      child: Text(
                        'Nuevo Plan de Cuidado',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: Colors.white),
                      onPressed: () => setState(() => _showAddPetCareModal = false),
                    ),
                  ],
                ),
              ),
              
              // Body
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      TextField(
                        controller: _petCarePetNameController,
                        decoration: InputDecoration(
                          labelText: 'Nombre de la Mascota',
                          labelStyle: TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _petCareOwnerNameController,
                        decoration: InputDecoration(
                          labelText: 'Nombre del Dueño',
                          labelStyle: TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _petCareDateController,
                        decoration: InputDecoration(
                          labelText: 'Fecha',
                          labelStyle: TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                          suffixIcon: Icon(Icons.calendar_today, color: AppTheme.white),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                        readOnly: true,
                        onTap: () async {
                          final date = await showDatePicker(
                            context: context,
                            initialDate: DateTime.now(),
                            firstDate: DateTime(2020),
                            lastDate: DateTime(2100),
                          );
                          if (date != null) {
                            _petCareDateController.text = DateFormat('dd MMMM yyyy', 'es').format(date);
                          }
                        },
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _petCareMorningMealController,
                        decoration: InputDecoration(
                          labelText: 'Comida de la Mañana',
                          labelStyle: TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                        maxLines: 2,
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _petCareEveningMealController,
                        decoration: InputDecoration(
                          labelText: 'Comida de la Noche',
                          labelStyle: TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                        maxLines: 2,
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _petCareTreatsController,
                        decoration: InputDecoration(
                          labelText: 'Premios',
                          labelStyle: TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _petCareNotesController,
                        decoration: InputDecoration(
                          labelText: 'Notas',
                          labelStyle: TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                        maxLines: 4,
                      ),
                    ],
                  ),
                ),
              ),
              
              // Footer
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  border: Border(
                    top: BorderSide(color: AppTheme.white.withOpacity(0.2)),
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => setState(() => _showAddPetCareModal = false),
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: AppTheme.white),
                          foregroundColor: AppTheme.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text('Cancelar'),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton(
                        onPressed: () {
                          if (_petCarePetNameController.text.isNotEmpty &&
                              _petCareOwnerNameController.text.isNotEmpty) {
                            final plan = PetCarePlan(
                              id: DateTime.now().millisecondsSinceEpoch.toString(),
                              petName: _petCarePetNameController.text,
                              petType: 'Perro',
                              breed: 'Sin especificar',
                              age: 'Sin especificar',
                              ownerName: _petCareOwnerNameController.text,
                              date: _petCareDateController.text.isNotEmpty
                                  ? _petCareDateController.text
                                  : DateFormat('dd MMMM yyyy', 'es').format(DateTime.now()),
                              status: _selectedPetCareStatus,
                              meals: {
                                'morning': _petCareMorningMealController.text,
                                'evening': _petCareEveningMealController.text,
                              },
                              treats: _petCareTreatsController.text,
                              dayRating: _selectedPetCareDayRating,
                              outdoorTime: [],
                              bedtime: [],
                              toiletAccess: [],
                              favoriteThings: [],
                              activities: [],
                              health: {
                                'mood': _selectedPetCareMood,
                                'energy': _selectedPetCareEnergy,
                                'appetite': _selectedPetCareAppetite,
                                'sleep': '8 horas',
                              },
                              notes: _petCareNotesController.text.isNotEmpty
                                  ? _petCareNotesController.text
                                  : null,
                              reminders: [],
                              createdAt: DateTime.now(),
                            );
                            
                            setState(() {
                              _carePlans.add(plan);
                              _showAddPetCareModal = false;
                              _petCarePetNameController.clear();
                              _petCareOwnerNameController.clear();
                              _petCareDateController.clear();
                              _petCareMorningMealController.clear();
                              _petCareEveningMealController.clear();
                              _petCareTreatsController.clear();
                              _petCareNotesController.clear();
                            });
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFFF6B35),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text('Guardar'),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            ),
          ),
        ),
      ),
    );
  }
  
  @override
  void dispose() {
    _petCarePetNameController.dispose();
    _petCareOwnerNameController.dispose();
    _petCareDateController.dispose();
    _petCareMorningMealController.dispose();
    _petCareEveningMealController.dispose();
    _petCareTreatsController.dispose();
    _petCareNotesController.dispose();
    _puppyNameController.dispose();
    _puppyBreedController.dispose();
    _puppyAgeController.dispose();
    _puppyOwnerNameController.dispose();
    _puppyPhoneController.dispose();
    _puppyAddressController.dispose();
    _wellnessPetNameController.dispose();
    _wellnessPetOwnerController.dispose();
    _wellnessBirthController.dispose();
    _wellnessClinicController.dispose();
    _organizerNameController.dispose();
    _organizerBreedController.dispose();
    _organizerBirthController.dispose();
    _organizerGenderController.dispose();
    super.dispose();
  }
}

