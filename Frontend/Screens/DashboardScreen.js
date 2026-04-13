import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getProfile } from "../api/auth";
import { BASE_URL } from "../api/config";
import { getDashboardStats } from "../api/productApi";


const HEADER_HEIGHT = 59;
const OVERLAP_AMOUNT = 70;

export default function DashboardScreen({ route }) {
  const navigation = useNavigation();

  // ✅ HOOKS MUST BE HERE (TOP LEVEL)
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
  total_products: 0,
  expiring_soon: 0,
  expired: 0,
  reminders: 0,
  bills: 0,
  recent_products: null,
  latest_reminders: [],
});
useEffect(() => {
  if (route?.params?.showLoginSuccess) {
    Alert.alert("Success", "Login Successful!");

    // remove param so it doesn't trigger again
    navigation.setParams({ showLoginSuccess: false });
  }
}, [route?.params?.showLoginSuccess]);

  useEffect(() => {
  const loadData = async () => {
    try {
      // existing profile fetch
      const profileData = await getProfile();
      setProfile(profileData);

      // NEW: dashboard stats
      const dashboardData = await getDashboardStats();
      setStats(dashboardData);
    } catch (error) {
      console.log("Dashboard load failed");
    }
  };

  loadData();

  const unsubscribe = navigation.addListener("focus", () => {
    loadData();
  });

  return unsubscribe;
}, [navigation]);
  
// Helper to decide what to show in image place
const getDocumentType = (documentUrl) => {
    if (!documentUrl) return "none";

    const extension = documentUrl.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png"].includes(extension)) return "image";

    return "file"; // pdf, doc, etc
  };


  // ⬇️ JSX STARTS HERE
  return (

    <View style={styles.wrapper}>

      {/* ---------- Rounded RED Header (Background Layer) ---------- */}
      <View style={styles.redHeader} />

      {/* ---------- Scrollable Content ----------- */}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT - OVERLAP_AMOUNT, // pushes content down LESS to reduce big gap
          paddingBottom: 50,
        }}
      >

        {/* ---------- TOP USER CARD (Overlapping) ---------- */}


        
        <View style={styles.topCard}>
        <Image
          source={
            profile?.profile_image
              ? { uri: `${BASE_URL}${profile.profile_image}` }
              : require("../assets/user.jpg")
          }
          style={styles.userIcon}
        />

      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.greeting}>
          Hi,{" "}
          {profile?.first_name || profile?.username || "User"}
        </Text>

        <Text style={styles.subtext}>
           You have {stats.expiring_soon} warranties expiring soon
        </Text>
      </View>

        {/* View Icon */}
        <TouchableOpacity
          onPress={() => navigation.navigate("ViewProfile")}
          style={{ padding: 8 }}
        >
          <Ionicons name="chevron-forward" size={24} color="#555" />
        </TouchableOpacity>
      </View>



        {/* ---------- GRID SECTION ---------- */}
        <View style={styles.gridContainer}>

          <TouchableOpacity
          style={styles.gridItem}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Totalview")} // change screen name if needed
          >
          <Ionicons name="cube" size={32} color="#e34b40ed" />
          <Text style={styles.gridTitle}>My Products</Text>
          <Text style={styles.gridSubtitle}>{stats.total_products} items tracked</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            activeOpacity={0.8}
            onPress={() => {
              console.log("Navigating to Bills & Invoices");
              navigation.navigate("Bills&invoices");
            }}>
            <Ionicons name="document-text" size={32} color="#e34b40ed" />
            <Text style={styles.gridTitle}>Bills & Invoices</Text>
            <Text style={styles.gridSubtitle}>{stats.bills} uploaded</Text>
          </TouchableOpacity>


          <TouchableOpacity 
          style={styles.gridItem} 
          onPress={() => navigation.navigate("Expiring")}
        >
          <Ionicons name="alert-circle" size={32} color="#e34b40ed" />
          <Text style={styles.gridTitle}>Expiring Soon</Text>
          <Text style={styles.gridSubtitle}>{stats.expiring_soon} warranties</Text>
        </TouchableOpacity>


          <TouchableOpacity style={styles.gridItem}
          onPress={() => navigation.navigate("ReminderList")}>
            <Ionicons name="calendar" size={32} color="#e34b40ed" />
            <Text style={styles.gridTitle}>Reminders</Text>
            <Text style={styles.gridSubtitle}>{stats.reminders} alerts</Text>
          </TouchableOpacity>

        </View>

        
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Warranty Status Overview</Text>
        </View> 

        {/* ---------- COUNTERS ---------- */}
        <View style={styles.counterRow}>

          <View style={styles.counterBox}>
            <Ionicons name="cube" size={30} color="#0e49f9ff" />
            <Text style={styles.counterNumber}>{stats.total_products}</Text>
            <Text>Total Products</Text>
          </View>

          <View style={styles.counterBox}>
            <Ionicons name="shield-checkmark" size={30} color="#2fca6dff" />
            <Text style={styles.counterNumber}>{stats.total_products - stats.expired}</Text>
            <Text>Active</Text>
          </View>

          <View style={styles.counterBox}>
            <Ionicons name="warning" size={30} color="#eff62aff" />
            <Text style={styles.counterNumber}>{stats.expiring_soon}</Text>
            <Text>Expiring Soon</Text>
            </View>
        </View>

        {/* ---------- RECENTLY ADDED ---------- */}
        <Text style={styles.subHeading}>Recently Added Product</Text>

        {!stats.recent_product ? (
          <Text style={{ color: "#777", marginBottom: 20 }}>
            No products added yet
          </Text>
) : (
  <View style={styles.productCard}>
    <View style={styles.productImgWrapper}>
  {getDocumentType(stats.recent_product.document) === "image" ? (
    <Image
      source={{ uri: stats.recent_product.document }}
      style={styles.productImg}
    />
  ) : getDocumentType(stats.recent_product.document) === "file" ? (
    <Ionicons name="document-text" size={38} color="#e34b40" />
  ) : (
    <Image
      source={require("../assets/black-placeholder.png")}
      style={styles.productImg}
    />
  )}
</View>


    <View style={{ flex: 1 }}>
      <Text style={styles.productTitle}>
        {stats.recent_product.product_name}
      </Text>
      <Text>Purchase: {stats.recent_product.purchase_date}</Text>
      <Text>Expiry: {stats.recent_product.warranty_expiry_date}</Text>
    </View>

    <TouchableOpacity
      style={styles.viewBtn}
      onPress={() =>
        navigation.navigate("ProductDetails", {
          product: stats.recent_product,
        })
      }
    >
      <Text style={{ color: "#fff" }}>View</Text>
    </TouchableOpacity>
  </View>
)}


        {/* ---------- QUICK ACTIONS ---------- */}
        <Text style={styles.subHeading}>  Quick Actions</Text>

        <View style={styles.actionRow}>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("Addproduct")}>
            <Ionicons name="add-circle" size={30} color="#e34b40ed" />
            <Text style={styles.actionText}>Add Product</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate("Addproduct", {
              source: "bill",
            })}
          >
            <Ionicons name="document" size={30} color="#e34b40ed" />
            <Text style={styles.actionText}>Add Bill&Invoice</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.actionItem}
          onPress={() => navigation.navigate("Setreminder")}>
            <Ionicons name="notifications" size={30} color="#e34b40ed" />
            <Text style={styles.actionText}>Set Reminder</Text>
          </TouchableOpacity>

        </View>

        {/* ---------- Notifications ---------- */}
