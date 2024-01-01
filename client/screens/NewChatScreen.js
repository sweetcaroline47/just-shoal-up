import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ActivityIndicator,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import colors from "../../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import PageContainer from "../components/PageContainer.js";
import { Ionicons } from "@expo/vector-icons";
import { searchUsers } from "../utils/actions/userActions.js";
import DataItem from "../components/DataItem.js";
import { useDispatch, useSelector } from "react-redux";
import { setStoredUsers } from "../store/userSlice.js";
import ProfileImage from "../components/ProfileImage.js";

const NewChatScreen = (props) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState();
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const selectedUsersFlatList = useRef();

  // add new users to a group chat
  const chatId = props.route.params && props.route.params.chatId;
  const existingUsers = props.route.params && props.route.params.existingUsers;

  const isGroupChat = props.route.params && props.route.params.isGroupChat;
  const isGroupChatDisabled = selectedUsers.length === 0 || ( isNewChat && chatName === "");

  const isNewChat = !chatId;

  useEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="Close"
              onPress={() => {
                props.navigation.goBack();
              }}
            />
          </HeaderButtons>
        );
      },

      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            {isGroupChat && (
              <Item
                title={isNewChat ? "Create" : "Add"}
                disabled={isGroupChatDisabled}
                color={isGroupChatDisabled ? colors.chinese_grey : undefined}
                onPress={() => {
                  const screenName = isNewChat ? "ChatList" : "Group Contact";

                  props.navigation.navigate(screenName, {
                    selectedUsers: selectedUsers,
                    chatName: chatName,
                    chatId,
                  });
                }}
              />
            )}
          </HeaderButtons>
        );
      },
      headerTitle: isGroupChat ? "Add Participants" : "New Chat",
    });
  }, [chatName, selectedUsers]);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchTerm || searchTerm === "") {
        setUsers();
        setNoResultsFound(false);
        return;
      }
      setIsLoading(true);

      // search users
      const userResult = await searchUsers(searchTerm);
      delete userResult[userData.userId];
      setUsers(userResult);
      if (Object.keys(userResult).length === 0) {
        setNoResultsFound(true);
      } else {
        setNoResultsFound(false);
        dispatch(setStoredUsers({ newUsers: userResult }));
      }

      setIsLoading(false);
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  // press to go to the chat list and find this user in the chat
  const userPressed = (userId) => {
    if (isGroupChat) {
      const newSelectedUsers = selectedUsers.includes(userId)
        ? selectedUsers.filter((id) => id !== userId)
        : selectedUsers.concat(userId);
      setSelectedUsers(newSelectedUsers);
    } else {
      props.navigation.navigate("ChatList", { selectedUserId: userId });
    }
  };

  return (
    <PageContainer>
      {isNewChat && isGroupChat && (
        <View style={styles.chatNameContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textbox}
              placeholder="Enter a group name"
              autoCorrect={false}
              inputMode="text"
              value={chatName}
              onChangeText={(text) => setChatName(text)}
            />
          </View>
        </View>
      )}
      {isGroupChat && (
        <View style={styles.selectedUsersContainer}>
          <FlatList
            style={styles.selectedUsersList}
            data={selectedUsers}
            horizontal={true}
            keyExtractor={(item) => item} // which property to use as the key
            contentContainerStyle={{ alignItems: "center" }}
            ref={(ref) => (selectedUsersFlatList.current = ref)}
            onContentSizeChange={() =>
              selectedUsersFlatList.current.scrollToEnd()
            }
            renderItem={(itemData) => {
              const userId = itemData.item;
              const userData = storedUsers[userId];
              return (
                <ProfileImage
                  size={40}
                  uri={userData.profilePicture}
                  onPress={() => userPressed(userId)}
                  showRemoveButton={true}
                  style={styles.selectedUserStyle}
                />
              );
            }}
          />
        </View>
      )}

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color={colors.orange} />
        <TextInput
          placeholder="Search names"
          inputMode="search"
          style={styles.searchBox}
          onChangeText={(text) => setSearchTerm(text)}
        />
      </View>

      {!isLoading && !users && (
        <View
          style={{
            flex: 1,
            // CY EDIT: justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="people-sharp"
            size={60}
            color={colors.pink_white}
            style={styles.noResultsIcon}
          />
          <Text style={styles.noResultsText}>Search for a member</Text>
        </View>
      )}
      {!isLoading && noResultsFound && (
        <View
          style={{
            flex: 1,
            // CY EDIT: justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="sad-outline"
            size={60}
            color={colors.pink_white}
            style={styles.noResultsIcon}
          />
          <Text style={styles.noResultsText}>No users found</Text>
        </View>
      )}
      {isLoading && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={colors.pink_white} />
        </View>
      )}
      {!isLoading && !noResultsFound && users && (
        <FlatList
          data={Object.keys(users)}
          renderItem={(itemData) => {
            const userId = itemData.item;
            const userData = users[userId];

            if (existingUsers && existingUsers.includes(userId)) {
              return;
            }

            return (
              <DataItem
                title={`${userData.fullName}`}
                subtitle={`${userData.type}`}
                image={userData.profilePicture}
                onPress={() => userPressed(userId)}
                type={isGroupChat ? "checkbox" : ""}
                isChecked={selectedUsers.includes(userId)}
              />
            );
          }}
        />
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    backgroundColor: colors.pink_white,
    justifyContent: "flex-start",
    alignItems: "center",
    height: 40,
    marginVertical: 12,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },
  searchBox: {
    marginLeft: 8,
    fontSize: 16,
    width: "auto",
    fontFamily: "Poppins_regular",
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsIcon: {
    marginBottom: 10,
  },
  noResultsText: {
    color: colors.orange,
    fontFamily: "Poppins_semibolditalic",
    letterSpacing: 0.3,
    fontSize: 18,
  },
  chatNameContainer: {
    paddingTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: colors.pink_white,
    justifyContent: "flex-start",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
  },
  textbox: {
    marginLeft: 8,
    fontSize: 16,
    width: "auto",
    fontFamily: "Poppins_regular",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedUsersContainer: {
    height: 50,
    justifyContent: "center",
  },
  selectedUsersList: {
    height: "100%",
    paddingTop: 10,
  },
  selectedUserStyle: {
    marginRight: 10,
  },
});

export default NewChatScreen;
