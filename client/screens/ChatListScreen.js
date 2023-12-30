import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";
import colors from "../../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { useSelector } from "react-redux";
import DataItem from "../components/DataItem";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";

const ChatListScreen = (props) => {
  const selectedUser = props.route?.params?.selectedUserId;
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const userChats = useSelector((state) => {
    const chatsData = state.chats.chatsData;
    return Object.values(chatsData).sort((a, b) => {
      // show chats from the most recent to least
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  });

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="New chat"
              iconName="create"
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
    <PageContainer>
      <PageTitle text="Chats" />
      <FlatList
        data={userChats}
        renderItem={(itemData) => {
          const chatData = itemData.item;
          const chatId = chatData.key;
          const otherUserId = chatData.users.find(
            (uid) => uid !== userData.userId
          );
          const otherUser = storedUsers[otherUserId];
          if (!otherUser) return;
          const title = `${otherUser.fullName}`;
          const subtitle = chatData.latestMessageText || "Say hi to your new friend :)";
          const image = otherUser.profilePicture;

          return (
            <DataItem
              title={title}
              subtitle={subtitle}
              image={image}
              onPress={() =>
                props.navigation.navigate("Chat Screen", { chatId: chatId })
              }
            />
          );
        }}
      />
    </PageContainer>
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
