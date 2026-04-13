import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

import AppHeader from "../components/AppHeader";
import { getProfile, updateProfile } from "../api/auth";
import { BASE_URL } from "../api/config"; // backend base URL

export default function EditProfileScreen({ navigation }) {
  // ---------------- STATE ----------------

  // full name (first + last combined)
  const [name, setName] = useState("");

  // email (read-only)
  const [email, setEmail] = useState("");

  // phone number
  const [phone, setPhone] = useState("");

  // newly selected image (from gallery)
  const [image, setImage] = useState(null);

  // image coming from backend (absolute URL)
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  // ---------------- LOAD PROFILE DATA ----------------
  // runs once when screen opens
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // fetch profile from backend
        const data = await getProfile();

        // combine first + last name into one field
        setName(
          `${data.first_name || ""} ${data.last_name || ""}`.trim()
        );

        setEmail(data.email || "");
        setPhone(data.phone || "");

        // if backend has profile image, convert to full URL
        if (data.profile_image) {
          setProfileImageUrl(`${BASE_URL}${data.profile_image}`);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load profile");
      }
    };

    loadProfile();
  }, []);

  // ---------------- PICK IMAGE ----------------
  // open phone gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    // if user selected image, save it in state
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // ---------------- SAVE PROFILE ----------------
  const handleSave = async () => {
    try {
      // split full name into first and last
      const [firstName, ...lastParts] = name.split(" ");
      const lastName = lastParts.join(" ");

      // form data for text + image
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("phone", phone);

      // attach image only if user selected one
      if (image) {
        formData.append("profile_image", {
          uri: image.uri,
          name: "profile.jpg",
          type: "image/jpeg",
        });
      }

      // send update request to backend
      await updateProfile(formData);

      Alert.alert("Success", "Profile updated successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  // ---------------- UI ----------------
  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <AppHeader title="Edit Profile" navigation={navigation} />

      {/* WHITE ROUNDED CARD */}
      <View style={styles.cardContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* PROFILE IMAGE */}
          <View style={styles.imageContainer}>
            <Image
              source={
                // priority:
                // 1. newly picked image
                // 2. backend image
                // 3. default image
                image
                  ? { uri: image.uri }
                  : profileImageUrl
                  ? { uri: profileImageUrl }
                  : require("../assets/user.jpg")
              }
              style={styles.profileImage}
            />

            {/* camera icon to change image */}
            <TouchableOpacity
              style={styles.cameraIcon}
              onPress={pickImage}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: "#eee" }]}
              value={email}
              editable={false} // email cannot be edited
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="number-pad"
            />

            {/* SAVE BUTTON */}
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },

  cardContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, // overlap header
    paddingTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  container: {
    padding: 20,
  },

  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 45,
    backgroundColor: "#4F46E5",
    padding: 8,
    borderRadius: 20,
  },

  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#4F46E5",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
