import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AppHeader from "../components/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import { getReminders } from "../api/reminderApi";

export default function RemindersListScreen({ navigation }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const data = await getReminders();
      setReminders(data);
    } catch (error) {
      console.log("Error fetching reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.product}>{item.product_name}</Text>
      <Text style={styles.date}>
        Reminder on: {item.reminder_date}
      </Text>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <AppHeader title="Reminders" navigation={navigation} />

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("Setreminder")}
        >
          <Ionicons name="add-circle-outline" size={28} color="#0e49f9ff" />
          <Text style={styles.addText}>Set Reminder</Text>
        </TouchableOpacity>

        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Loading...
          </Text>
        ) : (
          <FlatList
            data={reminders}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.empty}>
                No reminders set yet
              </Text>
            }
          />
        )}
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
    marginTop: -20,
    paddingTop: 20,
    elevation: 3,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f0ff",
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  addText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0e49f9ff",
    marginLeft: 10,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  product: {
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    marginTop: 4,
    color: "#555",
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
  },
});
