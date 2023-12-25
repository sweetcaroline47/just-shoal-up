import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import colors from "../../constants/colors";

const ChatListScreen = (props) => {
    return <View style={styles.container}>
        <Text>Chat List Screen</Text>
        <Button title="Go to Chat" onPress={() => { props.navigation.navigate("Chat Screen") }} />
        <Button title="Go to Settings" onPress={() => { props.navigation.navigate("Chat Settings") }} />
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

export default ChatListScreen;