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
import '../../services/health_service.dart';
import '../common/navigation_header.dart';

class HealthSections extends StatefulWidget {
  const HealthSections({super.key});

  @override
  State<HealthSections> createState() => _HealthSectionsState();
}

class _HealthSectionsState extends State<HealthSections> {
  String _activeSection = 'meal-planner';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final HealthService _healthService = HealthService();
  
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
  final TextEditingController _itemNameController = TextEditingController();
  final TextEditingController _itemQuantityController = TextEditingController();
  final TextEditingController _itemUnitController = TextEditingController();
  final TextEditingController _newCategoryNameController = TextEditingController();
  final TextEditingController _newCategoryIconController = TextEditingController();
  bool _showAddCategoryModal = false;
  
  // Controladores para agregar comida
  final TextEditingController _mealNameController = TextEditingController();
  final TextEditingController _mealTimeController = TextEditingController();
  String? _selectedMealType; // 'breakfast', 'lunch', 'dinner'
  TimeOfDay? _selectedMealTime;
  Recipe? _selectedRecipe;
  String? _selectedRecipeId; // ID de la receta seleccionada para el dropdown
  
  // Controladores para agregar receta
  final TextEditingController _recipeNameController = TextEditingController();
  final TextEditingController _recipeCategoryController = TextEditingController();
  final TextEditingController _recipeDifficultyController = TextEditingController();
  final TextEditingController _recipePrepTimeController = TextEditingController();
  final TextEditingController _recipeServingsController = TextEditingController();
  final TextEditingController _recipeCaloriesController = TextEditingController();
  final TextEditingController _recipeIngredientsController = TextEditingController();
  final TextEditingController _recipeInstructionsController = TextEditingController();
  final TextEditingController _recipeTagsController = TextEditingController();
  String _selectedRecipeDifficulty = 'Fácil';
  
  // Estados para recetas
  List<Recipe> _recipes = [];
  Set<String> _favoriteRecipes = {}; // IDs de recetas favoritas
  
  // Estados para rutinas de gimnasio
  List<GymRoutine> _gymRoutines = [];
  
  // Controladores para rutinas de gimnasio
  final TextEditingController _gymRoutineNameController = TextEditingController();
  final TextEditingController _gymRoutineDescriptionController = TextEditingController();
  final TextEditingController _gymRoutineDurationController = TextEditingController();
  String _selectedGymRoutineDifficulty = 'Principiante';
  GymRoutine? _editingGymRoutine; // Para editar rutina existente
  bool _gymRoutineIsRecurring = false;
  String? _gymRoutineRecurrenceType; // 'daily', 'weekly', 'monthly'
  List<int> _gymRoutineRecurrenceDays = []; // Para weekly: [1,3,5] = lunes, miércoles, viernes
  DateTime? _gymRoutineStartDate;
  DateTime? _gymRoutineEndDate;
  
  // Controladores para entrenamientos
  final TextEditingController _workoutNameController = TextEditingController();
  final TextEditingController _workoutDurationController = TextEditingController();
  final TextEditingController _workoutCaloriesController = TextEditingController();
  DateTime _selectedWorkoutDate = DateTime.now();
  String? _selectedWorkoutRoutineId; // ID de rutina seleccionada
  bool _workoutIsRecurring = false;
  String? _workoutRecurrenceType; // 'daily', 'weekly', 'monthly'
  List<int> _workoutRecurrenceDays = [];
  DateTime? _workoutStartDate;
  DateTime? _workoutEndDate;
  
  // Controladores para actividad de fitness
  final TextEditingController _fitnessStepsController = TextEditingController();
  final TextEditingController _fitnessCaloriesController = TextEditingController();
  final TextEditingController _fitnessWaterController = TextEditingController();
  bool _fitnessHasWorkout = false;
  
  // Controladores para objetivos deportivos
  final TextEditingController _sportsGoalSportController = TextEditingController();
  final TextEditingController _sportsGoalObjectiveController = TextEditingController();
  final TextEditingController _sportsGoalProgressController = TextEditingController();
  final TextEditingController _sportsGoalNotesController = TextEditingController();
  DateTime? _sportsGoalTargetDate;
  SportsGoal? _editingSportsGoal; // Para editar objetivo existente
  
