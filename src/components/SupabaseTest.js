import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { testSupabaseConnection } from '../config/supabase-native';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Not tested');
  const [isLoading, setIsLoading] = useState(false);

  const testSupabaseConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('Testing...');
    
    try {
      const result = await testSupabaseConnection();
      
      if (result.success) {
        setConnectionStatus('✅ Connected successfully!');
        Alert.alert('Success', 'Supabase connection is working!');
      } else {
        setConnectionStatus(`❌ Error: ${result.error}`);
        Alert.alert('Error', `Connection failed: ${result.error}`);
      }
    } catch (error) {
      setConnectionStatus(`❌ Exception: ${error.message}`);
      Alert.alert('Exception', `Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Connection Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={styles.statusText}>{connectionStatus}</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={testSupabaseConnection}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Connection'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Configuration:</Text>
        <Text style={styles.infoText}>URL: https://rttjjxwsdbeltqxvlnfr.supabase.co</Text>
        <Text style={styles.infoText}>Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
});

export default SupabaseTest;
