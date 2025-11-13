import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../models/reading/book.dart';
import '../../models/reading/book_quote.dart';
import '../../models/reading/book_series.dart';
import '../../theme/app_theme.dart';
import '../../widgets/common/navigation_header.dart';
import '../../auth/providers/auth_provider.dart';

class ReadingSections extends StatefulWidget {
  const ReadingSections({super.key});

  @override
  State<ReadingSections> createState() => _ReadingSectionsState();
}

class _ReadingSectionsState extends State<ReadingSections> {
  String _activeSection = 'reading-journal';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  String _contentType = 'book'; // 'book' or 'audiobook'
  
  List<Book> _books = [];
  List<BookQuote> _quotes = [];
  List<BookSeries> _series = [];
  List<Book> _bookshelf = [];

  // Modal states
  bool _showAddBookModal = false;
  bool _showAddQuoteModal = false;
  bool _showAddSeriesModal = false;
  bool _showAddBookshelfModal = false;

  // Controllers for modals
  final TextEditingController _bookTitleController = TextEditingController();
  final TextEditingController _bookAuthorController = TextEditingController();
  final TextEditingController _bookGenreController = TextEditingController();
  final TextEditingController _bookPagesController = TextEditingController();
  final TextEditingController _bookNotesController = TextEditingController();
  final TextEditingController _bookStartDateController = TextEditingController();
  final TextEditingController _bookFinishDateController = TextEditingController();
  
  final TextEditingController _quoteTextController = TextEditingController();
  final TextEditingController _quoteBookController = TextEditingController();
  final TextEditingController _quoteAuthorController = TextEditingController();
  final TextEditingController _quoteCategoryController = TextEditingController();
  final TextEditingController _quotePageController = TextEditingController();
  final TextEditingController _quoteChapterController = TextEditingController();
  
  String _selectedBookStatus = 'want_to_read';
  String _selectedBookRating = '0';
  String _selectedQuoteRating = '0';
  String _selectedQuoteCategory = 'Vida';
  String _selectedQuoteGenre = 'Filosofía';

  final sections = [
    {'id': 'reading-journal', 'name': 'Diario de Lectura', 'icon': Icons.book},
    {'id': 'reading-log', 'name': 'Registro de Lectura', 'icon': Icons.list_alt},
    {'id': 'favorite-quotes', 'name': 'Citas Favoritas', 'icon': Icons.format_quote},
    {'id': 'book-series', 'name': 'Sagas de Libros', 'icon': Icons.library_books},
    {'id': 'bookshelf', 'name': 'Estantería', 'icon': Icons.bookmark_border},
  ];

