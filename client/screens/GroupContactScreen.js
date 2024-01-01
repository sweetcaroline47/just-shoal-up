import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";
import ProfileImage from "../components/ProfileImage";
import Input from "../components/Input";
import { useCallback, useReducer, useState } from "react";
import { reducer } from "../utils/reducers/formReducder";
import { validateString } from "../utils/validationConstraints";
import { updateChatData } from "../utils/actions/chatActions";
import SubmitButton from "../components/SubmitButton";
import colors from "../../constants/colors";
import DataItem from "../components/DataItem";

const GroupContactScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const chatId = props.route.params.chatId;
  const chatData = useSelector((state) => state.chats.chatsData[chatId]);
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const initialState = {
    inputValues: {
      chatName: chatData.chatName,
    },

    inputValidation: {
      chatName: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangeHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateString(inputId, inputValue);
      dispatchFormState({ inputId, inputValue, validationResult: result });
    },
    [dispatchFormState]
  );

  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;
    try {
      setIsLoading(true);
      await updateChatData(chatId, userData.userId, updatedValues);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [formState]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;
    return currentValues.chatName != chatData.chatName;
  };

  return (
    <PageContainer>
      <PageTitle text="Group Contact" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ProfileImage
          showEditButton={true}
          size={80}
          chatId={chatId}
          userId={userData.userId}
          uri={chatData.chatImage}
        />
        <Input
          id="chatName"
          label="Chat Name"
          initialValue={chatData.chatName}
          allowEmpty={false}
          onInputChanged={inputChangeHandler}
          errorText={formState.inputValidation["chatName"]}
        />

        <View style={styles.sectionContainer}>
          <Text style={styles.heading}>
            {chatData.users.length + " "}
            Participants
          </Text>
          <DataItem title="Add Users" icon="add" type="button" />

          {chatData.users.map((uid) => {
            const currentUser = storedUsers[uid];
            return (
              <DataItem
                key={uid}
                image={currentUser.profilePicture}
                title={`${currentUser.fullName}`}
                subtitle={currentUser.type}
                type={uid !== userData.userId && "link"}
                onPress={() =>
                  uid !== userData.userId &&
                  props.navigation.navigate("Contact", { uid, chatId })
                }
              />
            );
          })}
        </View>

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
          <ActivityIndicator size={"small"} color={colors.orange} />
        ) : (
          hasChanges() && (
            <SubmitButton
              title="Save"
              style={{ marginTop: 20 }}
              color={colors.orange}
              onPress={saveHandler}
              disabled={!formState.formIsValid}
            />
          )
        )}
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    justifyContent: "center",
    alignItems: "center",
  },
  sectionContainer: {
    width: "100%",
    marginTop: 10,
  },
  heading: {
    marginVertical: 8,
    fontSize: 18,
    color: colors.orange,
    fontFamily: "Poppins_semibold",
    letterSpacing: 0.3,
  },
});

export default GroupContactScreen;
