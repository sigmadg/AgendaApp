import 'package:flutter/material.dart';
import '../../models/event/birthday.dart';
import '../../models/event/event_organization.dart';
import '../../models/event/reminder.dart';
import '../../models/event/invitation.dart';
import '../../theme/app_theme.dart';

class EventsSections extends StatefulWidget {
  const EventsSections({super.key});

  @override
  State<EventsSections> createState() => _EventsSectionsState();
}

class _EventsSectionsState extends State<EventsSections> {
  String _activeSection = 'birthdays';
  List<Birthday> _birthdays = [];
  List<EventOrganization> _eventOrganizations = [];
  List<Reminder> _reminders = [];
  List<Invitation> _invitations = [];

  final sections = [
    {'id': 'birthdays', 'name': 'Cumpleaños', 'icon': Icons.card_giftcard},
    {'id': 'event-organization', 'name': 'Organización', 'icon': Icons.people},
    {'id': 'reminders', 'name': 'Recordatorios', 'icon': Icons.alarm},
    {'id': 'invitations', 'name': 'Invitaciones', 'icon': Icons.mail},
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
                        color: isActive ? AppTheme.white : AppTheme.white,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        section['name'] as String,
                        style: TextStyle(
                          color: isActive ? AppTheme.white : AppTheme.white,
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
      case 'birthdays':
        return _buildBirthdaysSection();
      case 'event-organization':
        return _buildEventOrganizationSection();
      case 'reminders':
        return _buildRemindersSection();
      case 'invitations':
        return _buildInvitationsSection();
      default:
        return _buildBirthdaysSection();
    }
  }

