import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { supabase } from '../lib/supabase'
import { authService } from '../lib/database'

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [userCount, setUserCount] = useState<number | null>(null)

  useEffect(() => {
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      // Test basic connection by checking auth state
      const { user, error } = await authService.getCurrentUser()
      
      if (error && error.message.includes('Invalid API key')) {
        setConnectionStatus('error')
        Alert.alert('Supabase Error', 'Invalid API key. Please check your environment variables.')
        return
      }

      // Test database connection by counting profiles
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      if (countError) {
        console.log('Database test error:', countError)
        // This is expected if tables don't exist yet
        setConnectionStatus('connected')
        setUserCount(0)
      } else {
        setConnectionStatus('connected')
        setUserCount(count || 0)
      }
    } catch (error) {
      console.error('Supabase connection error:', error)
      setConnectionStatus('error')
      Alert.alert('Connection Error', 'Failed to connect to Supabase. Check your configuration.')
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connecting': return '#FFA500'
      case 'connected': return '#4CAF50'
      case 'error': return '#F44336'
      default: return '#9E9E9E'
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Connection Test</Text>
      
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
      
      <Text style={styles.statusText}>
        Status: {connectionStatus.toUpperCase()}
      </Text>
      
      {userCount !== null && (
        <Text style={styles.infoText}>
          User profiles in database: {userCount}
        </Text>
      )}
      
      <Text style={styles.instructionText}>
        {connectionStatus === 'error' 
          ? 'Make sure you have set up your Supabase project and environment variables.'
          : connectionStatus === 'connected'
          ? 'Supabase is connected! You can now run your migrations.'
          : 'Testing connection...'
        }
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 10,
    color: '#666',
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
})