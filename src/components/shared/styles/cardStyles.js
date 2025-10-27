import { StyleSheet } from 'react-native';

export const cardStyles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontWeight: '500',
  },
  content: {
    // Estilos para el contenido se aplican dinámicamente
  },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
});
