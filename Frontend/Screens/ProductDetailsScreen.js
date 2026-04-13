import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";
import * as WebBrowser from "expo-web-browser";
import { deleteProduct } from "../api/productApi";


export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;




  const openDocument = async () => {
    if (!product.document) {
      alert("No document attached");
      return;
    }
    await WebBrowser.openBrowserAsync(product.document);
  };
  const handleDelete = () => {
  Alert.alert(
    "Delete Product",
    "Are you sure you want to delete this product?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct(product.id);
            alert("Product deleted successfully");
            navigation.goBack();
          } catch (error) {
            alert("Failed to delete product");
          }
        },
      },
    ]
  );
};


  return (
    <View style={styles.wrapper}>
      {/* HEADER */}
      <AppHeader title="Product Details" navigation={navigation} />

      {/* WHITE ROUNDED CARD */}
      <View style={styles.cardContainer}>
        <ScrollView contentContainerStyle={styles.content}>
          
          <View style={styles.card}>
            <Text style={styles.label}>Product Name</Text>
            <Text style={styles.value}>{product.product_name}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Purchase Date</Text>
            <Text style={styles.value}>{product.purchase_date}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Warranty Expiry Date</Text>
            <Text style={styles.expiryValue}>
              {product.warranty_expiry_date}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Warranty / Bill Document</Text>

            <TouchableOpacity style={styles.docBtn} onPress={openDocument}>
              <Ionicons name="document-text" size={22} color="#fff" />
              <Text style={styles.docText}>Open Document</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Ionicons name="trash" size={22} color="#fff" />
              <Text style={styles.deleteText}>Delete Product</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              navigation.navigate("Addproduct", {
                editMode: true,
                product: product,
              })
            }
          >
            <Ionicons name="create" size={22} color="#fff" />
            <Text style={styles.editText}>Edit Product</Text>
          </TouchableOpacity>



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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20, // 🔥 overlap header
    paddingTop: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  content: {
    padding: 16,
  },

  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    elevation: 1,
  },

  label: {
    fontSize: 13,
    color: "#777",
    marginBottom: 6,
  },

  value: {
    fontSize: 16,
    fontWeight: "bold",
  },

  expiryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e34b40",
  },

  docBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4a90e2",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  docText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  deleteBtn: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#e53935",
  padding: 14,
  borderRadius: 12,
},
deleteText: {
  color: "#fff",
  fontWeight: "bold",
  marginLeft: 10,
},
//edit
editBtn: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#4a90e2",
  padding: 14,
  borderRadius: 12,
  marginBottom: 12,
},
editText: {
  color: "#fff",
  fontWeight: "bold",
  marginLeft: 10,
},


});
