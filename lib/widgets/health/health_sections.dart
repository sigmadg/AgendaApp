import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../models/health/body_measurement.dart';
import '../../models/health/recipe.dart';
import '../../models/exercise/gym_routine.dart';
import '../../models/exercise/sports_goal.dart';
import '../../auth/providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../common/navigation_header.dart';

class HealthSections extends StatefulWidget {
  const HealthSections({super.key});

  @override
  State<HealthSections> createState() => _HealthSectionsState();
}

class _HealthSectionsState extends State<HealthSections> {
  String _activeSection = 'meal-planner';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  
  // Estados para Meal Planner
  Map<String, Map<String, dynamic>> _mealPlans = {}; // {date: {breakfast, lunch, dinner, waterGlasses}}
  DateTime _selectedMealDate = DateTime.now();
  
  // Estados para lista de compras
  Map<String, List<Map<String, dynamic>>> _marketList = {
    'fruits': [],
    'vegetables': [],
    'dairy': [],
    'meat': [],
    'grains': [],
    'snacks': [],
  };
  String _selectedCategory = '';
  String _newItemText = '';
  int _newItemQuantity = 1;
  String _newItemUnit = 'unidad';
  
  // Estados para recetas
  List<Recipe> _recipes = [];
  
  // Estados para rutinas de gimnasio
  List<GymRoutine> _gymRoutines = [];
  
  // Estados para objetivos deportivos
  List<SportsGoal> _sportsGoals = [];
  
  // Estados para Fitness Tracker
  Map<String, Map<String, dynamic>> _fitnessData = {};
  DateTime _selectedFitnessDate = DateTime.now();
  Map<String, dynamic> _dailyFitness = {
    'caloriesIn': '',
    'caloriesOut': '',
    'water': '',
    'steps': '',
    'sleep': '',
    'mood': 'neutral',
  };
  
  // Estados para Body Measurements
  Map<String, Map<String, dynamic>> _bodyMeasurements = {};
  DateTime _selectedMeasurementDate = DateTime.now();
  Map<String, dynamic> _newMeasurements = {
    'weight': '',
    'neck': '',
    'bicep': '',
    'bust': '',
    'chest': '',
    'waist': '',
    'hips': '',
    'thigh': '',
    'calf': '',
    'notes': '',
  };
  
  // Estados para Workout Tracker
  List<Map<String, dynamic>> _workouts = [];
  
  // Estados para Weight Loss
  Map<String, dynamic> _weightLossData = {};
  List<Map<String, dynamic>> _weightLossGoals = [];
  Map<String, dynamic> _newWeightGoal = {
    'startWeight': '',
    'targetWeight': '',
    'targetDate': DateTime.now(),
    'currentWeight': '',
    'notes': '',
  };
  
  // Estados para Nutrition Tracker
  Map<String, Map<String, dynamic>> _nutritionData = {};
  DateTime _selectedNutritionDate = DateTime.now();
  Map<String, dynamic> _dailyNutrition = {
    'breakfast': {'calories': '', 'protein': '', 'carbs': '', 'fat': ''},
    'lunch': {'calories': '', 'protein': '', 'carbs': '', 'fat': ''},
    'dinner': {'calories': '', 'protein': '', 'carbs': '', 'fat': ''},
    'snacks': {'calories': '', 'protein': '', 'carbs': '', 'fat': ''},
    'water': '',
    'supplements': [],
  };
  
  // Estados para Water Tracker
  int _waterGlasses = 0;
  
  // Modales
  bool _showAddMealModal = false;
  bool _showAddRecipeModal = false;
  bool _showAddItemModal = false;
  bool _showAddGymModal = false;
  bool _showAddSportsModal = false;
  bool _showAddWorkoutModal = false;
  bool _showAddWeightGoalModal = false;

  final sections = [
    {'id': 'meal-planner', 'name': 'Planificador de Comidas', 'icon': Icons.restaurant},
    {'id': 'market-list', 'name': 'Lista de Compras', 'icon': Icons.shopping_cart},
    {'id': 'recipes', 'name': 'Recetas', 'icon': Icons.menu_book},
    {'id': 'gym-routine', 'name': 'Rutina de Gimnasio', 'icon': Icons.fitness_center},
    {'id': 'sports-goals', 'name': 'Objetivos Deportivos', 'icon': Icons.emoji_events},
    {'id': 'fitness-tracker', 'name': 'Seguidor de Fitness', 'icon': Icons.track_changes},
    {'id': 'body-measurements', 'name': 'Mediciones Corporales', 'icon': Icons.straighten},
    {'id': 'workout-tracker', 'name': 'Seguidor de Entrenamientos', 'icon': Icons.directions_run},
    {'id': 'weight-loss', 'name': 'Pérdida de Peso', 'icon': Icons.monitor_weight},
    {'id': 'nutrition-tracker', 'name': 'Seguidor de Nutrición', 'icon': Icons.local_dining},
    {'id': 'water-tracker', 'name': 'Rastreador de Agua', 'icon': Icons.water_drop},
  ];

