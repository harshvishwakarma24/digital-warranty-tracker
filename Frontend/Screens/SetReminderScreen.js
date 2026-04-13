import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppHeader from "../components/AppHeader";
import { Picker } from "@react-native-picker/picker";
import { getProducts } from "../api/productApi";
import { createReminder } from "../api/reminderApi";

export default function SetReminderScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.log("Error fetching products:", err);
    }
  };

  const saveReminder = async () => {
    if (!selectedProduct) {
      alert("Please select a product");
      return;
    }

    try {
      await createReminder({
        product: selectedProduct,
        reminder_date: date.toISOString().split("T")[0],
      });

      alert("Reminder set successfully");
      navigation.goBack();
    } catch (err) {
      console.log("Create reminder error:", err);
      alert("Failed to set reminder");
    }
  };

  return (
    <View style={styles.wrapper}>
      <AppHeader title="Set Reminder" navigation={navigation} />

      <View style={styles.cardContainer}>
        <View style={styles.content}>
          <Text style={styles.label}>Select Product</Text>
          <Picker
            selectedValue={selectedProduct}
            onValueChange={(itemValue) => setSelectedProduct(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Select product" value={null} />
            {products.map((item) => (
              <Picker.Item
                key={item.id}
                label={item.product_name}
                value={item.id}
              />
            ))}
          </Picker>

          <Text style={styles.label}>Reminder Date</Text>
          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.dateText}>
              {date.toDateString()}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={saveReminder}>
            <Text style={styles.saveText}>Save Reminder</Text>
          </TouchableOpacity>
        </View>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  dateBox: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 30,
  },
  dateText: {
    color: "#333",
  },
  saveBtn: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
