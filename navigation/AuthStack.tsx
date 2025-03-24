import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PhoneLoginScreen from '../screens/PhoneLoginScreen'; // Ensure the file exists and is correctly named
import OTPScreen from '../screens/OTPScreen';

export type AuthStackParamList = {
  PhoneLogin: undefined;
  OTPScreen: { confirmation: any };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
