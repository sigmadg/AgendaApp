import { StyleSheet } from 'react-native';

export const sectionsSectionStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4, // Reducir padding lateral para dar más espacio
  },
  summaryContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 24,
    gap: 16,
    paddingHorizontal: 4,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    opacity: 0.8,
    textAlign: 'center',
  },
  activeCard: {
    backgroundColor: '#DCFCE7',
    borderColor: '#22C55E',
    borderWidth: 2,
  },
  totalCard: {
    backgroundColor: '#E0E7FF',
    borderColor: '#6366F1',
    borderWidth: 2,
  },
  percentageCard: {
    backgroundColor: '#F3E8FF',
    borderColor: '#A855F7',
    borderWidth: 2,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  summaryText: {
    marginLeft: 12,
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  summarySubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  scrollView: {
    flex: 1,
  },
  sectionsList: {
    gap: 16, // Más espacio entre cards
    paddingHorizontal: 2, // Reducir padding lateral aún más
  },
  sectionCard: {
    marginBottom: 0,
    marginHorizontal: 0, // Sin margen lateral para usar todo el ancho
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20, // Reducir padding ya que no hay icono
  },
  sectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8, // Aumentar espacio entre título y descripción
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // Espacio entre switch y botón de basura
  },
  titleSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Switch más pequeño
  },
  sectionName: {
    fontSize: 20, // Aumentar tamaño de fuente aún más
    fontWeight: '600',
    flex: 1, // Permitir que el título tome el espacio disponible
  },
  sectionDescription: {
    fontSize: 16, // Aumentar tamaño de fuente
    opacity: 0.7,
    lineHeight: 22, // Mejor interlineado
  },
  trashButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.7,
  },
});
