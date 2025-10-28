import { StyleSheet } from 'react-native';

export const elegantSubsectionTabsStyles = StyleSheet.create({
  container: {
    borderRadius: 30,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexGrow: 1,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  verticalContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});