import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../models/movie/movie.dart';
import '../../models/movie/movie_quote.dart';
import '../../models/movie/movie_series.dart';
import '../../theme/app_theme.dart';
import '../../widgets/common/navigation_header.dart';
import '../../auth/providers/auth_provider.dart';

class MoviesSections extends StatefulWidget {
  const MoviesSections({super.key});

  @override
  State<MoviesSections> createState() => _MoviesSectionsState();
}

class _MoviesSectionsState extends State<MoviesSections> {
  String _activeSection = 'movies-journal';
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  
  List<Movie> _movies = [];
  List<MovieQuote> _quotes = [];
  List<MovieSeries> _series = [];
  List<Movie> _movieshelf = [];
  
  // Modal states
  bool _showAddMovieModal = false;
  bool _showAddQuoteModal = false;
  bool _showAddSeriesModal = false;
  bool _showAddMovieshelfModal = false;
  
  // Controllers for modals
  final TextEditingController _movieTitleController = TextEditingController();
  final TextEditingController _movieDirectorController = TextEditingController();
  final TextEditingController _movieYearController = TextEditingController();
  final TextEditingController _movieGenreController = TextEditingController();
  final TextEditingController _movieNotesController = TextEditingController();
  final TextEditingController _movieWatchDateController = TextEditingController();
  
  final TextEditingController _quoteTextController = TextEditingController();
  final TextEditingController _quoteMovieController = TextEditingController();
  final TextEditingController _quoteCharacterController = TextEditingController();
  final TextEditingController _quoteContextController = TextEditingController();
  
  String _selectedMovieStatus = 'want_to_watch';
  String _selectedMovieRating = '0';
  String _selectedQuoteRating = '0';
  String _selectedQuoteCategory = 'Inspiracional';
  String _selectedQuoteGenre = 'Drama';
  String _selectedQuoteMood = 'Motivador';

  final sections = [
    {'id': 'movies-journal', 'name': 'Diario de Películas', 'icon': Icons.movie_outlined},
    {'id': 'movies-log', 'name': 'Registro de Películas', 'icon': Icons.list_alt},
    {'id': 'favorite-quotes', 'name': 'Citas Favoritas', 'icon': Icons.format_quote},
    {'id': 'movie-series', 'name': 'Sagas Cinematográficas', 'icon': Icons.local_movies},
    {'id': 'movieshelf', 'name': 'Estantería', 'icon': Icons.bookmark_border},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppTheme.darkBackground,
      drawer: _buildNavigationDrawer(context),
      appBar: NavigationHeader(currentSection: 'movies'),
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
                  Colors.deepPurple.withOpacity(0.4),
                  Colors.deepPurple.withOpacity(0.2),
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
                      colors: [Colors.deepPurple, Colors.deepPurple.withOpacity(0.7)],
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
            isActive: true,
            onTap: () {
              Navigator.pop(context);
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
      case 'movies-journal':
        return _buildMoviesJournal();
      case 'movies-log':
        return _buildMoviesLog();
      case 'favorite-quotes':
        return _buildFavoriteQuotes();
      case 'movie-series':
        return _buildMovieSeries();
      case 'movieshelf':
        return _buildMovieshelf();
      default:
        return _buildMoviesJournal();
    }
  }

