import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// import main style
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, LogBox } from "react-native";
import * as Font from "expo-font";
import colors from "./constants/colors";

// import AppNavigator
import AppNavigator from "./client/navigation/AppNavigator";

// import from redux
import { Provider } from "react-redux";
import { store } from "./client/store/store";

// force logout temp
import AsyncStorage from "@react-native-async-storage/async-storage";
// AsyncStorage.clear();

// import message popup menu
import { MenuProvider } from "react-native-popup-menu";

// Main APP
export default function App() {
  // load fonts
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Poppins_black: require("./client/assets/fonts/Poppins-Black.ttf"),
        Poppins_blackitalic: require("./client/assets/fonts/Poppins-BlackItalic.ttf"),
        Poppins_bold: require("./client/assets/fonts/Poppins-Bold.ttf"),
        Poppins_bolditalic: require("./client/assets/fonts/Poppins-BoldItalic.ttf"),
        Poppins_extrabold: require("./client/assets/fonts/Poppins-ExtraBold.ttf"),
        Poppins_extrabolditalic: require("./client/assets/fonts/Poppins-ExtraBoldItalic.ttf"),
        Poppins_extralight: require("./client/assets/fonts/Poppins-ExtraLight.ttf"),
        Poppins_extralightitalic: require("./client/assets/fonts/Poppins-ExtraLightItalic.ttf"),
        Poppins_italic: require("./client/assets/fonts/Poppins-Italic.ttf"),
        Poppins_light: require("./client/assets/fonts/Poppins-Light.ttf"),
        Poppins_lightitalic: require("./client/assets/fonts/Poppins-LightItalic.ttf"),
        Poppins_medium: require("./client/assets/fonts/Poppins-Medium.ttf"),
        Poppins_mediumitalic: require("./client/assets/fonts/Poppins-MediumItalic.ttf"),
        Poppins_regular: require("./client/assets/fonts/Poppins-Regular.ttf"),
        Poppins_semibold: require("./client/assets/fonts/Poppins-SemiBold.ttf"),
        Poppins_semibolditalic: require("./client/assets/fonts/Poppins-SemiBoldItalic.ttf"),
        Poppins_thin: require("./client/assets/fonts/Poppins-Thin.ttf"),
        Poppins_thinitalic: require("./client/assets/fonts/Poppins-ThinItalic.ttf"),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider style={styles.container}>
        <MenuProvider>
          <AppNavigator />
        </MenuProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pink_1,
  },
  label: {
    color: colors.orange,
    fontSize: 24,
    fontFamily: "Poppins_bolditalic",
  },
});
