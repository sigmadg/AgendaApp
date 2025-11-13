import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../models/language/vocabulary.dart';
import '../../models/language/writing_practice.dart';
import '../../models/language/grammar_note.dart';
import '../../models/language/pronunciation_exercise.dart';
import '../../models/language/conversation.dart';
import '../../auth/providers/auth_provider.dart';
import '../../theme/app_theme.dart';

class LanguageSections extends StatefulWidget {
  const LanguageSections({super.key});

  @override
  State<LanguageSections> createState() => _LanguageSectionsState();
}

class _LanguageSectionsState extends State<LanguageSections> {
  String _activeSection = 'vocabulary';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  
  // Vocabulario
  Map<String, List<Vocabulary>> _vocabulariesByLanguage = {};
  String _selectedVocabularyLanguage = 'english';
  String _selectedVocabularyCategory = 'all';
  String _vocabularySearchQuery = '';
  bool _studyMode = false;
  bool _showAddVocabularyModal = false;
  
  // Escritura
  String _selectedWritingSystem = 'hiragana';
  Map<String, List<Map<String, dynamic>>> _practiceHistory = {};
  bool _showCanvas = false;
  Map<String, dynamic>? _selectedTemplate;
  
  // Gramática
  Map<String, List<GrammarNote>> _grammarNotesByLanguage = {};
  String _selectedGrammarLanguage = 'english';
  String _selectedGrammarCategory = 'all';
  String _grammarSearchQuery = '';
  bool _showAddGrammarModal = false;
  
  // Pronunciación
  Map<String, List<PronunciationExercise>> _pronunciationExercisesByLanguage = {};
  String _selectedPronunciationLanguage = 'english';
  String _selectedPronunciationCategory = 'all';
  String _pronunciationSearchQuery = '';
  bool _isRecording = false;
  int _recordingTime = 0;
  bool _showAddPronunciationModal = false;
  
  // Conversación
  Map<String, List<Conversation>> _conversationsByLanguage = {};
  String _selectedConversationLanguage = 'english';
  String _selectedConversationCategory = 'all';
  String _conversationSearchQuery = '';
  Conversation? _selectedConversation;
  bool _showAddConversationModal = false;
  
  // Controladores
  final TextEditingController _vocabularyWordController = TextEditingController();
  final TextEditingController _vocabularyPhoneticsController = TextEditingController();
  final TextEditingController _vocabularyMeaningController = TextEditingController();
  final TextEditingController _vocabularyExampleController = TextEditingController();
  
  final TextEditingController _grammarTitleController = TextEditingController();
  final TextEditingController _grammarCategoryController = TextEditingController();
  final TextEditingController _grammarContentController = TextEditingController();
  final TextEditingController _grammarExamplesController = TextEditingController();
  
  final TextEditingController _pronunciationWordController = TextEditingController();
  final TextEditingController _pronunciationPhoneticController = TextEditingController();
  final TextEditingController _pronunciationCategoryController = TextEditingController();
  
  final TextEditingController _conversationTitleController = TextEditingController();
  final TextEditingController _conversationCategoryController = TextEditingController();
  final TextEditingController _conversationDescriptionController = TextEditingController();
  
  String _selectedDifficulty = 'Básico';

