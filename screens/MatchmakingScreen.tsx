import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const db = getFirestore();

const MatchmakingScreen: React.FC = () => {
  const navigation = useNavigation<any>();  // Fix navigation type
  const [users, setUsers] = useState<{ uid: string; name: string; club: string }[]>([]);  // Fix userList type
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (userId) {
          // Get current user info (to match by club)
          const userSnap = await getDocs(collection(db, 'users', userId));
          const userData = userSnap.docs[0]?.data();
          const userClub = userData?.club;

          if (userClub) {
            // Fetch other users in the same club
            const userQuery = query(
              collection(db, 'users'),
              where('club', '==', userClub),
              where('uid', 'not-in', [userId]) // Exclude the current user
            );

            const userList: { uid: string; name: string; club: string }[] = [];  // Define userList type explicitly
            const querySnapshot = await getDocs(userQuery);
            querySnapshot.forEach((doc) => {
              userList.push(doc.data() as { uid: string; name: string; club: string });
            });

            setUsers(userList);
          }
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

  const handleMatch = async (userToMatchId: string) => {
    const userId = auth.currentUser?.uid;
    if (userId && userToMatchId) {
      // Store match in Firestore
      const matchDocRef = doc(db, 'matches', `${userId}-${userToMatchId}`);
      await setDoc(matchDocRef, {
        user1_id: userId,
        user2_id: userToMatchId,
      });

      // Optionally, add initial message to Firestore
      await setDoc(doc(matchDocRef, 'messages', '0'), {
        text: 'You have matched!',
        senderId: userId,
        timestamp: new Date().getTime(),
      });

      alert('You have matched!');

      // Navigate to the chat screen with proper type
      navigation.navigate('ChatScreen', { matchId: `${userId}-${userToMatchId}` });
    }
  };

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
              <Button title="Match" onPress={() => handleMatch(item.uid)} />
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
