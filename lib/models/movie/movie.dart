class Movie {
  final String id;
  final String title;
  final String director;
  final int year;
  final String genre;
  final double rating;
  final String status; // 'watched', 'want_to_watch', 'watching'
  final String? review;
  final DateTime? watchedDate;
  final String? posterUrl;

  Movie({
    required this.id,
    required this.title,
    required this.director,
    required this.year,
    required this.genre,
    required this.rating,
    required this.status,
    this.review,
    this.watchedDate,
    this.posterUrl,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'director': director,
      'year': year,
      'genre': genre,
      'rating': rating,
      'status': status,
      'review': review,
      'watchedDate': watchedDate?.toIso8601String(),
      'posterUrl': posterUrl,
    };
  }

  factory Movie.fromJson(Map<String, dynamic> json) {
    return Movie(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      director: json['director'] ?? '',
      year: json['year'] ?? 0,
      genre: json['genre'] ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] ?? 'want_to_watch',
      review: json['review'],
      watchedDate: json['watchedDate'] != null
          ? DateTime.parse(json['watchedDate'])
          : null,
      posterUrl: json['posterUrl'],
    );
  }
}

