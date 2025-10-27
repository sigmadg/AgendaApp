import { StyleSheet } from 'react-native';

export const projectCardStyles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  titleContent: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 24,
  },
  description: {
    fontWeight: '400',
    lineHeight: 20,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  status: {
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progress: {
    fontWeight: '500',
    marginLeft: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  goalsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  goalText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  moreGoals: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
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
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 4,
  },
});
