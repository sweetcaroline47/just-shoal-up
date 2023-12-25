import React, { useCallback, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import PageContainer from "../components/PageContainer";
import Register from "../components/Register";
import LogIn from "../components/LogIn";
import colors from "../../constants/colors";
import logo from "../assets/images/adaptive-icon.png";

const AuthScreen = (props) => {
  
  const [isRegistered, setIsRegistered] = useState(false);
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageContainer>
        <ScrollView>
          <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === "ios" ? "height" : undefined}
          keyboardVerticalOffset={100}
          >
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={logo} />
            </View>

            {isRegistered ? <LogIn /> : <Register />}
            <TouchableOpacity
              onPress={() => setIsRegistered((prevState) => !prevState)}
              style={{
                marginVertical: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins_regular",
                  color: colors.chinese_black,
                  letterSpacing: 0.3,
                }}
              >{`Switch to ${isRegistered ? "regiester" : "sign in"}`}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </PageContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  image: {
    resizeMode: "contain",
    width: 200,
    height: 200,
  },
  keyboardAvoidingView:{
    flex: 1,
    justifyContent: "center",
  },
});

export default AuthScreen;