  Widget _buildMoviesJournal() {
    final totalMovies = _movies.length;
    final watchedMovies = _movies.where((m) => m.status == 'watched').length;
    final averageRating = _movies.isNotEmpty
        ? _movies.map((m) => m.rating).reduce((a, b) => a + b) / _movies.length
        : 0.0;
    final favoriteGenre = _movies.isNotEmpty
        ? _movies.map((m) => m.genre).fold<Map<String, int>>(
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
                    Colors.deepPurple.withOpacity(0.3),
                    Colors.deepPurple.withOpacity(0.1),
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
                      color: Colors.deepPurple.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(25),
                    ),
                    child: const Icon(Icons.movie, color: AppTheme.white, size: 28),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Mi Diario de Películas',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Tu colección personal de experiencias cinematográficas',
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
                        color: Colors.deepPurple.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(Icons.add, color: AppTheme.white, size: 20),
                    ),
                    onPressed: () => setState(() => _showAddMovieModal = true),
                  ),
                ],
              ),
            ),

            // Stats Panel
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '📊 Mis Estadísticas Cinematográficas',
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
                        child: _buildStatCard(
                          'Películas\nRegistradas',
                          totalMovies.toString(),
                          Icons.movie_outlined,
                          Colors.green,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          'Vistas',
                          watchedMovies.toString(),
                          Icons.check_circle_outline,
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
                          favoriteGenre.isNotEmpty ? _getGenreEmoji(favoriteGenre) : '🎬',
                          Icons.emoji_events,
                          Colors.orange,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Movies List
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Mis Películas',
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
            if (_movies.isEmpty)
              _buildEmptyState('No hay películas registradas', Icons.movie)
            else
              ..._movies.map((movie) => Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: _buildDetailedMovieCard(movie),
                  )),
            const SizedBox(height: 100),
          ],
        ),

        // Add Movie Modal
        if (_showAddMovieModal) _buildAddMovieModal(),
      ],
    );
  }

  Widget _buildMoviesLog() {
    final totalMovies = _movies.length;
    final watchedThisMonth = _movies.where((m) {
      if (m.watchedDate == null) return false;
      final now = DateTime.now();
      return m.watchedDate!.year == now.year && m.watchedDate!.month == now.month;
    }).length;
    final averageRating = _movies.isNotEmpty
        ? _movies.map((m) => m.rating).reduce((a, b) => a + b) / _movies.length
        : 0.0;
    final watchedMovies = _movies.where((m) => m.status == 'watched').toList();

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
                    Colors.deepPurple.withOpacity(0.3),
                    Colors.deepPurple.withOpacity(0.1),
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
                      color: Colors.deepPurple.withOpacity(0.3),
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
                          'Mi Registro de Películas',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Seguimiento detallado de tu experiencia cinematográfica',
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
                        color: Colors.deepPurple.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(Icons.add, color: AppTheme.white, size: 20),
                    ),
                    onPressed: () => setState(() => _showAddMovieModal = true),
                  ),
                ],
              ),
            ),

            // Stats Panel
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '📊 Resumen de Mi Registro',
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
                        child: _buildStatCard(
                          'Películas\nRegistradas',
                          totalMovies.toString(),
                          Icons.movie_outlined,
                          Colors.green,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          'Este Mes',
                          watchedThisMonth.toString(),
                          Icons.calendar_today,
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
                          'Vistas',
                          watchedMovies.length.toString(),
                          Icons.check_circle_outline,
                          Colors.orange,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Movies List
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Mis Películas Registradas',
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
            if (watchedMovies.isEmpty)
              _buildEmptyState('No hay películas registradas', Icons.list_alt)
            else
              ...watchedMovies.map((movie) => Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: _buildDetailedMovieCard(movie),
                  )),
            const SizedBox(height: 100),
          ],
        ),

        if (_showAddMovieModal) _buildAddMovieModal(),
      ],
    );
  }

  Widget _buildFavoriteQuotes() {
    final totalQuotes = _quotes.length;
    final totalMovies = _quotes.map((q) => q.movie).toSet().length;
    final totalCharacters = _quotes.map((q) => q.character).toSet().length;
    final averageRating = _quotes.isNotEmpty
        ? _quotes.map((q) => q.rating).reduce((a, b) => a + b) / _quotes.length
        : 0.0;

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
                    Colors.deepPurple.withOpacity(0.3),
                    Colors.deepPurple.withOpacity(0.1),
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
                      color: Colors.deepPurple.withOpacity(0.3),
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
                          'Mis Citas Favoritas',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Las frases más memorables del cine que me inspiran',
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
                        color: Colors.deepPurple.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(Icons.add, color: AppTheme.white, size: 20),
                    ),
                    onPressed: () => setState(() => _showAddQuoteModal = true),
                  ),
                ],
              ),
            ),

            // Stats Panel
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '📚 Mi Colección de Citas',
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
                        child: _buildStatCard(
                          'Citas\nGuardadas',
                          totalQuotes.toString(),
                          Icons.format_quote,
                          Colors.green,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          'Películas',
                          totalMovies.toString(),
                          Icons.movie_outlined,
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
                          'Personajes',
                          totalCharacters.toString(),
                          Icons.people_outline,
                          Colors.amber,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          'Calificación\nPromedio',
                          averageRating.toStringAsFixed(1),
                          Icons.star,
                          Colors.orange,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Quotes List
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Mis Citas Favoritas',
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

  Widget _buildMovieSeries() {
    final totalSeries = _series.length;
    final totalMovies = _series.fold<int>(0, (sum, s) => sum + s.movies.length);
    final completedSeries = _series.where((s) => s.status == 'completed').length;
    final averageRating = _series.isNotEmpty
        ? _series.map((s) => s.overallRating).reduce((a, b) => a + b) / _series.length
        : 0.0;

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
                    Colors.deepPurple.withOpacity(0.3),
                    Colors.deepPurple.withOpacity(0.1),
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
                      color: Colors.deepPurple.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(25),
                    ),
                    child: const Icon(Icons.local_movies, color: AppTheme.white, size: 28),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Mis Sagas de Películas',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Colección de sagas cinematográficas que me han marcado',
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
                        color: Colors.deepPurple.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(Icons.add, color: AppTheme.white, size: 20),
                    ),
                    onPressed: () => setState(() => _showAddSeriesModal = true),
                  ),
                ],
              ),
            ),

            // Stats Panel
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '🎬 Mi Colección de Sagas',
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
                        child: _buildStatCard(
                          'Sagas\nTotales',
                          totalSeries.toString(),
                          Icons.local_movies,
                          Colors.green,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          'Películas',
                          totalMovies.toString(),
                          Icons.movie_outlined,
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
                          'Completadas',
                          completedSeries.toString(),
                          Icons.check_circle_outline,
                          Colors.amber,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          'Calificación\nPromedio',
                          averageRating.toStringAsFixed(1),
                          Icons.star,
                          Colors.orange,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Series List
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Mis Sagas de Películas',
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
              _buildEmptyState('No hay sagas registradas', Icons.local_movies)
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

  Widget _buildMovieshelf() {
    final totalMovies = _movieshelf.length;
    final watchedMovies = _movieshelf.where((m) => m.status == 'watched').length;
    final unwatchedMovies = totalMovies - watchedMovies;
    final averageRating = _movieshelf.isNotEmpty
        ? _movieshelf.map((m) => m.rating).reduce((a, b) => a + b) / _movieshelf.length
        : 0.0;

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
                    Colors.deepPurple.withOpacity(0.3),
                    Colors.deepPurple.withOpacity(0.1),
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
                      color: Colors.deepPurple.withOpacity(0.3),
                      borderRadius: BorderRadius.circular(25),
                    ),
                    child: const Icon(Icons.bookmark_border, color: AppTheme.white, size: 28),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Mi Estantería de Películas',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Mi colección personal de películas favoritas',
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
                        color: Colors.deepPurple.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(Icons.add, color: AppTheme.white, size: 20),
                    ),
                    onPressed: () => setState(() => _showAddMovieshelfModal = true),
                  ),
                ],
              ),
            ),

            // Stats Panel
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    '🎬 Mi Biblioteca Personal',
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
                        child: _buildStatCard(
                          'Total\nPelículas',
                          totalMovies.toString(),
                          Icons.movie_outlined,
                          Colors.green,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          'Vistas',
                          watchedMovies.toString(),
                          Icons.check_circle_outline,
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
                          'Por Ver',
                          unwatchedMovies.toString(),
                          Icons.schedule,
                          Colors.amber,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _buildStatCard(
                          'Calificación\nPromedio',
                          averageRating.toStringAsFixed(1),
                          Icons.star,
                          Colors.orange,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Movieshelf List
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Mis Películas',
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
            if (_movieshelf.isEmpty)
              _buildEmptyState('No hay películas en la estantería', Icons.bookmark)
            else
              ..._movieshelf.map((movie) => Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: _buildDetailedMovieshelfCard(movie),
                  )),
            const SizedBox(height: 100),
          ],
        ),

        if (_showAddMovieshelfModal) _buildAddMovieshelfModal(),
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

  Widget _buildMovieCard(Movie movie) {
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
                        movie.title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${movie.director} • ${movie.year}',
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
                    color: _getStatusColor(movie.status),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getStatusLabel(movie.status),
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
                  movie.rating.toStringAsFixed(1),
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
                    movie.genre,
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

  Widget _buildQuoteCard(MovieQuote quote) {
    return _buildDetailedQuoteCard(quote);
  }

  Widget _buildDetailedQuoteCard(MovieQuote quote) {
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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 60,
                  height: 80,
                  decoration: BoxDecoration(
                    color: AppTheme.darkSurfaceVariant,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Center(
                    child: Text(
                      _getGenreEmoji(quote.genre),
                      style: const TextStyle(fontSize: 30),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        quote.movie,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        quote.character,
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 8),
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
                            color: _getGenreColor(quote.genre),
                            fontWeight: FontWeight.w600,
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
                color: AppTheme.darkSurfaceVariant,
                borderRadius: BorderRadius.circular(12),
                border: Border(
                  left: BorderSide(color: Colors.deepPurple, width: 4),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.format_quote, size: 24, color: Colors.deepPurple),
                      const SizedBox(width: 8),
                      Expanded(
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
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                const Icon(Icons.star, size: 16, color: Colors.amber),
                const SizedBox(width: 4),
                Text(
                  '${quote.rating.toStringAsFixed(1)}/5',
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
                    color: Colors.deepPurple.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    quote.category,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.deepPurple,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            if (quote.notes != null && quote.notes!.isNotEmpty) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurfaceVariant,
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
                    const SizedBox(height: 4),
                    Text(
                      quote.notes!,
                      style: const TextStyle(
                        fontSize: 14,
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
                  border: Border(
                    bottom: BorderSide(color: AppTheme.white.withOpacity(0.2)),
                  ),
                ),
                child: Row(
                  children: [
                    const Text(
                      'Nueva Cita',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () => setState(() => _showAddQuoteModal = false),
                    ),
                  ],
                ),
              ),
              // Form
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      TextField(
                        controller: _quoteTextController,
                        decoration: InputDecoration(
                          labelText: 'Cita',
                          labelStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                        maxLines: 3,
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _quoteMovieController,
                        decoration: InputDecoration(
                          labelText: 'Película',
                          labelStyle: const TextStyle(color: AppTheme.white),
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
                        controller: _quoteCharacterController,
                        decoration: InputDecoration(
                          labelText: 'Personaje',
                          labelStyle: const TextStyle(color: AppTheme.white),
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
                      Row(
                        children: [
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              value: _selectedQuoteCategory,
                              decoration: InputDecoration(
                                labelText: 'Categoría',
                                labelStyle: const TextStyle(color: AppTheme.white),
                                filled: true,
                                fillColor: AppTheme.darkSurfaceVariant,
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide.none,
                                ),
                              ),
                              dropdownColor: AppTheme.darkSurface,
                              style: const TextStyle(color: AppTheme.white),
                              items: ['Inspiracional', 'Legendario', 'Acción', 'Filosófico', 'Dramático', 'Romántico']
                                  .map((cat) => DropdownMenuItem(
                                        value: cat,
                                        child: Text(cat),
                                      ))
                                  .toList(),
                              onChanged: (value) {
                                if (value != null) {
                                  setState(() => _selectedQuoteCategory = value);
                                }
                              },
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: DropdownButtonFormField<String>(
                              value: _selectedQuoteGenre,
                              decoration: InputDecoration(
                                labelText: 'Género',
                                labelStyle: const TextStyle(color: AppTheme.white),
                                filled: true,
                                fillColor: AppTheme.darkSurfaceVariant,
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide.none,
                                ),
                              ),
                              dropdownColor: AppTheme.darkSurface,
                              style: const TextStyle(color: AppTheme.white),
                              items: ['Drama', 'Ciencia Ficción', 'Acción', 'Comedia', 'Romance', 'Thriller']
                                  .map((genre) => DropdownMenuItem(
                                        value: genre,
                                        child: Text(genre),
                                      ))
                                  .toList(),
                              onChanged: (value) {
                                if (value != null) {
                                  setState(() => _selectedQuoteGenre = value);
                                }
                              },
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _quoteContextController,
                        decoration: InputDecoration(
                          labelText: 'Contexto',
                          labelStyle: const TextStyle(color: AppTheme.white),
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
                        onPressed: () => setState(() => _showAddQuoteModal = false),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppTheme.white),
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
                          if (_quoteTextController.text.isNotEmpty &&
                              _quoteMovieController.text.isNotEmpty) {
                            final quote = MovieQuote(
                              id: DateTime.now().millisecondsSinceEpoch.toString(),
                              quote: _quoteTextController.text,
                              movie: _quoteMovieController.text,
                              character: _quoteCharacterController.text,
                              category: _selectedQuoteCategory,
                              genre: _selectedQuoteGenre,
                              mood: _selectedQuoteMood,
                              rating: double.tryParse(_selectedQuoteRating) ?? 0.0,
                              notes: _quoteContextController.text.isNotEmpty
                                  ? _quoteContextController.text
                                  : null,
                            );
                            setState(() {
                              _quotes.add(quote);
                              _showAddQuoteModal = false;
                              _quoteTextController.clear();
                              _quoteMovieController.clear();
                              _quoteCharacterController.clear();
                              _quoteContextController.clear();
                            });
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.deepPurple,
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
    );
  }

  Widget _buildSeriesCard(MovieSeries series) {
    return _buildDetailedSeriesCard(series);
  }

  Widget _buildDetailedSeriesCard(MovieSeries series) {
    final watchedMovies = series.movies.where((m) => m.status == 'watched').length;
    final progress = series.movies.isNotEmpty ? (watchedMovies / series.movies.length) * 100 : 0.0;

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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 60,
                  height: 80,
                  decoration: BoxDecoration(
                    color: AppTheme.darkSurfaceVariant,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Center(
                    child: Text(
                      _getGenreEmoji(series.genre),
                      style: const TextStyle(fontSize: 30),
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
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _getGenreColor(series.genre).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          series.genre,
                          style: TextStyle(
                            fontSize: 12,
                            color: _getGenreColor(series.genre),
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
                const Icon(Icons.movie_outlined, size: 16, color: AppTheme.white),
                const SizedBox(width: 4),
                Text(
                  '$watchedMovies/${series.movies.length} películas',
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(width: 16),
                const Icon(Icons.star, size: 16, color: Colors.amber),
                const SizedBox(width: 4),
                Text(
                  '${series.overallRating.toStringAsFixed(1)}/5',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.white,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: progress / 100,
                backgroundColor: AppTheme.darkSurfaceVariant,
                valueColor: AlwaysStoppedAnimation<Color>(_getStatusColor(series.status)),
                minHeight: 6,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '${progress.toStringAsFixed(0)}% completado',
              style: const TextStyle(
                fontSize: 12,
                color: AppTheme.white,
              ),
            ),
            if (series.notes != null && series.notes!.isNotEmpty) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurfaceVariant,
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
                    const SizedBox(height: 4),
                    Text(
                      series.notes!,
                      style: const TextStyle(
                        fontSize: 14,
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
          decoration: BoxDecoration(
            color: AppTheme.darkSurface,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  border: Border(
                    bottom: BorderSide(color: AppTheme.white.withOpacity(0.2)),
                  ),
                ),
                child: Row(
                  children: [
                    const Text(
                      'Nueva Saga',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () => setState(() => _showAddSeriesModal = false),
                    ),
                  ],
                ),
              ),
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: const Text(
                    'Funcionalidad de agregar sagas próximamente',
                    style: TextStyle(color: AppTheme.white),
                  ),
                ),
              ),
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
                        onPressed: () => setState(() => _showAddSeriesModal = false),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppTheme.white),
                          foregroundColor: AppTheme.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text('Cerrar'),
                      ),
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

  Widget _buildMovieshelfCard(Movie movie) {
    return _buildDetailedMovieshelfCard(movie);
  }

  Widget _buildDetailedMovieshelfCard(Movie movie) {
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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 60,
                  height: 80,
                  decoration: BoxDecoration(
                    color: AppTheme.darkSurfaceVariant,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Center(
                    child: Text(
                      _getGenreEmoji(movie.genre),
                      style: const TextStyle(fontSize: 30),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        movie.title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        movie.director,
                        style: const TextStyle(
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
                              color: _getGenreColor(movie.genre).withOpacity(0.2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  _getGenreEmoji(movie.genre),
                                  style: const TextStyle(fontSize: 12),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  movie.genre,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: _getGenreColor(movie.genre),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '${movie.year}',
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
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getStatusColor(movie.status),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getStatusLabel(movie.status),
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
                const Icon(Icons.star, size: 16, color: Colors.amber),
                const SizedBox(width: 4),
                Text(
                  movie.rating > 0 ? '${movie.rating.toStringAsFixed(1)}/5' : 'Sin calificar',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.white,
                  ),
                ),
              ],
            ),
            if (movie.review != null && movie.review!.isNotEmpty) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurfaceVariant,
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
                    const SizedBox(height: 4),
                    Text(
                      movie.review!,
                      style: const TextStyle(
                        fontSize: 14,
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

  Widget _buildAddMovieshelfModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.darkSurface,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  border: Border(
                    bottom: BorderSide(color: AppTheme.white.withOpacity(0.2)),
                  ),
                ),
                child: Row(
                  children: [
                    const Text(
                      'Agregar a Estantería',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () => setState(() => _showAddMovieshelfModal = false),
                    ),
                  ],
                ),
              ),
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      const Text(
                        'Selecciona una película de tu colección para agregar a la estantería',
                        style: TextStyle(color: AppTheme.white),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      if (_movies.isEmpty)
                        const Text(
                          'No hay películas disponibles',
                          style: TextStyle(color: AppTheme.white),
                        )
                      else
                        ..._movies.map((movie) {
                          final isInShelf = _movieshelf.any((m) => m.id == movie.id);
                          return ListTile(
                            title: Text(movie.title, style: const TextStyle(color: AppTheme.white)),
                            subtitle: Text(
                              '${movie.director} • ${movie.year}',
                              style: const TextStyle(color: AppTheme.white),
                            ),
                            trailing: isInShelf
                                ? const Icon(Icons.check, color: Colors.green)
                                : const Icon(Icons.add, color: AppTheme.white),
                            onTap: () {
                              if (!isInShelf) {
                                setState(() {
                                  _movieshelf.add(movie);
                                  _showAddMovieshelfModal = false;
                                });
                              }
                            },
                          );
                        }),
                    ],
                  ),
                ),
              ),
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
                        onPressed: () => setState(() => _showAddMovieshelfModal = false),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppTheme.white),
                          foregroundColor: AppTheme.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text('Cerrar'),
                      ),
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

  Color _getStatusColor(String status) {
    switch (status) {
      case 'watched':
        return Colors.green;
      case 'watching':
        return Colors.blue;
      case 'want_to_watch':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  String _getStatusLabel(String status) {
    switch (status) {
      case 'watched':
        return 'Vista';
      case 'watching':
        return 'Viendo';
      case 'want_to_watch':
        return 'Por ver';
      case 'completed':
        return 'Completada';
      case 'planning':
        return 'Pendiente';
      default:
        return status;
    }
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
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

  Widget _buildStarRating(double rating, {double size = 16}) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (index) {
        return Icon(
          index < rating.round() ? Icons.star : Icons.star_border,
          color: Colors.amber,
          size: size,
        );
      }),
    );
  }

  String _getGenreEmoji(String genre) {
    final emojiMap = {
      'Drama': '🎭',
      'Ciencia Ficción': '🚀',
      'Thriller': '🔪',
      'Comedia': '😂',
      'Acción': '💥',
      'Romance': '💕',
      'Terror': '👻',
      'Aventura': '⚔️',
      'Crimen': '🔫',
      'Fantasía': '🧙‍♂️',
    };
    return emojiMap[genre] ?? '🎬';
  }

  Color _getGenreColor(String genre) {
    final colorMap = {
      'Drama': Colors.green,
      'Ciencia Ficción': Colors.blue,
      'Thriller': Colors.purple,
      'Comedia': Colors.amber,
      'Acción': Colors.red,
      'Romance': Colors.pink,
      'Terror': Colors.brown,
      'Aventura': Colors.orange,
      'Crimen': Colors.deepPurple,
      'Fantasía': Colors.purpleAccent,
    };
    return colorMap[genre] ?? Colors.grey;
  }

  Widget _buildDetailedMovieCard(Movie movie) {
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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 60,
                  height: 80,
                  decoration: BoxDecoration(
                    color: AppTheme.darkSurfaceVariant,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Center(
                    child: Text(
                      _getGenreEmoji(movie.genre),
                      style: const TextStyle(fontSize: 30),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        movie.title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        movie.director,
                        style: const TextStyle(
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
                              color: _getGenreColor(movie.genre).withOpacity(0.2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  _getGenreEmoji(movie.genre),
                                  style: const TextStyle(fontSize: 12),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  movie.genre,
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: _getGenreColor(movie.genre),
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
                    color: _getStatusColor(movie.status),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getStatusLabel(movie.status),
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
                const Icon(Icons.star, size: 16, color: Colors.amber),
                const SizedBox(width: 4),
                Text(
                  movie.rating > 0 ? '${movie.rating.toStringAsFixed(1)}/5' : 'Sin calificar',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.white,
                  ),
                ),
                if (movie.watchedDate != null) ...[
                  const SizedBox(width: 16),
                  const Icon(Icons.calendar_today, size: 14, color: AppTheme.white),
                  const SizedBox(width: 4),
                  Text(
                    DateFormat('dd/MM/yyyy').format(movie.watchedDate!),
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.white,
                    ),
                  ),
                ],
              ],
            ),
            if (movie.review != null && movie.review!.isNotEmpty) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurfaceVariant,
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
                    const SizedBox(height: 4),
                    Text(
                      movie.review!,
                      style: const TextStyle(
                        fontSize: 14,
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

  Widget _buildAddMovieModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Container(
          margin: const EdgeInsets.all(20),
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
                  border: Border(
                    bottom: BorderSide(color: AppTheme.white.withOpacity(0.2)),
                  ),
                ),
                child: Row(
                  children: [
                    const Text(
                      'Nueva Película',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppTheme.white),
                      onPressed: () => setState(() => _showAddMovieModal = false),
                    ),
                  ],
                ),
              ),
              // Form
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      TextField(
                        controller: _movieTitleController,
                        decoration: InputDecoration(
                          labelText: 'Título',
                          labelStyle: const TextStyle(color: AppTheme.white),
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
                        controller: _movieDirectorController,
                        decoration: InputDecoration(
                          labelText: 'Director',
                          labelStyle: const TextStyle(color: AppTheme.white),
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
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _movieYearController,
                              decoration: InputDecoration(
                                labelText: 'Año',
                                labelStyle: const TextStyle(color: AppTheme.white),
                                filled: true,
                                fillColor: AppTheme.darkSurfaceVariant,
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide.none,
                                ),
                              ),
                              style: const TextStyle(color: AppTheme.white),
                              keyboardType: TextInputType.number,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: TextField(
                              controller: _movieGenreController,
                              decoration: InputDecoration(
                                labelText: 'Género',
                                labelStyle: const TextStyle(color: AppTheme.white),
                                filled: true,
                                fillColor: AppTheme.darkSurfaceVariant,
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide.none,
                                ),
                              ),
                              style: const TextStyle(color: AppTheme.white),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        value: _selectedMovieStatus,
                        decoration: InputDecoration(
                          labelText: 'Estado',
                          labelStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        dropdownColor: AppTheme.darkSurface,
                        style: const TextStyle(color: AppTheme.white),
                        items: ['watched', 'watching', 'want_to_watch']
                            .map((status) => DropdownMenuItem(
                                  value: status,
                                  child: Text(_getStatusLabel(status)),
                                ))
                            .toList(),
                        onChanged: (value) {
                          if (value != null) {
                            setState(() => _selectedMovieStatus = value);
                          }
                        },
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _movieNotesController,
                        decoration: InputDecoration(
                          labelText: 'Notas',
                          labelStyle: const TextStyle(color: AppTheme.white),
                          filled: true,
                          fillColor: AppTheme.darkSurfaceVariant,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        style: const TextStyle(color: AppTheme.white),
                        maxLines: 3,
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
                        onPressed: () => setState(() => _showAddMovieModal = false),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppTheme.white),
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
                          if (_movieTitleController.text.isNotEmpty) {
                            final movie = Movie(
                              id: DateTime.now().millisecondsSinceEpoch.toString(),
                              title: _movieTitleController.text,
                              director: _movieDirectorController.text,
                              year: int.tryParse(_movieYearController.text) ?? DateTime.now().year,
                              genre: _movieGenreController.text.isNotEmpty
                                  ? _movieGenreController.text
                                  : 'Sin género',
                              rating: double.tryParse(_selectedMovieRating) ?? 0.0,
                              status: _selectedMovieStatus,
                              review: _movieNotesController.text.isNotEmpty
                                  ? _movieNotesController.text
                                  : null,
                              watchedDate: _selectedMovieStatus == 'watched'
                                  ? DateTime.now()
                                  : null,
                            );
                            setState(() {
                              _movies.add(movie);
                              _showAddMovieModal = false;
                              _movieTitleController.clear();
                              _movieDirectorController.clear();
                              _movieYearController.clear();
                              _movieGenreController.clear();
                              _movieNotesController.clear();
                            });
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.deepPurple,
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
    );
  }

  @override
  void dispose() {
    _movieTitleController.dispose();
    _movieDirectorController.dispose();
    _movieYearController.dispose();
    _movieGenreController.dispose();
    _movieNotesController.dispose();
    _movieWatchDateController.dispose();
    _quoteTextController.dispose();
    _quoteMovieController.dispose();
    _quoteCharacterController.dispose();
    _quoteContextController.dispose();
    super.dispose();
  }
}

