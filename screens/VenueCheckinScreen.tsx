import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const VenueCheckinScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>You're already checked into a venue via your profile setup ✅</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VenueCheckinScreen;
