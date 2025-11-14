part of 'work_sections.dart';

  Widget _buildProjects(BuildContext context) {
    final completedProjects = _projects.where((p) {
      if (p.goals.isEmpty) return false;
      final completedGoals = p.goals.where((g) => g.completed == true).length;
      return completedGoals == p.goals.length && p.goals.isNotEmpty;
    }).length;
    final activeProjects = _projects.length - completedProjects;
    final totalGoals = _projects.fold(0, (sum, p) => sum + p.goals.length);
    final completedGoals = _projects.fold(0, (sum, p) => sum + p.goals.where((g) => g.completed == true).length);
    
    final content = SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
              // Header mejorado con paleta profesional
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Colors.blue.withOpacity(0.2),
                      AppTheme.darkSurface,
                      AppTheme.darkSurfaceVariant,
                    ],
                  ),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.blue.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Icon(
                        Icons.folder_special,
                        size: 32,
                        color: AppTheme.white,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Proyectos',
                            style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Gestiona y organiza tus proyectos',
                            style: TextStyle(
                              fontSize: 14,
                              color: AppTheme.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              
              // Resumen de proyectos mejorado
              Row(
                children: [
                  Expanded(
                    child: _buildSummaryCard(
                      icon: Icons.rocket_launch,
                      value: '$activeProjects',
                      label: 'Proyectos Activos',
                      color: context.pro.accent,
                      gradientColors: [context.pro.accent, context.pro.secondary],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildSummaryCard(
                      icon: Icons.check_circle,
                      value: '$completedProjects',
                      label: 'Completados',
                      color: context.pro.teal,
                      gradientColors: [context.pro.teal, Colors.green],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: _buildSummaryCard(
                      icon: Icons.flag,
                      value: '$completedGoals/$totalGoals',
                      label: 'Metas',
                      color: AppTheme.white,
                      gradientColors: [context.pro.indigo, context.pro.accent],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              
              // Lista de proyectos
              if (_projects.isEmpty)
                _buildEmptyState(
                  'No hay proyectos creados',
                  Icons.folder_open,
                  'Crea tu primer proyecto para comenzar',
                  'Nuevo Proyecto',
                  () {
                    setState(() {
                      _showAddProjectModal = true;
                    });
                  },
                  context.pro.accent,
                  [context.pro.primary, context.pro.secondary],
                )
              else
                ..._projects.asMap().entries.map((entry) {
                  final index = entry.key;
                  final project = entry.value;
                  return _buildProjectCard(project, index);
                }),
        ],
      ),
    );
    
    // Envolver en Stack para mostrar el modal
    return Stack(
      children: [
        content,
        if (_showAddProjectModal) _buildAddProjectModal(),
      ],
    );
  }
  
  Widget _buildAddProjectModal() {
    return Container(
      color: Colors.black.withOpacity(0.85),
      child: SafeArea(
        child: Center(
          child: Container(
            margin: const EdgeInsets.all(16),
            constraints: BoxConstraints(
              maxHeight: MediaQuery.of(context).size.height * 0.92,
              maxWidth: 500,
            ),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant.withOpacity(0.8),
                  context.pro.primary.withOpacity(0.1),
                  AppTheme.darkSurface,
                ],
                stops: const [0.0, 0.3, 0.7, 1.0],
              ),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(
                color: context.pro.accent.withOpacity(0.4),
                width: 2,
              ),
              boxShadow: [
                BoxShadow(
                  color: context.pro.primary.withOpacity(0.4),
                  blurRadius: 30,
                  spreadRadius: 8,
                  offset: const Offset(0, 8),
                ),
                BoxShadow(
                  color: context.pro.accent.withOpacity(0.2),
                  blurRadius: 15,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: ClipRRect(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                // Header mejorado con gradiente
                Container(
                  padding: const EdgeInsets.fromLTRB(28, 28, 28, 24),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        context.pro.primary,
                        context.pro.secondary,
                        context.pro.accent,
                        context.pro.secondary,
                      ],
                      stops: const [0.0, 0.3, 0.7, 1.0],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: context.pro.primary.withOpacity(0.3),
                        blurRadius: 15,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              Colors.white.withOpacity(0.25),
                              Colors.white.withOpacity(0.15),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.4),
                            width: 1.5,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.folder_special,
                          color: AppTheme.white,
                          size: 32,
                        ),
                      ),
                      const SizedBox(width: 18),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _editingProjectId != null ? 'Editar Proyecto' : 'Agregar Proyecto',
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                                letterSpacing: 0.8,
                                shadows: [
                                  Shadow(
                                    color: Colors.black26,
                                    blurRadius: 4,
                                    offset: Offset(0, 2),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              _editingProjectId != null
                                  ? 'Modifica los datos del proyecto.'
                                  : 'Crea un proyecto.',
                              style: TextStyle(
                                fontSize: 14,
                                color: AppTheme.white.withOpacity(0.85),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              Colors.white.withOpacity(0.25),
                              Colors.white.withOpacity(0.15),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.3),
                            width: 1.5,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.15),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.close, color: AppTheme.white),
                          onPressed: () {
                            setState(() {
                              _showAddProjectModal = false;
                              _clearProjectModal();
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                ),
                
                // Tabs para navegar entre secciones
                Container(
                  margin: const EdgeInsets.fromLTRB(24, 0, 24, 8),
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        AppTheme.darkSurfaceVariant.withOpacity(0.6),
                        AppTheme.darkSurface.withOpacity(0.8),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: context.pro.accent.withOpacity(0.2),
                      width: 1.2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: _buildProjectModalTab('basic', 'Básica'),
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: _buildProjectModalTab('goals', 'Metas'),
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: _buildProjectModalTab('strategy', 'Estrategia'),
                      ),
                    ],
                  ),
                ),
                
                // Contenido con scroll
                Flexible(
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      maxHeight: MediaQuery.of(context).size.height * 0.5,
                    ),
                    child: SingleChildScrollView(
                      padding: const EdgeInsets.fromLTRB(24, 8, 24, 16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (_activeProjectModalTab == 'basic') ...[
                        // Sección: Información Básica
                        Container(
                          margin: const EdgeInsets.only(top: 8),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                context.pro.primary.withOpacity(0.15),
                                context.pro.secondary.withOpacity(0.1),
                                AppTheme.darkSurfaceVariant.withOpacity(0.3),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: context.pro.primary.withOpacity(0.3),
                              width: 1,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [context.pro.primary, context.pro.secondary],
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Icon(
                                      Icons.info_outline,
                                      color: AppTheme.white,
                                      size: 20,
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  const Text(
                                    'Información Básica',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.white,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 20),
                              
                              // Nombre del proyecto
                              TextField(
                                controller: _projectNameController,
                                style: const TextStyle(
                                  color: AppTheme.white,
                                  fontSize: 16,
                                ),
                                decoration: InputDecoration(
                                  labelText: 'Nombre del Proyecto',
                                  labelStyle: TextStyle(
                                    color: AppTheme.white,
                                    fontWeight: FontWeight.w500,
                                  ),
                                  hintText: 'Ej: Desarrollo Web App',
                                  hintStyle: TextStyle(
                                    color: AppTheme.white,
                                  ),
                                  prefixIcon: Icon(
                                    Icons.title,
                                    color: context.pro.accent,
                                  ),
                                  filled: true,
                                  fillColor: AppTheme.darkSurface.withOpacity(0.6),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.accent.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.accent.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.accent,
                                      width: 2,
                                    ),
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 16,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),
                              
                              // Descripción
                              TextField(
                                controller: _projectDescriptionController,
                                style: const TextStyle(
                                  color: AppTheme.white,
                                  fontSize: 15,
                                ),
                                maxLines: 4,
                                decoration: InputDecoration(
                                  labelText: 'Descripción del Proyecto',
                                  labelStyle: TextStyle(
                                    color: AppTheme.white,
                                    fontWeight: FontWeight.w500,
                                  ),
                                  hintText: 'Describe brevemente el objetivo del proyecto...',
                                  hintStyle: TextStyle(
                                    color: AppTheme.white,
                                  ),
                                  prefixIcon: Padding(
                                    padding: const EdgeInsets.only(bottom: 60),
                                    child: Icon(
                                      Icons.description,
                                      color: context.pro.accent,
                                    ),
                                  ),
                                  filled: true,
                                  fillColor: AppTheme.darkSurface.withOpacity(0.6),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.accent.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.accent.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.accent,
                                      width: 2,
                                    ),
                                  ),
                                  contentPadding: const EdgeInsets.all(16),
                                ),
                              ),
                              const SizedBox(height: 16),
                              
                              // Fecha límite mejorada
                              GestureDetector(
                                onTap: () async {
                                  final date = await showDatePicker(
                                    context: context,
                                    initialDate: _selectedProjectDeadline ?? DateTime.now(),
                                    firstDate: DateTime(2020),
                                    lastDate: DateTime(2030),
                                  );
                                  if (date != null) {
                                    setState(() => _selectedProjectDeadline = date);
                                  }
                                },
                                child: Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: _selectedProjectDeadline != null
                                          ? [
                                              context.pro.teal.withOpacity(0.3),
                                              context.pro.accent.withOpacity(0.2),
                                            ]
                                          : [
                                              AppTheme.darkSurface.withOpacity(0.6),
                                              AppTheme.darkSurfaceVariant.withOpacity(0.4),
                                            ],
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: _selectedProjectDeadline != null
                                          ? context.pro.teal.withOpacity(0.5)
                                          : context.pro.accent.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                          gradient: LinearGradient(
                                            colors: _selectedProjectDeadline != null
                                                ? [context.pro.teal, context.pro.accent]
                                                : [
                                                    context.pro.accent.withOpacity(0.5),
                                                    context.pro.secondary.withOpacity(0.5),
                                                  ],
                                          ),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Icon(
                                          Icons.calendar_today,
                                          color: AppTheme.white,
                                          size: 20,
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              'Fecha Límite',
                                              style: TextStyle(
                                                fontSize: 12,
                                                color: AppTheme.white,
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              _selectedProjectDeadline != null
                                                  ? DateFormat('EEEE, d MMMM yyyy', 'es').format(_selectedProjectDeadline!)
                                                  : 'Toca para seleccionar fecha',
                                              style: TextStyle(
                                                fontSize: 14,
                                                color: _selectedProjectDeadline != null
                                                    ? AppTheme.white
                                                    : AppTheme.white,
                                                fontWeight: _selectedProjectDeadline != null
                                                    ? FontWeight.w600
                                                    : FontWeight.normal,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Icon(
                                        Icons.arrow_forward_ios,
                                        size: 16,
                                        color: context.pro.accent,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                          ],
                          if (_activeProjectModalTab == 'goals') ...[
                        // Sección: Metas del Proyecto
                        Container(
                          margin: const EdgeInsets.only(top: 8),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                context.pro.indigo.withOpacity(0.15),
                                context.pro.accent.withOpacity(0.1),
                                AppTheme.darkSurfaceVariant.withOpacity(0.3),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: context.pro.indigo.withOpacity(0.3),
                              width: 1,
                            ),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [context.pro.indigo, context.pro.accent],
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Icon(
                                      Icons.flag,
                                      color: AppTheme.white,
                                      size: 20,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  const Text(
                                    'Metas del Proyecto',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.white,
                                    ),
                                  ),
                                  const Spacer(),
                                  if (_tempProjectGoals.isNotEmpty)
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        gradient: LinearGradient(
                                          colors: [context.pro.indigo, context.pro.accent],
                                        ),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        '${_tempProjectGoals.length}',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                          color: AppTheme.white,
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                              const SizedBox(height: 20),
                              
                              // Campo de texto de la meta
                              TextField(
                                controller: _tempGoalTextController,
                                style: const TextStyle(
                                  color: AppTheme.white,
                                  fontSize: 15,
                                ),
                                decoration: InputDecoration(
                                  labelText: 'Descripción de la Meta',
                                  labelStyle: TextStyle(
                                    color: AppTheme.white,
                                    fontWeight: FontWeight.w500,
                                  ),
                                  hintText: 'Ej: Completar diseño de interfaz',
                                  hintStyle: TextStyle(
                                    color: AppTheme.white,
                                  ),
                                  prefixIcon: Icon(
                                    Icons.flag,
                                    color: context.pro.indigo,
                                  ),
                                  filled: true,
                                  fillColor: AppTheme.darkSurface.withOpacity(0.6),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.indigo.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.indigo.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.indigo,
                                      width: 2,
                                    ),
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 16,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 12),
                              
                              // Campo para responsable
                              TextField(
                                controller: _tempGoalPersonController,
                                style: const TextStyle(
                                  color: AppTheme.white,
                                  fontSize: 14,
                                ),
                                decoration: InputDecoration(
                                  labelText: 'Responsable',
                                  labelStyle: TextStyle(
                                    color: AppTheme.white,
                                    fontWeight: FontWeight.w500,
                                  ),
                                  hintText: 'Nombre',
                                  hintStyle: TextStyle(
                                    color: AppTheme.white,
                                  ),
                                  prefixIcon: Icon(
                                    Icons.person,
                                    color: context.pro.teal,
                                    size: 20,
                                  ),
                                  filled: true,
                                  fillColor: AppTheme.darkSurface.withOpacity(0.6),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.teal.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  enabledBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.teal.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  focusedBorder: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(12),
                                    borderSide: BorderSide(
                                      color: context.pro.teal,
                                      width: 2,
                                    ),
                                  ),
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 16,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 12),
                              
                              // Campo para fecha
                              GestureDetector(
                                onTap: () async {
                                  final date = await showDatePicker(
                                    context: context,
                                    initialDate: _tempGoalDate ?? DateTime.now(),
                                    firstDate: DateTime(2020),
                                    lastDate: DateTime(2030),
                                  );
                                  if (date != null) {
                                    setState(() => _tempGoalDate = date);
                                  }
                                },
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: _tempGoalDate != null
                                          ? [
                                              context.pro.teal.withOpacity(0.3),
                                              context.pro.accent.withOpacity(0.2),
                                            ]
                                          : [
                                              AppTheme.darkSurface.withOpacity(0.6),
                                              AppTheme.darkSurfaceVariant.withOpacity(0.4),
                                            ],
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: _tempGoalDate != null
                                          ? context.pro.teal.withOpacity(0.5)
                                          : context.pro.teal.withOpacity(0.3),
                                      width: 1,
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        Icons.calendar_today,
                                        color: _tempGoalDate != null
                                            ? context.pro.teal
                                            : AppTheme.white,
                                        size: 18,
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          _tempGoalDate != null
                                              ? DateFormat('dd/MM/yyyy').format(_tempGoalDate!)
                                              : 'Fecha',
                                          style: TextStyle(
                                            fontSize: 14,
                                            color: _tempGoalDate != null
                                                ? AppTheme.white
                                                : AppTheme.white,
                                            fontWeight: _tempGoalDate != null
                                                ? FontWeight.w600
                                                : FontWeight.normal,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(height: 16),
                              
                              // Botón para agregar meta mejorado
                              SizedBox(
                                width: double.infinity,
                                child: Container(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        context.pro.indigo,
                                        context.pro.accent,
                                        context.pro.teal,
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                    boxShadow: [
                                      BoxShadow(
                                        color: context.pro.indigo.withOpacity(0.4),
                                        blurRadius: 8,
                                        offset: const Offset(0, 4),
                                      ),
                                    ],
                                  ),
                                  child: ElevatedButton.icon(
                                  onPressed: () {
                                    if (_tempGoalTextController.text.trim().isNotEmpty) {
                                      // Validar que la fecha de la meta no sea posterior a la fecha límite del proyecto
                                      if (_selectedProjectDeadline != null && _tempGoalDate != null) {
                                        // Comparar solo las fechas (sin hora)
                                        final goalDateOnly = DateTime(_tempGoalDate!.year, _tempGoalDate!.month, _tempGoalDate!.day);
                                        final deadlineDateOnly = DateTime(_selectedProjectDeadline!.year, _selectedProjectDeadline!.month, _selectedProjectDeadline!.day);
                                        
                                        if (goalDateOnly.isAfter(deadlineDateOnly)) {
                                          // Mostrar diálogo de advertencia
                                          showDialog(
                                            context: context,
                                            builder: (BuildContext context) {
                                              return AlertDialog(
                                                backgroundColor: AppTheme.darkSurface,
                                                shape: RoundedRectangleBorder(
                                                  borderRadius: BorderRadius.circular(20),
                                                ),
                                                title: Row(
                                                  children: [
                                                    Container(
                                                      padding: const EdgeInsets.all(8),
                                                      decoration: BoxDecoration(
                                                        color: Colors.red.withOpacity(0.2),
                                                        borderRadius: BorderRadius.circular(8),
                                                      ),
                                                      child: const Icon(
                                                        Icons.warning_amber_rounded,
                                                        color: Colors.red,
                                                        size: 24,
                                                      ),
                                                    ),
                                                    const SizedBox(width: 12),
                                                    const Expanded(
                                                      child: Text(
                                                        'Fecha Inválida',
                                                        style: TextStyle(
                                                          color: AppTheme.white,
                                                          fontSize: 18,
                                                          fontWeight: FontWeight.bold,
                                                        ),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                content: Column(
                                                  mainAxisSize: MainAxisSize.min,
                                                  crossAxisAlignment: CrossAxisAlignment.start,
                                                  children: [
                                                    const Text(
                                                      'La fecha de la meta no puede ser posterior a la fecha límite del proyecto.',
                                                      style: TextStyle(
                                                        color: AppTheme.white,
                                                        fontSize: 14,
                                                      ),
                                                    ),
                                                    const SizedBox(height: 16),
                                                    Container(
                                                      padding: const EdgeInsets.all(12),
                                                      decoration: BoxDecoration(
                                                        color: AppTheme.darkBackground,
                                                        borderRadius: BorderRadius.circular(8),
                                                      ),
                                                      child: Column(
                                                        crossAxisAlignment: CrossAxisAlignment.start,
                                                        children: [
                                                          Row(
                                                            children: [
                                                              const Icon(Icons.calendar_today, size: 16, color: AppTheme.white),
                                                              const SizedBox(width: 8),
                                                              const Text(
                                                                'Fecha de la meta:',
                                                                style: TextStyle(
                                                                  color: AppTheme.white,
                                                                  fontSize: 12,
                                                                ),
                                                              ),
                                                            ],
                                                          ),
                                                          const SizedBox(height: 4),
                                                          Text(
                                                            DateFormat('EEEE, d MMMM yyyy', 'es').format(_tempGoalDate!),
                                                            style: const TextStyle(
                                                              color: AppTheme.white,
                                                              fontSize: 14,
                                                              fontWeight: FontWeight.w600,
                                                            ),
                                                          ),
                                                          const SizedBox(height: 12),
                                                          Row(
                                                            children: [
                                                              const Icon(Icons.event_busy, size: 16, color: AppTheme.white),
                                                              const SizedBox(width: 8),
                                                              const Text(
                                                                'Fecha límite del proyecto:',
                                                                style: TextStyle(
                                                                  color: AppTheme.white,
                                                                  fontSize: 12,
                                                                ),
                                                              ),
                                                            ],
                                                          ),
                                                          const SizedBox(height: 4),
                                                          Text(
                                                            DateFormat('EEEE, d MMMM yyyy', 'es').format(_selectedProjectDeadline!),
                                                            style: const TextStyle(
                                                              color: AppTheme.white,
                                                              fontSize: 14,
                                                              fontWeight: FontWeight.w600,
                                                            ),
                                                          ),
                                                        ],
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                actions: [
                                                  TextButton(
                                                    onPressed: () => Navigator.of(context).pop(),
                                                    child: const Text(
                                                      'Entendido',
                                                      style: TextStyle(
                                                        color: AppTheme.orangeAccent,
                                                        fontWeight: FontWeight.bold,
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                              );
                                            },
                                          );
                                          return;
                                        }
                                      }
                                      
                                      setState(() {
                                        _tempProjectGoals.add(ProjectGoal(
                                          id: DateTime.now().millisecondsSinceEpoch.toString(),
                                          text: _tempGoalTextController.text.trim(),
                                          person: _tempGoalPersonController.text.trim().isNotEmpty
                                              ? _tempGoalPersonController.text.trim()
                                              : null,
                                          date: _tempGoalDate,
                                        ));
                                        _tempGoalTextController.clear();
                                        _tempGoalPersonController.clear();
                                        _tempGoalDate = null;
                                      });
                                    } else {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        const SnackBar(content: Text('Por favor ingresa una descripción para la meta')),
                                      );
                                    }
                                  },
                                  icon: const Icon(Icons.add_circle_outline, size: 22),
                                  label: const Text(
                                    'Agregar Meta',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.transparent,
                                    foregroundColor: AppTheme.white,
                                    shadowColor: Colors.transparent,
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 24,
                                      vertical: 14,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                              const SizedBox(height: 16),
                              
                              // Lista de metas agregadas mejorada
                              if (_tempProjectGoals.isNotEmpty)
                                Container(
                                  padding: const EdgeInsets.all(20),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        context.pro.indigo.withOpacity(0.25),
                                        context.pro.accent.withOpacity(0.18),
                                        AppTheme.darkSurfaceVariant.withOpacity(0.35),
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: context.pro.indigo.withOpacity(0.5),
                                      width: 1.5,
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: context.pro.indigo.withOpacity(0.15),
                                        blurRadius: 12,
                                        offset: const Offset(0, 4),
                                      ),
                                    ],
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.all(8),
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                colors: [context.pro.indigo, context.pro.accent],
                                              ),
                                              borderRadius: BorderRadius.circular(10),
                                            ),
                                            child: const Icon(
                                              Icons.checklist_rounded,
                                              color: AppTheme.white,
                                              size: 20,
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: Text(
                                              'Metas Agregadas',
                                              style: TextStyle(
                                                fontSize: 16,
                                                fontWeight: FontWeight.bold,
                                                color: AppTheme.white,
                                                letterSpacing: 0.5,
                                              ),
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                colors: [context.pro.indigo, context.pro.accent],
                                              ),
                                              borderRadius: BorderRadius.circular(12),
                                              boxShadow: [
                                                BoxShadow(
                                                  color: context.pro.indigo.withOpacity(0.4),
                                                  blurRadius: 6,
                                                  offset: const Offset(0, 2),
                                                ),
                                              ],
                                            ),
                                            child: Text(
                                              '${_tempProjectGoals.length}',
                                              style: const TextStyle(
                                                fontSize: 13,
                                                fontWeight: FontWeight.bold,
                                                color: AppTheme.white,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 16),
                                      ..._tempProjectGoals.asMap().entries.map((entry) {
                                        final index = entry.key;
                                        final goal = entry.value;
                                        return TweenAnimationBuilder<double>(
                                          tween: Tween(begin: 0.0, end: 1.0),
                                          duration: Duration(milliseconds: 300 + (index * 50)),
                                          builder: (context, value, child) {
                                            return Opacity(
                                              opacity: value,
                                              child: Transform.translate(
                                                offset: Offset(0, 20 * (1 - value)),
                                                child: child,
                                              ),
                                            );
                                          },
                                          child: Container(
                                            margin: const EdgeInsets.only(bottom: 12),
                                            padding: const EdgeInsets.all(16),
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                begin: Alignment.topLeft,
                                                end: Alignment.bottomRight,
                                                colors: [
                                                  AppTheme.darkSurface.withOpacity(0.9),
                                                  AppTheme.darkSurfaceVariant.withOpacity(0.7),
                                                ],
                                              ),
                                              borderRadius: BorderRadius.circular(14),
                                              border: Border.all(
                                                color: context.pro.indigo.withOpacity(0.4),
                                                width: 1.5,
                                              ),
                                              boxShadow: [
                                                BoxShadow(
                                                  color: context.pro.indigo.withOpacity(0.15),
                                                  blurRadius: 10,
                                                  offset: const Offset(0, 3),
                                                ),
                                              ],
                                            ),
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Row(
                                                  children: [
                                                    Container(
                                                      width: 36,
                                                      height: 36,
                                                      decoration: BoxDecoration(
                                                        gradient: LinearGradient(
                                                          colors: [context.pro.indigo, context.pro.accent],
                                                        ),
                                                        borderRadius: BorderRadius.circular(18),
                                                        boxShadow: [
                                                          BoxShadow(
                                                            color: context.pro.indigo.withOpacity(0.5),
                                                            blurRadius: 6,
                                                            offset: const Offset(0, 3),
                                                          ),
                                                        ],
                                                      ),
                                                      child: Center(
                                                        child: Text(
                                                          '${index + 1}',
                                                          style: const TextStyle(
                                                            fontSize: 15,
                                                            fontWeight: FontWeight.bold,
                                                            color: AppTheme.white,
                                                          ),
                                                        ),
                                                      ),
                                                    ),
                                                    const SizedBox(width: 14),
                                                    Expanded(
                                                      child: Text(
                                                        goal.text,
                                                        style: const TextStyle(
                                                          color: AppTheme.white,
                                                          fontSize: 16,
                                                          fontWeight: FontWeight.w600,
                                                          letterSpacing: 0.2,
                                                        ),
                                                      ),
                                                    ),
                                                    const SizedBox(width: 8),
                                                    Container(
                                                      decoration: BoxDecoration(
                                                        color: Colors.red.withOpacity(0.15),
                                                        borderRadius: BorderRadius.circular(10),
                                                        border: Border.all(
                                                          color: Colors.red.withOpacity(0.3),
                                                          width: 1,
                                                        ),
                                                      ),
                                                      child: IconButton(
                                                        icon: const Icon(Icons.close_rounded, size: 18, color: Colors.red),
                                                        padding: const EdgeInsets.all(8),
                                                        constraints: const BoxConstraints(),
                                                        onPressed: () {
                                                          setState(() {
                                                            _tempProjectGoals.removeWhere((g) => g.id == goal.id);
                                                          });
                                                        },
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                if (goal.person != null || goal.date != null) ...[
                                                  const SizedBox(height: 16),
                                                  Container(
                                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                                                    decoration: BoxDecoration(
                                                      gradient: LinearGradient(
                                                        begin: Alignment.topLeft,
                                                        end: Alignment.bottomRight,
                                                        colors: [
                                                          context.pro.indigo.withOpacity(0.15),
                                                          context.pro.accent.withOpacity(0.1),
                                                        ],
                                                      ),
                                                      borderRadius: BorderRadius.circular(10),
                                                      border: Border.all(
                                                        color: context.pro.indigo.withOpacity(0.3),
                                                        width: 1,
                                                      ),
                                                    ),
                                                    child: Column(
                                                      crossAxisAlignment: CrossAxisAlignment.start,
                                                      children: [
                                                        if (goal.person != null) ...[
                                                          Row(
                                                            children: [
                                                              Container(
                                                                padding: const EdgeInsets.all(7),
                                                                decoration: BoxDecoration(
                                                                  gradient: LinearGradient(
                                                                    colors: [context.pro.teal, context.pro.accent],
                                                                  ),
                                                                  borderRadius: BorderRadius.circular(8),
                                                                  boxShadow: [
                                                                    BoxShadow(
                                                                      color: context.pro.teal.withOpacity(0.3),
                                                                      blurRadius: 4,
                                                                      offset: const Offset(0, 2),
                                                                    ),
                                                                  ],
                                                                ),
                                                                child: const Icon(
                                                                  Icons.person_rounded,
                                                                  size: 16,
                                                                  color: AppTheme.white,
                                                                ),
                                                              ),
                                                              const SizedBox(width: 10),
                                                              Expanded(
                                                                child: Text(
                                                                  goal.person!,
                                                                  style: const TextStyle(
                                                                    fontSize: 14,
                                                                    color: AppTheme.white,
                                                                    fontWeight: FontWeight.w600,
                                                                  ),
                                                                ),
                                                              ),
                                                            ],
                                                          ),
                                                        ],
                                                        if (goal.person != null && goal.date != null)
                                                          const SizedBox(height: 12),
                                                        if (goal.date != null) ...[
                                                          Row(
                                                            children: [
                                                              Container(
                                                                padding: const EdgeInsets.all(7),
                                                                decoration: BoxDecoration(
                                                                  gradient: LinearGradient(
                                                                    colors: [context.pro.teal, context.pro.accent],
                                                                  ),
                                                                  borderRadius: BorderRadius.circular(8),
                                                                  boxShadow: [
                                                                    BoxShadow(
                                                                      color: context.pro.teal.withOpacity(0.3),
                                                                      blurRadius: 4,
                                                                      offset: const Offset(0, 2),
                                                                    ),
                                                                  ],
                                                                ),
                                                                child: const Icon(
                                                                  Icons.calendar_today_rounded,
                                                                  size: 16,
                                                                  color: AppTheme.white,
                                                                ),
                                                              ),
                                                              const SizedBox(width: 10),
                                                              Expanded(
                                                                child: Text(
                                                                  DateFormat('dd MMM yyyy', 'es').format(goal.date!),
                                                                  style: const TextStyle(
                                                                    fontSize: 14,
                                                                    color: AppTheme.white,
                                                                    fontWeight: FontWeight.w600,
                                                                  ),
                                                                ),
                                                              ),
                                                            ],
                                                          ),
                                                        ],
                                                      ],
                                                    ),
                                                  ),
                                                ],
                                              ],
                                            ),
                                          ),
                                        );
                                      }),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          ],
                          if (_activeProjectModalTab == 'strategy') ...[
                        // Sección: Estrategia del Proyecto
                        Container(
                          margin: const EdgeInsets.only(top: 8),
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                context.pro.indigo.withOpacity(0.2),
                                context.pro.accent.withOpacity(0.15),
                                AppTheme.darkSurfaceVariant.withOpacity(0.35),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: context.pro.indigo.withOpacity(0.4),
                              width: 1.5,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: context.pro.indigo.withOpacity(0.15),
                                blurRadius: 12,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [context.pro.indigo, context.pro.accent],
                                      ),
                                      borderRadius: BorderRadius.circular(12),
                                      boxShadow: [
                                        BoxShadow(
                                          color: context.pro.indigo.withOpacity(0.4),
                                          blurRadius: 8,
                                          offset: const Offset(0, 3),
                                        ),
                                      ],
                                    ),
                                    child: const Icon(
                                      Icons.track_changes_rounded,
                                      color: AppTheme.white,
                                      size: 22,
                                    ),
                                  ),
                                  const SizedBox(width: 14),
                                  const Expanded(
                                    child: Text(
                                      'Estrategia del Proyecto',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.white,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 24),
                              
                              // COMPAÑEROS DE EQUIPO
                              _buildStrategySectionHeader('Compañeros de equipo', Icons.people),
                              const SizedBox(height: 12),
                              _buildAddTeammateForm(),
                              const SizedBox(height: 12),
                              if (_tempProjectTeammates.isNotEmpty)
                                ..._tempProjectTeammates.map((teammate) => _buildTeammateCard(teammate)),
                              
                              const SizedBox(height: 24),
                              
                              // LOGROS
                              _buildStrategySectionHeader('Logros', Icons.star),
                              const SizedBox(height: 12),
                              _buildAddAchievementForm(),
                              const SizedBox(height: 12),
                              if (_tempProjectAchievements.isNotEmpty)
                                ..._tempProjectAchievements.map((achievement) => _buildAchievementCard(achievement)),
                              
                              const SizedBox(height: 24),
                              
                              // TRABAJOS
                              _buildStrategySectionHeader('Actividades', Icons.work),
                              const SizedBox(height: 12),
                              _buildAddWorkForm(),
                              const SizedBox(height: 12),
                              if (_tempProjectWorks.isNotEmpty)
                                ..._tempProjectWorks.map((work) => _buildWorkCard(work)),
                              
                              const SizedBox(height: 24),
                              
                              // FINANCIAMIENTO
                              _buildStrategySectionHeader('Financiamiento', null),
                              const SizedBox(height: 12),
                              _buildAddFundingForm(),
                              const SizedBox(height: 12),
                              if (_tempProjectFunding.isNotEmpty)
                                ..._tempProjectFunding.map((funding) => _buildFundingCard(funding)),
                            ],
                          ),
                        ),
                          ],
                        ],
                    ),
                  ),
                ),
                ),
                
                // Footer con botones de acción mejorados
                Container(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 40),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        AppTheme.darkSurface.withOpacity(0.8),
                        AppTheme.darkSurface,
                      ],
                    ),
                    border: Border(
                      top: BorderSide(
                        color: context.pro.accent.withOpacity(0.2),
                        width: 1,
                      ),
                    ),
                  ),
                  child: SafeArea(
                    top: false,
                    child: Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {
                              setState(() {
                                _showAddProjectModal = false;
                                _projectNameController.clear();
                                _projectDescriptionController.clear();
                                _tempProjectGoals.clear();
                                _tempGoalTextController.clear();
                                _tempGoalPersonController.clear();
                                _tempGoalDate = null;
                                _selectedProjectDeadline = null;
                                _activeProjectModalTab = 'basic';
                                _tempProjectTeammates.clear();
                                _tempProjectAchievements.clear();
                                _tempProjectWorks.clear();
                                _tempProjectFunding.clear();
                                _tempTeammateNameController.clear();
                                _tempTeammateRoleController.clear();
                                _tempAchievementNameController.clear();
                                _tempAchievementDueDateController.clear();
                                _tempWorkPositionController.clear();
                                _tempWorkAppointController.clear();
                                _tempWorkStatusController.clear();
                                _tempWorkNotesController.clear();
                                _tempFundingElementController.clear();
                                _tempFundingNotesController.clear();
                                _tempAchievementDueDate = null;
                                _tempWorkStartDate = null;
                                _tempWorkDeadline = null;
                              });
                            },
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AppTheme.white,
                              side: BorderSide(
                                color: AppTheme.white.withOpacity(0.3),
                                width: 1.5,
                              ),
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text(
                              'Cancelar',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          flex: 2,
                          child: Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  context.pro.primary,
                                  context.pro.secondary,
                                  context.pro.accent,
                                ],
                              ),
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color: context.pro.accent.withOpacity(0.4),
                                  blurRadius: 12,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: ElevatedButton.icon(
                              onPressed: _addProject,
                              icon: Container(
                                padding: const EdgeInsets.all(4),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Icon(
                                  _editingProjectId != null ? Icons.save : Icons.add_task,
                                  size: 22,
                                ),
                              ),
                              label: Text(
                                _editingProjectId != null ? 'Guardar Cambios' : 'Crear Proyecto',
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 0.5,
                                  shadows: [
                                    Shadow(
                                      color: Colors.black26,
                                      blurRadius: 4,
                                      offset: Offset(0, 2),
                                    ),
                                  ],
                                ),
                              ),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                foregroundColor: AppTheme.white,
                                shadowColor: Colors.transparent,
                                padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(14),
                                  side: BorderSide(
                                    color: Colors.white.withOpacity(0.3),
                                    width: 1.5,
                                  ),
                                ),
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
      ),
    );
  }
  
  void _editProject(WorkProject project) {
    setState(() {
      _editingProjectId = project.id;
      _projectNameController.text = project.title;
      _projectDescriptionController.text = project.aim;
      _selectedProjectDeadline = project.deadline;
      _tempProjectTeammates = List.from(project.teammates);
      _tempProjectAchievements = List.from(project.achievements);
      _tempProjectWorks = List.from(project.works);
      _tempProjectFunding = List.from(project.funding);
      _tempProjectGoals = List.from(project.goals);
      _activeProjectModalTab = 'basic';
      _showAddProjectModal = true;
    });
  }
  
  void _clearProjectModal() {
    _editingProjectId = null;
    _projectNameController.clear();
    _projectDescriptionController.clear();
    _tempProjectGoals.clear();
    _tempGoalTextController.clear();
    _tempGoalPersonController.clear();
    _tempGoalDate = null;
    _selectedProjectDeadline = null;
    _activeProjectModalTab = 'basic';
    _tempProjectTeammates.clear();
    _tempProjectAchievements.clear();
    _tempProjectWorks.clear();
    _tempProjectFunding.clear();
    _tempTeammateNameController.clear();
    _tempTeammateRoleController.clear();
    _tempAchievementNameController.clear();
    _tempAchievementDueDateController.clear();
    _tempWorkPositionController.clear();
    _tempWorkAppointController.clear();
    _tempWorkStatusController.clear();
    _tempWorkNotesController.clear();
    _tempFundingElementController.clear();
    _tempFundingFondoController.clear();
    _tempFundingFinanciadoPorController.clear();
    _tempFundingNotesController.clear();
    _tempAchievementDueDate = null;
    _tempWorkStartDate = null;
    _tempWorkDeadline = null;
  }
  
  void _addProject() {
    if (_projectNameController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingresa un nombre para el proyecto')),
      );
      return;
    }
    
    setState(() {
      if (_editingProjectId != null) {
        // Actualizar proyecto existente
        final projectIndex = _projects.indexWhere((p) => p.id == _editingProjectId);
        if (projectIndex != -1) {
          final existingProject = _projects[projectIndex];
          _projects[projectIndex] = WorkProject(
            id: existingProject.id,
            title: _projectNameController.text.trim(),
            aim: _projectDescriptionController.text.trim(),
            startDate: existingProject.startDate,
            deadline: _selectedProjectDeadline,
            teammates: List<ProjectTeammate>.from(_tempProjectTeammates),
            achievements: List<ProjectAchievement>.from(_tempProjectAchievements),
            works: List<ProjectWork>.from(_tempProjectWorks),
            funding: List<ProjectFunding>.from(_tempProjectFunding),
            goals: List<ProjectGoal>.from(_tempProjectGoals),
            overview: existingProject.overview,
          );
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Proyecto actualizado exitosamente'),
              backgroundColor: Colors.green,
              duration: Duration(seconds: 2),
            ),
          );
        }
      } else {
        // Crear nuevo proyecto con copias de las listas para evitar referencias
        _projects.add(WorkProject(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          title: _projectNameController.text.trim(),
          aim: _projectDescriptionController.text.trim(),
          startDate: DateTime.now(),
          deadline: _selectedProjectDeadline,
          teammates: List<ProjectTeammate>.from(_tempProjectTeammates),
          achievements: List<ProjectAchievement>.from(_tempProjectAchievements),
          works: List<ProjectWork>.from(_tempProjectWorks),
          funding: List<ProjectFunding>.from(_tempProjectFunding),
          goals: List<ProjectGoal>.from(_tempProjectGoals),
          overview: null,
        ));
      }
      _showAddProjectModal = false;
      _clearProjectModal();
    });
  }

  Widget _buildProjectModalTab(String tabId, String label) {
    final isActive = _activeProjectModalTab == tabId;
    
    // Asignar icono según el tabId
    IconData icon;
    switch (tabId) {
      case 'basic':
        icon = Icons.info_outline;
        break;
      case 'goals':
        icon = Icons.flag;
        break;
      case 'strategy':
        icon = Icons.track_changes;
        break;
      default:
        icon = Icons.circle;
    }
    
    return GestureDetector(
      onTap: () {
        setState(() {
          _activeProjectModalTab = tabId;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 6),
        decoration: BoxDecoration(
          gradient: isActive
              ? LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    context.pro.primary,
                    context.pro.secondary,
                    context.pro.accent,
                  ],
                  stops: const [0.0, 0.5, 1.0],
                )
              : null,
          color: isActive ? null : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          border: isActive
              ? Border.all(
                  color: Colors.white.withOpacity(0.3),
                  width: 1.2,
                )
              : null,
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: context.pro.primary.withOpacity(0.4),
                    blurRadius: 8,
                    spreadRadius: 0.5,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              padding: const EdgeInsets.all(3),
              decoration: BoxDecoration(
                color: isActive
                    ? Colors.white.withOpacity(0.2)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(5),
              ),
              child: Icon(
                icon,
                size: 14,
                color: isActive ? AppTheme.white : AppTheme.white,
              ),
            ),
            const SizedBox(width: 4),
            Flexible(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
                  color: isActive ? AppTheme.white : AppTheme.white,
                  letterSpacing: 0.2,
                ),
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildStrategySectionHeader(String title, IconData? icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            context.pro.indigo.withOpacity(0.35),
            context.pro.accent.withOpacity(0.25),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.5),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.2),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          if (icon != null) ...[
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [context.pro.teal, context.pro.accent],
                ),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: AppTheme.white, size: 18),
            ),
            const SizedBox(width: 12),
          ],
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: AppTheme.white,
                letterSpacing: 0.3,
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAddTeammateForm() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurfaceVariant.withOpacity(0.4),
            AppTheme.darkSurface.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          TextField(
            controller: _tempTeammateNameController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Nombre',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _tempTeammateRoleController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Rol/Puesto',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [context.pro.indigo, context.pro.accent],
                ),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: context.pro.indigo.withOpacity(0.4),
                    blurRadius: 6,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                onPressed: () {
                  if (_tempTeammateNameController.text.trim().isNotEmpty &&
                      _tempTeammateRoleController.text.trim().isNotEmpty) {
                    setState(() {
                      _tempProjectTeammates.add(ProjectTeammate(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        name: _tempTeammateNameController.text.trim(),
                        role: _tempTeammateRoleController.text.trim(),
                      ));
                      _tempTeammateNameController.clear();
                      _tempTeammateRoleController.clear();
                    });
                  }
                },
                icon: const Icon(Icons.add_rounded, color: AppTheme.white, size: 20),
                label: const Text(
                  'Agregar Compañero',
                  style: TextStyle(
                    color: AppTheme.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildTeammateCard(ProjectTeammate teammate) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurface.withOpacity(0.8),
            AppTheme.darkSurfaceVariant.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [context.pro.teal, context.pro.accent],
              ),
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: context.pro.teal.withOpacity(0.3),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const Icon(
              Icons.person_rounded,
              color: AppTheme.white,
              size: 18,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  teammate.name,
                  style: const TextStyle(
                    color: AppTheme.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.2,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  teammate.role,
                  style: TextStyle(
                    color: AppTheme.white,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: Colors.red.withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: Colors.red.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: IconButton(
              icon: const Icon(Icons.close_rounded, size: 18, color: Colors.red),
              padding: const EdgeInsets.all(8),
              constraints: const BoxConstraints(),
              onPressed: () {
                setState(() {
                  _tempProjectTeammates.removeWhere((t) => t.id == teammate.id);
                });
              },
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAddAchievementForm() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurfaceVariant.withOpacity(0.4),
            AppTheme.darkSurface.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          TextField(
            controller: _tempAchievementNameController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Nombre del logro',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          GestureDetector(
            onTap: () async {
              final date = await showDatePicker(
                context: context,
                initialDate: _tempAchievementDueDate ?? DateTime.now(),
                firstDate: DateTime(2020),
                lastDate: DateTime(2030),
              );
              if (date != null) {
                setState(() {
                  _tempAchievementDueDate = date;
                  _tempAchievementDueDateController.text = DateFormat('dd/MM/yyyy').format(date);
                });
              }
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    context.pro.indigo.withOpacity(0.3),
                    context.pro.accent.withOpacity(0.2),
                  ],
                ),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: context.pro.indigo.withOpacity(0.4),
                  width: 1.5,
                ),
              ),
              child: Row(
                children: [
                  Icon(Icons.calendar_today_rounded, size: 16, color: context.pro.indigo),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _tempAchievementDueDate != null
                          ? DateFormat('dd/MM/yyyy').format(_tempAchievementDueDate!)
                          : 'Fecha',
                      style: TextStyle(
                        color: _tempAchievementDueDate != null
                            ? AppTheme.white
                            : AppTheme.white,
                        fontSize: 13,
                        fontWeight: _tempAchievementDueDate != null
                            ? FontWeight.w600
                            : FontWeight.normal,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [context.pro.indigo, context.pro.accent],
                ),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: context.pro.indigo.withOpacity(0.4),
                    blurRadius: 6,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                onPressed: () {
                  if (_tempAchievementNameController.text.trim().isNotEmpty) {
                    setState(() {
                      _tempProjectAchievements.add(ProjectAchievement(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        text: _tempAchievementNameController.text.trim(),
                        date: _tempAchievementDueDate,
                      ));
                      _tempAchievementNameController.clear();
                      _tempAchievementDueDateController.clear();
                      _tempAchievementDueDate = null;
                    });
                  }
                },
                icon: const Icon(Icons.add_rounded, color: AppTheme.white, size: 20),
                label: const Text(
                  'Agregar Logro',
                  style: TextStyle(
                    color: AppTheme.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAchievementCard(ProjectAchievement achievement) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurface.withOpacity(0.8),
            AppTheme.darkSurfaceVariant.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [context.pro.teal, context.pro.accent],
              ),
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: context.pro.teal.withOpacity(0.3),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const Icon(
              Icons.star_rounded,
              color: AppTheme.white,
              size: 18,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  achievement.text,
                  style: const TextStyle(
                    color: AppTheme.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.2,
                  ),
                ),
                if (achievement.date != null) ...[
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      Icon(Icons.calendar_today_rounded, size: 14, color: AppTheme.white),
                      const SizedBox(width: 6),
                      Text(
                        DateFormat('dd MMM yyyy', 'es').format(achievement.date!),
                        style: TextStyle(
                          color: AppTheme.white,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: Colors.red.withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: Colors.red.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: IconButton(
              icon: const Icon(Icons.close_rounded, size: 18, color: Colors.red),
              padding: const EdgeInsets.all(8),
              constraints: const BoxConstraints(),
              onPressed: () {
                setState(() {
                  _tempProjectAchievements.removeWhere((a) => a.id == achievement.id);
                });
              },
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildAddWorkForm() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurfaceVariant.withOpacity(0.4),
            AppTheme.darkSurface.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          TextField(
            controller: _tempWorkPositionController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Posición',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _tempWorkAppointController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Asignación',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _tempWorkStatusController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Estado',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          GestureDetector(
            onTap: () async {
              final date = await showDatePicker(
                context: context,
                initialDate: _tempWorkStartDate ?? DateTime.now(),
                firstDate: DateTime(2020),
                lastDate: DateTime(2030),
              );
              if (date != null) {
                setState(() => _tempWorkStartDate = date);
              }
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    context.pro.indigo.withOpacity(0.3),
                    context.pro.accent.withOpacity(0.2),
                  ],
                ),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: context.pro.indigo.withOpacity(0.4),
                  width: 1.5,
                ),
              ),
              child: Row(
                children: [
                  Icon(Icons.calendar_today_rounded, size: 16, color: context.pro.indigo),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _tempWorkStartDate != null
                          ? DateFormat('dd/MM/yyyy').format(_tempWorkStartDate!)
                          : 'Fecha de Inicio',
                      style: TextStyle(
                        color: _tempWorkStartDate != null
                            ? AppTheme.white
                            : AppTheme.white,
                        fontSize: 13,
                        fontWeight: _tempWorkStartDate != null
                            ? FontWeight.w600
                            : FontWeight.normal,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),
          GestureDetector(
            onTap: () async {
              final date = await showDatePicker(
                context: context,
                initialDate: _tempWorkDeadline ?? DateTime.now(),
                firstDate: DateTime(2020),
                lastDate: DateTime(2030),
              );
              if (date != null) {
                setState(() => _tempWorkDeadline = date);
              }
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    context.pro.indigo.withOpacity(0.3),
                    context.pro.accent.withOpacity(0.2),
                  ],
                ),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: context.pro.indigo.withOpacity(0.4),
                  width: 1.5,
                ),
              ),
              child: Row(
                children: [
                  Icon(Icons.event_rounded, size: 16, color: context.pro.indigo),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _tempWorkDeadline != null
                          ? DateFormat('dd/MM/yyyy').format(_tempWorkDeadline!)
                          : 'Fecha Límite',
                      style: TextStyle(
                        color: _tempWorkDeadline != null
                            ? AppTheme.white
                            : AppTheme.white,
                        fontSize: 13,
                        fontWeight: _tempWorkDeadline != null
                            ? FontWeight.w600
                            : FontWeight.normal,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _tempWorkNotesController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            maxLines: 3,
            decoration: InputDecoration(
              hintText: 'Notas (opcional)',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [context.pro.indigo, context.pro.accent],
                ),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: context.pro.indigo.withOpacity(0.4),
                    blurRadius: 6,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                onPressed: () {
                  if (_tempWorkPositionController.text.trim().isNotEmpty &&
                      _tempWorkAppointController.text.trim().isNotEmpty &&
                      _tempWorkStatusController.text.trim().isNotEmpty) {
                    setState(() {
                      _tempProjectWorks.add(ProjectWork(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        position: _tempWorkPositionController.text.trim(),
                        appoint: _tempWorkAppointController.text.trim(),
                        status: _tempWorkStatusController.text.trim(),
                        startDate: _tempWorkStartDate,
                        deadline: _tempWorkDeadline,
                        notes: _tempWorkNotesController.text.trim().isNotEmpty
                            ? _tempWorkNotesController.text.trim()
                            : null,
                      ));
                      _tempWorkPositionController.clear();
                      _tempWorkAppointController.clear();
                      _tempWorkStatusController.clear();
                      _tempWorkNotesController.clear();
                      _tempWorkStartDate = null;
                      _tempWorkDeadline = null;
                    });
                  }
                },
                icon: const Icon(Icons.add_rounded, color: AppTheme.white, size: 20),
                label: const Text(
                  'Agregar Actividad',
                  style: TextStyle(
                    color: AppTheme.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildWorkCard(ProjectWork work) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurface.withOpacity(0.8),
            AppTheme.darkSurfaceVariant.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [context.pro.teal, context.pro.accent],
                  ),
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: context.pro.teal.withOpacity(0.3),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.work_rounded,
                  color: AppTheme.white,
                  size: 18,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      work.position,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.2,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      work.appoint,
                      style: TextStyle(
                        color: AppTheme.white,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: Colors.red.withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: IconButton(
                  icon: const Icon(Icons.close_rounded, size: 18, color: Colors.red),
                  padding: const EdgeInsets.all(8),
                  constraints: const BoxConstraints(),
                  onPressed: () {
                    setState(() {
                      _tempProjectWorks.removeWhere((w) => w.id == work.id);
                    });
                  },
                ),
              ),
            ],
          ),
          if (work.status.isNotEmpty) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [context.pro.indigo.withOpacity(0.3), context.pro.accent.withOpacity(0.2)],
                ),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: context.pro.indigo.withOpacity(0.4),
                  width: 1,
                ),
              ),
              child: Text(
                'Estado: ${work.status}',
                style: const TextStyle(
                  color: AppTheme.white,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
          if (work.startDate != null || work.deadline != null) ...[
            const SizedBox(height: 12),
            Row(
              children: [
                if (work.startDate != null) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          context.pro.indigo.withOpacity(0.2),
                          context.pro.accent.withOpacity(0.15),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: context.pro.indigo.withOpacity(0.3),
                        width: 1,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.calendar_today_rounded, size: 14, color: context.pro.indigo),
                        const SizedBox(width: 6),
                        Text(
                          DateFormat('dd/MM/yyyy').format(work.startDate!),
                          style: const TextStyle(
                            color: AppTheme.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                if (work.startDate != null && work.deadline != null)
                  const SizedBox(width: 10),
                if (work.deadline != null) ...[
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          context.pro.indigo.withOpacity(0.2),
                          context.pro.accent.withOpacity(0.15),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: context.pro.indigo.withOpacity(0.3),
                        width: 1,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.event_rounded, size: 14, color: context.pro.indigo),
                        const SizedBox(width: 6),
                        Text(
                          DateFormat('dd/MM/yyyy').format(work.deadline!),
                          style: const TextStyle(
                            color: AppTheme.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ],
          if (work.notes != null && work.notes!.isNotEmpty) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    context.pro.indigo.withOpacity(0.15),
                    context.pro.accent.withOpacity(0.1),
                  ],
                ),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(Icons.note_rounded, size: 14, color: AppTheme.white),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      work.notes!,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontSize: 12,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
  
  Widget _buildAddFundingForm() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurfaceVariant.withOpacity(0.4),
            AppTheme.darkSurface.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.3),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          TextField(
            controller: _tempFundingElementController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              prefixIcon: Container(
                margin: const EdgeInsets.all(8),
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [context.pro.indigo.withOpacity(0.4), context.pro.accent.withOpacity(0.3)],
                  ),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: context.pro.indigo.withOpacity(0.5),
                    width: 1,
                  ),
                ),
                child: const Icon(
                  Icons.attach_money_rounded,
                  color: AppTheme.white,
                  size: 18,
                ),
              ),
              hintText: 'Elemento',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _tempFundingFondoController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Fondo a financiar',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _tempFundingFinanciadoPorController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            decoration: InputDecoration(
              hintText: 'Por quién',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          TextField(
            controller: _tempFundingNotesController,
            style: const TextStyle(color: AppTheme.white, fontSize: 13),
            maxLines: 3,
            decoration: InputDecoration(
              hintText: 'Notas (opcional)',
              hintStyle: const TextStyle(color: AppTheme.white, fontSize: 13),
              filled: true,
              fillColor: AppTheme.darkBackground.withOpacity(0.5),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo.withOpacity(0.3),
                  width: 1,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: context.pro.indigo,
                  width: 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [context.pro.indigo, context.pro.accent],
                ),
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: context.pro.indigo.withOpacity(0.4),
                    blurRadius: 6,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                onPressed: () {
                  if (_tempFundingElementController.text.trim().isNotEmpty) {
                    setState(() {
                      _tempProjectFunding.add(ProjectFunding(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        element: _tempFundingElementController.text.trim(),
                        fondo: _tempFundingFondoController.text.trim().isNotEmpty
                            ? _tempFundingFondoController.text.trim()
                            : null,
                        financiadoPor: _tempFundingFinanciadoPorController.text.trim().isNotEmpty
                            ? _tempFundingFinanciadoPorController.text.trim()
                            : null,
                        notes: _tempFundingNotesController.text.trim().isNotEmpty
                            ? _tempFundingNotesController.text.trim()
                            : null,
                      ));
                      _tempFundingElementController.clear();
                      _tempFundingFondoController.clear();
                      _tempFundingFinanciadoPorController.clear();
                      _tempFundingNotesController.clear();
                    });
                  }
                },
                icon: const Icon(Icons.add_rounded, color: AppTheme.white, size: 20),
                label: const Text(
                  'Agregar Financiamiento',
                  style: TextStyle(
                    color: AppTheme.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildFundingCard(ProjectFunding funding) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.darkSurface.withOpacity(0.8),
            AppTheme.darkSurfaceVariant.withOpacity(0.6),
          ],
        ),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: context.pro.indigo.withOpacity(0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: context.pro.indigo.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [context.pro.teal, context.pro.accent],
              ),
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: context.pro.teal.withOpacity(0.3),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: const Icon(
              Icons.attach_money_rounded,
              color: AppTheme.white,
              size: 18,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  funding.element,
                  style: const TextStyle(
                    color: AppTheme.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.2,
                  ),
                ),
                if (funding.fondo != null || funding.financiadoPor != null) ...[
                  const SizedBox(height: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (funding.fondo != null) ...[
                        Row(
                          children: [
                            Icon(Icons.account_balance_wallet_rounded, size: 14, color: AppTheme.white),
                            const SizedBox(width: 6),
                            Text(
                              'Fondo: ${funding.fondo}',
                              style: TextStyle(
                                color: AppTheme.white,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ],
                      if (funding.fondo != null && funding.financiadoPor != null)
                        const SizedBox(height: 6),
                      if (funding.financiadoPor != null) ...[
                        Row(
                          children: [
                            Icon(Icons.person_rounded, size: 14, color: AppTheme.white),
                            const SizedBox(width: 6),
                            Text(
                              'Por: ${funding.financiadoPor}',
                              style: TextStyle(
                                color: AppTheme.white,
                                fontSize: 13,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),
                ],
                if (funding.projectedCost != null || funding.realCost != null) ...[
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      if (funding.projectedCost != null) ...[
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                context.pro.indigo.withOpacity(0.3),
                                context.pro.accent.withOpacity(0.2),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: context.pro.indigo.withOpacity(0.4),
                              width: 1,
                            ),
                          ),
                          child: Text(
                            'Proyectado: \$${funding.projectedCost!.toStringAsFixed(2)}',
                            style: const TextStyle(
                              color: AppTheme.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                      if (funding.projectedCost != null && funding.realCost != null)
                        const SizedBox(width: 10),
                      if (funding.realCost != null) ...[
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                context.pro.teal.withOpacity(0.3),
                                context.pro.accent.withOpacity(0.2),
                              ],
                            ),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: context.pro.teal.withOpacity(0.4),
                              width: 1,
                            ),
                          ),
                          child: Text(
                            'Real: \$${funding.realCost!.toStringAsFixed(2)}',
                            style: const TextStyle(
                              color: AppTheme.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
                if (funding.notes != null && funding.notes!.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          context.pro.indigo.withOpacity(0.15),
                          context.pro.accent.withOpacity(0.1),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: context.pro.indigo.withOpacity(0.3),
                        width: 1,
                      ),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Icon(Icons.note_rounded, size: 14, color: AppTheme.white),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            funding.notes!,
                            style: const TextStyle(
                              color: AppTheme.white,
                              fontSize: 12,
                              fontStyle: FontStyle.italic,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: Colors.red.withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: Colors.red.withOpacity(0.3),
                width: 1,
              ),
            ),
            child: IconButton(
              icon: const Icon(Icons.close_rounded, size: 18, color: Colors.red),
              padding: const EdgeInsets.all(8),
              constraints: const BoxConstraints(),
              onPressed: () {
                setState(() {
                  _tempProjectFunding.removeWhere((f) => f.id == funding.id);
                });
              },
            ),
          ),
        ],
      ),
    );
  }

