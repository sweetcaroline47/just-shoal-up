import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import backgroundImage from "../assets/images/ChatBackground_0.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import Bubble from "../components/Bubble";
import { createChat } from "../utils/actions/chatActions";

const ChatScreen = (props) => {
  // store all the users you have searched in the state
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const [chatUsers, setChatUsers] = useState([]);

  const [messageText, setMessageText] = useState("");
  const [chatId, setChatId] = useState(props.route?.params?.chatId);

  const chatData = props.route?.params?.newChatData;
  const getChatTitleFromName = () => {
    const otherUserId = chatUsers.find((uid) => uid !== userData.userId);
    const otherUserData = storedUsers[otherUserId];
    return otherUserData && `${otherUserData.fullName}`;
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: getChatTitleFromName(),
      headerTitleStyle: {
        fontFamily: "Poppins_semibold",
        color: colors.chinese_black,
        letterSpacing: 0.3,
      },
    });

    setChatUsers(chatData.users);
  }, [chatUsers]);

  const sendMessage = useCallback( async () => {
    try {
      let id = chatId;
      if (!id){
        // no chat id. create the chat
        id = await createChat(userData.userId, props.route.params.newChatData);
        setChatId(id);
      }
    } catch (error) {

    }

    setMessageText("");
  }, [messageText, chatId]);

  return (
    <SafeAreaView edges={["right", "left", "bottom"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
        >
          <PageContainer style={{ backgroundColor: "transparent" }}>
            {!chatId && <Bubble text="New chat! Say hi :)" type="system" />}
          </PageContainer>
        </ImageBackground>

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => console.log("touched")}
          >
            <Ionicons
              name="ios-add-circle-outline"
              size={32}
              color={colors.orange}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.textBox}
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
            onSubmitEditing={sendMessage}
          />

          {messageText === "" && (
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={() => console.log("touched")}
            >
              <Ionicons
                name="md-camera-outline"
                size={32}
                color={colors.orange}
              />
            </TouchableOpacity>
          )}

          {messageText !== "" && (
            <TouchableOpacity
              style={{ ...styles.mediaButton }}
              onPress={sendMessage}
            >
              <Ionicons
                name="arrow-up-circle-outline"
                size={32}
                color={colors.orange}
              />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  screen: {
    flex: 1,
  },

  backgroundImage: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    height: 50,
  },
  textBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.pink_2,
    marginHorizontal: 15,
    paddingHorizontal: 12,
    flexDirection: "row",
  },
  mediaButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 35,
  },
});

export default ChatScreen;
