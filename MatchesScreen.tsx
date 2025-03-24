import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { app } from './firebaseConfig';
import { useAuth } from './contexts/AuthContext';
import { useRouter } from 'expo-router';

const db = getFirestore(app);

export default function MatchesScreen() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;

      try {
        const currentUserRef = doc(db, 'users', user.uid);
        const currentUserSnap = await getDoc(currentUserRef);
        const currentUserData = currentUserSnap.data();

        const matchIds = currentUserData?.matches || [];

        if (matchIds.length === 0) {
          setMatches([]);
          setLoading(false);
          return;
        }

        const allUsersSnap = await getDocs(collection(db, 'users'));

        const matchedUsers = allUsersSnap.docs
          .filter((doc) => matchIds.includes(doc.id))
          .map((doc) => ({ id: doc.id, ...doc.data() }));

        setMatches(matchedUsers);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error loading matches:', error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading matches...</Text>
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No matches yet 👀</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Matches</Text>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.matchCard}
            onPress={() =>
              router.push({
                pathname: '/chat/[targetUserId]',
                params: { targetUserId: item.id, targetName: item.name },
              })
            }
          >
            <Text style={styles.name}>
              {item.name}, {item.age}
            </Text>
          </TouchableOpacity>
        )}
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  matchCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
