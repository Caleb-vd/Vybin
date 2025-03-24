import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { auth } from '../firebaseConfig';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const db = getFirestore();

const ProfileSetupScreen: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [club, setClub] = useState<string>('');

  const handleSaveProfile = async () => {
    if (name && age && club) {
      try {
        const userId = auth.currentUser?.uid;
        if (userId) {
          await setDoc(doc(db, 'users', userId), {
            name,
            age,
            club,
          });
          Alert.alert('Profile Saved!');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error saving profile');
      }
    } else {
      Alert.alert('Please fill in all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Club"
        value={club}
        onChangeText={setClub}
      />
      <Button title="Save Profile" onPress={handleSaveProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
});

export default ProfileSetupScreen;
