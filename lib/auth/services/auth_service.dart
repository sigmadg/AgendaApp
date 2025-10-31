import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/user.dart' as app_models;

class AuthResponse {
  final bool success;
  final app_models.User? user;
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
  static const String _passwordKey = 'remembered_password';

  final SupabaseClient _supabase = Supabase.instance.client;

  Future<AuthResponse> login(
      String email, String password, bool rememberMe) async {
    try {
      print('AuthService: Attempting login for user: $email');

      // Autenticación con Supabase
      final response = await _supabase.auth.signInWithPassword(
        email: email,
        password: password,
      );

      if (response.user != null) {
        // Obtener el perfil del usuario desde la tabla 'profiles'
        final profileResponse = await _supabase
            .from('profiles')
            .select()
            .eq('id', response.user!.id)
            .maybeSingle();

        String userName = email.split('@')[0];
        String? avatar;

        if (profileResponse != null) {
          userName = profileResponse['name'] ?? userName;
          avatar = profileResponse['avatar_url'];
        }

        final user = app_models.User(
          id: response.user!.id,
          name: userName,
          email: response.user!.email ?? email,
          avatar: avatar,
          createdAt: response.user!.createdAt ?? DateTime.now().toIso8601String(),
        );

        await _storeAuthData(
          {
            'token': response.session?.accessToken ?? '',
            'user': user.toJson(),
          },
          rememberMe,
          password: rememberMe ? password : null,
        );

        print('AuthService: Login successful');
        return AuthResponse(
          success: true,
          user: user,
          token: response.session?.accessToken,
        );
      }

      return AuthResponse(
        success: false,
        error: 'Login failed',
      );
    } on AuthException catch (e) {
      print('AuthService: Login error: ${e.message}');
      return AuthResponse(
        success: false,
        error: e.message ?? 'Invalid credentials',
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

      // Registrar usuario en Supabase
      AuthResponse? registrationResult;
      
      try {
        // Intentar registro - si falla por trigger, ignorar el error si el usuario se creó
        final response = await _supabase.auth.signUp(
          email: email,
          password: password,
          data: {
            'name': name,
          },
        );

        if (response.user != null) {
          // El usuario se registró correctamente
          // Nota: Si "Email confirmations" está activado en Supabase, 
          // response.session puede ser null hasta que el usuario confirme su email
          print('AuthService: ✅ User created successfully: ${response.user!.id}');
          print('AuthService: Session token: ${response.session != null ? "present" : "null (email confirmation required)"}');
          registrationResult = AuthResponse(
            success: true,
            user: app_models.User(
              id: response.user!.id,
              name: name,
              email: response.user!.email ?? email,
              avatar: null,
              createdAt: response.user!.createdAt ?? DateTime.now().toIso8601String(),
            ),
            token: response.session?.accessToken, // Puede ser null si requiere confirmación de email
          );
        } else {
          // Si no hay usuario en la respuesta pero no hay excepción, 
          // esperar un momento y verificar
          await Future.delayed(const Duration(milliseconds: 500));
          try {
            final loginResponse = await _supabase.auth.signInWithPassword(
              email: email,
              password: password,
            );
            if (loginResponse.user != null) {
              print('AuthService: ✅ User exists, login successful');
              registrationResult = AuthResponse(
                success: true,
                user: app_models.User(
                  id: loginResponse.user!.id,
                  name: name,
                  email: loginResponse.user!.email ?? email,
                  avatar: null,
                  createdAt: loginResponse.user!.createdAt ?? DateTime.now().toIso8601String(),
                ),
                token: loginResponse.session?.accessToken,
              );
            }
          } catch (_) {
            // Ignorar errores de login aquí
          }
        }
      } on AuthException catch (e) {
        // Verificar el mensaje de error de Supabase
        String errorMsg = e.message ?? '';
        String lowerErrorMsg = errorMsg.toLowerCase();
        print('AuthService: AuthException: $errorMsg');
        print('AuthService: Status code: ${e.statusCode}');
        
        // Errores de email en uso / formato / password
        if (lowerErrorMsg.contains('already') && lowerErrorMsg.contains('registered')) {
          return AuthResponse(
            success: false,
            error: 'Este email ya está registrado. Intenta iniciar sesión.',
          );
        }
        
        if (lowerErrorMsg.contains('invalid email')) {
          return AuthResponse(
            success: false,
            error: 'Email inválido. Verifica el formato.',
          );
        }
        
        if (lowerErrorMsg.contains('password')) {
          return AuthResponse(
            success: false,
            error: 'La contraseña no cumple los requisitos.',
          );
        }
        
        // Error típico cuando falla el trigger/función de perfiles (bloquea la creación del usuario)
        // O cuando hay un error del servidor inesperado
        if (lowerErrorMsg.contains('database error saving new user') || 
            (e.statusCode != null && e.statusCode == 500 && lowerErrorMsg.contains('unexpected_failure'))) {
          print('AuthService: ⚠️ Error 500 - verificando si el usuario se creó de todas formas...');
          
          // Intentar verificar si el usuario se creó a pesar del error (a veces pasa cuando el trigger falla pero el usuario se crea)
          await Future.delayed(const Duration(milliseconds: 1000));
          try {
            final loginResponse = await _supabase.auth.signInWithPassword(
              email: email,
              password: password,
            );
            if (loginResponse.user != null) {
              print('AuthService: ✅ Usuario existe a pesar del error 500 - creando perfil manualmente...');
              // El usuario se creó, crear el perfil manualmente
              try {
                await _supabase.from('profiles').insert({
                  'id': loginResponse.user!.id,
                  'name': name.isNotEmpty ? name : email.split('@')[0],
                  'email': email,
                  'avatar_url': null,
                });
                print('AuthService: ✅ Perfil creado exitosamente');
                
                return AuthResponse(
                  success: true,
                  user: app_models.User(
                    id: loginResponse.user!.id,
                    name: name,
                    email: loginResponse.user!.email ?? email,
                    avatar: null,
                    createdAt: loginResponse.user!.createdAt ?? DateTime.now().toIso8601String(),
                  ),
                  token: loginResponse.session?.accessToken,
                );
              } catch (profileError) {
                print('AuthService: ⚠️ Error creando perfil: $profileError');
                // Continuar y devolver el usuario aunque no tenga perfil
                return AuthResponse(
                  success: true,
                  user: app_models.User(
                    id: loginResponse.user!.id,
                    name: name,
                    email: loginResponse.user!.email ?? email,
                    avatar: null,
                    createdAt: loginResponse.user!.createdAt ?? DateTime.now().toIso8601String(),
                  ),
                  token: loginResponse.session?.accessToken,
                );
              }
            }
          } catch (_) {
            print('AuthService: ❌ El usuario no se creó - el error 500 bloqueó el registro');
          }
          
          // Si llegamos aquí, el usuario no se creó
          return AuthResponse(
            success: false,
            error: 'Error del servidor al crear el usuario. Verifica que el trigger esté deshabilitado en Supabase o intenta con otro email.',
          );
        }
        
        // Fallback genérico - mostrar el mensaje real de Supabase
        return AuthResponse(
          success: false,
          error: e.message ?? 'Error al registrar usuario',
        );
      }

      if (registrationResult != null && registrationResult.user != null) {
        // Esperar un momento antes de crear el perfil para asegurar que el usuario esté disponible
        await Future.delayed(const Duration(milliseconds: 1000));
        
        // Intentar crear el perfil si no existe
        bool profileCreated = false;
        try {
          var profileResponse = await _supabase
              .from('profiles')
              .select()
              .eq('id', registrationResult.user!.id)
              .maybeSingle();

          if (profileResponse != null) {
            print('AuthService: ✅ Profile already exists (created by trigger)');
            profileCreated = true;
          } else {
            print('AuthService: Profile does not exist, creating manually...');
            try {
              await _supabase.from('profiles').insert({
                'id': registrationResult.user!.id,
                'name': name.isNotEmpty ? name : email.split('@')[0], // Asegurar que name tenga valor
                'email': email,
                'avatar_url': null, // opcional
              });
              print('AuthService: ✅ Profile created successfully manually');
              profileCreated = true;
            } catch (insertError) {
              print('AuthService: ❌ Error creating profile manually: $insertError');
              // Si falla por RLS, intentar con un pequeño delay y retry
              try {
                await Future.delayed(const Duration(milliseconds: 500));
                await _supabase.from('profiles').insert({
                  'id': registrationResult.user!.id,
                  'name': name.isNotEmpty ? name : email.split('@')[0],
                  'email': email,
                  'avatar_url': null,
                });
                print('AuthService: ✅ Profile created on retry');
                profileCreated = true;
              } catch (retryError) {
                print('AuthService: ⚠️ Could not create profile, but user is registered: $retryError');
                // No fallar, el usuario ya está registrado y puede usar la app
              }
            }
          }
        } catch (e) {
          print('AuthService: ⚠️ Error checking/creating profile: $e');
          // Continuar, el usuario puede usar la app sin perfil inicialmente
        }

        // Guardar datos de sesión
        if (registrationResult.token != null) {
          await _storeAuthData(
            {
              'token': registrationResult.token!,
              'user': registrationResult.user!.toJson(),
            },
            false,
          );
        }

        print('AuthService: Registration successful');
        return registrationResult;
      }

      return AuthResponse(
        success: false,
        error: 'Error al registrar usuario',
      );
    } catch (error) {
      print('AuthService: Registration error: $error');
      print('AuthService: Error type: ${error.runtimeType}');
      
      // Si es un error genérico que no fue capturado por AuthException
      String errorString = error.toString().toLowerCase();
      
      // Solo mostrar mensaje genérico de conexión, sin mencionar triggers
      return AuthResponse(
        success: false,
        error: 'Error de conexión. Intenta nuevamente.',
      );
    }
  }

  Future<Map<String, dynamic>> logout() async {
    try {
      print('AuthService: Logging out user');

      // Cerrar sesión en Supabase
      await _supabase.auth.signOut();

      // Limpiar datos locales
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_tokenKey);
      await prefs.remove(_userKey);
      await prefs.remove(_rememberMeKey);
      await prefs.remove(_passwordKey);

      print('AuthService: Logout successful');
      return {'success': true};
    } catch (error) {
      print('AuthService: Logout error: $error');
      return {'success': false, 'error': 'Logout failed'};
    }
  }

