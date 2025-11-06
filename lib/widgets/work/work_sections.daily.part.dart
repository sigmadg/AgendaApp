part of 'work_sections.dart';

  Widget _buildDailyTasks(BuildContext context) {
    final allTasks = _dailyTasks.values.expand((tasks) => tasks).toList();
    final completedTasks = allTasks.where((t) => t.completed).length;
    final totalTasks = allTasks.length;
    final todayTasks = allTasks.where((t) => 
      t.date.year == DateTime.now().year &&
      t.date.month == DateTime.now().month &&
      t.date.day == DateTime.now().day
    ).length;
    
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
                  child: const Icon(Icons.today, color: AppTheme.white, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Tareas',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      const Text(
                        'Organiza tu trabajo día a día',
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
          
          // Resumen de tareas
          Row(
            children: [
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.check_circle_outline,
                  value: '$completedTasks/$totalTasks',
                  label: 'Completadas',
                  color: context.pro.teal,
                  gradientColors: [context.pro.teal, context.pro.accent],
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSummaryCard(
                  icon: Icons.today,
                  value: '$todayTasks',
                  label: 'Hoy',
                  color: context.pro.accent,
                  gradientColors: [context.pro.accent, context.pro.secondary],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          
          // Lista de tareas
          if (_dailyTasks.isEmpty)
            _buildEmptyState('No hay tareas', Icons.today)
          else
            ..._dailyTasks.entries.map((entry) => _buildDailyTaskCard(entry.key, entry.value)),
        ],
      ),
    );
  }
  
  void _addDailyTask() {
    if (_dailyTaskController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor ingresa una tarea')),
      );
      return;
    }
    
    final date = _selectedDailyDate ?? DateTime.now();
    final time = _selectedDailyTime ?? TimeOfDay.now();
    final dateTime = DateTime(
      date.year,
      date.month,
      date.day,
      time.hour,
      time.minute,
    );
    
    setState(() {
      final dateKey = DateTime(date.year, date.month, date.day);
      if (!_dailyTasks.containsKey(dateKey)) {
        _dailyTasks[dateKey] = [];
      }
      _dailyTasks[dateKey]!.add(DailyTask(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        task: _dailyTaskController.text.trim(),
        date: date,
        time: dateTime,
        completed: false,
        priority: _selectedDailyPriority,
      ));
      _dailyTaskController.clear();
      _selectedDailyDate = DateTime.now();
      _selectedDailyTime = TimeOfDay.now();
      _selectedDailyPriority = 'medium';
    });
  }

  void _showAddDailyTaskDialog(BuildContext context) {
    final taskController = TextEditingController();
    final dateController = TextEditingController();
    final timeController = TextEditingController();
    DateTime? selectedDate = DateTime.now();
    TimeOfDay? selectedTime = TimeOfDay.now();
    String? selectedPriority = 'medium';
    String? errorMessage;
    bool isSaving = false;

    // Inicializar los controladores con valores por defecto
    dateController.text = selectedDate != null
        ? '${selectedDate.day}/${selectedDate.month}/${selectedDate.year}'
        : 'Seleccionar fecha';
    timeController.text = selectedTime != null
        ? '${selectedTime.hour.toString().padLeft(2, '0')}:${selectedTime.minute.toString().padLeft(2, '0')}'
        : 'Hora';

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: AppTheme.darkSurface,
              title: const Text(
                'Agregar Tarea Diaria',
                style: TextStyle(color: AppTheme.white),
              ),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Mensaje de error visible
                    if (errorMessage != null) ...[
                      Container(
                        padding: const EdgeInsets.all(12),
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          color: Colors.red.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: Colors.red,
                            width: 1,
                          ),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline, color: Colors.red, size: 20),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                errorMessage!,
                                style: const TextStyle(
                                  color: Colors.red,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                            IconButton(
                              icon: const Icon(Icons.close, color: Colors.red, size: 18),
                              onPressed: () {
                                setDialogState(() {
                                  errorMessage = null;
                                });
                              },
                            ),
                          ],
                        ),
                      ),
                    ],
                    TextField(
                      controller: taskController,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        labelText: 'Tarea',
                        labelStyle: const TextStyle(color: AppTheme.white60),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: context.pro.accent),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: dateController,
                            readOnly: true,
                            style: const TextStyle(color: AppTheme.white),
                            decoration: InputDecoration(
                              labelText: 'Fecha',
                              labelStyle: const TextStyle(color: AppTheme.white60),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: AppTheme.white60),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: context.pro.accent),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              suffixIcon: const Icon(Icons.calendar_today, color: AppTheme.white60),
                            ),
                            onTap: () async {
                              final date = await showDatePicker(
                                context: context,
                                initialDate: selectedDate ?? DateTime.now(),
                                firstDate: DateTime(2020),
                                lastDate: DateTime(2030),
                                builder: (context, child) {
                                  return Theme(
                                    data: ThemeData.dark().copyWith(
                                      colorScheme: ColorScheme.dark(
                                        primary: context.pro.accent,
                                        onPrimary: AppTheme.white,
                                        surface: AppTheme.darkSurface,
                                        onSurface: AppTheme.white,
                                      ),
                                    ),
                                    child: child!,
                                  );
                                },
                              );
                              if (date != null) {
                                setDialogState(() {
                                  selectedDate = date;
                                  dateController.text = '${date.day}/${date.month}/${date.year}';
                                });
                              }
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: TextField(
                            controller: timeController,
                            readOnly: true,
                            style: const TextStyle(color: AppTheme.white),
                            decoration: InputDecoration(
                              labelText: 'Hora',
                              labelStyle: const TextStyle(color: AppTheme.white60),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: AppTheme.white60),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: context.pro.accent),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              suffixIcon: const Icon(Icons.access_time, color: AppTheme.white),
                            ),
                            onTap: () async {
                              final time = await showTimePicker(
                                context: context,
                                initialTime: selectedTime ?? TimeOfDay.now(),
                                builder: (context, child) {
                                  return Theme(
                                    data: ThemeData.dark().copyWith(
                                      colorScheme: ColorScheme.dark(
                                        primary: context.pro.accent,
                                        onPrimary: AppTheme.white,
                                        surface: AppTheme.darkSurface,
                                        onSurface: AppTheme.white,
                                      ),
                                    ),
                                    child: child!,
                                  );
                                },
                              );
                              if (time != null) {
                                setDialogState(() {
                                  selectedTime = time;
                                  timeController.text = '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
                                });
                              }
                            },
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: selectedPriority,
                      decoration: InputDecoration(
                        labelText: 'Prioridad',
                        labelStyle: const TextStyle(color: AppTheme.white60),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white60),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: context.pro.accent),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      dropdownColor: AppTheme.darkSurface,
                      style: const TextStyle(color: AppTheme.white),
                      items: [
                        DropdownMenuItem(
                          value: 'high',
                          child: Row(
                            children: [
                              Icon(
                                _getPriorityIcon('high'),
                                size: 16,
                                color: _getPriorityColor('high', context),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                _getPriorityLabel('high'),
                                style: const TextStyle(color: AppTheme.white),
                              ),
                            ],
                          ),
                        ),
                        DropdownMenuItem(
                          value: 'medium',
                          child: Row(
                            children: [
                              Icon(
                                _getPriorityIcon('medium'),
                                size: 16,
                                color: _getPriorityColor('medium', context),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                _getPriorityLabel('medium'),
                                style: const TextStyle(color: AppTheme.white),
                              ),
                            ],
                          ),
                        ),
                        DropdownMenuItem(
                          value: 'low',
                          child: Row(
                            children: [
                              Icon(
                                _getPriorityIcon('low'),
                                size: 16,
                                color: _getPriorityColor('low', context),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                _getPriorityLabel('low'),
                                style: const TextStyle(color: AppTheme.white),
                              ),
                            ],
                          ),
                        ),
                      ],
                      onChanged: (value) {
                        setDialogState(() {
                          selectedPriority = value;
                        });
                      },
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(dialogContext).pop(),
                  child: const Text(
                    'Cancelar',
                    style: TextStyle(color: AppTheme.white60),
                  ),
                ),
                ElevatedButton(
                  onPressed: isSaving ? null : () async {
                    // Limpiar error anterior
                    setDialogState(() {
                      errorMessage = null;
                      isSaving = true;
                    });

                    if (taskController.text.trim().isEmpty) {
                      setDialogState(() {
                        errorMessage = 'Por favor ingresa la descripción de la tarea';
                        isSaving = false;
                      });
                      return;
                    }

                    final date = selectedDate ?? DateTime.now();
                    final time = selectedTime ?? TimeOfDay.now();
                    final dateTime = DateTime(
                      date.year,
                      date.month,
                      date.day,
                      time.hour,
                      time.minute,
                    );

                    setState(() {
                      final dateKey = DateTime(date.year, date.month, date.day);
                      if (!_dailyTasks.containsKey(dateKey)) {
                        _dailyTasks[dateKey] = [];
                      }
                      _dailyTasks[dateKey]!.add(DailyTask(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        task: taskController.text.trim(),
                        date: date,
                        time: dateTime,
                        completed: false,
                        priority: selectedPriority ?? 'medium',
                      ));
                    });

                    Navigator.of(dialogContext).pop();
                    if (context.mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Tarea diaria agregada exitosamente'),
                          backgroundColor: Colors.green,
                          duration: Duration(seconds: 2),
                        ),
                      );
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: context.pro.accent,
                    foregroundColor: AppTheme.white,
                    disabledBackgroundColor: AppTheme.darkSurfaceVariant,
                  ),
                  child: isSaving
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(AppTheme.white),
                          ),
                        )
                      : const Text('Agregar'),
                ),
              ],
            );
          },
        );
      },
    );
  }

