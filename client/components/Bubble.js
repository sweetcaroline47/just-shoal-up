import React, { useRef } from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View, Image } from "react-native";
import colors from "../../constants/colors";
import {
  Menu,
  MenuTrigger,
  MenuOption,
  MenuOptions,
} from "react-native-popup-menu";
import uuid from "react-native-uuid";
import * as Clipboard from "expo-clipboard";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { starMessage } from "../utils/actions/chatActions";
import { useSelector } from "react-redux";

function formatAmPm(dateString) {
  const date = new Date(dateString);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return hours + ":" + minutes + " " + ampm;
}

const MenuItem = (props) => {
  const Icon = props.iconPack ?? Ionicons;

  return (
    <MenuOption onSelect={props.onSelect}>
      <View style={styles.menuItemContainer}>
        <Text style={styles.menuText}>{props.text}</Text>
        <Icon name={props.icon} size={18} color={props.color} />
      </View>
    </MenuOption>
  );
};

const Bubble = (props) => {
  const {
    text,
    type,
    messageId,
    chatId,
    userId,
    date,
    setReply,
    replyingTo,
    name,
    imageUrl,
  } = props;
  const starredMessages = useSelector(
    (state) => state.messages.starredMessages[chatId] ?? {}
  );
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const bubbleStyle = { ...styles.container };
  const textStyle = { ...styles.text };
  const wrapperStyle = { ...styles.wrapperStyle };

  const menuRef = useRef(null);
  const id = useRef(uuid.v4());

  let Container = View;
  let isUserMessage = false;
  const dateString = date && formatAmPm(date);

  switch (type) {
    case "system":
      textStyle.color = colors.light_orange;
      bubbleStyle.alignItems = "center";
      bubbleStyle.marginTop = 10;
      break;

    case "error":
      textStyle.color = colors.chinese_red;
      bubbleStyle.alignItems = "center";
      bubbleStyle.marginTop = 10;
      break;
    case "myMessage":
      wrapperStyle.justifyContent = "flex-end";
      bubbleStyle.backgroundColor = colors.light_orange;
      bubbleStyle.alignItems = "flex-end";
      bubbleStyle.maxWidth = "90%";
      bubbleStyle.marginTop = 10;
      Container = TouchableWithoutFeedback;
      isUserMessage = true;
      break;
    case "theirMessage":
      wrapperStyle.justifyContent = "flex-start";
      bubbleStyle.alignItems = "flex-start";
      bubbleStyle.maxWidth = "90%";
      bubbleStyle.marginTop = 10;
      Container = TouchableWithoutFeedback;
      isUserMessage = true;
      break;
    case "reply":
      wrapperStyle.justifyContent = "flex-start";
      bubbleStyle.backgroundColor = colors.pink_1;
      bubbleStyle.alignItems = "flext-start";

      bubbleStyle.marginTop = 10;
      bubbleStyle.marginBottom = 10;

      Container = TouchableWithoutFeedback;
      isUserMessage = true;
      break;

    default:
      break;
  }

  const copyToClipboard = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
    } catch (error) {
      console.log(error);
    }
  };

  const isStarred = isUserMessage && starredMessages[messageId] !== undefined;
  const replyingToUser = replyingTo && storedUsers[replyingTo.sentBy];

  return (
    <View style={wrapperStyle}>
      <Container
        onLongPress={() =>
          menuRef.current.props.ctx.menuActions.openMenu(id.current)
        }
        style={{ width: "auto" }}
      >
        <View style={bubbleStyle}>
          {name && <Text style={styles.name}>{name}</Text>}

          {replyingToUser && (
            <Bubble
              type="reply"
              text={replyingTo.text}
              name={`${replyingToUser.fullName}`}
            />
          )}
          {
            imageUrl &&
            <Image 
            source={{uri: imageUrl}}
            style={styles.image}
            />
          }
           <Text style={textStyle}>{text}</Text>

          {dateString && isUserMessage && (
            <View style={styles.timeContainer}>
              {isStarred && (
                <Ionicons
                  name="star"
                  size={16}
                  color={colors.chinese_red}
                  style={{ marginHorizontal: 5 }}
                />
              )}
              <Text
                style={type === "myMessage" ? styles.myTime : styles.theirTime}
              >
                {dateString}
              </Text>
            </View>
          )}

          <Menu name={id.current} ref={menuRef}>
            <MenuTrigger />
            <MenuOptions style={{ backgroundColor: colors.pink_white }}>
              <MenuItem
                text="Copy"
                icon={"copy-outline"}
                onSelect={() => copyToClipboard(text)}
              />
              <MenuItem
                text={`${isStarred ? "Unstar" : "Star"}`}
                icon={isStarred ? "star" : "star-outline"}
                iconPack={Ionicons}
                color={isStarred ? colors.chinese_red : colors.chinese_black}
                onSelect={() => starMessage(messageId, chatId, userId)}
              />
              <MenuItem
                text="Reply"
                icon={"arrow-redo-outline"}
                iconPack={Ionicons}
                color={colors.chinese_black}
                onSelect={setReply}
              />
            </MenuOptions>
          </Menu>
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    backgroundColor: colors.pink_white,
    borderRadius: 10,
    padding: 5,
    marginBottom: 0,
    borderColor: colors.pink_1,
    borderWidth: 1,
  },
  text: {
    fontFamily: "Poppins_regular",
    letterSpacing: 0.3,
    fontSize: 16,
    marginHorizontal: 5,
  },
  menuItemContainer: {
    flexDirection: "row",
    padding: 5,
  },
  menuText: {
    flex: 1,
    fontFamily: "Poppins_regular",
    letterSpacing: 0.3,
    fontSize: 14,
  },
  timeContainer: {
    flexDirection: "row",
    paddingRight: 5,
    justifyContent: "flex-end",
  },
  theirTime: {
    fontFamily: "Poppins_regular",
    letterSpacing: 0.3,
    color: colors.chinese_grey,
    fontSize: 12,
    marginHorizontal: 5,
    marginVertical: 1,
  },
  myTime: {
    fontFamily: "Poppins_regular",
    letterSpacing: 0.3,
    color: colors.pink_white,
    fontSize: 12,
    marginHorizontal: 5,
    marginVertical: 1,
  },
  name: {
    fontFamily: "Poppins_semibold",
    letterSpacing: 0.3,
    marginLeft: 5,

  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 5,
  }
});

export default Bubble;
