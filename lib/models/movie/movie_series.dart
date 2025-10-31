import 'movie.dart';

class MovieSeries {
  final String id;
  final String name;
  final String genre;
  final String status; // 'watching', 'completed', 'planning'
  final List<Movie> movies;
  final double overallRating;
  final String? notes;

  MovieSeries({
    required this.id,
    required this.name,
    required this.genre,
    required this.status,
    required this.movies,
    required this.overallRating,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'genre': genre,
      'status': status,
      'movies': movies.map((m) => m.toJson()).toList(),
      'overallRating': overallRating,
      'notes': notes,
    };
  }

  factory MovieSeries.fromJson(Map<String, dynamic> json) {
    return MovieSeries(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      genre: json['genre'] ?? '',
      status: json['status'] ?? 'planning',
      movies: (json['movies'] as List<dynamic>?)
              ?.map((m) => Movie.fromJson(m as Map<String, dynamic>))
              .toList() ??
          [],
      overallRating: (json['overallRating'] as num?)?.toDouble() ?? 0.0,
      notes: json['notes'],
    );
  }
}

