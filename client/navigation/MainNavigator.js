import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import colors from "../../constants/colors";
// import navigation

import "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import icons
import { Ionicons } from "@expo/vector-icons";

// import screens
import ChatListScreen from "../screens/ChatListScreen";
import ChatSettingsScreen from "../screens/ChatSettingsScreen";
import ChatScreen from "../screens/ChatScreen";
import NewChatScreen from "../screens/NewChatScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


// stack
const Stack = createNativeStackNavigator();
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
      screenOptions={({ route }) => ({
        headerTitle: (props) => <CustomHeaderTitle {...props} />,
        headerTitle: (props) => <CustomHeaderTitle {...props} />,
        headerStyle: { backgroundColor: "#FF9D7A" },
        headerShadowVisible: false,
        tabBarLabelStyle: { fontSize: 14, color: "#F75820" },
        tabBarStyle: { backgroundColor: "#FF9D7A" },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "ChatList") {
            iconName = focused ? "chatbox-sharp" : "chatbox-outline";
          } else if (route.name === "ChatSettings") {
            iconName = focused ? "settings-sharp" : "settings-outline";
          }
          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.pink_white,
        tabBarLabelStyle: {
          fontFamily: "Poppins_semibold",
          fontSize: 12,
          // Set the default color for tabBarLabel when not focused
        },
      })}
    >
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{ color: focused ? colors.orange : colors.pink_white }}
            >
              Chat
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="ChatSettings"
        component={ChatSettingsScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? colors.orange : colors.pink_white }}>
              Profile
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = (props) => {
  return (
    <Stack.Navigator>
      <Stack.Group>
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
      </Stack.Group>
      <Stack.Group
      screenOptions={{presentation: "modal"}}
      >
      <Stack.Screen
        name="New Chat"
        component={NewChatScreen}
      />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default MainNavigator;
