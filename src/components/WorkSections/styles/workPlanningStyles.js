import { StyleSheet } from 'react-native';

export const workPlanningStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
  },
  sectionCard: {
    marginBottom: 20,
  },
  weeklyContainer: {
    gap: 8,
  },
  weeklyCard: {
    marginBottom: 8,
  },
  goalsContainer: {
    gap: 8,
  },
  goalCard: {
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
