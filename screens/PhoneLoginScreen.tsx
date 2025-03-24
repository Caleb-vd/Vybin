import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext'; // make sure path is correct

const PhoneLoginScreen: React.FC = ({ }) => {
  const [phone, setPhone] = useState('');
  const { setUser } = useContext(AuthContext); // 👈 grab setUser from context

  const handleSkipOTP = () => {
    // Set a dummy user object to simulate login
    setUser({
      uid: 'test-user-id',
      phoneNumber: phone || '+0000000000',
    } as any); // 👈 we're casting as any to mock Firebase's User type
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
      <Button title="Send Code (not working)" onPress={() => Alert.alert('Firebase disabled')} />
      <Button title="Skip OTP (Dev Mode)" onPress={handleSkipOTP} />
    </View>
  );
};

export default PhoneLoginScreen;
