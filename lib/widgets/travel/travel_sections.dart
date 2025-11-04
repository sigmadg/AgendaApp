import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../models/travel/travel_plan.dart';
import '../../models/travel/tour_plan.dart';
import '../../models/travel/journey_plan.dart';
import '../../models/travel/vacation_plan.dart';
import '../../models/travel/trip_organizer.dart';
import '../../auth/providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/common/navigation_header.dart';

class TravelSections extends StatefulWidget {
  const TravelSections({super.key});

  @override
  State<TravelSections> createState() => _TravelSectionsState();
}

class _TravelSectionsState extends State<TravelSections> {
  String _activeSection = 'travel-planner';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  
  List<TravelPlan> _travelPlans = [];
  List<TourPlan> _tourPlans = [];
  List<JourneyPlan> _journeyPlans = [];
  List<VacationPlan> _vacationPlans = [];
  List<TripOrganizer> _tripOrganizers = [];
  
  // Modal states
  bool _showAddTravelModal = false;
  bool _showAddTourModal = false;
  bool _showAddJourneyModal = false;
  bool _showAddVacationModal = false;
  bool _showAddTripModal = false;
  
  // Travel Plan Controllers
  final TextEditingController _travelDateController = TextEditingController();
  final TextEditingController _travelDestinationController = TextEditingController();
  
  // Tour Plan Controllers
  final TextEditingController _tourDateController = TextEditingController();
  final TextEditingController _tourDayController = TextEditingController();
  final TextEditingController _tourDestinationController = TextEditingController();
  final TextEditingController _tourBreakfastController = TextEditingController();
  final TextEditingController _tourLunchController = TextEditingController();
  final TextEditingController _tourDinnerController = TextEditingController();
  final TextEditingController _tourOtherController = TextEditingController();
  final TextEditingController _tourNotesController = TextEditingController();
  
  // Journey Plan Controllers
  final TextEditingController _journeyDestinationController = TextEditingController();
  final TextEditingController _journeyDatesController = TextEditingController();
  final TextEditingController _journeyActivitiesController = TextEditingController();
  final TextEditingController _journeyTransitController = TextEditingController();
  final TextEditingController _journeyTotalController = TextEditingController();
  
  // Vacation Plan Controllers
  final TextEditingController _vacationDestinationController = TextEditingController();
  final TextEditingController _vacationStartDateController = TextEditingController();
  final TextEditingController _vacationEndDateController = TextEditingController();
  final TextEditingController _vacationBudgetController = TextEditingController();
  final TextEditingController _vacationAccommodationController = TextEditingController();
  final TextEditingController _vacationActivitiesController = TextEditingController();
  final TextEditingController _vacationHighlightsController = TextEditingController();
  final TextEditingController _vacationPackingListController = TextEditingController();
  final TextEditingController _vacationNotesController = TextEditingController();
  String _selectedVacationType = 'Playa';
  String _selectedVacationStatus = 'planning';
  final TextEditingController _vacationTemperatureController = TextEditingController();
  final TextEditingController _vacationConditionController = TextEditingController();
  final TextEditingController _vacationHumidityController = TextEditingController();
  
  // Trip Organizer Controllers
  final TextEditingController _tripNameController = TextEditingController();
  final TextEditingController _tripDestinationController = TextEditingController();
  final TextEditingController _tripStartDateController = TextEditingController();
  final TextEditingController _tripEndDateController = TextEditingController();
  final TextEditingController _tripBudgetController = TextEditingController();
  final TextEditingController _tripTravelersController = TextEditingController();
  final TextEditingController _tripAccommodationController = TextEditingController();
  final TextEditingController _tripTransportationController = TextEditingController();
  final TextEditingController _tripActivitiesController = TextEditingController();
  final TextEditingController _tripDocumentsController = TextEditingController();
  final TextEditingController _tripPackingListController = TextEditingController();
  final TextEditingController _tripEmergencyContactsController = TextEditingController();
  final TextEditingController _tripNotesController = TextEditingController();
  String _selectedTripStatus = 'planning';
  
  @override
  void dispose() {
    _travelDateController.dispose();
    _travelDestinationController.dispose();
    _tourDateController.dispose();
    _tourDayController.dispose();
    _tourDestinationController.dispose();
    _tourBreakfastController.dispose();
    _tourLunchController.dispose();
    _tourDinnerController.dispose();
    _tourOtherController.dispose();
    _tourNotesController.dispose();
    _journeyDestinationController.dispose();
    _journeyDatesController.dispose();
    _journeyActivitiesController.dispose();
    _journeyTransitController.dispose();
    _journeyTotalController.dispose();
    _vacationDestinationController.dispose();
    _vacationStartDateController.dispose();
    _vacationEndDateController.dispose();
    _vacationBudgetController.dispose();
    _vacationAccommodationController.dispose();
    _vacationActivitiesController.dispose();
    _vacationHighlightsController.dispose();
    _vacationPackingListController.dispose();
    _vacationNotesController.dispose();
    _vacationTemperatureController.dispose();
    _vacationConditionController.dispose();
    _vacationHumidityController.dispose();
    _tripNameController.dispose();
    _tripDestinationController.dispose();
    _tripStartDateController.dispose();
    _tripEndDateController.dispose();
    _tripBudgetController.dispose();
    _tripTravelersController.dispose();
    _tripAccommodationController.dispose();
    _tripTransportationController.dispose();
    _tripActivitiesController.dispose();
    _tripDocumentsController.dispose();
    _tripPackingListController.dispose();
    _tripEmergencyContactsController.dispose();
    _tripNotesController.dispose();
    super.dispose();
  }

