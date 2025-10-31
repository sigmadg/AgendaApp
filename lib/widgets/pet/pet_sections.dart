import 'package:flutter/material.dart';
import '../../models/pet/pet_care_plan.dart';
import '../../models/pet/pet.dart';
import '../../theme/app_theme.dart';

class PetSections extends StatefulWidget {
  const PetSections({super.key});

  @override
  State<PetSections> createState() => _PetSectionsState();
}

class _PetSectionsState extends State<PetSections> {
  String _activeSection = 'pet-care-planner';
  
  List<PetCarePlan> _carePlans = [];
  List<Pet> _pets = [];

  final sections = [
    {'id': 'pet-care-planner', 'name': 'Planificador de Cuidado', 'icon': Icons.pets},
    {'id': 'puppy-planner', 'name': 'Planificador de Cachorros', 'icon': Icons.cake},
    {'id': 'wellness-scheduler', 'name': 'Programador de Bienestar', 'icon': Icons.favorite},
    {'id': 'animal-organizer', 'name': 'Organizador de Animales', 'icon': Icons.auto_awesome},
    {'id': 'pet-schedule', 'name': 'Horario de Mascotas', 'icon': Icons.schedule},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBackground,
      body: Column(
        children: [
          _buildSectionTabs(),
          Expanded(
            child: _buildActiveSection(),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTabs() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: sections.map((section) {
            final isActive = _activeSection == section['id'];
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4),
              child: GestureDetector(
                onTap: () => setState(() => _activeSection = section['id'] as String),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: isActive ? AppTheme.orangeAccent : AppTheme.darkSurface,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        section['icon'] as IconData,
                        color: isActive ? AppTheme.white : AppTheme.white60,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        section['name'] as String,
                        style: TextStyle(
                          color: isActive ? AppTheme.white : AppTheme.white60,
                          fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildActiveSection() {
    switch (_activeSection) {
      case 'pet-care-planner':
        return _buildPetCarePlanner();
      case 'puppy-planner':
        return _buildPuppyPlanner();
      case 'wellness-scheduler':
        return _buildWellnessScheduler();
      case 'animal-organizer':
        return _buildAnimalOrganizer();
      case 'pet-schedule':
        return _buildPetSchedule();
      default:
        return _buildPetCarePlanner();
    }
  }

  Widget _buildPetCarePlanner() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'PLANIFICADOR DE CUIDADO',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add, color: AppTheme.white),
                onPressed: () {},
              ),
            ],
          ),
        ),
        Expanded(
          child: _carePlans.isEmpty
              ? _buildEmptyState('No hay planes de cuidado registrados', Icons.pets)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _carePlans.length,
                  itemBuilder: (context, index) => _buildCarePlanCard(_carePlans[index]),
                ),
        ),
      ],
    );
  }

  Widget _buildPuppyPlanner() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'PLANIFICADOR DE CACHORROS',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add, color: AppTheme.white),
                onPressed: () {},
              ),
            ],
          ),
        ),
        Expanded(
          child: _pets.isEmpty
              ? _buildEmptyState('No hay cachorros registrados', Icons.cake)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _pets.length,
                  itemBuilder: (context, index) => _buildPetCard(_pets[index]),
                ),
        ),
      ],
    );
  }

  Widget _buildWellnessScheduler() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.favorite, size: 64, color: AppTheme.white40),
          const SizedBox(height: 16),
          const Text(
            'Programador de Bienestar',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Funcionalidad en desarrollo',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.white60,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAnimalOrganizer() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.auto_awesome, size: 64, color: AppTheme.white40),
          const SizedBox(height: 16),
          const Text(
            'Organizador de Animales',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Funcionalidad en desarrollo',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.white60,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPetSchedule() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.schedule, size: 64, color: AppTheme.white40),
          const SizedBox(height: 16),
          const Text(
            'Horario de Mascotas',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Funcionalidad en desarrollo',
            style: TextStyle(
              fontSize: 14,
              color: AppTheme.white60,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(String message, IconData icon) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 64, color: AppTheme.white40),
          const SizedBox(height: 16),
          Text(
            message,
            style: const TextStyle(
              fontSize: 16,
              color: AppTheme.white60,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCarePlanCard(PetCarePlan plan) {
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        plan.activity,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Mascota: ${plan.petName}',
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppTheme.white70,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getStatusColor(plan.status),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getStatusLabel(plan.status),
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const Icon(Icons.access_time, size: 16, color: AppTheme.white60),
                const SizedBox(width: 4),
                Text(
                  plan.time,
                  style: const TextStyle(fontSize: 14, color: AppTheme.white70),
                ),
                const SizedBox(width: 16),
                const Icon(Icons.repeat, size: 16, color: AppTheme.white60),
                const SizedBox(width: 4),
                Text(
                  plan.frequency,
                  style: const TextStyle(fontSize: 14, color: AppTheme.white70),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPetCard(Pet pet) {
    return Card(
      color: AppTheme.darkSurface,
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: AppTheme.orangeAccent.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                Icons.pets,
                size: 32,
                color: AppTheme.orangeAccent,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    pet.name,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${pet.type} • ${pet.breed}',
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppTheme.white70,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    pet.gender,
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppTheme.white60,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'completed':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'skipped':
        return Colors.red;
      default:
        return AppTheme.darkSurfaceVariant;
    }
  }

  String _getStatusLabel(String status) {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'skipped':
        return 'Omitido';
      default:
        return status;
    }
  }
}

