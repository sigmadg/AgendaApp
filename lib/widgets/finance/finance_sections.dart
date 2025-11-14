import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../models/finance/budget_category.dart';
import '../../models/finance/expense.dart';
import '../../models/finance/credit_card.dart';
import '../../models/finance/bill.dart';
import '../../models/finance/investment.dart';
import '../../models/finance/savings_goal.dart';
import '../../models/finance/shopping_item.dart';
import '../../auth/providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../../services/health_service.dart';
import '../common/navigation_header.dart';

class FinanceSections extends StatefulWidget {
  const FinanceSections({super.key});

  @override
  State<FinanceSections> createState() => _FinanceSectionsState();
}

class _FinanceSectionsState extends State<FinanceSections> {
  String _activeSection = 'budget-tracker';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final HealthService _healthService = HealthService();
  
  // Estados
  String _monthlyBudget = '';
  final TextEditingController _monthlyBudgetController = TextEditingController();
  List<BudgetCategory> _categories = [];
  List<Expense> _expenses = [];
  List<CreditCard> _creditCards = [];
  List<Bill> _bills = [];
  List<Investment> _investments = [];
  List<SavingsGoal> _savingsGoals = [];
  Map<String, List<Map<String, dynamic>>> _marketList = {
    'fruits': [],
    'vegetables': [],
    'dairy': [],
    'meat': [],
    'grains': [],
    'snacks': [],
  };

  // Estados para modales
  bool _showAddItemModal = false;
  String _selectedCategory = '';
  String _newItemText = '';
  int _newItemQuantity = 1;
  
  // Controladores para lista de compras
  final TextEditingController _itemNameController = TextEditingController();
  final TextEditingController _itemQuantityController = TextEditingController();
  final TextEditingController _itemUnitController = TextEditingController();
  final TextEditingController _newCategoryNameController = TextEditingController();
  final TextEditingController _newCategoryIconController = TextEditingController();
  bool _showAddCategoryModal = false;
  
  // Controladores para categorías de presupuesto
  final TextEditingController _categoryNameController = TextEditingController();
  BudgetCategory? _editingCategory;
  
  // Controladores para gastos
  final TextEditingController _expenseDescriptionController = TextEditingController();
  final TextEditingController _expenseAmountController = TextEditingController();
  final TextEditingController _expenseCategoryController = TextEditingController();
  final TextEditingController _expensePaymentMethodController = TextEditingController();
  DateTime? _expenseDate;
  Expense? _editingExpense;
  bool _expenseIsPinned = false;
  String? _selectedExpenseCategory;