  Future<Map<String, dynamic>> isAuthenticated() async {
    try {
      // Verificar sesión en Supabase
      final session = _supabase.auth.currentSession;
      
      if (session != null && session.user != null) {
        // Obtener perfil del usuario
        final profileResponse = await _supabase
            .from('profiles')
            .select()
            .eq('id', session.user!.id)
            .maybeSingle();

        String userName = session.user!.email?.split('@')[0] ?? 'Usuario';
        String? avatar;

        if (profileResponse != null) {
          userName = profileResponse['name'] ?? userName;
          avatar = profileResponse['avatar_url'];
        }

        final user = app_models.User(
          id: session.user!.id,
          name: userName,
          email: session.user!.email ?? '',
          avatar: avatar,
          createdAt: session.user!.createdAt ?? DateTime.now().toIso8601String(),
        );

        // Sincronizar con SharedPreferences
        await _storeAuthData(
          {
            'token': session.accessToken,
            'user': user.toJson(),
          },
          false,
        );

        print('AuthService: User is authenticated: ${user.email}');
        return {
          'authenticated': true,
          'user': user,
        };
      }

      // Si no hay sesión en Supabase, verificar datos locales
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString(_tokenKey);
      final userData = prefs.getString(_userKey);

      if (token != null && userData != null) {
        final user = app_models.User.fromJson(jsonDecode(userData));
        print('AuthService: User is authenticated (local): ${user.email}');
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

      final session = _supabase.auth.currentSession;
      if (session == null || session.user == null) {
        return AuthResponse(
          success: false,
          error: 'User not authenticated',
        );
      }

      // Actualizar perfil en Supabase
      final updateData = <String, dynamic>{};
      if (userData['name'] != null) updateData['name'] = userData['name'];
      if (userData['avatar'] != null) updateData['avatar_url'] = userData['avatar'];
      if (userData['email'] != null) updateData['email'] = userData['email'];

      if (updateData.isNotEmpty) {
        await _supabase
            .from('profiles')
            .update(updateData)
            .eq('id', session.user!.id);
      }

      // Obtener perfil actualizado
      final profileResponse = await _supabase
          .from('profiles')
          .select()
          .eq('id', session.user!.id)
          .maybeSingle();

      final updatedUser = app_models.User(
        id: session.user!.id,
        name: profileResponse?['name'] ?? session.user!.email?.split('@')[0] ?? 'Usuario',
        email: profileResponse?['email'] ?? session.user!.email ?? '',
        avatar: profileResponse?['avatar_url'],
        createdAt: session.user!.createdAt ?? DateTime.now().toIso8601String(),
      );

      // Actualizar datos locales
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_userKey, jsonEncode(updatedUser.toJson()));

      print('AuthService: Profile update successful');
      return AuthResponse(
        success: true,
        user: updatedUser,
      );
    } catch (error) {
      print('AuthService: Profile update error: $error');
      return AuthResponse(
        success: false,
        error: 'Profile update failed',
      );
    }
  }

