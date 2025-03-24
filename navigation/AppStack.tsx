import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen'; // Adjust path if needed
import ProfileSetupScreen from '../screens/ProfileSetupScreen';

export type AppStackParamList = {
  Profile: undefined;
  ProfileSetup: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />{/* Add more screens here */}
    </Stack.Navigator>
  );
};

export default AppStack;
