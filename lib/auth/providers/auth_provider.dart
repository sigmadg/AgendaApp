import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  User? _user;
  bool _loading = true;

  User? get user => _user;
  bool get loading => _loading;
  bool get isAuthenticated => _user != null;

  AuthProvider() {
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    try {
      print('AuthProvider: Checking authentication status');
      final authStatus = await _authService.isAuthenticated();

      if (authStatus['authenticated'] == true && authStatus['user'] != null) {
        _user = authStatus['user'] as User;
        print('AuthProvider: User is authenticated');
      } else {
        _user = null;
        print('AuthProvider: User is not authenticated');
      }
    } catch (error) {
      print('AuthProvider: Error checking auth status: $error');
      _user = null;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  Future<Map<String, dynamic>> signIn(
      String email, String password, bool rememberMe) async {
    try {
      print('AuthProvider: Signing in user');
      final result = await _authService.login(email, password, rememberMe);

      if (result.success && result.user != null) {
        _user = result.user;
        print('AuthProvider: Sign in successful');
        notifyListeners();
        return {'success': true};
      } else {
        print('AuthProvider: Sign in failed: ${result.error}');
        return {'success': false, 'error': result.error};
      }
    } catch (error) {
      print('AuthProvider: Sign in error: $error');
      return {'success': false, 'error': 'Sign in failed'};
    }
  }

  Future<Map<String, dynamic>> signUp(
      String name, String email, String password) async {
    try {
      print('AuthProvider: Signing up user');
      final result = await _authService.register(name, email, password);

      if (result.success && result.user != null) {
        _user = result.user;
        print('AuthProvider: Sign up successful');
        notifyListeners();
        return {'success': true};
      } else {
        print('AuthProvider: Sign up failed: ${result.error}');
        return {'success': false, 'error': result.error};
      }
    } catch (error) {
      print('AuthProvider: Sign up error: $error');
      return {'success': false, 'error': 'Sign up failed'};
    }
  }

  Future<Map<String, dynamic>> signOut() async {
    try {
      print('AuthProvider: Signing out user');
      final result = await _authService.logout();

      if (result['success'] == true) {
        _user = null;
        print('AuthProvider: Sign out successful');
        notifyListeners();
        return {'success': true};
      } else {
        print('AuthProvider: Sign out failed');
        return {'success': false, 'error': result['error']};
      }
    } catch (error) {
      print('AuthProvider: Sign out error: $error');
      return {'success': false, 'error': 'Sign out failed'};
    }
  }

  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> userData) async {
    try {
      print('AuthProvider: Updating profile');
      final result = await _authService.updateProfile(userData);

      if (result.success && result.user != null) {
        _user = result.user;
        print('AuthProvider: Profile update successful');
        notifyListeners();
        return {'success': true, 'user': result.user};
      } else {
        print('AuthProvider: Profile update failed: ${result.error}');
        return {'success': false, 'error': result.error};
      }
    } catch (error) {
      print('AuthProvider: Profile update error: $error');
      return {'success': false, 'error': 'Profile update failed'};
    }
  }
}

