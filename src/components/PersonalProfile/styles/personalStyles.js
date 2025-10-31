import { StyleSheet } from 'react-native';

export const personalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F0', // Verde muy claro
  },
  tabsContainer: {
    backgroundColor: '#2D5016', // Verde bosque profundo
    borderBottomWidth: 2,
    borderBottomColor: '#4A6741', // Verde bosque medio
    paddingVertical: 8,
  },
  tabsContent: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    backgroundColor: '#E8F0E3', // Verde muy claro
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4A6741', // Verde bosque medio
  },
  activeTab: {
    backgroundColor: '#4A7C59', // Verde bosque medio
    borderColor: '#2D5016', // Verde bosque profundo
    shadowColor: '#2D5016',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#4A6741', // Verde bosque medio
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#F8FAF6', // Verde muy claro
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#2D5016', // Verde bosque profundo
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8F0E3', // Verde muy claro
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D5016', // Verde bosque profundo
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280', // Gris medio
    marginTop: 2,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#4A7C59', // Verde bosque medio
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDecoration: {
    width: 40,
    height: 40,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F7',
    borderRadius: 20,
  },
  headerContent: {
    flex: 1,
    marginRight: 12,
  },
  mascotImage: {
    width: 28,
    height: 28,
  },
  // Estilos para eventos
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4A7C59', // Verde bosque medio
    shadowColor: '#2D5016',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5016', // Verde bosque profundo
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#4A6741', // Verde bosque medio
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#6B7280', // Gris medio
    lineHeight: 20,
  },
  // Estilos para tareas
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#2D5016',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskCheckbox: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5016', // Verde bosque profundo
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280', // Gris medio
  },
  // Estilos para perfil
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#2D5016',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A7C59', // Verde bosque medio
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D5016', // Verde bosque profundo
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280', // Gris medio
    marginBottom: 16,
  },
  // Estilos para configuración
  settingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#2D5016',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D5016', // Verde bosque profundo
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280', // Gris medio
  },
  // Estilos para botones
  button: {
    backgroundColor: '#4A7C59', // Verde bosque medio
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilos para inputs
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8F0E3', // Verde muy claro
    fontSize: 16,
  },
  // Estilos para modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D5016', // Verde bosque profundo
  },
  modalContent: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#E8F0E3', // Verde muy claro
  },
  saveButton: {
    backgroundColor: '#4A7C59', // Verde bosque medio
  },
  cancelButtonText: {
    color: '#4A6741', // Verde bosque medio
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Estilos adicionales para eventos
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  // Estilos adicionales para tareas
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  taskDescriptionCompleted: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  deleteButton: {
    padding: 4,
  },
  // Estilos adicionales para perfil
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileInfoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4A6741',
  },
  profileBio: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F0F4F7',
    borderRadius: 8,
  },
  profileBioText: {
    fontSize: 14,
    color: '#4A6741',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  profileActions: {
    marginTop: 20,
    gap: 12,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  // Estilos para configuración
  settingsGroup: {
    marginBottom: 24,
  },
  settingsGroupTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D5016',
    marginBottom: 12,
    marginLeft: 4,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  settingActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearButton: {
    padding: 4,
  },
  // Estilos para estados vacíos
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A6741',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
