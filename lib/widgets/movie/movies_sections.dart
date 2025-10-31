import 'package:flutter/material.dart';
import '../../models/movie/movie.dart';
import '../../models/movie/movie_quote.dart';
import '../../models/movie/movie_series.dart';
import '../../theme/app_theme.dart';

class MoviesSections extends StatefulWidget {
  const MoviesSections({super.key});

  @override
  State<MoviesSections> createState() => _MoviesSectionsState();
}

class _MoviesSectionsState extends State<MoviesSections> {
  String _activeSection = 'movies-journal';
  
  List<Movie> _movies = [];
  List<MovieQuote> _quotes = [];
  List<MovieSeries> _series = [];
  List<Movie> _movieshelf = [];

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
      backgroundColor: AppTheme.darkBackground,
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
                        color: isActive ? AppTheme.white : AppTheme.white60,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        section['name'] as String,
                        style: TextStyle(
                          color: isActive ? AppTheme.white : AppTheme.white60,
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
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'DIARIO DE PELÍCULAS',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add, color: AppTheme.white),
                onPressed: () {},
              ),
            ],
          ),
        ),
        Expanded(
          child: _movies.isEmpty
              ? _buildEmptyState('No hay películas registradas', Icons.movie)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _movies.length,
                  itemBuilder: (context, index) => _buildMovieCard(_movies[index]),
                ),
        ),
      ],
    );
  }

  Widget _buildMoviesLog() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.list_alt, size: 64, color: AppTheme.white40),
          const SizedBox(height: 16),
          const Text(
            'Registro de Películas',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Funcionalidad en desarrollo',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.white60,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFavoriteQuotes() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'CITAS FAVORITAS',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add, color: AppTheme.white),
                onPressed: () {},
              ),
            ],
          ),
        ),
        Expanded(
          child: _quotes.isEmpty
              ? _buildEmptyState('No hay citas guardadas', Icons.format_quote)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _quotes.length,
                  itemBuilder: (context, index) => _buildQuoteCard(_quotes[index]),
                ),
        ),
      ],
    );
  }

  Widget _buildMovieSeries() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'SAGAS CINEMATOGRÁFICAS',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add, color: AppTheme.white),
                onPressed: () {},
              ),
            ],
          ),
        ),
        Expanded(
          child: _series.isEmpty
              ? _buildEmptyState('No hay sagas registradas', Icons.local_movies)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _series.length,
                  itemBuilder: (context, index) => _buildSeriesCard(_series[index]),
                ),
        ),
      ],
    );
  }

  Widget _buildMovieshelf() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'ESTANTERÍA',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add, color: AppTheme.white),
                onPressed: () {},
              ),
            ],
          ),
        ),
        Expanded(
          child: _movieshelf.isEmpty
              ? _buildEmptyState('No hay películas en la estantería', Icons.bookmark)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _movieshelf.length,
                  itemBuilder: (context, index) => _buildMovieshelfCard(_movieshelf[index]),
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
                          color: AppTheme.white60,
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
                    style: const TextStyle(fontSize: 12, color: AppTheme.white70),
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
              '— ${quote.character}, ${quote.movie}',
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.white70,
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
                    color: AppTheme.white70,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSeriesCard(MovieSeries series) {
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
              '${series.movies.length} películas • Calificación: ${series.overallRating.toStringAsFixed(1)}',
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

  Widget _buildMovieshelfCard(Movie movie) {
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
                      color: AppTheme.white60,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.star, size: 20, color: Colors.amber),
            const SizedBox(width: 4),
            Text(
              movie.rating.toStringAsFixed(1),
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
      default:
        return status;
    }
  }
}

