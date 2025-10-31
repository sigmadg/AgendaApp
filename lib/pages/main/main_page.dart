import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/personal/personal_sections.dart';

class MainPage extends StatelessWidget {
  const MainPage({super.key});

  @override
  Widget build(BuildContext context) {
    // Obtener el parámetro 'section' de la ruta
    final uri = GoRouterState.of(context).uri;
    final section = uri.queryParameters['section'];
    
    return PersonalSections(initialSection: section);
  }
}



