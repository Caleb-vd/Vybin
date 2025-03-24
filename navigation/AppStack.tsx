import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import MatchmakingScreen from '../screens/MatchmakingScreen';
import ChatScreen from '../screens/ChatScreen';

// Define the param list for your stack navigation
export type AppStackParamList = {
  Profile: undefined;
  Matchmaking: undefined;
  ProfileSetup: undefined;
  ChatScreen: { matchId: string }; // Define parameter type for ChatScreen
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
    <Stack.Screen name="Matchmaking" component={MatchmakingScreen} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} /> {/* Add ChatScreen with correct typing */}
  </Stack.Navigator>
);

export default AppStack;
