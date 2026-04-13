import React, { useState } from "react";

import { registerUser } from "../api/auth";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function RegisterScreen({ navigation }) {
  // State variables
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register button handler
  const handleRegister = async () => {
    const cleanEmail = email.trim();

    // Empty fields validation
    if (!username || !cleanEmail || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    // ✅ Gmail validation
    if (!cleanEmail.endsWith("@gmail.com")) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid Gmail address (ending with @gmail.com)"
      );
      return;
    }

    // ✅ Password length validation
    if (password.length < 5) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 5 characters long"
      );
      return;
    }

    try {
      await registerUser({
        username: username,
        email: cleanEmail,
        password: password,
      });

      Alert.alert("Success", "Registration successful");
      navigation.navigate("Login");

    } catch (error) {
      Alert.alert(
        "Registration Failed",
        "Username or email already exists"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>

      {/* Username */}
      <TextInput
        placeholder="Name"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      {/* Email */}
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {/* Register Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Login link */}
      <Text style={styles.bottomText}>
        Already have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("Login")}
        >
          Login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 30,
    justifyContent: "center",
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#E6392E",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  bottomText: {
    textAlign: "center",
    marginTop: 10,
  },
  link: {
    color: "#E6392E",
    fontWeight: "bold",
  },
});
