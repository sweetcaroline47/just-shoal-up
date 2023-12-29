import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import colors from "../../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { useSelector } from "react-redux";

const ChatListScreen = (props) => {
  const selectedUser = props.route?.params?.selectedUserId;
  const userData = useSelector((state) => state.auth.userData);
  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="New chat"
              iconName="create-outline"
              color={colors.yellow}
              onPress={() => {
                props.navigation.navigate("New Chat");
              }}
            />
          </HeaderButtons>
        );
      },
    });
  }, []);
  useEffect(() => {
    if (!selectedUser) {
      return;
    }
    const chatUsers = [selectedUser, userData.userId];

    const navigationProps = {
      newChatData: { users: chatUsers },
    };
    props.navigation.navigate("Chat Screen", navigationProps);
  }, [props.route?.params]);

  return (
    <View style={styles.container}>
      <Text>Chat List Screen</Text>
      <Button
        title="Go to Chat"
        onPress={() => {
          props.navigation.navigate("Chat Screen");
        }}
      />
      <Button
        title="Go to Settings"
        onPress={() => {
          props.navigation.navigate("Chat Settings");
        }}
      />
    </View>
  );
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
