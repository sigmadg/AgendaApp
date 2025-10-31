class MovieQuote {
  final String id;
  final String quote;
  final String movie;
  final String character;
  final String category;
  final String genre;
  final String mood;
  final double rating;
  final String? notes;

  MovieQuote({
    required this.id,
    required this.quote,
    required this.movie,
    required this.character,
    required this.category,
    required this.genre,
    required this.mood,
    required this.rating,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'quote': quote,
      'movie': movie,
      'character': character,
      'category': category,
      'genre': genre,
      'mood': mood,
      'rating': rating,
      'notes': notes,
    };
  }

  factory MovieQuote.fromJson(Map<String, dynamic> json) {
    return MovieQuote(
      id: json['id'] ?? '',
      quote: json['quote'] ?? '',
      movie: json['movie'] ?? '',
      character: json['character'] ?? '',
      category: json['category'] ?? '',
      genre: json['genre'] ?? '',
      mood: json['mood'] ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      notes: json['notes'],
    );
  }
}