  Widget _buildBirthdaysSection() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'CUMPLEAÑOS',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add, color: AppTheme.white),
                onPressed: () => _showAddBirthdayModal(context),
              ),
            ],
          ),
        ),
        Expanded(
          child: _birthdays.isEmpty
              ? _buildEmptyState('No hay cumpleaños registrados', Icons.card_giftcard)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _birthdays.length,
                  itemBuilder: (context, index) {
                    return _buildBirthdayCard(_birthdays[index]);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildEventOrganizationSection() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'ORGANIZACIÓN DE EVENTOS',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add, color: AppTheme.white),
                onPressed: () => _showAddEventOrgModal(context),
              ),
            ],
          ),
        ),
        Expanded(
          child: _eventOrganizations.isEmpty
              ? _buildEmptyState('No hay eventos organizados', Icons.people)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _eventOrganizations.length,
                  itemBuilder: (context, index) {
                    return _buildEventOrgCard(_eventOrganizations[index]);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildRemindersSection() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'RECORDATORIOS',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add, color: AppTheme.white),
                onPressed: () => _showAddReminderModal(context),
              ),
            ],
          ),
        ),
        Expanded(
          child: _reminders.isEmpty
              ? _buildEmptyState('No hay recordatorios', Icons.alarm)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _reminders.length,
                  itemBuilder: (context, index) {
                    return _buildReminderCard(_reminders[index]);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildInvitationsSection() {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'INVITACIONES',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.white,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.add, color: AppTheme.white),
                onPressed: () => _showAddInvitationModal(context),
              ),
            ],
          ),
        ),
        Expanded(
          child: _invitations.isEmpty
              ? _buildEmptyState('No hay invitaciones', Icons.mail)
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _invitations.length,
                  itemBuilder: (context, index) {
                    return _buildInvitationCard(_invitations[index]);
                  },
                ),
        ),
      ],
    );
  }

  Widget _buildEmptyState(String message, IconData icon) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 64, color: AppTheme.white),
          const SizedBox(height: 16),
          Text(
            message,
            style: const TextStyle(
              fontSize: 16,
              color: AppTheme.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBirthdayCard(Birthday birthday) {
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
                        birthday.name,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      if (birthday.age != null)
                        Text(
                          'Cumple ${birthday.age} años',
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppTheme.white,
                          ),
                        ),
                    ],
                  ),
                ),
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.edit, color: AppTheme.orangeAccent),
                      onPressed: () {},
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red),
                      onPressed: () => _deleteBirthday(birthday.id),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              birthday.relationship,
              style: const TextStyle(
                fontSize: 14,
                color: AppTheme.white,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16, color: AppTheme.white),
                const SizedBox(width: 8),
                Text(
                  birthday.date,
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white,
                  ),
                ),
              ],
            ),
            if (birthday.phone != null || birthday.email != null || birthday.notes != null) ...[
              const SizedBox(height: 12),
              if (birthday.phone != null)
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.phone, size: 16, color: Colors.green),
                  title: Text(
                    birthday.phone!,
                    style: const TextStyle(fontSize: 14, color: AppTheme.white),
                  ),
                ),
              if (birthday.email != null)
                ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: const Icon(Icons.email, size: 16, color: Colors.blue),
                  title: Text(
                    birthday.email!,
                    style: const TextStyle(fontSize: 14, color: AppTheme.white),
                  ),
                ),
              if (birthday.notes != null)
                Text(
                  'Notas: ${birthday.notes}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppTheme.white,
                    fontStyle: FontStyle.italic,
                  ),
                ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildEventOrgCard(EventOrganization event) {
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
                        event.eventName,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      if (event.type != null)
                        Text(
                          event.type!,
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppTheme.white,
                          ),
                        ),
                    ],
                  ),
                ),
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.edit, color: AppTheme.orangeAccent),
                      onPressed: () {},
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red),
                      onPressed: () => _deleteEventOrg(event.id),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16, color: AppTheme.white),
                const SizedBox(width: 8),
                Text(
                  '${event.date} ${event.time != null ? "• ${event.time}" : ""}',
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white,
                  ),
                ),
              ],
            ),
            if (event.location != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.location_on, size: 16, color: Colors.green),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      event.location!,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.white,
                      ),
                    ),
                  ),
                ],
              ),
            ],
            if (event.guests != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.people, size: 16, color: Colors.blue),
                  const SizedBox(width: 8),
                  Text(
                    '${event.guests} invitados',
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppTheme.white,
                    ),
                  ),
                ],
              ),
            ],
            if (event.budget != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.account_balance_wallet, size: 16, color: Colors.orange),
                  const SizedBox(width: 8),
                  Text(
                    event.budget!,
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppTheme.white,
                    ),
                  ),
                ],
              ),
            ],
            if (event.notes != null && event.notes!.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                'Notas: ${event.notes}',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppTheme.white,
                  fontStyle: FontStyle.italic,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildReminderCard(Reminder reminder) {
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
                        reminder.title,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      if (reminder.type != null)
                        Text(
                          reminder.type!,
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppTheme.white,
                          ),
                        ),
                    ],
                  ),
                ),
                Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.edit, color: AppTheme.orangeAccent),
                      onPressed: () {},
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete, color: Colors.red),
                      onPressed: () => _deleteReminder(reminder.id),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16, color: AppTheme.white),
                const SizedBox(width: 8),
                Text(
                  '${reminder.date} ${reminder.time != null ? "• ${reminder.time}" : ""}',
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white,
                  ),
                ),
              ],
            ),
            if (reminder.description != null && reminder.description!.isNotEmpty) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurfaceVariant,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.description, size: 16, color: AppTheme.white),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        reminder.description!,
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
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

  Widget _buildInvitationCard(Invitation invitation) {
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
                        invitation.eventName,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.white,
                        ),
                      ),
                      Text(
                        invitation.guestName,
                        style: const TextStyle(
                          fontSize: 16,
                          color: AppTheme.white,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: _getStatusColor(invitation.status),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _getStatusText(invitation.status),
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
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16, color: AppTheme.white),
                const SizedBox(width: 8),
                Text(
                  invitation.invitationDate != null
                      ? 'Enviada: ${_formatDate(invitation.invitationDate!)}'
                      : 'Fecha no disponible',
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppTheme.white,
                  ),
                ),
              ],
            ),
            if (invitation.email != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.email, size: 16, color: Colors.blue),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      invitation.email!,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.white,
                      ),
                    ),
                  ),
                ],
              ),
            ],
            if (invitation.phone != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.phone, size: 16, color: Colors.green),
                  const SizedBox(width: 8),
                  Text(
                    invitation.phone!,
                    style: const TextStyle(
                      fontSize: 14,
                      color: AppTheme.white,
                    ),
                  ),
                ],
              ),
            ],
            if (invitation.message != null && invitation.message!.isNotEmpty) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurfaceVariant,
                  borderRadius: BorderRadius.circular(12),
                  border: Border(
                    left: BorderSide(
                      color: Colors.blue,
                      width: 4,
                    ),
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.message, size: 16, color: AppTheme.white),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        invitation.message!,
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppTheme.white,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                IconButton(
                  icon: const Icon(Icons.edit, color: AppTheme.orangeAccent),
                  onPressed: () {},
                ),
                IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: () => _deleteInvitation(invitation.id),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'confirmed':
        return Colors.green;
      case 'pending':
        return Colors.orange;
      case 'declined':
        return Colors.red;
      default:
        return AppTheme.darkSurfaceVariant;
    }
  }

  String _getStatusText(String status) {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendiente';
      case 'declined':
        return 'Rechazado';
      default:
        return 'Desconocido';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  void _deleteBirthday(String id) {
    setState(() {
      _birthdays.removeWhere((b) => b.id == id);
    });
  }

  void _deleteEventOrg(String id) {
    setState(() {
      _eventOrganizations.removeWhere((e) => e.id == id);
    });
  }

  void _deleteReminder(String id) {
    setState(() {
      _reminders.removeWhere((r) => r.id == id);
    });
  }

  void _deleteInvitation(String id) {
    setState(() {
      _invitations.removeWhere((i) => i.id == id);
    });
  }

  void _showAddBirthdayModal(BuildContext context) {
    // Modal implementation will be added
    showDialog(
      context: context,
      builder: (context) => const AlertDialog(
        title: Text('Agregar Cumpleaños'),
        content: Text('Funcionalidad en desarrollo'),
      ),
    );
  }

  void _showAddEventOrgModal(BuildContext context) {
    // Modal implementation will be added
    showDialog(
      context: context,
      builder: (context) => const AlertDialog(
        title: Text('Agregar Evento'),
        content: Text('Funcionalidad en desarrollo'),
      ),
    );
  }

  void _showAddReminderModal(BuildContext context) {
    // Modal implementation will be added
    showDialog(
      context: context,
      builder: (context) => const AlertDialog(
        title: Text('Agregar Recordatorio'),
        content: Text('Funcionalidad en desarrollo'),
      ),
    );
  }

  void _showAddInvitationModal(BuildContext context) {
    // Modal implementation will be added
    showDialog(
      context: context,
      builder: (context) => const AlertDialog(
        title: Text('Agregar Invitación'),
        content: Text('Funcionalidad en desarrollo'),
      ),
    );
  }
}

