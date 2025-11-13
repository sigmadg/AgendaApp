part of 'work_sections.dart';

  List<WorkMeeting> _getMeetingsForDate(DateTime date) {
    return _workMeetings.where((meeting) {
      try {
        final meetingDate = DateFormat('yyyy-MM-dd').parse(meeting.date);
        return meetingDate.year == date.year &&
               meetingDate.month == date.month &&
               meetingDate.day == date.day;
      } catch (e) {
        return false;
      }
    }).toList();
  }

  Widget _buildWeeklyTasks(BuildContext context) {
    final todayMeetings = _getMeetingsForDate(_selectedMeetingDate);
    final isToday = _selectedMeetingDate.year == DateTime.now().year &&
                    _selectedMeetingDate.month == DateTime.now().month &&
                    _selectedMeetingDate.day == DateTime.now().day;

    return Column(
      children: [
        // Header mejorado con paleta profesional
        Container(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
          margin: const EdgeInsets.only(top: 16),
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
            borderRadius: AppRadius.xLargeAll,
            boxShadow: AppShadows.elevated(context.pro.secondary),
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
                child: const Icon(Icons.event, color: AppTheme.white, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Sesiones',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.white,
                      ),
                    ),
                    const Text(
                      'Organiza tus reuniones y citas profesionales.',
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
        const SizedBox(height: 16),
        // Selector de fecha con fondo
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                context.pro.primary.withOpacity(0.2),
                context.pro.secondary.withOpacity(0.15),
                context.pro.accent.withOpacity(0.1),
                AppTheme.darkSurface,
              ],
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: context.pro.accent.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(Icons.event, size: 16, color: context.pro.accent),
                                  const SizedBox(width: 6),
                                  Text(
                                    isToday ? 'Hoy' : DateFormat('EEEE, d MMMM', 'es').format(_selectedMeetingDate),
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: context.pro.accent,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        if (todayMeetings.isNotEmpty)
                          Padding(
                            padding: const EdgeInsets.only(top: 8),
                            child: Text(
                              '${todayMeetings.length} evento${todayMeetings.length == 1 ? '' : 's'}',
                              style: TextStyle(
                                fontSize: 12,
                                color: AppTheme.white,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Selector de fecha con desplazamiento horizontal
                SizedBox(
                  height: 55,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    controller: _meetingDateScrollController,
                    itemCount: 30,
                    itemBuilder: (context, index) {
                      final date = DateTime.now().subtract(const Duration(days: 14)).add(Duration(days: index));
                      final dateIsSelected = _selectedMeetingDate.year == date.year &&
                                           _selectedMeetingDate.month == date.month &&
                                           _selectedMeetingDate.day == date.day;
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4),
                        child: _buildMeetingDateSelector(date, dateIsSelected),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
        Expanded(
          child: todayMeetings.isEmpty
              ? _buildEmptyState('No hay eventos para esta fecha', Icons.event_busy)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: todayMeetings.length,
                  itemBuilder: (context, index) => _buildMeetingCard(todayMeetings[index], index),
                ),
        ),
      ],
    );
  }

  Widget _buildMeetingDateSelector(DateTime date, bool isSelected) {
    final isToday = date.year == DateTime.now().year &&
                    date.month == DateTime.now().month &&
                    date.day == DateTime.now().day;
    
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedMeetingDate = date;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        constraints: const BoxConstraints(
          minWidth: 50,
          maxHeight: 55,
          maxWidth: 60,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          gradient: isSelected 
              ? LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    context.pro.accent.withOpacity(0.3),
                    context.pro.secondary.withOpacity(0.2),
                  ],
                )
              : null,
          color: isSelected ? null : AppTheme.darkSurfaceVariant.withOpacity(0.5),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected 
                ? context.pro.accent 
                : Colors.transparent,
            width: 2,
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              DateFormat('EEE', 'es').format(date).substring(0, 3).toUpperCase(),
              style: TextStyle(
                fontSize: 8,
                fontWeight: FontWeight.w600,
                color: isSelected ? context.pro.accent : AppTheme.white,
                height: 1.0,
              ),
            ),
            const SizedBox(height: 1),
            Text(
              '${date.day}',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: isSelected ? context.pro.accent : AppTheme.white,
                height: 1.0,
              ),
            ),
            if (isToday)
              Container(
                margin: const EdgeInsets.only(top: 1),
                width: 3,
                height: 3,
                decoration: BoxDecoration(
                  color: context.pro.accent,
                  shape: BoxShape.circle,
                ),
              ),
          ],
        ),
      ),
    );
  }

  String _getMeetingTypeLabel(String? type) {
    switch (type) {
      case 'meeting':
        return 'Junta';
      case 'session':
        return 'Sesión';
      case 'appointment':
        return 'Cita';
      default:
        return 'Evento';
    }
  }

  IconData _getMeetingTypeIcon(String? type) {
    switch (type) {
      case 'meeting':
        return Icons.groups;
      case 'session':
        return Icons.psychology;
      case 'appointment':
        return Icons.event;
      default:
        return Icons.event;
    }
  }

  Widget _buildMeetingCard(WorkMeeting meeting, int index) {
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
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              context.pro.primary.withOpacity(0.15),
              context.pro.secondary.withOpacity(0.1),
              context.pro.accent.withOpacity(0.05),
              AppTheme.darkSurface,
            ],
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: context.pro.accent.withOpacity(0.4),
            width: 1,
          ),
          boxShadow: [
            BoxShadow(
              color: context.pro.secondary.withOpacity(0.2),
              blurRadius: 10,
              offset: const Offset(0, 4),
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
                      context.pro.primary,
                      context.pro.secondary,
                      context.pro.accent,
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
                      // Icono del evento
                      Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              context.pro.accent.withOpacity(0.4),
                              context.pro.secondary.withOpacity(0.3),
                            ],
                          ),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: context.pro.accent.withOpacity(0.5),
                            width: 1.5,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: context.pro.accent.withOpacity(0.3),
                              blurRadius: 8,
                              spreadRadius: 1,
                            ),
                          ],
                        ),
                        child: Icon(
                          _getMeetingTypeIcon(meeting.type),
                          color: AppTheme.white,
                          size: 28,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              meeting.name,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.white,
                              ),
                            ),
                            const SizedBox(height: 8),
                            // Tipo de evento
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    context.pro.accent.withOpacity(0.25),
                                    context.pro.secondary.withOpacity(0.15),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: context.pro.accent.withOpacity(0.3),
                                  width: 1,
                                ),
                              ),
                              child: Text(
                                _getMeetingTypeLabel(meeting.type),
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: context.pro.accent,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  if (meeting.time != null || meeting.location != null) ...[
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        if (meeting.time != null) ...[
                          Icon(Icons.access_time, size: 18, color: context.pro.accent,),
                          const SizedBox(width: 8),
                          Text(
                            meeting.time!,
                            style: TextStyle(
                              fontSize: 14,
                              color: AppTheme.white,
                            ),
                          ),
                          if (meeting.location != null) const SizedBox(width: 16),
                        ],
                        if (meeting.location != null) ...[
                          Icon(Icons.location_on, size: 18, color: context.pro.accent),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              meeting.location!,
                              style: TextStyle(
                                fontSize: 14,
                                color: AppTheme.white,
                              ),
                              overflow: TextOverflow.ellipsis,
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
      ),
    );
  }
  

  void _showAddMeetingDialog(BuildContext context) {
    final nameController = TextEditingController();
    final timeController = TextEditingController();
    final locationController = TextEditingController();
    String? selectedType;
    TimeOfDay? selectedTime;
    String? errorMessage;
    bool isSaving = false;

    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              backgroundColor: AppTheme.darkSurface,
              title: const Text(
                'Agregar sesión',
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
                      controller: nameController,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        labelText: 'Nombre',
                        labelStyle: const TextStyle(color: AppTheme.white),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: context.pro.accent),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<String>(
                      value: selectedType,
                      decoration: InputDecoration(
                        labelText: 'Tipo',
                        labelStyle: const TextStyle(color: AppTheme.white),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: context.pro.accent),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      dropdownColor: AppTheme.darkSurface,
                      style: const TextStyle(color: AppTheme.white),
                      items: const [
                        DropdownMenuItem(value: 'meeting', child: Text('Junta', style: TextStyle(color: AppTheme.white))),
                        DropdownMenuItem(value: 'session', child: Text('Sesión', style: TextStyle(color: AppTheme.white))),
                        DropdownMenuItem(value: 'appointment', child: Text('Cita', style: TextStyle(color: AppTheme.white))),
                      ],
                      onChanged: (value) {
                        setDialogState(() {
                          selectedType = value;
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: timeController,
                            readOnly: true,
                            style: const TextStyle(color: AppTheme.white),
                            decoration: InputDecoration(
                              labelText: 'Hora',
                              labelStyle: const TextStyle(color: AppTheme.white),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(color: AppTheme.white),
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
                                initialTime: TimeOfDay.now(),
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
                    TextField(
                      controller: locationController,
                      style: const TextStyle(color: AppTheme.white),
                      decoration: InputDecoration(
                        labelText: 'Ubicación (opcional)',
                        labelStyle: const TextStyle(color: AppTheme.white),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: AppTheme.white),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: context.pro.accent),
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(dialogContext).pop(),
                  child: const Text(
                    'Cancelar',
                    style: TextStyle(color: AppTheme.white),
                  ),
                ),
                ElevatedButton(
                  onPressed: isSaving ? null : () async {
                    setDialogState(() {
                      errorMessage = null;
                      isSaving = true;
                    });

                    if (nameController.text.isEmpty) {
                      setDialogState(() {
                        errorMessage = 'Por favor ingresa el nombre';
                        isSaving = false;
                      });
                      return;
                    }

                    final meetingDate = DateFormat('yyyy-MM-dd').format(_selectedMeetingDate);
                    final meetingTime = timeController.text.isNotEmpty ? timeController.text : null;
                    
                    // Verificar empalmes
                    final overlappingEvents = await _checkEventOverlaps(meetingDate, meetingTime);
                    if (overlappingEvents.isNotEmpty) {
                      final shouldContinue = await _showOverlapWarning(context, overlappingEvents);
                      if (!shouldContinue) {
                        setDialogState(() {
                          isSaving = false;
                        });
                        return;
                      }
                    }

                    final meetingId = DateTime.now().millisecondsSinceEpoch.toString();
                    
                    // Crear WorkMeeting
                    final newMeeting = WorkMeeting(
                      id: meetingId,
                      name: nameController.text.trim(),
                      date: meetingDate,
                      time: meetingTime,
                      location: locationController.text.isNotEmpty ? locationController.text : null,
                      type: selectedType,
                      createdAt: DateTime.now(),
                    );

                    // Crear EventOrganization para sincronizar con personal
                    final syncEvent = EventOrganization(
                      id: meetingId,
                      eventName: nameController.text.trim(),
                      date: meetingDate,
                      time: meetingTime,
                      location: locationController.text.isNotEmpty ? locationController.text : null,
                      type: 'work',
                      createdAt: DateTime.now(),
                    );

                    // Guardar en Supabase
                    try {
                      final result = await _eventService.addEvent(syncEvent);
                      if (result['success'] == true) {
                        setState(() {
                          _workMeetings.add(newMeeting);
                        });

                        Navigator.of(dialogContext).pop();
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Sesión agregada exitosamente y sincronizada con eventos personales'),
                              backgroundColor: Colors.green,
                              duration: Duration(seconds: 2),
                            ),
                          );
                        }
                      } else {
                        setDialogState(() {
                          errorMessage = result['error'] ?? 'Error al sincronizar con eventos personales';
                          isSaving = false;
                        });
                      }
                    } catch (e) {
                      setDialogState(() {
                        errorMessage = 'Error al sincronizar: $e';
                        isSaving = false;
                      });
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