  final sections = [
    {'id': 'vocabulary', 'name': 'Vocabulario', 'icon': Icons.book},
    {'id': 'writing', 'name': 'Escritura', 'icon': Icons.edit},
    {'id': 'grammar', 'name': 'Gramática', 'icon': Icons.text_fields},
    {'id': 'pronunciation', 'name': 'Pronunciación', 'icon': Icons.volume_up},
    {'id': 'conversation', 'name': 'Conversación', 'icon': Icons.chat_bubble_outline},
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
            isActive: true,
            onTap: () {
              Navigator.pop(context);
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
                        color: isActive ? AppTheme.white : AppTheme.white,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        section['name'] as String,
                        style: TextStyle(
                          color: isActive ? AppTheme.white : AppTheme.white,
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
      case 'vocabulary':
        return _buildVocabulary();
      case 'writing':
        return _buildWriting();
      case 'grammar':
        return _buildGrammar();
      case 'pronunciation':
        return _buildPronunciation();
      case 'conversation':
        return _buildConversation();
      default:
        return _buildVocabulary();
    }
  }

  Widget _buildVocabulary() {
    final languages = [
      {'id': 'english', 'name': 'Inglés', 'flag': '🇺🇸', 'color': const Color(0xFF2196F3)},
      {'id': 'spanish', 'name': 'Español', 'flag': '🇪🇸', 'color': const Color(0xFFE91E63)},
      {'id': 'french', 'name': 'Francés', 'flag': '🇫🇷', 'color': const Color(0xFF4CAF50)},
      {'id': 'german', 'name': 'Alemán', 'flag': '🇩🇪', 'color': const Color(0xFFFF9800)},
      {'id': 'japanese', 'name': 'Japonés', 'flag': '🇯🇵', 'color': const Color(0xFF9C27B0)},
      {'id': 'korean', 'name': 'Coreano', 'flag': '🇰🇷', 'color': const Color(0xFFF44336)},
      {'id': 'chinese', 'name': 'Chino', 'flag': '🇨🇳', 'color': const Color(0xFF795548)},
    ];
    
    final categories = {
      'english': ['Todas', 'Saludos', 'Adjetivos', 'Sustantivos', 'Verbos', 'Frases'],
      'spanish': ['Todas', 'Saludos', 'Adjetivos', 'Sustantivos', 'Verbos', 'Frases'],
      'french': ['Todas', 'Saludos', 'Adjetivos', 'Sustantivos', 'Verbos', 'Frases'],
      'japanese': ['Todas', 'Saludos', 'Adjetivos', 'Sustantivos', 'Verbos', 'Hiragana', 'Katakana'],
    };
    
    final currentVocab = _vocabulariesByLanguage[_selectedVocabularyLanguage] ?? [];
    final filteredVocab = _getFilteredVocabulary(currentVocab);
    final stats = _getVocabularyStats(currentVocab);
    
    return Stack(
      children: [
        SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header mejorado
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [const Color(0xFF06B6D4), const Color(0xFF06B6D4).withOpacity(0.8)],
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF06B6D4).withOpacity(0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 4),
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
                        borderRadius: BorderRadius.circular(24),
                      ),
                      child: const Icon(Icons.book, color: Colors.white, size: 24),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Estudio de Vocabulario',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Amplía tu vocabulario en múltiples idiomas',
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
                          '${filteredVocab.length}',
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
              
              // Selector de idiomas
              const Text(
                'Idioma de Estudio',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 140,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: languages.length,
                  itemBuilder: (context, index) {
                    final lang = languages[index];
                    final isSelected = _selectedVocabularyLanguage == lang['id'];
                    final langStats = _getLanguageVocabularyStats(lang['id'] as String);
                    return GestureDetector(
                      onTap: () => setState(() => _selectedVocabularyLanguage = lang['id'] as String),
                      child: Container(
                        width: 120,
                        margin: const EdgeInsets.only(right: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isSelected ? (lang['color'] as Color) : AppTheme.darkSurfaceVariant,
                            width: isSelected ? 3 : 1,
                          ),
                          boxShadow: isSelected ? [
                            BoxShadow(
                              color: (lang['color'] as Color).withOpacity(0.3),
                              blurRadius: 8,
                              offset: const Offset(0, 4),
                            ),
                          ] : null,
                        ),
                        child: Column(
                          children: [
                            Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: lang['color'] as Color,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Center(
                                child: Text(
                                  lang['flag'] as String,
                                  style: const TextStyle(fontSize: 20),
                                ),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              lang['name'] as String,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.white,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 8),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(2),
                              child: LinearProgressIndicator(
                                value: langStats['percentage'] / 100,
                                backgroundColor: AppTheme.darkSurfaceVariant,
                                valueColor: AlwaysStoppedAnimation<Color>(lang['color'] as Color),
                                minHeight: 4,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${langStats['mastered']}/${langStats['total']}',
                              style: TextStyle(
                                fontSize: 10,
                                color: AppTheme.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Barra de búsqueda y filtros
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Icon(Icons.search, color: AppTheme.white, size: 20),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: TextEditingController(text: _vocabularySearchQuery),
                            onChanged: (value) => setState(() => _vocabularySearchQuery = value),
                            style: const TextStyle(color: AppTheme.white),
                            decoration: InputDecoration(
                              hintText: 'Buscar palabras...',
                              hintStyle: TextStyle(color: AppTheme.white),
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                        if (_vocabularySearchQuery.isNotEmpty)
                          IconButton(
                            icon: const Icon(Icons.close, color: AppTheme.white, size: 20),
                            onPressed: () => setState(() => _vocabularySearchQuery = ''),
                          ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 40,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: (categories[_selectedVocabularyLanguage] ?? ['Todas']).length,
                        itemBuilder: (context, index) {
                          final category = (categories[_selectedVocabularyLanguage] ?? ['Todas'])[index];
                          final isSelected = _selectedVocabularyCategory == (category == 'Todas' ? 'all' : category);
                          return Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: FilterChip(
                              selected: isSelected,
                              label: Text(category),
                              onSelected: (selected) {
                                setState(() {
                                  _selectedVocabularyCategory = category == 'Todas' ? 'all' : category;
                                });
                              },
                              selectedColor: const Color(0xFF06B6D4),
                              labelStyle: TextStyle(
                                color: isSelected ? Colors.white : AppTheme.white,
                                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                              ),
                              backgroundColor: AppTheme.darkSurfaceVariant,
                            ),
                          );
                        },
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
                    child: _buildVocabularyStatCard(
                      Icons.emoji_events,
                      '${stats['percentage']}%',
                      'Dominado',
                      Colors.green,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildVocabularyStatCard(
                      Icons.analytics,
                      '${stats['totalStudy']}',
                      'Estudios',
                      const Color(0xFF2196F3),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildVocabularyStatCard(
                      Icons.access_time,
                      '${stats['pending']}',
                      'Pendientes',
                      Colors.orange,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildVocabularyStatCard(
                      Icons.book,
                      '${stats['total']}',
                      'Total',
                      const Color(0xFF9C27B0),
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 20),
              
              // Botones de acción
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () => setState(() => _showAddVocabularyModal = true),
                      icon: const Icon(Icons.add_circle_outline, size: 20),
                      label: const Text('Agregar Palabra'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF06B6D4),
                        foregroundColor: Colors.white,
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
                      onPressed: () => setState(() => _studyMode = !_studyMode),
                      icon: Icon(_studyMode ? Icons.pause : Icons.play_arrow, size: 20),
                      label: Text(_studyMode ? 'Pausar' : 'Modo Estudio'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF9C27B0),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 20),
              
              // Lista de vocabulario
              if (filteredVocab.isEmpty)
                _buildVocabularyEmptyState()
              else
                ...filteredVocab.map((vocab) => _buildVocabularyCard(vocab)),
            ],
          ),
        ),
        if (_showAddVocabularyModal) _buildAddVocabularyModal(),
      ],
    );
  }
  
  List<Vocabulary> _getFilteredVocabulary(List<Vocabulary> vocab) {
    var filtered = vocab;
    
    if (_selectedVocabularyCategory != 'all') {
      filtered = filtered.where((v) => v.category == _selectedVocabularyCategory).toList();
    }
    
    if (_vocabularySearchQuery.isNotEmpty) {
      final query = _vocabularySearchQuery.toLowerCase();
      filtered = filtered.where((v) =>
        v.word.toLowerCase().contains(query) ||
        v.meaning.toLowerCase().contains(query) ||
        v.translation.toLowerCase().contains(query)
      ).toList();
    }
    
    return filtered;
  }
  
  Map<String, dynamic> _getVocabularyStats(List<Vocabulary> vocab) {
    final mastered = vocab.where((v) => v.mastered).length;
    final total = vocab.length;
    final percentage = total > 0 ? ((mastered / total) * 100).round() : 0;
    final totalStudy = vocab.fold<int>(0, (sum, v) => sum + v.studyCount);
    final pending = total - mastered;
    
    return {
      'total': total,
      'mastered': mastered,
      'percentage': percentage,
      'totalStudy': totalStudy,
      'pending': pending,
    };
  }
  
  Map<String, dynamic> _getLanguageVocabularyStats(String languageId) {
    final vocab = _vocabulariesByLanguage[languageId] ?? [];
    return _getVocabularyStats(vocab);
  }
  
  Widget _buildVocabularyStatCard(IconData icon, String value, String label, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
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
            style: TextStyle(
              fontSize: 12,
              color: AppTheme.white,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildVocabularyEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        children: [
          Icon(Icons.book, size: 64, color: AppTheme.white),
          const SizedBox(height: 16),
          Text(
            _vocabularySearchQuery.isNotEmpty
                ? 'No se encontraron resultados'
                : 'No hay vocabulario registrado',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            _vocabularySearchQuery.isNotEmpty
                ? 'Intenta con otros términos de búsqueda'
                : 'Agrega tu primera palabra para comenzar a estudiar',
            style: const TextStyle(
              fontSize: 14,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildWriting() {
    final writingSystems = [
      {'id': 'hiragana', 'name': 'Hiragana', 'emoji': '🌸', 'color': const Color(0xFFE91E63), 'description': 'Sistema de escritura japonesa'},
      {'id': 'katakana', 'name': 'Katakana', 'emoji': '⚡', 'color': const Color(0xFF9C27B0), 'description': 'Sistema de escritura japonesa'},
      {'id': 'hangul', 'name': 'Hangul', 'emoji': '🇰🇷', 'color': const Color(0xFF2196F3), 'description': 'Sistema de escritura coreana'},
      {'id': 'pinyin', 'name': 'Pinyin', 'emoji': '🇨🇳', 'color': const Color(0xFFF44336), 'description': 'Sistema de escritura china'},
    ];
    
    final practiceTemplates = {
      'hiragana': [
        {'id': 1, 'name': 'Vocales Básicas', 'characters': ['あ', 'い', 'う', 'え', 'お'], 'difficulty': 'Fácil'},
        {'id': 2, 'name': 'Consonantes K', 'characters': ['か', 'き', 'く', 'け', 'こ'], 'difficulty': 'Fácil'},
        {'id': 3, 'name': 'Consonantes S', 'characters': ['さ', 'し', 'す', 'せ', 'そ'], 'difficulty': 'Medio'},
      ],
      'katakana': [
        {'id': 1, 'name': 'Vocales Básicas', 'characters': ['ア', 'イ', 'ウ', 'エ', 'オ'], 'difficulty': 'Fácil'},
        {'id': 2, 'name': 'Consonantes K', 'characters': ['カ', 'キ', 'ク', 'ケ', 'コ'], 'difficulty': 'Fácil'},
      ],
      'hangul': [
        {'id': 1, 'name': 'Consonantes Básicas', 'characters': ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'], 'difficulty': 'Fácil'},
      ],
      'pinyin': [
        {'id': 1, 'name': 'Tono 1', 'characters': ['ā', 'ē', 'ī', 'ō', 'ū'], 'difficulty': 'Fácil'},
      ],
    };
    
    final currentTemplates = practiceTemplates[_selectedWritingSystem] ?? [];
    final systemStats = _getWritingSystemStats(_selectedWritingSystem);
    
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
                colors: [const Color(0xFF06B6D4), const Color(0xFF06B6D4).withOpacity(0.8)],
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
                  child: const Icon(Icons.create, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Práctica de Escritura',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Practica diferentes sistemas de escritura',
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
                      '${writingSystems.length}',
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
          
          // Selector de sistemas
          const Text(
            'Sistemas de Escritura',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 160,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: writingSystems.length,
              itemBuilder: (context, index) {
                final system = writingSystems[index];
                final isSelected = _selectedWritingSystem == system['id'];
                return GestureDetector(
                  onTap: () => setState(() => _selectedWritingSystem = system['id'] as String),
                  child: Container(
                    width: 160,
                    margin: const EdgeInsets.only(right: 16),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppTheme.darkSurface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected ? (system['color'] as Color) : AppTheme.darkSurfaceVariant,
                        width: isSelected ? 3 : 1,
                      ),
                    ),
                    child: Column(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: system['color'] as Color,
                            borderRadius: BorderRadius.circular(24),
                          ),
                          child: Center(
                            child: Text(
                              system['emoji'] as String,
                              style: const TextStyle(fontSize: 24),
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          system['name'] as String,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          system['description'] as String,
                          style: TextStyle(
                            fontSize: 12,
                            color: AppTheme.white,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 12),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(2),
                          child: LinearProgressIndicator(
                            value: systemStats['percentage'] / 100,
                            backgroundColor: AppTheme.darkSurfaceVariant,
                            valueColor: AlwaysStoppedAnimation<Color>(system['color'] as Color),
                            minHeight: 4,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${systemStats['completed']}/${systemStats['total']}',
                          style: TextStyle(
                            fontSize: 10,
                            color: AppTheme.white,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          
          const SizedBox(height: 20),
          
          // Canvas de escritura (si hay una plantilla seleccionada)
          if (_showCanvas && _selectedTemplate != null)
            _buildWritingCanvas(),
          
          if (_showCanvas && _selectedTemplate != null)
            const SizedBox(height: 20),
          
          // Plantillas de práctica
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Plantillas de ${writingSystems.firstWhere((s) => s['id'] == _selectedWritingSystem)['name']}',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Selecciona una plantilla para comenzar a practicar',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(height: 16),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: currentTemplates.map((template) {
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedTemplate = template;
                          _showCanvas = true;
                        });
                      },
                      child: Container(
                        width: (MediaQuery.of(context).size.width - 64) / 2 - 6,
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurfaceVariant,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppTheme.darkSurfaceVariant),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Text(
                                    template['name'] as String,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: AppTheme.white,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: _getDifficultyColor(template['difficulty'] as String),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    template['difficulty'] as String,
                                    style: const TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Wrap(
                              spacing: 8,
                              children: (template['characters'] as List).map((char) {
                                return Text(
                                  char,
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.white,
                                  ),
                                );
                              }).toList(),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.play_circle, color: const Color(0xFF06B6D4), size: 20),
                                const SizedBox(width: 6),
                                Text(
                                  'Practicar',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: const Color(0xFF06B6D4),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
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
          
          const SizedBox(height: 20),
          
          // Estadísticas
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.darkSurface,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Estadísticas de Práctica',
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
                      child: _buildWritingStatCard(
                        Icons.emoji_events,
                        '${_practiceHistory.values.expand((e) => e).where((p) => p['completed'] == true).length}',
                        'Completadas',
                        Colors.green,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildWritingStatCard(
                        Icons.analytics,
                        _practiceHistory.values.expand((e) => e).isEmpty
                            ? '0%'
                            : '${((_practiceHistory.values.expand((e) => e).fold<int>(0, (sum, p) => sum + (p['accuracy'] as int? ?? 0)) / _practiceHistory.values.expand((e) => e).length).round())}%',
                        'Precisión',
                        const Color(0xFF2196F3),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildWritingStatCard(
                        Icons.access_time,
                        '${_practiceHistory.values.expand((e) => e).length}',
                        'Sesiones',
                        Colors.orange,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          
          // Historial de práctica reciente
          if (_practiceHistory.values.expand((e) => e).isNotEmpty) ...[
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Práctica Reciente',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    height: 140,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _practiceHistory.values.expand((e) => e).toList().length > 5
                          ? 5
                          : _practiceHistory.values.expand((e) => e).toList().length,
                      itemBuilder: (context, index) {
                        final allSessions = _practiceHistory.values.expand((e) => e).toList();
                        final sessions = allSessions.length > 5
                            ? allSessions.reversed.take(5).toList()
                            : allSessions.reversed.toList();
                        final session = sessions[index];
                        final systemId = session['system'] as String;
                        final system = writingSystems.firstWhere(
                          (s) => s['id'] == systemId,
                          orElse: () => writingSystems.first,
                        );
                        final completed = session['completed'] == true;
                        
                        return Container(
                          width: 200,
                          margin: const EdgeInsets.only(right: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppTheme.darkSurfaceVariant,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: completed ? Colors.green : Colors.orange,
                              width: 1,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Text(
                                      system['name'] as String,
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
                                      color: completed ? Colors.green : Colors.orange,
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      completed ? 'Completado' : 'En progreso',
                                      style: const TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              Text(
                                session['template'] as String,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: AppTheme.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Precisión: ${session['accuracy']}%',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                DateFormat('dd MMM yyyy', 'es').format(
                                  DateTime.parse(session['date'] as String),
                                ),
                                style: TextStyle(
                                  fontSize: 10,
                                  color: AppTheme.white,
                                ),
                              ),
                            ],
                          ),
                        );
                      },
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
  
  Widget _buildWritingCanvas() {
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Practica: ${_selectedTemplate!['name']}',
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.refresh, color: AppTheme.white),
                    onPressed: () {
                      // Limpiar canvas (implementar si es necesario)
                    },
                    tooltip: 'Limpiar',
                  ),
                  IconButton(
                    icon: const Icon(Icons.check_circle, color: Colors.green),
                    onPressed: () {
                      // Simular verificación de precisión
                      final accuracy = (60 + (40 * (0.5 + 0.5 * (DateTime.now().millisecond % 100) / 100))).round();
                      final session = {
                        'id': DateTime.now().millisecondsSinceEpoch.toString(),
                        'system': _selectedWritingSystem,
                        'template': _selectedTemplate!['name'],
                        'accuracy': accuracy,
                        'completed': accuracy >= 70,
                        'date': DateTime.now().toIso8601String(),
                      };
                      
                      setState(() {
                        if (!_practiceHistory.containsKey(_selectedWritingSystem)) {
                          _practiceHistory[_selectedWritingSystem] = [];
                        }
                        _practiceHistory[_selectedWritingSystem]!.add(session);
                        _showCanvas = false;
                        _selectedTemplate = null;
                      });
                    },
                    tooltip: 'Completar',
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkSurfaceVariant,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppTheme.darkSurfaceVariant),
            ),
            child: Column(
              children: [
                Text(
                  (_selectedTemplate!['characters'] as List).join(' '),
                  style: const TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.white,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  'Guía de caracteres',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppTheme.white,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Container(
            height: 300,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppTheme.darkSurfaceVariant, width: 2),
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.edit,
                    size: 64,
                    color: AppTheme.white,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Área de Práctica',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Dibuja los caracteres aquí',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Nota: Para una implementación completa, se requiere un widget de dibujo personalizado',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppTheme.white,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Map<String, dynamic> _getWritingSystemStats(String systemId) {
    final completed = _practiceHistory.values
        .expand((e) => e)
        .where((p) => p['system'] == systemId && p['completed'] == true)
        .length;
    final total = 5; // Número de plantillas por sistema
    return {
      'completed': completed,
      'total': total,
      'percentage': total > 0 ? ((completed / total) * 100).round() : 0,
    };
  }
  
  Widget _buildWritingStatCard(IconData icon, String value, String label, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurfaceVariant,
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

  Widget _buildGrammar() {
    final languages = [
      {'id': 'english', 'name': 'Inglés', 'flag': '🇺🇸', 'color': const Color(0xFF2196F3)},
      {'id': 'spanish', 'name': 'Español', 'flag': '🇪🇸', 'color': const Color(0xFFE91E63)},
      {'id': 'french', 'name': 'Francés', 'flag': '🇫🇷', 'color': const Color(0xFF4CAF50)},
      {'id': 'german', 'name': 'Alemán', 'flag': '🇩🇪', 'color': const Color(0xFFFF9800)},
      {'id': 'japanese', 'name': 'Japonés', 'flag': '🇯🇵', 'color': const Color(0xFF9C27B0)},
    ];
    
    final categories = {
      'english': ['Todas', 'Tiempos Verbales', 'Sustantivos', 'Adjetivos', 'Pronombres', 'Preposiciones'],
      'spanish': ['Todas', 'Tiempos Verbales', 'Sustantivos', 'Adjetivos', 'Pronombres', 'Subjuntivo'],
    };
    
    final currentNotes = _grammarNotesByLanguage[_selectedGrammarLanguage] ?? [];
    final filteredNotes = _getFilteredGrammarNotes(currentNotes);
    final stats = _getGrammarStats(currentNotes);
    
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
                    colors: [const Color(0xFF8B5CF6), const Color(0xFF8B5CF6).withOpacity(0.8)],
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
                      child: const Icon(Icons.text_fields, color: Colors.white, size: 24),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Notas de Gramática',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Domina las reglas gramaticales',
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
                          '${filteredNotes.length}',
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
              
              // Selector de idiomas
              const Text(
                'Idioma de Estudio',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 140,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: languages.length,
                  itemBuilder: (context, index) {
                    final lang = languages[index];
                    final isSelected = _selectedGrammarLanguage == lang['id'];
                    final langStats = _getLanguageGrammarStats(lang['id'] as String);
                    return GestureDetector(
                      onTap: () => setState(() => _selectedGrammarLanguage = lang['id'] as String),
                      child: Container(
                        width: 120,
                        margin: const EdgeInsets.only(right: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isSelected ? (lang['color'] as Color) : AppTheme.darkSurfaceVariant,
                            width: isSelected ? 3 : 1,
                          ),
                        ),
                        child: Column(
                          children: [
                            Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: lang['color'] as Color,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Center(
                                child: Text(
                                  lang['flag'] as String,
                                  style: const TextStyle(fontSize: 20),
                                ),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              lang['name'] as String,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.white,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 8),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(2),
                              child: LinearProgressIndicator(
                                value: langStats['percentage'] / 100,
                                backgroundColor: AppTheme.darkSurfaceVariant,
                                valueColor: AlwaysStoppedAnimation<Color>(lang['color'] as Color),
                                minHeight: 4,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${langStats['mastered']}/${langStats['total']}',
                              style: TextStyle(
                                fontSize: 10,
                                color: AppTheme.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Búsqueda y filtros
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Icon(Icons.search, color: AppTheme.white, size: 20),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: TextEditingController(text: _grammarSearchQuery),
                            onChanged: (value) => setState(() => _grammarSearchQuery = value),
                            style: const TextStyle(color: AppTheme.white),
                            decoration: InputDecoration(
                              hintText: 'Buscar notas de gramática...',
                              hintStyle: TextStyle(color: AppTheme.white),
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                        if (_grammarSearchQuery.isNotEmpty)
                          IconButton(
                            icon: const Icon(Icons.close, color: AppTheme.white, size: 20),
                            onPressed: () => setState(() => _grammarSearchQuery = ''),
                          ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 40,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: (categories[_selectedGrammarLanguage] ?? ['Todas']).length,
                        itemBuilder: (context, index) {
                          final category = (categories[_selectedGrammarLanguage] ?? ['Todas'])[index];
                          final isSelected = _selectedGrammarCategory == (category == 'Todas' ? 'all' : category);
                          return Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: FilterChip(
                              selected: isSelected,
                              label: Text(category),
                              onSelected: (selected) {
                                setState(() {
                                  _selectedGrammarCategory = category == 'Todas' ? 'all' : category;
                                });
                              },
                              selectedColor: const Color(0xFF8B5CF6),
                              labelStyle: TextStyle(
                                color: isSelected ? Colors.white : AppTheme.white,
                                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                              ),
                              backgroundColor: AppTheme.darkSurfaceVariant,
                            ),
                          );
                        },
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
                    child: _buildGrammarStatCard(
                      Icons.emoji_events,
                      '${stats['mastered']}',
                      'Dominadas',
                      Colors.green,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildGrammarStatCard(
                      Icons.book,
                      '${stats['total']}',
                      'Total',
                      const Color(0xFF2196F3),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildGrammarStatCard(
                      Icons.trending_up,
                      '${stats['percentage']}%',
                      'Progreso',
                      Colors.orange,
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 20),
              
              // Botón agregar
              ElevatedButton.icon(
                onPressed: () => setState(() => _showAddGrammarModal = true),
                icon: const Icon(Icons.add, size: 20),
                label: const Text('Nueva Nota'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF8B5CF6),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Lista de notas
              if (filteredNotes.isEmpty)
                _buildGrammarEmptyState()
              else
                ...filteredNotes.map((note) => _buildGrammarCard(note)),
            ],
          ),
        ),
        if (_showAddGrammarModal) _buildAddGrammarModal(),
      ],
    );
  }
  
  List<GrammarNote> _getFilteredGrammarNotes(List<GrammarNote> notes) {
    var filtered = notes;
    
    if (_selectedGrammarCategory != 'all') {
      filtered = filtered.where((n) => n.category == _selectedGrammarCategory).toList();
    }
    
    if (_grammarSearchQuery.isNotEmpty) {
      final query = _grammarSearchQuery.toLowerCase();
      filtered = filtered.where((n) =>
        n.title.toLowerCase().contains(query) ||
        n.content.toLowerCase().contains(query) ||
        n.tags.any((tag) => tag.toLowerCase().contains(query))
      ).toList();
    }
    
    return filtered;
  }
  
  Map<String, dynamic> _getGrammarStats(List<GrammarNote> notes) {
    final mastered = notes.where((n) => n.mastered).length;
    final total = notes.length;
    final percentage = total > 0 ? ((mastered / total) * 100).round() : 0;
    return {
      'total': total,
      'mastered': mastered,
      'percentage': percentage,
    };
  }
  
  Map<String, dynamic> _getLanguageGrammarStats(String languageId) {
    final notes = _grammarNotesByLanguage[languageId] ?? [];
    return _getGrammarStats(notes);
  }
  
  Widget _buildGrammarStatCard(IconData icon, String value, String label, Color color) {
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
  
  Widget _buildGrammarEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        children: [
          Icon(Icons.text_fields_outlined, size: 64, color: AppTheme.white),
          const SizedBox(height: 16),
          Text(
            _grammarSearchQuery.isNotEmpty
                ? 'No se encontraron resultados'
                : 'No hay notas de gramática',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildPronunciation() {
    final languages = [
      {'id': 'english', 'name': 'Inglés', 'flag': '🇺🇸', 'color': const Color(0xFF2196F3)},
      {'id': 'spanish', 'name': 'Español', 'flag': '🇪🇸', 'color': const Color(0xFFE91E63)},
      {'id': 'french', 'name': 'Francés', 'flag': '🇫🇷', 'color': const Color(0xFF4CAF50)},
    ];
    
    final categories = {
      'english': ['Todas', 'Vocales', 'Consonantes', 'Diptongos', 'Silabas Tónicas'],
      'spanish': ['Todas', 'Vocales', 'Consonantes', 'RR', 'LL', 'Ñ'],
    };
    
    final currentExercises = _pronunciationExercisesByLanguage[_selectedPronunciationLanguage] ?? [];
    final filteredExercises = _getFilteredPronunciationExercises(currentExercises);
    final stats = _getPronunciationStats(currentExercises);
    
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
                    colors: [const Color(0xFFF59E0B), const Color(0xFFF59E0B).withOpacity(0.8)],
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
                      child: const Icon(Icons.mic, color: Colors.white, size: 24),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Pronunciación',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Mejora tu pronunciación paso a paso',
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
                          '${filteredExercises.length}',
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
              
              // Selector de idiomas
              const Text(
                'Idioma de Estudio',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 140,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: languages.length,
                  itemBuilder: (context, index) {
                    final lang = languages[index];
                    final isSelected = _selectedPronunciationLanguage == lang['id'];
                    final langStats = _getLanguagePronunciationStats(lang['id'] as String);
                    return GestureDetector(
                      onTap: () => setState(() => _selectedPronunciationLanguage = lang['id'] as String),
                      child: Container(
                        width: 120,
                        margin: const EdgeInsets.only(right: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isSelected ? (lang['color'] as Color) : AppTheme.darkSurfaceVariant,
                            width: isSelected ? 3 : 1,
                          ),
                        ),
                        child: Column(
                          children: [
                            Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: lang['color'] as Color,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Center(
                                child: Text(
                                  lang['flag'] as String,
                                  style: const TextStyle(fontSize: 20),
                                ),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              lang['name'] as String,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.white,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 8),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(2),
                              child: LinearProgressIndicator(
                                value: langStats['percentage'] / 100,
                                backgroundColor: AppTheme.darkSurfaceVariant,
                                valueColor: AlwaysStoppedAnimation<Color>(lang['color'] as Color),
                                minHeight: 4,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${langStats['mastered']}/${langStats['total']}',
                              style: TextStyle(
                                fontSize: 10,
                                color: AppTheme.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Búsqueda y filtros
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Icon(Icons.search, color: AppTheme.white, size: 20),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: TextEditingController(text: _pronunciationSearchQuery),
                            onChanged: (value) => setState(() => _pronunciationSearchQuery = value),
                            style: const TextStyle(color: AppTheme.white),
                            decoration: InputDecoration(
                              hintText: 'Buscar ejercicios de pronunciación...',
                              hintStyle: TextStyle(color: AppTheme.white),
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                        if (_pronunciationSearchQuery.isNotEmpty)
                          IconButton(
                            icon: const Icon(Icons.close, color: AppTheme.white, size: 20),
                            onPressed: () => setState(() => _pronunciationSearchQuery = ''),
                          ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 40,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: (categories[_selectedPronunciationLanguage] ?? ['Todas']).length,
                        itemBuilder: (context, index) {
                          final category = (categories[_selectedPronunciationLanguage] ?? ['Todas'])[index];
                          final isSelected = _selectedPronunciationCategory == (category == 'Todas' ? 'all' : category);
                          return Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: FilterChip(
                              selected: isSelected,
                              label: Text(category),
                              onSelected: (selected) {
                                setState(() {
                                  _selectedPronunciationCategory = category == 'Todas' ? 'all' : category;
                                });
                              },
                              selectedColor: const Color(0xFFF59E0B),
                              labelStyle: TextStyle(
                                color: isSelected ? Colors.white : AppTheme.white,
                                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                              ),
                              backgroundColor: AppTheme.darkSurfaceVariant,
                            ),
                          );
                        },
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
                    child: _buildPronunciationStatCard(
                      Icons.emoji_events,
                      '${stats['mastered']}',
                      'Dominadas',
                      Colors.green,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildPronunciationStatCard(
                      Icons.mic,
                      '${stats['total']}',
                      'Ejercicios',
                      const Color(0xFF2196F3),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildPronunciationStatCard(
                      Icons.play_circle,
                      '${stats['totalPractice']}',
                      'Prácticas',
                      Colors.orange,
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 20),
              
              // Grabadora de voz
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    const Text(
                      'Grabadora de Voz',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Practica tu pronunciación grabándote',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        GestureDetector(
                          onTap: () {
                            setState(() {
                              _isRecording = !_isRecording;
                              if (_isRecording) {
                                _recordingTime = 0;
                              }
                            });
                          },
                          child: Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              color: _isRecording ? Colors.red : const Color(0xFFF59E0B),
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: (_isRecording ? Colors.red : const Color(0xFFF59E0B)).withOpacity(0.3),
                                  blurRadius: 8,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Icon(
                              _isRecording ? Icons.stop : Icons.mic,
                              color: Colors.white,
                              size: 32,
                            ),
                          ),
                        ),
                        const SizedBox(width: 20),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _isRecording ? 'Grabando...' : 'Toca para grabar',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: AppTheme.white,
                                ),
                              ),
                              if (_isRecording) ...[
                                const SizedBox(height: 4),
                                Text(
                                  '${(_recordingTime ~/ 60).toString().padLeft(2, '0')}:${(_recordingTime % 60).toString().padLeft(2, '0')}',
                                  style: TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: const Color(0xFFF59E0B),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Botón agregar
              ElevatedButton.icon(
                onPressed: () => setState(() => _showAddPronunciationModal = true),
                icon: const Icon(Icons.add, size: 20),
                label: const Text('Nuevo Ejercicio'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF59E0B),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Lista de ejercicios
              if (filteredExercises.isEmpty)
                _buildPronunciationEmptyState()
              else
                ...filteredExercises.map((exercise) => _buildPronunciationExerciseCard(exercise)),
            ],
          ),
        ),
        if (_showAddPronunciationModal) _buildAddPronunciationModal(),
      ],
    );
  }
  
  List<PronunciationExercise> _getFilteredPronunciationExercises(List<PronunciationExercise> exercises) {
    var filtered = exercises;
    
    if (_selectedPronunciationCategory != 'all') {
      filtered = filtered.where((e) => e.category == _selectedPronunciationCategory).toList();
    }
    
    if (_pronunciationSearchQuery.isNotEmpty) {
      final query = _pronunciationSearchQuery.toLowerCase();
      filtered = filtered.where((e) =>
        e.word.toLowerCase().contains(query) ||
        e.phonetic.toLowerCase().contains(query) ||
        e.description.toLowerCase().contains(query)
      ).toList();
    }
    
    return filtered;
  }
  
  Map<String, dynamic> _getPronunciationStats(List<PronunciationExercise> exercises) {
    final mastered = exercises.where((e) => e.mastered).length;
    final total = exercises.length;
    final totalPractice = exercises.fold<int>(0, (sum, e) => sum + e.practiceCount);
    final percentage = total > 0 ? ((mastered / total) * 100).round() : 0;
    return {
      'total': total,
      'mastered': mastered,
      'totalPractice': totalPractice,
      'percentage': percentage,
    };
  }
  
  Map<String, dynamic> _getLanguagePronunciationStats(String languageId) {
    final exercises = _pronunciationExercisesByLanguage[languageId] ?? [];
    return _getPronunciationStats(exercises);
  }
  
  Widget _buildPronunciationStatCard(IconData icon, String value, String label, Color color) {
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
  
  Widget _buildPronunciationEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        children: [
          Icon(Icons.mic_outlined, size: 64, color: AppTheme.white),
          const SizedBox(height: 16),
          Text(
            _pronunciationSearchQuery.isNotEmpty
                ? 'No se encontraron resultados'
                : 'No hay ejercicios de pronunciación',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
  
  Widget _buildPronunciationExerciseCard(PronunciationExercise exercise) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border(
          left: BorderSide(
            color: exercise.mastered ? Colors.green : const Color(0xFFF59E0B),
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
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(
                  _getPronunciationCategoryIcon(exercise.category),
                  color: const Color(0xFFF59E0B),
                  size: 20,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        exercise.word,
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        exercise.phonetic,
                        style: TextStyle(
                          fontSize: 16,
                          color: AppTheme.white,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ],
                  ),
                ),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: _getDifficultyColor(exercise.difficulty),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        exercise.difficulty,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: _getLevelColor(exercise.level),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        exercise.level,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
            
            if (exercise.description.isNotEmpty) ...[
              const SizedBox(height: 12),
              Text(
                exercise.description,
                style: const TextStyle(
                  fontSize: 16,
                  color: AppTheme.white,
                  height: 1.5,
                ),
              ),
            ],
            
            if (exercise.tips.isNotEmpty) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF59E0B).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.lightbulb, color: Color(0xFFF59E0B), size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Consejo:',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: const Color(0xFFF59E0B),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            exercise.tips,
                            style: TextStyle(
                              fontSize: 14,
                              color: const Color(0xFFF59E0B),
                              height: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
            
            const SizedBox(height: 12),
            
            // Controles
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.play_arrow, size: 18),
                    label: const Text('Escuchar'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
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
                    icon: const Icon(Icons.mic, size: 18),
                    label: const Text('Practicar'),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFF2196F3), width: 2),
                      foregroundColor: const Color(0xFF2196F3),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 12),
            
            // Progreso
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      exercise.mastered ? 'Dominada' : 'En práctica',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Text(
                      '${exercise.practiceCount} intentos',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                ClipRRect(
                  borderRadius: BorderRadius.circular(3),
                  child: LinearProgressIndicator(
                    value: exercise.mastered ? 1.0 : (exercise.practiceCount / 15).clamp(0.0, 0.9),
                    backgroundColor: AppTheme.darkSurfaceVariant,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      exercise.mastered ? Colors.green : const Color(0xFFF59E0B),
                    ),
                    minHeight: 6,
                  ),
                ),
                if (exercise.lastPracticed != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    'Última práctica: ${DateFormat('dd/MM/yyyy').format(exercise.lastPracticed!)}',
                    style: TextStyle(
                      fontSize: 10,
                      color: AppTheme.white,
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
  
  IconData _getPronunciationCategoryIcon(String category) {
    switch (category) {
      case 'Vocales':
        return Icons.radio;
      case 'Consonantes':
        return Icons.volume_up;
      case 'Silabas Tónicas':
        return Icons.graphic_eq;
      case 'Acentos':
        return Icons.trending_up;
      case 'RR':
      case 'LL':
        return Icons.refresh;
      case 'Ñ':
        return Icons.more_horiz;
      case 'Tonos':
        return Icons.music_note;
      default:
        return Icons.mic;
    }
  }
  
  Widget _buildAddPronunciationModal() {
    return Container(
      color: Colors.black87,
      child: SafeArea(
        child: Container(
          margin: const EdgeInsets.all(16),
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.9,
            maxWidth: 500,
          ),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                const Color(0xFFF59E0B),
                const Color(0xFFF59E0B).withOpacity(0.8),
              ],
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: const Color(0xFFF59E0B).withOpacity(0.3), width: 2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.5),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.white.withOpacity(0.2),
                        Colors.white.withOpacity(0.1),
                      ],
                    ),
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
                        child: const Icon(Icons.add_circle_outline, color: Colors.white, size: 24),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Nuevo Ejercicio de Pronunciación',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Mejora tu pronunciación',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.white.withOpacity(0.8),
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white),
                        onPressed: () {
                          setState(() {
                            _showAddPronunciationModal = false;
                            _pronunciationWordController.clear();
                            _pronunciationPhoneticController.clear();
                            _pronunciationCategoryController.clear();
                          });
                        },
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
                    child: Column(
                      children: [
                        const SizedBox(height: 8),
                        _buildPronunciationModalField(
                          'Palabra',
                          _pronunciationWordController,
                          Icons.text_fields,
                          hintText: 'Ej: Hello',
                        ),
                        const SizedBox(height: 16),
                        _buildPronunciationModalField(
                          'Fonética',
                          _pronunciationPhoneticController,
                          Icons.volume_up,
                          hintText: 'Ej: /həˈloʊ/',
                        ),
                        const SizedBox(height: 16),
                        _buildPronunciationModalField(
                          'Categoría',
                          _pronunciationCategoryController,
                          Icons.category,
                          hintText: 'Ej: Vocales',
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: DropdownButtonFormField<String>(
                                value: _selectedDifficulty,
                                decoration: InputDecoration(
                                  labelText: 'Dificultad',
                                  prefixIcon: const Icon(Icons.trending_up),
                                  filled: true,
                                  fillColor: AppTheme.darkSurface.withOpacity(0.6),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                items: ['Básico', 'Intermedio', 'Avanzado'].map((diff) {
                                  return DropdownMenuItem(
                                    value: diff,
                                    child: Text(diff),
                                  );
                                }).toList(),
                                onChanged: (value) {
                                  if (value != null) {
                                    setState(() => _selectedDifficulty = value);
                                  }
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 40),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.white.withOpacity(0.1),
                        Colors.transparent,
                      ],
                    ),
                    border: Border(
                      top: BorderSide(color: Colors.white.withOpacity(0.2), width: 1),
                    ),
                  ),
                  child: SafeArea(
                    top: false,
                    child: Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              setState(() {
                                _showAddPronunciationModal = false;
                                _pronunciationWordController.clear();
                                _pronunciationPhoneticController.clear();
                                _pronunciationCategoryController.clear();
                              });
                            },
                            style: OutlinedButton.styleFrom(
                              side: BorderSide(color: Colors.white.withOpacity(0.3)),
                              foregroundColor: Colors.white,
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
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.white,
                                  Colors.white.withOpacity(0.9),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.2),
                                  blurRadius: 8,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: ElevatedButton.icon(
                              onPressed: () {
                                if (_pronunciationWordController.text.trim().isNotEmpty &&
                                    _pronunciationPhoneticController.text.trim().isNotEmpty) {
                                  final exercise = PronunciationExercise(
                                    id: DateTime.now().millisecondsSinceEpoch.toString(),
                                    word: _pronunciationWordController.text.trim(),
                                    phonetic: _pronunciationPhoneticController.text.trim(),
                                    category: _pronunciationCategoryController.text.trim().isEmpty
                                        ? 'General'
                                        : _pronunciationCategoryController.text.trim(),
                                    difficulty: _selectedDifficulty,
                                    level: 'A1',
                                    createdAt: DateTime.now(),
                                  );
                                  
                                  setState(() {
                                    if (_pronunciationExercisesByLanguage[_selectedPronunciationLanguage] == null) {
                                      _pronunciationExercisesByLanguage[_selectedPronunciationLanguage] = [];
                                    }
                                    _pronunciationExercisesByLanguage[_selectedPronunciationLanguage]!.add(exercise);
                                    _showAddPronunciationModal = false;
                                    _pronunciationWordController.clear();
                                    _pronunciationPhoneticController.clear();
                                    _pronunciationCategoryController.clear();
                                  });
                                }
                              },
                              icon: const Icon(Icons.check, size: 20),
                              label: const Text('Guardar Ejercicio', style: TextStyle(fontSize: 15)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                foregroundColor: const Color(0xFFF59E0B),
                                shadowColor: Colors.transparent,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildPronunciationModalField(String label, TextEditingController controller, IconData icon, {String? hintText, int maxLines = 1}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          maxLines: maxLines,
          style: const TextStyle(color: AppTheme.white),
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: TextStyle(color: AppTheme.white),
            prefixIcon: Icon(icon, color: const Color(0xFFF59E0B)),
            filled: true,
            fillColor: AppTheme.darkSurface.withOpacity(0.6),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: AppTheme.darkSurfaceVariant),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: AppTheme.darkSurfaceVariant),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFF59E0B), width: 2),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildConversation() {
    final languages = [
      {'id': 'english', 'name': 'Inglés', 'flag': '🇺🇸', 'color': const Color(0xFF2196F3)},
      {'id': 'spanish', 'name': 'Español', 'flag': '🇪🇸', 'color': const Color(0xFFE91E63)},
      {'id': 'french', 'name': 'Francés', 'flag': '🇫🇷', 'color': const Color(0xFF4CAF50)},
    ];
    
    final categories = {
      'english': ['Todas', 'Saludos', 'Presentaciones', 'Compras', 'Restaurante', 'Viajes', 'Trabajo'],
      'spanish': ['Todas', 'Saludos', 'Presentaciones', 'Compras', 'Restaurante', 'Viajes', 'Trabajo'],
    };
    
    final currentConversations = _conversationsByLanguage[_selectedConversationLanguage] ?? [];
    final filteredConversations = _getFilteredConversations(currentConversations);
    final stats = _getConversationStats(currentConversations);
    
    // Si hay una conversación seleccionada, mostrar el diálogo
    if (_selectedConversation != null) {
      return _buildConversationDialog(_selectedConversation!);
    }
    
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
                    colors: [const Color(0xFFEC4899), const Color(0xFFEC4899).withOpacity(0.8)],
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
                      child: const Icon(Icons.chat_bubble, color: Colors.white, size: 24),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Conversación',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Practica diálogos reales',
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
                          '${filteredConversations.length}',
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
              
              // Selector de idiomas
              const Text(
                'Idioma de Estudio',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 140,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: languages.length,
                  itemBuilder: (context, index) {
                    final lang = languages[index];
                    final isSelected = _selectedConversationLanguage == lang['id'];
                    final langStats = _getLanguageConversationStats(lang['id'] as String);
                    return GestureDetector(
                      onTap: () => setState(() => _selectedConversationLanguage = lang['id'] as String),
                      child: Container(
                        width: 120,
                        margin: const EdgeInsets.only(right: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isSelected ? (lang['color'] as Color) : AppTheme.darkSurfaceVariant,
                            width: isSelected ? 3 : 1,
                          ),
                        ),
                        child: Column(
                          children: [
                            Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: lang['color'] as Color,
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Center(
                                child: Text(
                                  lang['flag'] as String,
                                  style: const TextStyle(fontSize: 20),
                                ),
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              lang['name'] as String,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.white,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 8),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(2),
                              child: LinearProgressIndicator(
                                value: langStats['percentage'] / 100,
                                backgroundColor: AppTheme.darkSurfaceVariant,
                                valueColor: AlwaysStoppedAnimation<Color>(lang['color'] as Color),
                                minHeight: 4,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${langStats['mastered']}/${langStats['total']}',
                              style: TextStyle(
                                fontSize: 10,
                                color: AppTheme.white,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Búsqueda y filtros
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Icon(Icons.search, color: AppTheme.white, size: 20),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: TextEditingController(text: _conversationSearchQuery),
                            onChanged: (value) => setState(() => _conversationSearchQuery = value),
                            style: const TextStyle(color: AppTheme.white),
                            decoration: InputDecoration(
                              hintText: 'Buscar conversaciones...',
                              hintStyle: TextStyle(color: AppTheme.white),
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                        if (_conversationSearchQuery.isNotEmpty)
                          IconButton(
                            icon: const Icon(Icons.close, color: AppTheme.white, size: 20),
                            onPressed: () => setState(() => _conversationSearchQuery = ''),
                          ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 40,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: (categories[_selectedConversationLanguage] ?? ['Todas']).length,
                        itemBuilder: (context, index) {
                          final category = (categories[_selectedConversationLanguage] ?? ['Todas'])[index];
                          final isSelected = _selectedConversationCategory == (category == 'Todas' ? 'all' : category);
                          return Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: FilterChip(
                              selected: isSelected,
                              label: Text(category),
                              onSelected: (selected) {
                                setState(() {
                                  _selectedConversationCategory = category == 'Todas' ? 'all' : category;
                                });
                              },
                              selectedColor: const Color(0xFFEC4899),
                              labelStyle: TextStyle(
                                color: isSelected ? Colors.white : AppTheme.white,
                                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                              ),
                              backgroundColor: AppTheme.darkSurfaceVariant,
                            ),
                          );
                        },
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
                    child: _buildConversationStatCard(
                      Icons.emoji_events,
                      '${stats['mastered']}',
                      'Dominadas',
                      Colors.green,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildConversationStatCard(
                      Icons.chat_bubble,
                      '${stats['total']}',
                      'Diálogos',
                      const Color(0xFF2196F3),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildConversationStatCard(
                      Icons.play_circle,
                      '${stats['totalPractice']}',
                      'Prácticas',
                      Colors.orange,
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 20),
              
              // Botón agregar
              ElevatedButton.icon(
                onPressed: () => setState(() => _showAddConversationModal = true),
                icon: const Icon(Icons.add, size: 20),
                label: const Text('Nuevo Diálogo'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFEC4899),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
              
              const SizedBox(height: 20),
              
              // Lista de conversaciones
              if (filteredConversations.isEmpty)
                _buildConversationEmptyState()
              else
                ...filteredConversations.map((conv) => _buildConversationCard(conv)),
            ],
          ),
        ),
        if (_showAddConversationModal) _buildAddConversationModal(),
      ],
    );
  }
  
  List<Conversation> _getFilteredConversations(List<Conversation> conversations) {
    var filtered = conversations;
    
    if (_selectedConversationCategory != 'all') {
      filtered = filtered.where((c) => c.category == _selectedConversationCategory).toList();
    }
    
    if (_conversationSearchQuery.isNotEmpty) {
      final query = _conversationSearchQuery.toLowerCase();
      filtered = filtered.where((c) =>
        c.title.toLowerCase().contains(query) ||
        c.description.toLowerCase().contains(query) ||
        c.phrases.any((p) =>
          p.text.toLowerCase().contains(query) ||
          p.translation.toLowerCase().contains(query)
        )
      ).toList();
    }
    
    return filtered;
  }
  
  Map<String, dynamic> _getConversationStats(List<Conversation> conversations) {
    final mastered = conversations.where((c) => c.mastered).length;
    final total = conversations.length;
    final totalPractice = conversations.fold<int>(0, (sum, c) => sum + c.practiceCount);
    final percentage = total > 0 ? ((mastered / total) * 100).round() : 0;
    return {
      'total': total,
      'mastered': mastered,
      'totalPractice': totalPractice,
      'percentage': percentage,
    };
  }
  
  Map<String, dynamic> _getLanguageConversationStats(String languageId) {
    final conversations = _conversationsByLanguage[languageId] ?? [];
    return _getConversationStats(conversations);
  }
  
  Widget _buildConversationStatCard(IconData icon, String value, String label, Color color) {
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
  
  Widget _buildConversationEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      child: Column(
        children: [
          Icon(Icons.chat_bubble_outline, size: 64, color: AppTheme.white),
          const SizedBox(height: 16),
          Text(
            _conversationSearchQuery.isNotEmpty
                ? 'No se encontraron resultados'
                : 'No hay conversaciones',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
  
  Widget _buildConversationCard(Conversation conversation) {
    return GestureDetector(
      onTap: () => setState(() => _selectedConversation = conversation),
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: AppTheme.darkSurface,
          borderRadius: BorderRadius.circular(16),
          border: Border(
            left: BorderSide(
              color: conversation.mastered ? Colors.green : const Color(0xFFEC4899),
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
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    _getConversationCategoryIcon(conversation.category),
                    color: const Color(0xFFEC4899),
                    size: 20,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          conversation.title,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          conversation.description,
                          style: TextStyle(
                            fontSize: 14,
                            color: AppTheme.white,
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _getDifficultyColor(conversation.difficulty),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          conversation.difficulty,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _getLevelColor(conversation.level),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          conversation.level,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              
              const SizedBox(height: 12),
              
              // Info
              Row(
                children: [
                  Icon(Icons.people, size: 16, color: AppTheme.white),
                  const SizedBox(width: 4),
                  Text(
                    '${conversation.participants} personas',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppTheme.white,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Icon(Icons.access_time, size: 16, color: AppTheme.white),
                  const SizedBox(width: 4),
                  Text(
                    conversation.duration,
                    style: TextStyle(
                      fontSize: 12,
                      color: AppTheme.white,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Icon(Icons.chat_bubble, size: 16, color: AppTheme.white),
                  const SizedBox(width: 4),
                  Text(
                    '${conversation.phrases.length} frases',
                    style: TextStyle(
                      fontSize: 12,
                      color: AppTheme.white,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 12),
              
              // Progreso
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        conversation.mastered ? 'Dominada' : 'En práctica',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.white,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Text(
                        '${conversation.practiceCount} intentos',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(3),
                    child: LinearProgressIndicator(
                      value: conversation.mastered ? 1.0 : (conversation.practiceCount / 10).clamp(0.0, 0.9),
                      backgroundColor: AppTheme.darkSurfaceVariant,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        conversation.mastered ? Colors.green : const Color(0xFFEC4899),
                      ),
                      minHeight: 6,
                    ),
                  ),
                  if (conversation.lastPracticed != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      'Última práctica: ${DateFormat('dd/MM/yyyy').format(conversation.lastPracticed!)}',
                      style: TextStyle(
                        fontSize: 10,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _buildConversationDialog(Conversation conversation) {
    return Column(
      children: [
        // Header del diálogo
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [const Color(0xFFEC4899), const Color(0xFFEC4899).withOpacity(0.8)],
            ),
          ),
          child: SafeArea(
            bottom: false,
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back, color: Colors.white),
                  onPressed: () => setState(() => _selectedConversation = null),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        conversation.title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${conversation.category} • ${conversation.difficulty} • ${conversation.duration}',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.white.withOpacity(0.8),
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.play_arrow, color: Colors.white),
                  onPressed: () {},
                ),
              ],
            ),
          ),
        ),
        
        // Descripción
        Container(
          padding: const EdgeInsets.all(20),
          color: AppTheme.darkSurface,
          child: Text(
            conversation.description,
            style: const TextStyle(
              fontSize: 16,
              color: AppTheme.white,
              height: 1.5,
            ),
          ),
        ),
        
        // Diálogo
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(20),
            itemCount: conversation.phrases.length,
            itemBuilder: (context, index) {
              final phrase = conversation.phrases[index];
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: (phrase.speaker == 'Customer' || phrase.speaker == 'Cliente')
                            ? const Color(0xFF2196F3)
                            : Colors.green,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        phrase.speaker,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      phrase.text,
                      style: const TextStyle(
                        fontSize: 16,
                        color: AppTheme.white,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      phrase.translation,
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.white,
                        fontStyle: FontStyle.italic,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.volume_up, color: AppTheme.white, size: 20),
                          onPressed: () {},
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ),
        
        // Controles
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.darkSurface,
            border: Border(
              top: BorderSide(color: AppTheme.darkSurfaceVariant, width: 1),
            ),
          ),
          child: SafeArea(
            top: false,
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.refresh, size: 18),
                    label: const Text('Repetir'),
                    style: OutlinedButton.styleFrom(
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
                    icon: const Icon(Icons.mic, size: 18),
                    label: const Text('Practicar'),
                    style: OutlinedButton.styleFrom(
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
                    icon: const Icon(Icons.bookmark, size: 18),
                    label: const Text('Guardar'),
                    style: OutlinedButton.styleFrom(
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
          ),
        ),
      ],
    );
  }
  
  IconData _getConversationCategoryIcon(String category) {
    switch (category) {
      case 'Saludos':
        return Icons.waving_hand;
      case 'Presentaciones':
        return Icons.person;
      case 'Compras':
        return Icons.shopping_bag;
      case 'Restaurante':
        return Icons.restaurant;
      case 'Viajes':
        return Icons.flight;
      case 'Trabajo':
        return Icons.work;
      case 'Familia':
        return Icons.family_restroom;
      case 'Hobbies':
        return Icons.favorite;
      case 'Emergencias':
        return Icons.warning;
      default:
        return Icons.chat_bubble;
    }
  }
  
  Widget _buildAddConversationModal() {
    return Container(
      color: Colors.black87,
      child: SafeArea(
        child: Container(
          margin: const EdgeInsets.all(16),
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.9,
            maxWidth: 500,
          ),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                const Color(0xFFEC4899),
                const Color(0xFFEC4899).withOpacity(0.8),
              ],
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: const Color(0xFFEC4899).withOpacity(0.3), width: 2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.5),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.white.withOpacity(0.2),
                        Colors.white.withOpacity(0.1),
                      ],
                    ),
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
                        child: const Icon(Icons.add_circle_outline, color: Colors.white, size: 24),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Nuevo Diálogo',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Practica diálogos reales',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.white.withOpacity(0.8),
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white),
                        onPressed: () {
                          setState(() {
                            _showAddConversationModal = false;
                            _conversationTitleController.clear();
                            _conversationCategoryController.clear();
                            _conversationDescriptionController.clear();
                          });
                        },
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
                    child: Column(
                      children: [
                        const SizedBox(height: 8),
                        _buildConversationModalField(
                          'Título',
                          _conversationTitleController,
                          Icons.title,
                          hintText: 'Ej: At the Restaurant',
                        ),
                        const SizedBox(height: 16),
                        _buildConversationModalField(
                          'Categoría',
                          _conversationCategoryController,
                          Icons.category,
                          hintText: 'Ej: Restaurante',
                        ),
                        const SizedBox(height: 16),
                        _buildConversationModalField(
                          'Descripción',
                          _conversationDescriptionController,
                          Icons.description,
                          hintText: 'Describe el contexto del diálogo...',
                          maxLines: 3,
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: DropdownButtonFormField<String>(
                                value: _selectedDifficulty,
                                decoration: InputDecoration(
                                  labelText: 'Dificultad',
                                  prefixIcon: const Icon(Icons.trending_up),
                                  filled: true,
                                  fillColor: AppTheme.darkSurface.withOpacity(0.6),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                items: ['Básico', 'Intermedio', 'Avanzado'].map((diff) {
                                  return DropdownMenuItem(
                                    value: diff,
                                    child: Text(diff),
                                  );
                                }).toList(),
                                onChanged: (value) {
                                  if (value != null) {
                                    setState(() => _selectedDifficulty = value);
                                  }
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 40),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.white.withOpacity(0.1),
                        Colors.transparent,
                      ],
                    ),
                    border: Border(
                      top: BorderSide(color: Colors.white.withOpacity(0.2), width: 1),
                    ),
                  ),
                  child: SafeArea(
                    top: false,
                    child: Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              setState(() {
                                _showAddConversationModal = false;
                                _conversationTitleController.clear();
                                _conversationCategoryController.clear();
                                _conversationDescriptionController.clear();
                              });
                            },
                            style: OutlinedButton.styleFrom(
                              side: BorderSide(color: Colors.white.withOpacity(0.3)),
                              foregroundColor: Colors.white,
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
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.white,
                                  Colors.white.withOpacity(0.9),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.2),
                                  blurRadius: 8,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: ElevatedButton.icon(
                              onPressed: () {
                                if (_conversationTitleController.text.trim().isNotEmpty &&
                                    _conversationDescriptionController.text.trim().isNotEmpty) {
                                  final conversation = Conversation(
                                    id: DateTime.now().millisecondsSinceEpoch.toString(),
                                    title: _conversationTitleController.text.trim(),
                                    category: _conversationCategoryController.text.trim().isEmpty
                                        ? 'General'
                                        : _conversationCategoryController.text.trim(),
                                    difficulty: _selectedDifficulty,
                                    level: 'B1',
                                    participants: 2,
                                    duration: '5 min',
                                    description: _conversationDescriptionController.text.trim(),
                                    phrases: [],
                                    createdAt: DateTime.now(),
                                  );
                                  
                                  setState(() {
                                    if (_conversationsByLanguage[_selectedConversationLanguage] == null) {
                                      _conversationsByLanguage[_selectedConversationLanguage] = [];
                                    }
                                    _conversationsByLanguage[_selectedConversationLanguage]!.add(conversation);
                                    _showAddConversationModal = false;
                                    _conversationTitleController.clear();
                                    _conversationCategoryController.clear();
                                    _conversationDescriptionController.clear();
                                  });
                                }
                              },
                              icon: const Icon(Icons.check, size: 20),
                              label: const Text('Guardar Diálogo', style: TextStyle(fontSize: 15)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                foregroundColor: const Color(0xFFEC4899),
                                shadowColor: Colors.transparent,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildConversationModalField(String label, TextEditingController controller, IconData icon, {String? hintText, int maxLines = 1}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          maxLines: maxLines,
          style: const TextStyle(color: AppTheme.white),
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: TextStyle(color: AppTheme.white),
            prefixIcon: Icon(icon, color: const Color(0xFFEC4899)),
            filled: true,
            fillColor: AppTheme.darkSurface.withOpacity(0.6),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: AppTheme.darkSurfaceVariant),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: AppTheme.darkSurfaceVariant),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFEC4899), width: 2),
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

  Widget _buildVocabularyCard(Vocabulary vocabulary) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: const Duration(milliseconds: 300),
      builder: (context, value, child) {
        return Transform.translate(
          offset: Offset(0, 20 * (1 - value)),
          child: Opacity(opacity: value, child: child),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: AppTheme.darkSurface,
          borderRadius: BorderRadius.circular(16),
          border: Border(
            left: BorderSide(
              color: vocabulary.mastered ? Colors.green : _getLevelColor(vocabulary.level),
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
              // Header con palabra y badges
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(
                                vocabulary.word,
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.white,
                                ),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: _getLevelColor(vocabulary.level),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                vocabulary.level,
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
                        ),
                        if (vocabulary.phonetics.isNotEmpty) ...[
                          const SizedBox(height: 4),
                          Text(
                            vocabulary.phonetics,
                            style: TextStyle(
                              fontSize: 14,
                              color: AppTheme.white,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        ],
                        const SizedBox(height: 4),
                        Text(
                          vocabulary.meaning.isNotEmpty ? vocabulary.meaning : vocabulary.translation,
                          style: const TextStyle(
                            fontSize: 16,
                            color: AppTheme.white,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        if (vocabulary.translation.isNotEmpty && vocabulary.meaning.isNotEmpty) ...[
                          const SizedBox(height: 2),
                          Text(
                            vocabulary.translation,
                            style: TextStyle(
                              fontSize: 14,
                              color: AppTheme.white,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.edit, color: Colors.blue, size: 20),
                        onPressed: () {},
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete, color: Colors.red, size: 20),
                        onPressed: () {
                          setState(() {
                            _vocabulariesByLanguage[_selectedVocabularyLanguage]?.removeWhere((v) => v.id == vocabulary.id);
                          });
                        },
                      ),
                    ],
                  ),
                ],
              ),
              
              // Ejemplo
              if (vocabulary.example.isNotEmpty) ...[
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF06B6D4).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border(
                      left: BorderSide(color: const Color(0xFF06B6D4), width: 4),
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.format_quote, color: const Color(0xFF06B6D4), size: 16),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          vocabulary.example,
                          style: TextStyle(
                            fontSize: 14,
                            color: AppTheme.white,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
              
              // Tags
              if (vocabulary.tags.isNotEmpty) ...[
                const SizedBox(height: 12),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: vocabulary.tags.map((tag) {
                    return Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF06B6D4).withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: const Color(0xFF06B6D4).withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      child: Text(
                        tag,
                        style: TextStyle(
                          fontSize: 12,
                          color: const Color(0xFF06B6D4),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
              
              const SizedBox(height: 12),
              
              // Metadata y progreso
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.darkSurfaceVariant,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        Icon(_getCategoryIcon(vocabulary.category), size: 14, color: AppTheme.white),
                        const SizedBox(width: 4),
                        Text(
                          vocabulary.category,
                          style: TextStyle(
                            fontSize: 12,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getDifficultyColor(vocabulary.difficulty),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      vocabulary.difficulty,
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
              
              // Progreso de estudio
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Progreso de Estudio',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.white,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Text(
                        '${vocabulary.studyCount} estudios',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(3),
                    child: LinearProgressIndicator(
                      value: vocabulary.mastered ? 1.0 : (vocabulary.studyCount / 20).clamp(0.0, 0.9),
                      backgroundColor: AppTheme.darkSurfaceVariant,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        vocabulary.mastered ? Colors.green : const Color(0xFF2196F3),
                      ),
                      minHeight: 6,
                    ),
                  ),
                  if (vocabulary.lastStudied != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      'Último estudio: ${DateFormat('dd/MM/yyyy').format(vocabulary.lastStudied!)}',
                      style: TextStyle(
                        fontSize: 10,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ],
              ),
              
              const SizedBox(height: 12),
              
              // Estado de dominio
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: vocabulary.mastered ? Colors.green : Colors.orange,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          vocabulary.mastered ? Icons.check_circle : Icons.access_time,
                          size: 16,
                          color: Colors.white,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          vocabulary.mastered ? 'Dominado' : 'En Estudio',
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: 12),
              
              // Acciones rápidas
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildQuickActionButton(Icons.volume_up, 'Pronunciar', Colors.green),
                  _buildQuickActionButton(Icons.bookmark, 'Guardar', Colors.orange),
                  _buildQuickActionButton(Icons.refresh, 'Repasar', const Color(0xFF2196F3)),
                  _buildQuickActionButton(Icons.share, 'Compartir', const Color(0xFF9C27B0)),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _buildQuickActionButton(IconData icon, String label, Color color) {
    return GestureDetector(
      onTap: () {},
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: AppTheme.darkSurfaceVariant,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          children: [
            Icon(icon, size: 16, color: color),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                color: AppTheme.white,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  IconData _getCategoryIcon(String category) {
    switch (category) {
      case 'Saludos':
        return Icons.waving_hand;
      case 'Adjetivos':
        return Icons.palette;
      case 'Sustantivos':
        return Icons.inventory_2;
      case 'Verbos':
        return Icons.bolt;
      case 'Hiragana':
      case 'Katakana':
        return Icons.text_fields;
      case 'Frases':
        return Icons.chat_bubble;
      default:
        return Icons.book;
    }
  }

  Widget _buildWritingCard(WritingPractice practice) {
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
                    practice.title,
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
                    color: _getDifficultyColor(practice.difficulty),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    practice.difficulty,
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
              practice.content,
              maxLines: 3,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.white,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGrammarCard(GrammarNote note) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border(
          left: BorderSide(
            color: note.mastered ? Colors.green : const Color(0xFF8B5CF6),
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
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(
                  _getGrammarCategoryIcon(note.category),
                  color: const Color(0xFF8B5CF6),
                  size: 20,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        note.title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: _getDifficultyColor(note.difficulty),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              note.difficulty,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: _getLevelColor(note.level),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              note.level,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.edit, color: Colors.blue, size: 20),
                      onPressed: () {},
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red, size: 20),
                      onPressed: () {
                        setState(() {
                          _grammarNotesByLanguage[_selectedGrammarLanguage]?.removeWhere((n) => n.id == note.id);
                        });
                      },
                    ),
                  ],
                ),
              ],
            ),
            
            const SizedBox(height: 12),
            
            Text(
              note.content,
              style: const TextStyle(
                fontSize: 16,
                color: AppTheme.white,
                height: 1.5,
              ),
            ),
            
            if (note.examples.isNotEmpty) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF8B5CF6).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Ejemplos:',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    ...note.examples.map((example) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 4),
                        child: Text(
                          '• $example',
                          style: TextStyle(
                            fontSize: 14,
                            color: AppTheme.white,
                            height: 1.5,
                          ),
                        ),
                      );
                    }),
                  ],
                ),
              ),
            ],
            
            if (note.tags.isNotEmpty) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: note.tags.map((tag) {
                  return Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppTheme.darkSurfaceVariant,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      tag,
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
            
            const SizedBox(height: 12),
            
            // Progreso
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      note.mastered ? 'Dominada' : 'En estudio',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Text(
                      '${note.studyCount} repasos',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                ClipRRect(
                  borderRadius: BorderRadius.circular(3),
                  child: LinearProgressIndicator(
                    value: note.mastered ? 1.0 : (note.studyCount / 20).clamp(0.0, 0.9),
                    backgroundColor: AppTheme.darkSurfaceVariant,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      note.mastered ? Colors.green : const Color(0xFF8B5CF6),
                    ),
                    minHeight: 6,
                  ),
                ),
                if (note.lastStudied != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    'Último estudio: ${DateFormat('dd/MM/yyyy').format(note.lastStudied!)}',
                    style: TextStyle(
                      fontSize: 10,
                      color: AppTheme.white,
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
  
  IconData _getGrammarCategoryIcon(String category) {
    switch (category) {
      case 'Tiempos Verbales':
        return Icons.access_time;
      case 'Sustantivos':
        return Icons.inventory_2;
      case 'Adjetivos':
        return Icons.palette;
      case 'Pronombres':
        return Icons.person;
      case 'Preposiciones':
        return Icons.arrow_forward;
      case 'Conjunciones':
        return Icons.link;
      case 'Artículos':
        return Icons.book;
      case 'Adverbios':
        return Icons.bolt;
      default:
        return Icons.text_fields;
    }
  }

  Color _getLevelColor(String level) {
    switch (level.toLowerCase()) {
      case 'principiante':
      case 'básico':
        return Colors.green;
      case 'intermedio':
        return Colors.orange;
      case 'avanzado':
        return Colors.red;
      default:
        return AppTheme.orangeAccent;
    }
  }

  Color _getDifficultyColor(String difficulty) {
    switch (difficulty.toLowerCase()) {
      case 'fácil':
      case 'facil':
        return Colors.green;
      case 'intermedio':
        return Colors.orange;
      case 'difícil':
      case 'dificil':
        return Colors.red;
      default:
        return AppTheme.orangeAccent;
    }
  }
  
  Widget _buildAddVocabularyModal() {
    return Container(
      color: Colors.black87,
      child: SafeArea(
        child: Container(
          margin: const EdgeInsets.all(16),
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.9,
            maxWidth: 500,
          ),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                const Color(0xFF06B6D4),
                const Color(0xFF06B6D4).withOpacity(0.8),
              ],
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: const Color(0xFF06B6D4).withOpacity(0.3), width: 2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.5),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.white.withOpacity(0.2),
                        Colors.white.withOpacity(0.1),
                      ],
                    ),
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
                        child: const Icon(Icons.add_circle_outline, color: Colors.white, size: 24),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Agregar Vocabulario',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Amplía tu vocabulario',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.white.withOpacity(0.8),
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white),
                        onPressed: () {
                          setState(() {
                            _showAddVocabularyModal = false;
                            _vocabularyWordController.clear();
                            _vocabularyPhoneticsController.clear();
                            _vocabularyMeaningController.clear();
                            _vocabularyExampleController.clear();
                          });
                        },
                      ),
                    ],
                  ),
                ),
                
                // Body
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
                    child: Column(
                      children: [
                        const SizedBox(height: 8),
                        _buildVocabularyModalField(
                          'Palabra',
                          _vocabularyWordController,
                          Icons.text_fields,
                          hintText: 'Ingresa la palabra',
                        ),
                        const SizedBox(height: 16),
                        _buildVocabularyModalField(
                          'Fonética',
                          _vocabularyPhoneticsController,
                          Icons.volume_up,
                          hintText: 'Pronunciación',
                        ),
                        const SizedBox(height: 16),
                        _buildVocabularyModalField(
                          'Significado',
                          _vocabularyMeaningController,
                          Icons.translate,
                          hintText: 'Traducción o significado',
                        ),
                        const SizedBox(height: 16),
                        _buildVocabularyModalField(
                          'Ejemplo',
                          _vocabularyExampleController,
                          Icons.format_quote,
                          hintText: 'Oración de ejemplo',
                          maxLines: 3,
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: DropdownButtonFormField<String>(
                                value: _selectedDifficulty,
                                decoration: InputDecoration(
                                  labelText: 'Dificultad',
                                  prefixIcon: const Icon(Icons.trending_up),
                                  filled: true,
                                  fillColor: AppTheme.darkSurface.withOpacity(0.6),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                items: ['Fácil', 'Medio', 'Difícil'].map((diff) {
                                  return DropdownMenuItem(
                                    value: diff == 'Medio' ? 'Intermedio' : diff,
                                    child: Text(diff),
                                  );
                                }).toList(),
                                onChanged: (value) {
                                  if (value != null) {
                                    setState(() => _selectedDifficulty = value);
                                  }
                                },
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: DropdownButtonFormField<String>(
                                value: 'Básico',
                                decoration: InputDecoration(
                                  labelText: 'Nivel',
                                  prefixIcon: const Icon(Icons.star),
                                  filled: true,
                                  fillColor: AppTheme.darkSurface.withOpacity(0.6),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                items: ['Básico', 'Intermedio', 'Avanzado'].map((level) {
                                  return DropdownMenuItem(
                                    value: level,
                                    child: Text(level),
                                  );
                                }).toList(),
                                onChanged: (value) {},
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                
                // Footer
                Container(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 40),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.white.withOpacity(0.1),
                        Colors.transparent,
                      ],
                    ),
                    border: Border(
                      top: BorderSide(color: Colors.white.withOpacity(0.2), width: 1),
                    ),
                  ),
                  child: SafeArea(
                    top: false,
                    child: Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              setState(() {
                                _showAddVocabularyModal = false;
                                _vocabularyWordController.clear();
                                _vocabularyPhoneticsController.clear();
                                _vocabularyMeaningController.clear();
                                _vocabularyExampleController.clear();
                              });
                            },
                            style: OutlinedButton.styleFrom(
                              side: BorderSide(color: Colors.white.withOpacity(0.3)),
                              foregroundColor: Colors.white,
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
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.white,
                                  Colors.white.withOpacity(0.9),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.2),
                                  blurRadius: 8,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: ElevatedButton.icon(
                              onPressed: () {
                                if (_vocabularyWordController.text.trim().isNotEmpty &&
                                    _vocabularyMeaningController.text.trim().isNotEmpty) {
                                  final vocab = Vocabulary(
                                    id: DateTime.now().millisecondsSinceEpoch.toString(),
                                    word: _vocabularyWordController.text.trim(),
                                    phonetics: _vocabularyPhoneticsController.text.trim(),
                                    meaning: _vocabularyMeaningController.text.trim(),
                                    translation: _vocabularyMeaningController.text.trim(),
                                    example: _vocabularyExampleController.text.trim(),
                                    language: _selectedVocabularyLanguage,
                                    category: _selectedVocabularyCategory == 'all' ? 'General' : _selectedVocabularyCategory,
                                    level: 'Básico',
                                    difficulty: _selectedDifficulty,
                                    createdAt: DateTime.now(),
                                  );
                                  
                                  setState(() {
                                    if (_vocabulariesByLanguage[_selectedVocabularyLanguage] == null) {
                                      _vocabulariesByLanguage[_selectedVocabularyLanguage] = [];
                                    }
                                    _vocabulariesByLanguage[_selectedVocabularyLanguage]!.add(vocab);
                                    _showAddVocabularyModal = false;
                                    _vocabularyWordController.clear();
                                    _vocabularyPhoneticsController.clear();
                                    _vocabularyMeaningController.clear();
                                    _vocabularyExampleController.clear();
                                  });
                                }
                              },
                              icon: const Icon(Icons.check, size: 20),
                              label: const Text('Guardar', style: TextStyle(fontSize: 15)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                foregroundColor: const Color(0xFF06B6D4),
                                shadowColor: Colors.transparent,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildVocabularyModalField(String label, TextEditingController controller, IconData icon, {String? hintText, int maxLines = 1}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          maxLines: maxLines,
          style: const TextStyle(color: AppTheme.white),
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: TextStyle(color: AppTheme.white),
            prefixIcon: Icon(icon, color: const Color(0xFF06B6D4)),
            filled: true,
            fillColor: AppTheme.darkSurface.withOpacity(0.6),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: AppTheme.darkSurfaceVariant),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: AppTheme.darkSurfaceVariant),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF06B6D4), width: 2),
            ),
          ),
        ),
      ],
    );
  }
  
  Widget _buildAddGrammarModal() {
    return Container(
      color: Colors.black87,
      child: SafeArea(
        child: Container(
          margin: const EdgeInsets.all(16),
          constraints: BoxConstraints(
            maxHeight: MediaQuery.of(context).size.height * 0.9,
            maxWidth: 500,
          ),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                const Color(0xFF8B5CF6),
                const Color(0xFF8B5CF6).withOpacity(0.8),
              ],
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: const Color(0xFF8B5CF6).withOpacity(0.3), width: 2),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.5),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.white.withOpacity(0.2),
                        Colors.white.withOpacity(0.1),
                      ],
                    ),
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
                        child: const Icon(Icons.add_circle_outline, color: Colors.white, size: 24),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Nueva Nota de Gramática',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Domina las reglas gramaticales',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.white.withOpacity(0.8),
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, color: Colors.white),
                        onPressed: () {
                          setState(() {
                            _showAddGrammarModal = false;
                            _grammarTitleController.clear();
                            _grammarCategoryController.clear();
                            _grammarContentController.clear();
                            _grammarExamplesController.clear();
                          });
                        },
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
                    child: Column(
                      children: [
                        const SizedBox(height: 8),
                        _buildGrammarModalField(
                          'Título',
                          _grammarTitleController,
                          Icons.title,
                          hintText: 'Ej: Present Simple vs Present Continuous',
                        ),
                        const SizedBox(height: 16),
                        _buildGrammarModalField(
                          'Categoría',
                          _grammarCategoryController,
                          Icons.category,
                          hintText: 'Ej: Tiempos Verbales',
                        ),
                        const SizedBox(height: 16),
                        _buildGrammarModalField(
                          'Contenido',
                          _grammarContentController,
                          Icons.description,
                          hintText: 'Explica la regla gramatical...',
                          maxLines: 4,
                        ),
                        const SizedBox(height: 16),
                        _buildGrammarModalField(
                          'Ejemplos',
                          _grammarExamplesController,
                          Icons.format_list_bulleted,
                          hintText: 'Escribe ejemplos separados por líneas...',
                          maxLines: 3,
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: DropdownButtonFormField<String>(
                                value: _selectedDifficulty,
                                decoration: InputDecoration(
                                  labelText: 'Dificultad',
                                  prefixIcon: const Icon(Icons.trending_up),
                                  filled: true,
                                  fillColor: AppTheme.darkSurface.withOpacity(0.6),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                items: ['Básico', 'Intermedio', 'Avanzado'].map((diff) {
                                  return DropdownMenuItem(
                                    value: diff,
                                    child: Text(diff),
                                  );
                                }).toList(),
                                onChanged: (value) {
                                  if (value != null) {
                                    setState(() => _selectedDifficulty = value);
                                  }
                                },
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 40),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        Colors.white.withOpacity(0.1),
                        Colors.transparent,
                      ],
                    ),
                    border: Border(
                      top: BorderSide(color: Colors.white.withOpacity(0.2), width: 1),
                    ),
                  ),
                  child: SafeArea(
                    top: false,
                    child: Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              setState(() {
                                _showAddGrammarModal = false;
                                _grammarTitleController.clear();
                                _grammarCategoryController.clear();
                                _grammarContentController.clear();
                                _grammarExamplesController.clear();
                              });
                            },
                            style: OutlinedButton.styleFrom(
                              side: BorderSide(color: Colors.white.withOpacity(0.3)),
                              foregroundColor: Colors.white,
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
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.white,
                                  Colors.white.withOpacity(0.9),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.2),
                                  blurRadius: 8,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: ElevatedButton.icon(
                              onPressed: () {
                                if (_grammarTitleController.text.trim().isNotEmpty &&
                                    _grammarContentController.text.trim().isNotEmpty) {
                                  final examples = _grammarExamplesController.text
                                      .trim()
                                      .split('\n')
                                      .where((e) => e.trim().isNotEmpty)
                                      .toList();
                                  
                                  final note = GrammarNote(
                                    id: DateTime.now().millisecondsSinceEpoch.toString(),
                                    title: _grammarTitleController.text.trim(),
                                    content: _grammarContentController.text.trim(),
                                    examples: examples,
                                    language: _selectedGrammarLanguage,
                                    category: _grammarCategoryController.text.trim().isEmpty
                                        ? 'General'
                                        : _grammarCategoryController.text.trim(),
                                    level: 'B1',
                                    difficulty: _selectedDifficulty,
                                    createdAt: DateTime.now(),
                                  );
                                  
                                  setState(() {
                                    if (_grammarNotesByLanguage[_selectedGrammarLanguage] == null) {
                                      _grammarNotesByLanguage[_selectedGrammarLanguage] = [];
                                    }
                                    _grammarNotesByLanguage[_selectedGrammarLanguage]!.add(note);
                                    _showAddGrammarModal = false;
                                    _grammarTitleController.clear();
                                    _grammarCategoryController.clear();
                                    _grammarContentController.clear();
                                    _grammarExamplesController.clear();
                                  });
                                }
                              },
                              icon: const Icon(Icons.check, size: 20),
                              label: const Text('Guardar Nota', style: TextStyle(fontSize: 15)),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                foregroundColor: const Color(0xFF8B5CF6),
                                shadowColor: Colors.transparent,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildGrammarModalField(String label, TextEditingController controller, IconData icon, {String? hintText, int maxLines = 1}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          maxLines: maxLines,
          style: const TextStyle(color: AppTheme.white),
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: TextStyle(color: AppTheme.white),
            prefixIcon: Icon(icon, color: const Color(0xFF8B5CF6)),
            filled: true,
            fillColor: AppTheme.darkSurface.withOpacity(0.6),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: AppTheme.darkSurfaceVariant),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: AppTheme.darkSurfaceVariant),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF8B5CF6), width: 2),
            ),
          ),
        ),
      ],
    );
  }
}