  final mealCategories = [
    {'id': 'fruits', 'name': 'Frutas', 'icon': '🍎'},
    {'id': 'vegetables', 'name': 'Verduras', 'icon': '🥬'},
    {'id': 'dairy', 'name': 'Lácteos', 'icon': '🥛'},
    {'id': 'meat', 'name': 'Carnes', 'icon': '🥩'},
    {'id': 'grains', 'name': 'Granos', 'icon': '🌾'},
    {'id': 'snacks', 'name': 'Snacks', 'icon': '🍿'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppTheme.darkBackground,
      drawer: _buildNavigationDrawer(context),
      appBar: NavigationHeader(currentSection: 'health'),
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
            isActive: true,
            onTap: () {
              Navigator.pop(context);
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
      case 'meal-planner':
        return _buildMealPlanner();
      case 'market-list':
        return _buildMarketList();
      case 'recipes':
        return _buildRecipes();
      case 'gym-routine':
        return _buildGymRoutine();
      case 'sports-goals':
        return _buildSportsGoals();
      case 'fitness-tracker':
        return _buildFitnessTracker();
      case 'body-measurements':
        return _buildBodyMeasurements();
      case 'workout-tracker':
        return _buildWorkoutTracker();
      case 'weight-loss':
        return _buildWeightLoss();
      case 'nutrition-tracker':
        return _buildNutritionTracker();
      case 'water-tracker':
        return _buildWaterTracker();
      default:
        return _buildMealPlanner();
    }
  }

  Widget _buildMealPlanner() {
    final today = DateFormat('yyyy-MM-dd').format(DateTime.now());
    final todayMealPlan = _mealPlans[today] ?? {};
    final plannedMeals = [
      todayMealPlan['breakfast'],
      todayMealPlan['lunch'],
      todayMealPlan['dinner']
    ].where((meal) => meal != null && meal.toString().isNotEmpty).length;
    final waterGlasses = todayMealPlan['waterGlasses'] ?? 0;
    
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
                  Colors.green.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.green.withOpacity(0.3),
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
                    Icons.restaurant,
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
                        'Planificador de Comidas',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Organiza tu alimentación saludable',
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
                  child: const Icon(Icons.calendar_today, size: 16, color: Colors.green),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Resumen nutricional mejorado
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.restaurant,
                  title: 'Comidas Planificadas',
                  value: '$plannedMeals/3',
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.water_drop,
                  title: 'Vasos de Agua',
                  value: '$waterGlasses/8',
                  color: Colors.blue,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.local_fire_department,
                  title: 'Calorías',
                  value: '1,850',
                  color: Colors.orange,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.eco,
                  title: 'Nutrición',
                  value: '85%',
                  color: Colors.green,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Botón para agregar comida
          Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 16),
            child: ElevatedButton.icon(
              onPressed: () {
                setState(() {
                  _showAddMealModal = true;
                });
              },
              icon: const Icon(Icons.add_circle_outline, size: 20),
              label: const Text('Planificar Comida'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          
          // Plan de comidas del día mejorado
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.green.withOpacity(0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.calendar_today, color: Colors.green, size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'Plan de Hoy',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const Spacer(),
                    Text(
                      DateFormat('EEEE, d \'de\' MMMM', 'es').format(DateTime.now()),
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                
                // Desayuno
                _buildMealCard(
                  'Desayuno',
                  Icons.wb_sunny,
                  '7:00 - 9:00 AM',
                  todayMealPlan['breakfast']?.toString() ?? '',
                  Colors.orange,
                  onAdd: () {
                    setState(() {
                      _showAddMealModal = true;
                    });
                  },
                  onEdit: () {
                    setState(() {
                      _showAddMealModal = true;
                    });
                  },
                  onDelete: () {
                    setState(() {
                      final dateKey = DateFormat('yyyy-MM-dd').format(DateTime.now());
                      if (_mealPlans.containsKey(dateKey)) {
                        _mealPlans[dateKey]?.remove('breakfast');
                        if (_mealPlans[dateKey]!.isEmpty) {
                          _mealPlans.remove(dateKey);
                        }
                      }
                    });
                  },
                ),
                const SizedBox(height: 12),
                
                // Comida
                _buildMealCard(
                  'Comida',
                  Icons.wb_sunny,
                  '12:00 - 2:00 PM',
                  todayMealPlan['lunch']?.toString() ?? '',
                  Colors.orange,
                  onAdd: () {
                    setState(() {
                      _showAddMealModal = true;
                    });
                  },
                  onEdit: () {
                    setState(() {
                      _showAddMealModal = true;
                    });
                  },
                  onDelete: () {
                    setState(() {
                      final dateKey = DateFormat('yyyy-MM-dd').format(DateTime.now());
                      if (_mealPlans.containsKey(dateKey)) {
                        _mealPlans[dateKey]?.remove('lunch');
                        if (_mealPlans[dateKey]!.isEmpty) {
                          _mealPlans.remove(dateKey);
                        }
                      }
                    });
                  },
                ),
                const SizedBox(height: 12),
                
                // Cena
                _buildMealCard(
                  'Cena',
                  Icons.nightlight_round,
                  '7:00 - 9:00 PM',
                  todayMealPlan['dinner']?.toString() ?? '',
                  Colors.purple,
                  onAdd: () {
                    setState(() {
                      _showAddMealModal = true;
                    });
                  },
                  onEdit: () {
                    setState(() {
                      _showAddMealModal = true;
                    });
                  },
                  onDelete: () {
                    setState(() {
                      final dateKey = DateFormat('yyyy-MM-dd').format(DateTime.now());
                      if (_mealPlans.containsKey(dateKey)) {
                        _mealPlans[dateKey]?.remove('dinner');
                        if (_mealPlans[dateKey]!.isEmpty) {
                          _mealPlans.remove(dateKey);
                        }
                      }
                    });
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Seguimiento de hidratación mejorado
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.blue.withOpacity(0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.water_drop, color: Colors.blue, size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'Seguimiento de Hidratación',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Text(
                  'Meta: 8 vasos de agua al día',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppTheme.white60,
                  ),
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: List.generate(8, (index) {
                    final isFilled = index < waterGlasses;
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          final dateKey = DateFormat('yyyy-MM-dd').format(DateTime.now());
                          if (!_mealPlans.containsKey(dateKey)) {
                            _mealPlans[dateKey] = {};
                          }
                          final newGlasses = index + 1 == waterGlasses ? 0 : index + 1;
                          _mealPlans[dateKey]!['waterGlasses'] = newGlasses;
                          _waterGlasses = newGlasses;
                        });
                      },
                      child: Container(
                        width: (MediaQuery.of(context).size.width - 88) / 4,
                        height: 60,
                        decoration: BoxDecoration(
                          color: isFilled
                              ? Colors.blue.withOpacity(0.2)
                              : AppTheme.darkBackground,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isFilled
                                ? Colors.blue
                                : AppTheme.darkSurfaceVariant,
                            width: 2,
                          ),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.water_drop,
                              size: 20,
                              color: isFilled ? Colors.blue : AppTheme.white60,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${index + 1}',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: isFilled ? Colors.blue : AppTheme.white60,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
                ),
                const SizedBox(height: 16),
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(
                    value: waterGlasses / 8,
                    minHeight: 8,
                    backgroundColor: AppTheme.darkSurfaceVariant,
                    valueColor: const AlwaysStoppedAnimation<Color>(Colors.blue),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '$waterGlasses de 8 vasos completados',
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppTheme.white60,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Accesos rápidos mejorados
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
                        icon: Icons.menu_book,
                        title: 'Recetas',
                        color: Colors.green,
                        onTap: () {
                          setState(() {
                            _activeSection = 'recipes';
                          });
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildQuickAccessCard(
                        icon: Icons.shopping_cart,
                        title: 'Lista de Compras',
                        color: Colors.green,
                        onTap: () {
                          setState(() {
                            _activeSection = 'market-list';
                          });
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _buildQuickAccessCard(
                        icon: Icons.analytics,
                        title: 'Nutrición',
                        color: Colors.orange,
                        onTap: () {
                          setState(() {
                            _activeSection = 'nutrition-tracker';
                          });
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildQuickAccessCard(
                        icon: Icons.calendar_today,
                        title: 'Plan Semanal',
                        color: Colors.purple,
                        onTap: () {
                          // TODO: Implementar plan semanal
                        },
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

  Widget _buildMealCard(
    String title,
    IconData icon,
    String time,
    String content,
    Color color, {
    required VoidCallback onAdd,
    required VoidCallback onEdit,
    required VoidCallback onDelete,
  }) {
    final hasContent = content.isNotEmpty;
    
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.darkBackground,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: hasContent ? color.withOpacity(0.3) : AppTheme.darkSurfaceVariant,
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
                  color: color.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(icon, size: 20, color: color),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      time,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
              ),
              if (!hasContent)
                IconButton(
                  icon: const Icon(Icons.add, color: Colors.green, size: 18),
                  onPressed: onAdd,
                ),
            ],
          ),
          if (hasContent) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      content,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.white70,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.edit, color: Colors.green, size: 16),
                    onPressed: onEdit,
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete, color: Colors.red, size: 16),
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
                          backgroundColor: AppTheme.darkSurface,
                          title: const Text(
                            'Eliminar comida',
                            style: TextStyle(color: AppTheme.white),
                          ),
                          content: Text(
                            '¿Estás seguro de que quieres eliminar esta comida?',
                            style: const TextStyle(color: AppTheme.white70),
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text('Cancelar'),
                            ),
                            TextButton(
                              onPressed: () {
                                Navigator.pop(context);
                                onDelete();
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
            ),
          ] else ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.darkBackground,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                children: [
                  const Icon(Icons.restaurant, size: 24, color: AppTheme.white40),
                  const SizedBox(height: 8),
                  const Text(
                    'No planificado',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppTheme.white60,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ElevatedButton.icon(
                    onPressed: onAdd,
                    icon: const Icon(Icons.add_circle_outline, size: 16),
                    label: const Text('Agregar'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      minimumSize: Size.zero,
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
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppTheme.white,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMarketList() {
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
                  Colors.green.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
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
                    Icons.shopping_cart,
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
                        'Lista de Compras',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Organiza tus compras saludables',
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
          
          // Lista de categorías
          ...mealCategories.map((category) {
            final categoryId = category['id'] as String;
            final items = _marketList[categoryId] ?? [];
            
            return Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.green.withOpacity(0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header de categoría
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Text(
                            category['icon'] as String,
                            style: const TextStyle(fontSize: 24),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            category['name'] as String,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                        ],
                      ),
                      ElevatedButton.icon(
                        onPressed: () {
                          setState(() {
                            _selectedCategory = categoryId;
                            _showAddItemModal = true;
                          });
                        },
                        icon: const Icon(Icons.add, size: 16),
                        label: const Text('Agregar'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.green,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          minimumSize: Size.zero,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  
                  // Items de la categoría
                  if (items.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        children: [
                          const Icon(Icons.shopping_basket_outlined, size: 32, color: AppTheme.white40),
                          const SizedBox(height: 8),
                          const Text(
                            'No hay artículos en esta categoría',
                            style: TextStyle(
                              fontSize: 14,
                              color: AppTheme.white60,
                            ),
                          ),
                        ],
                      ),
                    )
                  else
                    ...items.map((item) {
                      final isPurchased = item['purchased'] == true;
                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: isPurchased
                              ? Colors.green.withOpacity(0.1)
                              : AppTheme.darkBackground,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isPurchased
                                ? Colors.green.withOpacity(0.3)
                                : AppTheme.darkSurfaceVariant,
                          ),
                        ),
                        child: Row(
                          children: [
                            GestureDetector(
                              onTap: () {
                                setState(() {
                                  final itemIndex = items.indexOf(item);
                                  items[itemIndex]['purchased'] = !isPurchased;
                                });
                              },
                              child: Container(
                                width: 24,
                                height: 24,
                                decoration: BoxDecoration(
                                  color: isPurchased
                                      ? Colors.green
                                      : Colors.transparent,
                                  borderRadius: BorderRadius.circular(4),
                                  border: Border.all(
                                    color: isPurchased
                                        ? Colors.green
                                        : AppTheme.white60,
                                    width: 2,
                                  ),
                                ),
                                child: isPurchased
                                    ? const Icon(
                                        Icons.check,
                                        size: 16,
                                        color: AppTheme.white,
                                      )
                                    : null,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    item['name'] ?? '',
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: isPurchased
                                          ? AppTheme.white60
                                          : AppTheme.white,
                                      decoration: isPurchased
                                          ? TextDecoration.lineThrough
                                          : null,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    item['quantity'] ?? '',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: isPurchased
                                          ? AppTheme.white40
                                          : AppTheme.white60,
                                      decoration: isPurchased
                                          ? TextDecoration.lineThrough
                                          : null,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.close, size: 18, color: Colors.red),
                              onPressed: () {
                                setState(() {
                                  items.remove(item);
                                });
                              },
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                ],
              ),
            );
          }).toList(),
        ],
      ),
    );
  }

  Widget _buildRecipes() {
    // Datos de ejemplo para mostrar el UI
    final sampleRecipes = _recipes.isEmpty ? [
      Recipe(
        id: '1',
        name: 'Ensalada César Saludable',
        category: 'Ensaladas',
        difficulty: 'Fácil',
        prepTime: '15 min',
        servings: 4,
        calories: 320,
        rating: 4.5,
        ingredients: 'Lechuga romana, pechuga de pollo, queso parmesano, crutones integrales',
        instructions: 'Corta la lechuga, cocina el pollo, mezcla todos los ingredientes y sirve con el aderezo.',
        tags: const ['proteína', 'vegetales', 'bajo en calorías'],
      ),
      Recipe(
        id: '2',
        name: 'Salmón a la Plancha con Vegetales',
        category: 'Pescados',
        difficulty: 'Intermedio',
        prepTime: '25 min',
        servings: 2,
        calories: 450,
        rating: 4.8,
        ingredients: 'Filete de salmón, brócoli, zanahorias, aceite de oliva, limón',
        instructions: 'Marina el salmón, cocina a la plancha con vegetales al vapor, sirve con limón.',
        tags: const ['omega-3', 'proteína', 'vegetales'],
      ),
      Recipe(
        id: '3',
        name: 'Bowl de Quinoa y Aguacate',
        category: 'Bowls',
        difficulty: 'Fácil',
        prepTime: '20 min',
        servings: 2,
        calories: 380,
        rating: 4.3,
        ingredients: 'Quinoa cocida, aguacate, tomates cherry, pepino, semillas de chía',
        instructions: 'Cocina la quinoa, corta los vegetales, mezcla todo y adereza con aceite de oliva.',
        tags: const ['superalimento', 'vegetariano', 'fibra'],
      ),
    ] : _recipes;
    
    final totalRecipes = sampleRecipes.length;
    final easyRecipes = sampleRecipes.where((r) => r.difficulty == 'Fácil').length;
    final averageRating = sampleRecipes.isEmpty 
        ? 0.0 
        : sampleRecipes.map((r) => r.rating).reduce((a, b) => a + b) / sampleRecipes.length;
    final totalCalories = sampleRecipes.map((r) => r.calories).fold(0, (a, b) => a + b);
    
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
                  Colors.green.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.green.withOpacity(0.3),
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
                    Icons.menu_book,
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
                        'Recetas Saludables',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Descubre nuevas recetas nutritivas',
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
                  child: const Icon(Icons.local_fire_department, size: 16, color: Colors.green),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Resumen de recetas mejorado
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.menu_book,
                  title: 'Total Recetas',
                  value: totalRecipes.toString(),
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle_outline,
                  title: 'Fáciles',
                  value: easyRecipes.toString(),
                  color: Colors.green,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.star,
                  title: 'Calificación',
                  value: averageRating.toStringAsFixed(1),
                  color: Colors.orange,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.local_fire_department,
                  title: 'Calorías',
                  value: totalCalories.toString(),
                  color: Colors.red,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Botón para agregar receta
          Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 16),
            child: ElevatedButton.icon(
              onPressed: () {
                setState(() {
                  _showAddRecipeModal = true;
                });
              },
              icon: const Icon(Icons.add_circle_outline, size: 20),
              label: const Text('Nueva Receta'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          
          // Lista de recetas mejorada
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Mis Recetas',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () {
                        // TODO: Implementar filtro
                      },
                      icon: const Icon(Icons.filter_list, size: 16),
                      label: const Text('Filtrar'),
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.green,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                
                ...sampleRecipes.map((recipe) => _buildEnhancedRecipeCard(recipe)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEnhancedRecipeCard(Recipe recipe) {
    final difficultyColor = _getDifficultyColor(recipe.difficulty);
    final categoryIcon = _getCategoryIcon(recipe.category);
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkBackground,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.green.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header de la receta
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Icon(categoryIcon, size: 24, color: Colors.green),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      recipe.name,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      recipe.category,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.favorite_border, size: 20, color: Colors.red),
                onPressed: () {},
              ),
              IconButton(
                icon: const Icon(Icons.share, size: 20, color: Colors.green),
                onPressed: () {},
              ),
            ],
          ),
          const SizedBox(height: 16),
          
          // Meta información
          Row(
            children: [
              _buildMetaItem(Icons.access_time, recipe.prepTime),
              const SizedBox(width: 16),
              _buildMetaItem(Icons.people, '${recipe.servings} porciones'),
              const SizedBox(width: 16),
              _buildMetaItem(Icons.local_fire_department, '${recipe.calories} kcal'),
            ],
          ),
          const SizedBox(height: 12),
          
          // Dificultad y rating
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: difficultyColor,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  recipe.difficulty,
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Row(
                children: [
                  const Icon(Icons.star, size: 16, color: Colors.orange),
                  const SizedBox(width: 4),
                  Text(
                    recipe.rating.toStringAsFixed(1),
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.white,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          
          // Descripción
          Text(
            recipe.instructions,
            style: const TextStyle(
              fontSize: 14,
              color: AppTheme.white70,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 12),
          
          // Tags
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: recipe.tags.map((tag) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.green.withOpacity(0.3)),
                ),
                child: Text(
                  tag,
                  style: const TextStyle(
                    fontSize: 11,
                    color: AppTheme.white70,
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),
          
          // Botones de acción
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    // TODO: Ver receta completa
                  },
                  icon: const Icon(Icons.visibility, size: 16),
                  label: const Text('Ver Receta'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    // TODO: Agregar a plan
                  },
                  icon: const Icon(Icons.add, size: 16),
                  label: const Text('Agregar a Plan'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.green,
                    side: const BorderSide(color: Colors.green),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetaItem(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 14, color: AppTheme.white60),
        const SizedBox(width: 4),
        Text(
          text,
          style: const TextStyle(
            fontSize: 12,
            color: AppTheme.white60,
          ),
        ),
      ],
    );
  }

  IconData _getCategoryIcon(String category) {
    switch (category) {
      case 'Ensaladas':
        return Icons.eco;
      case 'Pescados':
        return Icons.set_meal;
      case 'Bowls':
        return Icons.restaurant;
      case 'Bebidas':
        return Icons.local_drink;
      default:
        return Icons.restaurant;
    }
  }

  Widget _buildGymRoutine() {
    // Datos de ejemplo para mostrar el UI
    final sampleGymData = {
      'weeklyStats': {
        'totalWorkouts': 4,
        'totalDuration': 320,
        'totalExercises': 28,
        'averageIntensity': 7.2,
      },
      'routines': _gymRoutines.isEmpty ? [] : _gymRoutines.map((r) => {
        'name': r.name,
        'difficulty': r.difficulty,
        'duration': r.duration,
        'completed': false,
      }).toList(),
      'goals': [
        {'id': 1, 'title': 'Entrenar 4 días/semana', 'current': 4, 'target': 4, 'unit': 'días', 'completed': true},
        {'id': 2, 'title': 'Completar 20 ejercicios', 'current': 19, 'target': 20, 'unit': 'ejercicios', 'completed': false},
      ],
      'achievements': [
        {'id': 1, 'title': 'Primera Rutina', 'description': 'Completaste tu primera rutina de gimnasio', 'icon': '🏋️', 'unlocked': !_gymRoutines.isEmpty},
        {'id': 2, 'title': 'Consistencia', 'description': '4 entrenamientos en una semana', 'icon': '💪', 'unlocked': false},
        {'id': 3, 'title': 'Fuerza', 'description': 'Levantaste 100kg+ en peso muerto', 'icon': '🔥', 'unlocked': false},
        {'id': 4, 'title': 'Maratón', 'description': '30 días consecutivos entrenando', 'icon': '🏃', 'unlocked': false},
      ],
    };
    
    final weeklyStats = sampleGymData['weeklyStats'] as Map<String, dynamic>;
    final routines = sampleGymData['routines'] as List;
    final goals = sampleGymData['goals'] as List;
    final achievements = sampleGymData['achievements'] as List;
    
    double getProgressPercentage(int current, int target) {
      return ((current / target) * 100).clamp(0.0, 100.0);
    }
    
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
                  Colors.green.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
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
                    Icons.fitness_center,
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
                        'Rutina de Gimnasio',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Planifica y ejecuta tus entrenamientos',
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
                  child: const Icon(Icons.fitness_center, size: 16, color: Colors.green),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Resumen de estadísticas
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.fitness_center,
                  title: 'Rutinas',
                  value: weeklyStats['totalWorkouts'].toString(),
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.access_time,
                  title: 'Duración',
                  value: '${weeklyStats['totalDuration']}m',
                  color: Colors.red,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.fitness_center,
                  title: 'Ejercicios',
                  value: weeklyStats['totalExercises'].toString(),
                  color: Colors.orange,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.speed,
                  title: 'Intensidad',
                  value: '${weeklyStats['averageIntensity']}/10',
                  color: Colors.pink,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Botón para agregar rutina
          Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 16),
            child: ElevatedButton.icon(
              onPressed: () {
                setState(() {
                  _showAddGymModal = true;
                });
              },
              icon: const Icon(Icons.add_circle_outline, size: 20),
              label: const Text('Crear Rutina'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          
          // Lista de rutinas
          if (routines.isEmpty)
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.fitness_center, size: 64, color: AppTheme.white40),
                    const SizedBox(height: 16),
                    const Text(
                      'No hay rutinas de gimnasio',
                      style: TextStyle(
                        fontSize: 16,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
              ),
            )
          else
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
                    'Mis Rutinas',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ...routines.map((routine) => _buildGymRoutineCard(routine as GymRoutine)),
                ],
              ),
            ),
          const SizedBox(height: 24),
          
          // Objetivos de gimnasio
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Objetivos de la Semana',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '${goals.where((g) => g['completed'] == true).length}/${goals.length} completados',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ...goals.map((goal) {
                  final isCompleted = goal['completed'] == true;
                  final progress = getProgressPercentage(goal['current'] as int, goal['target'] as int);
                  
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBackground,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Text(
                                goal['title'] as String,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: AppTheme.white,
                                ),
                              ),
                            ),
                            Text(
                              '${goal['current']}/${goal['target']} ${goal['unit']}',
                              style: TextStyle(
                                fontSize: 12,
                                color: isCompleted ? Colors.green : AppTheme.white60,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(4),
                                child: LinearProgressIndicator(
                                  value: progress / 100,
                                  minHeight: 6,
                                  backgroundColor: AppTheme.darkSurfaceVariant,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                    isCompleted ? Colors.green : Colors.orange,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              '${progress.toStringAsFixed(0)}%',
                              style: TextStyle(
                                fontSize: 12,
                                color: isCompleted ? Colors.green : AppTheme.white60,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Sistema de logros
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Logros de Gimnasio',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '${achievements.where((a) => a['unlocked'] == true).length}/${achievements.length} desbloqueados',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: achievements.map((achievement) {
                    final isUnlocked = achievement['unlocked'] == true;
                    return Container(
                      width: (MediaQuery.of(context).size.width - 64) / 2,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isUnlocked
                            ? Colors.green.withOpacity(0.1)
                            : AppTheme.darkSurfaceVariant,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isUnlocked
                              ? Colors.green.withOpacity(0.3)
                              : AppTheme.darkSurfaceVariant,
                        ),
                      ),
                      child: Column(
                        children: [
                          Text(
                            isUnlocked ? achievement['icon'] as String : '🔒',
                            style: const TextStyle(fontSize: 32),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            achievement['title'] as String,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: isUnlocked ? AppTheme.white : AppTheme.white60,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            achievement['description'] as String,
                            style: TextStyle(
                              fontSize: 11,
                              color: isUnlocked ? AppTheme.white70 : AppTheme.white40,
                            ),
                            textAlign: TextAlign.center,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSportsGoals() {
    // Datos de ejemplo
    final sampleSportsData = {
      'weeklyStats': {
        'totalGoals': 8,
        'completedGoals': 5,
        'activeGoals': 3,
        'completionRate': 62.5,
      },
      'goals': _sportsGoals.isEmpty ? [] : _sportsGoals.map((g) => {
        'id': g.id,
        'sport': g.sport,
        'objective': g.objective,
        'targetDate': g.targetDate,
        'progressPercentage': 50,
        'completed': false,
      }).toList(),
      'categories': [
        {'name': 'Deportes de Equipo', 'count': 1, 'color': Colors.red},
        {'name': 'Deportes Acuáticos', 'count': 1, 'color': Colors.blue},
        {'name': 'Deportes de Resistencia', 'count': 2, 'color': Colors.green},
        {'name': 'Deportes de Raqueta', 'count': 1, 'color': Colors.orange},
      ],
      'achievements': [
        {'id': 1, 'title': 'Primer Objetivo', 'description': 'Completaste tu primer objetivo deportivo', 'icon': '🏆', 'unlocked': !_sportsGoals.isEmpty},
        {'id': 2, 'title': 'Consistencia', 'description': '5 objetivos completados en un mes', 'icon': '💪', 'unlocked': false},
        {'id': 3, 'title': 'Multideportista', 'description': 'Objetivos en 3 deportes diferentes', 'icon': '🌟', 'unlocked': false},
        {'id': 4, 'title': 'Campeón', 'description': '10 objetivos completados', 'icon': '👑', 'unlocked': false},
      ],
    };
    
    final weeklyStats = sampleSportsData['weeklyStats'] as Map<String, dynamic>;
    final goals = sampleSportsData['goals'] as List;
    final categories = sampleSportsData['categories'] as List;
    final achievements = sampleSportsData['achievements'] as List;
    
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
                  Colors.green.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
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
                    Icons.emoji_events,
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
                        'Objetivos Deportivos',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Establece y alcanza tus metas deportivas',
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
                  child: const Icon(Icons.flag, size: 16, color: Colors.green),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Resumen de estadísticas
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.emoji_events,
                  title: 'Objetivos',
                  value: weeklyStats['totalGoals'].toString(),
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle_outline,
                  title: 'Completados',
                  value: weeklyStats['completedGoals'].toString(),
                  color: Colors.green,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.timer,
                  title: 'Activos',
                  value: weeklyStats['activeGoals'].toString(),
                  color: Colors.blue,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.analytics,
                  title: 'Progreso',
                  value: '${weeklyStats['completionRate']}%',
                  color: Colors.orange,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Botón para agregar objetivo
          Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 16),
            child: ElevatedButton.icon(
              onPressed: () {
                setState(() {
                  _showAddSportsModal = true;
                });
              },
              icon: const Icon(Icons.add_circle_outline, size: 20),
              label: const Text('Crear Objetivo'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          
          // Categorías de deportes
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Categorías',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '${categories.length} categorías activas',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: categories.map((category) {
                    final color = category['color'] as Color;
                    return Container(
                      width: (MediaQuery.of(context).size.width - 88) / 2,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.darkBackground,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: color.withOpacity(0.3)),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 24,
                            height: 24,
                            decoration: BoxDecoration(
                              color: color,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  category['name'] as String,
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: AppTheme.white,
                                  ),
                                ),
                                Text(
                                  '${category['count']} objetivos',
                                  style: const TextStyle(
                                    fontSize: 10,
                                    color: AppTheme.white60,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Lista de objetivos
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Mis Objetivos',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '${goals.where((g) => g['completed'] == true).length}/${goals.length} completados',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                if (goals.isEmpty)
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.emoji_events, size: 64, color: AppTheme.white40),
                        const SizedBox(height: 16),
                        const Text(
                          'No hay objetivos deportivos',
                          style: TextStyle(
                            fontSize: 16,
                            color: AppTheme.white60,
                          ),
                        ),
                      ],
                    ),
                  )
                else
                  ...goals.map((goal) {
                    final goalObj = goal as Map<String, dynamic>;
                    final isCompleted = goalObj['completed'] == true;
                    final progress = goalObj['progressPercentage'] as int? ?? 0;
                    
                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppTheme.darkBackground,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isCompleted
                              ? Colors.green.withOpacity(0.3)
                              : Colors.blue.withOpacity(0.3),
                        ),
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
                                    Text(
                                      goalObj['sport'] ?? '',
                                      style: const TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.white,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      goalObj['objective'] ?? '',
                                      style: const TextStyle(
                                        fontSize: 14,
                                        color: AppTheme.white70,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Icon(
                                isCompleted ? Icons.check_circle : Icons.radio_button_unchecked,
                                size: 24,
                                color: isCompleted ? Colors.green : AppTheme.white60,
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              const Icon(Icons.calendar_today, size: 14, color: AppTheme.white60),
                              const SizedBox(width: 4),
                              Text(
                                DateFormat('dd/MM/yyyy').format(goalObj['targetDate'] as DateTime? ?? DateTime.now()),
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.white60,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: LinearProgressIndicator(
                              value: progress / 100,
                              minHeight: 6,
                              backgroundColor: AppTheme.darkSurfaceVariant,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                isCompleted ? Colors.green : Colors.blue,
                              ),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '$progress%',
                            style: TextStyle(
                              fontSize: 12,
                              color: isCompleted ? Colors.green : AppTheme.white60,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: ElevatedButton.icon(
                                  onPressed: () {
                                    // TODO: Actualizar progreso
                                  },
                                  icon: const Icon(Icons.trending_up, size: 16),
                                  label: const Text('Actualizar'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.green,
                                    padding: const EdgeInsets.symmetric(vertical: 12),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: OutlinedButton.icon(
                                  onPressed: () {
                                    // TODO: Editar objetivo
                                  },
                                  icon: const Icon(Icons.edit, size: 16),
                                  label: const Text('Editar'),
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: Colors.green,
                                    side: const BorderSide(color: Colors.green),
                                    padding: const EdgeInsets.symmetric(vertical: 12),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  }).toList(),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Sistema de logros
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Logros Deportivos',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '${achievements.where((a) => a['unlocked'] == true).length}/${achievements.length} desbloqueados',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: achievements.map((achievement) {
                    final isUnlocked = achievement['unlocked'] == true;
                    return Container(
                      width: (MediaQuery.of(context).size.width - 64) / 2,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isUnlocked
                            ? Colors.green.withOpacity(0.1)
                            : AppTheme.darkSurfaceVariant,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isUnlocked
                              ? Colors.green.withOpacity(0.3)
                              : AppTheme.darkSurfaceVariant,
                        ),
                      ),
                      child: Column(
                        children: [
                          Text(
                            isUnlocked ? achievement['icon'] as String : '🔒',
                            style: const TextStyle(fontSize: 32),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            achievement['title'] as String,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: isUnlocked ? AppTheme.white : AppTheme.white60,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            achievement['description'] as String,
                            style: TextStyle(
                              fontSize: 11,
                              color: isUnlocked ? AppTheme.white70 : AppTheme.white40,
                            ),
                            textAlign: TextAlign.center,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFitnessTracker() {
    final today = DateFormat('yyyy-MM-dd').format(DateTime.now());
    final todayData = _fitnessData[today] ?? {};
    final currentSteps = int.tryParse(todayData['steps']?.toString() ?? '0') ?? 0;
    final currentCalories = int.tryParse(todayData['caloriesOut']?.toString() ?? '0') ?? 0;
    final currentWater = int.tryParse(todayData['water']?.toString() ?? '0') ?? 0;
    final hasWorkout = todayData['workout'] == true;
    
    final dailyGoals = {
      'steps': 10000,
      'calories': 500,
      'water': 8,
      'workouts': 1,
    };
    
    final weeklyStats = {
      'totalSteps': 45620,
      'totalCaloriesBurned': 2840,
      'totalWorkouts': 5,
      'averageHeartRate': 142,
    };
    
    final weeklyProgress = [
      {'day': 'Lun', 'steps': 8500, 'calories': 420, 'water': 6, 'workout': true},
      {'day': 'Mar', 'steps': 12000, 'calories': 580, 'water': 8, 'workout': true},
      {'day': 'Mié', 'steps': 6800, 'calories': 320, 'water': 5, 'workout': false},
      {'day': 'Jue', 'steps': 15000, 'calories': 720, 'water': 9, 'workout': true},
      {'day': 'Vie', 'steps': 9200, 'calories': 450, 'water': 7, 'workout': true},
      {'day': 'Sáb', 'steps': 11000, 'calories': 520, 'water': 8, 'workout': false},
      {'day': 'Dom', 'steps': 7500, 'calories': 380, 'water': 6, 'workout': true},
    ];
    
    final achievements = [
      {'id': 1, 'title': 'Primera Semana', 'description': 'Completaste tu primera semana de seguimiento', 'icon': '🏆', 'unlocked': true},
      {'id': 2, 'title': 'Meta de Pasos', 'description': 'Superaste los 10,000 pasos diarios', 'icon': '👟', 'unlocked': true},
      {'id': 3, 'title': 'Consistencia', 'description': '5 días consecutivos de ejercicio', 'icon': '💪', 'unlocked': false},
      {'id': 4, 'title': 'Hidratación', 'description': '8 vasos de agua por 7 días', 'icon': '💧', 'unlocked': false},
    ];
    
    final unlockedAchievements = achievements.where((a) => a['unlocked'] == true).length;
    
    double getProgressPercentage(int current, int goal) {
      return (current / goal * 100).clamp(0.0, 100.0);
    }
    
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
                  Colors.green.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: Colors.green.withOpacity(0.3),
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
                    color: Colors.green.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.track_changes, size: 24, color: Colors.green),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Seguidor de Fitness',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Monitorea tu actividad física diaria',
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
                  child: const Icon(Icons.fitness_center, size: 16, color: Colors.green),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Resumen semanal
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.directions_walk,
                  title: 'Pasos Totales',
                  value: weeklyStats['totalSteps']!.toString(),
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.local_fire_department,
                  title: 'Calorías',
                  value: weeklyStats['totalCaloriesBurned']!.toString(),
                  color: Colors.red,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.fitness_center,
                  title: 'Entrenamientos',
                  value: weeklyStats['totalWorkouts']!.toString(),
                  color: Colors.orange,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.favorite,
                  title: 'Ritmo Cardíaco',
                  value: '${weeklyStats['averageHeartRate']}',
                  color: Colors.pink,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Botón para agregar actividad
          Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 16),
            child: ElevatedButton.icon(
              onPressed: () {
                setState(() {
                  _selectedFitnessDate = DateTime.now();
                });
                // TODO: Abrir modal para registrar actividad
              },
              icon: const Icon(Icons.add_circle_outline, size: 20),
              label: const Text('Registrar Actividad'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          
          // Progreso del día actual
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.green.withOpacity(0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.today, color: Colors.green, size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'Progreso de Hoy',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _buildProgressCard(
                  icon: Icons.directions_walk,
                  title: 'Pasos',
                  value: currentSteps.toString(),
                  progress: getProgressPercentage(currentSteps, dailyGoals['steps']!),
                  goal: dailyGoals['steps']!.toString(),
                  color: Colors.green,
                ),
                const SizedBox(height: 12),
                _buildProgressCard(
                  icon: Icons.local_fire_department,
                  title: 'Calorías',
                  value: currentCalories.toString(),
                  progress: getProgressPercentage(currentCalories, dailyGoals['calories']!),
                  goal: dailyGoals['calories']!.toString(),
                  color: Colors.red,
                ),
                const SizedBox(height: 12),
                _buildProgressCard(
                  icon: Icons.water_drop,
                  title: 'Agua',
                  value: '$currentWater vasos',
                  progress: getProgressPercentage(currentWater, dailyGoals['water']!),
                  goal: '${dailyGoals['water']} vasos',
                  color: Colors.blue,
                ),
                const SizedBox(height: 12),
                _buildProgressCard(
                  icon: Icons.fitness_center,
                  title: 'Ejercicio',
                  value: hasWorkout ? 'Completado' : 'Pendiente',
                  progress: hasWorkout ? 100.0 : 0.0,
                  goal: '${dailyGoals['workouts']} sesión',
                  color: Colors.orange,
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Progreso semanal
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
                  'Progreso Semanal',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: weeklyProgress.map((day) {
                    return Column(
                      children: [
                        Text(
                          day['day'] as String,
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppTheme.white60,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: (day['steps'] as int) >= dailyGoals['steps']!
                                ? Colors.green.withOpacity(0.2)
                                : AppTheme.darkSurfaceVariant,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: (day['steps'] as int) >= dailyGoals['steps']!
                                  ? Colors.green
                                  : AppTheme.darkSurfaceVariant,
                            ),
                          ),
                          child: Center(
                            child: Text(
                              (day['steps'] as int).toString(),
                              style: TextStyle(
                                fontSize: 10,
                                color: (day['steps'] as int) >= dailyGoals['steps']!
                                    ? Colors.green
                                    : AppTheme.white60,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Logros
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Logros',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '$unlockedAchievements/${achievements.length} desbloqueados',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: achievements.map((achievement) {
                    final isUnlocked = achievement['unlocked'] == true;
                    return Container(
                      width: (MediaQuery.of(context).size.width - 64) / 2,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isUnlocked
                            ? Colors.green.withOpacity(0.1)
                            : AppTheme.darkSurfaceVariant,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isUnlocked
                              ? Colors.green.withOpacity(0.3)
                              : AppTheme.darkSurfaceVariant,
                        ),
                      ),
                      child: Column(
                        children: [
                          Text(
                            isUnlocked ? achievement['icon'] as String : '🔒',
                            style: const TextStyle(fontSize: 32),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            achievement['title'] as String,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: isUnlocked ? AppTheme.white : AppTheme.white60,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            achievement['description'] as String,
                            style: TextStyle(
                              fontSize: 11,
                              color: isUnlocked ? AppTheme.white70 : AppTheme.white40,
                            ),
                            textAlign: TextAlign.center,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildProgressCard({
    required IconData icon,
    required String title,
    required String value,
    required double progress,
    required String goal,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.darkBackground,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: color),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: progress / 100,
              minHeight: 6,
              backgroundColor: AppTheme.darkSurfaceVariant,
              valueColor: AlwaysStoppedAnimation<Color>(color),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Meta: $goal',
            style: const TextStyle(
              fontSize: 11,
              color: AppTheme.white60,
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
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
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

  Widget _buildBodyMeasurements() {
    final measurementTypes = [
      {'id': 'weight', 'name': 'Peso', 'unit': 'kg', 'icon': Icons.monitor_weight},
      {'id': 'neck', 'name': 'Cuello', 'unit': 'cm', 'icon': Icons.circle},
      {'id': 'bicep', 'name': 'Bíceps', 'unit': 'cm', 'icon': Icons.fitness_center},
      {'id': 'bust', 'name': 'Busto', 'unit': 'cm', 'icon': Icons.person},
      {'id': 'chest', 'name': 'Pecho', 'unit': 'cm', 'icon': Icons.accessibility_new},
      {'id': 'waist', 'name': 'Cintura', 'unit': 'cm', 'icon': Icons.remove},
      {'id': 'hips', 'name': 'Cadera', 'unit': 'cm', 'icon': Icons.circle_outlined},
      {'id': 'thigh', 'name': 'Muslo', 'unit': 'cm', 'icon': Icons.fitness_center},
      {'id': 'calf', 'name': 'Pantorrilla', 'unit': 'cm', 'icon': Icons.fitness_center},
    ];
    
    final weeklyStats = {
      'totalMeasurements': _bodyMeasurements.length,
      'weightChange': -1.2,
      'waistChange': -3.0,
      'muscleGain': 0.8,
    };
    
    final goals = {
      'weight': 70.0,
      'waist': 75.0,
      'chest': 100.0,
      'bicep': 35.0,
    };
    
    final achievements = [
      {'id': 1, 'title': 'Primera Medición', 'description': 'Registraste tu primera medida corporal', 'icon': '📏', 'unlocked': _bodyMeasurements.isNotEmpty},
      {'id': 2, 'title': 'Consistencia', 'description': '5 mediciones en una semana', 'icon': '📅', 'unlocked': _bodyMeasurements.length >= 5},
      {'id': 3, 'title': 'Meta de Peso', 'description': 'Alcanzaste tu peso objetivo', 'icon': '⚖️', 'unlocked': false},
      {'id': 4, 'title': 'Progreso Constante', 'description': 'Mejora en 3 medidas consecutivas', 'icon': '📈', 'unlocked': false},
    ];
    
    final unlockedAchievements = achievements.where((a) => a['unlocked'] == true).length;
    
    double getProgressPercentage(String? current, double goal) {
      if (current == null || current.isEmpty) return 0;
      final currentNum = double.tryParse(current) ?? 0;
      return ((currentNum / goal) * 100).clamp(0.0, 100.0);
    }
    
    void handleMeasurementChange(String measurementId, String value) {
      setState(() {
        if (measurementId == 'notes') {
          _newMeasurements[measurementId] = value;
        } else {
          final numericValue = value.replaceAll(RegExp(r'[^0-9.]'), '');
          final parts = numericValue.split('.');
          final validValue = parts.length > 2 
              ? '${parts[0]}.${parts.sublist(1).join('')}' 
              : numericValue;
          _newMeasurements[measurementId] = validValue;
        }
      });
    }
    
    void handleSaveMeasurements() {
      final hasMeasurements = _newMeasurements.entries.any((entry) => 
          entry.key != 'notes' && entry.value.toString().trim().isNotEmpty);
      
      if (!hasMeasurements) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Por favor ingresa al menos una medida')),
        );
        return;
      }
      
      final dateKey = DateFormat('yyyy-MM-dd').format(_selectedMeasurementDate);
      setState(() {
        _bodyMeasurements[dateKey] = {
          ..._newMeasurements,
          'date': _selectedMeasurementDate,
          'timestamp': DateTime.now().toIso8601String(),
        };
        
        _newMeasurements = {
          'weight': '',
          'neck': '',
          'bicep': '',
          'bust': '',
          'chest': '',
          'waist': '',
          'hips': '',
          'thigh': '',
          'calf': '',
          'notes': '',
        };
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Medidas guardadas correctamente')),
      );
    }
    
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
                  Colors.green.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.straighten, size: 24, color: Colors.green),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Medidas Corporales',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Monitorea tu progreso físico',
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
          
          // Resumen de estadísticas
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.analytics,
                  title: 'Mediciones',
                  value: weeklyStats['totalMeasurements']!.toString(),
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.trending_down,
                  title: 'Cambio Peso',
                  value: '${weeklyStats['weightChange']}kg',
                  color: Colors.red,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.remove,
                  title: 'Cintura',
                  value: '${weeklyStats['waistChange']}cm',
                  color: Colors.orange,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.fitness_center,
                  title: 'Músculo',
                  value: '+${weeklyStats['muscleGain']}cm',
                  color: Colors.pink,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Selector de fecha
          GestureDetector(
            onTap: () async {
              final date = await showDatePicker(
                context: context,
                initialDate: _selectedMeasurementDate,
                firstDate: DateTime(2020),
                lastDate: DateTime.now(),
              );
              if (date != null) {
                setState(() => _selectedMeasurementDate = date);
              }
            },
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.green.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.calendar_today, color: Colors.green, size: 20),
                  const SizedBox(width: 12),
                  Text(
                    DateFormat('dd/MM/yyyy').format(_selectedMeasurementDate),
                    style: const TextStyle(
                      fontSize: 16,
                      color: AppTheme.white,
                    ),
                  ),
                  const Spacer(),
                  const Icon(Icons.arrow_drop_down, color: Colors.green),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
          
          // Grid de medidas principales
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: measurementTypes.take(4).map((measurement) {
              final measurementId = measurement['id'] as String;
              final currentValue = _newMeasurements[measurementId] ?? '';
              final goal = goals[measurementId] ?? 100.0;
              
              return Container(
                width: (MediaQuery.of(context).size.width - 44) / 2,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.green.withOpacity(0.3)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(measurement['icon'] as IconData, size: 20, color: Colors.green),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            measurement['name'] as String,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.white,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: TextEditingController(text: currentValue.toString()),
                            onChanged: (value) => handleMeasurementChange(measurementId, value),
                            keyboardType: TextInputType.number,
                            style: const TextStyle(color: AppTheme.white, fontSize: 18),
                            decoration: InputDecoration(
                              hintText: '0',
                              hintStyle: const TextStyle(color: AppTheme.white40),
                              border: InputBorder.none,
                              suffixText: measurement['unit'] as String,
                              suffixStyle: const TextStyle(color: AppTheme.white60),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: getProgressPercentage(currentValue.toString(), goal) / 100,
                        minHeight: 4,
                        backgroundColor: AppTheme.darkSurfaceVariant,
                        valueColor: const AlwaysStoppedAnimation<Color>(Colors.green),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Meta: ${goal}${measurement['unit']}',
                      style: const TextStyle(
                        fontSize: 11,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
          
          // Medidas adicionales
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
                  'Medidas Adicionales',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: measurementTypes.skip(4).map((measurement) {
                    final measurementId = measurement['id'] as String;
                    final currentValue = _newMeasurements[measurementId] ?? '';
                    
                    return Container(
                      width: (MediaQuery.of(context).size.width - 76) / 3,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.darkBackground,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        children: [
                          Icon(measurement['icon'] as IconData, size: 16, color: AppTheme.white60),
                          const SizedBox(height: 8),
                          TextField(
                            controller: TextEditingController(text: currentValue.toString()),
                            onChanged: (value) => handleMeasurementChange(measurementId, value),
                            keyboardType: TextInputType.number,
                            textAlign: TextAlign.center,
                            style: const TextStyle(color: AppTheme.white, fontSize: 14),
                            decoration: InputDecoration(
                              hintText: '0',
                              hintStyle: const TextStyle(color: AppTheme.white40),
                              border: InputBorder.none,
                              isDense: true,
                              contentPadding: EdgeInsets.zero,
                            ),
                          ),
                          Text(
                            measurement['unit'] as String,
                            style: const TextStyle(
                              fontSize: 10,
                              color: AppTheme.white60,
                            ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Botones de acción
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: handleSaveMeasurements,
                  icon: const Icon(Icons.save, size: 20),
                  label: const Text('Guardar Medidas'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {
                    // TODO: Abrir historial
                  },
                  icon: const Icon(Icons.bar_chart, size: 20),
                  label: const Text('Ver Historial'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.green,
                    side: const BorderSide(color: Colors.green),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Notas
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.note, color: Colors.green, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Notas del Día',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: TextEditingController(text: _newMeasurements['notes']?.toString() ?? ''),
                  onChanged: (value) => handleMeasurementChange('notes', value),
                  maxLines: 3,
                  style: const TextStyle(color: AppTheme.white),
                  decoration: InputDecoration(
                    hintText: '¿Cómo te sientes hoy? ¿Algún cambio notable?',
                    hintStyle: const TextStyle(color: AppTheme.white40),
                    filled: true,
                    fillColor: AppTheme.darkBackground,
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
                      borderSide: const BorderSide(color: Colors.green),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Logros
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Logros Corporales',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '$unlockedAchievements/${achievements.length} desbloqueados',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: achievements.map((achievement) {
                    final isUnlocked = achievement['unlocked'] == true;
                    return Container(
                      width: (MediaQuery.of(context).size.width - 64) / 2,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isUnlocked
                            ? Colors.green.withOpacity(0.1)
                            : AppTheme.darkSurfaceVariant,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isUnlocked
                              ? Colors.green.withOpacity(0.3)
                              : AppTheme.darkSurfaceVariant,
                        ),
                      ),
                      child: Column(
                        children: [
                          Text(
                            isUnlocked ? achievement['icon'] as String : '🔒',
                            style: const TextStyle(fontSize: 32),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            achievement['title'] as String,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: isUnlocked ? AppTheme.white : AppTheme.white60,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            achievement['description'] as String,
                            style: TextStyle(
                              fontSize: 11,
                              color: isUnlocked ? AppTheme.white70 : AppTheme.white40,
                            ),
                            textAlign: TextAlign.center,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWorkoutTracker() {
    final weeklyStats = {
      'totalWorkouts': 5,
      'totalDuration': 420, // minutos
      'totalCalories': 2840,
      'averageIntensity': 7.5,
    };
    
    final currentWeek = {
      'monday': {'workout': 'Cardio HIIT', 'duration': 45, 'calories': 520, 'completed': true},
      'tuesday': {'workout': 'Fuerza Superior', 'duration': 60, 'calories': 480, 'completed': true},
      'wednesday': {'workout': 'Descanso', 'duration': 0, 'calories': 0, 'completed': true},
      'thursday': {'workout': 'Cardio LISS', 'duration': 30, 'calories': 300, 'completed': true},
      'friday': {'workout': 'Fuerza Inferior', 'duration': 55, 'calories': 450, 'completed': true},
      'saturday': {'workout': 'Yoga', 'duration': 40, 'calories': 200, 'completed': false},
      'sunday': {'workout': 'Caminata', 'duration': 0, 'calories': 0, 'completed': false},
    };
    
    final goals = [
      {'id': 1, 'title': 'Entrenar 5 días por semana', 'progress': 5, 'target': 5, 'completed': true},
      {'id': 2, 'title': 'Quemar 3000 calorías', 'progress': 2840, 'target': 3000, 'completed': false},
      {'id': 3, 'title': 'Completar 10 horas de ejercicio', 'progress': 7, 'target': 10, 'completed': false},
    ];
    
    final achievements = [
      {'id': 1, 'title': 'Primera Semana', 'description': 'Completaste tu primera semana de entrenamiento', 'icon': '🏋️', 'unlocked': true},
      {'id': 2, 'title': 'Consistencia', 'description': '5 entrenamientos en una semana', 'icon': '💪', 'unlocked': true},
      {'id': 3, 'title': 'Quemador de Calorías', 'description': 'Quemaste 2500+ calorías en una semana', 'icon': '🔥', 'unlocked': true},
      {'id': 4, 'title': 'Maratón', 'description': '10 horas de ejercicio en un mes', 'icon': '🏃', 'unlocked': false},
    ];
    
    final unlockedAchievements = achievements.where((a) => a['unlocked'] == true).length;
    
    double getProgressPercentage(int current, int target) {
      return ((current / target) * 100).clamp(0.0, 100.0);
    }
    
    final weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    final weekKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
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
                  Colors.green.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.directions_run, size: 24, color: Colors.green),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Seguidor de Entrenamientos',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Registra y monitorea tus entrenamientos',
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
          
          // Resumen semanal
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.fitness_center,
                  title: 'Entrenamientos',
                  value: weeklyStats['totalWorkouts']!.toString(),
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.access_time,
                  title: 'Duración',
                  value: '${weeklyStats['totalDuration']} min',
                  color: Colors.blue,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.local_fire_department,
                  title: 'Calorías',
                  value: weeklyStats['totalCalories']!.toString(),
                  color: Colors.red,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.speed,
                  title: 'Intensidad',
                  value: '${weeklyStats['averageIntensity']}/10',
                  color: Colors.orange,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Botón para agregar entrenamiento
          Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 16),
            child: ElevatedButton.icon(
              onPressed: () {
                setState(() {
                  _showAddWorkoutModal = true;
                });
                // TODO: Abrir modal para agregar entrenamiento
              },
              icon: const Icon(Icons.add_circle_outline, size: 20),
              label: const Text('Agregar Entrenamiento'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          
          // Semana actual
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
                  'Semana Actual',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 16),
                ...weekKeys.asMap().entries.map((entry) {
                  final index = entry.key;
                  final dayKey = entry.value;
                  final dayData = currentWeek[dayKey]!;
                  final isCompleted = dayData['completed'] == true;
                  
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isCompleted
                          ? Colors.green.withOpacity(0.1)
                          : AppTheme.darkBackground,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isCompleted
                            ? Colors.green.withOpacity(0.3)
                            : AppTheme.darkSurfaceVariant,
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 40,
                          alignment: Alignment.center,
                          child: Text(
                            weekDays[index],
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: isCompleted ? Colors.green : AppTheme.white60,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                dayData['workout'] as String,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: isCompleted ? AppTheme.white : AppTheme.white60,
                                ),
                              ),
                              if (dayData['duration'] as int > 0) ...[
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(Icons.access_time, size: 12, color: AppTheme.white60),
                                    const SizedBox(width: 4),
                                    Text(
                                      '${dayData['duration']} min',
                                      style: const TextStyle(
                                        fontSize: 11,
                                        color: AppTheme.white60,
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    const Icon(Icons.local_fire_department, size: 12, color: Colors.orange),
                                    const SizedBox(width: 4),
                                    Text(
                                      '${dayData['calories']} cal',
                                      style: const TextStyle(
                                        fontSize: 11,
                                        color: AppTheme.white60,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ],
                          ),
                        ),
                        if (isCompleted)
                          Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: Colors.green.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(Icons.check, size: 16, color: Colors.green),
                          ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Objetivos
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Objetivos Semanales',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '${goals.where((g) => g['completed'] == true).length}/${goals.length} completados',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ...goals.map((goal) {
                  final isCompleted = goal['completed'] == true;
                  final progress = getProgressPercentage(goal['progress'] as int, goal['target'] as int);
                  
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBackground,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              isCompleted ? Icons.check_circle : Icons.radio_button_unchecked,
                              size: 20,
                              color: isCompleted ? Colors.green : AppTheme.white60,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                goal['title'] as String,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: isCompleted ? AppTheme.white : AppTheme.white70,
                                  decoration: isCompleted ? TextDecoration.lineThrough : null,
                                ),
                              ),
                            ),
                            Text(
                              '${goal['progress']}/${goal['target']}',
                              style: TextStyle(
                                fontSize: 12,
                                color: isCompleted ? Colors.green : AppTheme.white60,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: progress / 100,
                            minHeight: 6,
                            backgroundColor: AppTheme.darkSurfaceVariant,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              isCompleted ? Colors.green : Colors.orange,
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
          const SizedBox(height: 24),
          
          // Logros
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Logros',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '$unlockedAchievements/${achievements.length} desbloqueados',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: achievements.map((achievement) {
                    final isUnlocked = achievement['unlocked'] == true;
                    return Container(
                      width: (MediaQuery.of(context).size.width - 64) / 2,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isUnlocked
                            ? Colors.green.withOpacity(0.1)
                            : AppTheme.darkSurfaceVariant,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isUnlocked
                              ? Colors.green.withOpacity(0.3)
                              : AppTheme.darkSurfaceVariant,
                        ),
                      ),
                      child: Column(
                        children: [
                          Text(
                            isUnlocked ? achievement['icon'] as String : '🔒',
                            style: const TextStyle(fontSize: 32),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            achievement['title'] as String,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: isUnlocked ? AppTheme.white : AppTheme.white60,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            achievement['description'] as String,
                            style: TextStyle(
                              fontSize: 11,
                              color: isUnlocked ? AppTheme.white70 : AppTheme.white40,
                            ),
                            textAlign: TextAlign.center,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWeightLoss() {
    final weightData = _weightLossData;
    final currentWeight = double.tryParse(weightData['currentWeight']?.toString() ?? '75.2') ?? 75.2;
    final startingWeight = double.tryParse(weightData['startingWeight']?.toString() ?? '82.5') ?? 82.5;
    final targetWeight = double.tryParse(weightData['targetWeight']?.toString() ?? '70.0') ?? 70.0;
    final weightLost = startingWeight - currentWeight;
    final weightToLose = currentWeight - targetWeight;
    
    final weeklyStats = {
      'thisWeek': -0.8,
      'lastWeek': -1.2,
      'averageWeekly': -0.6,
      'totalWeeks': 12,
    };
    
    final recentWeights = [
      {'date': '2024-01-15', 'weight': 75.2, 'change': -0.3},
      {'date': '2024-01-08', 'weight': 75.5, 'change': -0.5},
      {'date': '2024-01-01', 'weight': 76.0, 'change': -0.8},
      {'date': '2023-12-25', 'weight': 76.8, 'change': -0.4},
      {'date': '2023-12-18', 'weight': 77.2, 'change': -0.6},
    ];
    
    final goals = [
      {'id': 1, 'title': 'Peso objetivo', 'target': targetWeight, 'current': currentWeight, 'progress': currentWeight, 'completed': currentWeight <= targetWeight},
      {'id': 2, 'title': 'Perder 10kg', 'target': 10.0, 'current': weightLost, 'progress': weightLost, 'completed': weightLost >= 10.0},
      {'id': 3, 'title': 'Mantener peso por 1 mes', 'target': 30, 'current': 0, 'progress': 0, 'completed': false},
    ];
    
    final achievements = [
      {'id': 1, 'title': 'Primer Kilo', 'description': 'Perdiste tu primer kilogramo', 'icon': '🎯', 'unlocked': weightLost >= 1.0},
      {'id': 2, 'title': 'Consistencia', 'description': 'Registraste peso por 7 días seguidos', 'icon': '📅', 'unlocked': recentWeights.length >= 7},
      {'id': 3, 'title': 'Meta Semanal', 'description': 'Perdiste 0.5kg en una semana', 'icon': '⚖️', 'unlocked': weeklyStats['thisWeek']! <= -0.5},
      {'id': 4, 'title': 'Maratón', 'description': 'Perdiste 5kg en total', 'icon': '🏃', 'unlocked': weightLost >= 5.0},
    ];
    
    final unlockedAchievements = achievements.where((a) => a['unlocked'] == true).length;
    
    double getProgressPercentage(double current, double target) {
      if (target == 0) return 0;
      return ((current / target) * 100).clamp(0.0, 100.0);
    }
    
    final totalWeightToLose = startingWeight - targetWeight;
    final progressPercentage = getProgressPercentage(weightLost, totalWeightToLose);
    
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
                  Colors.green.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.monitor_weight, size: 24, color: Colors.green),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Pérdida de Peso',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Monitorea tu progreso hacia tu peso ideal',
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
          
          // Resumen de estadísticas
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.monitor_weight,
                  title: 'Peso Actual',
                  value: '${currentWeight.toStringAsFixed(1)}kg',
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.trending_down,
                  title: 'Perdido',
                  value: '-${weightLost.toStringAsFixed(1)}kg',
                  color: Colors.red,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.flag,
                  title: 'Restante',
                  value: '${weightToLose.toStringAsFixed(1)}kg',
                  color: Colors.orange,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.calendar_today,
                  title: 'Semanas',
                  value: weeklyStats['totalWeeks']!.toString(),
                  color: Colors.pink,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Progreso principal
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
                  'Progreso hacia tu Meta',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '${currentWeight.toStringAsFixed(1)}kg de ${targetWeight.toStringAsFixed(1)}kg',
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white70,
                  ),
                ),
                const SizedBox(height: 16),
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(
                    value: progressPercentage / 100,
                    minHeight: 12,
                    backgroundColor: AppTheme.darkSurfaceVariant,
                    valueColor: const AlwaysStoppedAnimation<Color>(Colors.green),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Column(
                      children: [
                        Text(
                          '${startingWeight.toStringAsFixed(1)}kg',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Inicio',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppTheme.white60,
                          ),
                        ),
                      ],
                    ),
                    Column(
                      children: [
                        Text(
                          '${currentWeight.toStringAsFixed(1)}kg',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.green,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Actual',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppTheme.white60,
                          ),
                        ),
                      ],
                    ),
                    Column(
                      children: [
                        Text(
                          '${targetWeight.toStringAsFixed(1)}kg',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Meta',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppTheme.white60,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Botón para registrar peso
          Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 16),
            child: ElevatedButton.icon(
              onPressed: () {
                setState(() {
                  _showAddWeightGoalModal = true;
                });
                // TODO: Abrir modal para registrar peso
              },
              icon: const Icon(Icons.add_circle_outline, size: 20),
              label: const Text('Registrar Peso'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          
          // Historial de peso
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Historial Reciente',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.analytics, size: 16),
                      label: const Text('Ver Gráfico'),
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.green,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ...recentWeights.map((entry) {
                  final change = entry['change'] as double;
                  final isPositive = change > 0;
                  final isNegative = change < 0;
                  
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBackground,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                DateFormat('dd MMM', 'es').format(DateTime.parse(entry['date'] as String)),
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: AppTheme.white,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              '${entry['weight']}kg',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  isNegative ? Icons.trending_down : isPositive ? Icons.trending_up : Icons.remove,
                                  size: 14,
                                  color: isNegative ? Colors.green : isPositive ? Colors.red : AppTheme.white60,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  '${isNegative ? '' : isPositive ? '+' : ''}${change.toStringAsFixed(1)}kg',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: isNegative ? Colors.green : isPositive ? Colors.red : AppTheme.white60,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Objetivos de peso
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Objetivos de Peso',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '${goals.where((g) => g['completed'] == true).length}/${goals.length} completados',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ...goals.map((goal) {
                  final isCompleted = goal['completed'] == true;
                  final progress = getProgressPercentage(
                    (goal['current'] as num).toDouble(),
                    (goal['target'] as num).toDouble(),
                  );
                  
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBackground,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              isCompleted ? Icons.check_circle : Icons.radio_button_unchecked,
                              size: 20,
                              color: isCompleted ? Colors.green : AppTheme.white60,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                goal['title'] as String,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: isCompleted ? AppTheme.white : AppTheme.white70,
                                  decoration: isCompleted ? TextDecoration.lineThrough : null,
                                ),
                              ),
                            ),
                            Text(
                              '${(goal['current'] as num).toStringAsFixed(1)}/${(goal['target'] as num).toStringAsFixed(1)}',
                              style: TextStyle(
                                fontSize: 12,
                                color: isCompleted ? Colors.green : AppTheme.white60,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: progress / 100,
                            minHeight: 6,
                            backgroundColor: AppTheme.darkSurfaceVariant,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              isCompleted ? Colors.green : Colors.orange,
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
          const SizedBox(height: 24),
          
          // Logros
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Logros de Pérdida de Peso',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '$unlockedAchievements/${achievements.length} desbloqueados',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: achievements.map((achievement) {
                    final isUnlocked = achievement['unlocked'] == true;
                    return Container(
                      width: (MediaQuery.of(context).size.width - 64) / 2,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isUnlocked
                            ? Colors.green.withOpacity(0.1)
                            : AppTheme.darkSurfaceVariant,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isUnlocked
                              ? Colors.green.withOpacity(0.3)
                              : AppTheme.darkSurfaceVariant,
                        ),
                      ),
                      child: Column(
                        children: [
                          Text(
                            isUnlocked ? achievement['icon'] as String : '🔒',
                            style: const TextStyle(fontSize: 32),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            achievement['title'] as String,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: isUnlocked ? AppTheme.white : AppTheme.white60,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            achievement['description'] as String,
                            style: TextStyle(
                              fontSize: 11,
                              color: isUnlocked ? AppTheme.white70 : AppTheme.white40,
                            ),
                            textAlign: TextAlign.center,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNutritionTracker() {
    final today = DateFormat('yyyy-MM-dd').format(DateTime.now());
    final todayData = _nutritionData[today] ?? _dailyNutrition;
    
    final totalCalories = (int.tryParse(todayData['breakfast']?['calories']?.toString() ?? '0') ?? 0) +
                          (int.tryParse(todayData['lunch']?['calories']?.toString() ?? '0') ?? 0) +
                          (int.tryParse(todayData['dinner']?['calories']?.toString() ?? '0') ?? 0) +
                          (int.tryParse(todayData['snacks']?['calories']?.toString() ?? '0') ?? 0);
    final totalProtein = (int.tryParse(todayData['breakfast']?['protein']?.toString() ?? '0') ?? 0) +
                          (int.tryParse(todayData['lunch']?['protein']?.toString() ?? '0') ?? 0) +
                          (int.tryParse(todayData['dinner']?['protein']?.toString() ?? '0') ?? 0) +
                          (int.tryParse(todayData['snacks']?['protein']?.toString() ?? '0') ?? 0);
    final totalCarbs = (int.tryParse(todayData['breakfast']?['carbs']?.toString() ?? '0') ?? 0) +
                        (int.tryParse(todayData['lunch']?['carbs']?.toString() ?? '0') ?? 0) +
                        (int.tryParse(todayData['dinner']?['carbs']?.toString() ?? '0') ?? 0) +
                        (int.tryParse(todayData['snacks']?['carbs']?.toString() ?? '0') ?? 0);
    final totalFats = (int.tryParse(todayData['breakfast']?['fat']?.toString() ?? '0') ?? 0) +
                       (int.tryParse(todayData['lunch']?['fat']?.toString() ?? '0') ?? 0) +
                       (int.tryParse(todayData['dinner']?['fat']?.toString() ?? '0') ?? 0) +
                       (int.tryParse(todayData['snacks']?['fat']?.toString() ?? '0') ?? 0);
    
    final dailyStats = {
      'totalCalories': totalCalories,
      'targetCalories': 2200,
      'protein': totalProtein,
      'targetProtein': 130,
      'carbs': totalCarbs,
      'targetCarbs': 300,
      'fats': totalFats,
      'targetFats': 90,
      'water': double.tryParse(todayData['water']?.toString() ?? '0') ?? 0,
      'targetWater': 2.5,
    };
    
    final meals = [
      {
        'id': 'breakfast',
        'name': 'Desayuno',
        'icon': Icons.wb_sunny,
        'calories': int.tryParse(todayData['breakfast']?['calories']?.toString() ?? '0') ?? 0,
        'protein': int.tryParse(todayData['breakfast']?['protein']?.toString() ?? '0') ?? 0,
        'carbs': int.tryParse(todayData['breakfast']?['carbs']?.toString() ?? '0') ?? 0,
        'fats': int.tryParse(todayData['breakfast']?['fat']?.toString() ?? '0') ?? 0,
        'completed': (todayData['breakfast']?['calories']?.toString() ?? '').isNotEmpty,
      },
      {
        'id': 'lunch',
        'name': 'Almuerzo',
        'icon': Icons.restaurant,
        'calories': int.tryParse(todayData['lunch']?['calories']?.toString() ?? '0') ?? 0,
        'protein': int.tryParse(todayData['lunch']?['protein']?.toString() ?? '0') ?? 0,
        'carbs': int.tryParse(todayData['lunch']?['carbs']?.toString() ?? '0') ?? 0,
        'fats': int.tryParse(todayData['lunch']?['fat']?.toString() ?? '0') ?? 0,
        'completed': (todayData['lunch']?['calories']?.toString() ?? '').isNotEmpty,
      },
      {
        'id': 'dinner',
        'name': 'Cena',
        'icon': Icons.nightlight_round,
        'calories': int.tryParse(todayData['dinner']?['calories']?.toString() ?? '0') ?? 0,
        'protein': int.tryParse(todayData['dinner']?['protein']?.toString() ?? '0') ?? 0,
        'carbs': int.tryParse(todayData['dinner']?['carbs']?.toString() ?? '0') ?? 0,
        'fats': int.tryParse(todayData['dinner']?['fat']?.toString() ?? '0') ?? 0,
        'completed': (todayData['dinner']?['calories']?.toString() ?? '').isNotEmpty,
      },
      {
        'id': 'snacks',
        'name': 'Snacks',
        'icon': Icons.fastfood,
        'calories': int.tryParse(todayData['snacks']?['calories']?.toString() ?? '0') ?? 0,
        'protein': int.tryParse(todayData['snacks']?['protein']?.toString() ?? '0') ?? 0,
        'carbs': int.tryParse(todayData['snacks']?['carbs']?.toString() ?? '0') ?? 0,
        'fats': int.tryParse(todayData['snacks']?['fat']?.toString() ?? '0') ?? 0,
        'completed': (todayData['snacks']?['calories']?.toString() ?? '').isNotEmpty,
      },
    ];
    
    final supplements = [
      {'id': 1, 'name': 'Multivitamínico', 'taken': true, 'time': '08:00'},
      {'id': 2, 'name': 'Omega-3', 'taken': true, 'time': '12:00'},
      {'id': 3, 'name': 'Proteína', 'taken': false, 'time': '15:00'},
      {'id': 4, 'name': 'Magnesio', 'taken': false, 'time': '20:00'},
    ];
    
    final goals = [
      {'id': 1, 'title': 'Calorías diarias', 'current': totalCalories.toDouble(), 'target': 2200.0, 'unit': 'kcal'},
      {'id': 2, 'title': 'Proteína diaria', 'current': totalProtein.toDouble(), 'target': 130.0, 'unit': 'g'},
      {'id': 3, 'title': 'Hidratación', 'current': dailyStats['water']!, 'target': dailyStats['targetWater']!, 'unit': 'L'},
      {'id': 4, 'title': 'Comidas completas', 'current': meals.where((m) => m['completed'] == true).length.toDouble(), 'target': meals.length.toDouble(), 'unit': 'comidas'},
    ];
    
    final achievements = [
      {'id': 1, 'title': 'Primer Día', 'description': 'Completaste tu primer día de seguimiento', 'icon': '🍎', 'unlocked': true},
      {'id': 2, 'title': 'Hidratado', 'description': 'Bebiste 2L+ de agua en un día', 'icon': '💧', 'unlocked': dailyStats['water']! >= 2.0},
      {'id': 3, 'title': 'Proteína Power', 'description': 'Alcanzaste tu meta de proteína', 'icon': '💪', 'unlocked': totalProtein >= 130},
      {'id': 4, 'title': 'Consistencia', 'description': '7 días seguidos registrando comidas', 'icon': '📅', 'unlocked': false},
    ];
    
    final unlockedAchievements = achievements.where((a) => a['unlocked'] == true).length;
    
    double getProgressPercentage(double current, double target) {
      if (target == 0) return 0;
      return ((current / target) * 100).clamp(0.0, 100.0);
    }
    
    Color getMacroColor(String macro) {
      switch (macro) {
        case 'protein':
          return Colors.red;
        case 'carbs':
          return Colors.orange;
        case 'fats':
          return Colors.pink;
        case 'calories':
          return Colors.green;
        default:
          return Colors.green;
      }
    }
    
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
                  Colors.green.withOpacity(0.2),
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant,
                ],
              ),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.local_dining, size: 24, color: Colors.green),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Seguidor de Nutrición',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Monitorea tu alimentación y macronutrientes',
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
          
          // Resumen de macronutrientes
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.local_fire_department,
                  title: 'Calorías',
                  value: '$totalCalories',
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.fitness_center,
                  title: 'Proteína',
                  value: '${totalProtein}g',
                  color: Colors.red,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.eco,
                  title: 'Carbohidratos',
                  value: '${totalCarbs}g',
                  color: Colors.orange,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.water_drop,
                  title: 'Grasas',
                  value: '${totalFats}g',
                  color: Colors.pink,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Progreso de hidratación
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.water_drop, color: Colors.green, size: 24),
                        const SizedBox(width: 8),
                        const Text(
                          'Hidratación',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                    Text(
                      '${getProgressPercentage((dailyStats['water'] as num).toDouble(), (dailyStats['targetWater'] as num).toDouble()).toStringAsFixed(0)}%',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.green,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  '${dailyStats['water']!.toStringAsFixed(1)}L / ${dailyStats['targetWater']}L',
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white70,
                  ),
                ),
                const SizedBox(height: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(
                    value: getProgressPercentage((dailyStats['water'] as num).toDouble(), (dailyStats['targetWater'] as num).toDouble()) / 100,
                    minHeight: 8,
                    backgroundColor: AppTheme.darkSurfaceVariant,
                    valueColor: const AlwaysStoppedAnimation<Color>(Colors.green),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Botón para agregar comida
          Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 16),
            child: ElevatedButton.icon(
              onPressed: () {
                setState(() {
                  _selectedNutritionDate = DateTime.now();
                });
                // TODO: Abrir modal para registrar comida
              },
              icon: const Icon(Icons.add_circle_outline, size: 20),
              label: const Text('Registrar Comida'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          
          // Seguimiento de comidas
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Comidas del Día',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '${meals.where((m) => m['completed'] == true).length}/${meals.length} completadas',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ...meals.map((meal) {
                  final isCompleted = meal['completed'] == true;
                  
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBackground,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isCompleted
                            ? Colors.green.withOpacity(0.3)
                            : AppTheme.darkSurfaceVariant,
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          isCompleted ? Icons.check_circle : Icons.radio_button_unchecked,
                          size: 20,
                          color: isCompleted ? Colors.green : AppTheme.white60,
                        ),
                        const SizedBox(width: 12),
                        Icon(meal['icon'] as IconData, size: 20, color: AppTheme.white70),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                meal['name'] as String,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                  color: isCompleted ? AppTheme.white : AppTheme.white70,
                                ),
                              ),
                              if (meal['calories'] as int > 0) ...[
                                const SizedBox(height: 4),
                                Text(
                                  '${meal['calories']} kcal',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: AppTheme.white60,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                        if (meal['calories'] as int > 0)
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: Colors.red.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  '${meal['protein']}g',
                                  style: const TextStyle(
                                    fontSize: 10,
                                    color: Colors.red,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 4),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: Colors.orange.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  '${meal['carbs']}g',
                                  style: const TextStyle(
                                    fontSize: 10,
                                    color: Colors.orange,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 4),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: Colors.pink.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  '${meal['fats']}g',
                                  style: const TextStyle(
                                    fontSize: 10,
                                    color: Colors.pink,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Suplementos
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Suplementos',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '${supplements.where((s) => s['taken'] == true).length}/${supplements.length} tomados',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: supplements.map((supplement) {
                    final isTaken = supplement['taken'] == true;
                    
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          // TODO: Toggle suplemento
                        });
                      },
                      child: Container(
                        width: (MediaQuery.of(context).size.width - 76) / 2,
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: isTaken
                              ? Colors.green.withOpacity(0.1)
                              : AppTheme.darkBackground,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isTaken
                                ? Colors.green.withOpacity(0.3)
                                : AppTheme.darkSurfaceVariant,
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              isTaken ? Icons.check_circle : Icons.radio_button_unchecked,
                              size: 16,
                              color: isTaken ? Colors.green : AppTheme.white60,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    supplement['name'] as String,
                                    style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: isTaken ? AppTheme.white : AppTheme.white70,
                                    ),
                                  ),
                                  Text(
                                    supplement['time'] as String,
                                    style: TextStyle(
                                      fontSize: 10,
                                      color: isTaken ? AppTheme.white60 : AppTheme.white40,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Objetivos nutricionales
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Objetivos del Día',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '${goals.where((g) => getProgressPercentage((g['current'] as num).toDouble(), (g['target'] as num).toDouble()) >= 100).length}/${goals.length} completados',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ...goals.map((goal) {
                  final progress = getProgressPercentage(
                    (goal['current'] as num).toDouble(),
                    (goal['target'] as num).toDouble(),
                  );
                  final isCompleted = progress >= 100;
                  
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBackground,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              goal['title'] as String,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.white,
                              ),
                            ),
                            Text(
                              '${goal['current']}/${goal['target']} ${goal['unit']}',
                              style: TextStyle(
                                fontSize: 12,
                                color: isCompleted ? Colors.green : AppTheme.white60,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(4),
                                child: LinearProgressIndicator(
                                  value: progress / 100,
                                  minHeight: 6,
                                  backgroundColor: AppTheme.darkSurfaceVariant,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                    isCompleted ? Colors.green : Colors.orange,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              '${progress.toStringAsFixed(0)}%',
                              style: TextStyle(
                                fontSize: 12,
                                color: isCompleted ? Colors.green : AppTheme.white60,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Logros
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Logros Nutricionales',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '$unlockedAchievements/${achievements.length} desbloqueados',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: achievements.map((achievement) {
                    final isUnlocked = achievement['unlocked'] == true;
                    return Container(
                      width: (MediaQuery.of(context).size.width - 64) / 2,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isUnlocked
                            ? Colors.green.withOpacity(0.1)
                            : AppTheme.darkSurfaceVariant,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isUnlocked
                              ? Colors.green.withOpacity(0.3)
                              : AppTheme.darkSurfaceVariant,
                        ),
                      ),
                      child: Column(
                        children: [
                          Text(
                            isUnlocked ? achievement['icon'] as String : '🔒',
                            style: const TextStyle(fontSize: 32),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            achievement['title'] as String,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: isUnlocked ? AppTheme.white : AppTheme.white60,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            achievement['description'] as String,
                            style: TextStyle(
                              fontSize: 11,
                              color: isUnlocked ? AppTheme.white70 : AppTheme.white40,
                            ),
                            textAlign: TextAlign.center,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWaterTracker() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'RASTREADOR DE AGUA',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.water_drop, size: 64, color: Colors.blue),
                const SizedBox(height: 24),
                Text(
                  '$_waterGlasses / 8',
                  style: const TextStyle(
                    fontSize: 48,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Vasos de agua hoy',
                  style: TextStyle(
                    fontSize: 18,
                    color: AppTheme.white70,
                  ),
                ),
                const SizedBox(height: 48),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.remove_circle_outline, size: 32, color: AppTheme.white),
                      onPressed: () {
                        if (_waterGlasses > 0) {
                          setState(() => _waterGlasses--);
                        }
                      },
                    ),
                    const SizedBox(width: 32),
                    IconButton(
                      icon: const Icon(Icons.add_circle_outline, size: 32, color: Colors.blue),
                      onPressed: () {
                        if (_waterGlasses < 8) {
                          setState(() => _waterGlasses++);
                        }
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
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

  // TODO: Implementar _buildMealPlanCard cuando se complete la estructura de datos
  // Widget _buildMealPlanCard(MealPlan mealPlan) {
  //   return Card(...);
  // }

  Widget _buildShoppingCategoryCard(String categoryId, String categoryName, String emoji, List<dynamic> items) {
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
                Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: AppTheme.darkSurfaceVariant,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Center(
                        child: Text(emoji, style: const TextStyle(fontSize: 20)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          categoryName,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.white,
                          ),
                        ),
                        Text(
                          '${items.length} artículos',
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppTheme.white60,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.add, color: AppTheme.white),
                  onPressed: () {},
                ),
              ],
            ),
            if (items.isEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 16),
                child: Center(
                  child: Column(
                    children: [
                      const Icon(Icons.shopping_basket_outlined, size: 32, color: AppTheme.white40),
                      const SizedBox(height: 8),
                      Text(
                        'No hay artículos en esta categoría',
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppTheme.white60,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecipeCard(Recipe recipe) {
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
                    recipe.name,
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
                    color: _getDifficultyColor(recipe.difficulty),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    recipe.difficulty,
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
            Row(
              children: [
                const Icon(Icons.local_fire_department, size: 16, color: Colors.orange),
                const SizedBox(width: 4),
                Text(
                  '${recipe.calories} cal',
                  style: const TextStyle(fontSize: 14, color: AppTheme.white70),
                ),
                const SizedBox(width: 16),
                const Icon(Icons.star, size: 16, color: Colors.amber),
                const SizedBox(width: 4),
                Text(
                  recipe.rating.toStringAsFixed(1),
                  style: const TextStyle(fontSize: 14, color: AppTheme.white70),
                ),
                const SizedBox(width: 16),
                const Icon(Icons.access_time, size: 16, color: AppTheme.white60),
                const SizedBox(width: 4),
                Text(
                  recipe.prepTime,
                  style: const TextStyle(fontSize: 14, color: AppTheme.white70),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGymRoutineCard(GymRoutine routine) {
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
                    routine.name,
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
                    color: _getDifficultyColor(routine.difficulty),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    routine.difficulty,
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
            Text(
              'Duración: ${routine.duration}',
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.orangeAccent,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSportsGoalCard(SportsGoal goal) {
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
                    goal.sport,
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
                    color: AppTheme.darkSurfaceVariant,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _formatDate(goal.targetDate),
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.white70,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              goal.objective,
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.white70,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMeasurementCard(BodyMeasurement measurement) {
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  measurement.name,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _formatDate(measurement.date),
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white60,
                  ),
                ),
              ],
            ),
            Text(
              measurement.value,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: AppTheme.orangeAccent,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getDifficultyColor(String difficulty) {
    switch (difficulty) {
      case 'Fácil':
      case 'Principiante':
        return Colors.green;
      case 'Intermedio':
        return Colors.orange;
      case 'Difícil':
      case 'Avanzado':
        return Colors.red;
      default:
        return AppTheme.orangeAccent;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}

