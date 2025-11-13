import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../auth/providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../common/navigation_header.dart';

class EntrepreneurshipSections extends StatefulWidget {
  const EntrepreneurshipSections({super.key});

  @override
  State<EntrepreneurshipSections> createState() => _EntrepreneurshipSectionsState();
}

class _EntrepreneurshipSectionsState extends State<EntrepreneurshipSections> {
  String _activeSection = 'ideas';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  
  // Listas de datos para cada subsección
  List<Map<String, dynamic>> _businessIdeas = [];
  List<Map<String, dynamic>> _businessPlans = [];
  List<Map<String, dynamic>> _finances = [];
  List<Map<String, dynamic>> _marketingCampaigns = [];
  List<Map<String, dynamic>> _contacts = [];
  List<Map<String, dynamic>> _metrics = [];
  List<Map<String, dynamic>> _resources = [];
  List<Map<String, dynamic>> _planning = [];
  
  // Modal states
  bool _showAddIdeaModal = false;
  bool _showAddPlanModal = false;
  bool _showAddFinanceModal = false;
  bool _showAddMarketingModal = false;
  bool _showAddContactModal = false;
  bool _showAddMetricModal = false;
  bool _showAddResourceModal = false;
  bool _showAddPlanningModal = false;
  
  // TextEditingControllers for Ideas
  final TextEditingController _ideaTitleController = TextEditingController();
  final TextEditingController _ideaDescriptionController = TextEditingController();
  final TextEditingController _ideaCategoryController = TextEditingController();
  final TextEditingController _ideaMarketController = TextEditingController();
  final TextEditingController _ideaCompetitionController = TextEditingController();
  final TextEditingController _ideaNotesController = TextEditingController();
  String _selectedIdeaStatus = 'nueva';
  String _selectedIdeaPriority = 'media';
  
  // TextEditingControllers for Business Plan
  final TextEditingController _planNameController = TextEditingController();
  final TextEditingController _planExecutiveSummaryController = TextEditingController();
  final TextEditingController _planMarketAnalysisController = TextEditingController();
  final TextEditingController _planMarketingStrategyController = TextEditingController();
  final TextEditingController _planFinancialProjectionsController = TextEditingController();
  final TextEditingController _planOperationsController = TextEditingController();
  String _selectedPlanStatus = 'borrador';
  
  // TextEditingControllers for Finances
  final TextEditingController _financeCategoryController = TextEditingController();
  final TextEditingController _financeAmountController = TextEditingController();
  final TextEditingController _financeDescriptionController = TextEditingController();
  final TextEditingController _financeDateController = TextEditingController();
  String _selectedFinanceType = 'ingreso';
  
  // TextEditingControllers for Marketing
  final TextEditingController _marketingNameController = TextEditingController();
  final TextEditingController _marketingDescriptionController = TextEditingController();
  final TextEditingController _marketingBudgetController = TextEditingController();
  final TextEditingController _marketingStartDateController = TextEditingController();
  final TextEditingController _marketingEndDateController = TextEditingController();
  String _selectedMarketingType = 'redes_sociales';
  String _selectedMarketingStatus = 'planificada';
  
  // TextEditingControllers for Contacts
  final TextEditingController _contactNameController = TextEditingController();
  final TextEditingController _contactCompanyController = TextEditingController();
  final TextEditingController _contactEmailController = TextEditingController();
  final TextEditingController _contactPhoneController = TextEditingController();
  final TextEditingController _contactPositionController = TextEditingController();
  final TextEditingController _contactNotesController = TextEditingController();
  String _selectedContactType = 'cliente';
  
  // TextEditingControllers for Resources
  final TextEditingController _resourceNameController = TextEditingController();
  final TextEditingController _resourceCategoryController = TextEditingController();
  final TextEditingController _resourceQuantityController = TextEditingController();
  final TextEditingController _resourceCostController = TextEditingController();
  final TextEditingController _resourceSupplierController = TextEditingController();
  String _selectedResourceStatus = 'disponible';
  
  // TextEditingControllers for Planning
  final TextEditingController _planningTaskController = TextEditingController();
  final TextEditingController _planningDescriptionController = TextEditingController();
  final TextEditingController _planningDeadlineController = TextEditingController();
  final TextEditingController _planningAssigneeController = TextEditingController();
  String _selectedPlanningPriority = 'media';
  String _selectedPlanningStatus = 'pendiente';

  final sections = [
    {'id': 'ideas', 'name': 'Ideas de Negocio', 'icon': Icons.lightbulb_outline},
    {'id': 'business-plan', 'name': 'Plan de Negocio', 'icon': Icons.description},
    {'id': 'finances', 'name': 'Finanzas', 'icon': Icons.account_balance_wallet},
    {'id': 'marketing', 'name': 'Marketing', 'icon': Icons.campaign},
    {'id': 'contacts', 'name': 'Contactos', 'icon': Icons.contacts},
    {'id': 'metrics', 'name': 'Métricas', 'icon': Icons.analytics},
    {'id': 'resources', 'name': 'Recursos', 'icon': Icons.inventory},
    {'id': 'planning', 'name': 'Planificación', 'icon': Icons.calendar_today},
  ];

