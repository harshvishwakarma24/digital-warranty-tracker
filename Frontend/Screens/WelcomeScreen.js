import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>

      
      <View style={styles.topContent}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>
          DIGITAL{"\n"}WARRANTY{"\n"}TRACKER
        </Text>
      </View>

     
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6392E",
    alignItems: "center",
  },

  // NEW: keeps logo + title in the center
  topContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 40,
  },

  button: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 140,
    borderRadius: 20,
    marginBottom: 60,
  },

  buttonText: {
    color: "#E6392E",
    fontWeight: "bold",
    fontSize: 18,
  },
});
