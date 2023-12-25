import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import colors from "../../constants/colors";
// import navigation
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import icons
import { Ionicons } from "@expo/vector-icons";

// import screens
import ChatListScreen from "../screens/ChatListScreen";
import ChatSettingsScreen from "../screens/ChatSettingsScreen";
import ChatScreen from "../screens/ChatScreen";


// stack
const Stack = createStackNavigator();
// bottom navigator
const Tab = createBottomTabNavigator();

// Tab Navigator
// customize headerTitle style
const CustomHeaderTitle = () => {
  return (
    <Text
      style={{
        fontFamily: "Poppins_extrabolditalic",
        fontSize: 30,
        color: colors.yellow,
      }}
    >
      shoal
    </Text>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: (props) => <CustomHeaderTitle {...props} />,
        headerStyle: { backgroundColor: "#FF9D7A" },
        tabBarLabelStyle: { fontSize: 14, color: "#F75820" },
        tabBarStyle: { backgroundColor: "#FF9D7A" },
      }}
    >
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarLabel: () => {
            return <Text style={{fontFamily: "Poppins_semibold", fontSize: 14, color: colors.pink_white}}>QQ</Text>
          },
          tabBarIcon: () => {
            return <Ionicons name="chatbox-ellipses" size={32} color={colors.orange}/>;
          },
        }}
      />
      <Tab.Screen
        name="ChatSettings"
        component={ChatSettingsScreen}
        options={{
          tabBarLabel: () => {
            return <Text style={{fontFamily: "Poppins_semibold", fontSize: 14, color: colors.pink_white}}>PP</Text>
          },
          tabBarIcon: () => {
            return (
              <Ionicons name="camera" size={32} color={colors.orange} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = (props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Chat List"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Chat Screen"
        component={ChatScreen}
        options={{
          headerTitle: "",
          headerBackTitle: "Back",
          headerStyle: { backgroundColor: "#FF9D7A" },
        }}
      />
      <Stack.Screen
        name="Chat Settings"
        component={ChatSettingsScreen}
        options={{
          headerTitle: "Settings",
          headerBackTitle: "Back",
          headerStyle: { backgroundColor: "#FF9D7A" },
        }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
