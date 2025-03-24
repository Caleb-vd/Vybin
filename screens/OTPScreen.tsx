import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type AuthStackParamList = {
  PhoneLogin: undefined;
  OTPScreen: { confirmation: any };
};

type Props = NativeStackScreenProps<AuthStackParamList, 'OTPScreen'>;

const OTPScreen: React.FC<Props> = ({ route }) => {
  const [code, setCode] = useState<string>('');
  const { confirmation } = route.params;

  const handleVerify = async () => {
    try {
      await confirmation.confirm(code);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Invalid code');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter OTP"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <Button title="Verify Code" onPress={handleVerify} />
    </View>
  );
};

export default OTPScreen;
