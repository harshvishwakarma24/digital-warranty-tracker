import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AppHeader from "../components/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import { getProducts } from "../api/productApi";
import { useFocusEffect } from "@react-navigation/native";

export default function BillsinvoicesScreen({ navigation }) {
  const [bills, setBills] = useState([]);

  // Load bills (products that have documents)
  const loadBills = async () => {
    try {
      const products = await getProducts();
      const filteredBills = products.filter(
        (item) => item.document
      );
      setBills(filteredBills);
    } catch (error) {
      console.log(error);
      setBills([]);
    }
  };

  // Instant refresh when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadBills();
    }, [])
  );

  return (
    <View style={styles.wrapper}>
      {/* ---------- Reusable Header ---------- */}
      <AppHeader title="Bills & Invoices" navigation={navigation} />

      {/* ---------- White Rounded Card Container ---------- */}
      <View style={styles.cardContainer}>
        {/* ---------- Add Bill Button ---------- */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("Addproduct", {
              source: "bill",
            })
          }
        >
          <Ionicons
            name="add-circle-outline"
            size={28}
            color="#0e49f9ff"
          />
          <Text style={styles.addText}>Add </Text>
        </TouchableOpacity>

        {/* ---------- Bills List ---------- */}
        <FlatList
          data={bills}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No bills uploaded yet
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("ProductDetails", {
                  product: item,
                })
              }
            >
              <Text style={styles.product}>
                {item.product_name}
              </Text>
              <Text style={styles.text}>
                Purchase Date: {item.purchase_date}
              </Text>
              <Text style={styles.text}>
                Warranty Expiry: {item.warranty_expiry_date}
              </Text>
            </TouchableOpacity>
          )}
        />
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
    marginHorizontal: 16,
    elevation: 1,
  },
  product: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
  },
});
