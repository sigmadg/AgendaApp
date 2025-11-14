import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../../theme/app_theme.dart';
import '../../widgets/common/social_auth_buttons.dart';
import 'terms_and_conditions_page.dart';
import 'privacy_policy_page.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> with TickerProviderStateMixin {
  // Color rojo más oscuro, menos rosado
  static const Color _carminePastel = Color(0xFFC62828);
  
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _acceptTerms = false;
  bool _isLoading = false;
  bool _hasNameText = false;
  bool _hasEmailText = false;
  bool _hasPasswordText = false;
  bool _hasConfirmPasswordText = false;

  // Animation Controllers
  late AnimationController _logoAnimationController;
  late AnimationController _formAnimationController;
  late AnimationController _buttonAnimationController;
  late AnimationController _checkboxAnimationController;
  late AnimationController _holographicController;

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

    // Holographic Animation
    _holographicController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat();

    // Start animations
    _logoAnimationController.forward();
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) {
        _formAnimationController.forward();
      }
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _logoAnimationController.dispose();
    _formAnimationController.dispose();
    _buttonAnimationController.dispose();
    _checkboxAnimationController.dispose();
    _holographicController.dispose();
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

  void _onNameChanged(String value) {
    setState(() {
      _hasNameText = value.isNotEmpty;
    });
  }

  void _onEmailChanged(String value) {
    setState(() {
      _hasEmailText = value.isNotEmpty;
    });
  }

  void _onPasswordChanged(String value) {
    setState(() {
      _hasPasswordText = value.isNotEmpty;
    });
  }

  void _onConfirmPasswordChanged(String value) {
    setState(() {
      _hasConfirmPasswordText = value.isNotEmpty;
    });
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    if (!_acceptTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Debes aceptar los términos y condiciones'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final result = await authProvider.signUp(
        _nameController.text.trim(),
        _emailController.text.trim(),
        _passwordController.text.trim(),
      );

      if (!mounted) return;

      if (result['success'] == true) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Registro exitoso. Ya puedes iniciar sesión'),
            backgroundColor: Colors.green,
          ),
        );
        context.go('/login');
      } else {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result['error'] ?? 'Error al registrar'),
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
      backgroundColor: AppTheme.darkBackground,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 40),
                // Logo/Brand Container with Animation
                Center(
                  child: Column(
                    children: [
                      AnimatedBuilder(
                        animation: _logoAnimationController,
                        builder: (context, child) {
                          return Transform.scale(
                            scale: _logoScaleAnimation.value,
                            child: Transform.rotate(
                              angle: _logoRotationAnimation.value,
                              child: Image.asset(
                                'assets/images/3.png',
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
                      _HolographicText(
                        text: 'Cortex',
                        fontSize: 32,
                        animation: _holographicController,
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Únete a nuestra comunidad',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16,
                          color: AppTheme.white,
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
                          '¡Crea tu cuenta!',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Completa los datos para comenzar',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 16,
                            color: AppTheme.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                // Name Input with Animation
                SlideTransition(
                  position: _formSlideAnimation,
                  child: FadeTransition(
                    opacity: _formFadeAnimation,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Nombre completo',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Container(
                          decoration: BoxDecoration(
                            color: AppTheme.lightGray,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: _hasNameText
                                  ? _carminePastel
                                  : AppTheme.darkSurfaceVariant,
                              width: 1,
                            ),
                            boxShadow: _hasNameText
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
                            controller: _nameController,
                            textInputAction: TextInputAction.next,
                            onChanged: _onNameChanged,
                            onFieldSubmitted: (_) => FocusScope.of(context).nextFocus(),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Por favor ingresa tu nombre';
                              }
                              return null;
                            },
                            decoration: InputDecoration(
                              hintText: 'Tu nombre completo',
                              hintStyle: const TextStyle(color: AppTheme.white),
                              prefixIcon: Icon(
                                Icons.person_outline,
                                color: _hasNameText
                                    ? _carminePastel
                                    : AppTheme.white,
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
                              fontWeight: _hasNameText
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
                            color: AppTheme.white,
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
                              hintStyle: const TextStyle(color: AppTheme.white),
                              prefixIcon: Icon(
                                Icons.mail_outline,
                                color: _hasEmailText
                                    ? _carminePastel
                                    : AppTheme.white,
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
                            color: AppTheme.white,
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
                            textInputAction: TextInputAction.next,
                            onChanged: _onPasswordChanged,
                            onFieldSubmitted: (_) => FocusScope.of(context).nextFocus(),
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
                              hintText: 'Mínimo 6 caracteres',
                              hintStyle: const TextStyle(color: AppTheme.white),
                              prefixIcon: Icon(
                                Icons.lock_outline,
                                color: _hasPasswordText
                                    ? _carminePastel
                                    : AppTheme.white,
                                size: 22,
                              ),
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _obscurePassword
                                      ? Icons.visibility_outlined
                                      : Icons.visibility_off_outlined,
                                  color: _hasPasswordText
                                      ? _carminePastel
                                      : AppTheme.white,
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
                // Confirm Password Input with Animation
                SlideTransition(
                  position: _formSlideAnimation,
                  child: FadeTransition(
                    opacity: _formFadeAnimation,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Confirmar contraseña',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.white,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Container(
                          decoration: BoxDecoration(
                            color: AppTheme.lightGray,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: _hasConfirmPasswordText
                                  ? _carminePastel
                                  : AppTheme.darkSurfaceVariant,
                              width: 1,
                            ),
                            boxShadow: _hasConfirmPasswordText
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
                            controller: _confirmPasswordController,
                            obscureText: _obscureConfirmPassword,
                            textInputAction: TextInputAction.done,
                            onChanged: _onConfirmPasswordChanged,
                            onFieldSubmitted: (_) => _handleRegister(),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Por favor confirma tu contraseña';
                              }
                              if (value != _passwordController.text) {
                                return 'Las contraseñas no coinciden';
                              }
                              return null;
                            },
                            decoration: InputDecoration(
                              hintText: 'Repite tu contraseña',
                              hintStyle: const TextStyle(color: AppTheme.white),
                              prefixIcon: Icon(
                                Icons.lock_outline,
                                color: _hasConfirmPasswordText
                                    ? _carminePastel
                                    : AppTheme.white,
                                size: 22,
                              ),
                              suffixIcon: IconButton(
                                icon: Icon(
                                  _obscureConfirmPassword
                                      ? Icons.visibility_outlined
                                      : Icons.visibility_off_outlined,
                                  color: _hasConfirmPasswordText
                                      ? _carminePastel
                                      : AppTheme.white,
                                  size: 22,
                                ),
                                onPressed: () {
                                  setState(() {
                                    _obscureConfirmPassword = !_obscureConfirmPassword;
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
                              fontWeight: _hasConfirmPasswordText
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
                // Terms and Conditions with Animation
                SlideTransition(
                  position: _formSlideAnimation,
                  child: FadeTransition(
                    opacity: _formFadeAnimation,
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          _acceptTerms = !_acceptTerms;
                        });
                        if (_acceptTerms) {
                          _checkboxAnimationController.forward().then((_) {
                            _checkboxAnimationController.reverse();
                          });
                        }
                      },
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          AnimatedBuilder(
                            animation: _checkboxScaleAnimation,
                            builder: (context, child) {
                              return Transform.scale(
                                scale: _acceptTerms ? _checkboxScaleAnimation.value : 1.0,
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  curve: Curves.easeInOut,
                                  width: 20,
                                  height: 20,
                                  decoration: BoxDecoration(
                                    border: Border.all(
                                      color: _acceptTerms
                                          ? _carminePastel
                                          : AppTheme.white,
                                      width: 2,
                                    ),
                                    borderRadius: BorderRadius.circular(4),
                                    color: _acceptTerms
                                        ? _carminePastel
                                        : Colors.transparent,
                                  ),
                                  child: _acceptTerms
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
                          const SizedBox(width: 12),
                          Expanded(
                            child: RichText(
                              text: TextSpan(
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: AppTheme.white,
                                ),
                                children: [
                                  const TextSpan(text: 'Acepto los '),
                                  WidgetSpan(
                                    child: GestureDetector(
                                      onTap: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) => const TermsAndConditionsPage(),
                                          ),
                                        );
                                      },
                                      child: const Text(
                                        'términos y condiciones',
                                        style: TextStyle(
                                          color: _carminePastel,
                                          fontWeight: FontWeight.w600,
                                          decoration: TextDecoration.underline,
                                        ),
                                      ),
                                    ),
                                  ),
                                  const TextSpan(text: ' y la '),
                                  WidgetSpan(
                                    child: GestureDetector(
                                      onTap: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(
                                            builder: (context) => const PrivacyPolicyPage(),
                                          ),
                                        );
                                      },
                                      child: const Text(
                                        'política de privacidad',
                                        style: TextStyle(
                                          color: _carminePastel,
                                          fontWeight: FontWeight.w600,
                                          decoration: TextDecoration.underline,
                                        ),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                // Register Button with Animation
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
                                      _nameController.text.isEmpty ||
                                      _emailController.text.isEmpty ||
                                      _passwordController.text.isEmpty ||
                                      _confirmPasswordController.text.isEmpty ||
                                      !_acceptTerms
                                  ? null
                                  : _handleRegister,
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
                                          'Creando cuenta...',
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
                                          'Crear Cuenta',
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
                const SizedBox(height: 24),
                // Divider
                SlideTransition(
                  position: _formSlideAnimation,
                  child: FadeTransition(
                    opacity: _formFadeAnimation,
                    child: Row(
                      children: [
                        Expanded(child: Divider(color: AppTheme.darkSurfaceVariant)),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: Text(
                            '¿Ya tienes cuenta?',
                            style: TextStyle(color: AppTheme.white, fontSize: 12),
                          ),
                        ),
                        Expanded(child: Divider(color: AppTheme.darkSurfaceVariant)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                // Login Button with Animation
                SlideTransition(
                  position: _formSlideAnimation,
                  child: FadeTransition(
                    opacity: _formFadeAnimation,
                    child: OutlinedButton(
                      onPressed: () => context.go('/login'),
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
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Text(
                            'Iniciar Sesión',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.login, size: 18),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                // Footer
                SlideTransition(
                  position: _formSlideAnimation,
                  child: FadeTransition(
                    opacity: _formFadeAnimation,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.shield_outlined, size: 16, color: AppTheme.white),
                        const SizedBox(width: 8),
                        Text(
                          'Tus datos están protegidos y seguros',
                          style: TextStyle(color: AppTheme.white, fontSize: 12),
                        ),
                      ],
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

// Widget con efecto holográfico para el texto
class _HolographicText extends StatelessWidget {
  final String text;
  final double fontSize;
  final Animation<double> animation;

  const _HolographicText({
    required this.text,
    required this.fontSize,
    required this.animation,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        return ShaderMask(
          shaderCallback: (bounds) {
            return LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color.lerp(
                  const Color(0xFF00E5FF),
                  const Color(0xFF7B1FA2),
                  animation.value,
                )!,
                Color.lerp(
                  const Color(0xFF7B1FA2),
                  const Color(0xFFFF00E5),
                  animation.value,
                )!,
                Color.lerp(
                  const Color(0xFFFF00E5),
                  const Color(0xFF00E5FF),
                  animation.value,
                )!,
              ],
              stops: [
                0.0,
                0.5 + (animation.value * 0.3),
                1.0,
              ],
            ).createShader(bounds);
          },
          child: Stack(
            children: [
              // Texto principal con sombra
              Text(
                text,
                style: TextStyle(
                  fontSize: fontSize,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  shadows: [
                    Shadow(
                      color: Color.lerp(
                        const Color(0xFF00E5FF).withOpacity(0.8),
                        const Color(0xFFFF00E5).withOpacity(0.8),
                        animation.value,
                      )!,
                      blurRadius: 20,
                      offset: const Offset(0, 0),
                    ),
                    Shadow(
                      color: Color.lerp(
                        const Color(0xFF7B1FA2).withOpacity(0.6),
                        const Color(0xFF00E5FF).withOpacity(0.6),
                        animation.value,
                      )!,
                      blurRadius: 30,
                      offset: const Offset(0, 0),
                    ),
                  ],
                ),
              ),
              // Efecto de brillo animado
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment(
                        -1.0 + (animation.value * 2.0),
                        -0.5,
                      ),
                      end: Alignment(
                        1.0 - (animation.value * 2.0),
                        1.5,
                      ),
                      colors: [
                        Colors.transparent,
                        Colors.white.withOpacity(0.3 * (0.5 + (animation.value * 0.5))),
                        Colors.transparent,
                      ],
                      stops: [
                        0.0,
                        0.5,
                        1.0,
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