  @override
  void dispose() {
    _bookTitleController.dispose();
    _bookAuthorController.dispose();
    _bookGenreController.dispose();
    _bookPagesController.dispose();
    _bookNotesController.dispose();
    _bookStartDateController.dispose();
    _bookFinishDateController.dispose();
    _quoteTextController.dispose();
    _quoteBookController.dispose();
    _quoteAuthorController.dispose();
    _quoteCategoryController.dispose();
    _quotePageController.dispose();
    _quoteChapterController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppTheme.darkBackground,
      drawer: _buildNavigationDrawer(context),
      appBar: NavigationHeader(currentSection: 'reading'),
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
                  Colors.indigo.withOpacity(0.4),
                  Colors.indigo.withOpacity(0.2),
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
                      colors: [Colors.indigo, Colors.indigo.withOpacity(0.7)],
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
            isActive: true,
            onTap: () {
              Navigator.pop(context);
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
          Divider(color: AppTheme.white.withOpacity(0.3), height: 32),
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
          color: isActive ? color.withOpacity(0.2) : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(
          icon,
          color: isActive ? color : AppTheme.white,
          size: 22,
        ),
      ),
      title: Text(
        title,
        style: TextStyle(
          color: isActive ? color : AppTheme.white,
          fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
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
      case 'reading-journal':
        return _buildReadingJournal();
      case 'reading-log':
        return _buildReadingLog();
      case 'favorite-quotes':
        return _buildFavoriteQuotes();
      case 'book-series':
        return _buildBookSeries();
      case 'bookshelf':
        return _buildBookshelf();
      default:
        return _buildReadingJournal();
    }
  }

  Widget _buildReadingJournal() {
    final totalBooks = _books.length;
    final totalPages = _books.fold<int>(0, (sum, book) => sum + book.pages);
    final averageRating = _books.isNotEmpty
        ? _books.map((b) => b.rating).reduce((a, b) => a + b) / _books.length
        : 0.0;
    final favoriteGenre = _books.isNotEmpty
        ? _books.map((b) => b.genre).fold<Map<String, int>>(
            {},
            (map, genre) {
              map[genre] = (map[genre] ?? 0) + 1;
              return map;
            },
          ).entries.reduce((a, b) => a.value > b.value ? a : b).key
        : '';

    return Stack(
      children: [
        ListView(
          padding: EdgeInsets.zero,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Colors.indigo.withOpacity(0.3),
                    Colors.indigo.withOpacity(0.1),
                    AppTheme.darkBackground,
                  ],
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Colors.indigo.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(25),
                    ),
                    child: const Icon(Icons.book, color: AppTheme.white, size: 28),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Diario de Lectura',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Tu colección personal de libros y experiencias',
                          style: TextStyle(
                            fontSize: 14,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.indigo.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(Icons.add, color: AppTheme.white, size: 20),
                    ),
                    onPressed: () => setState(() => _showAddBookModal = true),
                  ),
                ],
              ),
            ),

            // Content Type Selector
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _contentType = 'book'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _contentType == 'book' 
                                ? Colors.indigo.withOpacity(0.3)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.book,
                                color: _contentType == 'book' 
                                    ? AppTheme.white 
                                    : AppTheme.white,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Libros',
                                style: TextStyle(
                                  color: _contentType == 'book' 
                                      ? AppTheme.white 
                                      : AppTheme.white,
                                  fontWeight: _contentType == 'book' 
                                      ? FontWeight.bold 
                                      : FontWeight.normal,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _contentType = 'audiobook'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _contentType == 'audiobook' 
                                ? Colors.indigo.withOpacity(0.3)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.headset,
                                color: _contentType == 'audiobook' 
                                    ? AppTheme.white 
                                    : AppTheme.white,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Audiolibros',
                                style: TextStyle(
                                  color: _contentType == 'audiobook' 
                                      ? AppTheme.white 
                                      : AppTheme.white,
                                  fontWeight: _contentType == 'audiobook' 
                                      ? FontWeight.bold 
                                      : FontWeight.normal,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Stats Panel
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _contentType == 'book' 
                        ? '📊 Mis Estadísticas de Lectura' 
                        : '🎧 Mis Estadísticas de Audiolibros',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          _contentType == 'book' ? 'Libros\nLeídos' : 'Audiolibros\nEscuchados',
                          totalBooks.toString(),
                          _contentType == 'book' ? Icons.library_books : Icons.headset,
                          Colors.green,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          _contentType == 'book' ? 'Páginas\nTotales' : 'Horas\nEscuchadas',
                          _contentType == 'book' ? totalPages.toString() : '156h 30m',
                          _contentType == 'book' ? Icons.description : Icons.access_time,
                          Colors.blue,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          'Calificación\nPromedio',
                          averageRating.toStringAsFixed(1),
                          Icons.star,
                          Colors.amber,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          'Género\nFavorito',
                          favoriteGenre.isNotEmpty ? _getGenreEmoji(favoriteGenre) : '📚',
                          Icons.emoji_events,
                          Colors.orange,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Books List
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _contentType == 'book' 
                        ? 'Mi Colección de Libros' 
                        : 'Mi Colección de Audiolibros',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
            if (_books.isEmpty)
              _buildEmptyState(
                _contentType == 'book' 
                    ? 'No hay libros registrados' 
                    : 'No hay audiolibros registrados',
                Icons.book,
              )
            else
              ..._books.map((book) => Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: _buildDetailedBookCard(book),
                  )),
            const SizedBox(height: 100),
          ],
        ),

        // Add Book Modal
        if (_showAddBookModal) _buildAddBookModal(),
      ],
    );
  }

  Widget _buildReadingLog() {
    final readBooks = _books.where((b) => b.status == 'read').toList();
    final totalBooks = readBooks.length;
    final totalPages = readBooks.fold<int>(0, (sum, book) => sum + book.pages);
    final averageRating = readBooks.isNotEmpty
        ? readBooks.map((b) => b.rating).reduce((a, b) => a + b) / readBooks.length
        : 0.0;
    final monthlyGoal = 4;
    final booksThisMonth = readBooks.where((b) {
      if (b.finishDate == null) return false;
      final now = DateTime.now();
      return b.finishDate!.year == now.year && b.finishDate!.month == now.month;
    }).length;

    return Stack(
      children: [
        ListView(
          padding: EdgeInsets.zero,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Colors.blue.withOpacity(0.3),
                    Colors.blue.withOpacity(0.1),
                    AppTheme.darkBackground,
                  ],
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(25),
                    ),
                    child: const Icon(Icons.list_alt, color: AppTheme.white, size: 28),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Registro de Lectura',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Seguimiento detallado de tus lecturas',
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
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _contentType = 'book'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _contentType == 'book' 
                                ? Colors.blue.withOpacity(0.3)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.book,
                                color: _contentType == 'book' 
                                    ? AppTheme.white 
                                    : AppTheme.white,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Libros',
                                style: TextStyle(
                                  color: _contentType == 'book' 
                                      ? AppTheme.white 
                                      : AppTheme.white,
                                  fontWeight: _contentType == 'book' 
                                      ? FontWeight.bold 
                                      : FontWeight.normal,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _contentType = 'audiobook'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _contentType == 'audiobook' 
                                ? Colors.blue.withOpacity(0.3)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.headset,
                                color: _contentType == 'audiobook' 
                                    ? AppTheme.white 
                                    : AppTheme.white,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Audiolibros',
                                style: TextStyle(
                                  color: _contentType == 'audiobook' 
                                      ? AppTheme.white 
                                      : AppTheme.white,
                                  fontWeight: _contentType == 'audiobook' 
                                      ? FontWeight.bold 
                                      : FontWeight.normal,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _contentType == 'book' ? '📊 Resumen de Lectura' : '🎧 Resumen de Audiolibros',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '$booksThisMonth de $monthlyGoal ${_contentType == 'book' ? 'libros' : 'audiolibros'} este mes',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(child: _buildStatCard(
                        _contentType == 'book' ? 'Libros\nTotales' : 'Audiolibros\nTotales',
                        totalBooks.toString(),
                        _contentType == 'book' ? Icons.library_books : Icons.headset,
                        Colors.green,
                      )),
                      const SizedBox(width: 12),
                      Expanded(child: _buildStatCard(
                        _contentType == 'book' ? 'Páginas\nLeídas' : 'Horas\nEscuchadas',
                        _contentType == 'book' ? totalPages.toString() : '156h 30m',
                        _contentType == 'book' ? Icons.description : Icons.access_time,
                        Colors.blue,
                      )),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(child: _buildStatCard(
                        'Calificación\nPromedio',
                        averageRating.toStringAsFixed(1),
                        Icons.star,
                        Colors.amber,
                      )),
                      const SizedBox(width: 12),
                      Expanded(child: _buildStatCard(
                        'Días de\nRacha',
                        '12',
                        Icons.local_fire_department,
                        Colors.orange,
                      )),
                    ],
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '🎯 Objetivo Mensual',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: monthlyGoal > 0 ? (booksThisMonth / monthlyGoal).clamp(0.0, 1.0) : 0.0,
                      backgroundColor: AppTheme.darkSurfaceVariant,
                      valueColor: const AlwaysStoppedAnimation<Color>(Colors.green),
                      minHeight: 12,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '$booksThisMonth/$monthlyGoal ${_contentType == 'book' ? 'libros' : 'audiolibros'}',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.white,
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _contentType == 'book' ? 'Mis Lecturas' : 'Mis Audiolibros',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
            if (readBooks.isEmpty)
              _buildEmptyState(
                _contentType == 'book' ? 'No hay libros leídos' : 'No hay audiolibros escuchados',
                Icons.book,
              )
            else
              ...readBooks.map((book) => Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: _buildDetailedBookCard(book),
                  )),
            const SizedBox(height: 100),
          ],
        ),
      ],
    );
  }

  Widget _buildFavoriteQuotes() {
    final totalQuotes = _quotes.length;
    final totalAuthors = _quotes.map((q) => q.author).toSet().length;
    final averageRating = _quotes.isNotEmpty
        ? _quotes.map((q) => q.rating).reduce((a, b) => a + b) / _quotes.length
        : 0.0;
    final favoriteGenre = _quotes.isNotEmpty
        ? _quotes.map((q) => q.genre).fold<Map<String, int>>(
            {},
            (map, genre) {
              map[genre] = (map[genre] ?? 0) + 1;
              return map;
            },
          ).entries.reduce((a, b) => a.value > b.value ? a : b).key
        : '';

    return Stack(
      children: [
        ListView(
          padding: EdgeInsets.zero,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Colors.orange.withOpacity(0.3),
                    Colors.orange.withOpacity(0.1),
                    AppTheme.darkBackground,
                  ],
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Colors.orange.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(25),
                    ),
                    child: const Icon(Icons.format_quote, color: AppTheme.white, size: 28),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Citas Favoritas',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Las palabras que inspiran tu vida',
                          style: TextStyle(
                            fontSize: 14,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.orange.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(Icons.add, color: AppTheme.white, size: 20),
                    ),
                    onPressed: () => setState(() => _showAddQuoteModal = true),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _contentType = 'book'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _contentType == 'book' 
                                ? Colors.orange.withOpacity(0.3)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.book,
                                color: _contentType == 'book' 
                                    ? AppTheme.white 
                                    : AppTheme.white,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Libros',
                                style: TextStyle(
                                  color: _contentType == 'book' 
                                      ? AppTheme.white 
                                      : AppTheme.white,
                                  fontWeight: _contentType == 'book' 
                                      ? FontWeight.bold 
                                      : FontWeight.normal,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _contentType = 'audiobook'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _contentType == 'audiobook' 
                                ? Colors.orange.withOpacity(0.3)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.headset,
                                color: _contentType == 'audiobook' 
                                    ? AppTheme.white 
                                    : AppTheme.white,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Audiolibros',
                                style: TextStyle(
                                  color: _contentType == 'audiobook' 
                                      ? AppTheme.white 
                                      : AppTheme.white,
                                  fontWeight: _contentType == 'audiobook' 
                                      ? FontWeight.bold 
                                      : FontWeight.normal,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _contentType == 'book' ? '📚 Mi Colección de Citas' : '🎧 Mis Citas de Audiolibros',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '$totalQuotes citas de $totalAuthors autores',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(child: _buildStatCard('Citas\nTotales', totalQuotes.toString(), Icons.format_quote, Colors.green)),
                      const SizedBox(width: 12),
                      Expanded(child: _buildStatCard('Autores', totalAuthors.toString(), Icons.person, Colors.blue)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(child: _buildStatCard('Calificación\nPromedio', averageRating.toStringAsFixed(1), Icons.star, Colors.amber)),
                      const SizedBox(width: 12),
                      Expanded(child: _buildStatCard('Género\nFavorito', favoriteGenre.isNotEmpty ? _getGenreEmoji(favoriteGenre) : '📚', Icons.emoji_events, Colors.orange)),
                    ],
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Mis Citas Inspiradoras',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
            if (_quotes.isEmpty)
              _buildEmptyState('No hay citas guardadas', Icons.format_quote)
            else
              ..._quotes.map((quote) => Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: _buildDetailedQuoteCard(quote),
                  )),
            const SizedBox(height: 100),
          ],
        ),
        if (_showAddQuoteModal) _buildAddQuoteModal(),
      ],
    );
  }

  Widget _buildBookSeries() {
    final totalSeries = _series.length;
    final totalBooks = _series.fold<int>(0, (sum, series) => sum + series.books.length);
    final completedSeries = _series.where((s) => s.status == 'completed').length;
    final averageRating = _series.isNotEmpty
        ? _series.map((s) => s.overallRating).reduce((a, b) => a + b) / _series.length
        : 0.0;

    return Stack(
      children: [
        ListView(
          padding: EdgeInsets.zero,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Colors.purple.withOpacity(0.3),
                    Colors.purple.withOpacity(0.1),
                    AppTheme.darkBackground,
                  ],
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Colors.purple.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(25),
                    ),
                    child: const Icon(Icons.library_books, color: AppTheme.white, size: 28),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Sagas de Libros',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Colecciones épicas de literatura',
                          style: TextStyle(
                            fontSize: 14,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.purple.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(Icons.add, color: AppTheme.white, size: 20),
                    ),
                    onPressed: () => setState(() => _showAddSeriesModal = true),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _contentType = 'book'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _contentType == 'book' 
                                ? Colors.purple.withOpacity(0.3)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.book,
                                color: _contentType == 'book' 
                                    ? AppTheme.white 
                                    : AppTheme.white,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Libros',
                                style: TextStyle(
                                  color: _contentType == 'book' 
                                      ? AppTheme.white 
                                      : AppTheme.white,
                                  fontWeight: _contentType == 'book' 
                                      ? FontWeight.bold 
                                      : FontWeight.normal,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _contentType = 'audiobook'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _contentType == 'audiobook' 
                                ? Colors.purple.withOpacity(0.3)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.headset,
                                color: _contentType == 'audiobook' 
                                    ? AppTheme.white 
                                    : AppTheme.white,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Audiolibros',
                                style: TextStyle(
                                  color: _contentType == 'audiobook' 
                                      ? AppTheme.white 
                                      : AppTheme.white,
                                  fontWeight: _contentType == 'audiobook' 
                                      ? FontWeight.bold 
                                      : FontWeight.normal,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _contentType == 'book' ? '📚 Mi Colección de Sagas' : '🎧 Mis Sagas de Audiolibros',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '$totalSeries sagas con $totalBooks ${_contentType == 'book' ? 'libros' : 'audiolibros'}',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(child: _buildStatCard('Sagas\nTotales', totalSeries.toString(), Icons.library_books, Colors.green)),
                      const SizedBox(width: 12),
                      Expanded(child: _buildStatCard('Libros\nTotales', totalBooks.toString(), Icons.book, Colors.blue)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(child: _buildStatCard('Sagas\nCompletadas', completedSeries.toString(), Icons.check_circle, Colors.orange)),
                      const SizedBox(width: 12),
                      Expanded(child: _buildStatCard('Calificación\nPromedio', averageRating.toStringAsFixed(1), Icons.star, Colors.amber)),
                    ],
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Mis Sagas Favoritas',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
            if (_series.isEmpty)
              _buildEmptyState('No hay sagas registradas', Icons.library_books)
            else
              ..._series.map((series) => Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: _buildDetailedSeriesCard(series),
                  )),
            const SizedBox(height: 100),
          ],
        ),
        if (_showAddSeriesModal) _buildAddSeriesModal(),
      ],
    );
  }

  Widget _buildBookshelf() {
    final totalBooks = _bookshelf.length;
    final readBooks = _bookshelf.where((b) => b.status == 'read').length;
    final unreadBooks = totalBooks - readBooks;
    final averageRating = _bookshelf.isNotEmpty
        ? _bookshelf.map((b) => b.rating).reduce((a, b) => a + b) / _bookshelf.length
        : 0.0;

    return Stack(
      children: [
        ListView(
          padding: EdgeInsets.zero,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Colors.red.withOpacity(0.3),
                    Colors.red.withOpacity(0.1),
                    AppTheme.darkBackground,
                  ],
                ),
              ),
              child: Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Colors.red.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(25),
                    ),
                    child: const Icon(Icons.bookmark, color: AppTheme.white, size: 28),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Mi Estantería',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Tu biblioteca personal organizada',
                          style: TextStyle(
                            fontSize: 14,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.red.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(Icons.add, color: AppTheme.white, size: 20),
                    ),
                    onPressed: () => setState(() => _showAddBookshelfModal = true),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _contentType = 'book'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _contentType == 'book' 
                                ? Colors.red.withOpacity(0.3)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.book,
                                color: _contentType == 'book' 
                                    ? AppTheme.white 
                                    : AppTheme.white,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Libros',
                                style: TextStyle(
                                  color: _contentType == 'book' 
                                      ? AppTheme.white 
                                      : AppTheme.white,
                                  fontWeight: _contentType == 'book' 
                                      ? FontWeight.bold 
                                      : FontWeight.normal,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _contentType = 'audiobook'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: _contentType == 'audiobook' 
                                ? Colors.red.withOpacity(0.3)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.headset,
                                color: _contentType == 'audiobook' 
                                    ? AppTheme.white 
                                    : AppTheme.white,
                                size: 20,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Audiolibros',
                                style: TextStyle(
                                  color: _contentType == 'audiobook' 
                                      ? AppTheme.white 
                                      : AppTheme.white,
                                  fontWeight: _contentType == 'audiobook' 
                                      ? FontWeight.bold 
                                      : FontWeight.normal,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _contentType == 'book' ? '📚 Mi Biblioteca Personal' : '🎧 Mi Colección de Audiolibros',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '$totalBooks ${_contentType == 'book' ? 'libros' : 'audiolibros'} en tu colección',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(child: _buildStatCard('Total\n${_contentType == 'book' ? 'Libros' : 'Audiolibros'}', totalBooks.toString(), _contentType == 'book' ? Icons.book : Icons.headset, Colors.green)),
                      const SizedBox(width: 12),
                      Expanded(child: _buildStatCard(_contentType == 'book' ? 'Leídos' : 'Escuchados', readBooks.toString(), Icons.check_circle, Colors.blue)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(child: _buildStatCard(_contentType == 'book' ? 'Por Leer' : 'Por Escuchar', unreadBooks.toString(), Icons.access_time, Colors.orange)),
                      const SizedBox(width: 12),
                      Expanded(child: _buildStatCard('Calificación\nPromedio', averageRating.toStringAsFixed(1), Icons.star, Colors.amber)),
                    ],
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _contentType == 'book' ? 'Mis Libros' : 'Mis Audiolibros',
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
            if (_bookshelf.isEmpty)
              _buildEmptyState(
                _contentType == 'book' ? 'No hay libros en la estantería' : 'No hay audiolibros en la estantería',
                Icons.bookmark,
              )
            else
              ..._bookshelf.map((book) => Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: _buildDetailedBookshelfCard(book),
                  )),
            const SizedBox(height: 100),
          ],
        ),
        if (_showAddBookshelfModal) _buildAddBookshelfModal(),
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

  Widget _buildBookCard(Book book) {
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
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        book.title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${book.author} • ${book.pages} págs',
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
                    color: _getStatusColor(book.status),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getStatusLabel(book.status),
                    style: const TextStyle(
                      fontSize: 12,
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
                const Icon(Icons.star, size: 16, color: Colors.amber),
                const SizedBox(width: 4),
                Text(
                  book.rating.toStringAsFixed(1),
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(width: 16),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.darkSurfaceVariant,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    book.genre,
                    style: const TextStyle(fontSize: 12, color: AppTheme.white),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuoteCard(BookQuote quote) {
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
                const Icon(Icons.format_quote, size: 24, color: AppTheme.orangeAccent),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    quote.quote,
                    style: const TextStyle(
                      fontSize: 16,
                      fontStyle: FontStyle.italic,
                      color: AppTheme.white,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              '— ${quote.book}, ${quote.author}',
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.white,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.star, size: 16, color: Colors.amber),
                const SizedBox(width: 4),
                Text(
                  quote.rating.toStringAsFixed(1),
                  style: const TextStyle(
                    fontSize: 14,
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

  Widget _buildSeriesCard(BookSeries series) {
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
                    series.name,
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
                    color: _getStatusColor(series.status),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getStatusLabel(series.status),
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              '${series.books.length} libros • Calificación: ${series.overallRating.toStringAsFixed(1)}',
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

  Widget _buildBookshelfCard(Book book) {
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
                Icons.book,
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
                    book.title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    book.author,
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppTheme.white,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.star, size: 20, color: Colors.amber),
            const SizedBox(width: 4),
            Text(
              book.rating.toStringAsFixed(1),
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppTheme.white,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'reading':
      case 'watching':
        return Colors.blue;
      case 'read':
      case 'watched':
      case 'completed':
        return Colors.green;
      case 'want_to_read':
      case 'want_to_watch':
      case 'planning':
        return Colors.orange;
      default:
        return AppTheme.darkSurfaceVariant;
    }
  }

  String _getStatusLabel(String status) {
    switch (status) {
      case 'reading':
        return 'Leyendo';
      case 'read':
        return 'Leído';
      case 'want_to_read':
        return 'Por leer';
      case 'watching':
        return 'Viendo';
      case 'watched':
        return 'Vista';
      case 'want_to_watch':
        return 'Por ver';
      case 'completed':
        return 'Completado';
      case 'planning':
        return 'Planificando';
      default:
        return status;
    }
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 24),
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
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  String _getGenreEmoji(String genre) {
    final emojiMap = {
      'Realismo Mágico': '✨',
      'Distopía': '🌆',
      'Clásico': '👑',
      'Historia': '📜',
      'Romance': '💕',
      'Ficción': '📚',
      'No Ficción': '📖',
      'Misterio': '🔍',
      'Ciencia Ficción': '🚀',
      'Fantasía': '🧙',
      'Filosofía': '🧠',
      'Biografía': '📖',
      'Autoayuda': '💪',
      'Espiritualidad': '🕊️',
    };
    return emojiMap[genre] ?? '📚';
  }

  Color _getGenreColor(String genre) {
    final colorMap = {
      'Realismo Mágico': Colors.green,
      'Distopía': Colors.blue,
      'Clásico': Colors.orange,
      'Historia': Colors.purple,
      'Romance': Colors.pink,
      'Ficción': Colors.brown,
      'No Ficción': Colors.blueGrey,
      'Misterio': Colors.indigo,
      'Ciencia Ficción': Colors.cyan,
      'Fantasía': Colors.green,
      'Filosofía': Colors.teal,
    };
    return colorMap[genre] ?? Colors.grey;
  }

  Widget _buildDetailedBookCard(Book book) {
    final progress = book.finishDate != null ? 100.0 : 
                     (book.startDate != null ? 50.0 : 0.0);
    
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
                  width: 60,
                  height: 80,
                  decoration: BoxDecoration(
                    color: _getGenreColor(book.genre).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Center(
                    child: Text(
                      _getGenreEmoji(book.genre),
                      style: const TextStyle(fontSize: 32),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        book.title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        book.author,
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: _getGenreColor(book.genre).withOpacity(0.2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  _getGenreEmoji(book.genre),
                                  style: const TextStyle(fontSize: 12),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  book.genre,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: AppTheme.white,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getStatusColor(book.status),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getStatusLabel(book.status),
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
            Row(
              children: [
                Expanded(
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today, size: 14, color: AppTheme.white),
                      const SizedBox(width: 4),
                      Text(
                        book.startDate != null 
                            ? DateFormat('dd/MM/yyyy').format(book.startDate!)
                            : 'No iniciado',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Row(
                    children: [
                      const Icon(Icons.check_circle, size: 14, color: AppTheme.white),
                      const SizedBox(width: 4),
                      Text(
                        book.finishDate != null 
                            ? DateFormat('dd/MM/yyyy').format(book.finishDate!)
                            : 'En progreso',
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
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Row(
                    children: [
                      Icon(
                        _contentType == 'book' ? Icons.description : Icons.access_time,
                        size: 14,
                        color: AppTheme.white,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        _contentType == 'book' 
                            ? '${book.pages} páginas'
                            : '8h 30m',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Row(
                    children: [
                      const Icon(Icons.star, size: 14, color: Colors.amber),
                      const SizedBox(width: 4),
                      Text(
                        book.rating > 0 ? '${book.rating.toStringAsFixed(1)}/5' : 'Sin calificar',
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
            const SizedBox(height: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '$progress% completado',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: progress / 100,
                    backgroundColor: AppTheme.darkSurfaceVariant,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      _getStatusColor(book.status),
                    ),
                    minHeight: 8,
                  ),
                ),
              ],
            ),
            if (book.review != null && book.review!.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.darkBackground,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      '📝 Mis Notas',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      book.review!,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildAddBookModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
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
                    Text(
                      'Nuevo ${_contentType == 'book' ? 'Libro' : 'Audiolibro'}',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () => setState(() => _showAddBookModal = false),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                TextField(
                  controller: _bookTitleController,
                  style: const TextStyle(color: AppTheme.white),
                  decoration: InputDecoration(
                    labelText: 'Título',
                    labelStyle: const TextStyle(color: AppTheme.white),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppTheme.white),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppTheme.orangeAccent),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _bookAuthorController,
                  style: const TextStyle(color: AppTheme.white),
                  decoration: InputDecoration(
                    labelText: 'Autor',
                    labelStyle: const TextStyle(color: AppTheme.white),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppTheme.white),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppTheme.orangeAccent),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _bookGenreController,
                  style: const TextStyle(color: AppTheme.white),
                  decoration: InputDecoration(
                    labelText: 'Género',
                    labelStyle: const TextStyle(color: AppTheme.white),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppTheme.white),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppTheme.orangeAccent),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _bookPagesController,
                  style: const TextStyle(color: AppTheme.white),
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: _contentType == 'book' ? 'Páginas' : 'Duración (horas)',
                    labelStyle: const TextStyle(color: AppTheme.white),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppTheme.white),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppTheme.orangeAccent),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedBookStatus,
                  decoration: InputDecoration(
                    labelText: 'Estado',
                    labelStyle: const TextStyle(color: AppTheme.white),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppTheme.white),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppTheme.orangeAccent),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  dropdownColor: AppTheme.darkSurface,
                  style: const TextStyle(color: AppTheme.white),
                  items: const [
                    DropdownMenuItem(value: 'want_to_read', child: Text('Por leer')),
                    DropdownMenuItem(value: 'reading', child: Text('Leyendo')),
                    DropdownMenuItem(value: 'read', child: Text('Leído')),
                  ],
                  onChanged: (value) {
                    if (value != null) {
                      setState(() => _selectedBookStatus = value);
                    }
                  },
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedBookRating,
                  decoration: InputDecoration(
                    labelText: 'Calificación',
                    labelStyle: const TextStyle(color: AppTheme.white),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppTheme.white),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppTheme.orangeAccent),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  dropdownColor: AppTheme.darkSurface,
                  style: const TextStyle(color: AppTheme.white),
                  items: const [
                    DropdownMenuItem(value: '0', child: Text('Sin calificar')),
                    DropdownMenuItem(value: '1', child: Text('1 ⭐')),
                    DropdownMenuItem(value: '2', child: Text('2 ⭐⭐')),
                    DropdownMenuItem(value: '3', child: Text('3 ⭐⭐⭐')),
                    DropdownMenuItem(value: '4', child: Text('4 ⭐⭐⭐⭐')),
                    DropdownMenuItem(value: '5', child: Text('5 ⭐⭐⭐⭐⭐')),
                  ],
                  onChanged: (value) {
                    if (value != null) {
                      setState(() => _selectedBookRating = value);
                    }
                  },
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _bookNotesController,
                  style: const TextStyle(color: AppTheme.white),
                  maxLines: 3,
                  decoration: InputDecoration(
                    labelText: 'Notas',
                    labelStyle: const TextStyle(color: AppTheme.white),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppTheme.white),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppTheme.orangeAccent),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => setState(() => _showAddBookModal = false),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppTheme.white),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: const Text(
                          'Cancelar',
                          style: TextStyle(color: AppTheme.white),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          if (_bookTitleController.text.isNotEmpty &&
                              _bookAuthorController.text.isNotEmpty) {
                            final newBook = Book(
                              id: DateTime.now().millisecondsSinceEpoch.toString(),
                              title: _bookTitleController.text,
                              author: _bookAuthorController.text,
                              genre: _bookGenreController.text.isNotEmpty
                                  ? _bookGenreController.text
                                  : 'Ficción',
                              status: _selectedBookStatus,
                              rating: double.parse(_selectedBookRating),
                              pages: int.tryParse(_bookPagesController.text) ?? 0,
                              review: _bookNotesController.text.isNotEmpty
                                  ? _bookNotesController.text
                                  : null,
                            );
                            setState(() {
                              _books.add(newBook);
                              _bookTitleController.clear();
                              _bookAuthorController.clear();
                              _bookGenreController.clear();
                              _bookPagesController.clear();
                              _bookNotesController.clear();
                              _showAddBookModal = false;
                            });
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.orangeAccent,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: const Text(
                          'Agregar',
                          style: TextStyle(color: AppTheme.white),
                        ),
                      ),
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

  Widget _buildDetailedQuoteCard(BookQuote quote) {
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
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: _getGenreColor(quote.genre).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(25),
                  ),
                  child: Center(
                    child: Text(
                      _getGenreEmoji(quote.genre),
                      style: const TextStyle(fontSize: 24),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        quote.author,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        quote.book,
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _getGenreColor(quote.category).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          quote.category,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: _getGenreColor(quote.category),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.darkBackground,
                borderRadius: BorderRadius.circular(12),
                border: const Border(
                  left: BorderSide(
                    color: Colors.orange,
                    width: 4,
                  ),
                ),
              ),
              child: Text(
                '"${quote.quote}"',
                style: const TextStyle(
                  fontSize: 16,
                  fontStyle: FontStyle.italic,
                  color: AppTheme.white,
                  height: 1.5,
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                const Icon(Icons.star, size: 16, color: Colors.amber),
                const SizedBox(width: 4),
                Text(
                  '${quote.rating}/5',
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white,
                  ),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getGenreColor(quote.genre).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    quote.genre,
                    style: TextStyle(
                      fontSize: 12,
                      color: AppTheme.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            if (quote.notes != null && quote.notes!.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.darkBackground,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      '📝 Contexto',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      quote.notes!,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildAddQuoteModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
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
                      'Nueva Cita',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () => setState(() => _showAddQuoteModal = false),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                TextField(
                  controller: _quoteTextController,
                  style: const TextStyle(color: AppTheme.white),
                  maxLines: 3,
                  decoration: InputDecoration(
                    labelText: 'Cita',
                    labelStyle: const TextStyle(color: AppTheme.white),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppTheme.white),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppTheme.orangeAccent),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _quoteBookController,
                  style: const TextStyle(color: AppTheme.white),
                  decoration: InputDecoration(
                    labelText: 'Libro',
                    labelStyle: const TextStyle(color: AppTheme.white),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppTheme.white),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppTheme.orangeAccent),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _quoteAuthorController,
                  style: const TextStyle(color: AppTheme.white),
                  decoration: InputDecoration(
                    labelText: 'Autor',
                    labelStyle: const TextStyle(color: AppTheme.white),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppTheme.white),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppTheme.orangeAccent),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedQuoteCategory,
                  decoration: InputDecoration(
                    labelText: 'Categoría',
                    labelStyle: const TextStyle(color: AppTheme.white),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppTheme.white),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppTheme.orangeAccent),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  dropdownColor: AppTheme.darkSurface,
                  style: const TextStyle(color: AppTheme.white),
                  items: const [
                    DropdownMenuItem(value: 'Vida', child: Text('Vida')),
                    DropdownMenuItem(value: 'Valor', child: Text('Valor')),
                    DropdownMenuItem(value: 'Trabajo', child: Text('Trabajo')),
                    DropdownMenuItem(value: 'Ciencia', child: Text('Ciencia')),
                    DropdownMenuItem(value: 'Éxito', child: Text('Éxito')),
                    DropdownMenuItem(value: 'Felicidad', child: Text('Felicidad')),
                    DropdownMenuItem(value: 'Educación', child: Text('Educación')),
                  ],
                  onChanged: (value) {
                    if (value != null) {
                      setState(() => _selectedQuoteCategory = value);
                    }
                  },
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: _selectedQuoteRating,
                  decoration: InputDecoration(
                    labelText: 'Calificación',
                    labelStyle: const TextStyle(color: AppTheme.white),
                    enabledBorder: OutlineInputBorder(
                      borderSide: BorderSide(color: AppTheme.white),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: AppTheme.orangeAccent),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  dropdownColor: AppTheme.darkSurface,
                  style: const TextStyle(color: AppTheme.white),
                  items: const [
                    DropdownMenuItem(value: '0', child: Text('Sin calificar')),
                    DropdownMenuItem(value: '1', child: Text('1 ⭐')),
                    DropdownMenuItem(value: '2', child: Text('2 ⭐⭐')),
                    DropdownMenuItem(value: '3', child: Text('3 ⭐⭐⭐')),
                    DropdownMenuItem(value: '4', child: Text('4 ⭐⭐⭐⭐')),
                    DropdownMenuItem(value: '5', child: Text('5 ⭐⭐⭐⭐⭐')),
                  ],
                  onChanged: (value) {
                    if (value != null) {
                      setState(() => _selectedQuoteRating = value);
                    }
                  },
                ),
                const SizedBox(height: 24),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () => setState(() => _showAddQuoteModal = false),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppTheme.white),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: const Text(
                          'Cancelar',
                          style: TextStyle(color: AppTheme.white),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          if (_quoteTextController.text.isNotEmpty &&
                              _quoteBookController.text.isNotEmpty &&
                              _quoteAuthorController.text.isNotEmpty) {
                            final newQuote = BookQuote(
                              id: DateTime.now().millisecondsSinceEpoch.toString(),
                              quote: _quoteTextController.text,
                              book: _quoteBookController.text,
                              author: _quoteAuthorController.text,
                              category: _selectedQuoteCategory,
                              genre: _selectedQuoteGenre,
                              rating: double.parse(_selectedQuoteRating),
                              notes: _quoteChapterController.text.isNotEmpty
                                  ? _quoteChapterController.text
                                  : null,
                            );
                            setState(() {
                              _quotes.add(newQuote);
                              _quoteTextController.clear();
                              _quoteBookController.clear();
                              _quoteAuthorController.clear();
                              _quoteChapterController.clear();
                              _showAddQuoteModal = false;
                            });
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.orangeAccent,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: const Text(
                          'Agregar',
                          style: TextStyle(color: AppTheme.white),
                        ),
                      ),
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

  Widget _buildDetailedSeriesCard(BookSeries series) {
    final booksRead = series.books.where((b) => b.status == 'read').length;
    final progress = series.books.isNotEmpty 
        ? (booksRead / series.books.length * 100).clamp(0.0, 100.0)
        : 0.0;

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
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: _getGenreColor(series.genre).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(25),
                  ),
                  child: Center(
                    child: Text(
                      _getGenreEmoji(series.genre),
                      style: const TextStyle(fontSize: 24),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        series.name,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        series.genre,
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
                    color: _getStatusColor(series.status),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getStatusLabel(series.status),
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
            Row(
              children: [
                Expanded(
                  child: Row(
                    children: [
                      const Icon(Icons.book, size: 14, color: AppTheme.white),
                      const SizedBox(width: 4),
                      Text(
                        'Libros: $booksRead/${series.books.length}',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Row(
                    children: [
                      const Icon(Icons.star, size: 14, color: Colors.amber),
                      const SizedBox(width: 4),
                      Text(
                        series.overallRating > 0 
                            ? '${series.overallRating.toStringAsFixed(1)}/5'
                            : 'Sin calificar',
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
            const SizedBox(height: 16),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '$progress% completado',
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: progress / 100,
                    backgroundColor: AppTheme.darkSurfaceVariant,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      _getStatusColor(series.status),
                    ),
                    minHeight: 8,
                  ),
                ),
              ],
            ),
            if (series.notes != null && series.notes!.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.darkBackground,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      '📖 Resumen',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      series.notes!,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 16),
            const Text(
              'Libros de la Saga',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppTheme.white,
              ),
            ),
            const SizedBox(height: 12),
            ...series.books.asMap().entries.map((entry) {
              final index = entry.key;
              final book = entry.value;
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.darkBackground,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Text(
                      '${index + 1}.',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        book.title,
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
                        ),
                      ),
                    ),
                    Text(
                      '${book.pages} páginas',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: _getStatusColor(book.status),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        _getStatusLabel(book.status),
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
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
    );
  }

  Widget _buildDetailedBookshelfCard(Book book) {
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
                  width: 60,
                  height: 80,
                  decoration: BoxDecoration(
                    color: _getGenreColor(book.genre).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Center(
                    child: Text(
                      _getGenreEmoji(book.genre),
                      style: const TextStyle(fontSize: 32),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        book.title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        book.author,
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _getGenreColor(book.genre).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          book.genre,
                          style: TextStyle(
                            fontSize: 12,
                            color: AppTheme.white,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getStatusColor(book.status),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getStatusLabel(book.status),
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
            Row(
              children: [
                Expanded(
                  child: Row(
                    children: [
                      Icon(
                        _contentType == 'book' ? Icons.description : Icons.access_time,
                        size: 14,
                        color: AppTheme.white,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        _contentType == 'book' 
                            ? '${book.pages} páginas'
                            : '8h 30m',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Row(
                    children: [
                      const Icon(Icons.star, size: 14, color: Colors.amber),
                      const SizedBox(width: 4),
                      Text(
                        book.rating > 0 ? '${book.rating.toStringAsFixed(1)}/5' : 'Sin calificar',
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
            if (book.review != null && book.review!.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.darkBackground,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      '📝 Notas',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      book.review!,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildAddSeriesModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: AppTheme.darkSurface,
            borderRadius: BorderRadius.circular(20),
          ),
          child: const Center(
            child: Text(
              'Modal para agregar sagas - En desarrollo',
              style: TextStyle(color: AppTheme.white),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildAddBookshelfModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
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
                      'Agregar a Estantería',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () => setState(() => _showAddBookshelfModal = false),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                if (_books.isEmpty)
                  const Text(
                    'No hay libros disponibles',
                    style: TextStyle(color: AppTheme.white),
                  )
                else
                  ..._books.map((book) {
                    final isInShelf = _bookshelf.any((b) => b.id == book.id);
                    return ListTile(
                      title: Text(book.title, style: const TextStyle(color: AppTheme.white)),
                      subtitle: Text(
                        '${book.author} • ${book.genre}',
                        style: const TextStyle(color: AppTheme.white),
                      ),
                      trailing: isInShelf
                          ? const Icon(Icons.check, color: Colors.green)
                          : const Icon(Icons.add, color: AppTheme.white),
                      onTap: () {
                        if (!isInShelf) {
                          setState(() {
                            _bookshelf.add(book);
                            _showAddBookshelfModal = false;
                          });
                        }
                      },
                    );
                  }),
                const SizedBox(height: 24),
                OutlinedButton(
                  onPressed: () => setState(() => _showAddBookshelfModal = false),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppTheme.white),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text(
                    'Cerrar',
                    style: TextStyle(color: AppTheme.white),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

