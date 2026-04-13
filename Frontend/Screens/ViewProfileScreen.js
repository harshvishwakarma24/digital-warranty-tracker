import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getProfile } from "../api/auth";
import { BASE_URL } from "../api/config";

export default function ViewProfileScreen({ navigation }) {
  // ---------------- STATE ----------------
  const [profile, setProfile] = useState(null);

  // ---------------- LOAD PROFILE ----------------
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.log("Failed to load profile");
      }
    };

    // Initial load
    loadProfile();

    // Reload when screen comes into focus
    const unsubscribe = navigation.addListener("focus", loadProfile);

    return unsubscribe;
  }, [navigation]);

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("accesstoken");

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Login" }],
            })
          );
        },
      },
    ]
  );
};
  // ---------------- LOADING ----------------
  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  // ---------------- UI ----------------
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
      {/* ---------------- HEADER ---------------- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      {/* ----------- PROFILE IMAGE ---------- */}
      <View style={styles.imageWrapper}>
        <Image
          source={
            profile.profile_image
              ? { uri: `${BASE_URL}${profile.profile_image}` }
              : require("../assets/user.jpg")
          }
          style={styles.profileImg}
        />
      </View>

      {/* ---------------- DETAILS ---------------- */}
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>
          {profile.first_name || profile.username}
        </Text>

        {/* PHONE */}
        <View style={styles.row}>
          <Ionicons name="call-outline" size={22} color="#c53030" />
          <Text style={styles.infoText}>
            {profile.phone || "Phone not added"}
          </Text>
        </View>

        {/* EMAIL */}
        <View style={styles.row}>
          <Ionicons name="mail-outline" size={22} color="#c53030" />
          <Text style={styles.infoText}>{profile.email}</Text>
        </View>

        {/* EDIT PROFILE */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* HEADER */
  header: {
    backgroundColor: "#c53030",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  backBtn: {
    position: "absolute",
    top: 55,
    left: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  /* PROFILE IMAGE */
  imageWrapper: {
    marginTop: -60,
    alignItems: "center",
  },

  profileImg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },

  /* DETAILS */
  detailsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  infoText: {
    fontSize: 16,
    marginLeft: 12,
  },

  editBtn: {
    backgroundColor: "#c53030",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
  },

  editBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#c53030",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
});
