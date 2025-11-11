import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/common/social_auth_buttons.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> with TickerProviderStateMixin {
  // Color rojo más oscuro, menos rosado
  static const Color _carminePastel = Color(0xFFC62828);
  
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _rememberMe = false;
  bool _isLoading = false;
  bool? _emailValid;
  bool? _passwordValid;
  bool _hasEmailText = false;
  bool _hasPasswordText = false;

  // Animation Controllers
  late AnimationController _logoAnimationController;
  late AnimationController _formAnimationController;
  late AnimationController _buttonAnimationController;
  late AnimationController _checkboxAnimationController;

  // Animations
  late Animation<double> _logoScaleAnimation;
  late Animation<double> _logoRotationAnimation;
  late Animation<Offset> _formSlideAnimation;
  late Animation<double> _formFadeAnimation;
  late Animation<double> _buttonScaleAnimation;
  late Animation<double> _checkboxScaleAnimation;

  @override
  void initState() {
    super.initState();

    // Logo Animation
    _logoAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );

    _logoScaleAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _logoAnimationController,
      curve: Curves.elasticOut,
    ));

    _logoRotationAnimation = Tween<double>(
      begin: -0.1,
      end: 0.0,
    ).animate(CurvedAnimation(
      parent: _logoAnimationController,
      curve: Curves.easeOut,
    ));

    // Form Animation
    _formAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _formSlideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _formAnimationController,
      curve: Curves.easeOutCubic,
    ));

    _formFadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _formAnimationController,
      curve: Curves.easeOut,
    ));

    // Button Animation
    _buttonAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 200),
    );

    _buttonScaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.95,
    ).animate(CurvedAnimation(
      parent: _buttonAnimationController,
      curve: Curves.easeInOut,
    ));

    // Checkbox Animation
    _checkboxAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );

    _checkboxScaleAnimation = Tween<double>(
      begin: 1.0,
      end: 1.2,
    ).animate(CurvedAnimation(
      parent: _checkboxAnimationController,
      curve: Curves.elasticOut,
    ));

    // Start animations
    _logoAnimationController.forward();
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) {
        _formAnimationController.forward();
      }
    });
    
    // Cargar email guardado si rememberMe está activo
    _loadRememberedEmail();
  }

  Future<void> _loadRememberedEmail() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final rememberMe = prefs.getBool('remember_me') ?? false;
      final userData = prefs.getString('user_data');
      final savedPassword = prefs.getString('remembered_password');
      
      if (rememberMe && userData != null) {
        final userJson = jsonDecode(userData);
        final email = userJson['email'] as String?;
        
        if (email != null && mounted) {
          setState(() {
            _emailController.text = email;
            if (savedPassword != null && savedPassword.isNotEmpty) {
              _passwordController.text = savedPassword;
              _hasPasswordText = true;
              _passwordValid = _validatePassword(savedPassword);
            }
            _rememberMe = true;
            _hasEmailText = email.isNotEmpty;
            _emailValid = _validateEmail(email);
          });
          
          // NO hacer login automático, solo llenar los campos
          // El usuario debe presionar el botón de login manualmente
        }
      }
    } catch (e) {
      print('Error loading remembered email: $e');
    }
  }

  // Limpiar credenciales guardadas cuando se desmarca el checkbox
  Future<void> _clearRememberedCredentials() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('remembered_password');
      await prefs.setBool('remember_me', false);
      print('LoginPage: Credenciales recordadas eliminadas');
    } catch (e) {
      print('Error clearing remembered credentials: $e');
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _logoAnimationController.dispose();
    _formAnimationController.dispose();
    _buttonAnimationController.dispose();
    _checkboxAnimationController.dispose();
    super.dispose();
  }

  bool _validateEmail(String email) {
    if (email.isEmpty) return false;
    final emailRegex = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');
    return emailRegex.hasMatch(email);
  }

  bool _validatePassword(String password) {
    return password.length >= 6;
  }

  void _onEmailChanged(String value) {
    setState(() {
      _hasEmailText = value.isNotEmpty;
      _emailValid = value.isEmpty ? null : _validateEmail(value);
    });
  }

  void _onPasswordChanged(String value) {
    setState(() {
      _hasPasswordText = value.isNotEmpty;
      _passwordValid = value.isEmpty ? null : _validatePassword(value);
    });
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final result = await authProvider.signIn(
        _emailController.text.trim(),
        _passwordController.text.trim(),
        _rememberMe,
      );

      if (!mounted) return;

      if (result['success'] == true) {
        context.go('/main');
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result['error'] ?? 'Error al iniciar sesión'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Error de conexión'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 60),
                // Logo/Brand Container
                Center(
                  child: Column(
                    children: [
                      // Logo/Image Container with Animation
                      AnimatedBuilder(
                        animation: _logoAnimationController,
                        builder: (context, child) {
                          return Transform.scale(
                            scale: _logoScaleAnimation.value,
                            child: Transform.rotate(
                              angle: _logoRotationAnimation.value,
                              child: Image.asset(
                                'assets/images/5.png',
                                width: 200,
                                height: 200,
                                fit: BoxFit.contain,
                                errorBuilder: (context, error, stackTrace) {
                                  return const Icon(
                                    Icons.pets,
                                    size: 60,
                                    color: _carminePastel,
                                  );
                                },
                              ),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Cortex',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Organiza tu vida de manera inteligente',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16,
                          color: AppTheme.white60,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 40),
                // Form Header with Animation
                SlideTransition(
                  position: _formSlideAnimation,
                  child: FadeTransition(
                    opacity: _formFadeAnimation,
                    child: Column(
                      children: [
                        const Text(
                          '¡Bienvenido de vuelta!',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Inicia sesión para continuar',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 16,
                            color: AppTheme.white60,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                // Email Input with Animation
                SlideTransition(
                  position: _formSlideAnimation,
                  child: FadeTransition(
                    opacity: _formFadeAnimation,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Correo electrónico',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.white70,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Container(
                      decoration: BoxDecoration(
                        color: AppTheme.lightGray,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: _hasEmailText
                              ? _carminePastel
                              : AppTheme.darkSurfaceVariant,
                          width: 1,
                        ),
                        boxShadow: _hasEmailText
                            ? [
                                BoxShadow(
                                  color: _carminePastel.withOpacity(0.1),
                                  blurRadius: 8,
                                  offset: const Offset(0, 0),
                                ),
                              ]
                            : null,
                      ),
                      child: TextFormField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        textInputAction: TextInputAction.next,
                        onChanged: _onEmailChanged,
                        onFieldSubmitted: (_) => FocusScope.of(context).nextFocus(),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Por favor ingresa tu email';
                          }
                          if (!_validateEmail(value)) {
                            return 'Formato de email inválido';
                          }
                          return null;
                        },
                        decoration: InputDecoration(
                          hintText: 'tu@email.com',
                          hintStyle: const TextStyle(color: AppTheme.white40),
                          prefixIcon: Icon(
                            Icons.mail_outline,
                            color: _hasEmailText
                                ? _carminePastel
                                : AppTheme.white60,
                            size: 22,
                          ),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 14,
                          ),
                        ),
                        style: TextStyle(
                          color: AppTheme.white,
                          fontWeight: _hasEmailText
                              ? FontWeight.w500
                              : FontWeight.normal,
                        ),
                      ),
                    ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                // Password Input with Animation
                SlideTransition(
                  position: _formSlideAnimation,
                  child: FadeTransition(
                    opacity: _formFadeAnimation,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Contraseña',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.white70,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Container(
                      decoration: BoxDecoration(
                        color: AppTheme.lightGray,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: _hasPasswordText
                              ? _carminePastel
                              : AppTheme.darkSurfaceVariant,
                          width: 1,
                        ),
                        boxShadow: _hasPasswordText
                            ? [
                                BoxShadow(
                                  color: _carminePastel.withOpacity(0.1),
                                  blurRadius: 8,
                                  offset: const Offset(0, 0),
                                ),
                              ]
                            : null,
                      ),
                      child: TextFormField(
                        controller: _passwordController,
                        obscureText: _obscurePassword,
                        textInputAction: TextInputAction.done,
                        onChanged: _onPasswordChanged,
                        onFieldSubmitted: (_) => _handleLogin(),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Por favor ingresa tu contraseña';
                          }
                          if (value.length < 6) {
                            return 'La contraseña debe tener al menos 6 caracteres';
                          }
                          return null;
                        },
                        decoration: InputDecoration(
                          hintText: 'Tu contraseña',
                          hintStyle: const TextStyle(color: AppTheme.white40),
                          prefixIcon: Icon(
                            Icons.lock_outline,
                            color: _hasPasswordText
                                ? _carminePastel
                                : AppTheme.white60,
                            size: 22,
                          ),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword
                                  ? Icons.visibility_outlined
                                  : Icons.visibility_off_outlined,
                              color: _hasPasswordText
                                  ? _carminePastel
                                  : AppTheme.white60,
                              size: 22,
                            ),
                            onPressed: () {
                              setState(() {
                                _obscurePassword = !_obscurePassword;
                              });
                            },
                          ),
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 14,
                          ),
                        ),
                        style: TextStyle(
                          color: AppTheme.white,
                          fontWeight: _hasPasswordText
                              ? FontWeight.w500
                              : FontWeight.normal,
                        ),
                      ),
                    ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                // Options Container with Animation
                SlideTransition(
                  position: _formSlideAnimation,
                  child: FadeTransition(
                    opacity: _formFadeAnimation,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Remember Me Checkbox with Animation
                        GestureDetector(
                      onTap: () async {
                        final newRememberMe = !_rememberMe;
                        setState(() {
                          _rememberMe = newRememberMe;
                        });
                        
                        if (newRememberMe) {
                          _checkboxAnimationController.forward().then((_) {
                            _checkboxAnimationController.reverse();
                          });
                        } else {
                          // Si se desmarca, limpiar credenciales guardadas
                          await _clearRememberedCredentials();
                        }
                      },
                      child: Row(
                        children: [
                          AnimatedBuilder(
                            animation: _checkboxScaleAnimation,
                            builder: (context, child) {
                              return Transform.scale(
                                scale: _rememberMe ? _checkboxScaleAnimation.value : 1.0,
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  curve: Curves.easeInOut,
                                  width: 20,
                                  height: 20,
                                  decoration: BoxDecoration(
                                    border: Border.all(
                                      color: _rememberMe
                                          ? _carminePastel
                                          : AppTheme.white60,
                                      width: 2,
                                    ),
                                    borderRadius: BorderRadius.circular(4),
                                    color: _rememberMe
                                        ? _carminePastel
                                        : Colors.transparent,
                                  ),
                                  child: _rememberMe
                                      ? const Icon(
                                          Icons.check,
                                          size: 16,
                                          color: AppTheme.white,
                                        )
                                      : null,
                                ),
                              );
                            },
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            'Recordarme',
                            style: TextStyle(
                              color: AppTheme.white70,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Forgot Password Link
                    TextButton(
                      onPressed: () {
                        context.push('/forgot-password');
                      },
                      child: const Text(
                        '¿Olvidaste tu contraseña?',
                        style: TextStyle(
                          color: _carminePastel,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                // Login Button with Animation
                SlideTransition(
                  position: _formSlideAnimation,
                  child: FadeTransition(
                    opacity: _formFadeAnimation,
                    child: AnimatedBuilder(
                      animation: _buttonScaleAnimation,
                      builder: (context, child) {
                        return Transform.scale(
                          scale: _buttonScaleAnimation.value,
                          child: GestureDetector(
                            onTapDown: (_) {
                              _buttonAnimationController.forward();
                            },
                            onTapUp: (_) {
                              _buttonAnimationController.reverse();
                            },
                            onTapCancel: () {
                              _buttonAnimationController.reverse();
                            },
                            child: ElevatedButton(
                              onPressed: _isLoading ||
                          _emailController.text.isEmpty ||
                                _passwordController.text.isEmpty
                                    ? null
                                    : _handleLogin,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: _carminePastel,
                                foregroundColor: AppTheme.white,
                                padding: const EdgeInsets.symmetric(vertical: 18),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                elevation: 0,
                              ),
                              child: _isLoading
                                  ? Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        const Text(
                                          'Iniciando sesión...',
                                          style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w600,
                                            letterSpacing: 0.3,
                                          ),
                                        ),
                                        const SizedBox(width: 12),
                                        const SizedBox(
                                          height: 20,
                                          width: 20,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            valueColor:
                                                AlwaysStoppedAnimation<Color>(AppTheme.white),
                                          ),
                                        ),
                                      ],
                                    )
                                  : Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: const [
                                        Text(
                                          'Iniciar Sesión',
                                          style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w600,
                                            letterSpacing: 0.3,
                                          ),
                                        ),
                                        SizedBox(width: 8),
                                        Icon(
                                          Icons.arrow_forward,
                                          size: 20,
                                          color: AppTheme.white,
                                        ),
                                      ],
                                    ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                // Register Button with Animation
                SlideTransition(
                  position: _formSlideAnimation,
                  child: FadeTransition(
                    opacity: _formFadeAnimation,
                    child: OutlinedButton(
                  onPressed: () {
                    context.push('/register');
                  },
                  style: OutlinedButton.styleFrom(
                    backgroundColor: AppTheme.darkSurface,
                    side: const BorderSide(
                      color: AppTheme.darkSurfaceVariant,
                      width: 1.5,
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  child: const Text(
                    'Crear cuenta',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                // Guest Button with Animation
                SlideTransition(
                  position: _formSlideAnimation,
                  child: FadeTransition(
                    opacity: _formFadeAnimation,
                    child: OutlinedButton(
                  onPressed: () {
                    context.go('/main?section=profile');
                  },
                  style: OutlinedButton.styleFrom(
                    backgroundColor: AppTheme.darkSurface,
                    side: const BorderSide(
                      color: AppTheme.darkSurfaceVariant,
                      width: 1.5,
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  child: const Text(
                    'Continuar como invitado',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                // Social Auth Buttons
                SlideTransition(
                  position: _formSlideAnimation,
                  child: FadeTransition(
                    opacity: _formFadeAnimation,
                    child: SocialAuthButtons(),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

