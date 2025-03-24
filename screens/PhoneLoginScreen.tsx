import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebaseConfig';

type AuthStackParamList = {
  PhoneLogin: undefined;
  OTPScreen: { confirmation: any };
};

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneLogin'>;

const PhoneLoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState<string>('');

  const handleSendCode = async () => {
    if (!phone) return Alert.alert('Enter phone number');

    try {
      const confirmation = await signInWithPhoneNumber(auth, phone);
      navigation.navigate('OTPScreen', { confirmation });
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error sending code', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="+61 4xx xxx xxx"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <Button title="Send Code" onPress={handleSendCode} />
    </View>
  );
};

export default PhoneLoginScreen;
