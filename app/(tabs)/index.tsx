import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import LoginScreen from '../../screens/PhoneLoginScreen';
import ProfileScreen from '../../ProfileScreen';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <ProfileScreen /> : <LoginScreen />;
}
