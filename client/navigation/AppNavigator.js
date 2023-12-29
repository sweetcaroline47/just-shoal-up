import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import MainNavigator from "./MainNavigator";
import ChatSettingsScreen from "../screens/ChatSettingsScreen";
import AuthScreen from "../screens/AuthScreen";
import { useSelector } from "react-redux";
import StartScreen from "../screens/StartScreen";

// multiple navigators depending on whether the user is logged in, etc.
const AppNavigator = (props) => {
  const isAuth = useSelector(state => state.auth.token !== null && state.auth.token !== "");
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);





  return (
    <NavigationContainer>
      {isAuth && <MainNavigator/>}
      {!isAuth && !didTryAutoLogin && <StartScreen/>}
      {!isAuth && didTryAutoLogin && <AuthScreen/>}
      
    </NavigationContainer>
  );
};

export default AppNavigator;
