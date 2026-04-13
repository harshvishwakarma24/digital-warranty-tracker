import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../api/auth";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  if (!username || !password) {
    Alert.alert("Error", "All fields are required");
    return;
  }

  try {
    const data = await loginUser({
      username: username,
      password: password,
    });

    // Save token
    await AsyncStorage.setItem("accessToken", data.access);

    // Navigate to Dashboard and pass flag
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "Dashboard",
            params: { showLoginSuccess: true },
          },
        ],
      })
    );

  } catch (error) {
    Alert.alert("Login Failed", "Invalid username or password");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.bottomText}>
        Don't have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate("Register")}
        >
          Register
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
  forgot: {
    color: "#E6392E",
    textAlign: "right",
    marginBottom: 20,
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
