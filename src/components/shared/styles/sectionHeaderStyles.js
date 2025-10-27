import { StyleSheet } from 'react-native';

export const sectionHeaderStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 0,
    marginHorizontal: 0,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  decoration: {
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontWeight: '500',
  },
  image: {
    // Estilos para la imagen se aplican dinámicamente
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