  @override
  void dispose() {
    _ideaTitleController.dispose();
    _ideaDescriptionController.dispose();
    _ideaCategoryController.dispose();
    _ideaMarketController.dispose();
    _ideaCompetitionController.dispose();
    _ideaNotesController.dispose();
    _planNameController.dispose();
    _planExecutiveSummaryController.dispose();
    _planMarketAnalysisController.dispose();
    _planMarketingStrategyController.dispose();
    _planFinancialProjectionsController.dispose();
    _planOperationsController.dispose();
    _financeCategoryController.dispose();
    _financeAmountController.dispose();
    _financeDescriptionController.dispose();
    _financeDateController.dispose();
    _marketingNameController.dispose();
    _marketingDescriptionController.dispose();
    _marketingBudgetController.dispose();
    _marketingStartDateController.dispose();
    _marketingEndDateController.dispose();
    _contactNameController.dispose();
    _contactCompanyController.dispose();
    _contactEmailController.dispose();
    _contactPhoneController.dispose();
    _contactPositionController.dispose();
    _contactNotesController.dispose();
    _resourceNameController.dispose();
    _resourceCategoryController.dispose();
    _resourceQuantityController.dispose();
    _resourceCostController.dispose();
    _resourceSupplierController.dispose();
    _planningTaskController.dispose();
    _planningDescriptionController.dispose();
    _planningDeadlineController.dispose();
    _planningAssigneeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: Colors.transparent,
      drawer: _buildNavigationDrawer(context),
      appBar: NavigationHeader(currentSection: 'entrepreneurship'),
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
                  Colors.deepPurple.withOpacity(0.3),
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
                    color: Colors.deepPurple,
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: const Icon(
                    Icons.business,
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
            isActive: true,
            onTap: () {
              Navigator.pop(context);
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
          color: isActive ? color.withOpacity(0.3) : color.withOpacity(0.2),
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
      height: 65,
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: sections.map((section) {
          final isActive = _activeSection == section['id'];
          return GestureDetector(
            onTap: () => setState(() => _activeSection = section['id'] as String),
            child: Container(
              width: 80,
              height: 50,
              margin: const EdgeInsets.symmetric(horizontal: 4),
              decoration: BoxDecoration(
                color: isActive 
                    ? Colors.deepPurple.withOpacity(0.2)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isActive 
                      ? Colors.deepPurple 
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
                        ? Colors.deepPurple 
                        : AppTheme.white,
                    size: 20,
                  ),
                  const SizedBox(height: 2),
                  Flexible(
                    child: Text(
                      section['name'] as String,
                      style: TextStyle(
                        fontSize: 9,
                        color: isActive 
                            ? Colors.deepPurple 
                            : AppTheme.white,
                        fontWeight: isActive 
                            ? FontWeight.w600 
                            : FontWeight.normal,
                        height: 1.0,
                      ),
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildActiveSection() {
    switch (_activeSection) {
      case 'ideas':
        return _buildBusinessIdeas();
      case 'business-plan':
        return _buildBusinessPlan();
      case 'finances':
        return _buildFinances();
      case 'marketing':
        return _buildMarketing();
      case 'contacts':
        return _buildContacts();
      case 'metrics':
        return _buildMetrics();
      case 'resources':
        return _buildResources();
      case 'planning':
        return _buildPlanning();
      default:
        return _buildBusinessIdeas();
    }
  }

  Widget _buildBusinessIdeas() {
    final stats = _getIdeasStats();
    
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    '💡 Ideas de Negocio',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => setState(() => _showAddIdeaModal = true),
                    icon: const Icon(Icons.add, size: 18),
                    label: const Text('Agregar'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.deepPurple,
                      foregroundColor: AppTheme.white,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              _buildStatsRow([
                _buildStatCard('Total', stats['total'].toString(), Icons.lightbulb, Colors.deepPurple),
                _buildStatCard('En Desarrollo', stats['enDesarrollo'].toString(), Icons.work, Colors.blue),
                _buildStatCard('Prioritarias', stats['prioritarias'].toString(), Icons.star, Colors.amber),
              ]),
              const SizedBox(height: 24),
              if (_businessIdeas.isEmpty)
                _buildIdeasEmptyState()
              else
                ..._businessIdeas.map((idea) => _buildDetailedIdeaCard(idea)),
            ],
          ),
        ),
        if (_showAddIdeaModal) _buildAddIdeaModal(),
      ],
    );
  }
  
  Map<String, int> _getIdeasStats() {
    return {
      'total': _businessIdeas.length,
      'enDesarrollo': _businessIdeas.where((i) => i['status'] == 'en_desarrollo').length,
      'prioritarias': _businessIdeas.where((i) => i['priority'] == 'alta').length,
    };
  }
  
  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.darkSurfaceVariant),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.white,
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildStatsRow(List<Widget> stats) {
    return Row(
      children: stats.map((stat) => Expanded(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4),
          child: stat,
        ),
      )).toList(),
    );
  }
  
  Widget _buildIdeasEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.deepPurple.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.lightbulb_outline,
                size: 64,
                color: Colors.deepPurple.withOpacity(0.6),
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'No hay ideas de negocio registradas',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppTheme.white,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            const Text(
              'Agrega tus ideas de negocio para desarrollarlas',
              style: TextStyle(
                fontSize: 14,
                color: AppTheme.white,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildDetailedIdeaCard(Map<String, dynamic> idea) {
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
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.deepPurple.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.lightbulb,
                    color: Colors.deepPurple,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        idea['title'] ?? 'Idea sin título',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          _buildStatusChip(idea['status'] ?? 'nueva'),
                          const SizedBox(width: 8),
                          _buildPriorityChip(idea['priority'] ?? 'media'),
                        ],
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.edit, color: AppTheme.white),
                  onPressed: () {},
                ),
                IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: () {
                    setState(() {
                      _businessIdeas.remove(idea);
                    });
                  },
                ),
              ],
            ),
            if (idea['description'] != null) ...[
              const SizedBox(height: 12),
              Text(
                idea['description'],
                style: const TextStyle(
                  fontSize: 14,
                  color: AppTheme.white,
                ),
              ),
            ],
            if (idea['category'] != null) ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.category, size: 16, color: AppTheme.white),
                  const SizedBox(width: 4),
                  Text(
                    'Categoría: ${idea['category']}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.white,
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
  
  Widget _buildStatusChip(String status) {
    final colors = {
      'nueva': Colors.blue,
      'en_desarrollo': Colors.orange,
      'pausada': Colors.grey,
      'completada': Colors.green,
    };
    final labels = {
      'nueva': 'Nueva',
      'en_desarrollo': 'En Desarrollo',
      'pausada': 'Pausada',
      'completada': 'Completada',
    };
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: colors[status]?.withOpacity(0.2) ?? Colors.grey.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        labels[status] ?? status,
        style: TextStyle(
          fontSize: 10,
          color: colors[status] ?? Colors.grey,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
  
  Widget _buildPriorityChip(String priority) {
    final colors = {
      'alta': Colors.red,
      'media': Colors.orange,
      'baja': Colors.green,
    };
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: colors[priority]?.withOpacity(0.2) ?? Colors.grey.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.star,
            size: 12,
            color: colors[priority] ?? Colors.grey,
          ),
          const SizedBox(width: 4),
          Text(
            priority.toUpperCase(),
            style: TextStyle(
              fontSize: 10,
              color: colors[priority] ?? Colors.grey,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAddIdeaModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.9,
            maxWidth: MediaQuery.of(context).size.width * 0.9,
          ),
          child: Container(
            margin: const EdgeInsets.all(24),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(20),
            ),
            child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Agregar Idea de Negocio',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () => setState(() => _showAddIdeaModal = false),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _ideaTitleController,
                  decoration: const InputDecoration(
                    labelText: 'Título',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _ideaDescriptionController,
                  maxLines: 3,
                  decoration: const InputDecoration(
                    labelText: 'Descripción',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _ideaCategoryController,
                  decoration: const InputDecoration(
                    labelText: 'Categoría',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedIdeaStatus,
                  decoration: const InputDecoration(
                    labelText: 'Estado',
                    border: OutlineInputBorder(),
                  ),
                  items: ['nueva', 'en_desarrollo', 'pausada', 'completada']
                      .map((status) => DropdownMenuItem(
                            value: status,
                            child: Text(status.replaceAll('_', ' ').toUpperCase()),
                          ))
                      .toList(),
                  onChanged: (value) => setState(() => _selectedIdeaStatus = value!),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedIdeaPriority,
                  decoration: const InputDecoration(
                    labelText: 'Prioridad',
                    border: OutlineInputBorder(),
                  ),
                  items: ['alta', 'media', 'baja']
                      .map((priority) => DropdownMenuItem(
                            value: priority,
                            child: Text(priority.toUpperCase()),
                          ))
                      .toList(),
                  onChanged: (value) => setState(() => _selectedIdeaPriority = value!),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () => setState(() => _showAddIdeaModal = false),
                      child: const Text('Cancelar'),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        if (_ideaTitleController.text.isNotEmpty) {
                          setState(() {
                            _businessIdeas.add({
                              'id': DateTime.now().millisecondsSinceEpoch.toString(),
                              'title': _ideaTitleController.text,
                              'description': _ideaDescriptionController.text,
                              'category': _ideaCategoryController.text,
                              'status': _selectedIdeaStatus,
                              'priority': _selectedIdeaPriority,
                              'market': _ideaMarketController.text,
                              'competition': _ideaCompetitionController.text,
                              'notes': _ideaNotesController.text,
                              'createdAt': DateTime.now().toIso8601String(),
                            });
                            _ideaTitleController.clear();
                            _ideaDescriptionController.clear();
                            _ideaCategoryController.clear();
                            _ideaMarketController.clear();
                            _ideaCompetitionController.clear();
                            _ideaNotesController.clear();
                            _showAddIdeaModal = false;
                          });
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepPurple,
                      ),
                      child: const Text('Agregar'),
                    ),
                  ],
                ),
              ],
            ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBusinessPlan() {
    final stats = _getBusinessPlansStats();
    
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    '📋 Plan de Negocio',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => setState(() => _showAddPlanModal = true),
                    icon: const Icon(Icons.add, size: 18),
                    label: const Text('Agregar'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.deepPurple,
                      foregroundColor: AppTheme.white,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              _buildStatsRow([
                _buildStatCard('Total', stats['total'].toString(), Icons.description, Colors.deepPurple),
                _buildStatCard('Completados', stats['completados'].toString(), Icons.check_circle, Colors.green),
                _buildStatCard('En Progreso', stats['enProgreso'].toString(), Icons.work, Colors.orange),
              ]),
              const SizedBox(height: 24),
              if (_businessPlans.isEmpty)
                _buildEmptyState(
                  'No hay planes de negocio registrados',
                  Icons.description,
                  'Crea tu primer plan de negocio para organizar tu emprendimiento',
                )
              else
                ..._businessPlans.map((plan) => _buildDetailedPlanCard(plan)),
            ],
          ),
        ),
        if (_showAddPlanModal) _buildAddPlanModal(),
      ],
    );
  }
  
  Map<String, int> _getBusinessPlansStats() {
    return {
      'total': _businessPlans.length,
      'completados': _businessPlans.where((p) => p['status'] == 'completado').length,
      'enProgreso': _businessPlans.where((p) => p['status'] == 'en_progreso').length,
    };
  }
  
  Widget _buildDetailedPlanCard(Map<String, dynamic> plan) {
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
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.deepPurple.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.description,
                    color: Colors.deepPurple,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        plan['name'] ?? 'Plan sin nombre',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      _buildStatusChip(plan['status'] ?? 'borrador'),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.edit, color: AppTheme.white),
                  onPressed: () {},
                ),
                IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: () {
                    setState(() {
                      _businessPlans.remove(plan);
                    });
                  },
                ),
              ],
            ),
            if (plan['executiveSummary'] != null) ...[
              const SizedBox(height: 12),
              Text(
                'Resumen Ejecutivo:',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.white,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                plan['executiveSummary'],
                style: const TextStyle(
                  fontSize: 14,
                  color: AppTheme.white,
                ),
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ],
        ),
      ),
    );
  }
  
  Widget _buildAddPlanModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.9,
            maxWidth: MediaQuery.of(context).size.width * 0.9,
          ),
          child: Container(
            margin: const EdgeInsets.all(24),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(20),
            ),
            child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Agregar Plan de Negocio',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () => setState(() => _showAddPlanModal = false),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _planNameController,
                  decoration: const InputDecoration(
                    labelText: 'Nombre del Plan',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _planExecutiveSummaryController,
                  maxLines: 4,
                  decoration: const InputDecoration(
                    labelText: 'Resumen Ejecutivo',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedPlanStatus,
                  decoration: const InputDecoration(
                    labelText: 'Estado',
                    border: OutlineInputBorder(),
                  ),
                  items: ['borrador', 'en_progreso', 'completado']
                      .map((status) => DropdownMenuItem(
                            value: status,
                            child: Text(status.replaceAll('_', ' ').toUpperCase()),
                          ))
                      .toList(),
                  onChanged: (value) => setState(() => _selectedPlanStatus = value!),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () => setState(() => _showAddPlanModal = false),
                      child: const Text('Cancelar'),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        if (_planNameController.text.isNotEmpty) {
                          setState(() {
                            _businessPlans.add({
                              'id': DateTime.now().millisecondsSinceEpoch.toString(),
                              'name': _planNameController.text,
                              'executiveSummary': _planExecutiveSummaryController.text,
                              'marketAnalysis': _planMarketAnalysisController.text,
                              'marketingStrategy': _planMarketingStrategyController.text,
                              'financialProjections': _planFinancialProjectionsController.text,
                              'operations': _planOperationsController.text,
                              'status': _selectedPlanStatus,
                              'createdAt': DateTime.now().toIso8601String(),
                            });
                            _planNameController.clear();
                            _planExecutiveSummaryController.clear();
                            _planMarketAnalysisController.clear();
                            _planMarketingStrategyController.clear();
                            _planFinancialProjectionsController.clear();
                            _planOperationsController.clear();
                            _showAddPlanModal = false;
                          });
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepPurple,
                      ),
                      child: const Text('Agregar'),
                    ),
                  ],
                ),
              ],
            ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFinances() {
    final stats = _getFinancesStats();
    
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    '💰 Finanzas del Emprendimiento',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => setState(() => _showAddFinanceModal = true),
                    icon: const Icon(Icons.add, size: 18),
                    label: const Text('Agregar'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.deepPurple,
                      foregroundColor: AppTheme.white,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              _buildStatsRow([
                _buildStatCard('Ingresos', '\$${stats['ingresos']}', Icons.trending_up, Colors.green),
                _buildStatCard('Gastos', '\$${stats['gastos']}', Icons.trending_down, Colors.red),
                _buildStatCard('Balance', '\$${stats['balance']}', Icons.account_balance, Colors.blue),
              ]),
              const SizedBox(height: 24),
              if (_finances.isEmpty)
                _buildEmptyState(
                  'No hay registros financieros',
                  Icons.account_balance_wallet,
                  'Agrega tus ingresos y gastos para llevar un control financiero',
                )
              else
                ..._finances.map((finance) => _buildDetailedFinanceCard(finance)),
            ],
          ),
        ),
        if (_showAddFinanceModal) _buildAddFinanceModal(),
      ],
    );
  }
  
  Map<String, double> _getFinancesStats() {
    double ingresos = _finances
        .where((f) => f['type'] == 'ingreso')
        .fold(0.0, (sum, f) => sum + (f['amount'] ?? 0.0));
    double gastos = _finances
        .where((f) => f['type'] == 'gasto')
        .fold(0.0, (sum, f) => sum + (f['amount'] ?? 0.0));
    return {
      'ingresos': ingresos,
      'gastos': gastos,
      'balance': ingresos - gastos,
    };
  }
  
  Widget _buildDetailedFinanceCard(Map<String, dynamic> finance) {
    final isIncome = finance['type'] == 'ingreso';
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
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: (isIncome ? Colors.green : Colors.red).withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                isIncome ? Icons.trending_up : Icons.trending_down,
                color: isIncome ? Colors.green : Colors.red,
                size: 24,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    finance['category'] ?? 'Sin categoría',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  if (finance['description'] != null)
                    Text(
                      finance['description'],
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                      ),
                    ),
                ],
              ),
            ),
            Text(
              '\$${(finance['amount'] ?? 0.0).toStringAsFixed(2)}',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: isIncome ? Colors.green : Colors.red,
              ),
            ),
            IconButton(
              icon: const Icon(Icons.delete, color: Colors.red),
              onPressed: () {
                setState(() {
                  _finances.remove(finance);
                });
              },
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildAddFinanceModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.9,
            maxWidth: MediaQuery.of(context).size.width * 0.9,
          ),
          child: Container(
            margin: const EdgeInsets.all(24),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(20),
            ),
            child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Agregar Registro Financiero',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () => setState(() => _showAddFinanceModal = false),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedFinanceType,
                  decoration: const InputDecoration(
                    labelText: 'Tipo',
                    border: OutlineInputBorder(),
                  ),
                  items: ['ingreso', 'gasto']
                      .map((type) => DropdownMenuItem(
                            value: type,
                            child: Text(type.toUpperCase()),
                          ))
                      .toList(),
                  onChanged: (value) => setState(() => _selectedFinanceType = value!),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _financeCategoryController,
                  decoration: const InputDecoration(
                    labelText: 'Categoría',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _financeAmountController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Monto',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _financeDescriptionController,
                  maxLines: 2,
                  decoration: const InputDecoration(
                    labelText: 'Descripción',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () => setState(() => _showAddFinanceModal = false),
                      child: const Text('Cancelar'),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        final amount = double.tryParse(_financeAmountController.text);
                        if (amount != null && _financeCategoryController.text.isNotEmpty) {
                          setState(() {
                            _finances.add({
                              'id': DateTime.now().millisecondsSinceEpoch.toString(),
                              'type': _selectedFinanceType,
                              'category': _financeCategoryController.text,
                              'amount': amount,
                              'description': _financeDescriptionController.text,
                              'date': _financeDateController.text.isEmpty 
                                  ? DateFormat('yyyy-MM-dd').format(DateTime.now())
                                  : _financeDateController.text,
                              'createdAt': DateTime.now().toIso8601String(),
                            });
                            _financeCategoryController.clear();
                            _financeAmountController.clear();
                            _financeDescriptionController.clear();
                            _financeDateController.clear();
                            _showAddFinanceModal = false;
                          });
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepPurple,
                      ),
                      child: const Text('Agregar'),
                    ),
                  ],
                ),
              ],
            ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMarketing() {
    final stats = _getMarketingStats();
    
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    '📢 Marketing y Ventas',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => setState(() => _showAddMarketingModal = true),
                    icon: const Icon(Icons.add, size: 18),
                    label: const Text('Agregar'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.deepPurple,
                      foregroundColor: AppTheme.white,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              _buildStatsRow([
                _buildStatCard('Total', stats['total'].toString(), Icons.campaign, Colors.deepPurple),
                _buildStatCard('Activas', stats['activas'].toString(), Icons.play_arrow, Colors.green),
                _buildStatCard('Presupuesto', '\$${stats['presupuesto']}', Icons.monetization_on, Colors.amber),
              ]),
              const SizedBox(height: 24),
              if (_marketingCampaigns.isEmpty)
                _buildEmptyState(
                  'No hay campañas de marketing',
                  Icons.campaign,
                  'Crea campañas de marketing para promocionar tu negocio',
                )
              else
                ..._marketingCampaigns.map((campaign) => _buildDetailedMarketingCard(campaign)),
            ],
          ),
        ),
        if (_showAddMarketingModal) _buildAddMarketingModal(),
      ],
    );
  }
  
  Map<String, dynamic> _getMarketingStats() {
    double totalBudget = _marketingCampaigns.fold(0.0, (sum, c) => sum + (c['budget'] ?? 0.0));
    return {
      'total': _marketingCampaigns.length,
      'activas': _marketingCampaigns.where((c) => c['status'] == 'activa').length,
      'presupuesto': totalBudget.toStringAsFixed(0),
    };
  }
  
  Widget _buildDetailedMarketingCard(Map<String, dynamic> campaign) {
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
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.deepPurple.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.campaign,
                    color: Colors.deepPurple,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        campaign['name'] ?? 'Campaña sin nombre',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      _buildStatusChip(campaign['status'] ?? 'planificada'),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: () {
                    setState(() {
                      _marketingCampaigns.remove(campaign);
                    });
                  },
                ),
              ],
            ),
            if (campaign['description'] != null) ...[
              const SizedBox(height: 12),
              Text(
                campaign['description'],
                style: const TextStyle(
                  fontSize: 14,
                  color: AppTheme.white,
                ),
              ),
            ],
            const SizedBox(height: 12),
            Row(
              children: [
                Icon(Icons.monetization_on, size: 16, color: AppTheme.white),
                const SizedBox(width: 4),
                Text(
                  'Presupuesto: \$${(campaign['budget'] ?? 0.0).toStringAsFixed(2)}',
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
    );
  }
  
  Widget _buildAddMarketingModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.9,
            maxWidth: MediaQuery.of(context).size.width * 0.9,
          ),
          child: Container(
            margin: const EdgeInsets.all(24),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(20),
            ),
            child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Agregar Campaña de Marketing',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () => setState(() => _showAddMarketingModal = false),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _marketingNameController,
                  decoration: const InputDecoration(
                    labelText: 'Nombre de la Campaña',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _marketingDescriptionController,
                  maxLines: 3,
                  decoration: const InputDecoration(
                    labelText: 'Descripción',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _marketingBudgetController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Presupuesto',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedMarketingType,
                  decoration: const InputDecoration(
                    labelText: 'Tipo',
                    border: OutlineInputBorder(),
                  ),
                  items: ['redes_sociales', 'email', 'publicidad', 'eventos']
                      .map((type) => DropdownMenuItem(
                            value: type,
                            child: Text(type.replaceAll('_', ' ').toUpperCase()),
                          ))
                      .toList(),
                  onChanged: (value) => setState(() => _selectedMarketingType = value!),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedMarketingStatus,
                  decoration: const InputDecoration(
                    labelText: 'Estado',
                    border: OutlineInputBorder(),
                  ),
                  items: ['planificada', 'activa', 'completada', 'pausada']
                      .map((status) => DropdownMenuItem(
                            value: status,
                            child: Text(status.toUpperCase()),
                          ))
                      .toList(),
                  onChanged: (value) => setState(() => _selectedMarketingStatus = value!),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () => setState(() => _showAddMarketingModal = false),
                      child: const Text('Cancelar'),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        if (_marketingNameController.text.isNotEmpty) {
                          setState(() {
                            _marketingCampaigns.add({
                              'id': DateTime.now().millisecondsSinceEpoch.toString(),
                              'name': _marketingNameController.text,
                              'description': _marketingDescriptionController.text,
                              'budget': double.tryParse(_marketingBudgetController.text) ?? 0.0,
                              'type': _selectedMarketingType,
                              'status': _selectedMarketingStatus,
                              'startDate': _marketingStartDateController.text,
                              'endDate': _marketingEndDateController.text,
                              'createdAt': DateTime.now().toIso8601String(),
                            });
                            _marketingNameController.clear();
                            _marketingDescriptionController.clear();
                            _marketingBudgetController.clear();
                            _marketingStartDateController.clear();
                            _marketingEndDateController.clear();
                            _showAddMarketingModal = false;
                          });
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepPurple,
                      ),
                      child: const Text('Agregar'),
                    ),
                  ],
                ),
              ],
            ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildContacts() {
    final stats = _getContactsStats();
    
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    '👥 Contactos y Networking',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => setState(() => _showAddContactModal = true),
                    icon: const Icon(Icons.add, size: 18),
                    label: const Text('Agregar'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.deepPurple,
                      foregroundColor: AppTheme.white,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              _buildStatsRow([
                _buildStatCard('Total', stats['total'].toString(), Icons.contacts, Colors.deepPurple),
                _buildStatCard('Clientes', stats['clientes'].toString(), Icons.person, Colors.blue),
                _buildStatCard('Proveedores', stats['proveedores'].toString(), Icons.business, Colors.orange),
              ]),
              const SizedBox(height: 24),
              if (_contacts.isEmpty)
                _buildEmptyState(
                  'No hay contactos registrados',
                  Icons.contacts,
                  'Agrega contactos importantes para tu red de networking',
                )
              else
                ..._contacts.map((contact) => _buildDetailedContactCard(contact)),
            ],
          ),
        ),
        if (_showAddContactModal) _buildAddContactModal(),
      ],
    );
  }
  
  Map<String, int> _getContactsStats() {
    return {
      'total': _contacts.length,
      'clientes': _contacts.where((c) => c['type'] == 'cliente').length,
      'proveedores': _contacts.where((c) => c['type'] == 'proveedor').length,
    };
  }
  
  Widget _buildDetailedContactCard(Map<String, dynamic> contact) {
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
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.deepPurple.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.person,
                    color: Colors.deepPurple,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        contact['name'] ?? 'Contacto sin nombre',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      if (contact['company'] != null)
                        Text(
                          contact['company'],
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppTheme.white,
                          ),
                        ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: () {
                    setState(() {
                      _contacts.remove(contact);
                    });
                  },
                ),
              ],
            ),
            if (contact['email'] != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.email, size: 16, color: AppTheme.white),
                  const SizedBox(width: 4),
                  Text(
                    contact['email'],
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.white,
                    ),
                  ),
                ],
              ),
            ],
            if (contact['phone'] != null) ...[
              const SizedBox(height: 4),
              Row(
                children: [
                  Icon(Icons.phone, size: 16, color: AppTheme.white),
                  const SizedBox(width: 4),
                  Text(
                    contact['phone'],
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.white,
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
  
  Widget _buildAddContactModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.9,
            maxWidth: MediaQuery.of(context).size.width * 0.9,
          ),
          child: Container(
            margin: const EdgeInsets.all(24),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(20),
            ),
            child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Agregar Contacto',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () => setState(() => _showAddContactModal = false),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _contactNameController,
                  decoration: const InputDecoration(
                    labelText: 'Nombre',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _contactCompanyController,
                  decoration: const InputDecoration(
                    labelText: 'Empresa',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _contactEmailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _contactPhoneController,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    labelText: 'Teléfono',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedContactType,
                  decoration: const InputDecoration(
                    labelText: 'Tipo',
                    border: OutlineInputBorder(),
                  ),
                  items: ['cliente', 'proveedor', 'socio', 'inversor', 'otro']
                      .map((type) => DropdownMenuItem(
                            value: type,
                            child: Text(type.toUpperCase()),
                          ))
                      .toList(),
                  onChanged: (value) => setState(() => _selectedContactType = value!),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () => setState(() => _showAddContactModal = false),
                      child: const Text('Cancelar'),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        if (_contactNameController.text.isNotEmpty) {
                          setState(() {
                            _contacts.add({
                              'id': DateTime.now().millisecondsSinceEpoch.toString(),
                              'name': _contactNameController.text,
                              'company': _contactCompanyController.text,
                              'email': _contactEmailController.text,
                              'phone': _contactPhoneController.text,
                              'position': _contactPositionController.text,
                              'type': _selectedContactType,
                              'notes': _contactNotesController.text,
                              'createdAt': DateTime.now().toIso8601String(),
                            });
                            _contactNameController.clear();
                            _contactCompanyController.clear();
                            _contactEmailController.clear();
                            _contactPhoneController.clear();
                            _contactPositionController.clear();
                            _contactNotesController.clear();
                            _showAddContactModal = false;
                          });
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepPurple,
                      ),
                      child: const Text('Agregar'),
                    ),
                  ],
                ),
              ],
            ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMetrics() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '📊 Métricas y KPIs',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(height: 16),
          _buildStatsRow([
            _buildStatCard('Ventas', '\$0', Icons.trending_up, Colors.green),
            _buildStatCard('Clientes', '0', Icons.people, Colors.blue),
            _buildStatCard('Crecimiento', '0%', Icons.analytics, Colors.purple),
          ]),
          const SizedBox(height: 24),
          const Text(
            'Dashboard de métricas en desarrollo',
            style: TextStyle(
              fontSize: 16,
              color: AppTheme.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResources() {
    final stats = _getResourcesStats();
    
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    '📦 Recursos e Inventario',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => setState(() => _showAddResourceModal = true),
                    icon: const Icon(Icons.add, size: 18),
                    label: const Text('Agregar'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.deepPurple,
                      foregroundColor: AppTheme.white,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              _buildStatsRow([
                _buildStatCard('Total', stats['total'].toString(), Icons.inventory, Colors.deepPurple),
                _buildStatCard('Disponibles', stats['disponibles'].toString(), Icons.check_circle, Colors.green),
                _buildStatCard('Valor Total', '\$${stats['valorTotal']}', Icons.attach_money, Colors.amber),
              ]),
              const SizedBox(height: 24),
              if (_resources.isEmpty)
                _buildEmptyState(
                  'No hay recursos registrados',
                  Icons.inventory,
                  'Agrega recursos e inventario para tu negocio',
                )
              else
                ..._resources.map((resource) => _buildDetailedResourceCard(resource)),
            ],
          ),
        ),
        if (_showAddResourceModal) _buildAddResourceModal(),
      ],
    );
  }
  
  Map<String, dynamic> _getResourcesStats() {
    double valorTotal = _resources.fold(0.0, (sum, r) => sum + ((r['cost'] ?? 0.0) * (r['quantity'] ?? 0)));
    return {
      'total': _resources.length,
      'disponibles': _resources.where((r) => r['status'] == 'disponible').length,
      'valorTotal': valorTotal.toStringAsFixed(0),
    };
  }
  
  Widget _buildDetailedResourceCard(Map<String, dynamic> resource) {
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
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.deepPurple.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.inventory,
                color: Colors.deepPurple,
                size: 24,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    resource['name'] ?? 'Recurso sin nombre',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  Text(
                    'Cantidad: ${resource['quantity'] ?? 0}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.white,
                    ),
                  ),
                ],
              ),
            ),
            Text(
              '\$${(resource['cost'] ?? 0.0).toStringAsFixed(2)}',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppTheme.white,
              ),
            ),
            IconButton(
              icon: const Icon(Icons.delete, color: Colors.red),
              onPressed: () {
                setState(() {
                  _resources.remove(resource);
                });
              },
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildAddResourceModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.9,
            maxWidth: MediaQuery.of(context).size.width * 0.9,
          ),
          child: Container(
            margin: const EdgeInsets.all(24),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(20),
            ),
            child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Agregar Recurso',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () => setState(() => _showAddResourceModal = false),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _resourceNameController,
                  decoration: const InputDecoration(
                    labelText: 'Nombre',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _resourceCategoryController,
                  decoration: const InputDecoration(
                    labelText: 'Categoría',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _resourceQuantityController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Cantidad',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _resourceCostController,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(
                    labelText: 'Costo Unitario',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () => setState(() => _showAddResourceModal = false),
                      child: const Text('Cancelar'),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        if (_resourceNameController.text.isNotEmpty) {
                          setState(() {
                            _resources.add({
                              'id': DateTime.now().millisecondsSinceEpoch.toString(),
                              'name': _resourceNameController.text,
                              'category': _resourceCategoryController.text,
                              'quantity': int.tryParse(_resourceQuantityController.text) ?? 0,
                              'cost': double.tryParse(_resourceCostController.text) ?? 0.0,
                              'supplier': _resourceSupplierController.text,
                              'status': _selectedResourceStatus,
                              'createdAt': DateTime.now().toIso8601String(),
                            });
                            _resourceNameController.clear();
                            _resourceCategoryController.clear();
                            _resourceQuantityController.clear();
                            _resourceCostController.clear();
                            _resourceSupplierController.clear();
                            _showAddResourceModal = false;
                          });
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepPurple,
                      ),
                      child: const Text('Agregar'),
                    ),
                  ],
                ),
              ],
            ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPlanning() {
    final stats = _getPlanningStats();
    
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    '📅 Planificación',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => setState(() => _showAddPlanningModal = true),
                    icon: const Icon(Icons.add, size: 18),
                    label: const Text('Agregar'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.deepPurple,
                      foregroundColor: AppTheme.white,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              _buildStatsRow([
                _buildStatCard('Total', stats['total'].toString(), Icons.task, Colors.deepPurple),
                _buildStatCard('Completadas', stats['completadas'].toString(), Icons.check_circle, Colors.green),
                _buildStatCard('Pendientes', stats['pendientes'].toString(), Icons.pending, Colors.orange),
              ]),
              const SizedBox(height: 24),
              if (_planning.isEmpty)
                _buildEmptyState(
                  'No hay tareas de planificación',
                  Icons.calendar_today,
                  'Agrega tareas y actividades para planificar tu emprendimiento',
                )
              else
                ..._planning.map((task) => _buildDetailedPlanningCard(task)),
            ],
          ),
        ),
        if (_showAddPlanningModal) _buildAddPlanningModal(),
      ],
    );
  }
  
  Map<String, int> _getPlanningStats() {
    return {
      'total': _planning.length,
      'completadas': _planning.where((p) => p['status'] == 'completada').length,
      'pendientes': _planning.where((p) => p['status'] == 'pendiente').length,
    };
  }
  
  Widget _buildDetailedPlanningCard(Map<String, dynamic> task) {
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
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.deepPurple.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.task,
                    color: Colors.deepPurple,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        task['task'] ?? 'Tarea sin nombre',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          _buildPriorityChip(task['priority'] ?? 'media'),
                          const SizedBox(width: 8),
                          _buildStatusChip(task['status'] ?? 'pendiente'),
                        ],
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: () {
                    setState(() {
                      _planning.remove(task);
                    });
                  },
                ),
              ],
            ),
            if (task['description'] != null) ...[
              const SizedBox(height: 12),
              Text(
                task['description'],
                style: const TextStyle(
                  fontSize: 14,
                  color: AppTheme.white,
                ),
              ),
            ],
            if (task['deadline'] != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.calendar_today, size: 16, color: AppTheme.white),
                  const SizedBox(width: 4),
                  Text(
                    'Fecha límite: ${task['deadline']}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.white,
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }
  
  Widget _buildAddPlanningModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.9,
            maxWidth: MediaQuery.of(context).size.width * 0.9,
          ),
          child: Container(
            margin: const EdgeInsets.all(24),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(20),
            ),
            child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Agregar Tarea de Planificación',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () => setState(() => _showAddPlanningModal = false),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _planningTaskController,
                  decoration: const InputDecoration(
                    labelText: 'Tarea',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _planningDescriptionController,
                  maxLines: 3,
                  decoration: const InputDecoration(
                    labelText: 'Descripción',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _planningDeadlineController,
                  decoration: const InputDecoration(
                    labelText: 'Fecha Límite (YYYY-MM-DD)',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedPlanningPriority,
                  decoration: const InputDecoration(
                    labelText: 'Prioridad',
                    border: OutlineInputBorder(),
                  ),
                  items: ['alta', 'media', 'baja']
                      .map((priority) => DropdownMenuItem(
                            value: priority,
                            child: Text(priority.toUpperCase()),
                          ))
                      .toList(),
                  onChanged: (value) => setState(() => _selectedPlanningPriority = value!),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedPlanningStatus,
                  decoration: const InputDecoration(
                    labelText: 'Estado',
                    border: OutlineInputBorder(),
                  ),
                  items: ['pendiente', 'en_progreso', 'completada']
                      .map((status) => DropdownMenuItem(
                            value: status,
                            child: Text(status.replaceAll('_', ' ').toUpperCase()),
                          ))
                      .toList(),
                  onChanged: (value) => setState(() => _selectedPlanningStatus = value!),
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () => setState(() => _showAddPlanningModal = false),
                      child: const Text('Cancelar'),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        if (_planningTaskController.text.isNotEmpty) {
                          setState(() {
                            _planning.add({
                              'id': DateTime.now().millisecondsSinceEpoch.toString(),
                              'task': _planningTaskController.text,
                              'description': _planningDescriptionController.text,
                              'deadline': _planningDeadlineController.text,
                              'assignee': _planningAssigneeController.text,
                              'priority': _selectedPlanningPriority,
                              'status': _selectedPlanningStatus,
                              'createdAt': DateTime.now().toIso8601String(),
                            });
                            _planningTaskController.clear();
                            _planningDescriptionController.clear();
                            _planningDeadlineController.clear();
                            _planningAssigneeController.clear();
                            _showAddPlanningModal = false;
                          });
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.deepPurple,
                      ),
                      child: const Text('Agregar'),
                    ),
                  ],
                ),
              ],
            ),
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildEmptyState(String message, IconData icon, String subtitle) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.deepPurple.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                size: 64,
                color: Colors.deepPurple.withOpacity(0.6),
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
                color: AppTheme.white,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

