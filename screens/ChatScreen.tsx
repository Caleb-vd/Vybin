import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigation/AppStack'; // 👈 adjust if needed
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

type Props = NativeStackScreenProps<AppStackParamList, 'ChatScreen'>;

const ChatScreen: React.FC<Props> = ({ route }) => {
  const { matchId } = route.params;

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const db = getFirestore();

  useEffect(() => {
    const messagesRef = collection(db, 'matches', matchId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArray: any[] = [];
      querySnapshot.forEach((doc) => {
        messagesArray.push(doc.data());
      });
      setMessages(messagesArray);
    });

    return () => unsubscribe();
  }, [matchId]);

  const handleSendMessage = async () => {
    if (newMessage) {
      const userId = auth.currentUser?.uid;
      await addDoc(collection(db, 'matches', matchId, 'messages'), {
        text: newMessage,
        senderId: userId,
        timestamp: new Date().getTime(),
      });
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text>
              {item.senderId === auth.currentUser?.uid ? 'You' : 'Other'}: {item.text}
            </Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={newMessage}
        onChangeText={setNewMessage}
      />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  message: {
    padding: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    marginTop: 10,
  },
});

export default ChatScreen;