  Future<Map<String, dynamic>> resetPassword(String email) async {
    try {
      print('AuthService: Sending password reset email to: $email');
      
      await _supabase.auth.resetPasswordForEmail(
        email,
        // Opcional: puedes personalizar la URL de redirección
        // redirectTo: 'tu-app://reset-password',
      );

      print('AuthService: Password reset email sent successfully');
      return {'success': true};
    } on AuthException catch (e) {
      print('AuthService: Password reset error: ${e.message}');
      return {'success': false, 'error': e.message ?? 'Error al enviar el email'};
    } catch (error) {
      print('AuthService: Password reset error: $error');
      return {'success': false, 'error': 'Error al enviar el email de recuperación'};
    }
  }

  Future<Map<String, dynamic>> updatePassword(String newPassword) async {
    try {
      print('AuthService: Updating password');
      
      await _supabase.auth.updateUser(
        UserAttributes(password: newPassword),
      );

      print('AuthService: Password updated successfully');
      return {'success': true};
    } on AuthException catch (e) {
      print('AuthService: Password update error: ${e.message}');
      return {'success': false, 'error': e.message ?? 'Error al actualizar la contraseña'};
    } catch (error) {
      print('AuthService: Password update error: $error');
      return {'success': false, 'error': 'Error al actualizar la contraseña'};
    }
  }

  Future<void> _storeAuthData(Map<String, dynamic> data, bool rememberMe, {String? password}) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = data['token'] as String;
      final user = data['user'] as Map<String, dynamic>;

      await prefs.setString(_tokenKey, token);
      await prefs.setString(_userKey, jsonEncode(user));
      await prefs.setBool(_rememberMeKey, rememberMe);
      
      // Guardar contraseña solo si rememberMe es true
      if (rememberMe && password != null) {
        await prefs.setString(_passwordKey, password);
        print('AuthService: Password stored for remember me');
      } else {
        // Limpiar contraseña guardada si rememberMe es false
        await prefs.remove(_passwordKey);
        print('AuthService: Password cleared (remember me disabled)');
      }

      print('AuthService: Auth data stored successfully');
    } catch (error) {
      print('AuthService: Error storing auth data: $error');
      rethrow;
    }
  }
}

