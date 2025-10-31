import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'tasks' && styles.activeTab]}
        onPress={() => onTabChange('tasks')}
        activeOpacity={0.7}
      >
        <Icon 
          name="checkmark-circle-outline" 
          size={20} 
          color={activeTab === 'tasks' ? '#FFFFFF' : '#6c757d'} 
        />
        <Text style={[styles.tabText, activeTab === 'tasks' && styles.activeTabText]}>
          Tareas
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'events' && styles.activeTab]}
        onPress={() => onTabChange('events')}
        activeOpacity={0.7}
      >
        <Icon 
          name="calendar-outline" 
          size={20} 
          color={activeTab === 'events' ? '#FFFFFF' : '#6c757d'} 
        />
        <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>
          Eventos
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    margin: 16,
    marginBottom: 0,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});

export default TabNavigation;
