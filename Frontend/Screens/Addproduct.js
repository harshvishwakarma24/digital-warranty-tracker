import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { addProduct, updateProduct } from "../api/productApi";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system";

export default function AddProductScreen({ navigation, route }) {
  const source = route?.params?.source; // bill | invoice | undefined
  const editMode = route?.params?.editMode || false;
  const existingProduct = route?.params?.product || null;

  const [productName, setProductName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [showPurchasePicker, setShowPurchasePicker] = useState(false);
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------- UI TEXT ----------
  const headerTitle = editMode
    ? "Edit Product"
    : source === "bill"
    ? "Add Bills & Invoices"
    : source === "invoice"
    ? "Add Invoice"
    : "Add Product";

  const buttonText = editMode
    ? "Update"
    : source === "bill"
    ? "Save"
    : source === "invoice"
    ? "Save Invoice"
    : "Save Product";

  const formatDate = (date) => date.toISOString().split("T")[0];

  // ---------- PREFILL FOR EDIT ----------
  useEffect(() => {
    if (editMode && existingProduct) {
      setProductName(existingProduct.product_name);
      setPurchaseDate(new Date(existingProduct.purchase_date));
      setExpiryDate(new Date(existingProduct.warranty_expiry_date));
    }
  }, []);

  // ---------- PICK DOCUMENT ----------
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      let fileUri = asset.uri;

      if (!fileUri.startsWith("file://")) {
        const newPath = FileSystem.cacheDirectory + asset.name;
        await FileSystem.copyAsync({
          from: asset.uri,
          to: newPath,
        });
        fileUri = newPath;
      }

      setDocument({
        uri: fileUri,
        name: asset.name,
        mimeType: asset.mimeType,
      });
    }
  };

  // ---------- SAVE ----------
  const handleSave = async () => {
    if (!productName || !purchaseDate || !expiryDate) {
      alert("Please fill all required fields");
      return;
    }
     if (expiryDate <= purchaseDate) {
    alert("Warranty expiry date must be after purchase date");
    return;
  }
    try {
      setLoading(true);

      const payload = {
        product_name: productName,
        purchase_date: formatDate(purchaseDate),
        warranty_expiry_date: formatDate(expiryDate),
        document: document, // only sent if replaced
      };

      if (editMode) {
        await updateProduct(existingProduct.id, payload);
        alert("Product updated successfully");
      } else {
        await addProduct(payload);
        alert("Product Saved successfully");
      }

      navigation.goBack();
    } catch (error) {
      alert("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>

      {/* BODY */}
      <ScrollView contentContainerStyle={styles.bodyContainer}>
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          value={productName}
          placeholder="Smartphone"
          onChangeText={setProductName}
        />

        <Text style={styles.label}>Purchase Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPurchasePicker(true)}
        >
          <Text>
            {purchaseDate ? formatDate(purchaseDate) : "Select purchase date"}
          </Text>
        </TouchableOpacity>

        {showPurchasePicker && (
          <DateTimePicker
            value={purchaseDate || new Date()}
            mode="date"
            onChange={(e, d) => {
              setShowPurchasePicker(false);
              d && setPurchaseDate(d);
            }}
          />
        )}

        <Text style={styles.label}>Warranty Expiry Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowExpiryPicker(true)}
        >
          <Text>
            {expiryDate ? formatDate(expiryDate) : "Select expiry date"}
          </Text>
        </TouchableOpacity>

        {showExpiryPicker && (
          <DateTimePicker
            value={expiryDate || new Date()}
            mode="date"
            onChange={(e, d) => {
              setShowExpiryPicker(false);
              d && setExpiryDate(d);
            }}
          />
        )}

        <Text style={styles.label}>Bill / Invoice Document</Text>
        <TouchableOpacity style={styles.cameraBtn} onPress={pickDocument}>
          <Ionicons name="document-text" size={24} color="#d32f2f" />
          <Text style={{ marginLeft: 10 }}>
            {document ? document.name : "Select document"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>{buttonText}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#d32f2f" },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#d32f2f",
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 15,
  },
  bodyContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: "100%",
  },
  label: { marginTop: 20, fontWeight: "600", fontSize: 15 },
  input: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
    borderColor: "#ddd",
  },
  cameraBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#eee",
  },
  saveBtn: {
    backgroundColor: "#d32f2f",
    padding: 18,
    borderRadius: 15,
    marginTop: 35,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
