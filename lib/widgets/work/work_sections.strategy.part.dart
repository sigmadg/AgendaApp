part of 'work_sections.dart';

  Widget _buildStrategy(BuildContext context) {
    final totalProjects = _projects.length;
    final completedProjects = _projects.where((p) {
      if (p.goals.isEmpty) return false;
      final completedGoals = p.goals.where((g) => g.completed == true).length;
      return completedGoals == p.goals.length && p.goals.isNotEmpty;
    }).length;
    final overdueProjects = _projects.where((p) {
      if (p.deadline == null || p.goals.isEmpty) return false;
      final completedGoals = p.goals.where((g) => g.completed == true).length;
      return p.deadline!.isBefore(DateTime.now()) && completedGoals < p.goals.length;
    }).length;
    final activeProjects = totalProjects - completedProjects;
    
    // Calcular estadísticas avanzadas
    final totalGoals = _projects.fold(0, (sum, p) => sum + p.goals.length);
    final completedGoals = _projects.fold(0, (sum, p) => sum + p.goals.where((g) => g.completed == true).length);
    final overallProgress = totalGoals > 0 ? ((completedGoals / totalGoals) * 100).round() : 0;
    
    // Proyectos próximos a vencer (en los próximos 7 días)
    final upcomingDeadlines = _projects.where((p) {
      if (p.deadline == null) return false;
      final daysUntilDeadline = p.deadline!.difference(DateTime.now()).inDays;
      return daysUntilDeadline >= 0 && daysUntilDeadline <= 7;
    }).length;
    
    // Estadísticas de productividad para planificación
    final totalDailyTasks = _dailyTasks.values.expand((t) => t).length;
    final completedDailyTasks = _dailyTasks.values.expand((t) => t.where((dt) => dt.completed)).length;
    final totalMeetings = _workMeetings.length;
    final totalTasks = totalDailyTasks;
    final efficiency = totalTasks > 0 ? ((completedDailyTasks / totalTasks) * 100).round() : 0;
    
    // Resumen semanal - calcular tareas por día de la semana
    final now = DateTime.now();
    final weekStart = now.subtract(Duration(days: now.weekday - 1));
    final weekDays = List.generate(5, (index) => weekStart.add(Duration(days: index)));
    
    // Si hay un proyecto seleccionado, mostrar el formulario de estrategia
    if (_selectedStrategyProject != null) {
      return _buildProjectStrategyForm(_selectedStrategyProject!);
    }
    
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
                    Icons.track_changes,
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
                        'Estrategia y Planificación',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        'Vista general estratégica y análisis de productividad',
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
          
          // Progreso general mejorado
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  context.pro.indigo.withOpacity(0.15),
                  context.pro.accent.withOpacity(0.1),
                  AppTheme.darkSurface,
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
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                          ),
                          child: const Icon(Icons.trending_up, color: AppTheme.white, size: 24),
                        ),
                        const SizedBox(width: 12),
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Progreso General',
                              style: TextStyle(
                                fontSize: 14,
                                color: AppTheme.white,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Todas las metas',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppTheme.white,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [context.pro.indigo, context.pro.accent],
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '$overallProgress%',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Container(
                  height: 12,
                  decoration: BoxDecoration(
                    color: AppTheme.darkSurfaceVariant,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Stack(
                    children: [
                      FractionallySizedBox(
                        alignment: Alignment.centerLeft,
                        widthFactor: overallProgress / 100,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                context.pro.indigo,
                                context.pro.accent,
                                context.pro.teal,
                              ],
                            ),
                            borderRadius: BorderRadius.circular(6),
                            boxShadow: [
                              BoxShadow(
                                color: context.pro.indigo.withOpacity(0.6),
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
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '$completedGoals de $totalGoals metas completadas',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '${totalProjects} proyecto${totalProjects == 1 ? '' : 's'}',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Estadísticas del dashboard mejoradas
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.rocket_launch,
                  value: '$activeProjects',
                  label: 'Activos',
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
                  icon: Icons.warning_amber,
                  value: '$overdueProjects',
                  label: 'En Retraso',
                  color: Colors.red,
                  gradientColors: [Colors.red, Colors.red.shade700],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.access_time,
                  value: '$upcomingDeadlines',
                  label: 'Próximos',
                  color: Colors.orange,
                  gradientColors: [Colors.orange, Colors.deepOrange],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Sección de Planificación (Análisis de Productividad)
          // Tarjeta de eficiencia mejorada
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  context.pro.teal.withOpacity(0.15),
                  context.pro.accent.withOpacity(0.1),
                  AppTheme.darkSurface,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: context.pro.teal.withOpacity(0.3),
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
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [context.pro.teal, context.pro.accent],
                            ),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.speed, color: AppTheme.white, size: 24),
                        ),
                        const SizedBox(width: 12),
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Eficiencia General',
                              style: TextStyle(
                                fontSize: 14,
                                color: AppTheme.white,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Tareas completadas',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppTheme.white,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: efficiency >= 70
                              ? [Colors.green, Colors.green.shade700]
                              : efficiency >= 50
                                  ? [context.pro.teal, context.pro.accent]
                                  : [Colors.orange, Colors.deepOrange],
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        '$efficiency%',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Container(
                  height: 12,
                  decoration: BoxDecoration(
                    color: AppTheme.darkSurfaceVariant,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Stack(
                    children: [
                      FractionallySizedBox(
                        alignment: Alignment.centerLeft,
                        widthFactor: efficiency / 100,
                        child: Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: efficiency >= 70
                                  ? [Colors.green, Colors.green.shade700]
                                  : efficiency >= 50
                                      ? [context.pro.teal, context.pro.accent]
                                      : [Colors.orange, Colors.deepOrange],
                            ),
                            borderRadius: BorderRadius.circular(6),
                            boxShadow: [
                              BoxShadow(
                                color: (efficiency >= 70
                                        ? Colors.green
                                        : efficiency >= 50
                                            ? context.pro.teal
                                            : Colors.orange)
                                    .withOpacity(0.6),
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
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '$completedDailyTasks de $totalTasks tareas completadas',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                      ),
                    ),
                    Text(
                      '$totalMeetings sesiones',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          
          // Resumen de productividad mejorado
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.task_alt,
                  value: '$completedDailyTasks/$totalTasks',
                  label: 'Tareas',
                  color: context.pro.accent,
                  gradientColors: [context.pro.accent, context.pro.secondary],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.event,
                  value: '$totalMeetings',
                  label: 'Sesiones',
                  color: context.pro.teal,
                  gradientColors: [context.pro.teal, context.pro.accent],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.folder_special,
                  value: '$completedProjects/$totalProjects',
                  label: 'Proyectos',
                  color: context.pro.indigo,
                  gradientColors: [context.pro.indigo, context.pro.accent],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.flag,
                  value: '${_goals.length}',
                  label: 'Objetivos',
                  color: Colors.purple,
                  gradientColors: [Colors.purple, Colors.deepPurple],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Resumen Semanal mejorado
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  context.pro.primary.withOpacity(0.15),
                  context.pro.secondary.withOpacity(0.1),
                  AppTheme.darkSurface,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: context.pro.secondary.withOpacity(0.3),
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
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.calendar_view_week, color: AppTheme.white, size: 20),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'Resumen Semanal',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                ...weekDays.asMap().entries.map((entry) {
                  final index = entry.key;
                  final date = entry.value;
                  final dayName = DateFormat('EEEE', 'es').format(date);
                  final isToday = date.year == now.year && 
                                  date.month == now.month && 
                                  date.day == now.day;
                  
                  // Calcular tareas para este día
                  final dateKey = DateTime(date.year, date.month, date.day);
                  final dayTasks = _dailyTasks[dateKey] ?? [];
                  final completedDayTasks = dayTasks.where((t) => t.completed).length;
                  final dayMeetings = _workMeetings.where((m) {
                    try {
                      final meetingDate = DateFormat('yyyy-MM-dd').parse(m.date);
                      return meetingDate.year == date.year &&
                             meetingDate.month == date.month &&
                             meetingDate.day == date.day;
                    } catch (e) {
                      return false;
                    }
                  }).length;
                  
                  // Calcular proyectos completados (proyectos donde todas las metas están completadas)
                  final completedProjects = _projects.where((p) {
                    if (p.goals.isEmpty) return false;
                    final completedGoals = p.goals.where((g) => g.completed == true).length;
                    return completedGoals == p.goals.length && p.goals.isNotEmpty;
                  }).length;
                  
                  // Calcular progreso de proyectos (basado en metas completadas)
                  final totalProjectGoals = _projects.fold(0, (sum, p) => sum + p.goals.length);
                  final completedProjectGoals = _projects.fold(0, (sum, p) => sum + p.goals.where((g) => g.completed == true).length);
                  final projectProgress = totalProjectGoals > 0 ? ((completedProjectGoals / totalProjectGoals) * 100).round() : 0;
                  
                  final totalDayItems = dayTasks.length + dayMeetings;
                  final completedDayItems = completedDayTasks;
                  final dayProgress = totalDayItems > 0 ? ((completedDayItems / totalDayItems) * 100).round() : 0;
                  
                  return Container(
                    margin: EdgeInsets.only(bottom: index < weekDays.length - 1 ? 16 : 0),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: isToday
                            ? [
                                context.pro.accent.withOpacity(0.2),
                                context.pro.secondary.withOpacity(0.15),
                                AppTheme.darkSurface,
                              ]
                            : [
                                AppTheme.darkSurfaceVariant.withOpacity(0.3),
                                AppTheme.darkSurface.withOpacity(0.5),
                              ],
                      ),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isToday
                            ? context.pro.accent.withOpacity(0.4)
                            : AppTheme.darkSurfaceVariant.withOpacity(0.2),
                        width: isToday ? 1.5 : 1,
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
                                Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: isToday
                                          ? [context.pro.accent, context.pro.secondary]
                                          : [context.pro.slate, context.pro.indigo],
                                    ),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Icon(
                                    isToday ? Icons.today : Icons.calendar_today,
                                    color: AppTheme.white,
                                    size: 16,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Text(
                                          dayName.substring(0, 1).toUpperCase() + dayName.substring(1),
                                          style: TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.white,
                                          ),
                                        ),
                                        if (isToday) ...[
                                          const SizedBox(width: 8),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: context.pro.accent.withOpacity(0.3),
                                              borderRadius: BorderRadius.circular(6),
                                            ),
                                            child: Text(
                                              'HOY',
                                              style: TextStyle(
                                                fontSize: 9,
                                                fontWeight: FontWeight.bold,
                                                color: context.pro.accent,
                                                letterSpacing: 0.5,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ],
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      DateFormat('d MMM', 'es').format(date),
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: AppTheme.white,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            Row(
                              children: [
                                if (completedProjects > 0) ...[
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                                    decoration: BoxDecoration(
                                      gradient: LinearGradient(
                                        colors: [Colors.green, Colors.green.shade700],
                                      ),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        const Icon(Icons.check_circle, size: 14, color: AppTheme.white),
                                        const SizedBox(width: 4),
                                        Text(
                                          '$completedProjects',
                                          style: const TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.white,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                ],
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: isToday
                                          ? [context.pro.accent, context.pro.secondary]
                                          : [context.pro.teal, context.pro.accent],
                                    ),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    '$totalDayItems',
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.white,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                        if (totalDayItems > 0 || _projects.isNotEmpty) ...[
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              if (totalDayItems > 0) ...[
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            'Progreso Tareas',
                                            style: TextStyle(
                                              fontSize: 11,
                                              color: AppTheme.white,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                          Text(
                                            '$dayProgress%',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                              color: AppTheme.white,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      Container(
                                        height: 6,
                                        decoration: BoxDecoration(
                                          color: AppTheme.darkSurfaceVariant,
                                          borderRadius: BorderRadius.circular(3),
                                        ),
                                        child: FractionallySizedBox(
                                          alignment: Alignment.centerLeft,
                                          widthFactor: dayProgress / 100,
                                          child: Container(
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                colors: isToday
                                                    ? [context.pro.accent, context.pro.secondary]
                                                    : dayProgress >= 70
                                                        ? [Colors.green, Colors.green.shade700]
                                                        : [context.pro.teal, context.pro.accent],
                                              ),
                                              borderRadius: BorderRadius.circular(3),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                              if (_projects.isNotEmpty) ...[
                                if (totalDayItems > 0) const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            'Progreso Proyectos',
                                            style: TextStyle(
                                              fontSize: 11,
                                              color: AppTheme.white,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                          Text(
                                            '$projectProgress%',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                              color: AppTheme.white,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 6),
                                      Container(
                                        height: 6,
                                        decoration: BoxDecoration(
                                          color: AppTheme.darkSurfaceVariant,
                                          borderRadius: BorderRadius.circular(3),
                                        ),
                                        child: FractionallySizedBox(
                                          alignment: Alignment.centerLeft,
                                          widthFactor: projectProgress / 100,
                                          child: Container(
                                            decoration: BoxDecoration(
                                              gradient: LinearGradient(
                                                colors: projectProgress >= 100
                                                    ? [Colors.green, Colors.green.shade700]
                                                    : projectProgress >= 70
                                                        ? [context.pro.teal, context.pro.accent]
                                                        : [context.pro.indigo, context.pro.secondary],
                                              ),
                                              borderRadius: BorderRadius.circular(3),
                                            ),
                                          ),
                                        ),
                                      ),
                                      if (completedProjects > 0) ...[
                                        const SizedBox(height: 6),
                                        Row(
                                          children: [
                                            Icon(Icons.check_circle, size: 11, color: Colors.green),
                                            const SizedBox(width: 4),
                                            Expanded(
                                              child: Text(
                                                '$completedProjects/${_projects.length} completados',
                                                style: TextStyle(
                                                  fontSize: 9,
                                                  color: Colors.green,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
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
                          if (totalDayItems > 0) ...[
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                  if (dayTasks.isNotEmpty) ...[
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: context.pro.accent.withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(Icons.task, size: 12, color: context.pro.accent),
                                          const SizedBox(width: 4),
                                          Text(
                                            '${dayTasks.length}',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                              color: context.pro.accent,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                  if (dayMeetings > 0) ...[
                                    if (dayTasks.isNotEmpty) const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: context.pro.teal.withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(Icons.event, size: 12, color: context.pro.teal),
                                          const SizedBox(width: 4),
                                          Text(
                                            '$dayMeetings',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.bold,
                                              color: context.pro.teal,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ],
                          ],
                        ],
                    ),
                  ),
                );
              }).toList(),
            ],
            ),
          ),
          const SizedBox(height: 24),
          
          // Mostrar formulario de estrategia si hay un proyecto seleccionado
          if (_selectedStrategyProject != null)
            _buildProjectStrategyForm(_selectedStrategyProject!),
        ],
      ),
    );
  }

  Widget _buildProjectStrategyForm(WorkProject project) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Botón para volver
          Row(
            children: [
              TextButton.icon(
                onPressed: () {
                  setState(() {
                    _selectedStrategyProject = null;
                  });
                },
                icon: Icon(Icons.arrow_back, color: context.pro.accent),
                label: Text(
                  'Volver',
                  style: TextStyle(color: context.pro.accent),
                ),
              ),
              const Spacer(),
              Text(
                project.title,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          // PROJECT STRATEGY Section
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  context.pro.primary.withOpacity(0.2),
                  context.pro.secondary.withOpacity(0.15),
                  AppTheme.darkSurface,
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
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.track_changes, color: AppTheme.white, size: 20),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'PROJECT STRATEGY',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                
                // PROJECT TITLE
                _buildFormField('PROJECT TITLE:', project.title),
                const SizedBox(height: 16),
                
                // PROJECT AIM
                _buildFormField('PROJECT AIM:', project.aim, subtitle: 'Brief introduction of the project'),
                const SizedBox(height: 16),
                
                // START DATE
                Row(
                  children: [
                    Expanded(
                      child: _buildFormField(
                        'START DATE:',
                        project.startDate != null
                            ? DateFormat('dd/MM/yyyy').format(project.startDate!)
                            : 'No definida',
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildFormField(
                        'DEADLINE:',
                        project.deadline != null
                            ? DateFormat('dd/MM/yyyy').format(project.deadline!)
                            : 'No definida',
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                
                // Tabla de Compañeros de Equipo
                _buildTableHeader('COMPAÑEROS DE EQUIPO'),
                const SizedBox(height: 12),
                _buildTeammatesTable(project.teammates),
                const SizedBox(height: 24),
                
                // Tabla de Logros
                _buildTableHeader('LOGROS'),
                const SizedBox(height: 12),
                _buildAchievementsTable(project.achievements),
                const SizedBox(height: 24),
                
                // Tabla de Trabajos
                _buildTableHeader('TRABAJOS'),
                const SizedBox(height: 12),
                _buildWorksTable(project.works),
                const SizedBox(height: 24),
                
                // Tabla de Financiamiento
                _buildTableHeader('FINANCIAMIENTO'),
                const SizedBox(height: 12),
                _buildFundingTable(project.funding),
              ],
            ),
          ),
          const SizedBox(height: 24),
          
          // PROJECT OVERVIEW Section
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  context.pro.teal.withOpacity(0.2),
                  context.pro.accent.withOpacity(0.15),
                  AppTheme.darkSurface,
                ],
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: context.pro.teal.withOpacity(0.3),
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
                          colors: [context.pro.teal, context.pro.accent],
                        ),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.description, color: AppTheme.white, size: 20),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'PROJECT OVERVIEW',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                
                // BUSINESS NAME and DATE
                Row(
                  children: [
                    Expanded(
                      child: _buildFormField(
                        'BUSINESS NAME:',
                        project.overview?.businessName ?? '',
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _buildFormField(
                        'DATE:',
                        project.overview?.date != null
                            ? DateFormat('dd/MM/yyyy').format(project.overview!.date!)
                            : DateFormat('dd/MM/yyyy').format(DateTime.now()),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                
                // CUSTOMER COMPANY, UNDERTAKING, PRESUMPTION
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.orange.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'CUSTOMER COMPANY',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          _buildFormField('Name:', project.overview?.customerCompany?.name ?? ''),
                          const SizedBox(height: 8),
                          _buildFormField('Phone:', project.overview?.customerCompany?.phone ?? ''),
                          const SizedBox(height: 8),
                          _buildFormField('Email:', project.overview?.customerCompany?.email ?? ''),
                          const SizedBox(height: 8),
                          _buildFormField('Address:', project.overview?.customerCompany?.address ?? ''),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.orange.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'UNDERTAKING',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          _buildFormField('Name:', project.overview?.undertaking?.name ?? ''),
                          const SizedBox(height: 8),
                          _buildFormField('Customer:', project.overview?.undertaking?.customer ?? ''),
                          const SizedBox(height: 8),
                          _buildFormField('Label:', project.overview?.undertaking?.label ?? ''),
                          const SizedBox(height: 8),
                          _buildFormField('Notes:', project.overview?.undertaking?.notes ?? ''),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.lightBlue.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'PRESUMPTION',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          // Primer text area de PRESUMPTION
                          Container(
                            height: 100,
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.lightBlue.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: Colors.lightBlue.withOpacity(0.4),
                                width: 1,
                              ),
                            ),
                            child: SingleChildScrollView(
                              child: Text(
                                project.overview?.presumption ?? '',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.white,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          // Segundo text area de PRESUMPTION
                          Container(
                            height: 100,
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.lightBlue.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: Colors.lightBlue.withOpacity(0.4),
                                width: 1,
                              ),
                            ),
                            child: SingleChildScrollView(
                              child: Text(
                                '', // Segundo text area vacío por ahora
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.white,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                
                // JOB DESCRIPTION and PROJECT TARGETS
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.lightBlue.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'JOB DESCRIPTION',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            height: 150,
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.lightBlue.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: Colors.lightBlue.withOpacity(0.4),
                                width: 1,
                              ),
                            ),
                            child: SingleChildScrollView(
                              child: Text(
                                project.overview?.jobDescription ?? '',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.white,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.lightBlue.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'PROJECT OUTPUTS',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          if (project.overview?.projectOutputs.isEmpty ?? true)
                            // Mostrar 3 líneas vacías con checkboxes y campos de entrada
                            ...List.generate(3, (index) {
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 8),
                                child: Row(
                                  children: [
                                    Checkbox(
                                      value: false,
                                      onChanged: null,
                                      fillColor: MaterialStateProperty.all(
                                        AppTheme.darkSurfaceVariant,
                                      ),
                                    ),
                                    Expanded(
                                      child: Container(
                                        height: 32,
                                        padding: const EdgeInsets.symmetric(horizontal: 8),
                                        decoration: BoxDecoration(
                                          color: AppTheme.darkSurfaceVariant.withOpacity(0.5),
                                          borderRadius: BorderRadius.circular(4),
                                          border: Border.all(
                                            color: Colors.lightBlue.withOpacity(0.3),
                                            width: 1,
                                          ),
                                        ),
                                        child: Align(
                                          alignment: Alignment.centerLeft,
                                          child: Text(
                                            '',
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: AppTheme.white,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            })
                          else
                            ...project.overview!.projectOutputs.map((output) {
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 8),
                                child: Row(
                                  children: [
                                    Checkbox(
                                      value: output.completed,
                                      onChanged: null,
                                      fillColor: MaterialStateProperty.all(
                                        output.completed ? Colors.lightBlue : AppTheme.darkSurfaceVariant,
                                      ),
                                    ),
                                    Expanded(
                                      child: Container(
                                        height: 32,
                                        padding: const EdgeInsets.symmetric(horizontal: 8),
                                        decoration: BoxDecoration(
                                          color: AppTheme.darkSurfaceVariant.withOpacity(0.5),
                                          borderRadius: BorderRadius.circular(4),
                                          border: Border.all(
                                            color: Colors.lightBlue.withOpacity(0.3),
                                            width: 1,
                                          ),
                                        ),
                                        child: Align(
                                          alignment: Alignment.centerLeft,
                                          child: Text(
                                            output.text,
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: output.completed ? AppTheme.white : AppTheme.white,
                                              decoration: output.completed ? TextDecoration.lineThrough : null,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            }),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.orange.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'PROJECT TARGETS',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.orange.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: Colors.orange.withOpacity(0.3),
                                width: 1,
                              ),
                            ),
                            child: Column(
                              children: project.overview?.projectTargets.isEmpty ?? true
                                  ? List.generate(5, (index) {
                                      return Padding(
                                        padding: const EdgeInsets.only(bottom: 8),
                                        child: Container(
                                          height: 24,
                                          decoration: BoxDecoration(
                                            border: Border(
                                              bottom: BorderSide(
                                                color: AppTheme.white.withOpacity(0.3),
                                                width: 1,
                                              ),
                                            ),
                                          ),
                                        ),
                                      );
                                    })
                                  : project.overview!.projectTargets.map((target) {
                                      return Padding(
                                        padding: const EdgeInsets.only(bottom: 8),
                                        child: Container(
                                          height: 24,
                                          decoration: BoxDecoration(
                                            border: Border(
                                              bottom: BorderSide(
                                                color: AppTheme.white.withOpacity(0.3),
                                                width: 1,
                                              ),
                                            ),
                                          ),
                                          child: Align(
                                            alignment: Alignment.centerLeft,
                                            child: Text(
                                              target.text,
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: AppTheme.white,
                                              ),
                                            ),
                                          ),
                                        ),
                                      );
                                    }).toList(),
                            ),
                          ),
                          const SizedBox(height: 16),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.orange.withOpacity(0.3),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'ACHIEVEMENTS',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            height: 150,
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.orange.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: Colors.orange.withOpacity(0.3),
                                width: 1,
                              ),
                            ),
                            child: SingleChildScrollView(
                              child: Text(
                                project.overview?.achievements ?? '',
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppTheme.white,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFormField(String label, String value, {String? subtitle}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: AppTheme.white,
          ),
        ),
        if (subtitle != null) ...[
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 10,
              color: AppTheme.white,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
        const SizedBox(height: 4),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppTheme.darkSurfaceVariant.withOpacity(0.5),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: context.pro.secondary.withOpacity(0.3),
              width: 1,
            ),
          ),
          child: Text(
            value.isEmpty ? 'Sin definir' : value,
            style: TextStyle(
              fontSize: 14,
              color: value.isEmpty ? AppTheme.white : AppTheme.white,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTableHeader(String title) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [context.pro.primary, context.pro.secondary],
        ),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: AppTheme.white,
        ),
      ),
    );
  }

  Widget _buildTeammatesTable(List<ProjectTeammate> teammates) {
    if (teammates.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Center(
          child: Text(
            'Sin compañeros de equipo',
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.white,
              fontStyle: FontStyle.italic,
            ),
          ),
        ),
      );
    }
    
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: context.pro.secondary.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Table(
        border: TableBorder(
          horizontalInside: BorderSide(
            color: AppTheme.darkSurfaceVariant.withOpacity(0.5),
            width: 1,
          ),
        ),
        children: [
          TableRow(
            decoration: BoxDecoration(
              color: context.pro.primary.withOpacity(0.2),
            ),
            children: [
              _buildTableCell('STT', isHeader: true),
              _buildTableCell('POSITION', isHeader: true),
              _buildTableCell('NAME', isHeader: true),
            ],
          ),
          ...teammates.asMap().entries.map((entry) {
            final index = entry.key;
            final teammate = entry.value;
            return TableRow(
              children: [
                _buildTableCell('${index + 1}'),
                _buildTableCell(teammate.role),
                _buildTableCell(teammate.name),
              ],
            );
          }),
        ],
      ),
    );
  }

  Widget _buildAchievementsTable(List<ProjectAchievement> achievements) {
    if (achievements.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Center(
          child: Text(
            'Sin logros definidos',
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.white,
              fontStyle: FontStyle.italic,
            ),
          ),
        ),
      );
    }
    
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: context.pro.secondary.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Table(
        border: TableBorder(
          horizontalInside: BorderSide(
            color: AppTheme.darkSurfaceVariant.withOpacity(0.5),
            width: 1,
          ),
        ),
        children: [
          TableRow(
            decoration: BoxDecoration(
              color: context.pro.primary.withOpacity(0.2),
            ),
            children: [
              _buildTableCell('STT', isHeader: true),
              _buildTableCell('ACHIEVEMENT NAME', isHeader: true),
              _buildTableCell('DUE DATE', isHeader: true),
            ],
          ),
          ...achievements.asMap().entries.map((entry) {
            final index = entry.key;
            final achievement = entry.value;
            return TableRow(
              children: [
                _buildTableCell('${index + 1}'),
                _buildTableCell(achievement.text),
                _buildTableCell(
                  achievement.date != null
                      ? DateFormat('dd/MM/yyyy').format(achievement.date!)
                      : 'Sin fecha',
                ),
              ],
            );
          }),
        ],
      ),
    );
  }

  Widget _buildWorksTable(List<ProjectWork> works) {
    if (works.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Center(
          child: Text(
            'Sin trabajos definidos',
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.white,
              fontStyle: FontStyle.italic,
            ),
          ),
        ),
      );
    }
    
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: context.pro.secondary.withOpacity(0.2),
            width: 1,
          ),
        ),
        child: Table(
          border: TableBorder(
            horizontalInside: BorderSide(
              color: AppTheme.darkSurfaceVariant.withOpacity(0.5),
              width: 1,
            ),
          ),
          columnWidths: const {
            0: FlexColumnWidth(1.5),
            1: FlexColumnWidth(1.5),
            2: FlexColumnWidth(1),
            3: FlexColumnWidth(1.2),
            4: FlexColumnWidth(1.2),
            5: FlexColumnWidth(2),
          },
          children: [
            TableRow(
              decoration: BoxDecoration(
                color: context.pro.primary.withOpacity(0.2),
              ),
              children: [
                _buildTableCell('POSITION', isHeader: true),
                _buildTableCell('APPOINT', isHeader: true),
                _buildTableCell('STATUS', isHeader: true),
                _buildTableCell('START DATE', isHeader: true),
                _buildTableCell('DEADLINE', isHeader: true),
                _buildTableCell('NOTES', isHeader: true),
              ],
            ),
            ...works.map((work) {
              return TableRow(
                children: [
                  _buildTableCell(work.position),
                  _buildTableCell(work.appoint),
                  _buildTableCell(work.status),
                  _buildTableCell(
                    work.startDate != null
                        ? DateFormat('dd/MM/yyyy').format(work.startDate!)
                        : 'Sin fecha',
                  ),
                  _buildTableCell(
                    work.deadline != null
                        ? DateFormat('dd/MM/yyyy').format(work.deadline!)
                        : 'Sin fecha',
                  ),
                  _buildTableCell(work.notes ?? ''),
                ],
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildFundingTable(List<ProjectFunding> funding) {
    if (funding.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Center(
          child: Text(
            'Sin financiamiento definido',
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.white,
              fontStyle: FontStyle.italic,
            ),
          ),
        ),
      );
    }
    
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.darkSurfaceVariant.withOpacity(0.3),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: context.pro.secondary.withOpacity(0.2),
            width: 1,
          ),
        ),
        child: Table(
          border: TableBorder(
            horizontalInside: BorderSide(
              color: AppTheme.darkSurfaceVariant.withOpacity(0.5),
              width: 1,
            ),
          ),
          columnWidths: const {
            0: FlexColumnWidth(2),
            1: FlexColumnWidth(1.5),
            2: FlexColumnWidth(1.5),
            3: FlexColumnWidth(2),
          },
          children: [
            TableRow(
              decoration: BoxDecoration(
                color: context.pro.primary.withOpacity(0.2),
              ),
              children: [
                _buildTableCell('ELEMENT', isHeader: true),
                _buildTableCell('PROJECTED COST', isHeader: true),
                _buildTableCell('REAL COST', isHeader: true),
                _buildTableCell('NOTES', isHeader: true),
              ],
            ),
            ...funding.map((fund) {
              return TableRow(
                children: [
                  _buildTableCell(fund.element),
                  _buildTableCell(
                    fund.projectedCost != null
                        ? '\$${fund.projectedCost!.toStringAsFixed(2)}'
                        : 'Sin definir',
                  ),
                  _buildTableCell(
                    fund.realCost != null
                        ? '\$${fund.realCost!.toStringAsFixed(2)}'
                        : 'Sin definir',
                  ),
                  _buildTableCell(fund.notes ?? ''),
                ],
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildTableCell(String text, {bool isHeader = false}) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Text(
        text,
        style: TextStyle(
          fontSize: isHeader ? 11 : 10,
          fontWeight: isHeader ? FontWeight.bold : FontWeight.normal,
          color: isHeader ? AppTheme.white : AppTheme.white,
        ),
      ),
    );
  }
