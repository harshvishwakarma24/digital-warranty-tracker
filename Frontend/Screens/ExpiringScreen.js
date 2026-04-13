// Screens/ExpiringScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import TopHeader from "../components/AppHeader";
import {getExpiringSoonProducts,getExpiredProducts,} from "../api/productApi";


export default function ExpiringScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("expiring");
  const [expiring, setExpiring] = useState([]);
  const [expired, setExpired] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExpiring();
    fetchExpired();
  }, []);

  const fetchExpiring = async () => {
  try {
    setLoading(true);
    const data = await getExpiringSoonProducts();
    setExpiring(data);
  } catch (err) {
    console.log("Expiring API error:", err);
  } finally {
    setLoading(false);
  }
};

const fetchExpired = async () => {
  try {
    const data = await getExpiredProducts();
    setExpired(data);
  } catch (err) {
    console.log("Expired API error:", err);
  }
};


  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.product}>{item.product_name}</Text>
      <Text style={styles.date}>
        Expiry: {item.warranty_expiry_date}
      </Text>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <TopHeader title="Expiring Warranties" navigation={navigation} />

      <View style={styles.cardContainer}>
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "expiring" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("expiring")}
          >
            <Text
              style={
                activeTab === "expiring"
                  ? styles.activeText
                  : styles.tabText
              }
            >
              Expiring Soon
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "expired" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("expired")}
          >
            <Text
              style={
                activeTab === "expired"
                  ? styles.activeText
                  : styles.tabText
              }
            >
              Expired
            </Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        {loading ? (
          <Text style={styles.empty}>Loading...</Text>
        ) : (
          <FlatList
            data={activeTab === "expiring" ? expiring : expired}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
            ListEmptyComponent={
              <Text style={styles.empty}>No items here!</Text>
            }
          />
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create
({ 
  wrapper: { 
    flex: 1, 
    backgroundColor: "#f4f4f4" // same as Dashboard 
    }, 
  cardContainer: 
    { flex: 1, 
      backgroundColor: "#fff", 
      borderTopLeftRadius: 20, 
      borderTopRightRadius: 20, 
      marginTop: -20, // overlap header 
      paddingTop: 20, 
      elevation: 3, // shadow Android 
      shadowColor: "#000", // shadow iOS 
      shadowOffset: { width: 0, height: 2 }, 
      shadowOpacity: 0.1, shadowRadius: 4, 
    }, 
  tabContainer: { 
      flexDirection: "row", 
      justifyContent: "space-around", 
      marginBottom: 10 
    }, 
  tab: { 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 20, 
    backgroundColor: "#f0f0f0"
       }, 
  activeTab: { 
    backgroundColor: "#007AFF" 
  }, 
  tabText: { 
    color: "#333", 
    fontWeight: "bold" 
  }, 
  activeText: { 
    color: "#fff", 
    fontWeight: "bold" 
  }, 
  item: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: "#ccc", 
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10 
  }, 
  product: { 
    fontSize: 16, 
    fontWeight: "bold"
   }, 
   date: { 
    fontSize: 14, 
    color: "#666" 
  }, 
  empty: { 
    textAlign: "center", 
    marginTop: 50, 
    color: "#999" 
  }, 
  });