  final sections = [
    {'id': 'travel-planner', 'name': 'Planificador de Viajes', 'icon': Icons.flight},
    {'id': 'tour-planner', 'name': 'Planificador de Tours', 'icon': Icons.map},
    {'id': 'journey-scheduler', 'name': 'Programador de Viajes', 'icon': Icons.calendar_today},
    {'id': 'vacation-scheduler', 'name': 'Programador de Vacaciones', 'icon': Icons.beach_access},
    {'id': 'trip-organizer', 'name': 'Organizador de Viajes', 'icon': Icons.luggage},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppTheme.darkBackground,
      drawer: _buildNavigationDrawer(context),
      appBar: NavigationHeader(currentSection: 'travel'),
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
            isActive: true,
            onTap: () {
              Navigator.pop(context);
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
                        ? Colors.cyan.withOpacity(0.2)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isActive 
                          ? Colors.cyan 
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
                            ? Colors.cyan 
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
                                ? Colors.cyan 
                                : AppTheme.white60,
                            fontWeight: isActive 
                                ? FontWeight.w600 
                                : FontWeight.w400,
                          ),
                          textAlign: TextAlign.center,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
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
      case 'travel-planner':
        return _buildTravelPlanner();
      case 'tour-planner':
        return _buildTourPlanner();
      case 'journey-scheduler':
        return _buildJourneyScheduler();
      case 'vacation-scheduler':
        return _buildVacationScheduler();
      case 'trip-organizer':
        return _buildTripOrganizer();
      default:
        return _buildTravelPlanner();
    }
  }

  Widget _buildTravelPlanner() {
    final travelStats = {
      'totalPlans': _travelPlans.length,
      'completedPlans': _travelPlans.where((p) => p.status == 'confirmed').length,
      'planningPlans': _travelPlans.where((p) => p.status == 'planning').length,
      'totalDays': _travelPlans.fold<int>(0, (sum, p) => sum + (int.tryParse(p.duration.split(' ').first) ?? 0)),
    };

    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.cyan.withOpacity(0.3), Colors.cyan.withOpacity(0.1)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.cyan.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(25),
                      ),
                      child: const Icon(Icons.flight, color: Colors.cyan, size: 24),
                    ),
                    const SizedBox(width: 15),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Planificador de Viajes',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                          const SizedBox(height: 5),
                          Text(
                            'Organiza tus viajes de manera inteligente',
                            style: TextStyle(
                              fontSize: 14,
                              color: AppTheme.white60,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.cyan.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Icon(Icons.add, color: Colors.cyan, size: 20),
                      ),
                      onPressed: () => setState(() {
                        _travelDateController.clear();
                        _travelDestinationController.clear();
                        _showAddTravelModal = true;
                      }),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              
              // Stats
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      Icons.flight,
                      travelStats['totalPlans']!.toString(),
                      'Planes Totales',
                      Colors.cyan,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _buildStatCard(
                      Icons.check_circle,
                      travelStats['completedPlans']!.toString(),
                      'Confirmados',
                      Colors.green,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _buildStatCard(
                      Icons.calendar_today,
                      travelStats['totalDays']!.toString(),
                      'Días Totales',
                      Colors.blue,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              
              // Plans List
              if (_travelPlans.isEmpty)
                _buildTravelEmptyState()
              else
                ..._travelPlans.map((plan) => Padding(
                      padding: const EdgeInsets.only(bottom: 20),
                      child: _buildDetailedTravelPlanCard(plan),
                    )),
            ],
          ),
        ),
        
        // Add Travel Modal
        if (_showAddTravelModal) _buildAddTravelModal(),
      ],
    );
  }
  
  Widget _buildStatCard(IconData icon, String number, String label, Color color) {
    return Container(
      padding: const EdgeInsets.all(15),
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
          const SizedBox(height: 10),
          Text(
            number,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 5),
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

  Widget _buildDetailedTravelPlanCard(TravelPlan plan) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      plan.destination,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      plan.date,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.white70,
                      ),
                    ),
                    Text(
                      plan.duration,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: _getStatusColor(plan.status),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  _getStatusLabel(plan.status),
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          
          // Progress
          LinearProgressIndicator(
            value: plan.progress / 100,
            backgroundColor: AppTheme.darkSurfaceVariant,
            valueColor: AlwaysStoppedAnimation<Color>(_getStatusColor(plan.status)),
            minHeight: 8,
            borderRadius: BorderRadius.circular(4),
          ),
          const SizedBox(height: 8),
          Text(
            '${plan.progress}% completado',
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.white60,
            ),
          ),
          const SizedBox(height: 20),
          
          // Categories
          ..._buildTravelCategories(plan),
          
          // Reminders
          if (plan.reminders.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.orange.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.orange.withOpacity(0.3), width: 1),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.alarm, size: 16, color: Colors.orange),
                      const SizedBox(width: 8),
                      const Text(
                        'Recordatorios Importantes',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: Colors.orange,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  ...plan.reminders.map((reminder) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 6,
                              height: 6,
                              margin: const EdgeInsets.only(top: 6, right: 8),
                              decoration: const BoxDecoration(
                                color: Colors.orange,
                                shape: BoxShape.circle,
                              ),
                            ),
                            Expanded(
                              child: Text(
                                reminder,
                                style: const TextStyle(
                                  fontSize: 13,
                                  color: AppTheme.white70,
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
          
          // Actions
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildActionButton(Icons.edit, 'Editar', Colors.blue, () {}),
              _buildActionButton(Icons.share, 'Compartir', Colors.green, () {}),
              _buildActionButton(Icons.download, 'Exportar', Colors.orange, () {}),
            ],
          ),
        ],
      ),
    );
  }
  
  List<Widget> _buildTravelCategories(TravelPlan plan) {
    final categories = [
      {'key': 'clothing', 'label': 'Ropa', 'items': plan.clothing, 'icon': Icons.checkroom, 'color': Colors.pink},
      {'key': 'items', 'label': 'Accesorios', 'items': plan.items, 'icon': Icons.diamond, 'color': Colors.purple},
      {'key': 'personalCare', 'label': 'Cuidado Personal', 'items': plan.personalCare, 'icon': Icons.medical_services, 'color': Colors.orange},
      {'key': 'documents', 'label': 'Documentos', 'items': plan.documents, 'icon': Icons.description, 'color': Colors.blue},
      {'key': 'essentials', 'label': 'Esenciales', 'items': plan.essentials, 'icon': Icons.check_circle, 'color': Colors.green},
      {'key': 'shoes', 'label': 'Zapatos', 'items': plan.shoes, 'icon': Icons.directions_walk, 'color': Colors.brown},
      {'key': 'devices', 'label': 'Dispositivos', 'items': plan.devices, 'icon': Icons.phone, 'color': Colors.grey},
    ];
    
    return categories.map((category) {
      if ((category['items'] as List<String>).isEmpty) return const SizedBox.shrink();
      
      return Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.darkSurfaceVariant,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: (category['color'] as Color).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Icon(
                      category['icon'] as IconData,
                      size: 16,
                      color: category['color'] as Color,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      category['label'] as String,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.darkSurface,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '${(category['items'] as List).length} artículos',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ...((category['items'] as List<String>).take(3).map((item) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        const Icon(Icons.check_circle_outline, size: 14, color: Colors.green),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            item,
                            style: const TextStyle(
                              fontSize: 14,
                              color: AppTheme.white70,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ))),
              if ((category['items'] as List<String>).length > 3)
                Padding(
                  padding: const EdgeInsets.only(left: 22),
                  child: Text(
                    '+${(category['items'] as List<String>).length - 3} más...',
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.white60,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ),
            ],
          ),
        ),
      );
    }).toList();
  }
  
  Widget _buildActionButton(IconData icon, String label, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
        decoration: BoxDecoration(
          color: AppTheme.darkSurfaceVariant,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: color),
            const SizedBox(width: 6),
            Text(
              label,
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
  
  Widget _buildTravelEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              color: AppTheme.darkSurfaceVariant,
              borderRadius: BorderRadius.circular(60),
            ),
            child: const Icon(Icons.flight, size: 64, color: AppTheme.white40),
          ),
          const SizedBox(height: 24),
          const Text(
            'No hay planes de viaje',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          Text(
            'Crea tu primer plan de viaje y comienza a organizar tu aventura',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.white60,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () => setState(() {
              _travelDateController.clear();
              _travelDestinationController.clear();
              _showAddTravelModal = true;
            }),
            icon: const Icon(Icons.add),
            label: const Text('Crear Plan de Viaje'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.cyan,
              foregroundColor: AppTheme.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAddTravelModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.darkSurface,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Nuevo Plan de Viaje',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: AppTheme.white),
                    onPressed: () => setState(() => _showAddTravelModal = false),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              TextField(
                controller: _travelDateController,
                decoration: InputDecoration(
                  labelText: 'Fecha',
                  hintText: 'DD/MM/YYYY',
                  labelStyle: const TextStyle(color: AppTheme.white60),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppTheme.darkSurfaceVariant),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppTheme.darkSurfaceVariant),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.cyan),
                  ),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _travelDestinationController,
                decoration: InputDecoration(
                  labelText: 'Destino',
                  hintText: 'Ciudad, País',
                  labelStyle: const TextStyle(color: AppTheme.white60),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppTheme.darkSurfaceVariant),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppTheme.darkSurfaceVariant),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Colors.cyan),
                  ),
                ),
                style: const TextStyle(color: AppTheme.white),
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => setState(() => _showAddTravelModal = false),
                    child: const Text('Cancelar', style: TextStyle(color: AppTheme.white60)),
                  ),
                  const SizedBox(width: 10),
                  ElevatedButton(
                    onPressed: () {
                      if (_travelDateController.text.isNotEmpty && 
                          _travelDestinationController.text.isNotEmpty) {
                        final plan = TravelPlan(
                          id: DateTime.now().millisecondsSinceEpoch.toString(),
                          destination: _travelDestinationController.text,
                          date: _travelDateController.text,
                          duration: '0 días',
                          status: 'planning',
                          progress: 0,
                          clothing: [],
                          items: [],
                          personalCare: [],
                          documents: [],
                          essentials: [],
                          shoes: [],
                          devices: [],
                          reminders: [],
                        );
                        setState(() {
                          _travelPlans.add(plan);
                          _showAddTravelModal = false;
                          _travelDateController.clear();
                          _travelDestinationController.clear();
                        });
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.cyan,
                      foregroundColor: AppTheme.white,
                    ),
                    child: const Text('Guardar'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  String _getStatusLabel(String status) {
    switch (status) {
      case 'planning': return 'Planificando';
      case 'confirmed': return 'Confirmado';
      case 'completed': return 'Completado';
      default: return 'Desconocido';
    }
  }

  Widget _buildTourPlanner() {
    final tourStats = {
      'totalTours': _tourPlans.length,
      'confirmedTours': _tourPlans.where((t) => t.status == 'confirmed').length,
      'totalHours': _tourPlans.fold<int>(0, (sum, t) => sum + (int.tryParse(t.duration.split(' ').first) ?? 0)),
    };

    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header similar a Travel Planner
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.green.withOpacity(0.3), Colors.green.withOpacity(0.1)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(25),
                      ),
                      child: const Icon(Icons.map, color: Colors.green, size: 24),
                    ),
                    const SizedBox(width: 15),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Planificador de Tours',
                            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.white),
                          ),
                          const SizedBox(height: 5),
                          Text(
                            'Organiza tus tours y actividades diarias',
                            style: TextStyle(fontSize: 14, color: AppTheme.white60),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Icon(Icons.add, color: Colors.green, size: 20),
                      ),
                      onPressed: () => setState(() {
                        _tourDateController.clear();
                        _tourDayController.clear();
                        _tourDestinationController.clear();
                        _tourBreakfastController.clear();
                        _tourLunchController.clear();
                        _tourDinnerController.clear();
                        _tourOtherController.clear();
                        _tourNotesController.clear();
                        _showAddTourModal = true;
                      }),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(child: _buildStatCard(Icons.map, tourStats['totalTours']!.toString(), 'Tours Totales', Colors.green)),
                  const SizedBox(width: 10),
                  Expanded(child: _buildStatCard(Icons.check_circle, tourStats['confirmedTours']!.toString(), 'Confirmados', Colors.green)),
                  const SizedBox(width: 10),
                  Expanded(child: _buildStatCard(Icons.access_time, tourStats['totalHours']!.toString(), 'Horas Totales', Colors.blue)),
                ],
              ),
              const SizedBox(height: 20),
              if (_tourPlans.isEmpty)
                _buildTourEmptyState()
              else
                ..._tourPlans.map((tour) => Padding(
                      padding: const EdgeInsets.only(bottom: 20),
                      child: _buildDetailedTourCard(tour),
                    )),
            ],
          ),
        ),
        if (_showAddTourModal) _buildAddTourModal(),
      ],
    );
  }
  
  Widget _buildDetailedTourCard(TourPlan tour) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(tour.destination, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white)),
                    const SizedBox(height: 4),
                    Text('${tour.date} - ${tour.day}', style: const TextStyle(fontSize: 14, color: AppTheme.white70)),
                    Text(tour.duration, style: const TextStyle(fontSize: 12, color: AppTheme.white60)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(color: _getStatusColor(tour.status), borderRadius: BorderRadius.circular(20)),
                child: Text(_getStatusLabel(tour.status), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.white)),
              ),
            ],
          ),
          if (tour.activities.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.access_time, size: 16, color: Colors.green), const SizedBox(width: 8), const Text('Cronograma del Día', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.green))]),
                  const SizedBox(height: 12),
                  ...tour.activities.map((activity) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Row(
                          children: [
                            Container(
                              width: 50,
                              child: Text(activity.time, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.green)),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(children: [
                                    Container(
                                      width: 24,
                                      height: 24,
                                      decoration: BoxDecoration(color: _getActivityColor(activity.type), borderRadius: BorderRadius.circular(12)),
                                      child: Icon(_getActivityIcon(activity.type), size: 14, color: AppTheme.white),
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(child: Text(activity.activity, style: const TextStyle(fontSize: 14, color: AppTheme.white))),
                                  ]),
                                  const SizedBox(height: 4),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                    decoration: BoxDecoration(color: _getActivityColor(activity.type), borderRadius: BorderRadius.circular(8)),
                                    child: Text(activity.type.toUpperCase(), style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.white)),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      )),
                ],
              ),
            ),
          ],
          if (tour.sites.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.blue.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.location_on, size: 16, color: Colors.blue), const SizedBox(width: 8), const Text('Sitios a Explorar', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.blue))]),
                  const SizedBox(height: 12),
                  ...tour.sites.map((site) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(children: [const Icon(Icons.check_circle_outline, size: 14, color: Colors.green), const SizedBox(width: 8), Expanded(child: Text(site, style: const TextStyle(fontSize: 14, color: AppTheme.white70)))]),
                      )),
                ],
              ),
            ),
          ],
          if (tour.breakfast.isNotEmpty || tour.lunch.isNotEmpty || tour.dinner.isNotEmpty || tour.other.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.orange.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.restaurant, size: 16, color: Colors.orange), const SizedBox(width: 8), const Text('Lugares de Comida', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.orange))]),
                  const SizedBox(height: 12),
                  if (tour.breakfast.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          const Icon(Icons.wb_sunny, size: 14, color: Colors.orange),
                          const SizedBox(width: 8),
                          const Text('Desayuno:', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.white)),
                          const SizedBox(width: 8),
                          Expanded(child: Text(tour.breakfast, style: const TextStyle(fontSize: 14, color: AppTheme.white70))),
                        ],
                      ),
                    ),
                  if (tour.lunch.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          const Icon(Icons.wb_sunny, size: 14, color: Colors.orange),
                          const SizedBox(width: 8),
                          const Text('Almuerzo:', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.white)),
                          const SizedBox(width: 8),
                          Expanded(child: Text(tour.lunch, style: const TextStyle(fontSize: 14, color: AppTheme.white70))),
                        ],
                      ),
                    ),
                  if (tour.dinner.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          const Icon(Icons.nightlight, size: 14, color: Colors.purple),
                          const SizedBox(width: 8),
                          const Text('Cena:', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.white)),
                          const SizedBox(width: 8),
                          Expanded(child: Text(tour.dinner, style: const TextStyle(fontSize: 14, color: AppTheme.white70))),
                        ],
                      ),
                    ),
                  if (tour.other.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          const Icon(Icons.local_cafe, size: 14, color: Colors.brown),
                          const SizedBox(width: 8),
                          const Text('Otro:', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppTheme.white)),
                          const SizedBox(width: 8),
                          Expanded(child: Text(tour.other, style: const TextStyle(fontSize: 14, color: AppTheme.white70))),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ],
          if (tour.notes.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.orange.withOpacity(0.1), borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.orange.withOpacity(0.3))),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.note, size: 16, color: Colors.orange), const SizedBox(width: 8), const Text('Notas Importantes', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.orange))]),
                  const SizedBox(height: 8),
                  Text(tour.notes, style: const TextStyle(fontSize: 13, color: AppTheme.white70)),
                ],
              ),
            ),
          ],
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildActionButton(Icons.edit, 'Editar', Colors.blue, () {}),
              _buildActionButton(Icons.share, 'Compartir', Colors.green, () {}),
              _buildActionButton(Icons.download, 'Exportar', Colors.orange, () {}),
            ],
          ),
        ],
      ),
    );
  }
  
  IconData _getActivityIcon(String type) {
    switch (type) {
      case 'meal': return Icons.restaurant;
      case 'sightseeing': return Icons.visibility;
      case 'walking': return Icons.directions_walk;
      case 'museum': return Icons.museum;
      case 'temple': return Icons.temple_buddhist;
      case 'market': return Icons.store;
      case 'shopping': return Icons.shopping_bag;
      default: return Icons.location_on;
    }
  }
  
  Color _getActivityColor(String type) {
    switch (type) {
      case 'meal': return Colors.red;
      case 'sightseeing': return Colors.blue;
      case 'walking': return Colors.green;
      case 'museum': return Colors.purple;
      case 'temple': return Colors.orange;
      case 'market': return Colors.brown;
      case 'shopping': return Colors.pink;
      default: return Colors.grey;
    }
  }
  
  Widget _buildTourEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(color: AppTheme.darkSurfaceVariant, borderRadius: BorderRadius.circular(60)),
            child: const Icon(Icons.map, size: 64, color: AppTheme.white40),
          ),
          const SizedBox(height: 24),
          const Text('No hay tours planificados', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white), textAlign: TextAlign.center),
          const SizedBox(height: 12),
          Text('Crea tu primer tour y comienza a explorar nuevos lugares', style: TextStyle(fontSize: 14, color: AppTheme.white60), textAlign: TextAlign.center),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () => setState(() {
              _tourDateController.clear();
              _tourDayController.clear();
              _tourDestinationController.clear();
              _tourBreakfastController.clear();
              _tourLunchController.clear();
              _tourDinnerController.clear();
              _tourOtherController.clear();
              _tourNotesController.clear();
              _showAddTourModal = true;
            }),
            icon: const Icon(Icons.add),
            label: const Text('Crear Tour'),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: AppTheme.white, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12)),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAddTourModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(20)),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Nuevo Tour', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white)),
                    IconButton(icon: const Icon(Icons.close, color: AppTheme.white), onPressed: () => setState(() => _showAddTourModal = false)),
                  ],
                ),
                const SizedBox(height: 20),
                _buildTextField(_tourDateController, 'Fecha', 'DD/MM/YYYY'),
                const SizedBox(height: 16),
                _buildTextField(_tourDayController, 'Día', 'Día 1, Día 2, etc.'),
                const SizedBox(height: 16),
                _buildTextField(_tourDestinationController, 'Destino', 'Ciudad, País'),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(onPressed: () => setState(() => _showAddTourModal = false), child: const Text('Cancelar', style: TextStyle(color: AppTheme.white60))),
                    const SizedBox(width: 10),
                    ElevatedButton(
                      onPressed: () {
                        if (_tourDateController.text.isNotEmpty && _tourDestinationController.text.isNotEmpty) {
                          final tour = TourPlan(
                            id: DateTime.now().millisecondsSinceEpoch.toString(),
                            destination: _tourDestinationController.text,
                            date: _tourDateController.text,
                            day: _tourDayController.text,
                            duration: '0 horas',
                            status: 'planning',
                            sites: [],
                            breakfast: _tourBreakfastController.text,
                            lunch: _tourLunchController.text,
                            dinner: _tourDinnerController.text,
                            other: _tourOtherController.text,
                            notes: _tourNotesController.text,
                            activities: [],
                          );
                          setState(() {
                            _tourPlans.add(tour);
                            _showAddTourModal = false;
                            _tourDateController.clear();
                            _tourDayController.clear();
                            _tourDestinationController.clear();
                            _tourBreakfastController.clear();
                            _tourLunchController.clear();
                            _tourDinnerController.clear();
                            _tourOtherController.clear();
                            _tourNotesController.clear();
                          });
                        }
                      },
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: AppTheme.white),
                      child: const Text('Guardar'),
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
  
  Widget _buildTextField(TextEditingController controller, String label, String hint) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        labelStyle: const TextStyle(color: AppTheme.white60),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.darkSurfaceVariant)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.darkSurfaceVariant)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.green)),
      ),
      style: const TextStyle(color: AppTheme.white),
    );
  }

  Widget _buildJourneyScheduler() {
    final journeyStats = {
      'totalJourneys': _journeyPlans.length,
      'confirmedJourneys': _journeyPlans.where((j) => j.status == 'confirmed').length,
      'totalBudget': _journeyPlans.fold<int>(0, (sum, j) => sum + (int.tryParse(j.budget.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0)),
    };

    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.blue.withOpacity(0.3), Colors.blue.withOpacity(0.1)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(color: Colors.blue.withOpacity(0.2), borderRadius: BorderRadius.circular(25)),
                      child: const Icon(Icons.calendar_today, color: Colors.blue, size: 24),
                    ),
                    const SizedBox(width: 15),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Programador de Viajes', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.white)),
                          const SizedBox(height: 5),
                          Text('Planifica tus viajes de larga duración', style: TextStyle(fontSize: 14, color: AppTheme.white60)),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(color: Colors.blue.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                        child: const Icon(Icons.add, color: Colors.blue, size: 20),
                      ),
                      onPressed: () => setState(() {
                        _journeyDestinationController.clear();
                        _journeyDatesController.clear();
                        _journeyActivitiesController.clear();
                        _journeyTransitController.clear();
                        _journeyTotalController.clear();
                        _showAddJourneyModal = true;
                      }),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(child: _buildStatCard(Icons.flight, journeyStats['totalJourneys']!.toString(), 'Viajes Totales', Colors.blue)),
                  const SizedBox(width: 10),
                  Expanded(child: _buildStatCard(Icons.check_circle, journeyStats['confirmedJourneys']!.toString(), 'Confirmados', Colors.green)),
                  const SizedBox(width: 10),
                  Expanded(child: _buildStatCard(Icons.attach_money, '\$${journeyStats['totalBudget']}', 'Presupuesto', Colors.orange)),
                ],
              ),
              const SizedBox(height: 20),
              if (_journeyPlans.isEmpty)
                _buildJourneyEmptyState()
              else
                ..._journeyPlans.map((journey) => Padding(
                      padding: const EdgeInsets.only(bottom: 20),
                      child: _buildDetailedJourneyCard(journey),
                    )),
            ],
          ),
        ),
        if (_showAddJourneyModal) _buildAddJourneyModal(),
      ],
    );
  }
  
  Widget _buildDetailedJourneyCard(JourneyPlan journey) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(journey.destination, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white)),
                    const SizedBox(height: 4),
                    Text(journey.travelDates, style: const TextStyle(fontSize: 14, color: AppTheme.white70)),
                    Text(journey.duration, style: const TextStyle(fontSize: 12, color: AppTheme.white60)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(color: _getStatusColor(journey.status), borderRadius: BorderRadius.circular(20)),
                child: Text(_getStatusLabel(journey.status), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.white)),
              ),
            ],
          ),
          const SizedBox(height: 16),
          LinearProgressIndicator(
            value: journey.progress / 100,
            backgroundColor: AppTheme.darkSurfaceVariant,
            valueColor: AlwaysStoppedAnimation<Color>(_getStatusColor(journey.status)),
            minHeight: 8,
            borderRadius: BorderRadius.circular(4),
          ),
          const SizedBox(height: 8),
          Text('${journey.progress}% completado', style: const TextStyle(fontSize: 12, color: AppTheme.white60)),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(child: _buildInfoItem(Icons.attach_money, 'Presupuesto:', journey.budget, Colors.orange)),
              Expanded(child: _buildInfoItem(Icons.hotel, 'Alojamiento:', journey.accommodation, Colors.purple)),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(child: _buildInfoItem(Icons.flight, 'Transporte:', journey.transit, Colors.blue)),
              Expanded(child: _buildInfoItem(Icons.star, 'Total:', journey.total, Colors.orange)),
            ],
          ),
          if (journey.activities.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.list, size: 16, color: Colors.green), const SizedBox(width: 8), const Text('Actividades Principales', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.green))]),
                  const SizedBox(height: 12),
                  ...journey.activities.map((activity) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(children: [
                          Container(width: 24, height: 24, decoration: BoxDecoration(color: Colors.green, borderRadius: BorderRadius.circular(12)), child: const Icon(Icons.check_circle, size: 14, color: AppTheme.white)),
                          const SizedBox(width: 8),
                          Expanded(child: Text(activity, style: const TextStyle(fontSize: 14, color: AppTheme.white70))),
                        ]),
                      )),
                ],
              ),
            ),
          ],
          if (journey.highlights.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.orange.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.star, size: 16, color: Colors.orange), const SizedBox(width: 8), const Text('Destinos Destacados', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.orange))]),
                  const SizedBox(height: 12),
                  ...journey.highlights.map((highlight) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(children: [const Icon(Icons.location_on, size: 14, color: Colors.orange), const SizedBox(width: 8), Expanded(child: Text(highlight, style: const TextStyle(fontSize: 14, color: AppTheme.white70)))]),
                      )),
                ],
              ),
            ),
          ],
          if (journey.itinerary.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.blue.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.calendar_today, size: 16, color: Colors.blue), const SizedBox(width: 8), const Text('Itinerario del Viaje', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.blue))]),
                  const SizedBox(height: 12),
                  ...journey.itinerary.take(5).map((day) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 50,
                              child: Text('Día ${day.day}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.blue)),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(day.city, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.white)),
                                  const SizedBox(height: 2),
                                  Text(day.activity, style: const TextStyle(fontSize: 13, color: AppTheme.white70)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      )),
                  if (journey.itinerary.length > 5)
                    Padding(
                      padding: const EdgeInsets.only(left: 62),
                      child: Text('+${journey.itinerary.length - 5} días más...', style: const TextStyle(fontSize: 12, color: AppTheme.white60, fontStyle: FontStyle.italic)),
                    ),
                ],
              ),
            ),
          ],
          if (journey.notes.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.orange.withOpacity(0.1), borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.orange.withOpacity(0.3))),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.note, size: 16, color: Colors.orange), const SizedBox(width: 8), const Text('Notas Importantes', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.orange))]),
                  const SizedBox(height: 8),
                  Text(journey.notes, style: const TextStyle(fontSize: 13, color: AppTheme.white70)),
                ],
              ),
            ),
          ],
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildActionButton(Icons.edit, 'Editar', Colors.blue, () {}),
              _buildActionButton(Icons.share, 'Compartir', Colors.green, () {}),
              _buildActionButton(Icons.download, 'Exportar', Colors.orange, () {}),
            ],
          ),
        ],
      ),
    );
  }
  
  Widget _buildInfoItem(IconData icon, String label, String value, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 5),
      child: Row(
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: 6),
          Text(label, style: const TextStyle(fontSize: 12, color: AppTheme.white60)),
          const SizedBox(width: 4),
          Expanded(child: Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.white))),
        ],
      ),
    );
  }
  
  Widget _buildJourneyEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(width: 120, height: 120, decoration: BoxDecoration(color: AppTheme.darkSurfaceVariant, borderRadius: BorderRadius.circular(60)), child: const Icon(Icons.calendar_today, size: 64, color: AppTheme.white40)),
          const SizedBox(height: 24),
          const Text('No hay viajes programados', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white), textAlign: TextAlign.center),
          const SizedBox(height: 12),
          Text('Programa tu primer viaje de larga duración y comienza tu aventura', style: TextStyle(fontSize: 14, color: AppTheme.white60), textAlign: TextAlign.center),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () => setState(() {
              _journeyDestinationController.clear();
              _journeyDatesController.clear();
              _journeyActivitiesController.clear();
              _journeyTransitController.clear();
              _journeyTotalController.clear();
              _showAddJourneyModal = true;
            }),
            icon: const Icon(Icons.add),
            label: const Text('Programar Viaje'),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.blue, foregroundColor: AppTheme.white, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12)),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAddJourneyModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(20)),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Nuevo Viaje', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white)),
                    IconButton(icon: const Icon(Icons.close, color: AppTheme.white), onPressed: () => setState(() => _showAddJourneyModal = false)),
                  ],
                ),
                const SizedBox(height: 20),
                _buildTextField(_journeyDestinationController, 'Destino', 'Ciudad, País'),
                const SizedBox(height: 16),
                _buildTextField(_journeyDatesController, 'Fechas de Viaje', 'DD/MM/YYYY - DD/MM/YYYY'),
                const SizedBox(height: 16),
                _buildTextField(_journeyActivitiesController, 'Actividades', 'Actividades principales'),
                const SizedBox(height: 16),
                _buildTextField(_journeyTransitController, 'Tránsito', 'Medio de transporte'),
                const SizedBox(height: 16),
                _buildTextField(_journeyTotalController, 'Total', 'Costo total'),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(onPressed: () => setState(() => _showAddJourneyModal = false), child: const Text('Cancelar', style: TextStyle(color: AppTheme.white60))),
                    const SizedBox(width: 10),
                    ElevatedButton(
                      onPressed: () {
                        if (_journeyDestinationController.text.isNotEmpty && _journeyDatesController.text.isNotEmpty) {
                          final journey = JourneyPlan(
                            id: DateTime.now().millisecondsSinceEpoch.toString(),
                            destination: _journeyDestinationController.text,
                            travelDates: _journeyDatesController.text,
                            duration: '0 días',
                            status: 'planning',
                            budget: _journeyTotalController.text.isNotEmpty ? _journeyTotalController.text : '\$0',
                            activities: _journeyActivitiesController.text.isNotEmpty ? _journeyActivitiesController.text.split(',').map((e) => e.trim()).toList() : [],
                            transit: _journeyTransitController.text,
                            accommodation: '',
                            total: _journeyTotalController.text,
                            progress: 0,
                            highlights: [],
                            notes: '',
                            itinerary: [],
                          );
                          setState(() {
                            _journeyPlans.add(journey);
                            _showAddJourneyModal = false;
                            _journeyDestinationController.clear();
                            _journeyDatesController.clear();
                            _journeyActivitiesController.clear();
                            _journeyTransitController.clear();
                            _journeyTotalController.clear();
                          });
                        }
                      },
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.blue, foregroundColor: AppTheme.white),
                      child: const Text('Guardar'),
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

  Widget _buildVacationScheduler() {
    final vacationStats = {
      'totalVacations': _vacationPlans.length,
      'confirmedVacations': _vacationPlans.where((v) => v.status == 'confirmed').length,
      'totalBudget': _vacationPlans.fold<int>(0, (sum, v) => sum + (int.tryParse(v.budget.replaceAll(RegExp(r'[^0-9]'), '')) ?? 0)),
    };

    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.orange.withOpacity(0.3), Colors.orange.withOpacity(0.1)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(color: Colors.orange.withOpacity(0.2), borderRadius: BorderRadius.circular(25)),
                      child: const Icon(Icons.beach_access, color: Colors.orange, size: 24),
                    ),
                    const SizedBox(width: 15),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Planificador de Vacaciones', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.white)),
                          const SizedBox(height: 5),
                          Text('Organiza tus vacaciones perfectas', style: TextStyle(fontSize: 14, color: AppTheme.white60)),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(color: Colors.orange.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                        child: const Icon(Icons.add, color: Colors.orange, size: 20),
                      ),
                      onPressed: () => setState(() {
                        _vacationDestinationController.clear();
                        _vacationStartDateController.clear();
                        _vacationEndDateController.clear();
                        _vacationBudgetController.clear();
                        _vacationAccommodationController.clear();
                        _vacationActivitiesController.clear();
                        _vacationHighlightsController.clear();
                        _vacationPackingListController.clear();
                        _vacationNotesController.clear();
                        _vacationTemperatureController.clear();
                        _vacationConditionController.clear();
                        _vacationHumidityController.clear();
                        _selectedVacationType = 'Playa';
                        _selectedVacationStatus = 'planning';
                        _showAddVacationModal = true;
                      }),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(child: _buildStatCard(Icons.beach_access, vacationStats['totalVacations']!.toString(), 'Vacaciones Totales', Colors.orange)),
                  const SizedBox(width: 10),
                  Expanded(child: _buildStatCard(Icons.check_circle, vacationStats['confirmedVacations']!.toString(), 'Confirmadas', Colors.green)),
                  const SizedBox(width: 10),
                  Expanded(child: _buildStatCard(Icons.attach_money, '\$${vacationStats['totalBudget']}', 'Presupuesto', Colors.orange)),
                ],
              ),
              const SizedBox(height: 20),
              if (_vacationPlans.isEmpty)
                _buildVacationEmptyState()
              else
                ..._vacationPlans.map((vacation) => Padding(
                      padding: const EdgeInsets.only(bottom: 20),
                      child: _buildDetailedVacationCard(vacation),
                    )),
            ],
          ),
        ),
        if (_showAddVacationModal) _buildAddVacationModal(),
      ],
    );
  }
  
  Widget _buildDetailedVacationCard(VacationPlan vacation) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(vacation.destination, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white)),
                    const SizedBox(height: 4),
                    Text('${vacation.startDate} - ${vacation.endDate}', style: const TextStyle(fontSize: 14, color: AppTheme.white70)),
                    Text(vacation.duration, style: const TextStyle(fontSize: 12, color: AppTheme.white60)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(color: _getStatusColor(vacation.status), borderRadius: BorderRadius.circular(20)),
                child: Text(_getStatusLabel(vacation.status), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.white)),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: AppTheme.darkSurfaceVariant, borderRadius: BorderRadius.circular(12)),
                  child: Row(
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(color: _getVacationTypeColor(vacation.vacationType).withOpacity(0.2), borderRadius: BorderRadius.circular(16)),
                        child: Icon(_getVacationTypeIcon(vacation.vacationType), size: 16, color: _getVacationTypeColor(vacation.vacationType)),
                      ),
                      const SizedBox(width: 12),
                      Expanded(child: Text(vacation.vacationType, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.white))),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: AppTheme.darkSurfaceVariant, borderRadius: BorderRadius.circular(12)),
                  child: Row(
                    children: [
                      Icon(_getWeatherIcon(vacation.weather.condition), size: 16, color: _getWeatherColor(vacation.weather.condition)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          '${vacation.weather.temperature} - ${vacation.weather.condition}',
                          style: const TextStyle(fontSize: 14, color: AppTheme.white70),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(child: _buildInfoItem(Icons.attach_money, 'Presupuesto:', vacation.budget, Colors.orange)),
              Expanded(child: _buildInfoItem(Icons.hotel, 'Alojamiento:', vacation.accommodation, Colors.purple)),
            ],
          ),
          if (vacation.activities.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.list, size: 16, color: Colors.green), const SizedBox(width: 8), const Text('Actividades Principales', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.green))]),
                  const SizedBox(height: 12),
                  ...vacation.activities.map((activity) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(children: [const Icon(Icons.check_circle_outline, size: 14, color: Colors.green), const SizedBox(width: 8), Expanded(child: Text(activity, style: const TextStyle(fontSize: 14, color: AppTheme.white70)))]),
                      )),
                ],
              ),
            ),
          ],
          if (vacation.highlights.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.orange.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.star, size: 16, color: Colors.orange), const SizedBox(width: 8), const Text('Destinos Destacados', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.orange))]),
                  const SizedBox(height: 12),
                  ...vacation.highlights.map((highlight) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(children: [const Icon(Icons.location_on, size: 14, color: Colors.orange), const SizedBox(width: 8), Expanded(child: Text(highlight, style: const TextStyle(fontSize: 14, color: AppTheme.white70)))]),
                      )),
                ],
              ),
            ),
          ],
          if (vacation.packingList.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.brown.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.luggage, size: 16, color: Colors.brown), const SizedBox(width: 8), const Text('Lista de Equipaje', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.brown))]),
                  const SizedBox(height: 12),
                  ...vacation.packingList.map((item) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(children: [const Icon(Icons.check_box_outline_blank, size: 14, color: Colors.brown), const SizedBox(width: 8), Expanded(child: Text(item, style: const TextStyle(fontSize: 14, color: AppTheme.white70)))]),
                      )),
                ],
              ),
            ),
          ],
          if (vacation.itinerary.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.blue.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.calendar_today, size: 16, color: Colors.blue), const SizedBox(width: 8), const Text('Itinerario de Vacaciones', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.blue))]),
                  const SizedBox(height: 12),
                  ...vacation.itinerary.map((day) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 50,
                              child: Text('Día ${day.day}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.blue)),
                            ),
                            const SizedBox(width: 12),
                            Expanded(child: Text(day.activity, style: const TextStyle(fontSize: 14, color: AppTheme.white70))),
                          ],
                        ),
                      )),
                ],
              ),
            ),
          ],
          if (vacation.notes.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.orange.withOpacity(0.1), borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.orange.withOpacity(0.3))),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.note, size: 16, color: Colors.orange), const SizedBox(width: 8), const Text('Notas Importantes', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.orange))]),
                  const SizedBox(height: 8),
                  Text(vacation.notes, style: const TextStyle(fontSize: 13, color: AppTheme.white70)),
                ],
              ),
            ),
          ],
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildActionButton(Icons.edit, 'Editar', Colors.blue, () {}),
              _buildActionButton(Icons.share, 'Compartir', Colors.green, () {}),
              _buildActionButton(Icons.download, 'Exportar', Colors.orange, () {}),
            ],
          ),
        ],
      ),
    );
  }
  
  IconData _getVacationTypeIcon(String type) {
    switch (type) {
      case 'Playa': return Icons.wb_sunny;
      case 'Aventura': return Icons.trending_up;
      case 'Cultural': return Icons.museum;
      case 'Relajación': return Icons.spa;
      default: return Icons.location_on;
    }
  }
  
  Color _getVacationTypeColor(String type) {
    switch (type) {
      case 'Playa': return Colors.orange;
      case 'Aventura': return Colors.green;
      case 'Cultural': return Colors.purple;
      case 'Relajación': return Colors.lightGreen;
      default: return Colors.grey;
    }
  }
  
  IconData _getWeatherIcon(String condition) {
    if (condition.contains('Soleado')) return Icons.wb_sunny;
    if (condition.contains('Nublado')) return Icons.cloud;
    if (condition.contains('Lluvia')) return Icons.grain;
    return Icons.wb_cloudy;
  }
  
  Color _getWeatherColor(String condition) {
    if (condition.contains('Soleado')) return Colors.orange;
    if (condition.contains('Nublado')) return Colors.grey;
    if (condition.contains('Lluvia')) return Colors.blue;
    return Colors.amber;
  }
  
  Widget _buildVacationEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(width: 120, height: 120, decoration: BoxDecoration(color: AppTheme.darkSurfaceVariant, borderRadius: BorderRadius.circular(60)), child: const Icon(Icons.beach_access, size: 64, color: AppTheme.white40)),
          const SizedBox(height: 24),
          const Text('No hay vacaciones planificadas', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white), textAlign: TextAlign.center),
          const SizedBox(height: 12),
          Text('Planifica tu próxima vacación y comienza a soñar', style: TextStyle(fontSize: 14, color: AppTheme.white60), textAlign: TextAlign.center),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () => setState(() {
              _vacationDestinationController.clear();
              _vacationStartDateController.clear();
              _vacationEndDateController.clear();
              _vacationBudgetController.clear();
              _vacationAccommodationController.clear();
              _vacationActivitiesController.clear();
              _vacationHighlightsController.clear();
              _vacationPackingListController.clear();
              _vacationNotesController.clear();
              _vacationTemperatureController.clear();
              _vacationConditionController.clear();
              _vacationHumidityController.clear();
              _selectedVacationType = 'Playa';
              _selectedVacationStatus = 'planning';
              _showAddVacationModal = true;
            }),
            icon: const Icon(Icons.add),
            label: const Text('Planificar Vacación'),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.orange, foregroundColor: AppTheme.white, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12)),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAddVacationModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(20)),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Nueva Vacación', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white)),
                    IconButton(icon: const Icon(Icons.close, color: AppTheme.white), onPressed: () => setState(() => _showAddVacationModal = false)),
                  ],
                ),
                const SizedBox(height: 20),
                _buildTextField(_vacationDestinationController, 'Destino', 'Ciudad, País'),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(child: _buildTextField(_vacationStartDateController, 'Fecha Inicio', 'DD/MM/YYYY')),
                    const SizedBox(width: 10),
                    Expanded(child: _buildTextField(_vacationEndDateController, 'Fecha Fin', 'DD/MM/YYYY')),
                  ],
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedVacationType,
                  decoration: InputDecoration(
                    labelText: 'Tipo de Vacación',
                    labelStyle: const TextStyle(color: AppTheme.white60),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.darkSurfaceVariant)),
                    enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.darkSurfaceVariant)),
                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.orange)),
                  ),
                  dropdownColor: AppTheme.darkSurface,
                  style: const TextStyle(color: AppTheme.white),
                  items: ['Playa', 'Aventura', 'Cultural', 'Relajación'].map((type) => DropdownMenuItem(value: type, child: Text(type))).toList(),
                  onChanged: (value) => setState(() => _selectedVacationType = value ?? 'Playa'),
                ),
                const SizedBox(height: 16),
                _buildTextField(_vacationBudgetController, 'Presupuesto', '\$0'),
                const SizedBox(height: 16),
                _buildTextField(_vacationAccommodationController, 'Alojamiento', 'Hotel, Resort, etc.'),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(onPressed: () => setState(() => _showAddVacationModal = false), child: const Text('Cancelar', style: TextStyle(color: AppTheme.white60))),
                    const SizedBox(width: 10),
                    ElevatedButton(
                      onPressed: () {
                        if (_vacationDestinationController.text.isNotEmpty && _vacationStartDateController.text.isNotEmpty && _vacationEndDateController.text.isNotEmpty) {
                          final startDate = DateTime.tryParse(_vacationStartDateController.text);
                          final endDate = DateTime.tryParse(_vacationEndDateController.text);
                          final duration = startDate != null && endDate != null ? endDate.difference(startDate).inDays : 0;
                          
                          final vacation = VacationPlan(
                            id: DateTime.now().millisecondsSinceEpoch.toString(),
                            destination: _vacationDestinationController.text,
                            vacationType: _selectedVacationType,
                            startDate: _vacationStartDateController.text,
                            endDate: _vacationEndDateController.text,
                            duration: '$duration días',
                            status: _selectedVacationStatus,
                            budget: _vacationBudgetController.text.isNotEmpty ? _vacationBudgetController.text : '\$0',
                            accommodation: _vacationAccommodationController.text,
                            activities: _vacationActivitiesController.text.isNotEmpty ? _vacationActivitiesController.text.split(',').map((e) => e.trim()).toList() : [],
                            highlights: _vacationHighlightsController.text.isNotEmpty ? _vacationHighlightsController.text.split(',').map((e) => e.trim()).toList() : [],
                            weather: VacationWeather(
                              temperature: _vacationTemperatureController.text.isNotEmpty ? _vacationTemperatureController.text : '0°C',
                              condition: _vacationConditionController.text.isNotEmpty ? _vacationConditionController.text : 'Desconocido',
                              humidity: _vacationHumidityController.text.isNotEmpty ? _vacationHumidityController.text : '0%',
                            ),
                            packingList: _vacationPackingListController.text.isNotEmpty ? _vacationPackingListController.text.split(',').map((e) => e.trim()).toList() : [],
                            notes: _vacationNotesController.text,
                            itinerary: [],
                          );
                          setState(() {
                            _vacationPlans.add(vacation);
                            _showAddVacationModal = false;
                            _vacationDestinationController.clear();
                            _vacationStartDateController.clear();
                            _vacationEndDateController.clear();
                            _vacationBudgetController.clear();
                            _vacationAccommodationController.clear();
                            _vacationActivitiesController.clear();
                            _vacationHighlightsController.clear();
                            _vacationPackingListController.clear();
                            _vacationNotesController.clear();
                            _vacationTemperatureController.clear();
                            _vacationConditionController.clear();
                            _vacationHumidityController.clear();
                          });
                        }
                      },
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.orange, foregroundColor: AppTheme.white),
                      child: const Text('Guardar'),
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

  Widget _buildTripOrganizer() {
    final tripStats = {
      'totalTrips': _tripOrganizers.length,
      'confirmedTrips': _tripOrganizers.where((t) => t.status == 'confirmed').length,
      'totalTravelers': _tripOrganizers.fold<int>(0, (sum, t) => sum + t.travelers),
    };

    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.green.withOpacity(0.3), Colors.green.withOpacity(0.1)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(color: Colors.green.withOpacity(0.2), borderRadius: BorderRadius.circular(25)),
                      child: const Icon(Icons.luggage, color: Colors.green, size: 24),
                    ),
                    const SizedBox(width: 15),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Organizador de Viajes', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppTheme.white)),
                          const SizedBox(height: 5),
                          Text('Planifica y organiza tus viajes perfectos', style: TextStyle(fontSize: 14, color: AppTheme.white60)),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(color: Colors.green.withOpacity(0.2), borderRadius: BorderRadius.circular(20)),
                        child: const Icon(Icons.add, color: Colors.green, size: 20),
                      ),
                      onPressed: () => setState(() {
                        _tripNameController.clear();
                        _tripDestinationController.clear();
                        _tripStartDateController.clear();
                        _tripEndDateController.clear();
                        _tripBudgetController.clear();
                        _tripTravelersController.text = '1';
                        _tripAccommodationController.clear();
                        _tripTransportationController.clear();
                        _tripActivitiesController.clear();
                        _tripDocumentsController.clear();
                        _tripPackingListController.clear();
                        _tripEmergencyContactsController.clear();
                        _tripNotesController.clear();
                        _selectedTripStatus = 'planning';
                        _showAddTripModal = true;
                      }),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(child: _buildStatCard(Icons.luggage, tripStats['totalTrips']!.toString(), 'Viajes Totales', Colors.green)),
                  const SizedBox(width: 10),
                  Expanded(child: _buildStatCard(Icons.check_circle, tripStats['confirmedTrips']!.toString(), 'Confirmados', Colors.green)),
                  const SizedBox(width: 10),
                  Expanded(child: _buildStatCard(Icons.people, tripStats['totalTravelers']!.toString(), 'Viajeros', Colors.orange)),
                ],
              ),
              const SizedBox(height: 20),
              if (_tripOrganizers.isEmpty)
                _buildTripEmptyState()
              else
                ..._tripOrganizers.map((trip) => Padding(
                      padding: const EdgeInsets.only(bottom: 20),
                      child: _buildDetailedTripCard(trip),
                    )),
            ],
          ),
        ),
        if (_showAddTripModal) _buildAddTripModal(),
      ],
    );
  }
  
  Widget _buildDetailedTripCard(TripOrganizer trip) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(trip.tripName, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white)),
                    const SizedBox(height: 4),
                    Text(trip.destination, style: const TextStyle(fontSize: 16, color: Colors.green, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 2),
                    Text('${trip.startDate} - ${trip.endDate}', style: const TextStyle(fontSize: 14, color: AppTheme.white70)),
                    Text(trip.duration, style: const TextStyle(fontSize: 12, color: AppTheme.white60)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(color: _getStatusColor(trip.status), borderRadius: BorderRadius.circular(20)),
                child: Text(_getStatusLabel(trip.status), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.white)),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: AppTheme.darkSurfaceVariant, borderRadius: BorderRadius.circular(12)),
            child: Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(color: _getDestinationColor(trip.destination).withOpacity(0.2), borderRadius: BorderRadius.circular(16)),
                  child: Icon(_getDestinationIcon(trip.destination), size: 16, color: _getDestinationColor(trip.destination)),
                ),
                const SizedBox(width: 12),
                Expanded(child: Text(trip.destination, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.white))),
                const SizedBox(width: 12),
                Row(
                  children: [
                    const Icon(Icons.people, size: 16, color: Colors.orange),
                    const SizedBox(width: 4),
                    Text('${trip.travelers} viajero${trip.travelers > 1 ? 's' : ''}', style: const TextStyle(fontSize: 14, color: AppTheme.white70)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(child: _buildInfoItem(Icons.attach_money, 'Presupuesto:', trip.budget, Colors.orange)),
              Expanded(child: _buildInfoItem(Icons.hotel, 'Alojamiento:', trip.accommodation, Colors.purple)),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 5),
                  child: Row(
                    children: [
                      Icon(_getTransportationIcon(trip.transportation), size: 16, color: _getTransportationColor(trip.transportation)),
                      const SizedBox(width: 6),
                      Text('Transporte:', style: const TextStyle(fontSize: 12, color: AppTheme.white60)),
                      const SizedBox(width: 4),
                      Expanded(child: Text(trip.transportation, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.white))),
                    ],
                  ),
                ),
              ),
            ],
          ),
          if (trip.activities.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.list, size: 16, color: Colors.green), const SizedBox(width: 8), const Text('Actividades Principales', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.green))]),
                  const SizedBox(height: 12),
                  ...trip.activities.map((activity) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(children: [const Icon(Icons.check_circle_outline, size: 14, color: Colors.green), const SizedBox(width: 8), Expanded(child: Text(activity, style: const TextStyle(fontSize: 14, color: AppTheme.white70)))]),
                      )),
                ],
              ),
            ),
          ],
          if (trip.documents.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.blue.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.description, size: 16, color: Colors.blue), const SizedBox(width: 8), const Text('Documentos Necesarios', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.blue))]),
                  const SizedBox(height: 12),
                  ...trip.documents.map((document) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(children: [const Icon(Icons.description, size: 14, color: Colors.blue), const SizedBox(width: 8), Expanded(child: Text(document, style: const TextStyle(fontSize: 14, color: AppTheme.white70)))]),
                      )),
                ],
              ),
            ),
          ],
          if (trip.packingList.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.brown.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.luggage, size: 16, color: Colors.brown), const SizedBox(width: 8), const Text('Lista de Equipaje', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.brown))]),
                  const SizedBox(height: 12),
                  ...trip.packingList.map((item) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(children: [const Icon(Icons.check_box_outline_blank, size: 14, color: Colors.brown), const SizedBox(width: 8), Expanded(child: Text(item, style: const TextStyle(fontSize: 14, color: AppTheme.white70)))]),
                      )),
                ],
              ),
            ),
          ],
          if (trip.emergencyContacts.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.red.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.call, size: 16, color: Colors.red), const SizedBox(width: 8), const Text('Contactos de Emergencia', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.red))]),
                  const SizedBox(height: 12),
                  ...trip.emergencyContacts.map((contact) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(children: [const Icon(Icons.call_outlined, size: 14, color: Colors.red), const SizedBox(width: 8), Expanded(child: Text(contact, style: const TextStyle(fontSize: 14, color: AppTheme.white70)))]),
                      )),
                ],
              ),
            ),
          ],
          if (trip.itinerary.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.blue.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.calendar_today, size: 16, color: Colors.blue), const SizedBox(width: 8), const Text('Itinerario del Viaje', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.blue))]),
                  const SizedBox(height: 12),
                  ...trip.itinerary.map((day) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 60,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Día ${day.day}', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.blue)),
                                  const SizedBox(height: 2),
                                  Text(day.city, style: const TextStyle(fontSize: 10, color: AppTheme.white60)),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(child: Text(day.activity, style: const TextStyle(fontSize: 14, color: AppTheme.white70))),
                          ],
                        ),
                      )),
                ],
              ),
            ),
          ],
          if (trip.notes.isNotEmpty) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.orange.withOpacity(0.1), borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.orange.withOpacity(0.3))),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [const Icon(Icons.note, size: 16, color: Colors.orange), const SizedBox(width: 8), const Text('Notas Importantes', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.orange))]),
                  const SizedBox(height: 8),
                  Text(trip.notes, style: const TextStyle(fontSize: 13, color: AppTheme.white70)),
                ],
              ),
            ),
          ],
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildActionButton(Icons.edit, 'Editar', Colors.blue, () {}),
              _buildActionButton(Icons.share, 'Compartir', Colors.green, () {}),
              _buildActionButton(Icons.download, 'Exportar', Colors.orange, () {}),
            ],
          ),
        ],
      ),
    );
  }
  
  IconData _getDestinationIcon(String destination) {
    if (destination.contains('París') || destination.contains('Francia')) return Icons.flag;
    if (destination.contains('Tokio') || destination.contains('Japón')) return Icons.flag;
    if (destination.contains('Nueva York') || destination.contains('USA')) return Icons.flag;
    return Icons.location_on;
  }
  
  Color _getDestinationColor(String destination) {
    if (destination.contains('París') || destination.contains('Francia')) return Colors.blue;
    if (destination.contains('Tokio') || destination.contains('Japón')) return Colors.pink;
    if (destination.contains('Nueva York') || destination.contains('USA')) return Colors.green;
    return Colors.grey;
  }
  
  IconData _getTransportationIcon(String transport) {
    if (transport.contains('Avión')) return Icons.flight;
    if (transport.contains('Tren')) return Icons.train;
    if (transport.contains('Auto')) return Icons.directions_car;
    if (transport.contains('Metro')) return Icons.subway;
    return Icons.directions_bus;
  }
  
  Color _getTransportationColor(String transport) {
    if (transport.contains('Avión')) return Colors.orange;
    if (transport.contains('Tren')) return Colors.blue;
    if (transport.contains('Auto')) return Colors.green;
    if (transport.contains('Metro')) return Colors.purple;
    return Colors.grey;
  }
  
  Widget _buildTripEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(width: 120, height: 120, decoration: BoxDecoration(color: AppTheme.darkSurfaceVariant, borderRadius: BorderRadius.circular(60)), child: const Icon(Icons.luggage, size: 64, color: AppTheme.white40)),
          const SizedBox(height: 24),
          const Text('No hay viajes organizados', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white), textAlign: TextAlign.center),
          const SizedBox(height: 12),
          Text('Organiza tu próximo viaje y comienza a explorar', style: TextStyle(fontSize: 14, color: AppTheme.white60), textAlign: TextAlign.center),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () => setState(() {
              _tripNameController.clear();
              _tripDestinationController.clear();
              _tripStartDateController.clear();
              _tripEndDateController.clear();
              _tripBudgetController.clear();
              _tripTravelersController.text = '1';
              _tripAccommodationController.clear();
              _tripTransportationController.clear();
              _tripActivitiesController.clear();
              _tripDocumentsController.clear();
              _tripPackingListController.clear();
              _tripEmergencyContactsController.clear();
              _tripNotesController.clear();
              _selectedTripStatus = 'planning';
              _showAddTripModal = true;
            }),
            icon: const Icon(Icons.add),
            label: const Text('Organizar Viaje'),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: AppTheme.white, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12)),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAddTripModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(color: AppTheme.darkSurface, borderRadius: BorderRadius.circular(20)),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Nuevo Viaje Organizado', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.white)),
                    IconButton(icon: const Icon(Icons.close, color: AppTheme.white), onPressed: () => setState(() => _showAddTripModal = false)),
                  ],
                ),
                const SizedBox(height: 20),
                _buildTextField(_tripNameController, 'Nombre del Viaje', 'Ej: Viaje a Europa'),
                const SizedBox(height: 16),
                _buildTextField(_tripDestinationController, 'Destino', 'Ciudad, País'),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(child: _buildTextField(_tripStartDateController, 'Fecha Inicio', 'DD/MM/YYYY')),
                    const SizedBox(width: 10),
                    Expanded(child: _buildTextField(_tripEndDateController, 'Fecha Fin', 'DD/MM/YYYY')),
                  ],
                ),
                const SizedBox(height: 16),
                _buildTextField(_tripBudgetController, 'Presupuesto', '\$0'),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _tripTravelersController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Viajeros',
                          hintText: '1',
                          labelStyle: const TextStyle(color: AppTheme.white60),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.darkSurfaceVariant)),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.darkSurfaceVariant)),
                          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Colors.green)),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(child: _buildTextField(_tripAccommodationController, 'Alojamiento', 'Hotel, etc.')),
                  ],
                ),
                const SizedBox(height: 16),
                _buildTextField(_tripTransportationController, 'Transporte', 'Avión, Tren, etc.'),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(onPressed: () => setState(() => _showAddTripModal = false), child: const Text('Cancelar', style: TextStyle(color: AppTheme.white60))),
                    const SizedBox(width: 10),
                    ElevatedButton(
                      onPressed: () {
                        if (_tripNameController.text.isNotEmpty && _tripDestinationController.text.isNotEmpty && _tripStartDateController.text.isNotEmpty && _tripEndDateController.text.isNotEmpty) {
                          final startDate = DateTime.tryParse(_tripStartDateController.text);
                          final endDate = DateTime.tryParse(_tripEndDateController.text);
                          final duration = startDate != null && endDate != null ? endDate.difference(startDate).inDays : 0;
                          
                          final trip = TripOrganizer(
                            id: DateTime.now().millisecondsSinceEpoch.toString(),
                            tripName: _tripNameController.text,
                            destination: _tripDestinationController.text,
                            startDate: _tripStartDateController.text,
                            endDate: _tripEndDateController.text,
                            duration: '$duration días',
                            status: _selectedTripStatus,
                            budget: _tripBudgetController.text.isNotEmpty ? _tripBudgetController.text : '\$0',
                            travelers: int.tryParse(_tripTravelersController.text) ?? 1,
                            accommodation: _tripAccommodationController.text,
                            transportation: _tripTransportationController.text,
                            activities: _tripActivitiesController.text.isNotEmpty ? _tripActivitiesController.text.split(',').map((e) => e.trim()).toList() : [],
                            documents: _tripDocumentsController.text.isNotEmpty ? _tripDocumentsController.text.split(',').map((e) => e.trim()).toList() : [],
                            packingList: _tripPackingListController.text.isNotEmpty ? _tripPackingListController.text.split(',').map((e) => e.trim()).toList() : [],
                            emergencyContacts: _tripEmergencyContactsController.text.isNotEmpty ? _tripEmergencyContactsController.text.split(',').map((e) => e.trim()).toList() : [],
                            notes: _tripNotesController.text,
                            itinerary: [],
                          );
                          setState(() {
                            _tripOrganizers.add(trip);
                            _showAddTripModal = false;
                            _tripNameController.clear();
                            _tripDestinationController.clear();
                            _tripStartDateController.clear();
                            _tripEndDateController.clear();
                            _tripBudgetController.clear();
                            _tripTravelersController.text = '1';
                            _tripAccommodationController.clear();
                            _tripTransportationController.clear();
                            _tripActivitiesController.clear();
                            _tripDocumentsController.clear();
                            _tripPackingListController.clear();
                            _tripEmergencyContactsController.clear();
                            _tripNotesController.clear();
                          });
                        }
                      },
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: AppTheme.white),
                      child: const Text('Guardar'),
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

  Widget _buildTravelPlanCard(TravelPlan plan) {
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
                    plan.destination,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getStatusColor(plan.status),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    plan.status.toUpperCase(),
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
            Text(
              '${plan.date} • ${plan.duration}',
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.white70,
              ),
            ),
            const SizedBox(height: 12),
            LinearProgressIndicator(
              value: plan.progress / 100,
              backgroundColor: AppTheme.darkSurfaceVariant,
              valueColor: AlwaysStoppedAnimation<Color>(_getStatusColor(plan.status)),
              minHeight: 8,
              borderRadius: BorderRadius.circular(4),
            ),
            const SizedBox(height: 8),
            Text(
              '${plan.progress}% completado',
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

  Widget _buildTourPlanCard(TourPlan tour) {
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
                    tour.destination,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getStatusColor(tour.status),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    tour.status.toUpperCase(),
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
            Text(
              '${tour.date} • ${tour.day} • ${tour.duration}',
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.white70,
              ),
            ),
            if (tour.sites.isNotEmpty) ...[
              const SizedBox(height: 12),
              Text(
                '${tour.sites.length} sitios a explorar',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppTheme.white60,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildJourneyPlanCard(JourneyPlan journey) {
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
                    journey.destination,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getStatusColor(journey.status),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    journey.status.toUpperCase(),
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
            Text(
              '${journey.travelDates} • ${journey.duration}',
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.white70,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.attach_money, size: 16, color: AppTheme.white60),
                const SizedBox(width: 4),
                Text(
                  journey.budget,
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white70,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            LinearProgressIndicator(
              value: journey.progress / 100,
              backgroundColor: AppTheme.darkSurfaceVariant,
              valueColor: AlwaysStoppedAnimation<Color>(_getStatusColor(journey.status)),
              minHeight: 8,
              borderRadius: BorderRadius.circular(4),
            ),
            const SizedBox(height: 8),
            Text(
              '${journey.progress}% completado',
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

  Color _getStatusColor(String status) {
    switch (status) {
      case 'planning':
        return Colors.orange;
      case 'confirmed':
        return Colors.green;
      case 'completed':
        return Colors.blue;
      default:
        return AppTheme.orangeAccent;
    }
  }
}

