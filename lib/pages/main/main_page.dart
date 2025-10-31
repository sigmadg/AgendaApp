import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/personal/personal_sections.dart';

class MainPage extends StatelessWidget {
  const MainPage({super.key});

  @override
  Widget build(BuildContext context) {
    // Siempre mostrar 'events' (Eventos del día) como sección inicial
    return const PersonalSections(initialSection: 'events');
  }
}



