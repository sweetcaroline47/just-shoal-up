import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import MainNavigator from "./MainNavigator";
import ChatSettingsScreen from "../screens/ChatSettingsScreen";
import AuthScreen from "../screens/AuthScreen";

// multiple navigators depending on whether the user is logged in, etc.
const AppNavigator = (props) => {
  const isAuth = false;





  return (
    <NavigationContainer>
      {isAuth && <MainNavigator/>}
      {!isAuth && <AuthScreen/>}
      
    </NavigationContainer>
  );
};

export default AppNavigator;
