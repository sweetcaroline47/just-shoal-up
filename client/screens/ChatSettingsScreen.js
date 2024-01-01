import React, { useCallback, useMemo, useReducer, useState } from "react";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import Input from "../components/Input";
import { Ionicons } from "@expo/vector-icons";
import SubmitButton from "../components/SubmitButton";

import colors from "../../constants/colors";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducder";
import {
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSignedInUserData,
  userLogout,
} from "../utils/actions/authActions";
import { updateExistingUserData } from "../store/authSlice";
import ProfileImage from "../components/ProfileImage";
import DataItem from "../components/DataItem";

const ChatSettingsScreen = (props) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const userData = useSelector((state) => state.auth.userData);

  // star messages
  const starredMessages = useSelector(
    (state) => state.messages.starredMessages ?? {}
  );

  const sortedStarredMessages = useMemo(() => {
    let result = [];

    const chats = Object.values(starredMessages);

    chats.forEach((chat) => {
      const chatMessages = Object.values(chat);
      result = result.concat(chatMessages);
    });

    return result;
  }, [starredMessages]);

  const fullName = userData.fullName || "";
  const email = userData.email || "";
  const age = userData.age || "";
  const currentLevel = userData.currentLevel || "";
  const idealLevel = userData.idealLevel || "";
  const type = userData.type || "";

  const initialState = {
    inputValues: {
      fullName,
      email,
      age,
      currentLevel,
      idealLevel,
      type,
    },

    inputValidation: {
      fullName: undefined,
      email: undefined,
      age: undefined,
      currentLevel: undefined,
      idealLevel: undefined,
      type: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangeHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, inputValue, validationResult: result });
    },
    [dispatchFormState]
  );

  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;
    try {
      setIsLoading(true);
      await updateSignedInUserData(userData.userId, updatedValues);
      dispatch(updateExistingUserData({ newData: updatedValues }));
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [formState, dispatch]);
  const hasChanges = () => {
    const currentValues = formState.inputValues;
    return (
      currentValues.fullName != fullName ||
      currentValues.email != email ||
      currentValues.age != age ||
      currentValues.currentLevel != currentLevel ||
      currentValues.idealLevel != idealLevel ||
      currentValues.type != type
    );
  };

  return (
    <PageContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          <PageTitle text="Profile" />
          <ProfileImage
            size={80}
            userId={userData.userId}
            uri={userData.profilePicture}
            showEditButton={true}
          />

          <Input
            label="Name"
            iconPack={Ionicons}
            icon="person-outline"
            placeholder="Enter full name"
            id="fullName"
            onInputChanged={inputChangeHandler}
            errorText={formState.inputValidation["fullName"]}
            initialValue={userData.fullName}
          />
          <Input
            label="Email"
            iconPack={Ionicons}
            icon="mail-outline"
            placeholder="Enter email"
            id="email"
            onInputChanged={inputChangeHandler}
            errorText={formState.inputValidation["email"]}
            initialValue={userData.email}
          />
          <Input
            label="Age"
            placeholder={userData.age !== "" ? userData.age : "Select age"}
            isDropDown={true}
            selections={[
              { key: "Under 22", value: "Under 22" },
              { key: "23-30", value: "23-30" },
              { key: "31-40", value: "31-40" },
              { key: "41-50", value: "41-50" },
              { key: "Over 50", value: "Over 50" },
            ]}
            id="age"
            onInputChanged={inputChangeHandler}
            errorText={formState.inputValidation["age"]}
            initialValue={userData.age}
          />
          <Input
            label="Current level"
            placeholder={
              userData.currentLevel !== ""
                ? userData.currentLevel
                : "Select # of workouts per week"
            }
            isDropDown={true}
            selections={[
              { key: "0-2", value: "0-2" },
              { key: "3-5", value: "3-5" },
              { key: "6-7", value: "6-7" },
            ]}
            id="currentLevel"
            onInputChanged={inputChangeHandler}
            errorText={formState.inputValidation["currentLevel"]}
            initialValue={userData.currentLevel}
          />
          <Input
            label="Ideal level"
            placeholder={
              userData.idealLevel !== ""
                ? userData.idealLevel
                : "Select # of workouts per week"
            }
            isDropDown={true}
            selections={[
              { key: "0-2", value: "0-2" },
              { key: "3-5", value: "3-5" },
              { key: "6-7", value: "6-7" },
            ]}
            id="idealLevel"
            onInputChanged={inputChangeHandler}
            errorText={formState.inputValidation["idealLevel"]}
            initialValue={userData.idealLevel}
          />
          <Input
            label="Type"
            placeholder={
              userData.type !== ""
                ? userData.type
                : "Select preferred workout type "
            }
            isDropDown={true}
            selections={[
              { key: "Gym", value: "Gym" },
              { key: "Home", value: "Home" },
              { key: "Outdoor", value: "Outdoor" },
            ]}
            id="type"
            onInputChanged={inputChangeHandler}
            errorText={formState.inputValidation["type"]}
            initialValue={userData.type}
          />
          <View style={{ marginTop: 20 }}>
            {showSuccessMessage && (
              <Text
                style={{
                  fontFamily: "Poppins_italic",
                  color: colors.chinese_red,
                  fontSize: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                }}
              >
                Saved
              </Text>
            )}
            {isLoading ? (
              <ActivityIndicator
                size={"small"}
                color={colors.pink_white}
                style={{ marginTop: 10 }}
              />
            ) : (
              hasChanges() && (
                <SubmitButton
                  title="Save"
                  onPress={saveHandler}
                  style={{ marginTop: 20 }}
                  disabled={!formState.formIsValid}
                />
              )
            )}
          </View>

          <DataItem
            type={"link"}
            title="Starred messages"
            hideImage={true}
            onPress={() =>
              props.navigation.navigate("DataList", {
                title: "Starred messages",
                data: sortedStarredMessages,
                type: "messages",
              })
            }
          />

          <SubmitButton
            title="Log out"
            onPress={() => dispatch(userLogout())}
            style={{ marginTop: 20 }}
            isLogOut
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    alignItems: "center",
  },
});

export default ChatSettingsScreen;
