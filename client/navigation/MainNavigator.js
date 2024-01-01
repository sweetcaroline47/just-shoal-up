import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  Image,
} from "react-native";
import colors from "../../constants/colors";

// import navigation
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import icons
import { Ionicons } from "@expo/vector-icons";
import shoalIcon from "../assets/images/icon-noBackground.png";

// import screens
import ChatListScreen from "../screens/ChatListScreen";
import ChatSettingsScreen from "../screens/ChatSettingsScreen";
import ChatScreen from "../screens/ChatScreen";
import NewChatScreen from "../screens/NewChatScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { child, get, getDatabase, off, onValue, ref } from "firebase/database";
import { setChatsData } from "../store/chatSlice";
import { setStoredUsers } from "../store/userSlice";
import { setChatMessages, setStarredMessages } from "../store/messagesSlice";
import ContactScreen from "../screens/ContactScreen";
import GroupContactScreen from "../screens/GroupContactScreen";

// stack
const Stack = createNativeStackNavigator();
// bottom navigator
const Tab = createBottomTabNavigator();

// Tab Navigator
// customize headerTitle style
const CustomHeaderTitle = () => {
  return <Image source={shoalIcon} style={{ height: 80, width: 80 }} />;
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: (props) => <CustomHeaderTitle {...props} />,
        headerTitle: (props) => <CustomHeaderTitle {...props} />,
        headerStyle: { backgroundColor: colors.pink_2 },
        headerShadowVisible: false,
        tabBarLabelStyle: { fontSize: 14, color: "#F75820" },
        tabBarStyle: { backgroundColor: colors.pink_2 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "ChatList") {
            iconName = focused
              ? "chatbox-ellipses"
              : "chatbox-ellipses-outline";
          } else if (route.name === "ChatSettings") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }
          return <Ionicons name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.pink_white,
        tabBarLabelStyle: {
          fontFamily: "Poppins_semibold",
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{ color: focused ? colors.orange : colors.pink_white }}
            >
              Chat
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="ChatSettings"
        component={ChatSettingsScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{ color: focused ? colors.orange : colors.pink_white }}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Chat List"
          component={TabNavigator}
          options={{
            headerShown: false,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="Chat Screen"
          component={ChatScreen}
          options={{
            headerTitle: "",
            headerShadowVisible: false,
            headerBackTitle: "Back",
            headerStyle: { backgroundColor: colors.pink_2 },
          }}
        />
        <Stack.Screen
          name="Group Contact"
          component={GroupContactScreen}
          options={{
            headerTitle: "",
            headerShadowVisible: false,
            headerBackTitle: "Back",
            headerStyle: { backgroundColor: colors.pink_2 },
          }}
        />
        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={{
            headerTitle: "Contact Info",
            headerShadowVisible: false,
            headerBackTitle: "Back",
            headerStyle: { backgroundColor: colors.pink_2 },
          }}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="New Chat" component={NewChatScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const MainNavigator = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);

  useEffect(() => {
    console.log("Subscribing to firebase listener");
    const dbRef = ref(getDatabase());
    const userChatsRef = child(dbRef, `userChats/${userData.userId}`);
    const refs = [userChatsRef];

    onValue(userChatsRef, (querySnapshot) => {
      const chatIdsData = querySnapshot.val() || {};
      const chatIds = Object.values(chatIdsData);

      const chatsData = {};
      let chatsFoundCount = 0;

      for (let i = 0; i < chatIds.length; i++) {
        const chatId = chatIds[i];
        const chatRef = child(dbRef, `chats/${chatId}`);
        refs.push(chatRef);

        onValue(chatRef, (chatSnapshot) => {
          chatsFoundCount++;
          const data = chatSnapshot.val();
          if (data) {
            data.key = chatSnapshot.key;
            data.users.forEach((userId) => {
              if (storedUsers[userId]) return;
              const userRef = child(dbRef, `users/${userId}`);

              get(userRef).then((userSnapshot) => {
                const userSnapshotData = userSnapshot.val();
                dispatch(setStoredUsers({ newUsers: { userSnapshotData } }));
              });

              refs.push(userRef);
            });
            chatsData[chatSnapshot.key] = data;
          }
          if (chatsFoundCount >= chatIds.length) {
            dispatch(setChatsData({ chatsData }));
            setIsLoading(false);
          }
        });

        // show the sent message
        const messagesRef = child(dbRef, `messages/${chatId}`);
        refs.push(messagesRef);
        onValue(messagesRef, (messagesSnapshot) => {
          const messagesData = messagesSnapshot.val();
          dispatch(setChatMessages({ chatId, messagesData }));
        });
        if (chatsFoundCount == 0) {
          setIsLoading(false);
        }
      }
    });

    // set state for starred messages
    const userStarredMessagesRef = child(
      dbRef,
      `userStarredMessages/${userData.userId}`
    );
    refs.push(userStarredMessagesRef);
    onValue(userStarredMessagesRef, (querySnapshot) => {
      const starredMessages = querySnapshot.val() ?? {};
      dispatch(setStarredMessages({ starredMessages }));
    });

    return () => {
      console.log("Unsubscribing to firebase listener");
      refs.forEach((ref) => off(ref));
    };
  }, []);

  if (isLoading) {
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={"large"} color={colors.pink_white} />
    </View>;
  }
  return <StackNavigator />;
};

export default MainNavigator;
