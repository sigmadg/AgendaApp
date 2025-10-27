import { StyleSheet } from 'react-native';

export const subsectionTabsStyles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  verticalContainer: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
  },
});