  final sections = [
    {'id': 'budget-tracker', 'name': 'Presupuesto', 'icon': Icons.account_balance_wallet},
    {'id': 'expense-tracker', 'name': 'Gastos', 'icon': Icons.receipt},
    {'id': 'credit-card-manager', 'name': 'Tarjetas', 'icon': Icons.credit_card},
    {'id': 'bill-tracker', 'name': 'Facturas', 'icon': Icons.description},
    {'id': 'investment-tracker', 'name': 'Inversiones', 'icon': Icons.trending_up},
    {'id': 'savings-goals', 'name': 'Ahorros', 'icon': Icons.savings},
    {'id': 'shopping-list', 'name': 'Compras', 'icon': Icons.shopping_cart},
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
  void initState() {
    super.initState();
    // Inicializar categorías por defecto
    _categories = [
      BudgetCategory(id: '1', name: 'Alimentación', budget: '', spent: '', remaining: ''),
      BudgetCategory(id: '2', name: 'Transporte', budget: '', spent: '', remaining: ''),
      BudgetCategory(id: '3', name: 'Entretenimiento', budget: '', spent: '', remaining: ''),
      BudgetCategory(id: '4', name: 'Servicios', budget: '', spent: '', remaining: ''),
      BudgetCategory(id: '5', name: 'Salud', budget: '', spent: '', remaining: ''),
      BudgetCategory(id: '6', name: 'Otros', budget: '', spent: '', remaining: ''),
    ];
    _loadShoppingList();
  }

  Future<void> _loadShoppingList() async {
    try {
      final shoppingList = await _healthService.getShoppingList();
      if (shoppingList != null && mounted) {
        setState(() {
          _marketList = shoppingList;
        });
      }
    } catch (e) {
      print('FinanceSections: Error cargando lista de compras: $e');
    }
  }

  @override
  void dispose() {
    _monthlyBudgetController.dispose();
    _itemNameController.dispose();
    _itemQuantityController.dispose();
    _itemUnitController.dispose();
    _newCategoryNameController.dispose();
    _newCategoryIconController.dispose();
    _categoryNameController.dispose();
    _expenseDescriptionController.dispose();
    _expenseAmountController.dispose();
    _expenseCategoryController.dispose();
    _expensePaymentMethodController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppTheme.darkBackground,
      drawer: _buildNavigationDrawer(context),
      appBar: NavigationHeader(currentSection: 'finance'),
      body: Column(
        children: [
          _buildSectionTabs(),
          Expanded(
            child: _buildActiveSection(),
          ),
        ],
      ),
      floatingActionButton: _activeSection == 'expense-tracker'
          ? FloatingActionButton.extended(
              onPressed: () {
                _showAddExpenseDialog();
              },
              backgroundColor: const Color(0xFFF57F17),
              icon: const Icon(Icons.add, color: AppTheme.white),
              label: const Text(
                'Agregar Gasto',
                style: TextStyle(
                  color: AppTheme.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            )
          : null,
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
                  const Color(0xFFF57F17).withOpacity(0.3),
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
                    color: const Color(0xFFF57F17),
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
                            color: const Color(0xFFF57F17),
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
            color: const Color(0xFFF57F17),
            isActive: true,
            onTap: () {
              Navigator.pop(context);
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
          color: AppTheme.white,
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
                        ? const Color(0xFFF57F17).withOpacity(0.2)
                        : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isActive 
                          ? const Color(0xFFF57F17) 
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
                        color: AppTheme.white,
                        size: 20,
                      ),
                      const SizedBox(height: 2),
                      Flexible(
                        child: Text(
                          section['name'] as String,
                          style: TextStyle(
                            fontSize: 10,
                            color: AppTheme.white,
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
      case 'budget-tracker':
        return _buildBudgetTracker();
      case 'expense-tracker':
        return _buildExpenseTracker();
      case 'credit-card-manager':
        return _buildCreditCardManager();
      case 'bill-tracker':
        return _buildBillTracker();
      case 'investment-tracker':
        return _buildInvestmentTracker();
      case 'savings-goals':
        return _buildSavingsGoals();
      case 'shopping-list':
        return _buildShoppingList();
      default:
        return _buildBudgetTracker();
    }
  }

  // Helper para construir headers mejorados
  Widget _buildImprovedHeader(String title, String subtitle, IconData icon, Color color) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFFF57F17).withOpacity(0.2),
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
              color: const Color(0xFFF57F17).withOpacity(0.2),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(
              icon,
              size: 32,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Función para actualizar el gasto de cada categoría basándose en los gastos registrados
  void _updateCategorySpent() {
    // Calcular gastos por categoría
    final expensesByCategory = <String, double>{};
    for (var expense in _expenses) {
      final categoryName = expense.category.trim();
      if (categoryName.isNotEmpty) {
        final amount = double.tryParse(expense.amount) ?? 0.0;
        expensesByCategory[categoryName] = (expensesByCategory[categoryName] ?? 0.0) + amount;
      }
    }
    
    // Actualizar el campo "spent" de cada categoría
    setState(() {
      _categories = _categories.map((category) {
        // Buscar coincidencias exactas o parciales
        double totalSpent = 0.0;
        final categoryNameLower = category.name.toLowerCase().trim();
        
        // Primero buscar coincidencia exacta
        if (expensesByCategory.containsKey(category.name)) {
          totalSpent = expensesByCategory[category.name]!;
        } else {
          // Buscar coincidencias parciales (case-insensitive)
          for (var entry in expensesByCategory.entries) {
            final expenseCategoryLower = entry.key.toLowerCase().trim();
            
            // Coincidencias comunes
            bool matches = false;
            
            // Alimentación/Comida
            if ((categoryNameLower == 'alimentación' || categoryNameLower == 'comida') &&
                (expenseCategoryLower == 'comida' || expenseCategoryLower == 'alimentación' || 
                 expenseCategoryLower.contains('alimento') || expenseCategoryLower.contains('comida'))) {
              matches = true;
            }
            // Transporte
            else if (categoryNameLower.contains('transporte') && expenseCategoryLower.contains('transporte')) {
              matches = true;
            }
            // Entretenimiento
            else if (categoryNameLower.contains('entretenimiento') && expenseCategoryLower.contains('entretenimiento')) {
              matches = true;
            }
            // Servicios
            else if (categoryNameLower.contains('servicio') && expenseCategoryLower.contains('servicio')) {
              matches = true;
            }
            // Salud
            else if (categoryNameLower.contains('salud') && expenseCategoryLower.contains('salud')) {
              matches = true;
            }
            // Coincidencia exacta (case-insensitive)
            else if (categoryNameLower == expenseCategoryLower) {
              matches = true;
            }
            
            if (matches) {
              totalSpent += entry.value;
            }
          }
        }
        
        final budget = double.tryParse(category.budget) ?? 0.0;
        final remaining = budget - totalSpent;
        
        return BudgetCategory(
          id: category.id,
          name: category.name,
          budget: category.budget,
          spent: totalSpent.toStringAsFixed(2),
          remaining: remaining.toStringAsFixed(2),
        );
      }).toList();
    });
  }

  Widget _buildBudgetTracker() {
    // Actualizar gastos de categorías antes de mostrar
    _updateCategorySpent();
    
    // Calcular totales
    final totalBudget = _categories.fold<double>(
      0.0,
      (sum, cat) => sum + (double.tryParse(cat.budget) ?? 0.0),
    );
    final totalSpent = _categories.fold<double>(
      0.0,
      (sum, cat) => sum + (double.tryParse(cat.spent) ?? 0.0),
    );
    final totalRemaining = totalBudget - totalSpent;
    final budgetPercentage = totalBudget > 0 ? (totalSpent / totalBudget * 100).clamp(0.0, 100.0) : 0.0;
    
    return SingleChildScrollView(
      child: Column(
        children: [
          _buildImprovedHeader(
            'Presupuesto',
            'Controla tus gastos mensuales',
            Icons.account_balance_wallet,
            const Color(0xFFF57F17),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
              // Monthly Budget Card - Mejorado
              Container(
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: AppTheme.darkSurfaceVariant,
                    width: 1,
                  ),
                ),
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF57F17).withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.calendar_today,
                            color: const Color(0xFFF57F17),
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 16),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Presupuesto Mensual',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.white,
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                'Establece tu presupuesto total',
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
                    const SizedBox(height: 20),
                    TextFormField(
                      keyboardType: TextInputType.number,
                      controller: _monthlyBudgetController,
                      decoration: InputDecoration(
                        prefixText: '\$ ',
                        prefixStyle: const TextStyle(
                          color: const Color(0xFFF57F17),
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                        hintText: '0.00',
                        hintStyle: const TextStyle(color: AppTheme.white),
                        filled: true,
                        fillColor: AppTheme.darkBackground,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide(
                            color: AppTheme.darkSurfaceVariant,
                            width: 1,
                          ),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide(
                            color: AppTheme.darkSurfaceVariant,
                            width: 1,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(
                            color: const Color(0xFFF57F17),
                            width: 2,
                          ),
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
                      ),
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                      onChanged: (value) {
                        setState(() {
                          _monthlyBudget = value;
                        });
                      },
                      onFieldSubmitted: (value) {
                        if (value.trim().isNotEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Presupuesto mensual guardado'),
                              backgroundColor: Colors.green,
                              duration: Duration(seconds: 2),
                            ),
                          );
                        }
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              // Summary Cards - Mejoradas
              Row(
                children: [
                  Expanded(
                    child: _buildImprovedSummaryCard(
                      '${_categories.length}',
                      'Categorías',
                      Icons.folder,
                      Colors.blue,
                      Icons.trending_up,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildImprovedSummaryCard(
                      '\$${totalSpent.toStringAsFixed(2)}',
                      'Total Gastado',
                      Icons.bar_chart,
                      Colors.orange,
                      Icons.arrow_upward,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildImprovedSummaryCard(
                      '\$${totalRemaining.toStringAsFixed(2)}',
                      'Restante',
                      Icons.account_balance_wallet,
                      totalRemaining >= 0 ? Colors.green : Colors.red,
                      totalRemaining >= 0 ? Icons.arrow_downward : Icons.warning,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              // Progress Overview Card
              Container(
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: AppTheme.darkSurfaceVariant,
                    width: 1,
                  ),
                ),
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Resumen del Presupuesto',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: budgetPercentage > 80
                                ? Colors.red.withOpacity(0.2)
                                : budgetPercentage > 50
                                    ? Colors.orange.withOpacity(0.2)
                                    : Colors.green.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            '${budgetPercentage.toStringAsFixed(1)}%',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: budgetPercentage > 80
                                  ? Colors.red
                                  : budgetPercentage > 50
                                      ? Colors.orange
                                      : Colors.green,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: LinearProgressIndicator(
                        value: budgetPercentage / 100,
                        minHeight: 12,
                        backgroundColor: AppTheme.darkSurfaceVariant,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          budgetPercentage > 80
                              ? Colors.red
                              : budgetPercentage > 50
                                  ? Colors.orange
                                  : Colors.green,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Presupuesto Total',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppTheme.white,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '\$${totalBudget.toStringAsFixed(2)}',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            const Text(
                              'Gastado',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppTheme.white,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '\$${totalSpent.toStringAsFixed(2)}',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: totalSpent > totalBudget ? Colors.red : AppTheme.white,
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
              // Categories Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Categorías de Gastos',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Gestiona tus gastos por categoría',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                  ElevatedButton.icon(
                    onPressed: () {
                      _showAddCategoryDialog();
                    },
                    icon: const Icon(Icons.add, size: 18),
                    label: const Text('Agregar'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF57F17),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
                ..._categories.map((category) => _buildImprovedCategoryCard(category)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard(String value, String label, IconData icon, Color color) {
    return Card(
      color: AppTheme.darkSurface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: AppTheme.white, size: 20),
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
            const SizedBox(height: 4),
            Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                color: AppTheme.white,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImprovedSummaryCard(String value, String label, IconData icon, Color color, IconData trendIcon) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: AppTheme.darkSurfaceVariant,
          width: 1,
        ),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: AppTheme.white, size: 22),
              ),
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(trendIcon, color: AppTheme.white, size: 16),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryCard(BudgetCategory category) {
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
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF57F17).withOpacity(0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.folder,
                        size: 18,
                        color: const Color(0xFFF57F17),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      category.name,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                PopupMenuButton<String>(
                  icon: const Icon(Icons.more_vert, size: 18, color: AppTheme.white),
                  onSelected: (value) {
                    if (value == 'edit') {
                      _showEditCategoryDialog(category);
                    } else if (value == 'delete') {
                      _showDeleteCategoryDialog(category);
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
                          Icon(Icons.delete, size: 18, color: AppTheme.white),
                          SizedBox(width: 8),
                          Text('Eliminar', style: TextStyle(color: AppTheme.white)),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Presupuesto',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        keyboardType: TextInputType.number,
                        initialValue: category.budget,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '0.00',
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            _categories = _categories.map((c) {
                              if (c.id == category.id) {
                                final budget = double.tryParse(value) ?? 0.0;
                                final spent = double.tryParse(c.spent) ?? 0.0;
                                final remaining = budget - spent;
                                return BudgetCategory(
                                  id: c.id,
                                  name: c.name,
                                  budget: value,
                                  spent: c.spent,
                                  remaining: remaining.toStringAsFixed(2),
                                );
                              }
                              return c;
                            }).toList();
                          });
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Gastado',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        keyboardType: TextInputType.number,
                        initialValue: category.spent,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '0.00',
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            _categories = _categories.map((c) {
                              if (c.id == category.id) {
                                final budget = double.tryParse(c.budget) ?? 0.0;
                                final spent = double.tryParse(value) ?? 0.0;
                                final remaining = budget - spent;
                                return BudgetCategory(
                                  id: c.id,
                                  name: c.name,
                                  budget: c.budget,
                                  spent: value,
                                  remaining: remaining.toStringAsFixed(2),
                                );
                              }
                              return c;
                            }).toList();
                          });
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Restante',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurfaceVariant,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '\$${category.remaining}',
                          style: TextStyle(
                            color: (double.tryParse(category.remaining) ?? 0.0) < 0
                                ? Colors.red
                                : AppTheme.white,
                            fontSize: 14,
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
            // Progress Bar
            Builder(
              builder: (context) {
                final budget = double.tryParse(category.budget) ?? 0.0;
                final spent = double.tryParse(category.spent) ?? 0.0;
                final percentage = budget > 0 ? (spent / budget * 100).clamp(0.0, 100.0) : 0.0;
                final isOverBudget = spent > budget;
                
                return Column(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: LinearProgressIndicator(
                        value: isOverBudget ? 1.0 : percentage / 100,
                        minHeight: 10,
                        backgroundColor: AppTheme.darkSurfaceVariant,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          isOverBudget
                              ? Colors.red
                              : percentage > 80
                                  ? Colors.orange
                                  : percentage > 50
                                      ? Colors.yellow
                                      : Colors.green,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${percentage.toStringAsFixed(1)}% utilizado',
                          style: TextStyle(
                            fontSize: 12,
                            color: isOverBudget
                                ? Colors.red
                                : percentage > 80
                                    ? Colors.orange
                                    : AppTheme.white,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        if (isOverBudget)
                          Row(
                            children: [
                              const Icon(Icons.warning, size: 14, color: AppTheme.white),
                              const SizedBox(width: 4),
                              Text(
                                'Excedido',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.white,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                      ],
                    ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImprovedCategoryCard(BudgetCategory category) {
    return _buildCategoryCard(category);
  }

  // Métodos para gestionar categorías de presupuesto
  void _showAddCategoryDialog() {
    _categoryNameController.clear();
    _editingCategory = null;
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.darkSurface,
        title: const Text(
          'Agregar Categoría',
          style: TextStyle(color: AppTheme.white),
        ),
        content: TextField(
          controller: _categoryNameController,
          autofocus: true,
          decoration: InputDecoration(
            labelText: 'Nombre de la categoría',
            labelStyle: const TextStyle(color: AppTheme.white),
            hintText: 'Ej: Ropa, Educación, etc.',
            hintStyle: const TextStyle(color: AppTheme.white60),
            filled: true,
            fillColor: AppTheme.darkBackground,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: AppTheme.darkSurfaceVariant,
                width: 1,
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: AppTheme.darkSurfaceVariant,
                width: 1,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                color: Color(0xFFF57F17),
                width: 2,
              ),
            ),
          ),
          style: const TextStyle(color: AppTheme.white),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              if (_categoryNameController.text.trim().isNotEmpty) {
                final newCategory = BudgetCategory(
                  id: DateTime.now().millisecondsSinceEpoch.toString(),
                  name: _categoryNameController.text.trim(),
                  budget: '',
                  spent: '',
                  remaining: '',
                );
                setState(() {
                  _categories.add(newCategory);
                });
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Categoría agregada exitosamente'),
                    backgroundColor: Colors.green,
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFF57F17),
            ),
            child: const Text('Agregar'),
          ),
        ],
      ),
    );
  }

  void _showEditCategoryDialog(BudgetCategory category) {
    _categoryNameController.text = category.name;
    _editingCategory = category;
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.darkSurface,
        title: const Text(
          'Editar Categoría',
          style: TextStyle(color: AppTheme.white),
        ),
        content: TextField(
          controller: _categoryNameController,
          autofocus: true,
          decoration: InputDecoration(
            labelText: 'Nombre de la categoría',
            labelStyle: const TextStyle(color: AppTheme.white),
            hintText: 'Ej: Ropa, Educación, etc.',
            hintStyle: const TextStyle(color: AppTheme.white60),
            filled: true,
            fillColor: AppTheme.darkBackground,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: AppTheme.darkSurfaceVariant,
                width: 1,
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: AppTheme.darkSurfaceVariant,
                width: 1,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                color: Color(0xFFF57F17),
                width: 2,
              ),
            ),
          ),
          style: const TextStyle(color: AppTheme.white),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              if (_categoryNameController.text.trim().isNotEmpty) {
                setState(() {
                  final index = _categories.indexWhere((c) => c.id == category.id);
                  if (index != -1) {
                    _categories[index] = BudgetCategory(
                      id: category.id,
                      name: _categoryNameController.text.trim(),
                      budget: category.budget,
                      spent: category.spent,
                      remaining: category.remaining,
                    );
                  }
                });
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Categoría actualizada exitosamente'),
                    backgroundColor: Colors.green,
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFF57F17),
            ),
            child: const Text('Guardar'),
          ),
        ],
      ),
    );
  }

  void _showDeleteCategoryDialog(BudgetCategory category) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.darkSurface,
        title: const Text(
          'Eliminar Categoría',
          style: TextStyle(color: AppTheme.white),
        ),
        content: Text(
          '¿Estás seguro de que deseas eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.',
          style: const TextStyle(color: AppTheme.white),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _categories.removeWhere((c) => c.id == category.id);
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Categoría eliminada exitosamente'),
                  backgroundColor: Colors.green,
                ),
              );
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

  Widget _buildExpenseTracker() {
    final totalExpenses = _expenses.fold<double>(
      0.0,
      (sum, expense) => sum + (double.tryParse(expense.amount) ?? 0.0),
    );
    final avgExpense = _expenses.isEmpty ? 0.0 : totalExpenses / _expenses.length;
    
    // Calcular gastos por categoría
    final expensesByCategory = <String, double>{};
    for (var expense in _expenses) {
      final category = expense.category.isEmpty ? 'Sin categoría' : expense.category;
      final amount = double.tryParse(expense.amount) ?? 0.0;
      expensesByCategory[category] = (expensesByCategory[category] ?? 0.0) + amount;
    }
    final topCategory = expensesByCategory.entries.isNotEmpty
        ? expensesByCategory.entries.reduce((a, b) => a.value > b.value ? a : b)
        : null;

    return SingleChildScrollView(
      child: Column(
        children: [
          _buildImprovedHeader(
            'Seguimiento de Gastos',
            'Registra y analiza tus gastos',
            Icons.receipt,
            const Color(0xFFF57F17),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                // Summary Cards - Mejoradas
                Row(
                  children: [
                    Expanded(
                      child: _buildImprovedSummaryCard(
                        '\$${totalExpenses.toStringAsFixed(2)}',
                        'Total Gastado',
                        Icons.attach_money,
                        Colors.red,
                        Icons.arrow_upward,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildImprovedSummaryCard(
                        '${_expenses.length}',
                        'Transacciones',
                        Icons.list,
                        Colors.blue,
                        Icons.trending_up,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildImprovedSummaryCard(
                        '\$${avgExpense.toStringAsFixed(2)}',
                        'Promedio',
                        Icons.trending_up,
                        Colors.green,
                        Icons.analytics,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                // Estadísticas adicionales
                if (_expenses.isNotEmpty && topCategory != null)
                  Container(
                    decoration: BoxDecoration(
                      color: AppTheme.darkSurface,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: AppTheme.darkSurfaceVariant,
                        width: 1,
                      ),
                    ),
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Estadísticas',
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
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Categoría más usada',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: AppTheme.white,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    topCategory.key,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.white,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                const Text(
                                  'Gastado en esta categoría',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: AppTheme.white,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '\$${topCategory.value.toStringAsFixed(2)}',
                                  style: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.white,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                if (_expenses.isNotEmpty && topCategory != null)
                  const SizedBox(height: 20),
                // Encabezado de gastos registrados
                Container(
                  decoration: BoxDecoration(
                    color: AppTheme.darkSurface,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: AppTheme.darkSurfaceVariant,
                      width: 1,
                    ),
                  ),
                  padding: const EdgeInsets.all(20),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Gastos Registrados',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Gestiona tus gastos diarios',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                // Lista de gastos
                if (_expenses.isEmpty)
                  Container(
                    padding: const EdgeInsets.all(40),
                    decoration: BoxDecoration(
                      color: AppTheme.darkSurface,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: AppTheme.darkSurfaceVariant,
                        width: 1,
                      ),
                    ),
                    child: _buildEmptyState('No hay gastos registrados', Icons.receipt),
                  )
                else
                  ...(_expenses..sort((a, b) {
                    // Ordenar: primero los anclados, luego por fecha
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    // Si ambos tienen la misma prioridad, ordenar por fecha (más recientes primero)
                    try {
                      final dateA = DateFormat('dd/MM/yyyy').parse(a.date);
                      final dateB = DateFormat('dd/MM/yyyy').parse(b.date);
                      return dateB.compareTo(dateA);
                    } catch (e) {
                      return 0;
                    }
                  })).map((expense) => _buildImprovedExpenseCard(expense)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCreditCardManager() {
    final totalLimit = _creditCards.fold<double>(
      0.0,
      (sum, card) => sum + (double.tryParse(card.limit) ?? 0.0),
    );
    final totalBalance = _creditCards.fold<double>(
      0.0,
      (sum, card) => sum + (double.tryParse(card.balance) ?? 0.0),
    );
    final totalAvailable = totalLimit - totalBalance;
    final totalUsedPercentage = totalLimit > 0 ? (totalBalance / totalLimit * 100).clamp(0.0, 100.0) : 0.0;

    return SingleChildScrollView(
      child: Column(
        children: [
          _buildImprovedHeader(
            'Gestor de Tarjetas',
            'Administra tus tarjetas de crédito',
            Icons.credit_card,
            const Color(0xFFF57F17),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                // Resumen general mejorado
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        const Color(0xFFF57F17).withOpacity(0.2),
                        AppTheme.darkSurface,
                        AppTheme.darkSurfaceVariant,
                      ],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: AppTheme.darkSurfaceVariant,
                      width: 1,
                    ),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Resumen General',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                '${_creditCards.length} ${_creditCards.length == 1 ? 'tarjeta' : 'tarjetas'}',
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: AppTheme.white,
                                ),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF57F17).withOpacity(0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(
                              Icons.credit_card,
                              color: Color(0xFFF57F17),
                              size: 28,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      // Barra de progreso del crédito total
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Crédito Utilizado',
                            style: TextStyle(
                              fontSize: 14,
                              color: AppTheme.white,
                            ),
                          ),
                          Text(
                            '${totalUsedPercentage.toStringAsFixed(1)}%',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: totalUsedPercentage > 80 
                                  ? Colors.red 
                                  : totalUsedPercentage > 50 
                                      ? Colors.orange 
                                      : const Color(0xFFF57F17),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Container(
                        height: 8,
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurfaceVariant,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: FractionallySizedBox(
                          alignment: Alignment.centerLeft,
                          widthFactor: (totalUsedPercentage / 100).clamp(0.0, 1.0),
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: totalUsedPercentage > 80 
                                    ? [Colors.red, Colors.red.shade700]
                                    : totalUsedPercentage > 50 
                                        ? [Colors.orange, Colors.orange.shade700]
                                        : [const Color(0xFFF57F17), const Color(0xFFF57F17).withOpacity(0.8)],
                              ),
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      // Tarjetas de resumen mejoradas
                      Row(
                        children: [
                          Expanded(
                            child: _buildCreditCardSummaryCard(
                              'Límite Total',
                              '\$${totalLimit.toStringAsFixed(2)}',
                              Icons.account_balance_wallet,
                              Colors.green,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildCreditCardSummaryCard(
                              'Saldo Total',
                              '\$${totalBalance.toStringAsFixed(2)}',
                              Icons.trending_up,
                              Colors.orange,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildCreditCardSummaryCard(
                              'Disponible',
                              '\$${totalAvailable.toStringAsFixed(2)}',
                              Icons.account_balance,
                              Colors.blue,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                // Botón para agregar tarjeta mejorado
                Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: const Color(0xFFF57F17),
                      width: 2,
                    ),
                  ),
                  child: ElevatedButton.icon(
                    onPressed: () {
                      setState(() {
                        _creditCards.add(CreditCard(
                          id: DateTime.now().millisecondsSinceEpoch.toString(),
                          name: '',
                          bank: '',
                          limit: '',
                          balance: '',
                          dueDate: '',
                          minPayment: '',
                        ));
                      });
                    },
                    icon: const Icon(Icons.add_circle, size: 24),
                    label: const Text(
                      'Agregar Nueva Tarjeta',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF57F17),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                // Lista de tarjetas
                if (_creditCards.isEmpty)
                  Container(
                    padding: const EdgeInsets.all(40),
                    decoration: BoxDecoration(
                      color: AppTheme.darkSurface,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: AppTheme.darkSurfaceVariant,
                        width: 1,
                      ),
                    ),
                    child: _buildEmptyState('No hay tarjetas registradas', Icons.credit_card),
                  )
                else
                  ..._creditCards.map((card) => _buildImprovedCreditCardCard(card)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCreditCardSummaryCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppTheme.darkSurfaceVariant,
          width: 1,
        ),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: color,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildBillTracker() {
    final paidBills = _bills.where((b) => b.status == 'paid').length;
    final pendingBills = _bills.where((b) => b.status == 'pending').length;

    return SingleChildScrollView(
      child: Column(
        children: [
          _buildImprovedHeader(
            'Seguimiento de Facturas',
            'Gestiona tus facturas y pagos',
            Icons.description,
            const Color(0xFFF57F17),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                // Summary Cards
                Row(
                  children: [
                    Expanded(
                      child: _buildSummaryCard(
                        '${_bills.length}',
                        'Facturas',
                        Icons.receipt,
                        Colors.blue,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildSummaryCard(
                        '$paidBills',
                        'Pagadas',
                        Icons.check_circle,
                        Colors.green,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildSummaryCard(
                        '$pendingBills',
                        'Pendientes',
                        Icons.access_time,
                        Colors.orange,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Botón para agregar factura
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      setState(() {
                        _bills.add(Bill(
                          id: DateTime.now().millisecondsSinceEpoch.toString(),
                          name: '',
                          amount: '',
                          dueDate: '',
                          status: 'pending',
                          category: '',
                        ));
                      });
                    },
                    icon: const Icon(Icons.add_circle_outline),
                    label: const Text('Agregar Factura'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF57F17),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                // Lista de facturas
                if (_bills.isEmpty)
                  _buildEmptyState('No hay facturas registradas', Icons.description)
                else
                  ..._bills.map((bill) => _buildBillCard(bill)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInvestmentTracker() {
    final totalValue = _investments.fold<double>(
      0.0,
      (sum, inv) => sum + (double.tryParse(inv.currentValue) ?? 0.0),
    );
    final totalProfit = _investments.fold<double>(
      0.0,
      (sum, inv) => sum + (double.tryParse(inv.profit) ?? 0.0),
    );

    return SingleChildScrollView(
      child: Column(
        children: [
          _buildImprovedHeader(
            'Seguimiento de Inversiones',
            'Monitorea tu portafolio de inversiones',
            Icons.trending_up,
            const Color(0xFFF57F17),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                // Summary Cards
                Row(
                  children: [
                    Expanded(
                      child: _buildSummaryCard(
                        '${_investments.length}',
                        'Inversiones',
                        Icons.account_balance_wallet,
                        Colors.blue,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildSummaryCard(
                        '\$${totalValue.toStringAsFixed(2)}',
                        'Valor Total',
                        Icons.trending_up,
                        Colors.green,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildSummaryCard(
                        '\$${totalProfit.toStringAsFixed(2)}',
                        'Ganancia',
                        Icons.attach_money,
                        Colors.orange,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Botón para agregar inversión
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      setState(() {
                        _investments.add(Investment(
                          id: DateTime.now().millisecondsSinceEpoch.toString(),
                          name: '',
                          type: '',
                          amount: '',
                          currentValue: '',
                          profit: '',
                          date: '',
                        ));
                      });
                    },
                    icon: const Icon(Icons.add_circle_outline),
                    label: const Text('Agregar Inversión'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF57F17),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                // Lista de inversiones
                if (_investments.isEmpty)
                  _buildEmptyState('No hay inversiones registradas', Icons.trending_up)
                else
                  ..._investments.map((investment) => _buildInvestmentCard(investment)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSavingsGoals() {
    final completedGoals = _savingsGoals.where((g) {
      final target = double.tryParse(g.targetAmount) ?? 0.0;
      final current = double.tryParse(g.currentAmount) ?? 0.0;
      return target > 0 && current >= target;
    }).length;
    final totalSaved = _savingsGoals.fold<double>(
      0.0,
      (sum, goal) => sum + (double.tryParse(goal.currentAmount) ?? 0.0),
    );

    return SingleChildScrollView(
      child: Column(
        children: [
          _buildImprovedHeader(
            'Objetivos de Ahorro',
            'Establece y alcanza tus metas financieras',
            Icons.savings,
            const Color(0xFFF57F17),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
                // Summary Cards
                Row(
                  children: [
                    Expanded(
                      child: _buildSummaryCard(
                        '${_savingsGoals.length}',
                        'Objetivos',
                        Icons.flag,
                        Colors.blue,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildSummaryCard(
                        '$completedGoals',
                        'Completados',
                        Icons.check_circle,
                        Colors.green,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildSummaryCard(
                        '\$${totalSaved.toStringAsFixed(2)}',
                        'Total Ahorrado',
                        Icons.account_balance_wallet,
                        Colors.orange,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Botón para agregar objetivo
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      setState(() {
                        _savingsGoals.add(SavingsGoal(
                          id: DateTime.now().millisecondsSinceEpoch.toString(),
                          name: '',
                          targetAmount: '',
                          currentAmount: '',
                          deadline: '',
                          progress: 0.0,
                        ));
                      });
                    },
                    icon: const Icon(Icons.add_circle_outline),
                    label: const Text('Agregar Objetivo'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF57F17),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                // Lista de objetivos
                if (_savingsGoals.isEmpty)
                  _buildEmptyState('No hay objetivos de ahorro', Icons.savings)
                else
                  ..._savingsGoals.map((goal) => _buildSavingsGoalCard(goal)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildShoppingList() {
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
                  const Color(0xFFF57F17).withOpacity(0.2),
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
                    color: const Color(0xFFF57F17).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Icon(
                    Icons.shopping_cart,
                    size: 32,
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
                        'Organiza tus compras por categorías',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
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
                          const Icon(Icons.shopping_basket_outlined, size: 32, color: AppTheme.white),
                          const SizedBox(height: 8),
                          const Text(
                            'No hay artículos en esta categoría',
                            style: TextStyle(
                              fontSize: 14,
                              color: AppTheme.white,
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
                                  // Guardar en Supabase
                                  _healthService.saveShoppingList(_marketList).then((result) {
                                    if (result['success'] == true) {
                                      print('FinanceSections: Lista de compras guardada en Supabase');
                                    }
                                  });
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
                                        : AppTheme.white,
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
                                          ? AppTheme.white
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
                                          ? AppTheme.white
                                          : AppTheme.white,
                                      decoration: isPurchased
                                          ? TextDecoration.lineThrough
                                          : null,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.close, size: 18, color: AppTheme.white),
                              onPressed: () {
                                setState(() {
                                  items.remove(item);
                                  // Guardar en Supabase
                                  _healthService.saveShoppingList(_marketList).then((result) {
                                    if (result['success'] == true) {
                                      print('FinanceSections: Lista de compras guardada en Supabase');
                                    }
                                  });
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
                _showAddShoppingCategoryDialog();
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

  void _showAddShoppingCategoryDialog() {
    showDialog(
      context: context,
      builder: (context) => _buildAddCategoryModal(),
    );
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

  Widget _buildExpenseCard(Expense expense) {
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF57F17).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.credit_card,
                    size: 18,
                    color: Color(0xFFF57F17),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        expense.description.isEmpty ? 'Descripción del gasto' : expense.description,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.white,
                        ),
                      ),
                      Text(
                        expense.category.isEmpty ? 'Sin categoría' : expense.category,
                        style: const TextStyle(
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
                    color: Colors.red.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '\$${expense.amount.isEmpty ? "0.00" : expense.amount}',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.red,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Detalles editables
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Fecha',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: expense.date,
                        decoration: InputDecoration(
                          hintText: 'DD/MM/YYYY',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _expenses.indexWhere((e) => e.id == expense.id);
                            if (index != -1) {
                              _expenses[index] = Expense(
                                id: expense.id,
                                date: value,
                                description: expense.description,
                                category: expense.category,
                                amount: expense.amount,
                                paymentMethod: expense.paymentMethod,
                                isPinned: expense.isPinned,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Método',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: expense.paymentMethod,
                        decoration: InputDecoration(
                          hintText: 'Efectivo/Tarjeta',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _expenses.indexWhere((e) => e.id == expense.id);
                            if (index != -1) {
                              _expenses[index] = Expense(
                                id: expense.id,
                                date: expense.date,
                                description: expense.description,
                                category: expense.category,
                                amount: expense.amount,
                                paymentMethod: value,
                                isPinned: expense.isPinned,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Descripción',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: expense.description,
                        decoration: InputDecoration(
                          hintText: 'Descripción del gasto',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _expenses.indexWhere((e) => e.id == expense.id);
                            if (index != -1) {
                              _expenses[index] = Expense(
                                id: expense.id,
                                date: expense.date,
                                description: value,
                                category: expense.category,
                                amount: expense.amount,
                                paymentMethod: expense.paymentMethod,
                                isPinned: expense.isPinned,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Categoría',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: expense.category,
                        decoration: InputDecoration(
                          hintText: 'Categoría',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _expenses.indexWhere((e) => e.id == expense.id);
                            if (index != -1) {
                              _expenses[index] = Expense(
                                id: expense.id,
                                date: expense.date,
                                description: expense.description,
                                category: value,
                                amount: expense.amount,
                                paymentMethod: expense.paymentMethod,
                                isPinned: expense.isPinned,
                              );
                            }
                          });
                          // Actualizar gastos de categorías cuando cambia la categoría
                          _updateCategorySpent();
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Monto',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: expense.amount,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '0.00',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _expenses.indexWhere((e) => e.id == expense.id);
                            if (index != -1) {
                              _expenses[index] = Expense(
                                id: expense.id,
                                date: expense.date,
                                description: expense.description,
                                category: expense.category,
                                amount: value,
                                paymentMethod: expense.paymentMethod,
                                isPinned: expense.isPinned,
                              );
                            }
                          });
                          // Actualizar gastos de categorías cuando cambia el monto
                          _updateCategorySpent();
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Acciones
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.edit, size: 16, color: AppTheme.white),
                  label: const Text('Editar', style: TextStyle(color: AppTheme.white)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {
                    setState(() {
                      _expenses.removeWhere((e) => e.id == expense.id);
                    });
                    // Actualizar gastos de categorías
                    _updateCategorySpent();
                  },
                  icon: const Icon(Icons.delete, size: 16, color: AppTheme.white),
                  label: const Text('Eliminar', style: TextStyle(color: AppTheme.white)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showAddExpenseDialog({Expense? expense}) {
    _editingExpense = expense;
    if (expense != null) {
      _expenseDescriptionController.text = expense.description;
      _expenseAmountController.text = expense.amount;
      _expenseCategoryController.text = expense.category;
      _selectedExpenseCategory = expense.category;
      _expensePaymentMethodController.text = expense.paymentMethod;
      _expenseIsPinned = expense.isPinned;
      if (expense.date.isNotEmpty) {
        try {
          _expenseDate = DateFormat('dd/MM/yyyy').parse(expense.date);
        } catch (e) {
          _expenseDate = DateTime.now();
        }
      } else {
        _expenseDate = DateTime.now();
      }
    } else {
      _expenseDescriptionController.clear();
      _expenseAmountController.clear();
      _expenseCategoryController.clear();
      _selectedExpenseCategory = null;
      _expensePaymentMethodController.clear();
      _expenseDate = DateTime.now();
      _expenseIsPinned = false;
    }

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Dialog(
          backgroundColor: Colors.transparent,
          child: Container(
            constraints: const BoxConstraints(maxWidth: 500),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(28),
              border: Border.all(
                color: AppTheme.darkSurfaceVariant,
                width: 1,
              ),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF57F17),
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(28),
                      topRight: Radius.circular(28),
                    ),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.receipt, color: AppTheme.white, size: 28),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Text(
                          _editingExpense != null ? 'Editar Gasto' : 'Nuevo Gasto',
                          style: const TextStyle(
                            color: AppTheme.white,
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      IconButton(
                        onPressed: () => Navigator.pop(context),
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
                      // Descripción
                      TextFormField(
                        controller: _expenseDescriptionController,
                        decoration: InputDecoration(
                          labelText: 'Descripción',
                          labelStyle: const TextStyle(color: AppTheme.white),
                          hintText: 'Ej: Almuerzo, Transporte, etc.',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                          prefixIcon: const Icon(Icons.description, color: AppTheme.white),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      // Monto
                      TextFormField(
                        controller: _expenseAmountController,
                        keyboardType: TextInputType.numberWithOptions(decimal: true),
                        decoration: InputDecoration(
                          labelText: 'Monto',
                          labelStyle: const TextStyle(color: AppTheme.white),
                          hintText: '0.00',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          prefixIcon: const Icon(Icons.attach_money, color: AppTheme.white),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      const SizedBox(height: 16),
                      // Categoría (Dropdown)
                      DropdownButtonFormField<String>(
                        value: _selectedExpenseCategory,
                        decoration: InputDecoration(
                          labelText: 'Categoría',
                          labelStyle: const TextStyle(color: AppTheme.white),
                          hintText: 'Seleccionar categoría',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                          prefixIcon: const Icon(Icons.category, color: AppTheme.white),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                        ),
                        dropdownColor: AppTheme.darkSurfaceVariant,
                        style: const TextStyle(color: AppTheme.white),
                        icon: const Icon(Icons.arrow_drop_down, color: AppTheme.white),
                        items: _categories.map((category) {
                          return DropdownMenuItem<String>(
                            value: category.name,
                            child: Text(
                              category.name,
                              style: const TextStyle(color: AppTheme.white),
                            ),
                          );
                        }).toList()
                          ..add(
                            const DropdownMenuItem<String>(
                              value: 'Otra',
                              child: Text(
                                'Otra',
                                style: TextStyle(color: AppTheme.white),
                              ),
                            ),
                          ),
                        onChanged: (value) {
                          setModalState(() {
                            _selectedExpenseCategory = value;
                            if (value == 'Otra') {
                              _expenseCategoryController.clear();
                            } else {
                              _expenseCategoryController.text = value ?? '';
                            }
                          });
                        },
                      ),
                      // Campo de texto para "Otra" categoría
                      if (_selectedExpenseCategory == 'Otra') ...[
                        const SizedBox(height: 16),
                        TextFormField(
                          controller: _expenseCategoryController,
                          decoration: InputDecoration(
                            labelText: 'Nombre de la categoría',
                            labelStyle: const TextStyle(color: AppTheme.white),
                            hintText: 'Ej: Comida, Transporte',
                            hintStyle: const TextStyle(color: AppTheme.white),
                            filled: true,
                            fillColor: AppTheme.darkSurfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: BorderSide.none,
                            ),
                            prefixIcon: const Icon(Icons.edit, color: AppTheme.white),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                          ),
                          style: const TextStyle(color: AppTheme.white),
                        ),
                      ],
                      const SizedBox(height: 16),
                      // Anclar gasto
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurfaceVariant,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.push_pin, color: AppTheme.white),
                            const SizedBox(width: 12),
                            const Expanded(
                              child: Text(
                                'Anclar gasto',
                                style: TextStyle(
                                  color: AppTheme.white,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            Switch(
                              value: _expenseIsPinned,
                              onChanged: (value) {
                                setModalState(() {
                                  _expenseIsPinned = value;
                                });
                              },
                              activeColor: const Color(0xFFF57F17),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Fecha
                      GestureDetector(
                        onTap: () async {
                          final picked = await showDatePicker(
                            context: context,
                            initialDate: _expenseDate ?? DateTime.now(),
                            firstDate: DateTime(2020),
                            lastDate: DateTime.now().add(const Duration(days: 365)),
                          );
                          if (picked != null) {
                            setModalState(() {
                              _expenseDate = picked;
                            });
                          }
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                          decoration: BoxDecoration(
                            color: AppTheme.darkSurfaceVariant,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.calendar_today, color: AppTheme.white),
                              const SizedBox(width: 12),
                              Text(
                                _expenseDate != null
                                    ? DateFormat('dd/MM/yyyy').format(_expenseDate!)
                                    : 'Seleccionar fecha',
                                style: const TextStyle(color: AppTheme.white),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Método de pago
                      TextFormField(
                        controller: _expensePaymentMethodController,
                        decoration: InputDecoration(
                          labelText: 'Método de pago',
                          labelStyle: const TextStyle(color: AppTheme.white),
                          hintText: 'Efectivo/Tarjeta',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                          prefixIcon: const Icon(Icons.payment, color: AppTheme.white),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
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
                              _expenseDescriptionController.clear();
                              _expenseAmountController.clear();
                              _expenseCategoryController.clear();
                              _expensePaymentMethodController.clear();
                              _expenseDate = null;
                              _editingExpense = null;
                            },
                            child: const Text(
                              'Cancelar',
                              style: TextStyle(color: AppTheme.white, fontSize: 16),
                            ),
                          ),
                          const SizedBox(width: 12),
                          ElevatedButton(
                            onPressed: () {
                              if (_expenseDescriptionController.text.isNotEmpty &&
                                  _expenseAmountController.text.isNotEmpty) {
                                final dateStr = _expenseDate != null
                                    ? DateFormat('dd/MM/yyyy').format(_expenseDate!)
                                    : '';
                                
                                // Determinar la categoría final
                                final finalCategory = _selectedExpenseCategory == 'Otra'
                                    ? _expenseCategoryController.text
                                    : (_selectedExpenseCategory ?? _expenseCategoryController.text);
                                
                                if (_editingExpense != null) {
                                  setState(() {
                                    final index = _expenses.indexWhere((e) => e.id == _editingExpense!.id);
                                    if (index != -1) {
                                      _expenses[index] = Expense(
                                        id: _editingExpense!.id,
                                        date: dateStr,
                                        description: _expenseDescriptionController.text,
                                        category: finalCategory,
                                        amount: _expenseAmountController.text,
                                        paymentMethod: _expensePaymentMethodController.text,
                                        isPinned: _expenseIsPinned,
                                      );
                                    }
                                  });
                                  // Actualizar gastos de categorías
                                  _updateCategorySpent();
                                } else {
                                  setState(() {
                                    _expenses.add(Expense(
                                      id: DateTime.now().millisecondsSinceEpoch.toString(),
                                      date: dateStr,
                                      description: _expenseDescriptionController.text,
                                      category: finalCategory,
                                      amount: _expenseAmountController.text,
                                      paymentMethod: _expensePaymentMethodController.text,
                                      isPinned: _expenseIsPinned,
                                    ));
                                  });
                                  // Actualizar gastos de categorías
                                  _updateCategorySpent();
                                }
                                
                                final wasEditing = _editingExpense != null;
                                
                                Navigator.pop(context);
                                _expenseDescriptionController.clear();
                                _expenseAmountController.clear();
                                _expenseCategoryController.clear();
                                _selectedExpenseCategory = null;
                                _expensePaymentMethodController.clear();
                                _expenseDate = null;
                                _expenseIsPinned = false;
                                _editingExpense = null;
                                
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text(wasEditing
                                        ? 'Gasto actualizado exitosamente'
                                        : 'Gasto agregado exitosamente'),
                                    backgroundColor: Colors.green,
                                  ),
                                );
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Por favor completa la descripción y el monto'),
                                    backgroundColor: Colors.red,
                                  ),
                                );
                              }
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFF57F17),
                              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: Text(
                              _editingExpense != null ? 'Actualizar' : 'Agregar',
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
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
      ),
    );
  }

  Widget _buildImprovedExpenseCard(Expense expense) {
    final amount = double.tryParse(expense.amount) ?? 0.0;
    final dateStr = expense.date.isNotEmpty ? expense.date : 'Sin fecha';
    
    // Iconos por categoría
    IconData categoryIcon = Icons.category;
    Color categoryColor = const Color(0xFFF57F17);
    if (expense.category.toLowerCase().contains('comida') || 
        expense.category.toLowerCase().contains('alimento')) {
      categoryIcon = Icons.restaurant;
      categoryColor = Colors.orange;
    } else if (expense.category.toLowerCase().contains('transporte')) {
      categoryIcon = Icons.directions_car;
      categoryColor = Colors.blue;
    } else if (expense.category.toLowerCase().contains('salud')) {
      categoryIcon = Icons.local_hospital;
      categoryColor = Colors.red;
    } else if (expense.category.toLowerCase().contains('entretenimiento')) {
      categoryIcon = Icons.movie;
      categoryColor = Colors.purple;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: AppTheme.darkSurfaceVariant,
          width: 1,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header con icono y monto
            Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: categoryColor.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    categoryIcon,
                    color: categoryColor,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              expense.description.isEmpty ? 'Sin descripción' : expense.description,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                          if (expense.isPinned) ...[
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF57F17).withOpacity(0.2),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Icon(
                                Icons.push_pin,
                                size: 16,
                                color: Color(0xFFF57F17),
                              ),
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          if (expense.category.isNotEmpty) ...[
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: categoryColor.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                expense.category,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: categoryColor,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                          ],
                          Icon(Icons.calendar_today, size: 12, color: AppTheme.white),
                          const SizedBox(width: 4),
                          Text(
                            dateStr,
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppTheme.white,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  decoration: BoxDecoration(
                    color: Colors.red.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: Colors.red.withOpacity(0.5),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    '\$${amount.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.red,
                    ),
                  ),
                ),
              ],
            ),
            if (expense.paymentMethod.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurfaceVariant,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.payment, size: 16, color: AppTheme.white),
                    const SizedBox(width: 8),
                    Text(
                      'Método: ${expense.paymentMethod}',
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 16),
            // Acciones
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  onPressed: () {
                    _showAddExpenseDialog(expense: expense);
                  },
                  icon: const Icon(Icons.edit, size: 18, color: AppTheme.white),
                  label: const Text('Editar', style: TextStyle(color: AppTheme.white)),
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  ),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        backgroundColor: AppTheme.darkSurface,
                        title: const Text(
                          'Eliminar Gasto',
                          style: TextStyle(color: AppTheme.white),
                        ),
                        content: const Text(
                          '¿Estás seguro de que deseas eliminar este gasto?',
                          style: TextStyle(color: AppTheme.white),
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text('Cancelar', style: TextStyle(color: AppTheme.white)),
                          ),
                          ElevatedButton(
                            onPressed: () {
                              setState(() {
                                _expenses.removeWhere((e) => e.id == expense.id);
                              });
                              // Actualizar gastos de categorías
                              _updateCategorySpent();
                              Navigator.pop(context);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Gasto eliminado exitosamente'),
                                  backgroundColor: Colors.green,
                                ),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                            ),
                            child: const Text('Eliminar'),
                          ),
                        ],
                      ),
                    );
                  },
                  icon: const Icon(Icons.delete, size: 18, color: AppTheme.white),
                  label: const Text('Eliminar', style: TextStyle(color: AppTheme.white)),
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImprovedCreditCardCard(CreditCard card) {
    final limit = double.tryParse(card.limit) ?? 0.0;
    final balance = double.tryParse(card.balance) ?? 0.0;
    final available = limit - balance;
    final creditUsed = limit > 0 ? (balance / limit * 100).clamp(0.0, 100.0) : 0.0;
    
    // Determinar color según uso
    Color statusColor = const Color(0xFFF57F17);
    if (creditUsed > 80) {
      statusColor = Colors.red;
    } else if (creditUsed > 50) {
      statusColor = Colors.orange;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      child: Column(
        children: [
          // Tarjeta de crédito visual mejorada
          Container(
            height: 200,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  statusColor,
                  statusColor.withOpacity(0.8),
                  statusColor.withOpacity(0.6),
                ],
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: statusColor.withOpacity(0.3),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          card.bank.isEmpty ? 'Banco' : card.bank,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'Activa',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        card.name.isEmpty ? 'Tarjeta de Crédito' : card.name,
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                          letterSpacing: 1.2,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Crédito Disponible',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.white.withOpacity(0.8),
                        ),
                      ),
                      Text(
                        '\$${available.toStringAsFixed(2)}',
                        style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Límite',
                            style: TextStyle(
                              fontSize: 11,
                              color: AppTheme.white.withOpacity(0.7),
                            ),
                          ),
                          Text(
                            '\$${limit.toStringAsFixed(2)}',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            'Utilizado',
                            style: TextStyle(
                              fontSize: 11,
                              color: AppTheme.white.withOpacity(0.7),
                            ),
                          ),
                          Text(
                            '${creditUsed.toStringAsFixed(0)}%',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          // Detalles de la tarjeta
          Container(
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(20),
                bottomRight: Radius.circular(20),
              ),
              border: Border.all(
                color: AppTheme.darkSurfaceVariant,
                width: 1,
              ),
            ),
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Título de sección
                Row(
                  children: [
                    Icon(Icons.info_outline, size: 18, color: statusColor),
                    const SizedBox(width: 8),
                    Text(
                      'Detalles de la Tarjeta',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: statusColor,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Detalles editables - Nombre y Banco
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Nombre de Tarjeta',
                            style: TextStyle(fontSize: 12, color: AppTheme.white),
                          ),
                          const SizedBox(height: 4),
                          TextFormField(
                            initialValue: card.name,
                            decoration: InputDecoration(
                              hintText: 'Nombre de la tarjeta',
                              hintStyle: const TextStyle(color: AppTheme.white),
                              filled: true,
                              fillColor: AppTheme.darkSurfaceVariant,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            ),
                            style: const TextStyle(color: AppTheme.white, fontSize: 14),
                            onChanged: (value) {
                              setState(() {
                                final index = _creditCards.indexWhere((c) => c.id == card.id);
                                if (index != -1) {
                                  _creditCards[index] = CreditCard(
                                    id: card.id,
                                    name: value,
                                    bank: card.bank,
                                    limit: card.limit,
                                    balance: card.balance,
                                    dueDate: card.dueDate,
                                    minPayment: card.minPayment,
                                  );
                                }
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Banco',
                            style: TextStyle(fontSize: 12, color: AppTheme.white),
                          ),
                          const SizedBox(height: 4),
                          TextFormField(
                            initialValue: card.bank,
                            decoration: InputDecoration(
                              hintText: 'Banco',
                              hintStyle: const TextStyle(color: AppTheme.white),
                              filled: true,
                              fillColor: AppTheme.darkSurfaceVariant,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            ),
                            style: const TextStyle(color: AppTheme.white, fontSize: 14),
                            onChanged: (value) {
                              setState(() {
                                final index = _creditCards.indexWhere((c) => c.id == card.id);
                                if (index != -1) {
                                  _creditCards[index] = CreditCard(
                                    id: card.id,
                                    name: card.name,
                                    bank: value,
                                    limit: card.limit,
                                    balance: card.balance,
                                    dueDate: card.dueDate,
                                    minPayment: card.minPayment,
                                  );
                                }
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // Detalles editables
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Límite de Crédito',
                            style: TextStyle(fontSize: 12, color: AppTheme.white),
                          ),
                          const SizedBox(height: 4),
                          TextFormField(
                            initialValue: card.limit,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              prefixText: '\$ ',
                              prefixStyle: const TextStyle(color: AppTheme.white),
                              hintText: '\$0.00',
                              hintStyle: const TextStyle(color: AppTheme.white),
                              filled: true,
                              fillColor: AppTheme.darkSurfaceVariant,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            ),
                            style: const TextStyle(color: AppTheme.white, fontSize: 14),
                            onChanged: (value) {
                              setState(() {
                                final index = _creditCards.indexWhere((c) => c.id == card.id);
                                if (index != -1) {
                                  _creditCards[index] = CreditCard(
                                    id: card.id,
                                    name: card.name,
                                    bank: card.bank,
                                    limit: value,
                                    balance: card.balance,
                                    dueDate: card.dueDate,
                                    minPayment: card.minPayment,
                                  );
                                }
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Saldo Actual',
                            style: TextStyle(fontSize: 12, color: AppTheme.white),
                          ),
                          const SizedBox(height: 4),
                          TextFormField(
                            initialValue: card.balance,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              prefixText: '\$ ',
                              prefixStyle: const TextStyle(color: AppTheme.white),
                              hintText: '\$0.00',
                              hintStyle: const TextStyle(color: AppTheme.white),
                              filled: true,
                              fillColor: AppTheme.darkSurfaceVariant,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            ),
                            style: const TextStyle(color: AppTheme.white, fontSize: 14),
                            onChanged: (value) {
                              setState(() {
                                final index = _creditCards.indexWhere((c) => c.id == card.id);
                                if (index != -1) {
                                  _creditCards[index] = CreditCard(
                                    id: card.id,
                                    name: card.name,
                                    bank: card.bank,
                                    limit: card.limit,
                                    balance: value,
                                    dueDate: card.dueDate,
                                    minPayment: card.minPayment,
                                  );
                                }
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Fecha de Vencimiento',
                            style: TextStyle(fontSize: 12, color: AppTheme.white),
                          ),
                          const SizedBox(height: 4),
                          TextFormField(
                            initialValue: card.dueDate,
                            decoration: InputDecoration(
                              hintText: 'DD/MM/YYYY',
                              hintStyle: const TextStyle(color: AppTheme.white),
                              filled: true,
                              fillColor: AppTheme.darkSurfaceVariant,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            ),
                            style: const TextStyle(color: AppTheme.white, fontSize: 14),
                            onChanged: (value) {
                              setState(() {
                                final index = _creditCards.indexWhere((c) => c.id == card.id);
                                if (index != -1) {
                                  _creditCards[index] = CreditCard(
                                    id: card.id,
                                    name: card.name,
                                    bank: card.bank,
                                    limit: card.limit,
                                    balance: card.balance,
                                    dueDate: value,
                                    minPayment: card.minPayment,
                                  );
                                }
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Pago Mínimo',
                            style: TextStyle(fontSize: 12, color: AppTheme.white),
                          ),
                          const SizedBox(height: 4),
                          TextFormField(
                            initialValue: card.minPayment,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              prefixText: '\$ ',
                              prefixStyle: const TextStyle(color: AppTheme.white),
                              hintText: '\$0.00',
                              hintStyle: const TextStyle(color: AppTheme.white),
                              filled: true,
                              fillColor: AppTheme.darkSurfaceVariant,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            ),
                            style: const TextStyle(color: AppTheme.white, fontSize: 14),
                            onChanged: (value) {
                              setState(() {
                                final index = _creditCards.indexWhere((c) => c.id == card.id);
                                if (index != -1) {
                                  _creditCards[index] = CreditCard(
                                    id: card.id,
                                    name: card.name,
                                    bank: card.bank,
                                    limit: card.limit,
                                    balance: card.balance,
                                    dueDate: card.dueDate,
                                    minPayment: value,
                                  );
                                }
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                // Barra de progreso del crédito utilizado mejorada
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: statusColor.withOpacity(0.3),
                      width: 1,
                    ),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Crédito Utilizado',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.white,
                            ),
                          ),
                          Text(
                            '${creditUsed.toStringAsFixed(1)}%',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: statusColor,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Container(
                        height: 10,
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurfaceVariant,
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: FractionallySizedBox(
                          alignment: Alignment.centerLeft,
                          widthFactor: (creditUsed / 100).clamp(0.0, 1.0),
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  statusColor,
                                  statusColor.withOpacity(0.8),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(5),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Disponible: \$${available.toStringAsFixed(2)}',
                            style: TextStyle(
                              fontSize: 12,
                              color: AppTheme.white.withOpacity(0.7),
                            ),
                          ),
                          Text(
                            'Usado: \$${balance.toStringAsFixed(2)}',
                            style: TextStyle(
                              fontSize: 12,
                              color: AppTheme.white.withOpacity(0.7),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                // Información adicional
                if (card.dueDate.isNotEmpty || card.minPayment.isNotEmpty) ...[
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        if (card.dueDate.isNotEmpty) ...[
                          Expanded(
                            child: Row(
                              children: [
                                const Icon(Icons.calendar_today, size: 16, color: AppTheme.white),
                                const SizedBox(width: 8),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'Vencimiento',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: AppTheme.white,
                                      ),
                                    ),
                                    Text(
                                      card.dueDate,
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.white,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                        if (card.minPayment.isNotEmpty) ...[
                          if (card.dueDate.isNotEmpty) const SizedBox(width: 16),
                          Expanded(
                            child: Row(
                              children: [
                                const Icon(Icons.payment, size: 16, color: AppTheme.white),
                                const SizedBox(width: 8),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'Pago Mínimo',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: AppTheme.white,
                                      ),
                                    ),
                                    Text(
                                      '\$${card.minPayment}',
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.white,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
                // Acciones mejoradas
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              backgroundColor: AppTheme.darkSurface,
                              title: const Text(
                                'Eliminar Tarjeta',
                                style: TextStyle(color: AppTheme.white),
                              ),
                              content: Text(
                                '¿Estás seguro de que deseas eliminar la tarjeta "${card.name.isEmpty ? 'Tarjeta de Crédito' : card.name}"?',
                                style: const TextStyle(color: AppTheme.white),
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: const Text('Cancelar', style: TextStyle(color: AppTheme.white)),
                                ),
                                ElevatedButton(
                                  onPressed: () {
                                    setState(() {
                                      _creditCards.removeWhere((c) => c.id == card.id);
                                    });
                                    Navigator.pop(context);
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('Tarjeta eliminada exitosamente'),
                                        backgroundColor: Colors.green,
                                      ),
                                    );
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.red,
                                  ),
                                  child: const Text('Eliminar'),
                                ),
                              ],
                            ),
                          );
                        },
                        icon: const Icon(Icons.delete_outline, size: 18),
                        label: const Text('Eliminar'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.red,
                          side: const BorderSide(color: Colors.red, width: 1.5),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      flex: 2,
                      child: ElevatedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.edit, size: 18),
                        label: const Text('Editar Detalles'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: statusColor,
                          foregroundColor: Colors.white,
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
        ],
      ),
    );
  }

  Widget _buildBillCard(Bill bill) {
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF57F17).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.description,
                    size: 18,
                    color: Color(0xFFF57F17),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        bill.name.isEmpty ? 'Factura sin nombre' : bill.name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.white,
                        ),
                      ),
                      Text(
                        bill.category.isEmpty ? 'Sin categoría' : bill.category,
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    setState(() {
                      final index = _bills.indexWhere((b) => b.id == bill.id);
                      if (index != -1) {
                        _bills[index] = Bill(
                          id: bill.id,
                          name: bill.name,
                          amount: bill.amount,
                          dueDate: bill.dueDate,
                          status: bill.status == 'paid' ? 'pending' : 'paid',
                          category: bill.category,
                        );
                      }
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: bill.status == 'paid' ? Colors.green : Colors.orange,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      bill.status == 'paid' ? 'Pagada' : 'Pendiente',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Detalles editables
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Monto',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: bill.amount,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '\$0.00',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _bills.indexWhere((b) => b.id == bill.id);
                            if (index != -1) {
                              _bills[index] = Bill(
                                id: bill.id,
                                name: bill.name,
                                amount: value,
                                dueDate: bill.dueDate,
                                status: bill.status,
                                category: bill.category,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Fecha de Vencimiento',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: bill.dueDate,
                        decoration: InputDecoration(
                          hintText: 'DD/MM/YYYY',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _bills.indexWhere((b) => b.id == bill.id);
                            if (index != -1) {
                              _bills[index] = Bill(
                                id: bill.id,
                                name: bill.name,
                                amount: bill.amount,
                                dueDate: value,
                                status: bill.status,
                                category: bill.category,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Nombre de Factura',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: bill.name,
                        decoration: InputDecoration(
                          hintText: 'Nombre de la factura',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _bills.indexWhere((b) => b.id == bill.id);
                            if (index != -1) {
                              _bills[index] = Bill(
                                id: bill.id,
                                name: value,
                                amount: bill.amount,
                                dueDate: bill.dueDate,
                                status: bill.status,
                                category: bill.category,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Categoría',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: bill.category,
                        decoration: InputDecoration(
                          hintText: 'Categoría',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _bills.indexWhere((b) => b.id == bill.id);
                            if (index != -1) {
                              _bills[index] = Bill(
                                id: bill.id,
                                name: bill.name,
                                amount: bill.amount,
                                dueDate: bill.dueDate,
                                status: bill.status,
                                category: value,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Indicador de estado de pago
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Estado de Pago',
                  style: TextStyle(fontSize: 14, color: AppTheme.white),
                ),
                Container(
                  width: 20,
                  height: 20,
                  decoration: BoxDecoration(
                    color: bill.status == 'paid' ? Colors.green : Colors.orange,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    bill.status == 'paid' ? Icons.check : Icons.warning,
                    size: 12,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Container(
              height: 6,
              decoration: BoxDecoration(
                color: AppTheme.darkSurfaceVariant,
                borderRadius: BorderRadius.circular(3),
              ),
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: bill.status == 'paid' ? 1.0 : 0.5,
                child: Container(
                  decoration: BoxDecoration(
                    color: bill.status == 'paid' ? Colors.green : Colors.orange,
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Acciones
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.edit, size: 16, color: AppTheme.white),
                  label: const Text('Editar', style: TextStyle(color: AppTheme.white)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.visibility, size: 16, color: AppTheme.white),
                  label: const Text('Ver Detalles', style: TextStyle(color: AppTheme.white)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {
                    setState(() {
                      _bills.removeWhere((b) => b.id == bill.id);
                    });
                  },
                  icon: const Icon(Icons.delete, size: 16, color: AppTheme.white),
                  label: const Text('Eliminar', style: TextStyle(color: AppTheme.white)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInvestmentCard(Investment investment) {
    final profit = double.tryParse(investment.profit) ?? 0.0;
    final isProfit = profit >= 0;
    final amount = double.tryParse(investment.amount) ?? 0.0;
    final currentValue = double.tryParse(investment.currentValue) ?? 0.0;
    final profitPercentage = amount > 0 ? ((currentValue - amount) / amount * 100) : 0.0;

    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF57F17).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.trending_up,
                    size: 18,
                    color: Color(0xFFF57F17),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        investment.name.isEmpty ? 'Inversión sin nombre' : investment.name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.white,
                        ),
                      ),
                      Text(
                        investment.type.isEmpty ? 'Sin tipo' : investment.type,
                        style: const TextStyle(
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
                    color: isProfit ? Colors.green : Colors.red,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    '${isProfit ? '+' : ''}\$${investment.profit}',
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
            // Detalles editables
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Monto Inicial',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: investment.amount,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '\$0.00',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _investments.indexWhere((i) => i.id == investment.id);
                            if (index != -1) {
                              _investments[index] = Investment(
                                id: investment.id,
                                name: investment.name,
                                type: investment.type,
                                amount: value,
                                currentValue: investment.currentValue,
                                profit: investment.profit,
                                date: investment.date,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Valor Actual',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: investment.currentValue,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '\$0.00',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _investments.indexWhere((i) => i.id == investment.id);
                            if (index != -1) {
                              _investments[index] = Investment(
                                id: investment.id,
                                name: investment.name,
                                type: investment.type,
                                amount: investment.amount,
                                currentValue: value,
                                profit: investment.profit,
                                date: investment.date,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Nombre',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: investment.name,
                        decoration: InputDecoration(
                          hintText: 'Nombre de la inversión',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _investments.indexWhere((i) => i.id == investment.id);
                            if (index != -1) {
                              _investments[index] = Investment(
                                id: investment.id,
                                name: value,
                                type: investment.type,
                                amount: investment.amount,
                                currentValue: investment.currentValue,
                                profit: investment.profit,
                                date: investment.date,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Tipo',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: investment.type,
                        decoration: InputDecoration(
                          hintText: 'Stock, Bond, etc.',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _investments.indexWhere((i) => i.id == investment.id);
                            if (index != -1) {
                              _investments[index] = Investment(
                                id: investment.id,
                                name: investment.name,
                                type: value,
                                amount: investment.amount,
                                currentValue: investment.currentValue,
                                profit: investment.profit,
                                date: investment.date,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Ganancia/Pérdida',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: investment.profit,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '\$0.00',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _investments.indexWhere((i) => i.id == investment.id);
                            if (index != -1) {
                              _investments[index] = Investment(
                                id: investment.id,
                                name: investment.name,
                                type: investment.type,
                                amount: investment.amount,
                                currentValue: investment.currentValue,
                                profit: value,
                                date: investment.date,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Fecha',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: investment.date,
                        decoration: InputDecoration(
                          hintText: 'DD/MM/YYYY',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _investments.indexWhere((i) => i.id == investment.id);
                            if (index != -1) {
                              _investments[index] = Investment(
                                id: investment.id,
                                name: investment.name,
                                type: investment.type,
                                amount: investment.amount,
                                currentValue: investment.currentValue,
                                profit: investment.profit,
                                date: value,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Barra de rendimiento
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Rendimiento',
                  style: TextStyle(fontSize: 14, color: AppTheme.white),
                ),
                Text(
                  '${profitPercentage >= 0 ? '+' : ''}${profitPercentage.toStringAsFixed(2)}%',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: isProfit ? Colors.green : Colors.red,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Container(
              height: 6,
              decoration: BoxDecoration(
                color: AppTheme.darkSurfaceVariant,
                borderRadius: BorderRadius.circular(3),
              ),
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: (profitPercentage.abs() / 100).clamp(0.0, 1.0),
                child: Container(
                  decoration: BoxDecoration(
                    color: isProfit ? Colors.green : Colors.red,
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Acciones
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.edit, size: 16, color: AppTheme.white),
                  label: const Text('Editar', style: TextStyle(color: AppTheme.white)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.analytics, size: 16, color: AppTheme.white),
                  label: const Text('Análisis', style: TextStyle(color: AppTheme.white)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {
                    setState(() {
                      _investments.removeWhere((i) => i.id == investment.id);
                    });
                  },
                  icon: const Icon(Icons.delete, size: 16, color: AppTheme.white),
                  label: const Text('Eliminar', style: TextStyle(color: AppTheme.white)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSavingsGoalCard(SavingsGoal goal) {
    final target = double.tryParse(goal.targetAmount) ?? 0.0;
    final current = double.tryParse(goal.currentAmount) ?? 0.0;
    final progress = target > 0 ? (current / target * 100).clamp(0.0, 100.0) : 0.0;

    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF57F17).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.flag,
                    size: 18,
                    color: Color(0xFFF57F17),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        goal.name.isEmpty ? 'Objetivo sin nombre' : goal.name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.white,
                        ),
                      ),
                      Text(
                        'Meta: \$${goal.targetAmount} • Fecha: ${goal.deadline}',
                        style: const TextStyle(
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
                    color: progress >= 100 ? Colors.green : Colors.orange,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    progress >= 100 ? 'Completado' : 'En Progreso',
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
            // Detalles editables
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Monto Objetivo',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: goal.targetAmount,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '\$0.00',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _savingsGoals.indexWhere((g) => g.id == goal.id);
                            if (index != -1) {
                              final newTarget = double.tryParse(value) ?? 0.0;
                              final current = double.tryParse(_savingsGoals[index].currentAmount) ?? 0.0;
                              final newProgress = newTarget > 0 ? (current / newTarget * 100).clamp(0.0, 100.0) : 0.0;
                              _savingsGoals[index] = SavingsGoal(
                                id: goal.id,
                                name: goal.name,
                                targetAmount: value,
                                currentAmount: goal.currentAmount,
                                deadline: goal.deadline,
                                progress: newProgress,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Monto Actual',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: goal.currentAmount,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '\$0.00',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _savingsGoals.indexWhere((g) => g.id == goal.id);
                            if (index != -1) {
                              final target = double.tryParse(_savingsGoals[index].targetAmount) ?? 0.0;
                              final newCurrent = double.tryParse(value) ?? 0.0;
                              final newProgress = target > 0 ? (newCurrent / target * 100).clamp(0.0, 100.0) : 0.0;
                              _savingsGoals[index] = SavingsGoal(
                                id: goal.id,
                                name: goal.name,
                                targetAmount: goal.targetAmount,
                                currentAmount: value,
                                deadline: goal.deadline,
                                progress: newProgress,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Nombre del Objetivo',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: goal.name,
                        decoration: InputDecoration(
                          hintText: 'Nombre del objetivo',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _savingsGoals.indexWhere((g) => g.id == goal.id);
                            if (index != -1) {
                              _savingsGoals[index] = SavingsGoal(
                                id: goal.id,
                                name: value,
                                targetAmount: goal.targetAmount,
                                currentAmount: goal.currentAmount,
                                deadline: goal.deadline,
                                progress: goal.progress,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Fecha Límite',
                        style: TextStyle(fontSize: 12, color: AppTheme.white),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: goal.deadline,
                        decoration: InputDecoration(
                          hintText: 'DD/MM/YYYY',
                          hintStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide.none,
                          ),
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        ),
                        style: const TextStyle(color: AppTheme.white, fontSize: 14),
                        onChanged: (value) {
                          setState(() {
                            final index = _savingsGoals.indexWhere((g) => g.id == goal.id);
                            if (index != -1) {
                              _savingsGoals[index] = SavingsGoal(
                                id: goal.id,
                                name: goal.name,
                                targetAmount: goal.targetAmount,
                                currentAmount: goal.currentAmount,
                                deadline: value,
                                progress: goal.progress,
                              );
                            }
                          });
                        },
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Barra de progreso mejorada
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Progreso',
                  style: TextStyle(fontSize: 14, color: AppTheme.white),
                ),
                Text(
                  '${progress.toStringAsFixed(0)}%',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFFF57F17),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Container(
              height: 8,
              decoration: BoxDecoration(
                color: AppTheme.darkSurfaceVariant,
                borderRadius: BorderRadius.circular(4),
              ),
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: (progress / 100).clamp(0.0, 1.0),
                child: Container(
                  decoration: BoxDecoration(
                    color: progress >= 100 ? Colors.green : const Color(0xFFF57F17),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '\$${goal.currentAmount} de \$${goal.targetAmount}',
                  style: const TextStyle(fontSize: 12, color: AppTheme.white),
                ),
                Text(
                  'Restante: \$${(target - current).toStringAsFixed(2)}',
                  style: const TextStyle(fontSize: 12, color: AppTheme.white),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Acciones
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.edit, size: 16, color: AppTheme.white),
                  label: const Text('Editar', style: TextStyle(color: AppTheme.white)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.add, size: 16, color: AppTheme.white),
                  label: const Text('Agregar', style: TextStyle(color: AppTheme.white)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {
                    setState(() {
                      _savingsGoals.removeWhere((g) => g.id == goal.id);
                    });
                  },
                  icon: const Icon(Icons.delete, size: 16, color: AppTheme.white),
                  label: const Text('Eliminar', style: TextStyle(color: AppTheme.white)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShoppingCategoryCard(String categoryId, String categoryName, String emoji, List<Map<String, dynamic>> items) {
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
                        child: Text(
                          emoji,
                          style: const TextStyle(fontSize: 20),
                        ),
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
                            color: AppTheme.white,
                          ),
                        ),
                      ],
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
                    backgroundColor: const Color(0xFFF57F17),
                    foregroundColor: Colors.white,
                  ),
                ),
              ],
            ),
            if (items.isEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 16),
                child: Center(
                  child: Column(
                    children: [
                      const Icon(Icons.shopping_basket_outlined, size: 32, color: AppTheme.white),
                      const SizedBox(height: 8),
                      Text(
                        'No hay artículos en esta categoría',
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 12),
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
                        label: const Text('Agregar primer artículo'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.darkSurfaceVariant,
                          foregroundColor: const Color(0xFFF57F17),
                        ),
                      ),
                    ],
                  ),
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
                            // Guardar en Supabase
                            _healthService.saveShoppingList(_marketList).then((result) {
                              if (result['success'] == true) {
                                print('FinanceSections: Lista de compras guardada en Supabase');
                              }
                            });
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
                                  : AppTheme.white,
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
                                    ? AppTheme.white
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
                                    ? AppTheme.white
                                    : AppTheme.white,
                                decoration: isPurchased
                                    ? TextDecoration.lineThrough
                                    : null,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, size: 18, color: AppTheme.white),
                        onPressed: () {
                          setState(() {
                            items.remove(item);
                            // Guardar en Supabase
                            _healthService.saveShoppingList(_marketList).then((result) {
                              if (result['success'] == true) {
                                print('FinanceSections: Lista de compras guardada en Supabase');
                              }
                            });
                          });
                        },
                      ),
                    ],
                  ),
                );
              }).toList(),
          ],
        ),
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
                        labelStyle: const TextStyle(color: AppTheme.white),
                        prefixIcon: const Icon(Icons.shopping_bag, color: AppTheme.white),
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
                              labelStyle: const TextStyle(color: AppTheme.white),
                              prefixIcon: const Icon(Icons.numbers, color: AppTheme.white),
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
                              labelStyle: const TextStyle(color: AppTheme.white),
                              prefixIcon: const Icon(Icons.straighten, color: AppTheme.white),
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
                            style: TextStyle(color: AppTheme.white, fontSize: 16),
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
                                    print('FinanceSections: Lista de compras guardada en Supabase');
                                  } else {
                                    print('FinanceSections: Error guardando lista de compras: ${result['error']}');
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
                        labelStyle: const TextStyle(color: AppTheme.white),
                        prefixIcon: const Icon(Icons.label, color: AppTheme.white),
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
                        labelStyle: const TextStyle(color: AppTheme.white),
                        hintText: '🍎',
                        hintStyle: const TextStyle(color: AppTheme.white, fontSize: 24),
                        prefixIcon: const Icon(Icons.emoji_emotions, color: AppTheme.white),
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
                            style: TextStyle(color: AppTheme.white, fontSize: 16),
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
                                    print('FinanceSections: Lista de compras guardada en Supabase');
                                  } else {
                                    print('FinanceSections: Error guardando lista de compras: ${result['error']}');
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
}

