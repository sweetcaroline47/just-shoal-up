import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import colors from "../../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { useSelector } from "react-redux";
import DataItem from "../components/DataItem";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";

const ChatListScreen = (props) => {
  const selectedUser = props.route?.params?.selectedUserId;
  const selectedUsers = props.route?.params?.selectedUsers;
  const chatName = props.route?.params?.chatName;

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
              iconName="create-outline"
              color={colors.chinese_red}
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
    if (!selectedUser && !selectedUsers) {
      return;
    }

    let chatData;
    let navigationProps;

    if (selectedUser) {
      chatData = userChats.find(
        (cd) => !cd.isGroupChat && cd.users.includes(selectedUser)
      );
    }
    if (chatData) {
      navigationProps = { chatId: chatData.key };
    } else {
      const chatUsers = selectedUsers || [selectedUser];
      if (!chatUsers.includes(userData.userId)) {
        chatUsers.push(userData.userId);
      }

      navigationProps = {
        newChatData: {
          users: chatUsers,
          isGroupChat: selectedUsers !== undefined,
          
        },
      };
      if (chatName) {
        navigationProps.newChatData.chatName = chatName;
    }
    }

    props.navigation.navigate("Chat Screen", navigationProps);
  }, [props.route?.params]);

  return (
    <PageContainer>
      <PageTitle text="Chats" />

      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("New Chat", { isGroupChat: true });
          }}
        >
          <Text style={styles.newGroupText}>New Group</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={userChats}
        renderItem={(itemData) => {
          const chatData = itemData.item;
          const chatId = chatData.key;
          const isGroupChat = chatData.isGroupChat;

          let title = "";
          const subtitle =
            chatData.latestMessageText || "Say hi to your new friend :)";
          let image = "";

          if (isGroupChat) {
            title = chatData.chatName;
            image = chatData.chatImage;
          } else {
            const otherUserId = chatData.users.find(
              (uid) => uid !== userData.userId
            );
            const otherUser = storedUsers[otherUserId];
            if (!otherUser) return;
            title = `${otherUser.fullName}`;

            image = otherUser.profilePicture;
          }

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
  newGroupText: {
    fontFamily: "Poppins_semibold",
    fontSize: 17,
    color: colors.chinese_red,
    marginBottom: 5,
  },
});

export default ChatListScreen;
