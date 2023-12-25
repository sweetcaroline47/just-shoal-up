import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import colors from "../../constants/colors";

const ChatSettingsScreen = (props) => {
    return <View style={styles.container}>
        <Text>Chat Settings Screen</Text>
    </View>
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.pink_1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default ChatSettingsScreen;