<View>
  <Text style={styles.subHeading}>Notifications</Text>

  {stats.latest_reminders.length === 0 ? (
    <Text style={{ color: "#777", marginBottom: 20 }}>
      No upcoming reminders
    </Text>
  ) : (
    <>
      {stats.latest_reminders.map((item) => (
        <View key={item.id} style={styles.notificationCard}>
          <Ionicons name="notifications" size={22} color="#e34b40ed" />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontWeight: "600" }}>
              {item.product_name}
            </Text>
            <Text style={{ color: "#666" }}>
              Reminder on {item.reminder_date}
            </Text>
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={() => navigation.navigate("ReminderList")}
      >
        <Text style={{ color: "#0e49f9ff", marginBottom: 20 }}>
          View all reminders →
        </Text>
      </TouchableOpacity>
    </>
  )}
</View>


      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },

  /* ----------- FIXED RED HEADER ----------- */
  redHeader: {
    height: HEADER_HEIGHT,
    width: "120%",
    position: "",
    top: 0,
    marginBottom:20,
    backgroundColor: "#E6392E",
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    zIndex: 1,
  },

  container: {
    flex: 1,
  },

  /* ----------- TOP CARD ----------- */
  topCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e34b40ed",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  userIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  subtext: {
    color: "#fff",
  },

  /* -------- GRID -------- */
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gridItem: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  gridSubtitle: {
    color: "#777",
    fontSize: 13,
  },

  /* -------- CHART -------- */
  chartContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },

  /* -------- COUNTERS -------- */
  counterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  counterBox: {
    width: "30%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  counterNumber: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },

  /* -------- RECENTLY ADDED -------- */
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  productImg: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  productTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  viewBtn: {
    backgroundColor: "#e34b40ed",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  /* -------- QUICK ACTIONS -------- */
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionItem: {
    width: "32%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  actionText: {
    marginTop: 6,
    fontSize: 14,
  },

  /* -------- NOTIFICATIONS -------- */
  notificationCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  notificationCard: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  padding: 12,
  borderRadius: 10,
  marginBottom: 10,
},

});
