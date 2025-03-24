import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from 'firebase/firestore';
import { app } from './firebaseConfig';
import { useAuth } from './contexts/AuthContext';

const db = getFirestore(app);

export default function NearbyUsersScreen() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVenue, setCurrentVenue] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'));

        const currentUserDoc = snapshot.docs.find((doc) => doc.id === user?.uid);
        const userVenue = currentUserDoc?.data()?.currentVenue;

        if (!userVenue) {
          setLoading(false);
          return;
        }

        setCurrentVenue(userVenue);

        const nearby = snapshot.docs
          .filter(
            (doc) =>
              doc.id !== user?.uid && doc.data()?.currentVenue === userVenue
          )
          .map((doc) => ({ id: doc.id, ...doc.data() }));

        setUsers(nearby);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLike = async (targetUserId: string, targetName: string) => {
    if (!user) return;

    const currentUserRef = doc(db, 'users', user.uid);
    const targetUserRef = doc(db, 'users', targetUserId);

    try {
      // Add to your likesSent
      await updateDoc(currentUserRef, {
        likesSent: arrayUnion(targetUserId),
      });

      // Add to their likesReceived
      await updateDoc(targetUserRef, {
        likesReceived: arrayUnion(user.uid),
      });

      // Check if they liked you already
      const targetDoc = await getDoc(targetUserRef);
      const targetData = targetDoc.data();

      if (targetData?.likesSent?.includes(user.uid)) {
        // It's a match!
        await updateDoc(currentUserRef, {
          matches: arrayUnion(targetUserId),
        });
        await updateDoc(targetUserRef, {
          matches: arrayUnion(user.uid),
        });

        Alert.alert("🎉 It's a Match!", `You and ${targetName} liked each other!`);
      } else {
        Alert.alert('❤️ Liked', `You liked ${targetName}`);
      }
    } catch (error) {
      console.error('Error handling like:', error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading users...</Text>
      </View>
    );
  }

  if (!currentVenue) {
    return (
      <View style={styles.center}>
        <Text>You haven’t checked in yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>People at {currentVenue}</Text>

      {users.length === 0 ? (
        <Text style={styles.empty}>No one else is here yet 👀</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>
                {item.name}, {item.age}
              </Text>
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => handleLike(item.id, item.name)}
              >
                <Text style={styles.likeText}>❤️ Like</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    marginBottom: 8,
  },
  likeButton: {
    padding: 10,
    backgroundColor: '#ff5c5c',
    borderRadius: 8,
    alignItems: 'center',
  },
  likeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
