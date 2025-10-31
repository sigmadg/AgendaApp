class Book {
  final String id;
  final String title;
  final String author;
  final String genre;
  final String status; // 'reading', 'read', 'want_to_read'
  final double rating;
  final int pages;
  final DateTime? startDate;
  final DateTime? finishDate;
  final String? review;
  final String? coverUrl;

  Book({
    required this.id,
    required this.title,
    required this.author,
    required this.genre,
    required this.status,
    required this.rating,
    required this.pages,
    this.startDate,
    this.finishDate,
    this.review,
    this.coverUrl,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'author': author,
      'genre': genre,
      'status': status,
      'rating': rating,
      'pages': pages,
      'startDate': startDate?.toIso8601String(),
      'finishDate': finishDate?.toIso8601String(),
      'review': review,
      'coverUrl': coverUrl,
    };
  }

  factory Book.fromJson(Map<String, dynamic> json) {
    return Book(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      author: json['author'] ?? '',
      genre: json['genre'] ?? '',
      status: json['status'] ?? 'want_to_read',
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      pages: json['pages'] ?? 0,
      startDate: json['startDate'] != null
          ? DateTime.parse(json['startDate'])
          : null,
      finishDate: json['finishDate'] != null
          ? DateTime.parse(json['finishDate'])
          : null,
      review: json['review'],
      coverUrl: json['coverUrl'],
    );
  }
}

