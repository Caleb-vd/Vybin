import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from './contexts/AuthContext';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from './firebaseConfig';
import { useRouter } from 'expo-router'; // ✅ handles navigation

const db = getFirestore(app);

export default function ProfileScreen() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const router = useRouter(); // ✅ used to navigate after saving

  const handleSave = async () => {
    if (!name || !age) {
      Alert.alert('Please fill out all fields.');
      return;
    }

    try {
      await setDoc(doc(db, 'users', user!.uid), {
        name,
        age: Number(age),
        phone: user?.phoneNumber,
        uid: user?.uid,
        createdAt: new Date(),
      });

      Alert.alert('✅ Profile saved!');
      router.replace('/venue'); // ✅ go to Venue Check-In screen
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('❌ Failed to save profile.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Your Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Button title="Save Profile" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});
