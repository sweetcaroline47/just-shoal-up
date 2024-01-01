import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import DataItem from "../components/DataItem";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import ProfileImage from "../components/ProfileImage";
import colors from "../../constants/colors";
import { getUserChats } from "../utils/actions/userActions";
import SubmitButton from "../components/SubmitButton";
import { removeUserFromChat } from "../utils/actions/chatActions";

const ContactScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const userData = useSelector((state) => state.auth.userData);
  const currentUser = storedUsers[props.route.params.uid];

  const storedChats = useSelector((state) => state.chats.chatsData);
  const [commonChats, setCommonChats] = useState([]);

  const chatId = props.route.params.chatId;
  const chatData = chatId && storedChats[chatId];

  useEffect(() => {
    const getCommonUserChats = async () => {
      const currentUserChats = await getUserChats(currentUser.userId);
      setCommonChats(
        Object.values(currentUserChats).filter(
          (cd) => storedChats[cd] && storedChats[cd].isGroupChat
        )
      );
    };

    getCommonUserChats();
  }, []);

  const removeFromChat = useCallback(async () => {
    try {
      setIsLoading(true);

      await removeUserFromChat(userData, currentUser, chatData);

      props.navigation.goBack();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [props.navigation, isLoading]);

  return (
    <PageContainer>
      <View style={styles.topContainer}>
        <ProfileImage
          uri={currentUser.profilePicture}
          size={80}
          style={{ marginBottom: 20 }}
        />

        <PageTitle text={`${currentUser.fullName}`} />

        {currentUser.type && (
          <Text style={styles.type} numberOfLines={1}>
            {currentUser.type}
          </Text>
        )}
      </View>

      {commonChats.length > 0 && (
        <>
          <Text style={styles.heading}>
            {commonChats.length} {commonChats.length === 1 ? "Group" : "Groups"}{" "}
            in Common
          </Text>
          {commonChats.map((cd) => {
            const chatData = storedChats[cd];
            return (
              <DataItem
                key={cd}
                title={chatData.chatName}
                subtitle={chatData.latestMessageText}
                type="link"
                onPress={() =>
                  props.navigation.push("Chat Screen", { chatId: cd })
                }
                image={chatData.chatImage}
              />
            );
          })}
        </>
      )}

      {chatData && chatData.isGroupChat && 
      (isLoading ? (
        <ActivityIndicator size={"small"} color={colors.orange} />
      ) : (
        <SubmitButton
          title="Remove"
          style={{ marginTop: 20 }}
          isRemove
          onPress={removeFromChat}
        />
      ))
      }
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  type: {
    fontFamily: "Poppins_regular",
    fontSize: 16,
    letterSpacing: 0.3,
    color: colors.pink_white,
  },
  heading: {
    fontFamily: "Poppins_bold",
    letterSpacing: 0.3,
    fontSize: 18,
    color: colors.orange,
    fontFamily: "Poppins_semibold",
    marginVertical: 8,
  },
});

export default ContactScreen;
