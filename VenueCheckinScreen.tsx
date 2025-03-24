import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from './firebaseConfig';
import { useAuth } from './contexts/AuthContext'; // ✅ make sure folder is "contexts"
import { useRouter } from 'expo-router';

const db = getFirestore(app);

const venues = [
  'The Met',
  'Birdies',
  'Cali Beach',
  'Superfly',
  'Lina Rooftop',
  'Prohibition',
  'Rosies',
  'Ivory Tusk',
  'The Valley Bar',
];

export default function VenueCheckinScreen() {
  const { user } = useAuth();
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckIn = async () => {
    console.log("🔥 CHECK-IN ATTEMPT");
    console.log("✅ selectedVenue:", selectedVenue);
    console.log("🧑 user:", user);

    if (!selectedVenue || !user) {
      console.log("❌ BLOCKED — selectedVenue or user is missing");
      Alert.alert('Please select a venue');
      return;
    }

    try {
      console.log("📤 Saving to Firestore...");
      await updateDoc(doc(db, 'users', user.uid), {
        currentVenue: selectedVenue,
        checkedInAt: new Date(),
      });

      Alert.alert('✅ Checked in at', selectedVenue);
      router.replace('/nearby');
    } catch (error) {
      console.error('❌ Error checking in:', error);
      Alert.alert('Error saving venue');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where are you tonight?</Text>

      {/* Show selected venue live for debugging */}
      <Text style={{ textAlign: 'center', marginBottom: 10 }}>
        Selected: {selectedVenue ?? 'None'}
      </Text>

      <FlatList
        data={venues}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.venueButton,
              selectedVenue === item && styles.selectedVenue,
            ]}
            onPress={() => {
              console.log("🟢 Venue tapped:", item);
              setSelectedVenue(item);
            }}
          >
            <Text style={styles.venueText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <Button
        title="Check In"
        onPress={handleCheckIn}
        disabled={!selectedVenue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  venueButton: {
    padding: 14,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  selectedVenue: {
    backgroundColor: '#eaeaea',
    borderColor: '#333',
  },
  venueText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
