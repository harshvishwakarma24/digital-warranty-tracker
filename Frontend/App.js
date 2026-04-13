import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./Screens/WelcomeScreen";
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import DashboardScreen from "./Screens/DashboardScreen";
import AddProductScreen from "./Screens/Addproduct"; 
import ViewProfileScreen from "./Screens/ViewProfileScreen";
import EditProfileScreen from "./Screens/EditProfileScreen";
import TotalProductsCard from "./Screens/TotalProductsCard";
import BillsinvoicesScreen from "./Screens/Bills&invoicesScreen";
import ExpiringScreen from "./Screens/ExpiringScreen";
import SetReminderScreen from "./Screens/SetReminderScreen";
import RemindersListScreen from "./Screens/RemindersListScreen";
import ProductDetailsScreen from "./Screens/ProductDetailsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen}/>
        <Stack.Screen name="Addproduct" component={AddProductScreen}/>
        <Stack.Screen name="ViewProfile" component={ViewProfileScreen}/>
        <Stack.Screen name="Totalview" component={TotalProductsCard}/>
        <Stack.Screen name="Bills&invoices" component={BillsinvoicesScreen} />
        <Stack.Screen name="Expiring" component={ExpiringScreen} />
        <Stack.Screen name="Setreminder" component={SetReminderScreen}/>
        <Stack.Screen name="ReminderList" component={RemindersListScreen}/>
        <Stack.Screen name="EditProfile" component={EditProfileScreen}/>
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen}/>
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}
