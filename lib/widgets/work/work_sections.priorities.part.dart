part of 'work_sections.dart';

  Widget _buildPrioritiesFocusGoals(BuildContext context) {
    return Column(
      children: [
        // Header mejorado con paleta profesional
        Container(
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.all(20),
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
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: context.pro.secondary.withOpacity(0.3),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: const Icon(Icons.dashboard, color: AppTheme.white, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Gestión de prioridades',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const Text(
                      'Gestiona tus prioridades, áreas de enfoque y objetivos',
                      style: TextStyle(
                        fontSize: 14,
                        color: AppTheme.white70,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        
        // Pestañas para navegar entre las tres secciones
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16),
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: AppTheme.darkSurfaceVariant,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Expanded(
                child: _buildSubSectionTab('priorities', 'Prioridades', Icons.priority_high),
              ),
              Expanded(
                child: _buildSubSectionTab('focus', 'Enfoque', Icons.center_focus_strong),
              ),
              Expanded(
                child: _buildSubSectionTab('goals', 'Objetivos', Icons.flag),
              ),
            ],
          ),
        ),
        
        // Contenido según la pestaña activa
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: _activeSubSection == 'priorities'
                ? _buildPrioritiesContent()
                : _activeSubSection == 'focus'
                    ? _buildFocusContent()
                    : _buildGoalsContent(),
          ),
        ),
      ],
    );
  }

  Widget _buildSubSectionTab(String id, String label, IconData icon) {
    final isActive = _activeSubSection == id;
    return GestureDetector(
      onTap: () {
        setState(() {
          _activeSubSection = id;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          gradient: isActive
              ? LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [context.pro.primary, context.pro.secondary],
                )
              : null,
          color: isActive ? null : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 20,
              color: isActive ? AppTheme.white : AppTheme.white60,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                color: isActive ? AppTheme.white : AppTheme.white60,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPrioritiesContent() {
    final priorityColors = [
      context.pro.indigo,
      context.pro.teal,
      context.pro.secondary,
      context.pro.accent,
      context.pro.slate,
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Formulario para agregar prioridad
        if (_priorities.length < 5)
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  context.pro.primary.withOpacity(0.2),
                  context.pro.secondary.withOpacity(0.15),
                  AppTheme.darkSurface.withOpacity(0.8),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: context.pro.accent.withOpacity(0.3),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: context.pro.accent.withOpacity(0.15),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _priorityController,
                    style: const TextStyle(
                      color: AppTheme.white,
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                    ),
                    decoration: InputDecoration(
                      hintText: 'Escribe una nueva prioridad...',
                      hintStyle: TextStyle(
                        color: AppTheme.white60,
                        fontSize: 15,
                      ),
                      filled: true,
                      fillColor: AppTheme.darkBackground.withOpacity(0.5),
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
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    ),
                    onSubmitted: (_) => _addPriority(),
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [context.pro.accent, context.pro.secondary],
                    ),
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                        color: context.pro.accent.withOpacity(0.4),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: ElevatedButton(
                    onPressed: _addPriority,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      foregroundColor: AppTheme.white,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                      padding: const EdgeInsets.all(14),
                    ),
                    child: const Icon(Icons.add_rounded, size: 24),
                  ),
                ),
              ],
            ),
          ),
        const SizedBox(height: 20),
        
        // Lista de prioridades
        if (_priorities.isEmpty)
          _buildEmptyState('No hay prioridades definidas\nEscribe una prioridad arriba y toca el botón +', Icons.priority_high)
        else
          ..._priorities.asMap().entries.map((entry) {
            final index = entry.key;
            final priority = entry.value;
            return _buildPriorityCard(priority, index, priorityColors);
          }),
      ],
    );
  }

  Widget _buildFocusContent() {
    final focusColors = [Colors.indigo, Colors.cyan, Colors.purple, Colors.pink, Colors.orange];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Formulario para agregar enfoque
        if (_focus.length < 5)
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.indigo.withOpacity(0.2),
                  Colors.purple.withOpacity(0.15),
                  AppTheme.darkSurface.withOpacity(0.8),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: Colors.indigo.withOpacity(0.3),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.indigo.withOpacity(0.15),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _focusController,
                    style: const TextStyle(
                      color: AppTheme.white,
                      fontSize: 15,
                      fontWeight: FontWeight.w500,
                    ),
                    decoration: InputDecoration(
                      hintText: 'Escribe un nuevo enfoque...',
                      hintStyle: TextStyle(
                        color: AppTheme.white60,
                        fontSize: 15,
                      ),
                      filled: true,
                      fillColor: AppTheme.darkBackground.withOpacity(0.5),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: Colors.indigo.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: Colors.indigo.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: Colors.indigo,
                          width: 2,
                        ),
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    ),
                    onSubmitted: (_) => _addFocus(),
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.indigo, Colors.purple],
                    ),
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.indigo.withOpacity(0.4),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: ElevatedButton(
                    onPressed: _addFocus,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      foregroundColor: AppTheme.white,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                      padding: const EdgeInsets.all(14),
                    ),
                    child: const Icon(Icons.add_rounded, size: 24),
                  ),
                ),
              ],
            ),
          ),
        const SizedBox(height: 20),
        
        // Lista de enfoques
        if (_focus.isEmpty)
          _buildEmptyState('No hay enfoques definidos\nEscribe un enfoque arriba y toca el botón +', Icons.center_focus_strong)
        else
          ..._focus.asMap().entries.map((entry) {
            final index = entry.key;
            final focusItem = entry.value;
            return _buildFocusCard(focusItem, index, focusColors);
          }),
      ],
    );
  }

  Widget _buildGoalsContent() {
    final goalsColors = [const Color(0xFF6366F1), Colors.teal, Colors.amber, Colors.red, Colors.grey];
    // Calcular progreso basado en metas completadas
    final totalMilestones = _goals.fold<int>(0, (sum, goal) {
      final milestones = goal['milestones'] as List<dynamic>? ?? [];
      return sum + milestones.length;
    });
    final completedMilestones = _goals.fold<int>(0, (sum, goal) {
      final milestones = goal['milestones'] as List<dynamic>? ?? [];
      return sum + milestones.where((m) => m['completed'] == true).length;
    });
    final progressPercentage = totalMilestones > 0 
        ? ((completedMilestones / totalMilestones) * 100).round() 
        : 0;
    final completedGoals = _goals.where((g) {
      final milestones = g['milestones'] as List<dynamic>? ?? [];
      if (milestones.isEmpty) return false;
      return milestones.every((m) => m['completed'] == true);
    }).length;
    final totalGoals = _goals.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Resumen de objetivos
        Row(
          children: [
            Expanded(
              child: _buildSummaryCard(
                icon: Icons.check_circle_outline,
                value: '$completedGoals/$totalGoals',
                label: 'Objetivos',
                color: context.pro.teal,
                gradientColors: [context.pro.teal, context.pro.accent],
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildSummaryCard(
                icon: Icons.trending_up,
                value: '$progressPercentage%',
                label: 'Progreso',
                subtitle: '$completedMilestones/$totalMilestones metas',
                color: context.pro.accent,
                gradientColors: [context.pro.accent, context.pro.secondary],
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        
          // Formulario para agregar objetivo
          if (_goals.length < 5)
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    context.pro.teal.withOpacity(0.2),
                    context.pro.accent.withOpacity(0.15),
                    AppTheme.darkSurface.withOpacity(0.8),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: context.pro.teal.withOpacity(0.3),
                  width: 1.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: context.pro.teal.withOpacity(0.15),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _goalController,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                      ),
                      decoration: InputDecoration(
                        hintText: 'Escribe un nuevo objetivo...',
                        hintStyle: TextStyle(
                          color: AppTheme.white60,
                          fontSize: 15,
                        ),
                        filled: true,
                        fillColor: AppTheme.darkBackground.withOpacity(0.5),
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
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      ),
                      onSubmitted: (_) => _addGoal(),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [context.pro.teal, context.pro.accent],
                      ),
                      borderRadius: BorderRadius.circular(14),
                      boxShadow: [
                        BoxShadow(
                          color: context.pro.teal.withOpacity(0.4),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: ElevatedButton(
                      onPressed: _addGoal,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        foregroundColor: AppTheme.white,
                        shadowColor: Colors.transparent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                        padding: const EdgeInsets.all(14),
                      ),
                      child: const Icon(Icons.add_rounded, size: 24),
                    ),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 20),
          
          // Lista de objetivos
        if (_goals.isEmpty)
          _buildEmptyState('No hay objetivos definidos\nDefine tus objetivos para comenzar', Icons.flag)
        else
          ..._goals.asMap().entries.map((entry) {
            final index = entry.key;
            final goal = entry.value;
            return _buildGoalCard(goal, index, goalsColors);
          }),
      ],
    );
  }

  Widget _buildFocus() {
    final focusColors = [Colors.indigo, Colors.cyan, Colors.purple, Colors.pink, Colors.orange];
    
    return SingleChildScrollView(
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
                  context.pro.primary,
                  context.pro.secondary,
                  context.pro.accent,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: context.pro.secondary.withOpacity(0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: const Icon(Icons.center_focus_strong, color: AppTheme.white, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Enfoque',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const Text(
                        'Define tus áreas de enfoque y concentración',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white70,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Formulario para agregar enfoque
          if (_focus.length < 5)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _focusController,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        hintText: 'Escribe un nuevo enfoque...',
                        hintStyle: const TextStyle(color: AppTheme.white60),
                        filled: true,
                        fillColor: AppTheme.darkSurfaceVariant,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: (_) => _addFocus(),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: _addFocus,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: context.pro.accent,
                      foregroundColor: AppTheme.white,
                      shape: const CircleBorder(),
                      padding: const EdgeInsets.all(12),
                    ),
                    child: const Icon(Icons.add),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 20),
          
          // Lista de enfoques
          if (_focus.isEmpty)
            _buildEmptyState('No hay enfoques definidos\nEscribe un enfoque arriba y toca el botón +', Icons.center_focus_strong)
          else
            ..._focus.asMap().entries.map((entry) {
              final index = entry.key;
              final focusItem = entry.value;
              return _buildFocusCard(focusItem, index, focusColors);
            }),
        ],
      ),
    );
  }
  
  void _addFocus() {
    if (_focusController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingresa un enfoque')),
      );
      return;
    }
    
    if (_focus.length >= 5) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Solo puedes tener 5 enfoques')),
      );
      return;
    }
    
    setState(() {
      _focus.add({
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'text': _focusController.text.trim(),
        'completed': false,
      });
      _focusController.clear();
    });
  }

  Widget _buildGoals() {
    final goalsColors = [const Color(0xFF6366F1), Colors.teal, Colors.amber, Colors.red, Colors.grey];
    // Calcular progreso basado en metas completadas
    final totalMilestones = _goals.fold<int>(0, (sum, goal) {
      final milestones = goal['milestones'] as List<dynamic>? ?? [];
      return sum + milestones.length;
    });
    final completedMilestones = _goals.fold<int>(0, (sum, goal) {
      final milestones = goal['milestones'] as List<dynamic>? ?? [];
      return sum + milestones.where((m) => m['completed'] == true).length;
    });
    final progressPercentage = totalMilestones > 0 
        ? ((completedMilestones / totalMilestones) * 100).round() 
        : 0;
    final completedGoals = _goals.where((g) {
      final milestones = g['milestones'] as List<dynamic>? ?? [];
      if (milestones.isEmpty) return false;
      return milestones.every((m) => m['completed'] == true);
    }).length;
    final totalGoals = _goals.length;
    
    return SingleChildScrollView(
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
                  context.pro.primary,
                  context.pro.secondary,
                  context.pro.accent,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: context.pro.secondary.withOpacity(0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: const Icon(Icons.flag, color: AppTheme.white, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Objetivos',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const Text(
                        'Define y gestiona tus objetivos de trabajo',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white70,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Resumen de objetivos
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle_outline,
                  value: '$completedGoals/$totalGoals',
                  label: 'Objetivos',
                  color: context.pro.teal,
                  gradientColors: [context.pro.teal, context.pro.accent],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.trending_up,
                  value: '$progressPercentage%',
                  label: 'Progreso',
                  subtitle: '$completedMilestones/$totalMilestones metas',
                  color: context.pro.accent,
                  gradientColors: [context.pro.accent, context.pro.secondary],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          // Formulario para agregar objetivo
          if (_goals.length < 5)
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    context.pro.teal.withOpacity(0.2),
                    context.pro.accent.withOpacity(0.15),
                    AppTheme.darkSurface.withOpacity(0.8),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: context.pro.teal.withOpacity(0.3),
                  width: 1.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: context.pro.teal.withOpacity(0.15),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _goalController,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w500,
                      ),
                      decoration: InputDecoration(
                        hintText: 'Escribe un nuevo objetivo...',
                        hintStyle: TextStyle(
                          color: AppTheme.white60,
                          fontSize: 15,
                        ),
                        filled: true,
                        fillColor: AppTheme.darkBackground.withOpacity(0.5),
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
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      ),
                      onSubmitted: (_) => _addGoal(),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [context.pro.teal, context.pro.accent],
                      ),
                      borderRadius: BorderRadius.circular(14),
                      boxShadow: [
                        BoxShadow(
                          color: context.pro.teal.withOpacity(0.4),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: ElevatedButton(
                      onPressed: _addGoal,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        foregroundColor: AppTheme.white,
                        shadowColor: Colors.transparent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                        padding: const EdgeInsets.all(14),
                      ),
                      child: const Icon(Icons.add_rounded, size: 24),
                    ),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 20),
          
          // Lista de objetivos
          if (_goals.isEmpty)
            _buildEmptyState('No hay objetivos definidos\nDefine tus objetivos para comenzar', Icons.flag)
          else
            ..._goals.asMap().entries.map((entry) {
              final index = entry.key;
              final goal = entry.value;
              return _buildGoalCard(goal, index, goalsColors);
            }),
        ],
      ),
    );
  }
  
  void _addGoal() {
    if (_goalController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingresa un objetivo')),
      );
      return;
    }
    
    if (_goals.length >= 5) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Solo puedes tener 5 objetivos')),
      );
      return;
    }
    
    setState(() {
      final goalId = DateTime.now().millisecondsSinceEpoch.toString();
      _goals.add({
        'id': goalId,
        'text': _goalController.text.trim(),
        'completed': false,
        'milestones': <Map<String, dynamic>>[],
      });
      _goalMilestoneControllers[goalId] = TextEditingController();
      _goalController.clear();
    });
  }


  Widget _buildEmptyState(
    String message,
    IconData icon, [
    String? subtitle,
    String? buttonText,
    VoidCallback? onButtonPressed,
    Color? buttonColor,
    List<Color>? gradientColors,
  ]) {
    final colors = gradientColors ?? [buttonColor ?? context.pro.accent, buttonColor ?? context.pro.accent];
    
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: colors.map((c) => c.withOpacity(0.2)).toList(),
              ),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 64, color: colors[0].withOpacity(0.6)),
          ),
          const SizedBox(height: 24),
          Text(
            message,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.white,
            ),
            textAlign: TextAlign.center,
          ),
          if (subtitle != null) ...[
            const SizedBox(height: 8),
            Text(
              subtitle,
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.white60,
              ),
              textAlign: TextAlign.center,
            ),
          ],
          if (buttonText != null && onButtonPressed != null) ...[
            const SizedBox(height: 32),
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: colors,
                ),
                borderRadius: BorderRadius.circular(28),
                boxShadow: [
                  BoxShadow(
                    color: colors[0].withOpacity(0.4),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ElevatedButton.icon(
                onPressed: onButtonPressed,
                icon: const Icon(Icons.add, color: AppTheme.white),
                label: Text(
                  buttonText,
                  style: const TextStyle(
                    color: AppTheme.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(28),
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  // Widget _buildWeeklyTaskCard(WeeklyTask task) { // OBSOLETO - Reemplazado por _buildMeetingCard
  Widget _buildWeeklyTaskCardObsolete(WeeklyTask task) {
    final isOverdue = !task.completed && task.date.isBefore(DateTime.now().subtract(const Duration(days: 1)));
    final isToday = task.date.year == DateTime.now().year &&
                    task.date.month == DateTime.now().month &&
                    task.date.day == DateTime.now().day;
    final isUpcoming = task.date.isAfter(DateTime.now());
    
    return Container(
      margin: const EdgeInsets.only(bottom: 18),
      decoration: BoxDecoration(
        gradient: task.completed
            ? LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.green.withOpacity(0.15),
                  Colors.green.withOpacity(0.05),
                ],
              )
            : isOverdue
                ? LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Colors.red.withOpacity(0.15),
                      Colors.red.withOpacity(0.05),
                    ],
                  )
                : isToday
                    ? LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          context.pro.accent.withOpacity(0.2),
                          context.pro.secondary.withOpacity(0.1),
                        ],
                      )
                    : isUpcoming
                        ? LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              context.pro.teal.withOpacity(0.1),
                              context.pro.teal.withOpacity(0.05),
                            ],
                          )
                        : LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              AppTheme.darkSurfaceVariant.withOpacity(0.3),
                              AppTheme.darkSurface.withOpacity(0.5),
                            ],
                          ),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: task.completed
              ? Colors.green.withOpacity(0.3)
              : isOverdue
                  ? Colors.red.withOpacity(0.3)
                  : isToday
                      ? context.pro.accent.withOpacity(0.4)
                      : context.pro.secondary.withOpacity(0.2),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: (task.completed
                    ? Colors.green
                    : isOverdue
                        ? Colors.red
                        : context.pro.secondary)
                .withOpacity(0.15),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                // Checkbox mejorado con animación
                GestureDetector(
                  onTap: () {
                    // Obsoleto - función para WeeklyTask
                    // setState(() {
                    //   final index = _weeklyTasks.indexWhere((t) => t.id == task.id);
                    //   if (index != -1) {
                    //     _weeklyTasks[index] = WeeklyTask(
                    //       id: task.id,
                    //       task: task.task,
                    //       date: task.date,
                    //       completed: !task.completed,
                    //       notes: task.notes,
                    //       priority: task.priority,
                    //     );
                    //   }
                    // });
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      gradient: task.completed
                          ? LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [Colors.green, Colors.green.shade700],
                            )
                          : null,
                      color: task.completed ? null : Colors.transparent,
                      border: Border.all(
                        color: task.completed
                            ? Colors.green
                            : isOverdue
                                ? Colors.red
                                : context.pro.accent,
                        width: 2.5,
                      ),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: task.completed
                        ? const Icon(Icons.check, size: 18, color: AppTheme.white)
                        : null,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              task.task,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: task.completed
                                    ? AppTheme.white40
                                    : isOverdue
                                        ? Colors.red.shade300
                                        : AppTheme.white,
                                decoration: task.completed
                                    ? TextDecoration.lineThrough
                                    : null,
                                decorationThickness: 2,
                              ),
                            ),
                          ),
                          // Badge de prioridad mejorado
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  _getPriorityColor(task.priority, context).withOpacity(0.3),
                                  _getPriorityColor(task.priority, context).withOpacity(0.15),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: _getPriorityColor(task.priority, context).withOpacity(0.5),
                                width: 1,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  _getPriorityIcon(task.priority),
                                  size: 14,
                                  color: _getPriorityColor(task.priority, context),
                                ),
                                const SizedBox(width: 5),
                                Text(
                                  _getPriorityLabel(task.priority),
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: _getPriorityColor(task.priority, context),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          // Badge de fecha mejorado
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                            decoration: BoxDecoration(
                              gradient: isToday
                                  ? LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        context.pro.accent.withOpacity(0.3),
                                        context.pro.secondary.withOpacity(0.2),
                                      ],
                                    )
                                  : LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        context.pro.secondary.withOpacity(0.2),
                                        context.pro.accent.withOpacity(0.15),
                                      ],
                                    ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  isToday ? Icons.today : Icons.calendar_today,
                                  size: 14,
                                  color: isToday ? context.pro.accent : AppTheme.white70,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  isToday
                                      ? 'Hoy'
                                      : '${task.date.day}/${task.date.month}/${task.date.year}',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: isToday ? context.pro.accent : AppTheme.white70,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          if (isOverdue && !task.completed) ...[
                            const SizedBox(width: 10),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    Colors.red.withOpacity(0.3),
                                    Colors.red.withOpacity(0.2),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(
                                  color: Colors.red.withOpacity(0.4),
                                  width: 1,
                                ),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.warning_rounded,
                                    size: 12,
                                    color: Colors.red.shade300,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Vencida',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.red.shade300,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                          if (isToday && !task.completed) ...[
                            const SizedBox(width: 10),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: context.pro.accent.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                '⚠ Hoy',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: context.pro.accent,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
                // Botones de acción mejorados
                const SizedBox(width: 8),
                Container(
                  decoration: BoxDecoration(
                    color: (task.notes != null && task.notes!.isNotEmpty
                        ? context.pro.accent
                        : AppTheme.darkSurfaceVariant)
                        .withOpacity(0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: IconButton(
                    icon: Icon(
                      task.notes != null && task.notes!.isNotEmpty
                          ? Icons.note
                          : Icons.note_outlined,
                      size: 20,
                      color: task.notes != null && task.notes!.isNotEmpty
                          ? context.pro.accent
                          : AppTheme.white60,
                    ),
                    onPressed: () {
                      // Obsoleto - _editingTask = task;
                      // _notesController.text = task.notes ?? '';
                      // setState(() => _showNotesModal = true);
                    },
                  ),
                ),
                const SizedBox(width: 4),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.red.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.delete_outline, size: 20),
                    color: Colors.red.shade300,
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
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
                                  borderRadius: BorderRadius.circular(10),
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
                                  'Eliminar Tarea',
                                  style: TextStyle(color: AppTheme.white, fontSize: 20),
                                ),
                              ),
                            ],
                          ),
                          content: const Text(
                            '¿Estás seguro de eliminar esta tarea? Esta acción no se puede deshacer.',
                            style: TextStyle(color: AppTheme.white70),
                          ),
                          actions: [
                            OutlinedButton(
                              onPressed: () => Navigator.pop(context),
                              style: OutlinedButton.styleFrom(
                                foregroundColor: AppTheme.white60,
                                side: BorderSide(color: AppTheme.white60.withOpacity(0.3)),
                              ),
                              child: const Text('Cancelar'),
                            ),
                            const SizedBox(width: 12),
                            ElevatedButton(
                              onPressed: () {
                                // Obsoleto - setState(() {
                                //   _weeklyTasks.removeWhere((t) => t.id == task.id);
                                // });
                                Navigator.pop(context);
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.red,
                                foregroundColor: AppTheme.white,
                              ),
                              child: const Text('Eliminar'),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
            if (task.notes != null && task.notes!.isNotEmpty) ...[
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      context.pro.accent.withOpacity(0.15),
                      context.pro.accent.withOpacity(0.05),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: context.pro.accent.withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(
                      Icons.note,
                      size: 18,
                      color: context.pro.accent,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        task.notes!,
                        style: TextStyle(
                          fontSize: 13,
                          color: AppTheme.white70,
                          height: 1.4,
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
    );
  }

  Widget _buildDailyTaskCard(DateTime date, List<DailyTask> tasks) {
    final sortedTasks = List<DailyTask>.from(tasks)..sort((a, b) => a.time.compareTo(b.time));
    final isToday = date.year == DateTime.now().year &&
                    date.month == DateTime.now().month &&
                    date.day == DateTime.now().day;
    final completedCount = sortedTasks.where((t) => t.completed).length;
    final totalCount = sortedTasks.length;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isToday
              ? [
                  context.pro.primary.withOpacity(0.3),
                  context.pro.secondary.withOpacity(0.2),
                ]
              : [
                  AppTheme.darkSurface,
                  AppTheme.darkSurfaceVariant.withOpacity(0.5),
                ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isToday
              ? context.pro.accent.withOpacity(0.5)
              : context.pro.secondary.withOpacity(0.2),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: isToday
                ? context.pro.primary.withOpacity(0.2)
                : Colors.black.withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header de fecha mejorado
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            decoration: BoxDecoration(
              gradient: isToday
                  ? LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        context.pro.accent.withOpacity(0.3),
                        context.pro.secondary.withOpacity(0.2),
                      ],
                    )
                  : null,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: isToday
                          ? [context.pro.primary, context.pro.secondary]
                          : [context.pro.slate, context.pro.indigo],
                    ),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(
                    isToday ? Icons.today : Icons.calendar_today,
                    size: 20,
                    color: AppTheme.white,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          if (isToday) ...[
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: context.pro.accent.withOpacity(0.3),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Text(
                                'HOY',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.white,
                                  letterSpacing: 1,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                          ],
                          Text(
                            '${date.day} ${_getMonthName(date.month)} ${date.year}',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.white,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${completedCount}/${totalCount} completadas',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: context.pro.teal.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '$totalCount',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: context.pro.teal,
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          // Lista de tareas mejorada
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: sortedTasks.asMap().entries.map((entry) {
                final index = entry.key;
                final task = entry.value;
                final isLast = index == sortedTasks.length - 1;
                
                return _buildDailyTaskItem(task, date, index, isLast: !isLast);
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
  
  String _getMonthName(int month) {
    const months = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    return months[month - 1];
  }
  
  Widget _buildDailyTaskItem(DailyTask task, DateTime date, int index, {bool isLast = false}) {
    final isOverdue = task.time.isBefore(DateTime.now()) && !task.completed;
    // Usar colores profesionales basados en el índice para crear variación
    final professionalColor1 = index % 3 == 0 ? context.pro.primary : (index % 3 == 1 ? context.pro.secondary : context.pro.accent);
    final professionalColor2 = index % 3 == 1 ? context.pro.accent : (index % 3 == 2 ? context.pro.teal : context.pro.secondary);
    final professionalColor3 = index % 3 == 2 ? context.pro.teal : (index % 3 == 0 ? context.pro.indigo : context.pro.accent);
    
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 300 + (index * 50)),
      curve: Curves.easeOut,
      builder: (context, value, child) {
        return Transform.translate(
          offset: Offset(0, 20 * (1 - value)),
          child: Opacity(
            opacity: value,
            child: child,
          ),
        );
      },
      child: Container(
        margin: EdgeInsets.only(bottom: isLast ? 0 : 16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              professionalColor1.withOpacity(0.15),
              professionalColor2.withOpacity(0.1),
              professionalColor3.withOpacity(0.05),
              AppTheme.darkSurface,
            ],
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: professionalColor1.withOpacity(0.4),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: professionalColor1.withOpacity(0.2),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
            BoxShadow(
              color: professionalColor2.withOpacity(0.15),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Barra lateral con gradiente profesional
            Positioned(
              left: 0,
              top: 0,
              bottom: 0,
              child: Container(
                width: 6,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      professionalColor1,
                      professionalColor2,
                      professionalColor3,
                    ],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    bottomLeft: Radius.circular(20),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Checkbox mejorado (igual que Personal)
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            final dateKey = DateTime(date.year, date.month, date.day);
                            if (_dailyTasks.containsKey(dateKey)) {
                              final taskIndex = _dailyTasks[dateKey]!.indexWhere((t) => t.id == task.id);
                              if (taskIndex != -1) {
                                _dailyTasks[dateKey]![taskIndex] = DailyTask(
                                  id: task.id,
                                  task: task.task,
                                  date: task.date,
                                  time: task.time,
                                  completed: !task.completed,
                                  notes: task.notes,
                                  priority: task.priority,
                                );
                              }
                            }
                          });
                        },
                        child: Container(
                          width: 56,
                          height: 56,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: task.completed
                                  ? [
                                      Colors.green.withOpacity(0.4),
                                      Colors.green.withOpacity(0.2),
                                    ]
                                  : [
                                      professionalColor1.withOpacity(0.4),
                                      professionalColor2.withOpacity(0.3),
                                      professionalColor3.withOpacity(0.2),
                                    ],
                            ),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: task.completed
                                  ? Colors.green.withOpacity(0.6)
                                  : professionalColor1.withOpacity(0.5),
                              width: 2,
                            ),
                            boxShadow: task.completed ? null : [
                              BoxShadow(
                                color: professionalColor1.withOpacity(0.3),
                                blurRadius: 8,
                                spreadRadius: 1,
                              ),
                            ],
                          ),
                          child: Center(
                            child: task.completed
                                ? const Icon(Icons.check, color: Colors.green, size: 28)
                                : Container(
                                    width: 20,
                                    height: 20,
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        begin: Alignment.topLeft,
                                        end: Alignment.bottomRight,
                                        colors: [
                                          professionalColor1.withOpacity(0.3),
                                          professionalColor2.withOpacity(0.2),
                                        ],
                                      ),
                                      shape: BoxShape.circle,
                                      border: Border.all(
                                        color: professionalColor1,
                                        width: 2.5,
                                      ),
                                    ),
                                  ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              task.task,
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: task.completed ? AppTheme.white40 : AppTheme.white,
                                decoration: task.completed ? TextDecoration.lineThrough : null,
                              ),
                            ),
                            const SizedBox(height: 8),
                            // Prioridad con gradiente profesional
                            if (task.priority != null)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      professionalColor1.withOpacity(0.25),
                                      professionalColor2.withOpacity(0.15),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: professionalColor1.withOpacity(0.3),
                                    width: 1,
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      _getPriorityIcon(task.priority!),
                                      size: 14,
                                      color: _getPriorityColor(task.priority!, context),
                                    ),
                                    const SizedBox(width: 6),
                                    Text(
                                      _getPriorityLabel(task.priority!),
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: professionalColor1,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                          ],
                        ),
                      ),
                      // Botón de opciones (igual que Personal)
                      PopupMenuButton<String>(
                        icon: const Icon(Icons.more_vert, color: AppTheme.white60, size: 20),
                        color: AppTheme.darkSurface,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        onSelected: (value) {
                          if (value == 'delete') {
                            showDialog<bool>(
                              context: context,
                              builder: (context) => AlertDialog(
                                backgroundColor: AppTheme.darkSurface,
                                title: const Text(
                                  'Eliminar tarea',
                                  style: TextStyle(color: AppTheme.white),
                                ),
                                content: Text(
                                  '¿Estás seguro de que quieres eliminar "${task.task}"?',
                                  style: const TextStyle(color: AppTheme.white60),
                                ),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(context, false),
                                    child: const Text(
                                      'Cancelar',
                                      style: TextStyle(color: AppTheme.white60),
                                    ),
                                  ),
                                  ElevatedButton(
                                    onPressed: () => Navigator.pop(context, true),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.red,
                                    ),
                                    child: const Text('Eliminar'),
                                  ),
                                ],
                              ),
                            ).then((confirmed) {
                              if (confirmed == true) {
                                setState(() {
                                  final dateKey = DateTime(date.year, date.month, date.day);
                                  if (_dailyTasks.containsKey(dateKey)) {
                                    _dailyTasks[dateKey]!.removeWhere((t) => t.id == task.id);
                                    if (_dailyTasks[dateKey]!.isEmpty) {
                                      _dailyTasks.remove(dateKey);
                                    }
                                  }
                                });
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Tarea eliminada exitosamente'),
                                    backgroundColor: Colors.green,
                                    duration: Duration(seconds: 2),
                                  ),
                                );
                              }
                            });
                          }
                        },
                        itemBuilder: (context) => [
                          const PopupMenuItem(
                            value: 'delete',
                            child: Row(
                              children: [
                                Icon(Icons.delete, size: 18, color: Colors.red),
                                SizedBox(width: 8),
                                Text('Eliminar', style: TextStyle(color: Colors.red)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Información de la tarea (hora)
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBackground.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    professionalColor2.withOpacity(0.3),
                                    professionalColor3.withOpacity(0.2),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: professionalColor2.withOpacity(0.4),
                                  width: 1,
                                ),
                              ),
                              child: Icon(
                                Icons.access_time,
                                size: 16,
                                color: AppTheme.white,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Hora',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: AppTheme.white,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${task.time.hour.toString().padLeft(2, '0')}:${task.time.minute.toString().padLeft(2, '0')}',
                                    style: const TextStyle(
                                      fontSize: 15,
                                      color: AppTheme.white,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            if (isOverdue && !task.completed)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      Colors.red.withOpacity(0.3),
                                      Colors.red.withOpacity(0.2),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(
                                    color: Colors.red.withOpacity(0.4),
                                    width: 1,
                                  ),
                                ),
                                child: const Text(
                                  'Atrasada',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.red,
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ],
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

  Widget _buildProjectCard(WorkProject project, int index) {
    final totalGoals = project.goals.length;
    final completedGoals = project.goals.where((g) => g.completed == true).length;
    final isOverdue = project.deadline != null && project.deadline!.isBefore(DateTime.now()) && completedGoals < totalGoals;
    final progressPercentage = totalGoals > 0 ? ((completedGoals / totalGoals) * 100).round() : 0;
    final isCompleted = totalGoals > 0 && completedGoals == totalGoals;
    
    // Colores profesionales basados en el índice para variación
    final professionalColor1 = index % 3 == 0 ? context.pro.primary : (index % 3 == 1 ? context.pro.secondary : context.pro.accent);
    final professionalColor2 = index % 3 == 1 ? context.pro.accent : (index % 3 == 2 ? context.pro.teal : context.pro.secondary);
    final professionalColor3 = index % 3 == 2 ? context.pro.teal : (index % 3 == 0 ? context.pro.indigo : context.pro.accent);
    
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: Duration(milliseconds: 300 + (index * 50)),
      curve: Curves.easeOut,
      builder: (context, value, child) {
        return Transform.translate(
          offset: Offset(0, 20 * (1 - value)),
          child: Opacity(
            opacity: value,
            child: child,
          ),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isCompleted
                ? [
                    Colors.green.withOpacity(0.15),
                    Colors.green.withOpacity(0.08),
                    AppTheme.darkSurface,
                  ]
                : isOverdue
                    ? [
                        Colors.red.withOpacity(0.15),
                        Colors.red.withOpacity(0.08),
                        AppTheme.darkSurface,
                      ]
                    : [
                        professionalColor1.withOpacity(0.15),
                        professionalColor2.withOpacity(0.1),
                        professionalColor3.withOpacity(0.05),
                        AppTheme.darkSurface,
                      ],
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isCompleted
                ? Colors.green.withOpacity(0.4)
                : isOverdue
                    ? Colors.red.withOpacity(0.4)
                    : professionalColor1.withOpacity(0.4),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: (isCompleted
                      ? Colors.green
                      : isOverdue
                          ? Colors.red
                          : professionalColor1)
                  .withOpacity(0.2),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
            BoxShadow(
              color: professionalColor2.withOpacity(0.15),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Stack(
          children: [
            // Barra lateral con gradiente profesional
            Positioned(
              left: 0,
              top: 0,
              bottom: 0,
              child: Container(
                width: 6,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: isCompleted
                        ? [Colors.green, Colors.green.shade700]
                        : isOverdue
                            ? [Colors.red, Colors.red.shade700]
                            : [
                                professionalColor1,
                                professionalColor2,
                                professionalColor3,
                              ],
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    bottomLeft: Radius.circular(20),
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header del proyecto
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Icono del proyecto con gradiente
                      Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: isCompleted
                                ? [Colors.green.withOpacity(0.4), Colors.green.withOpacity(0.2)]
                                : [
                                    professionalColor1.withOpacity(0.4),
                                    professionalColor2.withOpacity(0.3),
                                    professionalColor3.withOpacity(0.2),
                                  ],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isCompleted
                                ? Colors.green.withOpacity(0.6)
                                : professionalColor1.withOpacity(0.5),
                            width: 2,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: (isCompleted ? Colors.green : professionalColor1).withOpacity(0.3),
                              blurRadius: 8,
                              spreadRadius: 1,
                            ),
                          ],
                        ),
                        child: Icon(
                          isCompleted ? Icons.check_circle : Icons.folder_special,
                          color: AppTheme.white,
                          size: 28,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    project.title,
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.white,
                                      decoration: isCompleted ? TextDecoration.lineThrough : null,
                                    ),
                                  ),
                                ),
                                if (isCompleted) ...[
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [Colors.green, Colors.green.shade700],
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.check, size: 14, color: AppTheme.white),
                                        const SizedBox(width: 4),
                                        const Text(
                                          'Completado',
                                          style: TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.white,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                                if (isOverdue) ...[
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [Colors.red, Colors.red.shade700],
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.warning, size: 14, color: AppTheme.white),
                                        const SizedBox(width: 4),
                                        const Text(
                                          'Vencido',
                                          style: TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.white,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ],
                            ),
                            if (project.aim.isNotEmpty) ...[
                              const SizedBox(height: 8),
                              Text(
                                project.aim,
                                style: TextStyle(
                                  fontSize: 14,
                                  color: AppTheme.white70,
                                  height: 1.4,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ],
                        ),
                      ),
                      // Botón de opciones
                      PopupMenuButton<String>(
                        icon: const Icon(Icons.more_vert, color: AppTheme.white60, size: 22),
                        color: AppTheme.darkSurface,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        onSelected: (value) {
                          if (value == 'edit') {
                            _editProject(project);
                          } else if (value == 'delete') {
                            showDialog<bool>(
                              context: context,
                              builder: (context) => AlertDialog(
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
                                        borderRadius: BorderRadius.circular(10),
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
                                        'Eliminar Proyecto',
                                        style: TextStyle(color: AppTheme.white, fontSize: 20),
                                      ),
                                    ),
                                  ],
                                ),
                                content: Text(
                                  '¿Estás seguro de eliminar "${project.title}"? Esta acción no se puede deshacer.',
                                  style: const TextStyle(color: AppTheme.white70),
                                ),
                                actions: [
                                  OutlinedButton(
                                    onPressed: () => Navigator.pop(context, false),
                                    style: OutlinedButton.styleFrom(
                                      foregroundColor: AppTheme.white60,
                                      side: BorderSide(color: AppTheme.white60.withOpacity(0.3)),
                                    ),
                                    child: const Text('Cancelar'),
                                  ),
                                  const SizedBox(width: 12),
                                  ElevatedButton(
                                    onPressed: () => Navigator.pop(context, true),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.red,
                                      foregroundColor: AppTheme.white,
                                    ),
                                    child: const Text('Eliminar'),
                                  ),
                                ],
                              ),
                            ).then((confirmed) {
                              if (confirmed == true) {
                                setState(() {
                                  _projects.removeWhere((p) => p.id == project.id);
                                });
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Proyecto eliminado exitosamente'),
                                    backgroundColor: Colors.green,
                                    duration: Duration(seconds: 2),
                                  ),
                                );
                              }
                            });
                          }
                        },
                        itemBuilder: (context) => [
                          const PopupMenuItem(
                            value: 'edit',
                            child: Row(
                              children: [
                                Icon(Icons.edit, size: 18, color: AppTheme.white70),
                                SizedBox(width: 8),
                                Text('Editar', style: TextStyle(color: AppTheme.white70)),
                              ],
                            ),
                          ),
                          const PopupMenuItem(
                            value: 'delete',
                            child: Row(
                              children: [
                                Icon(Icons.delete, size: 18, color: Colors.red),
                                SizedBox(width: 8),
                                Text('Eliminar', style: TextStyle(color: Colors.red)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  
                  // Información del proyecto
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.darkBackground.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      children: [
                        // Fecha límite y metas
                        Row(
                          children: [
                            if (project.deadline != null) ...[
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      (isOverdue ? Colors.red : professionalColor2).withOpacity(0.3),
                                      (isOverdue ? Colors.red : professionalColor3).withOpacity(0.2),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: (isOverdue ? Colors.red : professionalColor2).withOpacity(0.4),
                                    width: 1,
                                  ),
                                ),
                                child: Icon(
                                  Icons.calendar_today,
                                  size: 16,
                                  color: isOverdue ? Colors.red : professionalColor2,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Fecha límite',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: AppTheme.white60,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      DateFormat('dd MMMM yyyy', 'es').format(project.deadline!),
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: isOverdue ? Colors.red : AppTheme.white,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 16),
                            ],
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    professionalColor3.withOpacity(0.3),
                                    professionalColor1.withOpacity(0.2),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: professionalColor3.withOpacity(0.4),
                                  width: 1,
                                ),
                              ),
                              child: Icon(
                                Icons.flag,
                                size: 16,
                                color: professionalColor3,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Metas',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: AppTheme.white60,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '$completedGoals/$totalGoals completadas',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      color: AppTheme.white,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        if (totalGoals > 0) ...[
                          const SizedBox(height: 16),
                          // Barra de progreso mejorada
                          Row(
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'Progreso',
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: AppTheme.white60,
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                          decoration: BoxDecoration(
                                            gradient: LinearGradient(
                                              colors: isCompleted
                                                  ? [Colors.green, Colors.green.shade700]
                                                  : [
                                                      professionalColor1,
                                                      professionalColor2,
                                                    ],
                                            ),
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: Text(
                                            '$progressPercentage%',
                                            style: const TextStyle(
                                              fontSize: 12,
                                              fontWeight: FontWeight.bold,
                                              color: AppTheme.white,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    Container(
                                      height: 10,
                                      decoration: BoxDecoration(
                                        color: AppTheme.darkSurfaceVariant,
                                        borderRadius: BorderRadius.circular(5),
                                      ),
                                      child: Stack(
                                        children: [
                                          FractionallySizedBox(
                                            alignment: Alignment.centerLeft,
                                            widthFactor: progressPercentage / 100,
                                            child: Container(
                                              decoration: BoxDecoration(
                                                gradient: LinearGradient(
                                                  colors: isCompleted
                                                      ? [Colors.green, Colors.green.shade700]
                                                      : [
                                                          professionalColor1,
                                                          professionalColor2,
                                                          professionalColor3,
                                                        ],
                                                ),
                                                borderRadius: BorderRadius.circular(5),
                                                boxShadow: [
                                                  BoxShadow(
                                                    color: (isCompleted
                                                            ? Colors.green
                                                            : professionalColor1)
                                                        .withOpacity(0.5),
                                                    blurRadius: 8,
                                                    spreadRadius: 1,
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                        // Lista de metas individuales
                        if (project.goals.isNotEmpty) ...[
                          const SizedBox(height: 20),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: AppTheme.darkBackground.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: professionalColor1.withOpacity(0.3),
                                width: 1,
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Icon(
                                      Icons.flag_rounded,
                                      size: 16,
                                      color: professionalColor3,
                                    ),
                                    const SizedBox(width: 8),
                                    const Text(
                                      'Metas del Proyecto',
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w600,
                                        color: AppTheme.white,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                ...project.goals.asMap().entries.map((entry) {
                                  final goal = entry.value;
                                  return Container(
                                    margin: const EdgeInsets.only(bottom: 8),
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: goal.completed
                                          ? Colors.green.withOpacity(0.1)
                                          : AppTheme.darkSurface.withOpacity(0.5),
                                      borderRadius: BorderRadius.circular(10),
                                      border: Border.all(
                                        color: goal.completed
                                            ? Colors.green.withOpacity(0.3)
                                            : professionalColor1.withOpacity(0.2),
                                        width: 1,
                                      ),
                                    ),
                                    child: Row(
                                      children: [
                                        Checkbox(
                                          value: goal.completed,
                                          onChanged: (value) {
                                            setState(() {
                                              final projectIndex = _projects.indexWhere((p) => p.id == project.id);
                                              if (projectIndex != -1) {
                                                final updatedGoals = project.goals.map((g) {
                                                  if (g.id == goal.id) {
                                                    return ProjectGoal(
                                                      id: g.id,
                                                      text: g.text,
                                                      date: g.date,
                                                      person: g.person,
                                                      position: g.position,
                                                      completed: value ?? false,
                                                    );
                                                  }
                                                  return g;
                                                }).toList();
                                                
                                                _projects[projectIndex] = WorkProject(
                                                  id: project.id,
                                                  title: project.title,
                                                  aim: project.aim,
                                                  startDate: project.startDate,
                                                  deadline: project.deadline,
                                                  teammates: project.teammates,
                                                  achievements: project.achievements,
                                                  works: project.works,
                                                  funding: project.funding,
                                                  goals: updatedGoals,
                                                  overview: project.overview,
                                                );
                                              }
                                            });
                                          },
                                          activeColor: Colors.green,
                                          checkColor: AppTheme.white,
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                goal.text,
                                                style: TextStyle(
                                                  fontSize: 14,
                                                  color: goal.completed
                                                      ? AppTheme.white60
                                                      : AppTheme.white,
                                                  decoration: goal.completed
                                                      ? TextDecoration.lineThrough
                                                      : null,
                                                  fontWeight: goal.completed
                                                      ? FontWeight.normal
                                                      : FontWeight.w500,
                                                ),
                                              ),
                                              if (goal.person != null || goal.date != null) ...[
                                                const SizedBox(height: 6),
                                                Row(
                                                  children: [
                                                    if (goal.person != null) ...[
                                                      Icon(
                                                        Icons.person_rounded,
                                                        size: 12,
                                                        color: AppTheme.white60,
                                                      ),
                                                      const SizedBox(width: 4),
                                                      Text(
                                                        goal.person!,
                                                        style: TextStyle(
                                                          fontSize: 11,
                                                          color: AppTheme.white60,
                                                        ),
                                                      ),
                                                    ],
                                                    if (goal.person != null && goal.date != null)
                                                      const SizedBox(width: 12),
                                                    if (goal.date != null) ...[
                                                      Icon(
                                                        Icons.calendar_today_rounded,
                                                        size: 12,
                                                        color: AppTheme.white60,
                                                      ),
                                                      const SizedBox(width: 4),
                                                      Text(
                                                        DateFormat('dd MMM yyyy', 'es').format(goal.date!),
                                                        style: TextStyle(
                                                          fontSize: 11,
                                                          color: AppTheme.white60,
                                                        ),
                                                      ),
                                                    ],
                                                  ],
                                                ),
                                              ],
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                }).toList(),
                              ],
                            ),
                          ),
                        ],
                      ],
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

  Widget _buildPriorityCard(Map<String, dynamic> priority, int index, List<Color> colors) {
    final color = colors[index % colors.length];
    final isCompleted = priority['completed'] == true;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isCompleted
              ? [
                  Colors.green.withOpacity(0.15),
                  Colors.green.withOpacity(0.08),
                  AppTheme.darkSurface,
                ]
              : [
                  color.withOpacity(0.15),
                  color.withOpacity(0.08),
                  AppTheme.darkSurface,
                ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isCompleted
              ? Colors.green.withOpacity(0.4)
              : color.withOpacity(0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: (isCompleted ? Colors.green : color).withOpacity(0.2),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
          BoxShadow(
            color: color.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: isCompleted
                      ? [Colors.green, Colors.green.shade700]
                      : [color, color.withOpacity(0.8)],
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: color.withOpacity(0.4),
                    blurRadius: 8,
                    spreadRadius: 1,
                  ),
                ],
              ),
              child: Center(
                child: Text(
                  '${index + 1}',
                  style: const TextStyle(
                    color: AppTheme.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextField(
                controller: TextEditingController(text: priority['text']),
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: isCompleted ? AppTheme.white60 : AppTheme.white,
                  decoration: isCompleted ? TextDecoration.lineThrough : null,
                  letterSpacing: 0.2,
                ),
                enabled: !isCompleted,
                decoration: const InputDecoration(
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.only(left: 8),
                ),
                onChanged: (value) {
                  setState(() {
                    final idx = _priorities.indexWhere((p) => p['id'] == priority['id']);
                    if (idx != -1) {
                      _priorities[idx]['text'] = value;
                    }
                  });
                },
              ),
            ),
            const SizedBox(width: 12),
            Container(
              decoration: BoxDecoration(
                color: isCompleted
                    ? Colors.green.withOpacity(0.2)
                    : AppTheme.darkSurfaceVariant.withOpacity(0.5),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: isCompleted
                      ? Colors.green.withOpacity(0.4)
                      : color.withOpacity(0.3),
                  width: 1.5,
                ),
              ),
              child: Checkbox(
                value: isCompleted,
                onChanged: (value) {
                  setState(() {
                    final idx = _priorities.indexWhere((p) => p['id'] == priority['id']);
                    if (idx != -1) {
                      _priorities[idx]['completed'] = value ?? false;
                    }
                  });
                },
                activeColor: Colors.green,
                checkColor: AppTheme.white,
                side: BorderSide(
                  color: isCompleted ? Colors.green : color.withOpacity(0.5),
                  width: 2,
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
                icon: const Icon(Icons.close_rounded, color: Colors.red, size: 20),
                padding: const EdgeInsets.all(8),
                constraints: const BoxConstraints(),
                onPressed: () {
                  setState(() {
                    _priorities.removeWhere((p) => p['id'] == priority['id']);
                  });
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFocusCard(Map<String, dynamic> focus, int index, List<Color> colors) {
    final color = colors[index % colors.length];
    final isCompleted = focus['completed'] == true;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isCompleted
              ? [
                  Colors.green.withOpacity(0.15),
                  Colors.green.withOpacity(0.08),
                  AppTheme.darkSurface,
                ]
              : [
                  color.withOpacity(0.15),
                  color.withOpacity(0.08),
                  AppTheme.darkSurface,
                ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isCompleted
              ? Colors.green.withOpacity(0.4)
              : color.withOpacity(0.4),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: (isCompleted ? Colors.green : color).withOpacity(0.2),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
          BoxShadow(
            color: color.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: isCompleted
                      ? [Colors.green, Colors.green.shade700]
                      : [color, color.withOpacity(0.8)],
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: color.withOpacity(0.4),
                    blurRadius: 8,
                    spreadRadius: 1,
                  ),
                ],
              ),
              child: Center(
                child: Icon(
                  Icons.center_focus_strong_rounded,
                  color: AppTheme.white,
                  size: 24,
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: TextField(
                controller: TextEditingController(text: focus['text']),
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: isCompleted ? AppTheme.white60 : AppTheme.white,
                  decoration: isCompleted ? TextDecoration.lineThrough : null,
                  letterSpacing: 0.2,
                ),
                enabled: !isCompleted,
                decoration: const InputDecoration(
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.only(left: 8),
                ),
                onChanged: (value) {
                  setState(() {
                    final idx = _focus.indexWhere((f) => f['id'] == focus['id']);
                    if (idx != -1) {
                      _focus[idx]['text'] = value;
                    }
                  });
                },
              ),
            ),
            const SizedBox(width: 12),
            Container(
              decoration: BoxDecoration(
                color: isCompleted
                    ? Colors.green.withOpacity(0.2)
                    : AppTheme.darkSurfaceVariant.withOpacity(0.5),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: isCompleted
                      ? Colors.green.withOpacity(0.4)
                      : color.withOpacity(0.3),
                  width: 1.5,
                ),
              ),
              child: Checkbox(
                value: isCompleted,
                onChanged: (value) {
                  setState(() {
                    final idx = _focus.indexWhere((f) => f['id'] == focus['id']);
                    if (idx != -1) {
                      _focus[idx]['completed'] = value ?? false;
                    }
                  });
                },
                activeColor: Colors.green,
                checkColor: AppTheme.white,
                side: BorderSide(
                  color: isCompleted ? Colors.green : color.withOpacity(0.5),
                  width: 2,
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
                icon: const Icon(Icons.close_rounded, color: Colors.red, size: 20),
                padding: const EdgeInsets.all(8),
                constraints: const BoxConstraints(),
                onPressed: () {
                  setState(() {
                    _focus.removeWhere((f) => f['id'] == focus['id']);
                  });
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGoalCard(Map<String, dynamic> goal, int index, List<Color> colors) {
    final color = colors[index % colors.length];
    final milestones = (goal['milestones'] as List<dynamic>?) ?? [];
    final completedMilestones = milestones.where((m) => m['completed'] == true).length;
    final totalMilestones = milestones.length;
    final progressPercentage = totalMilestones > 0 
        ? (completedMilestones / totalMilestones) 
        : 0.0;
    final isCompleted = totalMilestones > 0 && completedMilestones == totalMilestones;
    
    // Asegurar que el controller existe
    if (!_goalMilestoneControllers.containsKey(goal['id'])) {
      _goalMilestoneControllers[goal['id']] = TextEditingController();
    }
    final milestoneController = _goalMilestoneControllers[goal['id']]!;
    
    // Capturar referencias para usar en closures
    final goals = _goals;
    final goalId = goal['id'];
    
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isCompleted
              ? [
                  const Color(0xFF6366F1).withOpacity(0.2),
                  const Color(0xFF6366F1).withOpacity(0.12),
                  AppTheme.darkSurface,
                ]
              : [
                  color.withOpacity(0.2),
                  color.withOpacity(0.12),
                  AppTheme.darkSurface,
                ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isCompleted
              ? const Color(0xFF6366F1).withOpacity(0.5)
              : color.withOpacity(0.5),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: (isCompleted ? const Color(0xFF6366F1) : color).withOpacity(0.25),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
          BoxShadow(
            color: color.withOpacity(0.15),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: isCompleted
                          ? [const Color(0xFF6366F1), const Color(0xFF4F46E5)]
                          : [color, color.withOpacity(0.8)],
                    ),
                    borderRadius: BorderRadius.circular(18),
                    boxShadow: [
                      BoxShadow(
                        color: color.withOpacity(0.5),
                        blurRadius: 10,
                        spreadRadius: 1,
                      ),
                    ],
                  ),
                  child: Center(
                    child: Icon(
                      Icons.flag_rounded,
                      color: AppTheme.white,
                      size: 28,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: TextField(
                    controller: TextEditingController(text: goal['text']),
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: isCompleted ? AppTheme.white60 : AppTheme.white,
                      decoration: isCompleted ? TextDecoration.lineThrough : null,
                      letterSpacing: 0.3,
                    ),
                    enabled: !isCompleted,
                    decoration: const InputDecoration(
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.only(left: 8),
                    ),
                    onChanged: (value) {
                      setState(() {
                        final idx = _goals.indexWhere((g) => g['id'] == goal['id']);
                        if (idx != -1) {
                          _goals[idx]['text'] = value;
                        }
                      });
                    },
                  ),
                ),
                if (isCompleted)
                  Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [const Color(0xFF6366F1), const Color(0xFF4F46E5)],
                      ),
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF6366F1).withOpacity(0.3),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.check_circle_rounded, color: AppTheme.white, size: 16),
                        SizedBox(width: 6),
                        Text(
                          'Completado',
                          style: TextStyle(
                            color: AppTheme.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
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
                    icon: const Icon(Icons.close_rounded, color: Colors.red, size: 20),
                    padding: const EdgeInsets.all(8),
                    constraints: const BoxConstraints(),
                    onPressed: () {
                      setState(() {
                        final goalId = goal['id'];
                        _goals.removeWhere((g) => g['id'] == goalId);
                        _goalMilestoneControllers.remove(goalId)?.dispose();
                      });
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            
            // Barra de progreso mejorada
            Container(
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
                  color: color.withOpacity(0.3),
                  width: 1,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.track_changes_rounded,
                            size: 16,
                            color: color,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Progreso',
                            style: TextStyle(
                              fontSize: 12,
                              color: AppTheme.white,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: isCompleted
                                ? [Colors.green, Colors.green.shade700]
                                : [color, color.withOpacity(0.8)],
                          ),
                          borderRadius: BorderRadius.circular(10),
                          boxShadow: [
                            BoxShadow(
                              color: color.withOpacity(0.3),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Text(
                          '${(progressPercentage * 100).round()}%',
                          style: const TextStyle(
                            fontSize: 13,
                            color: AppTheme.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Container(
                    height: 10,
                    decoration: BoxDecoration(
                      color: AppTheme.darkSurfaceVariant,
                      borderRadius: BorderRadius.circular(5),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.2),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: FractionallySizedBox(
                      alignment: Alignment.centerLeft,
                      widthFactor: progressPercentage,
                      child: Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: isCompleted
                                ? [Colors.green, Colors.green.shade700]
                                : [color, color.withOpacity(0.8)],
                          ),
                          borderRadius: BorderRadius.circular(5),
                          boxShadow: [
                            BoxShadow(
                              color: color.withOpacity(0.5),
                              blurRadius: 8,
                              spreadRadius: 1,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(
                        Icons.checklist_rounded,
                        size: 14,
                        color: AppTheme.white60,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        '$completedMilestones/$totalMilestones metas completadas',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppTheme.white70,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            
            // Lista de metas
            if (milestones.isNotEmpty) ...[
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [color.withOpacity(0.4), color.withOpacity(0.2)],
                      ),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      Icons.flag_rounded,
                      size: 16,
                      color: color,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    'Metas:',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.white,
                      letterSpacing: 0.3,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ...milestones.asMap().entries.map((entry) {
                final milestoneIndex = entry.key;
                final milestone = entry.value;
                final milestoneCompleted = milestone['completed'] == true;
                return Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: milestoneCompleted
                          ? [
                              const Color(0xFF6366F1).withOpacity(0.15),
                              const Color(0xFF6366F1).withOpacity(0.08),
                              AppTheme.darkSurface.withOpacity(0.8),
                            ]
                          : [
                              color.withOpacity(0.15),
                              color.withOpacity(0.08),
                              AppTheme.darkSurface.withOpacity(0.8),
                            ],
                    ),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: milestoneCompleted 
                          ? const Color(0xFF6366F1).withOpacity(0.4)
                          : color.withOpacity(0.4),
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: (milestoneCompleted ? const Color(0xFF6366F1) : color).withOpacity(0.15),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          color: milestoneCompleted
                              ? Colors.green.withOpacity(0.2)
                              : AppTheme.darkSurfaceVariant.withOpacity(0.5),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: milestoneCompleted
                                ? Colors.green.withOpacity(0.4)
                                : color.withOpacity(0.3),
                            width: 1.5,
                          ),
                        ),
                        child: Checkbox(
                          value: milestoneCompleted,
                          onChanged: (value) {
                            setState(() {
                              final goalIdx = _goals.indexWhere((g) => g['id'] == goal['id']);
                              if (goalIdx != -1) {
                                final milestonesList = _goals[goalIdx]['milestones'] as List<dynamic>;
                                final milestoneIdx = milestonesList.indexWhere(
                                  (m) => m['id'] == milestone['id']
                                );
                                if (milestoneIdx != -1) {
                                  milestonesList[milestoneIdx]['completed'] = value ?? false;
                                }
                              }
                            });
                          },
                          activeColor: const Color(0xFF6366F1),
                          checkColor: AppTheme.white,
                          side: BorderSide(
                            color: milestoneCompleted ? const Color(0xFF6366F1) : color.withOpacity(0.5),
                            width: 2,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          milestone['text'] ?? '',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: milestoneCompleted 
                                ? AppTheme.white60 
                                : AppTheme.white,
                            decoration: milestoneCompleted 
                                ? TextDecoration.lineThrough 
                                : null,
                            letterSpacing: 0.2,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: Colors.red.withOpacity(0.3),
                            width: 1,
                          ),
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.close_rounded, size: 18, color: Colors.red),
                          padding: const EdgeInsets.all(6),
                          constraints: const BoxConstraints(),
                          onPressed: () {
                            setState(() {
                              final goalIdx = _goals.indexWhere((g) => g['id'] == goal['id']);
                              if (goalIdx != -1) {
                                final milestonesList = _goals[goalIdx]['milestones'] as List<dynamic>;
                                milestonesList.removeWhere(
                                  (m) => m['id'] == milestone['id']
                                );
                              }
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                );
              }),
              const SizedBox(height: 16),
            ],
            
            // Formulario para agregar meta
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    color.withOpacity(0.2),
                    color.withOpacity(0.1),
                    AppTheme.darkSurfaceVariant.withOpacity(0.4),
                  ],
                ),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: color.withOpacity(0.4),
                  width: 1.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: color.withOpacity(0.1),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: milestoneController,
                      style: const TextStyle(
                        color: AppTheme.white,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                      decoration: InputDecoration(
                        hintText: 'Agregar meta...',
                        hintStyle: TextStyle(
                          color: AppTheme.white60,
                          fontSize: 14,
                        ),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                        filled: true,
                        fillColor: AppTheme.darkBackground.withOpacity(0.5),
                      ),
                      onSubmitted: (_) {
                        if (milestoneController.text.trim().isNotEmpty) {
                          final goalIdx = goals.indexWhere((g) => g['id'] == goalId);
                          if (goalIdx != -1) {
                            final milestonesList = goals[goalIdx]['milestones'] as List<dynamic>;
                            milestonesList.add({
                              'id': DateTime.now().millisecondsSinceEpoch.toString(),
                              'text': milestoneController.text.trim(),
                              'completed': false,
                            });
                            milestoneController.clear();
                            setState(() {});
                          }
                        }
                      },
                    ),
                  ),
                  const SizedBox(width: 10),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [color, color.withOpacity(0.8)],
                      ),
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: color.withOpacity(0.4),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: ElevatedButton.icon(
                      onPressed: () {
                        if (milestoneController.text.trim().isNotEmpty) {
                          final goalIdx = goals.indexWhere((g) => g['id'] == goalId);
                          if (goalIdx != -1) {
                            final milestonesList = goals[goalIdx]['milestones'] as List<dynamic>;
                            milestonesList.add({
                              'id': DateTime.now().millisecondsSinceEpoch.toString(),
                              'text': milestoneController.text.trim(),
                              'completed': false,
                            });
                            milestoneController.clear();
                            setState(() {});
                          }
                        }
                      },
                      icon: const Icon(Icons.add_rounded, color: AppTheme.white, size: 20),
                      label: const Text(
                        'Agregar',
                        style: TextStyle(
                          color: AppTheme.white,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        foregroundColor: AppTheme.white,
                        shadowColor: Colors.transparent,
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      ),
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

  Widget _buildPriorities() {
    final priorityColors = [
      context.pro.indigo,
      context.pro.teal,
      context.pro.secondary,
      context.pro.accent,
      context.pro.slate,
    ];
    
    return SingleChildScrollView(
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
                  context.pro.primary,
                  context.pro.secondary,
                  context.pro.accent,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: context.pro.secondary.withOpacity(0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: const Icon(Icons.priority_high, color: AppTheme.white, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Prioridades',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const Text(
                        'Define y gestiona tus prioridades clave',
                        style: TextStyle(
                          fontSize: 14,
                          color: AppTheme.white70,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Formulario para agregar prioridad
          if (_priorities.length < 5)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _priorityController,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        hintText: 'Escribe una nueva prioridad...',
                        hintStyle: const TextStyle(color: AppTheme.white60),
                        filled: true,
                        fillColor: AppTheme.darkSurfaceVariant,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: (_) => _addPriority(),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: _addPriority,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: context.pro.accent,
                      foregroundColor: AppTheme.white,
                      shape: const CircleBorder(),
                      padding: const EdgeInsets.all(12),
                    ),
                    child: const Icon(Icons.add),
                  ),
                ],
              ),
            ),
          const SizedBox(height: 20),
          
          // Lista de prioridades
          if (_priorities.isEmpty)
            _buildEmptyState('No hay prioridades definidas\nEscribe una prioridad arriba y toca el botón +', Icons.priority_high)
          else
            ..._priorities.asMap().entries.map((entry) {
              final index = entry.key;
              final priority = entry.value;
              return _buildPriorityCard(priority, index, priorityColors);
            }),
        ],
      ),
    );
  }
  
  void _addPriority() {
    if (_priorityController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingresa una prioridad')),
      );
      return;
    }
    
    if (_priorities.length >= 5) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Solo puedes tener 5 prioridades')),
      );
      return;
    }
    
    setState(() {
      _priorities.add({
        'id': DateTime.now().millisecondsSinceEpoch.toString(),
        'text': _priorityController.text.trim(),
        'completed': false,
      });
      _priorityController.clear();
    });
  }

