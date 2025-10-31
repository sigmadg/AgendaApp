import { StyleSheet } from 'react-native';

export const taskCardStyles = StyleSheet.create({
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 24,
  },
  date: {
    fontWeight: '500',
    marginBottom: 4,
  },
  notes: {
    fontWeight: '400',
    lineHeight: 20,
  },
  actions: {
    alignItems: 'flex-end',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priority: {
    fontWeight: '600',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontWeight: '600',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F8F9FA',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});
