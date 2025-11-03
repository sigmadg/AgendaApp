import 'package:flutter/material.dart';

/// Widget que envuelve el contenido con fondo negro
class AppBackground extends StatelessWidget {
  final Widget child;
  
  const AppBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.black,
      ),
      child: child,
    );
  }
}

