import React, { useEffect } from "react";
import { FlatList } from "react-native";
import { useSelector } from "react-redux";
import DataItem from "../components/DataItem";
import PageContainer from "../components/PageContainer";

const DataListScreen = (props) => {
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const userData = useSelector((state) => state.auth.userData);
  const messagesData = useSelector(state => state.messages.messagesData);

  const { title, data, type, chatId } = props.route.params;

  useEffect(() => {
    props.navigation.setOptions({ headerTitle: title });
  }, [title]);

  return (
    <PageContainer>
      <FlatList
        data={data}
        keyExtractor={(item) => item.messageId || item}
        renderItem={(itemData) => {
          let key, onPress, image, title, subtitle, itemType;

          if (type === "users") {
            const uid = itemData.item;
            const currentUser = storedUsers[uid];

            if (!currentUser) return;

            const isLoggedInUser = uid === userData.userId;

            key = uid;
            image = currentUser.profilePicture;
            title = `${currentUser.fullName}`;
            subtitle = currentUser.type;
            itemType = isLoggedInUser ? undefined : "link";
            onPress = isLoggedInUser
              ? undefined
              : () => props.navigation.navigate("Contact", { uid, chatId });
          } else if (type === "messages") {
            const starData = itemData.item;
            const { chatId, messageId } = starData;
            const messagesForChat = messagesData[chatId];

            if (!messagesForChat) {
              return;
            }

            const messageData = messagesForChat[messageId];
            const sender =
              messageData.sentBy && storedUsers[messageData.sentBy];
            const name = sender && `${sender.fullName}`;

            key = messageId;
            title = name;
            subtitle = messageData.text;
            itemType = "";
            onPress = () => {};
          }

          return (
            <DataItem
              key={key}
              onPress={onPress}
              image={image}
              title={title}
              subtitle={subtitle}
              type={itemType}
            />
          );
        }}
      />
    </PageContainer>
  );
};

export default DataListScreen;
