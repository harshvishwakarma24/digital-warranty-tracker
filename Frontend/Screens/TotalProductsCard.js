import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AppHeader from "../components/AppHeader";
import { getProducts } from "../api/productApi";


export default function TotalProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("getProducts:", getProducts);


  // Fetch products
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data); //  array


    } catch (error) {
      console.log(error.response?.data || error.message);
      setProducts([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadProducts();
  }, []);

  // Refresh when screen comes back into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadProducts();
    });

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() =>
        navigation.navigate("ProductDetails", { product: item })
      }
    >
      <Text style={styles.productName}>{item.product_name}</Text>
      <Text style={styles.productDate}>
        Expiry: {item.warranty_expiry_date}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="My Products" navigation={navigation} />

      <View style={styles.content}>
        {/* TOTAL PRODUCTS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Products</Text>
          <Text style={styles.cardCount}>{products.length}</Text>
        </View>

        <Text style={styles.sectionTitle}>PRODUCTS</Text>

        {/* LOADING / LIST */}
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No products added yet</Text>
            }
          />
        )}

        {/* ADD PRODUCT BUTTON */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("Addproduct")}
        >
          <Text style={styles.addButtonText}>+ Add Product</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  /* WHITE CURVED AREA */
  content: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: "#555",
  },
  cardCount: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 6,
  },
  sectionTitle: {
    marginLeft: 16,
    marginBottom: 8,
    fontWeight: "bold",
    color: "#666",
  },
  productItem: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
  },
  productDate: {
    color: "#888",
  },
  addButton: {
    backgroundColor: "#d63b2d",
    margin: 16,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
