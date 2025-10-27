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
    bottom: -8,
    left: '50%',
    marginLeft: -3,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
