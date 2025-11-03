import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../models/finance/budget_category.dart';
import '../../models/finance/expense.dart';
import '../../models/finance/credit_card.dart';
import '../../models/finance/bill.dart';
import '../../models/finance/investment.dart';
import '../../models/finance/savings_goal.dart';
import '../../models/finance/shopping_item.dart';
import '../../auth/providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../common/navigation_header.dart';

class FinanceSections extends StatefulWidget {
  const FinanceSections({super.key});

  @override
  State<FinanceSections> createState() => _FinanceSectionsState();
}

class _FinanceSectionsState extends State<FinanceSections> {
  String _activeSection = 'budget-tracker';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  
  // Estados
  String _monthlyBudget = '';
  List<BudgetCategory> _categories = [];
  List<Expense> _expenses = [];
  List<CreditCard> _creditCards = [];
  List<Bill> _bills = [];
  List<Investment> _investments = [];
  List<SavingsGoal> _savingsGoals = [];
  Map<String, List<ShoppingItem>> _shoppingList = {
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
            isActive: true,
            onTap: () {
              Navigator.pop(context);
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.restaurant,
            title: 'Nutrición',
            color: Colors.orange,
            onTap: () {
              Navigator.pop(context);
              context.go('/nutrition');
            },
          ),
          _buildDrawerItem(
            context,
            icon: Icons.fitness_center,
            title: 'Ejercicio',
            color: Colors.red,
            onTap: () {
              Navigator.pop(context);
              context.go('/exercise');
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
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            color,
            color.withOpacity(0.7),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
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
            child: Icon(Icons.trending_up, color: Colors.white, size: 16),
          ),
        ],
      ),
    );
  }

  Widget _buildBudgetTracker() {
    return SingleChildScrollView(
      child: Column(
        children: [
          _buildImprovedHeader(
            'Seguimiento de Presupuesto',
            'Controla tus gastos mensuales',
            Icons.account_balance_wallet,
            const Color(0xFF4A7C59),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              children: [
              // Monthly Budget Card
              Card(
                color: AppTheme.darkSurface,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.calendar_today, color: AppTheme.orangeAccent, size: 20),
                          SizedBox(width: 8),
                          Text(
                            'Presupuesto Mensual',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(
                            color: AppTheme.orangeAccent,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                          hintText: '0.00',
                          hintStyle: const TextStyle(color: AppTheme.white40),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(
                          color: AppTheme.white,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                        onChanged: (value) => setState(() => _monthlyBudget = value),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              // Summary Cards
              Row(
                children: [
                  Expanded(
                    child: _buildSummaryCard('6', 'Categorías', Icons.folder, Colors.blue),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSummaryCard('\$0', 'Total Gastado', Icons.bar_chart, Colors.orange),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSummaryCard('\$0', 'Restante', Icons.account_balance_wallet, Colors.green),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              // Categories
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Categorías de Gastos',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.add, size: 16),
                    label: const Text('Agregar'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4A7C59),
                      foregroundColor: Colors.white,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
                ..._categories.map((category) => _buildCategoryCard(category)),
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
            const SizedBox(height: 4),
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
                        color: AppTheme.orangeAccent.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.folder,
                        size: 18,
                        color: AppTheme.orangeAccent,
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
                IconButton(
                  icon: const Icon(Icons.more_vert, size: 18, color: AppTheme.white60),
                  onPressed: () {},
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
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
                                return BudgetCategory(
                                  id: c.id,
                                  name: c.name,
                                  budget: value,
                                  spent: c.spent,
                                  remaining: c.remaining,
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
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
                                return BudgetCategory(
                                  id: c.id,
                                  name: c.name,
                                  budget: c.budget,
                                  spent: value,
                                  remaining: c.remaining,
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        keyboardType: TextInputType.number,
                        initialValue: category.remaining,
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
                                return BudgetCategory(
                                  id: c.id,
                                  name: c.name,
                                  budget: c.budget,
                                  spent: c.spent,
                                  remaining: value,
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
              ],
            ),
            const SizedBox(height: 16),
            // Progress Bar
            Container(
              height: 6,
              decoration: BoxDecoration(
                color: AppTheme.darkSurfaceVariant,
                borderRadius: BorderRadius.circular(3),
              ),
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: 0.0,
                child: Container(
                  decoration: BoxDecoration(
                    color: AppTheme.orangeAccent,
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              '0% utilizado',
              style: TextStyle(fontSize: 12, color: AppTheme.white60),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildExpenseTracker() {
    final totalExpenses = _expenses.fold<double>(
      0.0,
      (sum, expense) => sum + (double.tryParse(expense.amount) ?? 0.0),
    );
    final avgExpense = _expenses.isEmpty ? 0.0 : totalExpenses / _expenses.length;

    return SingleChildScrollView(
      child: Column(
        children: [
          _buildImprovedHeader(
            'Seguimiento de Gastos',
            'Registra y analiza tus gastos',
            Icons.receipt,
            const Color(0xFF4A7C59),
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
                        '\$${totalExpenses.toStringAsFixed(2)}',
                        'Total Gastado',
                        Icons.attach_money,
                        Colors.red,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildSummaryCard(
                        '${_expenses.length}',
                        'Transacciones',
                        Icons.list,
                        Colors.blue,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildSummaryCard(
                        '\$${avgExpense.toStringAsFixed(2)}',
                        'Promedio',
                        Icons.trending_up,
                        Colors.green,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Botón para agregar gasto
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      setState(() {
                        _expenses.add(Expense(
                          id: DateTime.now().millisecondsSinceEpoch.toString(),
                          date: '',
                          description: '',
                          category: '',
                          amount: '',
                          paymentMethod: '',
                        ));
                      });
                    },
                    icon: const Icon(Icons.add_circle_outline),
                    label: const Text('Agregar Gasto'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4A7C59),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                // Lista de gastos
                if (_expenses.isEmpty)
                  _buildEmptyState('No hay gastos registrados', Icons.receipt)
                else
                  ..._expenses.map((expense) => _buildExpenseCard(expense)),
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

    return SingleChildScrollView(
      child: Column(
        children: [
          _buildImprovedHeader(
            'Gestor de Tarjetas',
            'Administra tus tarjetas de crédito',
            Icons.credit_card,
            const Color(0xFF4A7C59),
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
                        '${_creditCards.length}',
                        'Tarjetas',
                        Icons.credit_card,
                        Colors.blue,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildSummaryCard(
                        '\$${totalLimit.toStringAsFixed(2)}',
                        'Límite Total',
                        Icons.account_balance_wallet,
                        Colors.green,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildSummaryCard(
                        '\$${totalBalance.toStringAsFixed(2)}',
                        'Saldo Total',
                        Icons.trending_up,
                        Colors.orange,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Botón para agregar tarjeta
                SizedBox(
                  width: double.infinity,
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
                    icon: const Icon(Icons.add_circle_outline),
                    label: const Text('Agregar Tarjeta'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4A7C59),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                // Lista de tarjetas
                if (_creditCards.isEmpty)
                  _buildEmptyState('No hay tarjetas registradas', Icons.credit_card)
                else
                  ..._creditCards.map((card) => _buildCreditCardCard(card)),
              ],
            ),
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
            const Color(0xFF4A7C59),
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
                      backgroundColor: const Color(0xFF4A7C59),
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
            const Color(0xFF4A7C59),
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
                      backgroundColor: const Color(0xFF4A7C59),
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
            const Color(0xFF4A7C59),
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
                      backgroundColor: const Color(0xFF4A7C59),
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
    final totalItems = _shoppingList.values.fold<int>(0, (sum, list) => sum + list.length);
    final purchasedItems = _shoppingList.values.fold<int>(
      0,
      (sum, list) => sum + list.where((item) => item.purchased).length,
    );

    return Stack(
      children: [
        SingleChildScrollView(
          child: Column(
            children: [
              _buildImprovedHeader(
                'Lista de Compras',
                'Organiza tus compras por categorías',
                Icons.shopping_cart,
                const Color(0xFF4A7C59),
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
                            '$totalItems',
                            'Artículos',
                            Icons.shopping_basket,
                            Colors.blue,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildSummaryCard(
                            '$purchasedItems',
                            'Comprados',
                            Icons.check_circle,
                            Colors.green,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildSummaryCard(
                            '${mealCategories.length}',
                            'Categorías',
                            Icons.store,
                            Colors.orange,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // Lista de categorías
                    ...mealCategories.map((category) {
                      final items = _shoppingList[category['id']] ?? [];
                      return _buildShoppingCategoryCard(
                        category['id'] as String,
                        category['name'] as String,
                        category['icon'] as String,
                        items,
                      );
                    }),
                  ],
                ),
              ),
            ],
          ),
        ),
        // Modal para agregar items
        if (_showAddItemModal) _buildAddItemModal(),
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
                    color: const Color(0xFF4A7C59).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.credit_card,
                    size: 18,
                    color: Color(0xFF4A7C59),
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
                          color: AppTheme.white60,
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: expense.date,
                        decoration: InputDecoration(
                          hintText: 'DD/MM/YYYY',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: expense.paymentMethod,
                        decoration: InputDecoration(
                          hintText: 'Efectivo/Tarjeta',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: expense.description,
                        decoration: InputDecoration(
                          hintText: 'Descripción del gasto',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: expense.category,
                        decoration: InputDecoration(
                          hintText: 'Categoría',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        'Monto',
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: expense.amount,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '0.00',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
            // Acciones
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.edit, size: 16, color: AppTheme.white60),
                  label: const Text('Editar', style: TextStyle(color: AppTheme.white60)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {
                    setState(() {
                      _expenses.removeWhere((e) => e.id == expense.id);
                    });
                  },
                  icon: const Icon(Icons.delete, size: 16, color: Colors.red),
                  label: const Text('Eliminar', style: TextStyle(color: Colors.red)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCreditCardCard(CreditCard card) {
    final limit = double.tryParse(card.limit) ?? 0.0;
    final balance = double.tryParse(card.balance) ?? 0.0;
    final creditUsed = limit > 0 ? (balance / limit * 100).clamp(0.0, 100.0) : 0.0;

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
                    color: const Color(0xFF4A7C59).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.credit_card,
                    size: 18,
                    color: Color(0xFF4A7C59),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        card.name.isEmpty ? 'Tarjeta de Crédito' : card.name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.white,
                        ),
                      ),
                      Text(
                        card.bank.isEmpty ? 'Banco' : card.bank,
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
                    color: Colors.green,
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: card.name,
                        decoration: InputDecoration(
                          hintText: 'Nombre de la tarjeta',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: card.bank,
                        decoration: InputDecoration(
                          hintText: 'Banco',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: card.limit,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '\$0.00',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: card.balance,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '\$0.00',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: card.dueDate,
                        decoration: InputDecoration(
                          hintText: 'DD/MM/YYYY',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: card.minPayment,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '\$0.00',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
            const SizedBox(height: 16),
            // Barra de progreso del crédito utilizado
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Crédito Utilizado',
                  style: TextStyle(fontSize: 14, color: AppTheme.white70),
                ),
                Text(
                  '${creditUsed.toStringAsFixed(0)}%',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF4A7C59),
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
                widthFactor: (creditUsed / 100).clamp(0.0, 1.0),
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF4A7C59),
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
                  icon: const Icon(Icons.edit, size: 16, color: AppTheme.white60),
                  label: const Text('Editar', style: TextStyle(color: AppTheme.white60)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.visibility, size: 16, color: Colors.blue),
                  label: const Text('Ver Detalles', style: TextStyle(color: Colors.blue)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {
                    setState(() {
                      _creditCards.removeWhere((c) => c.id == card.id);
                    });
                  },
                  icon: const Icon(Icons.delete, size: 16, color: Colors.red),
                  label: const Text('Eliminar', style: TextStyle(color: Colors.red)),
                ),
              ],
            ),
          ],
        ),
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
                    color: const Color(0xFF4A7C59).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.description,
                    size: 18,
                    color: Color(0xFF4A7C59),
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
                          color: AppTheme.white60,
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: bill.amount,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '\$0.00',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: bill.dueDate,
                        decoration: InputDecoration(
                          hintText: 'DD/MM/YYYY',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: bill.name,
                        decoration: InputDecoration(
                          hintText: 'Nombre de la factura',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: bill.category,
                        decoration: InputDecoration(
                          hintText: 'Categoría',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                  style: TextStyle(fontSize: 14, color: AppTheme.white70),
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
                  icon: const Icon(Icons.edit, size: 16, color: AppTheme.white60),
                  label: const Text('Editar', style: TextStyle(color: AppTheme.white60)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.visibility, size: 16, color: Colors.blue),
                  label: const Text('Ver Detalles', style: TextStyle(color: Colors.blue)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {
                    setState(() {
                      _bills.removeWhere((b) => b.id == bill.id);
                    });
                  },
                  icon: const Icon(Icons.delete, size: 16, color: Colors.red),
                  label: const Text('Eliminar', style: TextStyle(color: Colors.red)),
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
                    color: const Color(0xFF4A7C59).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.trending_up,
                    size: 18,
                    color: Color(0xFF4A7C59),
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
                          color: AppTheme.white60,
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: investment.amount,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '\$0.00',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: investment.currentValue,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '\$0.00',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: investment.name,
                        decoration: InputDecoration(
                          hintText: 'Nombre de la inversión',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: investment.type,
                        decoration: InputDecoration(
                          hintText: 'Stock, Bond, etc.',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: investment.profit,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '\$0.00',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: investment.date,
                        decoration: InputDecoration(
                          hintText: 'DD/MM/YYYY',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                  style: TextStyle(fontSize: 14, color: AppTheme.white70),
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
                  icon: const Icon(Icons.edit, size: 16, color: AppTheme.white60),
                  label: const Text('Editar', style: TextStyle(color: AppTheme.white60)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.analytics, size: 16, color: Colors.blue),
                  label: const Text('Análisis', style: TextStyle(color: Colors.blue)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {
                    setState(() {
                      _investments.removeWhere((i) => i.id == investment.id);
                    });
                  },
                  icon: const Icon(Icons.delete, size: 16, color: Colors.red),
                  label: const Text('Eliminar', style: TextStyle(color: Colors.red)),
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
                    color: const Color(0xFF4A7C59).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.flag,
                    size: 18,
                    color: Color(0xFF4A7C59),
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
                          color: AppTheme.white60,
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: goal.targetAmount,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '\$0.00',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: goal.currentAmount,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          prefixText: '\$ ',
                          prefixStyle: const TextStyle(color: AppTheme.white),
                          hintText: '\$0.00',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: goal.name,
                        decoration: InputDecoration(
                          hintText: 'Nombre del objetivo',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                        style: TextStyle(fontSize: 12, color: AppTheme.white60),
                      ),
                      const SizedBox(height: 4),
                      TextFormField(
                        initialValue: goal.deadline,
                        decoration: InputDecoration(
                          hintText: 'DD/MM/YYYY',
                          hintStyle: const TextStyle(color: AppTheme.white40),
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
                  style: TextStyle(fontSize: 14, color: AppTheme.white70),
                ),
                Text(
                  '${progress.toStringAsFixed(0)}%',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF4A7C59),
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
                    color: progress >= 100 ? Colors.green : const Color(0xFF4A7C59),
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
                  style: const TextStyle(fontSize: 12, color: AppTheme.white70),
                ),
                Text(
                  'Restante: \$${(target - current).toStringAsFixed(2)}',
                  style: const TextStyle(fontSize: 12, color: Colors.orange),
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
                  icon: const Icon(Icons.edit, size: 16, color: AppTheme.white60),
                  label: const Text('Editar', style: TextStyle(color: AppTheme.white60)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.add, size: 16, color: Colors.green),
                  label: const Text('Agregar', style: TextStyle(color: Colors.green)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () {
                    setState(() {
                      _savingsGoals.removeWhere((g) => g.id == goal.id);
                    });
                  },
                  icon: const Icon(Icons.delete, size: 16, color: Colors.red),
                  label: const Text('Eliminar', style: TextStyle(color: Colors.red)),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShoppingCategoryCard(String categoryId, String categoryName, String emoji, List<ShoppingItem> items) {
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
                            color: AppTheme.white60,
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
                      _newItemText = '';
                      _newItemQuantity = 1;
                      _showAddItemModal = true;
                    });
                  },
                  icon: const Icon(Icons.add, size: 16),
                  label: const Text('Agregar'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4A7C59),
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
                      const Icon(Icons.shopping_basket_outlined, size: 32, color: AppTheme.white40),
                      const SizedBox(height: 8),
                      Text(
                        'No hay artículos en esta categoría',
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppTheme.white60,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton.icon(
                        onPressed: () {
                          setState(() {
                            _selectedCategory = categoryId;
                            _newItemText = '';
                            _newItemQuantity = 1;
                            _showAddItemModal = true;
                          });
                        },
                        icon: const Icon(Icons.add, size: 16),
                        label: const Text('Agregar primer artículo'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.darkSurfaceVariant,
                          foregroundColor: const Color(0xFF4A7C59),
                        ),
                      ),
                    ],
                  ),
                ),
              )
            else
              ...items.map((item) => _buildShoppingItem(item, categoryId)),
          ],
        ),
      ),
    );
  }

  Widget _buildAddItemModal() {
    final category = mealCategories.firstWhere(
      (cat) => cat['id'] == _selectedCategory,
      orElse: () => mealCategories[0],
    );

    return GestureDetector(
      onTap: () {
        setState(() {
          _showAddItemModal = false;
          _selectedCategory = '';
          _newItemText = '';
          _newItemQuantity = 1;
        });
      },
      child: Container(
        color: Colors.black.withOpacity(0.5),
        child: Center(
          child: GestureDetector(
            onTap: () {}, // Prevenir que el tap se propague
            child: Container(
              margin: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: const Color(0xFF4A7C59),
                  width: 2,
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            'Agregar a ${category['name']}',
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, color: AppTheme.white),
                          onPressed: () {
                            setState(() {
                              _showAddItemModal = false;
                              _selectedCategory = '';
                              _newItemText = '';
                              _newItemQuantity = 1;
                            });
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    // Nombre del producto
                    const Text(
                      'Nombre del producto:',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      onChanged: (value) => setState(() => _newItemText = value),
                      decoration: InputDecoration(
                        hintText: 'Ej: Manzanas',
                        hintStyle: const TextStyle(color: AppTheme.white40),
                        filled: true,
                        fillColor: AppTheme.darkSurfaceVariant,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide.none,
                        ),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
                      style: const TextStyle(color: AppTheme.white, fontSize: 16),
                    ),
                    const SizedBox(height: 24),
                    // Cantidad
                    const Text(
                      'Cantidad:',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        IconButton(
                          onPressed: () {
                            setState(() {
                              if (_newItemQuantity > 1) {
                                _newItemQuantity--;
                              }
                            });
                          },
                          icon: const Icon(Icons.remove, color: Color(0xFF4A7C59)),
                          style: IconButton.styleFrom(
                            backgroundColor: AppTheme.darkSurfaceVariant,
                            padding: const EdgeInsets.all(12),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                          decoration: BoxDecoration(
                            color: AppTheme.darkSurfaceVariant,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            '$_newItemQuantity',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        IconButton(
                          onPressed: () {
                            setState(() {
                              _newItemQuantity++;
                            });
                          },
                          icon: const Icon(Icons.add, color: Color(0xFF4A7C59)),
                          style: IconButton.styleFrom(
                            backgroundColor: AppTheme.darkSurfaceVariant,
                            padding: const EdgeInsets.all(12),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),
                    // Botones
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              setState(() {
                                _showAddItemModal = false;
                                _selectedCategory = '';
                                _newItemText = '';
                                _newItemQuantity = 1;
                              });
                            },
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: AppTheme.white60),
                              foregroundColor: AppTheme.white,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                            ),
                            child: const Text('Cancelar'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          flex: 2,
                          child: ElevatedButton(
                            onPressed: () {
                              if (_newItemText.trim().isNotEmpty && _selectedCategory.isNotEmpty) {
                                setState(() {
                                  _shoppingList[_selectedCategory] = [
                                    ...(_shoppingList[_selectedCategory] ?? []),
                                    ShoppingItem(
                                      id: DateTime.now().millisecondsSinceEpoch.toString(),
                                      name: _newItemText.trim(),
                                      quantity: _newItemQuantity,
                                      purchased: false,
                                    ),
                                  ];
                                  _showAddItemModal = false;
                                  _selectedCategory = '';
                                  _newItemText = '';
                                  _newItemQuantity = 1;
                                });
                              }
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF4A7C59),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                            ),
                            child: const Text('Agregar'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildShoppingItem(ShoppingItem item, String categoryId) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurfaceVariant,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppTheme.darkSurfaceVariant,
          width: 1,
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              GestureDetector(
                onTap: () {
                  setState(() {
                    _shoppingList[categoryId] = _shoppingList[categoryId]!.map((i) {
                      if (i.id == item.id) {
                        return ShoppingItem(
                          id: i.id,
                          name: i.name,
                          quantity: i.quantity,
                          purchased: !i.purchased,
                        );
                      }
                      return i;
                    }).toList();
                  });
                },
                child: Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: item.purchased ? Colors.green : Colors.transparent,
                    border: Border.all(
                      color: item.purchased ? Colors.green : AppTheme.white60,
                      width: 2,
                    ),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: item.purchased
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
                      item.name,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: item.purchased ? AppTheme.white40 : AppTheme.white,
                        decoration: item.purchased ? TextDecoration.lineThrough : null,
                      ),
                    ),
                    Text(
                      'Cantidad: ${item.quantity}',
                      style: TextStyle(
                        fontSize: 14,
                        color: item.purchased ? AppTheme.white40 : AppTheme.white60,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.delete, color: Colors.red, size: 20),
                onPressed: () {
                  setState(() {
                    _shoppingList[categoryId] = _shoppingList[categoryId]!
                        .where((i) => i.id != item.id)
                        .toList();
                  });
                },
              ),
            ],
          ),
          const SizedBox(height: 8),
          // Indicador de estado
          Row(
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: item.purchased ? Colors.green : Colors.orange,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                item.purchased ? 'Comprado' : 'Pendiente',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: item.purchased ? Colors.green : Colors.orange,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

