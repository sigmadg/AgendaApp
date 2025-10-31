import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';

class AuthResponse {
  final bool success;
  final User? user;
  final String? token;
  final String? error;

  AuthResponse({
    required this.success,
    this.user,
    this.token,
    this.error,
  });
}

class AuthService {
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';
  static const String _rememberMeKey = 'remember_me';

  Future<AuthResponse> login(
      String email, String password, bool rememberMe) async {
    try {
      print('AuthService: Attempting login for user: $email');

      // Simulate API call - replace with actual API in production
      final mockResponse = {
        'success': true,
        'token': 'mock_jwt_token_${DateTime.now().millisecondsSinceEpoch}',
        'user': {
          'id': '1',
          'name': email.split('@')[0],
          'email': email,
          'avatar': null,
          'createdAt': DateTime.now().toIso8601String(),
        },
      };

      await _storeAuthData(mockResponse, rememberMe);
      print('AuthService: Login successful');

      return AuthResponse(
        success: true,
        user: User.fromJson(mockResponse['user'] as Map<String, dynamic>),
        token: mockResponse['token'] as String,
      );
    } catch (error) {
      print('AuthService: Login error: $error');
      return AuthResponse(
        success: false,
        error: 'Network error or invalid credentials',
      );
    }
  }

  Future<AuthResponse> register(String name, String email, String password) async {
    try {
      print('AuthService: Attempting registration for user: $email');

      final mockResponse = {
        'success': true,
        'token': 'mock_jwt_token_${DateTime.now().millisecondsSinceEpoch}',
        'user': {
          'id': '2',
          'name': name,
          'email': email,
          'avatar': null,
          'createdAt': DateTime.now().toIso8601String(),
        },
      };

      await _storeAuthData(mockResponse, false);
      print('AuthService: Registration successful');

      return AuthResponse(
        success: true,
        user: User.fromJson(mockResponse['user'] as Map<String, dynamic>),
        token: mockResponse['token'] as String,
      );
    } catch (error) {
      print('AuthService: Registration error: $error');
      return AuthResponse(
        success: false,
        error: 'Network error or registration failed',
      );
    }
  }

  Future<Map<String, dynamic>> logout() async {
    try {
      print('AuthService: Logging out user');

      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_tokenKey);
      await prefs.remove(_userKey);
      await prefs.remove(_rememberMeKey);

      print('AuthService: Logout successful');
      return {'success': true};
    } catch (error) {
      print('AuthService: Logout error: $error');
      return {'success': false, 'error': 'Logout failed'};
    }
  }

  Future<Map<String, dynamic>> isAuthenticated() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString(_tokenKey);
      final userData = prefs.getString(_userKey);

      if (token != null && userData != null) {
        final user = User.fromJson(jsonDecode(userData));
        print('AuthService: User is authenticated: ${user.email}');
        return {
          'authenticated': true,
          'user': user,
        };
      }

      print('AuthService: User is not authenticated');
      return {'authenticated': false};
    } catch (error) {
      print('AuthService: Authentication check error: $error');
      return {'authenticated': false};
    }
  }

  Future<AuthResponse> updateProfile(Map<String, dynamic> userData) async {
    try {
      print('AuthService: Updating profile');

      final prefs = await SharedPreferences.getInstance();
      final currentUserData = prefs.getString(_userKey);
      if (currentUserData != null) {
        final currentUser = User.fromJson(jsonDecode(currentUserData));
        final updatedUser = User(
          id: currentUser.id,
          name: userData['name'] ?? currentUser.name,
          email: userData['email'] ?? currentUser.email,
          avatar: userData['avatar'] ?? currentUser.avatar,
          createdAt: currentUser.createdAt,
        );

        await prefs.setString(_userKey, jsonEncode(updatedUser.toJson()));

        print('AuthService: Profile update successful');
        return AuthResponse(
          success: true,
          user: updatedUser,
        );
      }

      return AuthResponse(
        success: false,
        error: 'User not found',
      );
    } catch (error) {
      print('AuthService: Profile update error: $error');
      return AuthResponse(
        success: false,
        error: 'Profile update failed',
      );
    }
  }

  Future<void> _storeAuthData(Map<String, dynamic> data, bool rememberMe) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = data['token'] as String;
      final user = data['user'] as Map<String, dynamic>;

      await prefs.setString(_tokenKey, token);
      await prefs.setString(_userKey, jsonEncode(user));
      await prefs.setBool(_rememberMeKey, rememberMe);

      print('AuthService: Auth data stored successfully');
    } catch (error) {
      print('AuthService: Error storing auth data: $error');
      rethrow;
    }
  }
}

