import React, { useCallback, useEffect, useRef, useState } from "react";
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
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import backgroundImage from "../assets/images/ChatBackground_0.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import Bubble from "../components/Bubble";
import {
  createChat,
  sendImage,
  sendTextMessage,
} from "../utils/actions/chatActions";
import ReplyTo from "../components/ReplyTo";
import {
  launchImagePicker,
  openCamera,
  uploadImageAsync,
} from "../utils/imagePickerHelper";
import AwesomeAlert from "react-native-awesome-alerts";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";

const ChatScreen = (props) => {
  const [chatUsers, setChatUsers] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [chatId, setChatId] = useState(props.route?.params?.chatId);
  const [errorBannerText, setErrorBannerText] = useState("");
  const [replyingTo, setReplyingTo] = useState();
  const [tempImageUri, setTempImageUri] = useState("");
  const [isLoading, setIsLoadning] = useState(false);

  // to show the latest text
  const flatList = useRef();

  // store all the users you have searched in the state
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const storedChats = useSelector((state) => state.chats.chatsData);
  const chatMessages = useSelector((state) => {
    if (!chatId) return [];
    const chatMessagesData = state.messages.messagesData[chatId];
    if (!chatMessagesData) return [];
    const messageList = [];
    for (const key in chatMessagesData) {
      const message = chatMessagesData[key];
      messageList.push({
        key: key,
        ...message,
      });
    }
    return messageList;
  });

  // store previous chat and new chat data into chatData
  const chatData =
    (chatId && storedChats[chatId]) || props.route?.params?.newChatData;

  const getChatTitleFromName = () => {
    const otherUserId = chatUsers.find((uid) => uid !== userData.userId);
    const otherUserData = storedUsers[otherUserId];
    return otherUserData && `${otherUserData.fullName}`;
  };

  const title = chatData.chatName ?? getChatTitleFromName();

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: title,

      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            {chatId && (
              <Item
                title="Contacts"
                iconName="happy-outline"
                color={colors.chinese_red}
                onPress={() =>
                  chatData.isGroupChat
                    ? props.navigation.navigate("Group Contact", {chatId: chatId})
                    : props.navigation.navigate("Contact", {uid: chatUsers.find((uid) => uid !== userData.userId)})
                }
              />
            )}
          </HeaderButtons>
        );
      },

      headerTitleStyle: {
        fontFamily: "Poppins_semibold",
        color: colors.chinese_black,
        letterSpacing: 0.3,
      },
    });
    setChatUsers(chatData.users);
  }, [chatUsers, title]);

  // send message in 1-1 chat
  const sendMessage = useCallback(async () => {
    try {
      // CY EDIT: AVOID SENDING EMPTY MESSAGES
      if (!messageText.trim()) {
        // If the message text is empty or contains only whitespace characters
        return;
      }

      let id = chatId;
      if (!id) {
        // no chat id. create the chat
        id = await createChat(userData.userId, props.route.params.newChatData);
        setChatId(id);
      }

      if (messageText.trim()) {
        // send a text message
        await sendTextMessage(
          id,
          userData.userId,
          messageText,
          replyingTo && replyingTo.key
        );
        setMessageText("");
        setReplyingTo(null);
      }
    } catch (error) {
      console.log(error);
      setErrorBannerText("Message failed to send");
      setTimeout(() => setErrorBannerText(""), 5000);
    }
  }, [messageText, chatId]);

  const pickImage = useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;
      setTempImageUri(tempUri);
    } catch (error) {
      console.log(error);
    }
  }, [tempImageUri]);

  const takePhoto = useCallback(async () => {
    try {
      const tempUri = await openCamera();
      if (!tempUri) return;
      setTempImageUri(tempUri);
    } catch (error) {
      console.log(error);
    }
  }, [tempImageUri]);

  const uploadImage = useCallback(async () => {
    setIsLoadning(true);
    try {
      let id = chatId;
      if (!id) {
        // no chat id. create the chat
        id = await createChat(userData.userId, props.route.params.newChatData);
        setChatId(id);
      }

      const uploadUrl = await uploadImageAsync(tempImageUri, true);
      setIsLoadning(false);

      // send image
      sendImage(
        id,
        userData.userId,
        messageText,
        uploadUrl,
        replyingTo && replyingTo.key
      );
      // CY EDIT: CLEAR THE TEXTBOX AFTER SENDING AN IMAGE
      setMessageText("");
      setTempImageUri("");
    } catch (error) {
      console.log(error);
      setIsLoadning(false);
    }
  }, [isLoading, tempImageUri, chatId]);

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
            {errorBannerText !== "" && (
              <Bubble text={errorBannerText} type="error" />
            )}
            {chatId && (
              <FlatList
                ref={(ref) => (flatList.current = ref)}
                onContentSizeChange={() =>
                  flatList.current.scrollToEnd({ animated: false })
                }
                onLayout={() =>
                  flatList.current.scrollToEnd({ animated: false })
                }
                data={chatMessages}
                renderItem={(itemData) => {
                  const message = itemData.item;
                  const isOwnMessage = message.sentBy === userData.userId;
                  const messageType = isOwnMessage
                    ? "myMessage"
                    : "theirMessage";

                  const sender = message.sentBy && storedUsers[message.sentBy];
                  const name = sender && `${sender.fullName}`;
                  return (
                    <Bubble
                      type={messageType}
                      text={message.text}
                      messageId={message.key}
                      userId={userData.userId}
                      chatId={chatId}
                      date={message.sentAt}
                      name={
                        !chatData.isGroupChat || isOwnMessage ? undefined : name
                      }
                      setReply={() => setReplyingTo(message)}
                      replyingTo={
                        message.replyTo &&
                        chatMessages.find((i) => i.key === message.replyTo)
                      }
                      imageUrl={message.imageUrl}
                    />
                  );
                }}
              />
            )}
          </PageContainer>

          {replyingTo && (
            <ReplyTo
              text={replyingTo.text}
              user={storedUsers[replyingTo.sentBy]}
              onCancel={() => setReplyingTo(null)}
            />
          )}
        </ImageBackground>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
            <Ionicons
              name="add-circle-outline"
              size={32}
              color={colors.orange}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.textBox}
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
            onSubmitEditing={sendMessage}
            multiline={true}
            textAlignVertical={"auto"}
          />

          <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
            <Ionicons
              name="md-camera-outline"
              size={32}
              color={colors.orange}
            />
          </TouchableOpacity>

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

          <AwesomeAlert
            show={tempImageUri !== ""}
            title="Send image?"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelButtonStyle={styles.popupButtonStyle}
            confirmButtonStyle={styles.popupButtonStyle}
            cancelText="Cancel"
            confirmText="Send"
            cancelButtonTextStyle={{
              fontFamily: "Poppins_regular",
              letterSpacing: 0.3,
            }}
            confirmButtonTextStyle={{
              fontFamily: "Poppins_regular",
              letterSpacing: 0.3,
            }}
            confirmButtonColor={colors.orange}
            cancelButtonColor={colors.chinese_red}
            titleStyle={styles.popupTitleStyle}
            onCancelPressed={() => setTempImageUri("")}
            onConfirmPressed={uploadImage}
            onDismiss={() => setTempImageUri("")}
            customView={
              <View>
                {isLoading && (
                  <ActivityIndicator size={"small"} color={colors.orange} />
                )}
                {!isLoading && tempImageUri !== "" && (
                  <Image
                    source={{ uri: tempImageUri }}
                    style={{ width: 200, height: 200 }}
                  />
                )}
              </View>
            }
          />
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
    height: "auto",
  },
  textBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.pink_2,
    marginLeft: 0,
    marginRight: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    fontSize: 16,
    fontFamily: "Poppins_regular",
    letterSpacing: 0.3,
  },
  mediaButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 35,
    marginRight: 5,
  },
  popupButtonStyle: {
    width: 70,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  popupTitleStyle: {
    fontFamily: "Poppins_regular",
    letterSpacing: 0.3,
    color: colors.chinese_black,
    marginBottom: 10,
  },
});

export default ChatScreen;
