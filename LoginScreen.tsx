import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { auth } from "./firebaseConfig";
import { signInAnonymously } from "firebase/auth";

const LoginScreen = () => {
  const handleAnonLogin = async () => {
    try {
      await signInAnonymously(auth);
      console.log("✅ Logged in anonymously");
    } catch (error) {
      console.error("❌ Error logging in anonymously", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mixr Dev Login</Text>
      <Button title="Dev Login (Skip OTP)" onPress={handleAnonLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
});

export default LoginScreen;