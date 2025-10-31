import 'book.dart';

class BookSeries {
  final String id;
  final String name;
  final String genre;
  final String status; // 'reading', 'completed', 'planning'
  final List<Book> books;
  final double overallRating;
  final String? notes;

  BookSeries({
    required this.id,
    required this.name,
    required this.genre,
    required this.status,
    required this.books,
    required this.overallRating,
    this.notes,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'genre': genre,
      'status': status,
      'books': books.map((b) => b.toJson()).toList(),
      'overallRating': overallRating,
      'notes': notes,
    };
  }

  factory BookSeries.fromJson(Map<String, dynamic> json) {
    return BookSeries(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      genre: json['genre'] ?? '',
      status: json['status'] ?? 'planning',
      books: (json['books'] as List<dynamic>?)
              ?.map((b) => Book.fromJson(b as Map<String, dynamic>))
              .toList() ??
          [],
      overallRating: (json['overallRating'] as num?)?.toDouble() ?? 0.0,
      notes: json['notes'],
    );
  }
}

