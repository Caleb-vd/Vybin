// screens/MatchmakingScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

const db = getFirestore();

const MatchmakingScreen: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (userId) {
          const userSnap = await getDocs(
            query(collection(db, 'users'), where('club', '==', 'ClubA')) // Adjust club name dynamically
          );
          const userList = userSnap.docs.map((doc) => doc.data());
          setUsers(userList);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matchmaking</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <Text>{item.name}</Text>
              <Button title="Match" onPress={() => Alert.alert(`Matched with ${item.name}`)} />
            </View>
          )}
        />
      )}
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
  userCard: {
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
});

export default MatchmakingScreen;