  // Estados para completar entrenamientos y rutinas
  Set<String> _completedRoutines = {}; // IDs de rutinas completadas
  Set<String> _completedWorkouts = {}; // IDs de entrenamientos completados
  
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
  Map<String, dynamic> _currentWeekWorkouts = {}; // Permite almacenar tanto días como _weekStart
  
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
    {'id': 'recipes', 'name': 'Recetas', 'icon': Icons.menu_book},
    {'id': 'gym-routine', 'name': 'Entrenamientos', 'icon': Icons.fitness_center},
    {'id': 'sports-goals', 'name': 'Fitness y Objetivos', 'icon': Icons.track_changes},
    {'id': 'body-measurements', 'name': 'Seguimiento de Salud', 'icon': Icons.health_and_safety},
    {'id': 'nutrition-tracker', 'name': 'Seguidor de Nutrición', 'icon': Icons.local_dining},
  ];

  List<Map<String, dynamic>> mealCategories = [
    {'id': 'fruits', 'name': 'Frutas', 'icon': '🍎'},
    {'id': 'vegetables', 'name': 'Verduras', 'icon': '🥬'},
    {'id': 'dairy', 'name': 'Lácteos', 'icon': '🥛'},
    {'id': 'meat', 'name': 'Carnes', 'icon': '🥩'},
    {'id': 'grains', 'name': 'Granos', 'icon': '🌾'},
    {'id': 'snacks', 'name': 'Snacks', 'icon': '🍿'},
  ];

  @override
  void initState() {
    super.initState();
    _loadHealthData();
  }

  Future<void> _loadHealthData() async {
    try {
      // Cargar planes de comidas
      final mealPlans = await _healthService.getAllMealPlans();
      if (mounted) {
        setState(() {
          _mealPlans = mealPlans;
        });
      }

      // Cargar lista de compras
      final shoppingList = await _healthService.getShoppingList();
      if (shoppingList != null && mounted) {
        setState(() {
          _marketList = shoppingList;
        });
      }

      // Cargar recetas
      final recipesData = await _healthService.getRecipes();
      if (mounted) {
        setState(() {
          _recipes = recipesData.map((data) => Recipe(
            id: data['id'] ?? '',
            name: data['name'] ?? '',
            category: data['category'] ?? '',
            difficulty: data['difficulty'] ?? '',
            prepTime: data['prep_time'] ?? '',
            servings: data['servings'] ?? 0,
            calories: data['calories'] ?? 0,
            rating: (data['rating'] ?? 0.0).toDouble(),
            ingredients: data['ingredients'] ?? '',
            instructions: data['instructions'] ?? '',
            tags: List<String>.from(data['tags'] ?? []),
          )).toList();
        });
      }

      // Cargar rutinas de gimnasio
      final routinesData = await _healthService.getGymRoutines();
      if (mounted) {
        setState(() {
          _gymRoutines = routinesData.map((data) => GymRoutine.fromJson(data)).toList();
        });
      }

      // Cargar entrenamientos
      final workoutsData = await _healthService.getWorkouts();
      if (mounted) {
        setState(() {
          _workouts = workoutsData;
        });
      }
    } catch (e) {
      print('HealthSections: Error cargando datos: $e');
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_showAddGymModal) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _showAddGymRoutineModal();
      });
    }
    if (_showAddWorkoutModal) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _showAddWorkoutModalDialog();
      });
    }
    if (_showAddSportsModal) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _showAddSportsGoalModal();
      });
    }
  }

  @override
  void dispose() {
    _itemNameController.dispose();
    _itemQuantityController.dispose();
    _itemUnitController.dispose();
    _newCategoryNameController.dispose();
    _newCategoryIconController.dispose();
    _mealNameController.dispose();
    _mealTimeController.dispose();
    _recipeNameController.dispose();
    _recipeCategoryController.dispose();
    _recipeDifficultyController.dispose();
    _recipePrepTimeController.dispose();
    _recipeServingsController.dispose();
    _recipeCaloriesController.dispose();
    _recipeIngredientsController.dispose();
    _recipeTagsController.dispose();
    _gymRoutineNameController.dispose();
    _gymRoutineDescriptionController.dispose();
    _gymRoutineDurationController.dispose();
    _workoutNameController.dispose();
    _workoutDurationController.dispose();
    _workoutCaloriesController.dispose();
    _fitnessStepsController.dispose();
    _fitnessCaloriesController.dispose();
    _fitnessWaterController.dispose();
    _sportsGoalSportController.dispose();
    _sportsGoalObjectiveController.dispose();
    _sportsGoalProgressController.dispose();
    _sportsGoalNotesController.dispose();
    super.dispose();
  }

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
      floatingActionButton: _buildFloatingActionButton(),
    );
  }
  

  Widget? _buildFloatingActionButton() {
    // No mostrar FloatingActionButton en meal-planner
    return null;
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
      case 'recipes':
        return _buildRecipes();
      case 'gym-routine':
        return _buildGymRoutine();
      case 'sports-goals':
      case 'fitness-tracker':
        return _buildFitnessAndGoals();
      case 'body-measurements':
      case 'weight-loss':
        return _buildHealthTracking();
      case 'nutrition-tracker':
        return _buildNutritionTracker();
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
    ].where((meal) {
      if (meal == null) return false;
      if (meal is Map) {
        return meal['name'] != null && meal['name'].toString().isNotEmpty;
      }
      return meal.toString().isNotEmpty;
    }).length;
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
                  _getMealDisplayText(todayMealPlan['breakfast']),
                  Colors.orange,
                  onAdd: () {
                    setState(() {
                      _selectedMealType = 'breakfast';
                      _mealNameController.clear();
                      _mealTimeController.clear();
                      _selectedMealTime = null;
                      _selectedRecipe = null;
                      _selectedRecipeId = null;
                    });
                    _showAddMealDialog();
                  },
                  onEdit: () {
                    setState(() {
                      _selectedMealType = 'breakfast';
                      final mealData = todayMealPlan['breakfast'];
                      if (mealData is Map) {
                        _mealNameController.text = mealData['name'] ?? '';
                        _mealTimeController.text = mealData['time'] ?? '';
                        // Intentar parsear la hora si existe
                        if (mealData['time'] != null && mealData['time'].toString().isNotEmpty) {
                          _parseTimeToTimeOfDay(mealData['time'].toString());
                        } else {
                          _selectedMealTime = null;
                        }
                        // Buscar receta si existe
                        final foundRecipe = _findRecipeByName(mealData['name'] ?? '');
                        _selectedRecipe = foundRecipe;
                        _selectedRecipeId = foundRecipe?.id;
                      } else {
                        _mealNameController.clear();
                        _mealTimeController.clear();
                        _selectedMealTime = null;
                        _selectedRecipe = null;
                        _selectedRecipeId = null;
                      }
                    });
                    _showAddMealDialog();
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
                  _getMealDisplayText(todayMealPlan['lunch']),
                  Colors.orange,
                  onAdd: () {
                    setState(() {
                      _selectedMealType = 'lunch';
                      _mealNameController.clear();
                      _mealTimeController.clear();
                      _selectedMealTime = null;
                      _selectedRecipe = null;
                      _selectedRecipeId = null;
                    });
                    _showAddMealDialog();
                  },
                  onEdit: () {
                    setState(() {
                      _selectedMealType = 'lunch';
                      final mealData = todayMealPlan['lunch'];
                      if (mealData is Map) {
                        _mealNameController.text = mealData['name'] ?? '';
                        _mealTimeController.text = mealData['time'] ?? '';
                        // Intentar parsear la hora si existe
                        if (mealData['time'] != null && mealData['time'].toString().isNotEmpty) {
                          _parseTimeToTimeOfDay(mealData['time'].toString());
                        } else {
                          _selectedMealTime = null;
                        }
                        // Buscar receta si existe
                        final foundRecipe = _findRecipeByName(mealData['name'] ?? '');
                        _selectedRecipe = foundRecipe;
                        _selectedRecipeId = foundRecipe?.id;
                      } else {
                        _mealNameController.clear();
                        _mealTimeController.clear();
                        _selectedMealTime = null;
                        _selectedRecipe = null;
                        _selectedRecipeId = null;
                      }
                    });
                    _showAddMealDialog();
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
                  _getMealDisplayText(todayMealPlan['dinner']),
                  Colors.purple,
                  onAdd: () {
                    setState(() {
                      _selectedMealType = 'dinner';
                      _mealNameController.clear();
                      _mealTimeController.clear();
                      _selectedMealTime = null;
                      _selectedRecipe = null;
                      _selectedRecipeId = null;
                    });
                    _showAddMealDialog();
                  },
                  onEdit: () {
                    setState(() {
                      _selectedMealType = 'dinner';
                      final mealData = todayMealPlan['dinner'];
                      if (mealData is Map) {
                        _mealNameController.text = mealData['name'] ?? '';
                        _mealTimeController.text = mealData['time'] ?? '';
                        // Intentar parsear la hora si existe
                        if (mealData['time'] != null && mealData['time'].toString().isNotEmpty) {
                          _parseTimeToTimeOfDay(mealData['time'].toString());
                        } else {
                          _selectedMealTime = null;
                        }
                        // Buscar receta si existe
                        final foundRecipe = _findRecipeByName(mealData['name'] ?? '');
                        _selectedRecipe = foundRecipe;
                        _selectedRecipeId = foundRecipe?.id;
                      } else {
                        _mealNameController.clear();
                        _mealTimeController.clear();
                        _selectedMealTime = null;
                        _selectedRecipe = null;
                        _selectedRecipeId = null;
                      }
                    });
                    _showAddMealDialog();
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
                LayoutBuilder(
                  builder: (context, constraints) {
                    // Calcular el ancho disponible: ancho del contenedor - padding (16*2) - spacing entre elementos (3 espacios de 6)
                    final availableWidth = constraints.maxWidth;
                    final spacing = 6.0;
                    final spacingTotal = spacing * 3; // 3 espacios entre 4 elementos
                    final itemWidth = (availableWidth - spacingTotal) / 4;
                    
                    return Wrap(
                      spacing: spacing,
                      runSpacing: spacing,
                      alignment: WrapAlignment.start,
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
                          child: SizedBox(
                            width: itemWidth,
                            height: 50,
                            child: Container(
                              decoration: BoxDecoration(
                                color: isFilled
                                    ? Colors.blue.withOpacity(0.2)
                                    : AppTheme.darkBackground,
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(
                                  color: isFilled
                                      ? Colors.blue
                                      : AppTheme.darkSurfaceVariant,
                                  width: 1.5,
                                ),
                              ),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.water_drop,
                                    size: 16,
                                    color: isFilled ? Colors.blue : AppTheme.white60,
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${index + 1}',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: isFilled ? Colors.blue : AppTheme.white60,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }),
                    );
                  },
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

  Recipe? _findRecipeByName(String name) {
    if (name.isEmpty) return null;
    final allRecipes = _recipes.isNotEmpty 
        ? _recipes 
        : [
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
          ];
    
    try {
      return allRecipes.firstWhere(
        (recipe) => recipe.name.toLowerCase() == name.toLowerCase(),
      );
    } catch (e) {
      return null;
    }
  }

  void _parseTimeToTimeOfDay(String timeString) {
    try {
      // Intentar parsear formatos como "08:00 AM", "8:00 AM", "20:00", etc.
      final regex = RegExp(r'(\d{1,2}):(\d{2})\s*(AM|PM)?', caseSensitive: false);
      final match = regex.firstMatch(timeString);
      if (match != null) {
        var hour = int.parse(match.group(1)!);
        final minute = int.parse(match.group(2)!);
        final period = match.group(3);
        
        if (period != null) {
          if (period.toUpperCase() == 'PM' && hour != 12) {
            hour += 12;
          } else if (period.toUpperCase() == 'AM' && hour == 12) {
            hour = 0;
          }
        } else if (hour >= 12) {
          // Si no hay periodo pero la hora es >= 12, asumir formato 24h
        }
        
        _selectedMealTime = TimeOfDay(hour: hour, minute: minute);
      }
    } catch (e) {
      _selectedMealTime = null;
    }
  }

  String _getMealDisplayText(dynamic mealData) {
    if (mealData == null) return '';
    if (mealData is Map) {
      final name = mealData['name'] ?? '';
      final time = mealData['time'] ?? '';
      if (time.isNotEmpty) {
        return '$name - $time';
      }
      return name;
    }
    return mealData.toString();
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
                ElevatedButton.icon(
                  onPressed: onAdd,
                  icon: const Icon(Icons.add, size: 16),
                  label: const Text('Agregar'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: AppTheme.white,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    minimumSize: Size.zero,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
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
                            _itemNameController.clear();
                            _itemQuantityController.text = '1';
                            _itemUnitController.text = 'unidad';
                          });
                          _showAddItemDialog();
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
          
          // Botón para agregar nueva categoría
          Container(
            margin: const EdgeInsets.only(top: 8, bottom: 16),
            child: ElevatedButton.icon(
              onPressed: () {
                setState(() {
                  _newCategoryNameController.clear();
                  _newCategoryIconController.clear();
                  _showAddCategoryModal = true;
                });
                _showAddCategoryDialog();
              },
              icon: const Icon(Icons.add_circle_outline),
              label: const Text('Agregar Nueva Categoría'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green.withOpacity(0.2),
                foregroundColor: Colors.green,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: Colors.green.withOpacity(0.5)),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showAddItemDialog() {
    showDialog(
      context: context,
      builder: (context) => _buildAddItemModal(),
    );
  }

  void _showAddCategoryDialog() {
    showDialog(
      context: context,
      builder: (context) => _buildAddCategoryModal(),
    );
  }

  void _showAddMealDialog() async {
    try {
      print('HealthSections: Abriendo modal de agregar comida');
      // Asegurar que _selectedRecipeId sea null o un ID válido antes de abrir el modal
      if (_selectedRecipeId != null) {
        final allRecipes = _recipes.isNotEmpty ? _recipes : [
          Recipe(id: '1', name: 'Ensalada César Saludable', category: 'Ensaladas', difficulty: 'Fácil', prepTime: '15 min', servings: 4, calories: 320, rating: 4.5, ingredients: '', instructions: '', tags: const []),
          Recipe(id: '2', name: 'Salmón a la Plancha con Vegetales', category: 'Pescados', difficulty: 'Intermedio', prepTime: '25 min', servings: 2, calories: 450, rating: 4.8, ingredients: '', instructions: '', tags: const []),
          Recipe(id: '3', name: 'Bowl de Quinoa y Aguacate', category: 'Bowls', difficulty: 'Fácil', prepTime: '20 min', servings: 2, calories: 380, rating: 4.3, ingredients: '', instructions: '', tags: const []),
        ];
        final recipeExists = allRecipes.any((r) => r.id == _selectedRecipeId);
        if (!recipeExists) {
          print('HealthSections: Limpiando _selectedRecipeId porque no existe en la lista');
          setState(() {
            _selectedRecipeId = null;
            _selectedRecipe = null;
          });
        }
      }
      
      final result = await showDialog<Map<String, dynamic>>(
        context: context,
        barrierDismissible: true,
        builder: (BuildContext dialogContext) {
          return StatefulBuilder(
            builder: (context, setModalState) {
              return Dialog(
              backgroundColor: Colors.transparent,
              child: Container(
                constraints: const BoxConstraints(maxWidth: 400, maxHeight: 600),
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
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Header
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Colors.green, Colors.green.shade700],
                        ),
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(28),
                          topRight: Radius.circular(28),
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.restaurant, color: AppTheme.white, size: 28),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Text(
                              _selectedMealType == 'breakfast' 
                                  ? 'Agregar Desayuno'
                                  : _selectedMealType == 'lunch'
                                      ? 'Agregar Comida'
                                      : 'Agregar Cena',
                              style: const TextStyle(
                                color: AppTheme.white,
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          IconButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            icon: const Icon(Icons.close, color: AppTheme.white),
                          ),
                        ],
                      ),
                    ),
                    // Contenido
                    Flexible(
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(maxHeight: 500),
                        child: SingleChildScrollView(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                      // Selector de recetas
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.orange.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.orange.withOpacity(0.3)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.menu_book, color: Colors.orange, size: 20),
                            const SizedBox(width: 8),
                            const Text(
                              'Seleccionar Receta',
                              style: TextStyle(
                                color: Colors.orange,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      _buildRecipeSelector(setModalState),
                      const SizedBox(height: 16),
                      const Divider(color: AppTheme.white40),
                      const SizedBox(height: 16),
                      const Text(
                        'Nombre de la comida:',
                        style: TextStyle(
                          color: AppTheme.white60,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _mealNameController,
                        decoration: InputDecoration(
                          labelText: 'Nombre de la comida *',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.restaurant_menu, color: Colors.green),
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
                    GestureDetector(
                      onTap: () async {
                        final TimeOfDay? picked = await showTimePicker(
                          context: context,
                          initialTime: _selectedMealTime ?? TimeOfDay.now(),
                          builder: (context, child) {
                            return Theme(
                              data: Theme.of(context).copyWith(
                                colorScheme: const ColorScheme.dark(
                                  primary: Colors.green,
                                  onPrimary: AppTheme.white,
                                  surface: AppTheme.darkSurface,
                                  onSurface: AppTheme.white,
                                ),
                                timePickerTheme: TimePickerThemeData(
                                  backgroundColor: AppTheme.darkSurface,
                                  hourMinuteShape: const RoundedRectangleBorder(
                                    borderRadius: BorderRadius.all(Radius.circular(8)),
                                  ),
                                ),
                              ),
                              child: child!,
                            );
                          },
                        );
                        if (picked != null) {
                          setModalState(() {
                            _selectedMealTime = picked;
                            final hour = picked.hour;
                            final minute = picked.minute;
                            final period = hour >= 12 ? 'PM' : 'AM';
                            final displayHour = hour > 12 ? hour - 12 : (hour == 0 ? 12 : hour);
                            _mealTimeController.text = '${displayHour.toString().padLeft(2, '0')}:${minute.toString().padLeft(2, '0')} $period';
                          });
                        }
                      },
                      child: AbsorbPointer(
                        child: TextField(
                          controller: _mealTimeController,
                          decoration: InputDecoration(
                            labelText: 'Hora estimada',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            hintText: 'Toca para seleccionar hora',
                            hintStyle: const TextStyle(color: AppTheme.white40),
                            prefixIcon: const Icon(Icons.access_time, color: Colors.green),
                            suffixIcon: const Icon(Icons.schedule, color: Colors.green),
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
                      ),
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () {
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
                            try {
                              print('HealthSections: Botón Agregar presionado');
                              print('HealthSections: Nombre: ${_mealNameController.text.trim()}');
                              print('HealthSections: Tipo: $_selectedMealType');
                              
                              if (_mealNameController.text.trim().isNotEmpty && _selectedMealType != null) {
                                // Guardar los datos y retornarlos
                                final mealName = _mealNameController.text.trim();
                                final mealTime = _mealTimeController.text.trim().isNotEmpty 
                                    ? _mealTimeController.text.trim() 
                                    : null;
                                final mealType = _selectedMealType!;
                                
                                print('HealthSections: Datos preparados - Tipo: $mealType, Nombre: $mealName, Hora: $mealTime');
                                
                                // Limpiar controles y estado
                                _mealNameController.clear();
                                _mealTimeController.clear();
                              _selectedMealTime = null;
                              _selectedRecipe = null;
                              _selectedRecipeId = null;
                              _selectedMealType = null;
                                
                                // Cerrar el modal y retornar los datos
                                print('HealthSections: Cerrando modal y retornando datos');
                                Navigator.pop(context, {
                                  'type': mealType,
                                  'name': mealName,
                                  'time': mealTime,
                                });
                              } else {
                                print('HealthSections: Validación fallida - nombre vacío o tipo nulo');
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Por favor ingresa el nombre de la comida'),
                                    backgroundColor: Colors.red,
                                  ),
                                );
                              }
                            } catch (e, stackTrace) {
                              print('HealthSections: Error en onPressed del botón Agregar: $e');
                              print('HealthSections: StackTrace: $stackTrace');
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Error: ${e.toString()}'),
                                  backgroundColor: Colors.red,
                                ),
                              );
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text(
                            'Agregar',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
    
      // Procesar el resultado después de cerrar el modal
          print('HealthSections: Modal cerrado, resultado: $result');
      if (result != null && mounted) {
        try {
          print('HealthSections: Procesando resultado - Tipo: ${result['type']}, Nombre: ${result['name']}');
          final dateKey = DateFormat('yyyy-MM-dd').format(DateTime.now());
          print('HealthSections: Clave de fecha: $dateKey');
          
          setState(() {
            if (!_mealPlans.containsKey(dateKey)) {
              _mealPlans[dateKey] = {};
            }
            _mealPlans[dateKey]![result['type']] = {
              'name': result['name'],
              'time': result['time'],
            };
            print('HealthSections: Comida guardada en _mealPlans');
          });

          // Guardar en Supabase
          final mealPlanData = {
            'breakfast': _mealPlans[dateKey]?['breakfast'],
            'lunch': _mealPlans[dateKey]?['lunch'],
            'dinner': _mealPlans[dateKey]?['dinner'],
            'waterGlasses': _mealPlans[dateKey]?['waterGlasses'] ?? 0,
          };
          
          final saveResult = await _healthService.saveMealPlan(dateKey, mealPlanData);
          if (saveResult['success'] == true) {
            print('HealthSections: Plan de comidas guardado en Supabase');
          } else {
            print('HealthSections: Error guardando en Supabase: ${saveResult['error']}');
          }

          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Comida agregada exitosamente'),
              backgroundColor: Colors.green,
            ),
          );
          print('HealthSections: SnackBar mostrado');
        } catch (e, stackTrace) {
          print('HealthSections: Error al procesar resultado: $e');
          print('HealthSections: StackTrace: $stackTrace');
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Error al guardar: ${e.toString()}'),
              backgroundColor: Colors.red,
            ),
          );
        }
      } else {
        print('HealthSections: Resultado nulo o widget no montado');
      }
    } catch (e, stackTrace) {
      print('HealthSections: Error en _showAddMealDialog: $e');
      print('HealthSections: StackTrace: $stackTrace');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error al abrir modal: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Widget _buildRecipeSelector(StateSetter setModalState) {
    // Obtener recetas disponibles (de _recipes o sampleRecipes)
    final availableRecipes = _recipes.isNotEmpty 
        ? _recipes 
        : [
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
          ];
    
    // Verificar que el ID seleccionado existe en las recetas disponibles
    // IMPORTANTE: Siempre usar String? y verificar que el ID existe en la lista
    String? validSelectedId;
    if (_selectedRecipeId != null && _selectedRecipeId!.isNotEmpty) {
      final matchingRecipes = availableRecipes.where((r) => r.id == _selectedRecipeId).toList();
      if (matchingRecipes.length == 1) {
        // Verificar que el ID coincide exactamente
        final recipe = matchingRecipes.first;
        if (recipe.id == _selectedRecipeId) {
          validSelectedId = _selectedRecipeId;
        } else {
          validSelectedId = null;
        }
      } else {
        // Si no hay coincidencia exacta o hay múltiples, limpiar la selección
        validSelectedId = null;
        print('HealthSections: ID de receta no válido: $_selectedRecipeId. Coincidencias: ${matchingRecipes.length}');
        // Limpiar la selección en el estado del modal
        setModalState(() {
          _selectedRecipeId = null;
          _selectedRecipe = null;
        });
      }
    } else {
      validSelectedId = null;
    }

    if (availableRecipes.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.darkBackground.withOpacity(0.5),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.orange.withOpacity(0.2)),
        ),
        child: const Row(
          children: [
            Icon(Icons.info_outline, color: Colors.orange, size: 20),
            SizedBox(width: 12),
            Expanded(
              child: Text(
                'No hay recetas guardadas. Ve a la sección "Recetas" para agregar recetas.',
                style: TextStyle(
                  color: AppTheme.white60,
                  fontSize: 12,
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Container(
      decoration: BoxDecoration(
        color: AppTheme.darkBackground.withOpacity(0.5),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.orange.withOpacity(0.3)),
      ),
      child: DropdownButtonFormField<String>(
        value: validSelectedId,
        decoration: InputDecoration(
          labelText: 'Seleccionar receta',
          labelStyle: const TextStyle(color: AppTheme.white70),
          prefixIcon: const Icon(Icons.menu_book, color: Colors.orange),
          filled: true,
          fillColor: Colors.transparent,
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
        dropdownColor: AppTheme.darkSurface,
        style: const TextStyle(color: AppTheme.white),
        icon: const Icon(Icons.arrow_drop_down, color: Colors.orange),
        items: availableRecipes.map((recipe) {
          return DropdownMenuItem<String>(
            value: recipe.id,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: Colors.orange.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Icon(Icons.restaurant, color: Colors.orange, size: 16),
                ),
                const SizedBox(width: 8),
                Flexible(
                  child: Text(
                    recipe.name,
                    style: const TextStyle(
                      color: AppTheme.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  ),
                ),
              ],
            ),
          );
        }).toList(),
        onChanged: (String? recipeId) {
          setModalState(() {
            _selectedRecipeId = recipeId;
            if (recipeId != null) {
              try {
                final recipe = availableRecipes.firstWhere((r) => r.id == recipeId);
                _selectedRecipe = recipe;
                // Solo pre-llenar si el campo está vacío
                if (_mealNameController.text.trim().isEmpty) {
                  _mealNameController.text = recipe.name;
                }
              } catch (e) {
                print('HealthSections: Error al encontrar receta con ID $recipeId: $e');
                _selectedRecipe = null;
                _selectedRecipeId = null;
              }
            } else {
              _selectedRecipe = null;
              _selectedRecipeId = null;
            }
            // No limpiar el campo si se deselecciona la receta, permitir edición manual
          });
        },
      ),
    );
  }

  Widget _buildAddItemModal() {
    return StatefulBuilder(
      builder: (context, setModalState) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 400),
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
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.green, Colors.green.shade700],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(28),
                    topRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.add_shopping_cart, color: AppTheme.white, size: 28),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Text(
                        'Agregar Artículo',
                        style: TextStyle(
                          color: AppTheme.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      icon: const Icon(Icons.close, color: AppTheme.white),
                    ),
                  ],
                ),
              ),
              // Contenido
              Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextField(
                      controller: _itemNameController,
                      decoration: InputDecoration(
                        labelText: 'Nombre del artículo *',
                        labelStyle: const TextStyle(color: AppTheme.white70),
                        prefixIcon: const Icon(Icons.shopping_bag, color: Colors.green),
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
                    Row(
                      children: [
                        Expanded(
                          flex: 2,
                          child: TextField(
                            controller: _itemQuantityController,
                            decoration: InputDecoration(
                              labelText: 'Cantidad',
                              labelStyle: const TextStyle(color: AppTheme.white70),
                              prefixIcon: const Icon(Icons.numbers, color: Colors.green),
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
                            keyboardType: TextInputType.number,
                            style: const TextStyle(color: AppTheme.white),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          flex: 3,
                          child: TextField(
                            controller: _itemUnitController,
                            decoration: InputDecoration(
                              labelText: 'Unidad',
                              labelStyle: const TextStyle(color: AppTheme.white70),
                              prefixIcon: const Icon(Icons.straighten, color: Colors.green),
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
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () {
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
                            if (_itemNameController.text.isNotEmpty) {
                              setState(() {
                                final quantity = _itemQuantityController.text.isNotEmpty 
                                    ? _itemQuantityController.text 
                                    : '1';
                                final unit = _itemUnitController.text.isNotEmpty 
                                    ? _itemUnitController.text 
                                    : 'unidad';
                                final quantityText = '$quantity $unit';
                                
                                if (!_marketList.containsKey(_selectedCategory)) {
                                  _marketList[_selectedCategory] = [];
                                }
                                
                                _marketList[_selectedCategory]!.add({
                                  'id': DateTime.now().millisecondsSinceEpoch.toString(),
                                  'name': _itemNameController.text,
                                  'quantity': quantityText,
                                  'purchased': false,
                                });
                                
                                _itemNameController.clear();
                                _itemQuantityController.text = '1';
                                _itemUnitController.text = 'unidad';
                                
                                // Guardar en Supabase
                                _healthService.saveShoppingList(_marketList).then((result) {
                                  if (result['success'] == true) {
                                    print('HealthSections: Lista de compras guardada en Supabase');
                                  } else {
                                    print('HealthSections: Error guardando lista de compras: ${result['error']}');
                                  }
                                });
                              });
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Artículo agregado exitosamente'),
                                  backgroundColor: Colors.green,
                                ),
                              );
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Por favor ingresa el nombre del artículo'),
                                  backgroundColor: Colors.red,
                                ),
                              );
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text(
                            'Agregar',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
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
      ),
    );
  }

  Widget _buildAddCategoryModal() {
    return StatefulBuilder(
      builder: (context, setModalState) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 400),
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
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.green, Colors.green.shade700],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(28),
                    topRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.category, color: AppTheme.white, size: 28),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Text(
                        'Nueva Categoría',
                        style: TextStyle(
                          color: AppTheme.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      icon: const Icon(Icons.close, color: AppTheme.white),
                    ),
                  ],
                ),
              ),
              // Contenido
              Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextField(
                      controller: _newCategoryNameController,
                      decoration: InputDecoration(
                        labelText: 'Nombre de la categoría *',
                        labelStyle: const TextStyle(color: AppTheme.white70),
                        prefixIcon: const Icon(Icons.label, color: Colors.green),
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
                      controller: _newCategoryIconController,
                      decoration: InputDecoration(
                        labelText: 'Icono (emoji) *',
                        labelStyle: const TextStyle(color: AppTheme.white70),
                        hintText: '🍎',
                        hintStyle: const TextStyle(color: AppTheme.white40, fontSize: 24),
                        prefixIcon: const Icon(Icons.emoji_emotions, color: Colors.green),
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
                      style: const TextStyle(color: AppTheme.white, fontSize: 24),
                      maxLength: 2,
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () {
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
                            if (_newCategoryNameController.text.isNotEmpty && 
                                _newCategoryIconController.text.isNotEmpty) {
                              setState(() {
                                final newCategoryId = _newCategoryNameController.text.toLowerCase().replaceAll(' ', '_');
                                mealCategories.add({
                                  'id': newCategoryId,
                                  'name': _newCategoryNameController.text,
                                  'icon': _newCategoryIconController.text,
                                });
                                
                                // Inicializar la lista vacía para la nueva categoría
                                _marketList[newCategoryId] = [];
                                
                                _newCategoryNameController.clear();
                                _newCategoryIconController.clear();
                                
                                // Guardar en Supabase
                                _healthService.saveShoppingList(_marketList).then((result) {
                                  if (result['success'] == true) {
                                    print('HealthSections: Lista de compras guardada en Supabase');
                                  } else {
                                    print('HealthSections: Error guardando lista de compras: ${result['error']}');
                                  }
                                });
                              });
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Categoría agregada exitosamente'),
                                  backgroundColor: Colors.green,
                                ),
                              );
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Por favor completa todos los campos'),
                                  backgroundColor: Colors.red,
                                ),
                              );
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text(
                            'Agregar',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
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
                _showAddRecipeDialog();
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

  void _showAddRecipeDialog() {
    // Limpiar controladores
    _recipeNameController.clear();
    _recipeCategoryController.clear();
    _recipeDifficultyController.text = 'Fácil';
    _recipePrepTimeController.clear();
    _recipeServingsController.text = '2';
    _recipeCaloriesController.clear();
    _recipeIngredientsController.clear();
    _recipeInstructionsController.clear();
    _recipeTagsController.clear();
    _selectedRecipeDifficulty = 'Fácil';
    
    showDialog(
      context: context,
      builder: (context) => _buildAddRecipeModal(),
    );
  }

  Widget _buildAddRecipeModal() {
    return StatefulBuilder(
      builder: (context, setModalState) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 500, maxHeight: 700),
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
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.green, Colors.green.shade700],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(28),
                    topRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.restaurant_menu, color: AppTheme.white, size: 28),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Text(
                        'Nueva Receta',
                        style: TextStyle(
                          color: AppTheme.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: () {
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
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Nombre
                      TextField(
                        controller: _recipeNameController,
                        decoration: InputDecoration(
                          labelText: 'Nombre de la receta *',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.restaurant, color: Colors.green),
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
                      // Categoría
                      TextField(
                        controller: _recipeCategoryController,
                        decoration: InputDecoration(
                          labelText: 'Categoría *',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          hintText: 'Ej: Ensaladas, Pescados, Bowls',
                          prefixIcon: const Icon(Icons.category, color: Colors.green),
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
                      // Dificultad
                      DropdownButtonFormField<String>(
                        value: _selectedRecipeDifficulty,
                        decoration: InputDecoration(
                          labelText: 'Dificultad *',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.speed, color: Colors.green),
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
                        dropdownColor: AppTheme.darkSurface,
                        style: const TextStyle(color: AppTheme.white),
                        items: ['Fácil', 'Intermedio', 'Avanzado'].map((String value) {
                          return DropdownMenuItem<String>(
                            value: value,
                            child: Text(value),
                          );
                        }).toList(),
                        onChanged: (String? value) {
                          setModalState(() {
                            _selectedRecipeDifficulty = value ?? 'Fácil';
                          });
                        },
                      ),
                      const SizedBox(height: 16),
                      // Tiempo de preparación y Porciones
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _recipePrepTimeController,
                              decoration: InputDecoration(
                                labelText: 'Tiempo de preparación *',
                                labelStyle: const TextStyle(color: AppTheme.white70),
                                hintText: 'Ej: 15 min',
                                prefixIcon: const Icon(Icons.access_time, color: Colors.green),
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
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextField(
                              controller: _recipeServingsController,
                              keyboardType: TextInputType.number,
                              decoration: InputDecoration(
                                labelText: 'Porciones *',
                                labelStyle: const TextStyle(color: AppTheme.white70),
                                prefixIcon: const Icon(Icons.people, color: Colors.green),
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
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // Calorías
                      TextField(
                        controller: _recipeCaloriesController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Calorías',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.local_fire_department, color: Colors.green),
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
                      // Ingredientes
                      TextField(
                        controller: _recipeIngredientsController,
                        maxLines: 3,
                        decoration: InputDecoration(
                          labelText: 'Ingredientes *',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          hintText: 'Lista los ingredientes separados por comas',
                          prefixIcon: const Icon(Icons.shopping_basket, color: Colors.green),
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
                      // Instrucciones
                      TextField(
                        controller: _recipeInstructionsController,
                        maxLines: 4,
                        decoration: InputDecoration(
                          labelText: 'Instrucciones *',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          hintText: 'Describe los pasos para preparar la receta',
                          prefixIcon: const Icon(Icons.list, color: Colors.green),
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
                      // Tags
                      TextField(
                        controller: _recipeTagsController,
                        decoration: InputDecoration(
                          labelText: 'Tags',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          hintText: 'Ej: proteína, vegetales, bajo en calorías',
                          prefixIcon: const Icon(Icons.label, color: Colors.green),
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
                      const SizedBox(height: 24),
                      // Botones
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton(
                            onPressed: () {
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
                              if (_recipeNameController.text.trim().isEmpty ||
                                  _recipeCategoryController.text.trim().isEmpty ||
                                  _recipeIngredientsController.text.trim().isEmpty ||
                                  _recipeInstructionsController.text.trim().isEmpty) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Por favor completa todos los campos requeridos'),
                                    backgroundColor: Colors.red,
                                  ),
                                );
                                return;
                              }

                              try {
                                final recipeId = DateTime.now().millisecondsSinceEpoch.toString();
                                final servings = int.tryParse(_recipeServingsController.text) ?? 2;
                                final calories = int.tryParse(_recipeCaloriesController.text) ?? 0;
                                final tags = _recipeTagsController.text.trim().isEmpty
                                    ? <String>[]
                                    : _recipeTagsController.text.split(',').map((e) => e.trim()).where((e) => e.isNotEmpty).toList();

                                final recipeData = {
                                  'id': recipeId,
                                  'name': _recipeNameController.text.trim(),
                                  'category': _recipeCategoryController.text.trim(),
                                  'difficulty': _selectedRecipeDifficulty,
                                  'prepTime': _recipePrepTimeController.text.trim(),
                                  'servings': servings,
                                  'calories': calories,
                                  'rating': 0.0,
                                  'ingredients': _recipeIngredientsController.text.trim(),
                                  'instructions': _recipeInstructionsController.text.trim(),
                                  'tags': tags,
                                };

                                final result = await _healthService.saveRecipe(recipeData);
                                
                                if (result['success'] == true) {
                                  // Recargar recetas
                                  final recipesData = await _healthService.getRecipes();
                                  if (mounted) {
                                    setState(() {
                                      _recipes = recipesData.map((data) => Recipe(
                                        id: data['id'] ?? '',
                                        name: data['name'] ?? '',
                                        category: data['category'] ?? '',
                                        difficulty: data['difficulty'] ?? '',
                                        prepTime: data['prep_time'] ?? '',
                                        servings: data['servings'] ?? 0,
                                        calories: data['calories'] ?? 0,
                                        rating: (data['rating'] ?? 0.0).toDouble(),
                                        ingredients: data['ingredients'] ?? '',
                                        instructions: data['instructions'] ?? '',
                                        tags: List<String>.from(data['tags'] ?? []),
                                      )).toList();
                                    });
                                  }
                                  
                                  Navigator.pop(context);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('Receta agregada exitosamente'),
                                      backgroundColor: Colors.green,
                                    ),
                                  );
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text('Error al guardar: ${result['error']}'),
                                      backgroundColor: Colors.red,
                                    ),
                                  );
                                }
                              } catch (e) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('Error: ${e.toString()}'),
                                    backgroundColor: Colors.red,
                                  ),
                                );
                              }
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green,
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
              PopupMenuButton<String>(
                icon: const Icon(Icons.more_vert, size: 20, color: AppTheme.white60),
                color: AppTheme.darkSurface,
                onSelected: (value) {
                  switch (value) {
                    case 'favorite':
                      setState(() {
                        if (_favoriteRecipes.contains(recipe.id)) {
                          _favoriteRecipes.remove(recipe.id);
                        } else {
                          _favoriteRecipes.add(recipe.id);
                        }
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(_favoriteRecipes.contains(recipe.id)
                              ? 'Receta agregada a favoritos'
                              : 'Receta eliminada de favoritos'),
                          backgroundColor: Colors.green,
                          duration: const Duration(seconds: 2),
                        ),
                      );
                      break;
                    case 'edit':
                      _showEditRecipeDialog(recipe);
                      break;
                    case 'delete':
                      _showDeleteRecipeConfirmation(recipe);
                      break;
                  }
                },
                itemBuilder: (context) => [
                  PopupMenuItem(
                    value: 'favorite',
                    child: Row(
                      children: [
                        Icon(
                          _favoriteRecipes.contains(recipe.id)
                              ? Icons.favorite
                              : Icons.favorite_border,
                          size: 20,
                          color: Colors.red,
                        ),
                        const SizedBox(width: 12),
                        Text(
                          _favoriteRecipes.contains(recipe.id)
                              ? 'Quitar de favoritos'
                              : 'Agregar a favoritos',
                          style: const TextStyle(color: AppTheme.white),
                        ),
                      ],
                    ),
                  ),
                  PopupMenuItem(
                    value: 'edit',
                    child: const Row(
                      children: [
                        Icon(Icons.edit, size: 20, color: Colors.blue),
                        SizedBox(width: 12),
                        Text('Editar', style: TextStyle(color: AppTheme.white)),
                      ],
                    ),
                  ),
                  PopupMenuItem(
                    value: 'delete',
                    child: const Row(
                      children: [
                        Icon(Icons.delete, size: 20, color: Colors.red),
                        SizedBox(width: 12),
                        Text('Eliminar', style: TextStyle(color: Colors.red)),
                      ],
                    ),
                  ),
                ],
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
                    _showRecipeDetailsDialog(recipe);
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
                    _addRecipeToMealPlan(recipe);
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

  void _showRecipeDetailsDialog(Recipe recipe) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
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
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.green, Colors.green.shade700],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(28),
                    topRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.restaurant_menu, color: AppTheme.white, size: 28),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        recipe.name,
                        style: const TextStyle(
                          color: AppTheme.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: () {
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
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Información básica
                      Row(
                        children: [
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
                          const Spacer(),
                          Text(
                            recipe.category,
                            style: const TextStyle(
                              fontSize: 14,
                              color: AppTheme.white70,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
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
                      const SizedBox(height: 24),
                      // Ingredientes
                      const Text(
                        'Ingredientes:',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.darkBackground,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.green.withOpacity(0.3)),
                        ),
                        child: Text(
                          recipe.ingredients,
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppTheme.white70,
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),
                      // Instrucciones
                      const Text(
                        'Instrucciones:',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.darkBackground,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.green.withOpacity(0.3)),
                        ),
                        child: Text(
                          recipe.instructions,
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppTheme.white70,
                            height: 1.5,
                          ),
                        ),
                      ),
                      if (recipe.tags.isNotEmpty) ...[
                        const SizedBox(height: 24),
                        const Text(
                          'Tags:',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: recipe.tags.map((tag) {
                            return Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.green.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.green.withOpacity(0.3)),
                              ),
                              child: Text(
                                tag,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.white70,
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
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

  void _addRecipeToMealPlan(Recipe recipe) {
    // Mostrar selector de tipo de comida
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.darkSurface,
        title: const Text(
          'Agregar a Plan de Comidas',
          style: TextStyle(color: AppTheme.white),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.wb_sunny, color: Colors.orange),
              title: const Text('Desayuno', style: TextStyle(color: AppTheme.white)),
              onTap: () {
                Navigator.pop(context);
                _addRecipeToMeal(recipe, 'breakfast');
              },
            ),
            ListTile(
              leading: const Icon(Icons.wb_sunny, color: Colors.yellow),
              title: const Text('Comida', style: TextStyle(color: AppTheme.white)),
              onTap: () {
                Navigator.pop(context);
                _addRecipeToMeal(recipe, 'lunch');
              },
            ),
            ListTile(
              leading: const Icon(Icons.nightlight_round, color: Colors.blue),
              title: const Text('Cena', style: TextStyle(color: AppTheme.white)),
              onTap: () {
                Navigator.pop(context);
                _addRecipeToMeal(recipe, 'dinner');
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar', style: TextStyle(color: AppTheme.white60)),
          ),
        ],
      ),
    );
  }

  void _addRecipeToMeal(Recipe recipe, String mealType) {
    setState(() {
      final dateKey = DateFormat('yyyy-MM-dd').format(DateTime.now());
      if (!_mealPlans.containsKey(dateKey)) {
        _mealPlans[dateKey] = {};
      }
      _mealPlans[dateKey]![mealType] = {
        'name': recipe.name,
        'time': '',
      };
    });

    // Guardar en Supabase
    final dateKey = DateFormat('yyyy-MM-dd').format(DateTime.now());
    final mealPlanData = {
      'breakfast': _mealPlans[dateKey]?['breakfast'],
      'lunch': _mealPlans[dateKey]?['lunch'],
      'dinner': _mealPlans[dateKey]?['dinner'],
      'waterGlasses': _mealPlans[dateKey]?['waterGlasses'] ?? 0,
    };
    
    _healthService.saveMealPlan(dateKey, mealPlanData).then((result) {
      if (result['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${recipe.name} agregada a ${mealType == 'breakfast' ? 'Desayuno' : mealType == 'lunch' ? 'Comida' : 'Cena'}'),
            backgroundColor: Colors.green,
          ),
        );
      }
    });

    // Cambiar a la sección de meal-planner
    setState(() {
      _activeSection = 'meal-planner';
    });
  }

  void _showEditRecipeDialog(Recipe recipe) {
    // Pre-llenar controladores con los datos de la receta
    _recipeNameController.text = recipe.name;
    _recipeCategoryController.text = recipe.category;
    _selectedRecipeDifficulty = recipe.difficulty;
    _recipePrepTimeController.text = recipe.prepTime;
    _recipeServingsController.text = recipe.servings.toString();
    _recipeCaloriesController.text = recipe.calories.toString();
    _recipeIngredientsController.text = recipe.ingredients;
    _recipeInstructionsController.text = recipe.instructions;
    _recipeTagsController.text = recipe.tags.join(', ');
    
    // Guardar el ID de la receta que se está editando y el rating
    final editingRecipeId = recipe.id;
    final currentRating = recipe.rating;
    
    showDialog(
      context: context,
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Dialog(
              backgroundColor: Colors.transparent,
              child: Container(
                constraints: const BoxConstraints(maxWidth: 500, maxHeight: 700),
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
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Header
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Colors.blue, Colors.blue.shade700],
                        ),
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(28),
                          topRight: Radius.circular(28),
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.edit, color: AppTheme.white, size: 28),
                          const SizedBox(width: 16),
                          const Expanded(
                            child: Text(
                              'Editar Receta',
                              style: TextStyle(
                                color: AppTheme.white,
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          IconButton(
                            onPressed: () {
                              Navigator.pop(dialogContext);
                            },
                            icon: const Icon(Icons.close, color: AppTheme.white),
                          ),
                        ],
                      ),
                    ),
                    // Contenido (reutilizar el mismo formulario)
                    Flexible(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Nombre
                            TextField(
                              controller: _recipeNameController,
                              decoration: InputDecoration(
                            labelText: 'Nombre de la receta *',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.restaurant, color: Colors.blue),
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
                            // Categoría
                            TextField(
                              controller: _recipeCategoryController,
                              decoration: InputDecoration(
                            labelText: 'Categoría *',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.category, color: Colors.blue),
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
                            // Dificultad
                            DropdownButtonFormField<String>(
                              value: _selectedRecipeDifficulty,
                              decoration: InputDecoration(
                            labelText: 'Dificultad *',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.speed, color: Colors.blue),
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
                              items: ['Fácil', 'Intermedio', 'Avanzado'].map((String value) {
                            return DropdownMenuItem<String>(
                              value: value,
                              child: Text(value),
                            );
                              }).toList(),
                              onChanged: (String? value) {
                            setModalState(() {
                              _selectedRecipeDifficulty = value ?? 'Fácil';
                            });
                              },
                            ),
                            const SizedBox(height: 16),
                            // Tiempo y Porciones
                            Row(
                              children: [
                            Expanded(
                              child: TextField(
                                controller: _recipePrepTimeController,
                                decoration: InputDecoration(
                                  labelText: 'Tiempo de preparación *',
                                  labelStyle: const TextStyle(color: AppTheme.white70),
                                  prefixIcon: const Icon(Icons.access_time, color: Colors.blue),
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
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: TextField(
                                controller: _recipeServingsController,
                                keyboardType: TextInputType.number,
                                decoration: InputDecoration(
                                  labelText: 'Porciones *',
                                  labelStyle: const TextStyle(color: AppTheme.white70),
                                  prefixIcon: const Icon(Icons.people, color: Colors.blue),
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
                            ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            // Calorías
                            TextField(
                              controller: _recipeCaloriesController,
                              keyboardType: TextInputType.number,
                              decoration: InputDecoration(
                            labelText: 'Calorías',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.local_fire_department, color: Colors.blue),
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
                            // Ingredientes
                            TextField(
                              controller: _recipeIngredientsController,
                              maxLines: 3,
                              decoration: InputDecoration(
                            labelText: 'Ingredientes *',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.shopping_basket, color: Colors.blue),
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
                            // Instrucciones
                            TextField(
                              controller: _recipeInstructionsController,
                              maxLines: 4,
                              decoration: InputDecoration(
                            labelText: 'Instrucciones *',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.list, color: Colors.blue),
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
                            // Tags
                            TextField(
                              controller: _recipeTagsController,
                              decoration: InputDecoration(
                            labelText: 'Tags',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.label, color: Colors.blue),
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
                            const SizedBox(height: 24),
                            // Botones
                            Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                TextButton(
                                  onPressed: () {
                                    Navigator.pop(dialogContext);
                                  },
                                  child: const Text(
                                    'Cancelar',
                                    style: TextStyle(color: AppTheme.white60, fontSize: 16),
                                  ),
                                ),
                                const SizedBox(width: 12),
                                ElevatedButton(
                                  onPressed: () async {
                                  if (_recipeNameController.text.trim().isEmpty ||
                                    _recipeCategoryController.text.trim().isEmpty ||
                                    _recipeIngredientsController.text.trim().isEmpty ||
                                    _recipeInstructionsController.text.trim().isEmpty) {
                                  ScaffoldMessenger.of(dialogContext).showSnackBar(
                                    const SnackBar(
                                      content: Text('Por favor completa todos los campos requeridos'),
                                      backgroundColor: Colors.red,
                                    ),
                                  );
                                  return;
                                  }

                                  try {
                                  final servings = int.tryParse(_recipeServingsController.text) ?? 2;
                                  final calories = int.tryParse(_recipeCaloriesController.text) ?? 0;
                                  final tags = _recipeTagsController.text.trim().isEmpty
                                      ? <String>[]
                                      : _recipeTagsController.text.split(',').map((e) => e.trim()).where((e) => e.isNotEmpty).toList();

                                  final recipeData = {
                                    'id': editingRecipeId,
                                    'name': _recipeNameController.text.trim(),
                                    'category': _recipeCategoryController.text.trim(),
                                    'difficulty': _selectedRecipeDifficulty,
                                    'prepTime': _recipePrepTimeController.text.trim(),
                                    'servings': servings,
                                    'calories': calories,
                                    'rating': currentRating, // Mantener el rating existente
                                    'ingredients': _recipeIngredientsController.text.trim(),
                                    'instructions': _recipeInstructionsController.text.trim(),
                                    'tags': tags,
                                  };

                                  final result = await _healthService.saveRecipe(recipeData);
                                  
                                  if (result['success'] == true) {
                                    // Recargar recetas
                                    final recipesData = await _healthService.getRecipes();
                                    if (mounted) {
                                      setState(() {
                                        _recipes = recipesData.map((data) => Recipe(
                                          id: data['id'] ?? '',
                                          name: data['name'] ?? '',
                                          category: data['category'] ?? '',
                                          difficulty: data['difficulty'] ?? '',
                                          prepTime: data['prep_time'] ?? '',
                                          servings: data['servings'] ?? 0,
                                          calories: data['calories'] ?? 0,
                                          rating: (data['rating'] ?? 0.0).toDouble(),
                                          ingredients: data['ingredients'] ?? '',
                                          instructions: data['instructions'] ?? '',
                                          tags: List<String>.from(data['tags'] ?? []),
                                        )).toList();
                                      });
                                    }
                                    
                                    Navigator.pop(dialogContext);
                                    if (mounted) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(
                                          content: Text('Receta actualizada exitosamente'),
                                          backgroundColor: Colors.green,
                                        ),
                                      );
                                    }
                                  } else {
                                    ScaffoldMessenger.of(dialogContext).showSnackBar(
                                      SnackBar(
                                        content: Text('Error al actualizar: ${result['error']}'),
                                        backgroundColor: Colors.red,
                                      ),
                                    );
                                  }
                                  } catch (e) {
                                  ScaffoldMessenger.of(dialogContext).showSnackBar(
                                    SnackBar(
                                      content: Text('Error: ${e.toString()}'),
                                      backgroundColor: Colors.red,
                                    ),
                                  );
                                  }
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.blue,
                                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                  child: const Text(
                                    'Guardar Cambios',
                                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
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
            );
            },
          );
        },
      );
    }

  void _showDeleteRecipeConfirmation(Recipe recipe) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.darkSurface,
        title: const Text(
          'Eliminar Receta',
          style: TextStyle(color: AppTheme.white),
        ),
        content: Text(
          '¿Estás seguro de que deseas eliminar "${recipe.name}"? Esta acción no se puede deshacer.',
          style: const TextStyle(color: AppTheme.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar', style: TextStyle(color: AppTheme.white60)),
          ),
          ElevatedButton(
            onPressed: () async {
              try {
                // Eliminar de Supabase usando el servicio
                final result = await _healthService.deleteRecipe(recipe.id);
                
                if (result['success'] == true) {
                  // Actualizar lista local
                  if (mounted) {
                    setState(() {
                      _recipes.removeWhere((r) => r.id == recipe.id);
                      _favoriteRecipes.remove(recipe.id);
                    });
                  }

                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Receta eliminada exitosamente'),
                      backgroundColor: Colors.green,
                    ),
                  );
                } else {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Error al eliminar: ${result['error']}'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              } catch (e) {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Error: ${e.toString()}'),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            child: const Text('Eliminar'),
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
    // Calcular semana actual
    final weekStart = DateTime.now().subtract(Duration(days: DateTime.now().weekday - 1));
    final weekEnd = weekStart.add(const Duration(days: 6));
    
    // Obtener entrenamientos de la semana actual
    final weekWorkouts = _workouts.where((w) {
      final workoutDate = DateTime.tryParse(w['date'] as String? ?? '');
      if (workoutDate == null) return false;
      return workoutDate.isAfter(weekStart.subtract(const Duration(days: 1))) &&
             workoutDate.isBefore(weekEnd.add(const Duration(days: 1)));
    }).toList();
    
    // Calcular estadísticas semanales basadas en entrenamientos reales
    final totalWorkouts = weekWorkouts.length;
    final totalDuration = weekWorkouts.fold<int>(0, (sum, w) => sum + (w['duration'] as int? ?? 0));
    final totalCalories = weekWorkouts.fold<int>(0, (sum, w) => sum + (w['calories'] as int? ?? 0));
    final totalExercises = weekWorkouts.fold<int>(0, (sum, w) {
      // Si tiene una rutina asociada, contar ejercicios de la rutina
      final routineId = w['routineId'] as String?;
      if (routineId != null) {
        final routine = _gymRoutines.firstWhere(
          (r) => r.id == routineId,
          orElse: () => GymRoutine(
            id: '',
            name: '',
            description: '',
            exercises: [],
            duration: '',
            difficulty: '',
          ),
        );
        return sum + routine.exercises.length;
      }
      // Si no tiene rutina, asumir 1 ejercicio por entrenamiento
      return sum + 1;
    });
    final averageIntensity = totalWorkouts > 0 ? (totalCalories / totalWorkouts / 10).clamp(0.0, 10.0) : 0.0;
    
    final weeklyStats = {
      'totalWorkouts': totalWorkouts,
      'totalDuration': totalDuration,
      'totalCalories': totalCalories,
      'totalExercises': totalExercises,
      'averageIntensity': averageIntensity,
    };
    
    // Recalcular semana actual basada en entrenamientos registrados
    // Limpiar si cambió de semana
    final lastWeekStart = _currentWeekWorkouts['_weekStart'] as DateTime?;
    if (lastWeekStart == null || lastWeekStart != weekStart) {
      _currentWeekWorkouts.clear();
      _currentWeekWorkouts['_weekStart'] = weekStart; // Guardar inicio de semana para detectar cambios
    }
    
    // Inicializar semana con datos de entrenamientos registrados o datos de ejemplo
    if (_currentWeekWorkouts.length <= 1) { // Solo tiene _weekStart
      
      final weekDaysMap = {
        'monday': 'Lunes',
        'tuesday': 'Martes',
        'wednesday': 'Miércoles',
        'thursday': 'Jueves',
        'friday': 'Viernes',
        'saturday': 'Sábado',
        'sunday': 'Domingo',
      };
      
      for (var entry in weekDaysMap.entries) {
        final dayKey = entry.key;
        final dayIndex = weekDaysMap.keys.toList().indexOf(dayKey);
        final dayDate = weekStart.add(Duration(days: dayIndex));
        final dayDateStr = DateFormat('yyyy-MM-dd').format(dayDate);
        final dayOfWeek = dayDate.weekday; // 1-7 (lunes-domingo)
        
        // Buscar entrenamiento registrado para este día
        final workoutForDay = _workouts.firstWhere(
          (w) => w['date'] == dayDateStr,
          orElse: () => {},
        );
        
        // Buscar rutina recurrente para este día
        GymRoutine? recurringRoutineForDay;
        for (final routine in _gymRoutines) {
          if (routine.isRecurring) {
            bool shouldShow = false;
            
            // Verificar si la rutina aplica para este día
            if (routine.startDate != null && dayDate.isBefore(routine.startDate!)) {
              continue;
            }
            if (routine.endDate != null && dayDate.isAfter(routine.endDate!)) {
              continue;
            }
            
            switch (routine.recurrenceType) {
              case 'daily':
                shouldShow = true;
                break;
              case 'weekly':
                if (routine.recurrenceDays != null && routine.recurrenceDays!.contains(dayOfWeek)) {
                  shouldShow = true;
                }
                break;
              case 'monthly':
                if (routine.startDate != null && dayDate.day == routine.startDate!.day) {
                  shouldShow = true;
                }
                break;
            }
            
            if (shouldShow) {
              recurringRoutineForDay = routine;
              break; // Priorizar la primera rutina encontrada
            }
          }
        }
        
        // Priorizar entrenamiento registrado, luego rutina recurrente, luego datos de ejemplo
        if (workoutForDay.isNotEmpty) {
          final workoutId = workoutForDay['id'] as String? ?? '';
          _currentWeekWorkouts[dayKey] = {
            'workout': workoutForDay['name'] ?? 'Entrenamiento',
            'duration': workoutForDay['duration'] ?? 0,
            'calories': workoutForDay['calories'] ?? 0,
            'completed': _completedWorkouts.contains(workoutId),
            'workoutId': workoutId,
            'type': 'workout',
          };
        } else if (recurringRoutineForDay != null) {
          // Extraer duración numérica de la rutina (ej: "45 min" -> 45)
          final durationMatch = RegExp(r'(\d+)').firstMatch(recurringRoutineForDay.duration);
          final durationMinutes = durationMatch != null ? int.tryParse(durationMatch.group(1) ?? '0') ?? 0 : 0;
          
          _currentWeekWorkouts[dayKey] = {
            'workout': recurringRoutineForDay.name,
            'duration': durationMinutes,
            'calories': 0, // Las rutinas no tienen calorías por defecto
            'completed': _completedRoutines.contains(recurringRoutineForDay.id),
            'routineId': recurringRoutineForDay.id,
            'type': 'routine',
          };
        } else {
          // Sin entrenamiento ni rutina para este día
          _currentWeekWorkouts[dayKey] = {
            'workout': '',
            'duration': 0,
            'calories': 0,
            'completed': false,
            'type': 'empty',
          };
        }
      }
    }
    
    // Filtrar solo los días de la semana (excluir _weekStart)
    final currentWeek = <String, Map<String, dynamic>>{};
    _currentWeekWorkouts.forEach((key, value) {
      if (key != '_weekStart' && value is Map<String, dynamic>) {
        currentWeek[key] = value;
      }
    });
    
    // Calcular objetivos semanales basados en entrenamientos y rutinas completados
    final completedWorkoutDays = currentWeek.values.where((day) => 
      day['completed'] == true && 
      (day['workout'] as String).isNotEmpty
    ).length;
    
    // Recalcular estadísticas basadas en entrenamientos y rutinas completados
    final completedWeekWorkouts = weekWorkouts.where((w) {
      final workoutId = w['id'] as String? ?? '';
      return _completedWorkouts.contains(workoutId);
    }).toList();
    
    // Calcular duración y calorías solo de los completados
    final completedTotalDuration = completedWeekWorkouts.fold<int>(0, (sum, w) => sum + (w['duration'] as int? ?? 0));
    final completedTotalCalories = completedWeekWorkouts.fold<int>(0, (sum, w) => sum + (w['calories'] as int? ?? 0));
    
    // Agregar duración de rutinas completadas en la semana
    final completedRoutinesDuration = currentWeek.values.where((day) {
      return day['type'] == 'routine' && day['completed'] == true;
    }).fold<int>(0, (sum, day) {
      return sum + (day['duration'] as int? ?? 0);
    });
    
    final finalTotalDuration = completedTotalDuration + completedRoutinesDuration;
    final finalTotalCalories = completedTotalCalories;
    final finalTotalHours = finalTotalDuration / 60.0;
    
    // Recalcular ejercicios completados
    final completedTotalExercises = completedWeekWorkouts.fold<int>(0, (sum, w) {
      final routineId = w['routineId'] as String?;
      if (routineId != null) {
        try {
          final routine = _gymRoutines.firstWhere((r) => r.id == routineId);
          return sum + routine.exercises.length;
        } catch (e) {
          return sum + 1;
        }
      }
      return sum + 1;
    });
    
    // Agregar ejercicios de rutinas completadas en la semana
    final completedRoutinesExercises = currentWeek.values.where((day) {
      return day['type'] == 'routine' && day['completed'] == true;
    }).fold<int>(0, (sum, day) {
      final routineId = day['routineId'] as String?;
      if (routineId != null) {
        try {
          final routine = _gymRoutines.firstWhere((r) => r.id == routineId);
          return sum + routine.exercises.length;
        } catch (e) {
          return sum;
        }
      }
      return sum;
    });
    
    final finalTotalExercises = completedTotalExercises + completedRoutinesExercises;
    
    // Objetivos con progreso real basado en completados
    final goals = [
      {
        'id': 1, 
        'title': 'Entrenar 5 días por semana', 
        'progress': completedWorkoutDays, 
        'target': 5, 
        'completed': completedWorkoutDays >= 5
      },
      {
        'id': 2, 
        'title': 'Quemar 3000 calorías', 
        'progress': finalTotalCalories, 
        'target': 3000, 
        'completed': finalTotalCalories >= 3000
      },
      {
        'id': 3, 
        'title': 'Completar 10 horas de ejercicio', 
        'progress': finalTotalHours.round(), 
        'target': 10, 
        'completed': finalTotalHours >= 10
      },
      {
        'id': 4, 
        'title': 'Completar 20 ejercicios', 
        'progress': finalTotalExercises, 
        'target': 20, 
        'completed': finalTotalExercises >= 20
      },
    ];
    
    // Logros basados en datos reales (solo completados)
    final achievements = [
      {
        'id': 1, 
        'title': 'Primera Rutina', 
        'description': 'Completaste tu primera rutina de gimnasio', 
        'icon': '🏋️', 
        'unlocked': _completedRoutines.isNotEmpty
      },
      {
        'id': 2, 
        'title': 'Consistencia', 
        'description': '5 entrenamientos/rutinas completados en una semana', 
        'icon': '💪', 
        'unlocked': completedWorkoutDays >= 5
      },
      {
        'id': 3, 
        'title': 'Quemador de Calorías', 
        'description': 'Quemaste 2500+ calorías en una semana', 
        'icon': '🔥', 
        'unlocked': finalTotalCalories >= 2500
      },
      {
        'id': 4, 
        'title': 'Maratón', 
        'description': '30 entrenamientos/rutinas completados en total', 
        'icon': '🏃', 
        'unlocked': _completedWorkouts.length + _completedRoutines.length >= 30
      },
    ];
    
    final unlockedAchievements = achievements.where((a) => a['unlocked'] == true).length;
    final weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    final weekKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
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
                        'Entrenamientos',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Planifica rutinas y registra tus entrenamientos',
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
          
          // Botones de acción
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    _showAddGymRoutineModal();
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
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    _showAddWorkoutModalDialog();
                  },
                  icon: const Icon(Icons.directions_run, size: 20),
                  label: const Text('Entrenamiento'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
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
          
          // Lista de rutinas y entrenamientos
          if (_gymRoutines.isEmpty && _workouts.isEmpty)
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
                      'No hay rutinas ni entrenamientos',
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
                    'Rutinas y Entrenamientos',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Mostrar rutinas (solo una instancia de cada rutina)
                  ..._gymRoutines.map((routine) => _buildGymRoutineCard(routine)),
                  // Mostrar entrenamientos únicos (sin duplicados por recurrencia)
                  // Agrupar por nombre y mostrar solo uno de cada tipo
                  ..._workouts.fold<Map<String, Map<String, dynamic>>>(
                    {},
                    (map, workout) {
                      final workoutName = workout['name'] as String? ?? '';
                      // Si no existe o este es más reciente, actualizar
                      if (!map.containsKey(workoutName) || 
                          (workout['timestamp'] as String? ?? '').compareTo(
                            map[workoutName]!['timestamp'] as String? ?? ''
                          ) > 0) {
                        map[workoutName] = workout;
                      }
                      return map;
                    },
                  ).values.map((workout) => _buildWorkoutCard(workout)),
                ],
              ),
            ),
          const SizedBox(height: 24),
          
          // Semana actual con entrenamientos
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
                  
                  return GestureDetector(
                    onTap: () {
                      if ((dayData['workout'] as String).isNotEmpty) {
                        setState(() {
                          final newCompleted = !isCompleted;
                          _currentWeekWorkouts[dayKey]!['completed'] = newCompleted;
                          
                          // Actualizar sets de completados según el tipo
                          final type = dayData['type'] as String?;
                          if (type == 'workout') {
                            final workoutId = dayData['workoutId'] as String?;
                            if (workoutId != null) {
                              if (newCompleted) {
                                _completedWorkouts.add(workoutId);
                              } else {
                                _completedWorkouts.remove(workoutId);
                              }
                            }
                          } else if (type == 'routine') {
                            final routineId = dayData['routineId'] as String?;
                            if (routineId != null) {
                              if (newCompleted) {
                                _completedRoutines.add(routineId);
                              } else {
                                _completedRoutines.remove(routineId);
                              }
                            }
                          }
                        });
                      }
                    },
                    child: Container(
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
                                Row(
                                  children: [
                                    // Badge de tipo
                                    if ((dayData['type'] == 'routine' || dayData['type'] == 'workout'))
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: (dayData['type'] == 'routine' 
                                              ? Colors.green 
                                              : Colors.blue).withOpacity(0.2),
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: Text(
                                          dayData['type'] == 'routine' 
                                              ? 'RUTINA' 
                                              : 'ENTRENAMIENTO',
                                          style: TextStyle(
                                            fontSize: 8,
                                            fontWeight: FontWeight.bold,
                                            color: dayData['type'] == 'routine' 
                                                ? Colors.green 
                                                : Colors.blue,
                                          ),
                                        ),
                                      ),
                                    if ((dayData['type'] == 'routine' || dayData['type'] == 'workout'))
                                      const SizedBox(width: 6),
                                    Expanded(
                                      child: Text(
                                        dayData['workout'] as String,
                                        style: TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w600,
                                          color: isCompleted ? AppTheme.white : AppTheme.white60,
                                          decoration: isCompleted ? TextDecoration.lineThrough : null,
                                        ),
                                      ),
                                    ),
                                  ],
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
                                      if (dayData['calories'] as int > 0) ...[
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
                                    ],
                                  ),
                                ],
                              ],
                            ),
                          ),
                          if ((dayData['workout'] as String).isNotEmpty)
                            IconButton(
                              onPressed: () {
                                setState(() {
                                  final newCompleted = !isCompleted;
                                  _currentWeekWorkouts[dayKey]!['completed'] = newCompleted;
                                  
                                  // Actualizar sets de completados según el tipo
                                  final type = dayData['type'] as String?;
                                  if (type == 'workout') {
                                    final workoutId = dayData['workoutId'] as String?;
                                    if (workoutId != null) {
                                      if (newCompleted) {
                                        _completedWorkouts.add(workoutId);
                                      } else {
                                        _completedWorkouts.remove(workoutId);
                                      }
                                    }
                                  } else if (type == 'routine') {
                                    final routineId = dayData['routineId'] as String?;
                                    if (routineId != null) {
                                      if (newCompleted) {
                                        _completedRoutines.add(routineId);
                                      } else {
                                        _completedRoutines.remove(routineId);
                                      }
                                    }
                                  }
                                  
                                  // Los objetivos y logros se recalcularán automáticamente en el próximo build
                                });
                              },
                              icon: Icon(
                                isCompleted ? Icons.check_circle : Icons.radio_button_unchecked,
                                color: isCompleted ? Colors.green : AppTheme.white60,
                                size: 24,
                              ),
                            )
                          else if (isCompleted)
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
                    ),
                  );
                }),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Objetivos combinados
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
          
          // Sistema de logros combinados
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
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.85,
                  ),
                  itemCount: achievements.length,
                  itemBuilder: (context, index) {
                    final achievement = achievements[index];
                    final isUnlocked = achievement['unlocked'] == true;
                    return Container(
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
                        mainAxisAlignment: MainAxisAlignment.center,
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
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFitnessAndGoals() {
    // Datos de Fitness Tracker
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
    
    final fitnessWeeklyStats = {
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
    
    // Datos de Objetivos Deportivos
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
    };
    
    final sportsWeeklyStats = sampleSportsData['weeklyStats'] as Map<String, dynamic>;
    final goals = sampleSportsData['goals'] as List;
    final categories = sampleSportsData['categories'] as List;
    
    // Logros combinados
    final achievements = [
      {'id': 1, 'title': 'Primera Semana', 'description': 'Completaste tu primera semana de seguimiento', 'icon': '🏆', 'unlocked': true},
      {'id': 2, 'title': 'Meta de Pasos', 'description': 'Superaste los 10,000 pasos diarios', 'icon': '👟', 'unlocked': true},
      {'id': 3, 'title': 'Primer Objetivo', 'description': 'Completaste tu primer objetivo deportivo', 'icon': '🎯', 'unlocked': !_sportsGoals.isEmpty},
      {'id': 4, 'title': 'Consistencia', 'description': '5 días consecutivos de ejercicio', 'icon': '💪', 'unlocked': false},
      {'id': 5, 'title': 'Multideportista', 'description': 'Objetivos en 3 deportes diferentes', 'icon': '🌟', 'unlocked': false},
      {'id': 6, 'title': 'Campeón', 'description': '10 objetivos completados', 'icon': '👑', 'unlocked': false},
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
                        'Fitness y Objetivos',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Monitorea tu actividad y alcanza tus metas',
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
          
          // Resumen de estadísticas de Fitness
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.directions_walk,
                  title: 'Pasos',
                  value: fitnessWeeklyStats['totalSteps']!.toString(),
                  color: Colors.green,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.local_fire_department,
                  title: 'Calorías',
                  value: fitnessWeeklyStats['totalCaloriesBurned']!.toString(),
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
                  icon: Icons.emoji_events,
                  title: 'Objetivos',
                  value: sportsWeeklyStats['totalGoals'].toString(),
                  color: Colors.blue,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle_outline,
                  title: 'Completados',
                  value: sportsWeeklyStats['completedGoals'].toString(),
                  color: Colors.orange,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Botones de acción
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    _showAddFitnessActivityModal();
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
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    setState(() {
                      _showAddSportsModal = true;
                    });
                  },
                  icon: const Icon(Icons.emoji_events, size: 20),
                  label: const Text('Crear Objetivo'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
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
          
          // Título de sección de Fitness
          const Text(
            'Seguimiento de Fitness',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(height: 16),
          
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
          
          // Título de sección de Objetivos
          const Text(
            'Objetivos Deportivos',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(height: 16),
          
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
                      'Logros',
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
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.85,
                  ),
                  itemCount: achievements.length,
                  itemBuilder: (context, index) {
                    final achievement = achievements[index];
                    final isUnlocked = achievement['unlocked'] == true;
                    return Container(
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
                        mainAxisAlignment: MainAxisAlignment.center,
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
                  },
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

  Widget _buildHealthTracking() {
    // Datos de pérdida de peso
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
      'totalMeasurements': _bodyMeasurements.length,
      'weightChange': -1.2,
      'waistChange': -3.0,
      'muscleGain': 0.8,
    };
    
    final recentWeights = [
      {'date': '2024-01-15', 'weight': 75.2, 'change': -0.3},
      {'date': '2024-01-08', 'weight': 75.5, 'change': -0.5},
      {'date': '2024-01-01', 'weight': 76.0, 'change': -0.8},
      {'date': '2023-12-25', 'weight': 76.8, 'change': -0.4},
      {'date': '2023-12-18', 'weight': 77.2, 'change': -0.6},
    ];
    
    // Tipos de medidas corporales
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
    
    final measurementGoals = {
      'weight': targetWeight,
      'waist': 75.0,
      'chest': 100.0,
      'bicep': 35.0,
    };
    
    final weightGoals = [
      {'id': 1, 'title': 'Peso objetivo', 'target': targetWeight, 'current': currentWeight, 'progress': currentWeight, 'completed': currentWeight <= targetWeight},
      {'id': 2, 'title': 'Perder 10kg', 'target': 10.0, 'current': weightLost, 'progress': weightLost, 'completed': weightLost >= 10.0},
      {'id': 3, 'title': 'Mantener peso por 1 mes', 'target': 30, 'current': 0, 'progress': 0, 'completed': false},
    ];
    
    // Logros combinados
    final achievements = [
      {'id': 1, 'title': 'Primera Medición', 'description': 'Registraste tu primera medida corporal', 'icon': '📏', 'unlocked': _bodyMeasurements.isNotEmpty},
      {'id': 2, 'title': 'Consistencia', 'description': '5 mediciones en una semana', 'icon': '📅', 'unlocked': _bodyMeasurements.length >= 5},
      {'id': 3, 'title': 'Primer Kilo', 'description': 'Perdiste tu primer kilogramo', 'icon': '🎯', 'unlocked': weightLost >= 1.0},
      {'id': 4, 'title': 'Meta de Peso', 'description': 'Alcanzaste tu peso objetivo', 'icon': '⚖️', 'unlocked': currentWeight <= targetWeight},
      {'id': 5, 'title': 'Maratón', 'description': 'Perdiste 5kg en total', 'icon': '🏃', 'unlocked': weightLost >= 5.0},
      {'id': 6, 'title': 'Progreso Constante', 'description': 'Mejora en 3 medidas consecutivas', 'icon': '📈', 'unlocked': false},
    ];
    
    final unlockedAchievements = achievements.where((a) => a['unlocked'] == true).length;
    
    double getProgressPercentageForMeasurements(String? current, double goal) {
      if (current == null || current.isEmpty) return 0;
      final currentNum = double.tryParse(current) ?? 0;
      return ((currentNum / goal) * 100).clamp(0.0, 100.0);
    }
    
    double getProgressPercentageForWeight(double current, double target) {
      if (target == 0) return 0;
      return ((current / target) * 100).clamp(0.0, 100.0);
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
    
    final totalWeightToLose = startingWeight - targetWeight;
    final progressPercentage = getProgressPercentageForWeight(weightLost, totalWeightToLose);
    
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
                  child: const Icon(Icons.health_and_safety, size: 24, color: Colors.green),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Seguimiento de Salud',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Monitorea tu peso y medidas corporales',
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
          
          // Resumen de estadísticas de peso
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
                  icon: Icons.analytics,
                  title: 'Mediciones',
                  value: weeklyStats['totalMeasurements']!.toString(),
                  color: Colors.pink,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Progreso principal hacia meta de peso
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
                      '${weightGoals.where((g) => g['completed'] == true).length}/${weightGoals.length} completados',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white60,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ...weightGoals.map((goal) {
                  final isCompleted = goal['completed'] == true;
                  final progress = getProgressPercentageForWeight(
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
          
          // Título de sección de medidas corporales
          const Text(
            'Medidas Corporales',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(height: 16),
          
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
              final goal = measurementGoals[measurementId] ?? 100.0;
              
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
                        value: getProgressPercentageForMeasurements(currentValue.toString(), goal) / 100,
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
              border: Border.all(color: Colors.green.withOpacity(0.2)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(Icons.straighten, color: Colors.green, size: 20),
                    const SizedBox(width: 8),
                    const Text(
                      'Medidas Adicionales',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.9,
                  ),
                  itemCount: measurementTypes.skip(4).length,
                  itemBuilder: (context, index) {
                    final measurement = measurementTypes.skip(4).elementAt(index);
                    final measurementId = measurement['id'] as String;
                    final currentValue = _newMeasurements[measurementId] ?? '';
                    
                    return Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.darkBackground,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: currentValue.toString().isNotEmpty
                              ? Colors.green.withOpacity(0.3)
                              : AppTheme.darkSurfaceVariant,
                        ),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.green.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Icon(
                              measurement['icon'] as IconData,
                              size: 20,
                              color: Colors.green,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            measurement['name'] as String,
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.white70,
                            ),
                            textAlign: TextAlign.center,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 6),
                          TextField(
                            controller: TextEditingController(text: currentValue.toString()),
                            onChanged: (value) => handleMeasurementChange(measurementId, value),
                            keyboardType: TextInputType.numberWithOptions(decimal: true),
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              color: AppTheme.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                            decoration: InputDecoration(
                              hintText: '0',
                              hintStyle: const TextStyle(color: AppTheme.white40),
                              border: InputBorder.none,
                              isDense: true,
                              contentPadding: const EdgeInsets.symmetric(vertical: 4),
                              filled: true,
                              fillColor: AppTheme.darkSurface,
                            ),
                          ),
                          Text(
                            measurement['unit'] as String,
                            style: TextStyle(
                              fontSize: 10,
                              color: Colors.green.withOpacity(0.8),
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
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
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.85,
                  ),
                  itemCount: achievements.length,
                  itemBuilder: (context, index) {
                    final achievement = achievements[index];
                    final isUnlocked = achievement['unlocked'] == true;
                    return Container(
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
                        mainAxisAlignment: MainAxisAlignment.center,
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
                  },
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
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 0.85,
                  ),
                  itemCount: achievements.length,
                  itemBuilder: (context, index) {
                    final achievement = achievements[index];
                    final isUnlocked = achievement['unlocked'] == true;
                    return Container(
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
                        mainAxisAlignment: MainAxisAlignment.center,
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
                  },
                ),
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

  String _getRecurrenceText(GymRoutine routine) {
    if (!routine.isRecurring) return '';
    
    switch (routine.recurrenceType) {
      case 'daily':
        return 'Diario';
      case 'weekly':
        if (routine.recurrenceDays != null && routine.recurrenceDays!.isNotEmpty) {
          final dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
          final days = routine.recurrenceDays!.map((d) => dayNames[d - 1]).join(', ');
          return 'Semanal: $days';
        }
        return 'Semanal';
      case 'monthly':
        return 'Mensual';
      default:
        return 'Recurrente';
    }
  }

  Widget _buildGymRoutineCard(GymRoutine routine) {
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: Colors.green.withOpacity(0.3),
          width: 1,
        ),
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
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.green.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'RUTINA',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.green,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
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
                    ],
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
            if (routine.description.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                routine.description,
                style: const TextStyle(
                  fontSize: 12,
                  color: AppTheme.white70,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
            if (routine.isRecurring) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.repeat, size: 14, color: Colors.blue),
                  const SizedBox(width: 4),
                  Text(
                    _getRecurrenceText(routine),
                    style: const TextStyle(
                      fontSize: 11,
                      color: Colors.blue,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ],
              ),
            ],
            const SizedBox(height: 12),
            // Botón para marcar como completada
            if (!_completedRoutines.contains(routine.id))
              Container(
                margin: const EdgeInsets.only(bottom: 8),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      setState(() {
                        _completedRoutines.add(routine.id);
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Rutina "${routine.name}" marcada como completada')),
                      );
                    },
                    icon: const Icon(Icons.check_circle, size: 18),
                    label: const Text('Marcar como Completada'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
              )
            else
              Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.green.withOpacity(0.3)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.check_circle, color: Colors.green, size: 18),
                    const SizedBox(width: 8),
                    const Text(
                      'Completada',
                      style: TextStyle(
                        color: Colors.green,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Spacer(),
                    TextButton(
                      onPressed: () {
                        setState(() {
                          _completedRoutines.remove(routine.id);
                        });
                      },
                      child: const Text('Desmarcar', style: TextStyle(color: Colors.green)),
                    ),
                  ],
                ),
              ),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      _editingGymRoutine = routine;
                      _gymRoutineNameController.text = routine.name;
                      _gymRoutineDescriptionController.text = routine.description;
                      _gymRoutineDurationController.text = routine.duration;
                      _selectedGymRoutineDifficulty = routine.difficulty;
                      _gymRoutineIsRecurring = routine.isRecurring;
                      _gymRoutineRecurrenceType = routine.recurrenceType;
                      _gymRoutineRecurrenceDays = routine.recurrenceDays ?? [];
                      _gymRoutineStartDate = routine.startDate;
                      _gymRoutineEndDate = routine.endDate;
                      _showAddGymRoutineModal();
                    },
                    icon: const Icon(Icons.edit, size: 16),
                    label: const Text('Editar'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.blue,
                      side: const BorderSide(color: Colors.blue),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
                          backgroundColor: AppTheme.darkSurface,
                          title: const Text(
                            'Eliminar Rutina',
                            style: TextStyle(color: AppTheme.white),
                          ),
                          content: Text(
                            '¿Estás seguro de que deseas eliminar la rutina "${routine.name}"?',
                            style: const TextStyle(color: AppTheme.white70),
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text('Cancelar'),
                            ),
                            TextButton(
                              onPressed: () async {
                                setState(() {
                                  _gymRoutines.removeWhere((r) => r.id == routine.id);
                                  _completedRoutines.remove(routine.id);
                                });
                                // Eliminar de la base de datos
                                await _healthService.deleteGymRoutine(routine.id);
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Rutina eliminada exitosamente')),
                                );
                              },
                              child: const Text(
                                'Eliminar',
                                style: TextStyle(color: Colors.red),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                    icon: const Icon(Icons.delete, size: 16),
                    label: const Text('Eliminar'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red,
                      side: const BorderSide(color: Colors.red),
                      padding: const EdgeInsets.symmetric(vertical: 12),
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

  Widget _buildWorkoutCard(Map<String, dynamic> workout) {
    final workoutDate = DateTime.tryParse(workout['date'] as String? ?? '');
    final isCompleted = _completedWorkouts.contains(workout['id'] as String? ?? '');
    final workoutName = workout['name'] as String? ?? 'Entrenamiento';
    final duration = workout['duration'] as int? ?? 0;
    final calories = workout['calories'] as int? ?? 0;
    final routineId = workout['routineId'] as String?;
    final isRecurring = workout['isRecurring'] == true;
    
    // Buscar la rutina asociada si existe
    GymRoutine? associatedRoutine;
    if (routineId != null) {
      try {
        associatedRoutine = _gymRoutines.firstWhere((r) => r.id == routineId);
      } catch (e) {
        associatedRoutine = null;
      }
    }
    
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: isCompleted ? Colors.green.withOpacity(0.3) : Colors.blue.withOpacity(0.3),
          width: 1,
        ),
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
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.blue.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'ENTRENAMIENTO',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          workoutName,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: isCompleted ? Colors.green : AppTheme.white,
                            decoration: isCompleted ? TextDecoration.lineThrough : null,
                          ),
                        ),
                      ),
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
                    child: const Icon(Icons.check_circle, size: 20, color: Colors.green),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            if (workoutDate != null) ...[
              Row(
                children: [
                  const Icon(Icons.calendar_today, size: 14, color: AppTheme.white70),
                  const SizedBox(width: 4),
                  Text(
                    DateFormat('dd/MM/yyyy').format(workoutDate),
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.white70,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
            ],
            Row(
              children: [
                if (duration > 0) ...[
                  const Icon(Icons.access_time, size: 14, color: AppTheme.orangeAccent),
                  const SizedBox(width: 4),
                  Text(
                    '$duration min',
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppTheme.orangeAccent,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(width: 16),
                ],
                if (calories > 0) ...[
                  const Icon(Icons.local_fire_department, size: 14, color: Colors.orange),
                  const SizedBox(width: 4),
                  Text(
                    '$calories cal',
                    style: const TextStyle(
                      fontSize: 14,
                      color: Colors.orange,
                    ),
                  ),
                ],
              ],
            ),
            if (associatedRoutine != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.fitness_center, size: 14, color: Colors.green),
                  const SizedBox(width: 4),
                  Text(
                    'Rutina: ${associatedRoutine.name}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.green,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ],
              ),
            ],
            if (isRecurring) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.repeat, size: 14, color: Colors.blue),
                  const SizedBox(width: 4),
                  const Text(
                    'Recurrente',
                    style: TextStyle(
                      fontSize: 11,
                      color: Colors.blue,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ],
              ),
            ],
            const SizedBox(height: 12),
            // Botón para marcar como completado
            if (!isCompleted)
              Container(
                margin: const EdgeInsets.only(bottom: 8),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      setState(() {
                        _completedWorkouts.add(workout['id'] as String);
                        // Actualizar también en la semana actual si está ahí
                        final dateKey = workout['date'] as String?;
                        if (dateKey != null) {
                          final weekStart = DateTime.now().subtract(Duration(days: DateTime.now().weekday - 1));
                          final weekEnd = weekStart.add(const Duration(days: 6));
                          final workoutDate = DateTime.tryParse(dateKey);
                          if (workoutDate != null &&
                              workoutDate.isAfter(weekStart.subtract(const Duration(days: 1))) &&
                              workoutDate.isBefore(weekEnd.add(const Duration(days: 1)))) {
                            final dayOfWeek = workoutDate.weekday;
                            final weekDaysKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                            if (dayOfWeek >= 1 && dayOfWeek <= 7) {
                              final dayKey = weekDaysKeys[dayOfWeek - 1];
                              if (_currentWeekWorkouts[dayKey] is Map<String, dynamic>) {
                                (_currentWeekWorkouts[dayKey] as Map<String, dynamic>)['completed'] = true;
                              }
                            }
                          }
                        }
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Entrenamiento "$workoutName" marcado como completado')),
                      );
                    },
                    icon: const Icon(Icons.check_circle, size: 18),
                    label: const Text('Marcar como Completado'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
              )
            else
              Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.green.withOpacity(0.3)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.check_circle, color: Colors.green, size: 18),
                    const SizedBox(width: 8),
                    const Text(
                      'Completado',
                      style: TextStyle(
                        color: Colors.green,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const Spacer(),
                    TextButton(
                      onPressed: () {
                        setState(() {
                          _completedWorkouts.remove(workout['id'] as String);
                          // Actualizar también en la semana actual
                          final dateKey = workout['date'] as String?;
                          if (dateKey != null) {
                            final weekStart = DateTime.now().subtract(Duration(days: DateTime.now().weekday - 1));
                            final weekEnd = weekStart.add(const Duration(days: 6));
                            final workoutDate = DateTime.tryParse(dateKey);
                            if (workoutDate != null &&
                                workoutDate.isAfter(weekStart.subtract(const Duration(days: 1))) &&
                                workoutDate.isBefore(weekEnd.add(const Duration(days: 1)))) {
                              final dayOfWeek = workoutDate.weekday;
                              final weekDaysKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                              if (dayOfWeek >= 1 && dayOfWeek <= 7) {
                                final dayKey = weekDaysKeys[dayOfWeek - 1];
                                if (_currentWeekWorkouts[dayKey] is Map<String, dynamic>) {
                                  (_currentWeekWorkouts[dayKey] as Map<String, dynamic>)['completed'] = false;
                                }
                              }
                            }
                          }
                        });
                      },
                      child: const Text('Desmarcar', style: TextStyle(color: Colors.green)),
                    ),
                  ],
                ),
              ),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
                          backgroundColor: AppTheme.darkSurface,
                          title: const Text(
                            'Eliminar Entrenamiento',
                            style: TextStyle(color: AppTheme.white),
                          ),
                          content: Text(
                            '¿Estás seguro de que deseas eliminar el entrenamiento "$workoutName"?',
                            style: const TextStyle(color: AppTheme.white70),
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text('Cancelar'),
                            ),
                            TextButton(
                              onPressed: () async {
                                setState(() {
                                  _workouts.removeWhere((w) => w['id'] == workout['id']);
                                  _completedWorkouts.remove(workout['id'] as String);
                                  // Limpiar semana actual para recalcular
                                  _currentWeekWorkouts.clear();
                                });
                                // Eliminar de la base de datos
                                await _healthService.deleteWorkout(workout['id'] as String);
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Entrenamiento eliminado exitosamente')),
                                );
                              },
                              child: const Text(
                                'Eliminar',
                                style: TextStyle(color: Colors.red),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                    icon: const Icon(Icons.delete, size: 16),
                    label: const Text('Eliminar'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red,
                      side: const BorderSide(color: Colors.red),
                      padding: const EdgeInsets.symmetric(vertical: 12),
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

  void _showAddGymRoutineModal() {
    // Limpiar controladores si no está editando
    if (_editingGymRoutine == null) {
      _gymRoutineNameController.clear();
      _gymRoutineDescriptionController.clear();
      _gymRoutineDurationController.clear();
      _selectedGymRoutineDifficulty = 'Principiante';
      _gymRoutineIsRecurring = false;
      _gymRoutineRecurrenceType = null;
      _gymRoutineRecurrenceDays = [];
      _gymRoutineStartDate = null;
      _gymRoutineEndDate = null;
    }
    
    showDialog(
      context: context,
      builder: (context) => _buildAddGymRoutineModal(),
    ).then((_) {
      setState(() {
        _showAddGymModal = false;
      });
    });
  }

  Widget _buildAddGymRoutineModal() {
    return StatefulBuilder(
      builder: (context, setModalState) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 500, maxHeight: 600),
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
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.green, Colors.green.shade700],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(28),
                    topRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.fitness_center, color: AppTheme.white, size: 28),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        _editingGymRoutine == null ? 'Nueva Rutina' : 'Editar Rutina',
                        style: const TextStyle(
                          color: AppTheme.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: () {
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
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Nombre
                      TextField(
                        controller: _gymRoutineNameController,
                        decoration: InputDecoration(
                          labelText: 'Nombre de la rutina *',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.fitness_center, color: Colors.green),
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
                            borderSide: const BorderSide(color: Colors.green),
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      // Descripción
                      TextField(
                        controller: _gymRoutineDescriptionController,
                        maxLines: 3,
                        decoration: InputDecoration(
                          labelText: 'Descripción',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.description, color: Colors.green),
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
                            borderSide: const BorderSide(color: Colors.green),
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      // Duración
                      TextField(
                        controller: _gymRoutineDurationController,
                        keyboardType: TextInputType.text,
                        decoration: InputDecoration(
                          labelText: 'Duración (ej: 45 min) *',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.access_time, color: Colors.green),
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
                            borderSide: const BorderSide(color: Colors.green),
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      // Dificultad
                      DropdownButtonFormField<String>(
                        value: _selectedGymRoutineDifficulty,
                        decoration: InputDecoration(
                          labelText: 'Dificultad *',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.speed, color: Colors.green),
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
                            borderSide: const BorderSide(color: Colors.green),
                          ),
                        ),
                        dropdownColor: AppTheme.darkSurface,
                        style: const TextStyle(color: AppTheme.white),
                        items: ['Principiante', 'Intermedio', 'Avanzado', 'Experto']
                            .map((difficulty) => DropdownMenuItem(
                                  value: difficulty,
                                  child: Text(difficulty),
                                ))
                            .toList(),
                        onChanged: (value) {
                          setModalState(() {
                            _selectedGymRoutineDifficulty = value ?? 'Principiante';
                          });
                        },
                      ),
                      const SizedBox(height: 16),
                      // Recurrencia
                      CheckboxListTile(
                        title: const Text(
                          'Rutina Recurrente',
                          style: TextStyle(color: AppTheme.white),
                        ),
                        subtitle: const Text(
                          'Repetir esta rutina automáticamente',
                          style: TextStyle(color: AppTheme.white70, fontSize: 12),
                        ),
                        value: _gymRoutineIsRecurring,
                        onChanged: (value) {
                          setModalState(() {
                            _gymRoutineIsRecurring = value ?? false;
                            if (!_gymRoutineIsRecurring) {
                              _gymRoutineRecurrenceType = null;
                              _gymRoutineRecurrenceDays = [];
                            }
                          });
                        },
                        activeColor: Colors.green,
                        checkColor: AppTheme.white,
                        tileColor: AppTheme.darkBackground.withOpacity(0.5),
                      ),
                      if (_gymRoutineIsRecurring) ...[
                        const SizedBox(height: 16),
                        DropdownButtonFormField<String>(
                          value: _gymRoutineRecurrenceType,
                          decoration: InputDecoration(
                            labelText: 'Tipo de Recurrencia *',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.repeat, color: Colors.green),
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
                              borderSide: const BorderSide(color: Colors.green),
                            ),
                          ),
                          dropdownColor: AppTheme.darkSurface,
                          style: const TextStyle(color: AppTheme.white),
                          items: [
                            const DropdownMenuItem(value: 'daily', child: Text('Diario')),
                            const DropdownMenuItem(value: 'weekly', child: Text('Semanal')),
                            const DropdownMenuItem(value: 'monthly', child: Text('Mensual')),
                          ],
                          onChanged: (value) {
                            setModalState(() {
                              _gymRoutineRecurrenceType = value;
                              if (value != 'weekly') {
                                _gymRoutineRecurrenceDays = [];
                              }
                            });
                          },
                        ),
                        if (_gymRoutineRecurrenceType == 'weekly') ...[
                          const SizedBox(height: 16),
                          const Text(
                            'Días de la semana:',
                            style: TextStyle(color: AppTheme.white70, fontSize: 14),
                          ),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            children: [
                              'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'
                            ].asMap().entries.map((entry) {
                              final index = entry.key + 1; // 1-7
                              final dayName = entry.value;
                              final isSelected = _gymRoutineRecurrenceDays.contains(index);
                              return FilterChip(
                                label: Text(dayName),
                                selected: isSelected,
                                onSelected: (selected) {
                                  setModalState(() {
                                    if (selected) {
                                      _gymRoutineRecurrenceDays.add(index);
                                    } else {
                                      _gymRoutineRecurrenceDays.remove(index);
                                    }
                                  });
                                },
                                selectedColor: Colors.green.withOpacity(0.3),
                                checkmarkColor: Colors.green,
                                labelStyle: TextStyle(
                                  color: isSelected ? Colors.green : AppTheme.white70,
                                ),
                              );
                            }).toList(),
                          ),
                        ],
                        const SizedBox(height: 16),
                        // Fecha de inicio
                        GestureDetector(
                          onTap: () async {
                            final date = await showDatePicker(
                              context: context,
                              initialDate: _gymRoutineStartDate ?? DateTime.now(),
                              firstDate: DateTime.now(),
                              lastDate: DateTime.now().add(const Duration(days: 365)),
                            );
                            if (date != null) {
                              setModalState(() {
                                _gymRoutineStartDate = date;
                              });
                            }
                          },
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppTheme.darkBackground.withOpacity(0.5),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.green.withOpacity(0.3)),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.calendar_today, color: Colors.green),
                                const SizedBox(width: 12),
                                Text(
                                  _gymRoutineStartDate != null
                                      ? DateFormat('dd/MM/yyyy').format(_gymRoutineStartDate!)
                                      : 'Fecha de inicio (opcional)',
                                  style: TextStyle(
                                    color: _gymRoutineStartDate != null
                                        ? AppTheme.white
                                        : AppTheme.white70,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        // Fecha de fin
                        GestureDetector(
                          onTap: () async {
                            final date = await showDatePicker(
                              context: context,
                              initialDate: _gymRoutineEndDate ?? DateTime.now().add(const Duration(days: 30)),
                              firstDate: _gymRoutineStartDate ?? DateTime.now(),
                              lastDate: DateTime.now().add(const Duration(days: 365)),
                            );
                            if (date != null) {
                              setModalState(() {
                                _gymRoutineEndDate = date;
                              });
                            }
                          },
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppTheme.darkBackground.withOpacity(0.5),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.green.withOpacity(0.3)),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.event_busy, color: Colors.green),
                                const SizedBox(width: 12),
                                Text(
                                  _gymRoutineEndDate != null
                                      ? DateFormat('dd/MM/yyyy').format(_gymRoutineEndDate!)
                                      : 'Fecha de fin (opcional)',
                                  style: TextStyle(
                                    color: _gymRoutineEndDate != null
                                        ? AppTheme.white
                                        : AppTheme.white70,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                      const SizedBox(height: 24),
                      // Botones
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () {
                                Navigator.pop(context);
                              },
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.green,
                                side: const BorderSide(color: Colors.green),
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
                            child: ElevatedButton(
                              onPressed: () async {
                                if (_gymRoutineNameController.text.trim().isEmpty ||
                                    _gymRoutineDurationController.text.trim().isEmpty) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('Por favor completa todos los campos requeridos'),
                                    ),
                                  );
                                  return;
                                }
                                if (_gymRoutineIsRecurring && _gymRoutineRecurrenceType == null) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('Por favor selecciona un tipo de recurrencia'),
                                    ),
                                  );
                                  return;
                                }
                                
                                final newRoutine = GymRoutine(
                                  id: _editingGymRoutine?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
                                  name: _gymRoutineNameController.text.trim(),
                                  description: _gymRoutineDescriptionController.text.trim(),
                                  duration: _gymRoutineDurationController.text.trim(),
                                  difficulty: _selectedGymRoutineDifficulty,
                                  exercises: _editingGymRoutine?.exercises ?? [],
                                  isRecurring: _gymRoutineIsRecurring,
                                  recurrenceType: _gymRoutineIsRecurring ? _gymRoutineRecurrenceType : null,
                                  recurrenceDays: _gymRoutineIsRecurring && _gymRoutineRecurrenceType == 'weekly' 
                                      ? _gymRoutineRecurrenceDays 
                                      : null,
                                  startDate: _gymRoutineStartDate,
                                  endDate: _gymRoutineEndDate,
                                );
                                
                                setState(() {
                                  if (_editingGymRoutine != null) {
                                    final index = _gymRoutines.indexWhere((r) => r.id == _editingGymRoutine!.id);
                                    if (index != -1) {
                                      _gymRoutines[index] = newRoutine;
                                    }
                                  } else {
                                    _gymRoutines.add(newRoutine);
                                  }
                                });
                                
                                // Guardar en la base de datos
                                await _healthService.saveGymRoutine({
                                  'id': newRoutine.id,
                                  'name': newRoutine.name,
                                  'description': newRoutine.description,
                                  'duration': newRoutine.duration,
                                  'difficulty': newRoutine.difficulty,
                                  'exercises': newRoutine.exercises.map((e) => e.toJson()).toList(),
                                  'isRecurring': newRoutine.isRecurring,
                                  'recurrenceType': newRoutine.recurrenceType,
                                  'recurrenceDays': newRoutine.recurrenceDays,
                                  'startDate': newRoutine.startDate,
                                  'endDate': newRoutine.endDate,
                                });
                                
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(_editingGymRoutine == null
                                        ? 'Rutina creada exitosamente'
                                        : 'Rutina actualizada exitosamente'),
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.green,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: Text(_editingGymRoutine == null ? 'Crear' : 'Actualizar'),
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

  void _showAddWorkoutModalDialog() {
    // Limpiar controladores
    _workoutNameController.clear();
    _workoutDurationController.clear();
    _workoutCaloriesController.clear();
    _selectedWorkoutDate = DateTime.now();
    _selectedWorkoutRoutineId = null;
    _workoutIsRecurring = false;
    _workoutRecurrenceType = null;
    _workoutRecurrenceDays = [];
    _workoutStartDate = null;
    _workoutEndDate = null;
    
    showDialog(
      context: context,
      builder: (context) => _buildAddWorkoutModal(),
    ).then((_) {
      setState(() {
        _showAddWorkoutModal = false;
      });
    });
  }

  Widget _buildAddWorkoutModal() {
    return StatefulBuilder(
      builder: (context, setModalState) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 500, maxHeight: 600),
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
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.blue, Colors.blue.shade700],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(28),
                    topRight: Radius.circular(28),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.directions_run, color: AppTheme.white, size: 28),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Text(
                        'Registrar Entrenamiento',
                        style: TextStyle(
                          color: AppTheme.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: () {
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
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Fecha
                      GestureDetector(
                        onTap: () async {
                          final date = await showDatePicker(
                            context: context,
                            initialDate: _selectedWorkoutDate,
                            firstDate: DateTime(2020),
                            lastDate: DateTime.now(),
                          );
                          if (date != null) {
                            setModalState(() {
                              _selectedWorkoutDate = date;
                            });
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
                              const Icon(Icons.calendar_today, color: Colors.blue),
                              const SizedBox(width: 12),
                              Text(
                                DateFormat('dd/MM/yyyy').format(_selectedWorkoutDate),
                                style: const TextStyle(color: AppTheme.white, fontSize: 16),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Nombre del entrenamiento
                      TextField(
                        controller: _workoutNameController,
                        decoration: InputDecoration(
                          labelText: 'Nombre del entrenamiento *',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.fitness_center, color: Colors.blue),
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
                            borderSide: const BorderSide(color: Colors.blue),
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      // Rutina (opcional)
                      if (_gymRoutines.isNotEmpty)
                        DropdownButtonFormField<String>(
                          value: _selectedWorkoutRoutineId,
                          decoration: InputDecoration(
                            labelText: 'Rutina (opcional)',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.list, color: Colors.blue),
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
                              borderSide: const BorderSide(color: Colors.blue),
                            ),
                          ),
                          dropdownColor: AppTheme.darkSurface,
                          style: const TextStyle(color: AppTheme.white),
                          items: [
                            const DropdownMenuItem<String>(
                              value: null,
                              child: Text('Ninguna'),
                            ),
                            ..._gymRoutines.map((routine) => DropdownMenuItem(
                                  value: routine.id,
                                  child: Text(routine.name),
                                )),
                          ],
                          onChanged: (value) {
                            setModalState(() {
                              _selectedWorkoutRoutineId = value;
                              if (value != null) {
                                final routine = _gymRoutines.firstWhere((r) => r.id == value);
                                _workoutNameController.text = routine.name;
                                _workoutDurationController.text = routine.duration;
                              }
                            });
                          },
                        ),
                      if (_gymRoutines.isNotEmpty) const SizedBox(height: 16),
                      // Duración
                      TextField(
                        controller: _workoutDurationController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Duración (minutos) *',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.access_time, color: Colors.blue),
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
                            borderSide: const BorderSide(color: Colors.blue),
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      // Calorías
                      TextField(
                        controller: _workoutCaloriesController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Calorías quemadas (opcional)',
                          labelStyle: const TextStyle(color: AppTheme.white70),
                          prefixIcon: const Icon(Icons.local_fire_department, color: Colors.blue),
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
                            borderSide: const BorderSide(color: Colors.blue),
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      // Recurrencia
                      CheckboxListTile(
                        title: const Text(
                          'Entrenamiento Recurrente',
                          style: TextStyle(color: AppTheme.white),
                        ),
                        subtitle: const Text(
                          'Repetir este entrenamiento automáticamente',
                          style: TextStyle(color: AppTheme.white70, fontSize: 12),
                        ),
                        value: _workoutIsRecurring,
                        onChanged: (value) {
                          setModalState(() {
                            _workoutIsRecurring = value ?? false;
                            if (!_workoutIsRecurring) {
                              _workoutRecurrenceType = null;
                              _workoutRecurrenceDays = [];
                            }
                          });
                        },
                        activeColor: Colors.blue,
                        checkColor: AppTheme.white,
                        tileColor: AppTheme.darkBackground.withOpacity(0.5),
                      ),
                      if (_workoutIsRecurring) ...[
                        const SizedBox(height: 16),
                        DropdownButtonFormField<String>(
                          value: _workoutRecurrenceType,
                          decoration: InputDecoration(
                            labelText: 'Tipo de Recurrencia *',
                            labelStyle: const TextStyle(color: AppTheme.white70),
                            prefixIcon: const Icon(Icons.repeat, color: Colors.blue),
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
                              borderSide: const BorderSide(color: Colors.blue),
                            ),
                          ),
                          dropdownColor: AppTheme.darkSurface,
                          style: const TextStyle(color: AppTheme.white),
                          items: [
                            const DropdownMenuItem(value: 'daily', child: Text('Diario')),
                            const DropdownMenuItem(value: 'weekly', child: Text('Semanal')),
                            const DropdownMenuItem(value: 'monthly', child: Text('Mensual')),
                          ],
                          onChanged: (value) {
                            setModalState(() {
                              _workoutRecurrenceType = value;
                              if (value != 'weekly') {
                                _workoutRecurrenceDays = [];
                              }
                            });
                          },
                        ),
                        if (_workoutRecurrenceType == 'weekly') ...[
                          const SizedBox(height: 16),
                          const Text(
                            'Días de la semana:',
                            style: TextStyle(color: AppTheme.white70, fontSize: 14),
                          ),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            children: [
                              'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'
                            ].asMap().entries.map((entry) {
                              final index = entry.key + 1;
                              final dayName = entry.value;
                              final isSelected = _workoutRecurrenceDays.contains(index);
                              return FilterChip(
                                label: Text(dayName),
                                selected: isSelected,
                                onSelected: (selected) {
                                  setModalState(() {
                                    if (selected) {
                                      _workoutRecurrenceDays.add(index);
                                    } else {
                                      _workoutRecurrenceDays.remove(index);
                                    }
                                  });
                                },
                                selectedColor: Colors.blue.withOpacity(0.3),
                                checkmarkColor: Colors.blue,
                                labelStyle: TextStyle(
                                  color: isSelected ? Colors.blue : AppTheme.white70,
                                ),
                              );
                            }).toList(),
                          ),
                        ],
                        const SizedBox(height: 16),
                        // Fecha de inicio
                        GestureDetector(
                          onTap: () async {
                            final date = await showDatePicker(
                              context: context,
                              initialDate: _workoutStartDate ?? _selectedWorkoutDate,
                              firstDate: DateTime.now(),
                              lastDate: DateTime.now().add(const Duration(days: 365)),
                            );
                            if (date != null) {
                              setModalState(() {
                                _workoutStartDate = date;
                              });
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
                                const Icon(Icons.calendar_today, color: Colors.blue),
                                const SizedBox(width: 12),
                                Text(
                                  _workoutStartDate != null
                                      ? DateFormat('dd/MM/yyyy').format(_workoutStartDate!)
                                      : 'Fecha de inicio (opcional)',
                                  style: TextStyle(
                                    color: _workoutStartDate != null
                                        ? AppTheme.white
                                        : AppTheme.white70,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        // Fecha de fin
                        GestureDetector(
                          onTap: () async {
                            final date = await showDatePicker(
                              context: context,
                              initialDate: _workoutEndDate ?? (_workoutStartDate ?? _selectedWorkoutDate).add(const Duration(days: 30)),
                              firstDate: _workoutStartDate ?? DateTime.now(),
                              lastDate: DateTime.now().add(const Duration(days: 365)),
                            );
                            if (date != null) {
                              setModalState(() {
                                _workoutEndDate = date;
                              });
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
                                const Icon(Icons.event_busy, color: Colors.blue),
                                const SizedBox(width: 12),
                                Text(
                                  _workoutEndDate != null
                                      ? DateFormat('dd/MM/yyyy').format(_workoutEndDate!)
                                      : 'Fecha de fin (opcional)',
                                  style: TextStyle(
                                    color: _workoutEndDate != null
                                        ? AppTheme.white
                                        : AppTheme.white70,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                      const SizedBox(height: 24),
                      // Botones
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () {
                                Navigator.pop(context);
                              },
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.blue,
                                side: const BorderSide(color: Colors.blue),
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
                            child: ElevatedButton(
                              onPressed: () async {
                                if (_workoutNameController.text.trim().isEmpty ||
                                    _workoutDurationController.text.trim().isEmpty) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('Por favor completa todos los campos requeridos'),
                                    ),
                                  );
                                  return;
                                }
                                if (_workoutIsRecurring && _workoutRecurrenceType == null) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('Por favor selecciona un tipo de recurrencia'),
                                    ),
                                  );
                                  return;
                                }
                                
                                // Crear entrenamiento(s) - si es recurrente, crear múltiples
                                final workoutsToCreate = <Map<String, dynamic>>[];
                                
                                if (_workoutIsRecurring) {
                                  // Generar entrenamientos recurrentes
                                  final startDate = _workoutStartDate ?? _selectedWorkoutDate;
                                  final endDate = _workoutEndDate ?? startDate.add(const Duration(days: 30));
                                  DateTime currentDate = startDate;
                                  
                                  while (currentDate.isBefore(endDate) || currentDate.isAtSameMomentAs(endDate)) {
                                    bool shouldCreate = false;
                                    
                                    switch (_workoutRecurrenceType) {
                                      case 'daily':
                                        shouldCreate = true;
                                        break;
                                      case 'weekly':
                                        if (_workoutRecurrenceDays.contains(currentDate.weekday)) {
                                          shouldCreate = true;
                                        }
                                        break;
                                      case 'monthly':
                                        if (currentDate.day == startDate.day) {
                                          shouldCreate = true;
                                        }
                                        break;
                                    }
                                    
                                    if (shouldCreate) {
                                      workoutsToCreate.add({
                                        'id': '${DateTime.now().millisecondsSinceEpoch}_${currentDate.millisecondsSinceEpoch}',
                                        'name': _workoutNameController.text.trim(),
                                        'date': DateFormat('yyyy-MM-dd').format(currentDate),
                                        'duration': int.tryParse(_workoutDurationController.text.trim()) ?? 0,
                                        'calories': int.tryParse(_workoutCaloriesController.text.trim()) ?? 0,
                                        'routineId': _selectedWorkoutRoutineId,
                                        'timestamp': currentDate.toIso8601String(),
                                        'isRecurring': true,
                                        'completed': false, // No marcar automáticamente
                                      });
                                    }
                                    
                                    currentDate = currentDate.add(const Duration(days: 1));
                                  }
                                } else {
                                  // Entrenamiento único
                                  workoutsToCreate.add({
                                    'id': DateTime.now().millisecondsSinceEpoch.toString(),
                                    'name': _workoutNameController.text.trim(),
                                    'date': DateFormat('yyyy-MM-dd').format(_selectedWorkoutDate),
                                    'duration': int.tryParse(_workoutDurationController.text.trim()) ?? 0,
                                    'calories': int.tryParse(_workoutCaloriesController.text.trim()) ?? 0,
                                    'routineId': _selectedWorkoutRoutineId,
                                    'timestamp': DateTime.now().toIso8601String(),
                                    'isRecurring': false,
                                    'completed': false, // No marcar automáticamente
                                  });
                                }
                                
                                setState(() {
                                  for (final workout in workoutsToCreate) {
                                    _workouts.add(workout);
                                    
                                    // Actualizar datos de fitness (solo si no está completado)
                                    final dateKey = workout['date'] as String;
                                    if (_fitnessData[dateKey] == null) {
                                      _fitnessData[dateKey] = {};
                                    }
                                    // No marcar automáticamente como completado
                                    
                                    // Actualizar semana actual si el entrenamiento es de esta semana
                                    final workoutDate = DateTime.tryParse(workout['date'] as String);
                                    if (workoutDate != null) {
                                      final currentWeekStart = DateTime.now().subtract(Duration(days: DateTime.now().weekday - 1));
                                      final currentWeekEnd = currentWeekStart.add(const Duration(days: 6));
                                      if (workoutDate.isAfter(currentWeekStart.subtract(const Duration(days: 1))) &&
                                          workoutDate.isBefore(currentWeekEnd.add(const Duration(days: 1)))) {
                                        final dayOfWeek = workoutDate.weekday;
                                        final weekDaysKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                                        if (dayOfWeek >= 1 && dayOfWeek <= 7) {
                                          final dayKey = weekDaysKeys[dayOfWeek - 1];
                                          // Limpiar semana si cambió
                                          if (_currentWeekWorkouts['_weekStart'] != currentWeekStart) {
                                            _currentWeekWorkouts.clear();
                                            _currentWeekWorkouts['_weekStart'] = currentWeekStart;
                                          }
                                          _currentWeekWorkouts[dayKey] = {
                                            'workout': workout['name'] as String? ?? 'Entrenamiento',
                                            'duration': workout['duration'] as int? ?? 0,
                                            'calories': workout['calories'] as int? ?? 0,
                                            'completed': false, // No marcar automáticamente
                                            'workoutId': workout['id'] as String,
                                          };
                                        }
                                      }
                                    }
                                  }
                                });
                                
                                // Guardar todos los entrenamientos en la base de datos
                                for (final workout in workoutsToCreate) {
                                  await _healthService.saveWorkout({
                                    'id': workout['id'],
                                    'name': workout['name'],
                                    'date': workout['date'],
                                    'duration': workout['duration'],
                                    'calories': workout['calories'],
                                    'routineId': workout['routineId'],
                                    'timestamp': workout['timestamp'],
                                    'isRecurring': workout['isRecurring'],
                                    'recurrenceType': _workoutIsRecurring ? _workoutRecurrenceType : null,
                                    'recurrenceDays': _workoutIsRecurring && _workoutRecurrenceType == 'weekly' 
                                        ? _workoutRecurrenceDays 
                                        : null,
                                    'startDate': _workoutStartDate,
                                    'endDate': _workoutEndDate,
                                    'completed': workout['completed'],
                                  });
                                }
                                
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(workoutsToCreate.length > 1
                                        ? '${workoutsToCreate.length} entrenamientos creados exitosamente'
                                        : 'Entrenamiento registrado exitosamente'),
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.blue,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: const Text('Registrar'),
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

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  // Mostrar modal para registrar actividad de fitness
  void _showAddFitnessActivityModal() {
    // Limpiar controladores y establecer valores por defecto
    final today = DateFormat('yyyy-MM-dd').format(_selectedFitnessDate);
    final todayData = _fitnessData[today] ?? {};
    
    _fitnessStepsController.text = todayData['steps']?.toString() ?? '';
    _fitnessCaloriesController.text = todayData['caloriesOut']?.toString() ?? '';
    _fitnessWaterController.text = todayData['water']?.toString() ?? '';
    _fitnessHasWorkout = todayData['workout'] == true;
    
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => _buildAddFitnessActivityModal(),
    );
  }

  Widget _buildAddFitnessActivityModal() {
    return StatefulBuilder(
      builder: (context, setModalState) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 500, maxHeight: 600),
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
                    colors: [Colors.green.withOpacity(0.3), Colors.green.withOpacity(0.1)],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    topRight: Radius.circular(20),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.add_circle_outline, color: Colors.green, size: 28),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Text(
                        'Registrar Actividad de Fitness',
                        style: TextStyle(
                          color: AppTheme.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Fecha
                      GestureDetector(
                        onTap: () async {
                          final date = await showDatePicker(
                            context: context,
                            initialDate: _selectedFitnessDate,
                            firstDate: DateTime.now().subtract(const Duration(days: 365)),
                            lastDate: DateTime.now().add(const Duration(days: 1)),
                          );
                          if (date != null) {
                            setModalState(() {
                              _selectedFitnessDate = date;
                              // Actualizar valores con los datos de la nueva fecha
                              final dateKey = DateFormat('yyyy-MM-dd').format(date);
                              final dateData = _fitnessData[dateKey] ?? {};
                              _fitnessStepsController.text = dateData['steps']?.toString() ?? '';
                              _fitnessCaloriesController.text = dateData['caloriesOut']?.toString() ?? '';
                              _fitnessWaterController.text = dateData['water']?.toString() ?? '';
                              _fitnessHasWorkout = dateData['workout'] == true;
                            });
                          }
                        },
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppTheme.darkBackground.withOpacity(0.5),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: Colors.green.withOpacity(0.3)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.calendar_today, color: Colors.green),
                              const SizedBox(width: 12),
                              Text(
                                DateFormat('dd/MM/yyyy').format(_selectedFitnessDate),
                                style: const TextStyle(
                                  color: AppTheme.white,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      
                      // Pasos
                      TextField(
                        controller: _fitnessStepsController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Pasos',
                          hintText: 'Ej: 10000',
                          prefixIcon: const Icon(Icons.directions_walk, color: Colors.green),
                          filled: true,
                          fillColor: AppTheme.darkBackground,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      
                      // Calorías
                      TextField(
                        controller: _fitnessCaloriesController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Calorías quemadas',
                          hintText: 'Ej: 500',
                          prefixIcon: const Icon(Icons.local_fire_department, color: Colors.red),
                          filled: true,
                          fillColor: AppTheme.darkBackground,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      
                      // Agua
                      TextField(
                        controller: _fitnessWaterController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          labelText: 'Vasos de agua',
                          hintText: 'Ej: 8',
                          prefixIcon: const Icon(Icons.water_drop, color: Colors.blue),
                          filled: true,
                          fillColor: AppTheme.darkBackground,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      
                      // Ejercicio completado
                      CheckboxListTile(
                        title: const Text(
                          'Ejercicio completado',
                          style: TextStyle(color: AppTheme.white),
                        ),
                        value: _fitnessHasWorkout,
                        onChanged: (value) {
                          setModalState(() {
                            _fitnessHasWorkout = value ?? false;
                          });
                        },
                        activeColor: Colors.orange,
                        checkColor: AppTheme.white,
                        tileColor: AppTheme.darkBackground,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      const SizedBox(height: 24),
                      
                      // Botones
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => Navigator.pop(context),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.green,
                                side: const BorderSide(color: Colors.green),
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
                            child: ElevatedButton(
                              onPressed: () {
                                final dateKey = DateFormat('yyyy-MM-dd').format(_selectedFitnessDate);
                                setState(() {
                                  _fitnessData[dateKey] = {
                                    'steps': _fitnessStepsController.text.trim().isNotEmpty 
                                        ? int.tryParse(_fitnessStepsController.text.trim()) ?? 0 
                                        : 0,
                                    'caloriesOut': _fitnessCaloriesController.text.trim().isNotEmpty 
                                        ? int.tryParse(_fitnessCaloriesController.text.trim()) ?? 0 
                                        : 0,
                                    'water': _fitnessWaterController.text.trim().isNotEmpty 
                                        ? int.tryParse(_fitnessWaterController.text.trim()) ?? 0 
                                        : 0,
                                    'workout': _fitnessHasWorkout,
                                  };
                                });
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Actividad registrada exitosamente')),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.green,
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

  // Mostrar modal para crear/editar objetivo deportivo
  void _showAddSportsGoalModal() {
    // Limpiar controladores si no está editando
    if (_editingSportsGoal == null) {
      _sportsGoalSportController.clear();
      _sportsGoalObjectiveController.clear();
      _sportsGoalProgressController.clear();
      _sportsGoalNotesController.clear();
      _sportsGoalTargetDate = DateTime.now().add(const Duration(days: 30));
    } else {
      // Llenar con datos del objetivo a editar
      _sportsGoalSportController.text = _editingSportsGoal!.sport;
      _sportsGoalObjectiveController.text = _editingSportsGoal!.objective;
      _sportsGoalProgressController.text = _editingSportsGoal!.currentProgress;
      _sportsGoalNotesController.text = _editingSportsGoal!.notes ?? '';
      _sportsGoalTargetDate = _editingSportsGoal!.targetDate;
    }
    
    setState(() {
      _showAddSportsModal = false;
    });
    
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => _buildAddSportsGoalModal(),
    );
  }

  Widget _buildAddSportsGoalModal() {
    return StatefulBuilder(
      builder: (context, setModalState) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          constraints: const BoxConstraints(maxWidth: 500, maxHeight: 600),
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
                    colors: [Colors.blue.withOpacity(0.3), Colors.blue.withOpacity(0.1)],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    topRight: Radius.circular(20),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.emoji_events, color: Colors.blue, size: 28),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Text(
                        _editingSportsGoal == null ? 'Crear Objetivo Deportivo' : 'Editar Objetivo',
                        style: const TextStyle(
                          color: AppTheme.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () {
                        setState(() {
                          _editingSportsGoal = null;
                        });
                        Navigator.pop(context);
                      },
                    ),
                  ],
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Deporte
                      TextField(
                        controller: _sportsGoalSportController,
                        decoration: InputDecoration(
                          labelText: 'Deporte',
                          hintText: 'Ej: Running, Natación, Ciclismo',
                          prefixIcon: const Icon(Icons.sports_soccer, color: Colors.blue),
                          filled: true,
                          fillColor: AppTheme.darkBackground,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      
                      // Objetivo
                      TextField(
                        controller: _sportsGoalObjectiveController,
                        decoration: InputDecoration(
                          labelText: 'Objetivo',
                          hintText: 'Ej: Correr 5km en 25 minutos',
                          prefixIcon: const Icon(Icons.flag, color: Colors.blue),
                          filled: true,
                          fillColor: AppTheme.darkBackground,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                        maxLines: 2,
                      ),
                      const SizedBox(height: 16),
                      
                      // Fecha objetivo
                      GestureDetector(
                        onTap: () async {
                          final date = await showDatePicker(
                            context: context,
                            initialDate: _sportsGoalTargetDate ?? DateTime.now().add(const Duration(days: 30)),
                            firstDate: DateTime.now(),
                            lastDate: DateTime.now().add(const Duration(days: 365)),
                          );
                          if (date != null) {
                            setModalState(() {
                              _sportsGoalTargetDate = date;
                            });
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
                              const Icon(Icons.calendar_today, color: Colors.blue),
                              const SizedBox(width: 12),
                              Text(
                                _sportsGoalTargetDate != null
                                    ? DateFormat('dd/MM/yyyy').format(_sportsGoalTargetDate!)
                                    : 'Fecha objetivo',
                                style: const TextStyle(
                                  color: AppTheme.white,
                                  fontSize: 16,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // Progreso actual
                      TextField(
                        controller: _sportsGoalProgressController,
                        decoration: InputDecoration(
                          labelText: 'Progreso actual',
                          hintText: 'Ej: 3km en 20 minutos',
                          prefixIcon: const Icon(Icons.trending_up, color: Colors.blue),
                          filled: true,
                          fillColor: AppTheme.darkBackground,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      
                      // Notas
                      TextField(
                        controller: _sportsGoalNotesController,
                        decoration: InputDecoration(
                          labelText: 'Notas (opcional)',
                          hintText: 'Agrega notas adicionales...',
                          prefixIcon: const Icon(Icons.note, color: Colors.blue),
                          filled: true,
                          fillColor: AppTheme.darkBackground,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                        maxLines: 3,
                      ),
                      const SizedBox(height: 24),
                      
                      // Botones
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () {
                                setState(() {
                                  _editingSportsGoal = null;
                                });
                                Navigator.pop(context);
                              },
                              style: OutlinedButton.styleFrom(
                                foregroundColor: Colors.blue,
                                side: const BorderSide(color: Colors.blue),
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
                            child: ElevatedButton(
                              onPressed: () {
                                if (_sportsGoalSportController.text.trim().isEmpty ||
                                    _sportsGoalObjectiveController.text.trim().isEmpty ||
                                    _sportsGoalTargetDate == null) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('Por favor completa todos los campos requeridos'),
                                    ),
                                  );
                                  return;
                                }
                                
                                final newGoal = SportsGoal(
                                  id: _editingSportsGoal?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
                                  sport: _sportsGoalSportController.text.trim(),
                                  objective: _sportsGoalObjectiveController.text.trim(),
                                  targetDate: _sportsGoalTargetDate!,
                                  currentProgress: _sportsGoalProgressController.text.trim().isNotEmpty
                                      ? _sportsGoalProgressController.text.trim()
                                      : 'Sin progreso',
                                  notes: _sportsGoalNotesController.text.trim().isNotEmpty
                                      ? _sportsGoalNotesController.text.trim()
                                      : null,
                                );
                                
                                final isEditing = _editingSportsGoal != null;
                                setState(() {
                                  if (isEditing) {
                                    final index = _sportsGoals.indexWhere((g) => g.id == _editingSportsGoal!.id);
                                    if (index != -1) {
                                      _sportsGoals[index] = newGoal;
                                    }
                                  } else {
                                    _sportsGoals.add(newGoal);
                                  }
                                  _editingSportsGoal = null;
                                });
                                
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(isEditing
                                        ? 'Objetivo actualizado exitosamente'
                                        : 'Objetivo creado exitosamente'),
                                  ),
                                );
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.blue,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              child: Text(_editingSportsGoal == null ? 'Crear' : 'Actualizar'),
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
}

