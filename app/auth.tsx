import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithPhoneNumber, signInAnonymously, ConfirmationResult } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function AuthScreen() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const router = useRouter();

  const sendCode = async () => {
    try {
      const confirmResult = await signInWithPhoneNumber(auth, phone);
      setConfirmation(confirmResult);
      Alert.alert('OTP Sent');
    } catch (err) {
      console.error(err);
      Alert.alert('Failed to send OTP');
    }
  };

  const confirmCode = async () => {
    try {
      if (confirmation) {
        await confirmation.confirm(code);
      } else {
        Alert.alert('Confirmation is null');
      }
      router.replace('/profile'); // after login, go to venue check-in
    } catch (err) {
      Alert.alert('Incorrect OTP');
    }
  };

  const loginAnon = async () => {
    try {
      await signInAnonymously(auth);
      router.replace('/venue'); // after anon login, go to venue check-in
    } catch (err) {
      console.error(err);
      Alert.alert('Anonymous login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Mixr</Text>
      {!confirmation ? (
        <>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="+61 4XX XXX XXX"
            keyboardType="phone-pad"
          />
          <Button title="Send OTP" onPress={sendCode} />
          <Text style={{ textAlign: 'center', marginVertical: 12 }}>or</Text>
          <Button title="Login Anonymously" onPress={loginAnon} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="Enter OTP"
            keyboardType="number-pad"
          />
          <Button title="Verify Code" onPress={confirmCode} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginVertical: 10 },
});
