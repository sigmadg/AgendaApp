class BookQuote {
  final String id;
  final String quote;
  final String book;
  final String author;
  final String category;
  final String genre;
  final double rating;
  final String? notes;

  BookQuote({
    required this.id,
    required this.quote,
    required this.book,
    required this.author,
    required this.category,
    required this.genre,
    required this.rating,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'quote': quote,
      'book': book,
      'author': author,
      'category': category,
      'genre': genre,
      'rating': rating,
      'notes': notes,
    };
  }

  factory BookQuote.fromJson(Map<String, dynamic> json) {
    return BookQuote(
      id: json['id'] ?? '',
      quote: json['quote'] ?? '',
      book: json['book'] ?? '',
      author: json['author'] ?? '',
      category: json['category'] ?? '',
      genre: json['genre'] ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      notes: json['notes'],
    );
  }
}

