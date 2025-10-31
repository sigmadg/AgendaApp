import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

/// Widget que envuelve el contenido con la imagen de fondo
class AppBackground extends StatelessWidget {
  final Widget child;
  
  const AppBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        image: DecorationImage(
          image: AssetImage('assets/images/fondo.png'),
          fit: BoxFit.cover,
          repeat: ImageRepeat.noRepeat,
        ),
        color: AppTheme.darkBackground,
      ),
      child: child,
    );
  }
}

