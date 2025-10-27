import { StyleSheet } from 'react-native';

export const workPlanningCardStyles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontWeight: '700',
    marginLeft: 8,
    flex: 1,
  },
  content: {
    // Estilos para el contenido se aplican dinámicamente
  },
  value: {
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontWeight: '500',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progress: {
    fontWeight: '500',
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
