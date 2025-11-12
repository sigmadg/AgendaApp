import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';
import '../../models/calendar/calendar_task.dart';
import '../../theme/app_theme.dart';

class CalendarView extends StatefulWidget {
  final DateTime selectedDate;
  final Function(DateTime) onDateSelect;
  final Map<DateTime, List<CalendarTask>> tasks;
  final Map<DateTime, List<dynamic>> events;
  final VoidCallback onAddTask;
  final VoidCallback onAddEvent;

  const CalendarView({
    super.key,
    required this.selectedDate,
    required this.onDateSelect,
    required this.tasks,
    required this.events,
    required this.onAddTask,
    required this.onAddEvent,
  });

  @override
  State<CalendarView> createState() => _CalendarViewState();
}

class _CalendarViewState extends State<CalendarView> {
  late DateTime _focusedDay;
  late DateTime _selectedDay;
  late CalendarFormat _calendarFormat;

  @override
  void initState() {
    super.initState();
    // Inicializar con la fecha actual si no se proporciona una fecha seleccionada
    final now = DateTime.now();
    _focusedDay = widget.selectedDate.year == 1970 ? now : widget.selectedDate;
    _selectedDay = widget.selectedDate.year == 1970 ? now : widget.selectedDate;
    _calendarFormat = CalendarFormat.month;
  }

  Map<DateTime, List> _getEvents() {
    final Map<DateTime, List> eventList = {};
    
    // Agregar tareas
    widget.tasks.forEach((date, tasks) {
      final key = DateTime(date.year, date.month, date.day);
      if (eventList.containsKey(key)) {
        eventList[key]!.addAll(tasks);
      } else {
        eventList[key] = List.from(tasks);
      }
    });

    // Agregar eventos
    widget.events.forEach((date, eventItems) {
      final key = DateTime(date.year, date.month, date.day);
      if (eventList.containsKey(key)) {
        eventList[key]!.addAll(eventItems);
      } else {
        eventList[key] = List.from(eventItems);
      }
    });

    return eventList;
  }

  List _getEventsForDay(DateTime day) {
    final key = DateTime(day.year, day.month, day.day);
    return _getEvents()[key] ?? [];
  }

  int _getEventCount(DateTime day) {
    return _getEventsForDay(day).length;
  }

  Color _getEventColor(DateTime day) {
    final events = _getEventsForDay(day);
    if (events.isEmpty) return Colors.transparent;
    
    final tasks = widget.tasks[day];
    if (tasks != null && tasks.isNotEmpty) {
      final completedTasks = tasks.where((task) => task.completed).length;
      final totalTasks = tasks.length;
      return completedTasks == totalTasks ? Colors.green : AppTheme.orangeAccent;
    }
    
    return const Color(0xFFA29BFE);
  }

  String _formatDate(DateTime date) {
    final months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    final weekdays = [
      'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'
    ];
    
    return '${weekdays[date.weekday - 1]}, ${date.day} de ${months[date.month - 1]} de ${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(20),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Calendario',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.event, color: AppTheme.white),
                    onPressed: widget.onAddEvent,
                  ),
                  IconButton(
                    icon: const Icon(Icons.add, color: AppTheme.white),
                    onPressed: widget.onAddTask,
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          
          // Fecha seleccionada
          Container(
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
            decoration: BoxDecoration(
              color: AppTheme.darkSurfaceVariant,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              _formatDate(_selectedDay),
              style: const TextStyle(
                fontSize: 16,
                color: AppTheme.white70,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 16),
          
          // Calendario
          TableCalendar(
            firstDay: DateTime.utc(2020, 1, 1),
            lastDay: DateTime.utc(2030, 12, 31),
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            calendarFormat: _calendarFormat,
            startingDayOfWeek: StartingDayOfWeek.monday,
            headerStyle: const HeaderStyle(
              titleCentered: true,
              formatButtonVisible: false,
              titleTextStyle: TextStyle(
                color: AppTheme.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
              leftChevronIcon: Icon(Icons.chevron_left, color: AppTheme.white),
              rightChevronIcon: Icon(Icons.chevron_right, color: AppTheme.white),
            ),
            calendarStyle: CalendarStyle(
              todayDecoration: BoxDecoration(
                color: AppTheme.orangeAccent.withOpacity(0.3),
                shape: BoxShape.circle,
              ),
              selectedDecoration: const BoxDecoration(
                color: AppTheme.orangeAccent,
                shape: BoxShape.circle,
              ),
              markerDecoration: const BoxDecoration(
                shape: BoxShape.circle,
              ),
              defaultTextStyle: const TextStyle(color: AppTheme.white),
              weekendTextStyle: const TextStyle(color: AppTheme.white70),
              selectedTextStyle: const TextStyle(color: AppTheme.white),
              todayTextStyle: const TextStyle(color: AppTheme.white),
              outsideTextStyle: const TextStyle(color: AppTheme.white40),
              holidayTextStyle: const TextStyle(color: AppTheme.white70),
            ),
            daysOfWeekStyle: const DaysOfWeekStyle(
              weekdayStyle: TextStyle(color: AppTheme.white70),
              weekendStyle: TextStyle(color: AppTheme.white70),
            ),
            eventLoader: _getEventsForDay,
            onDaySelected: (selectedDay, focusedDay) {
              setState(() {
                _selectedDay = selectedDay;
                _focusedDay = focusedDay;
              });
              widget.onDateSelect(selectedDay);
            },
            onPageChanged: (focusedDay) {
              _focusedDay = focusedDay;
            },
            calendarBuilders: CalendarBuilders(
              markerBuilder: (context, date, events) {
                if (events.isEmpty) return const SizedBox.shrink();
                final color = _getEventColor(date);
                return Positioned(
                  bottom: 1,
                  child: Container(
                    width: 6,
                    height: 6,
                    decoration: BoxDecoration(
                      color: color,
                      shape: BoxShape.circle,
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

