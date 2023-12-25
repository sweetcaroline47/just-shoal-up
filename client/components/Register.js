import React, { useCallback, useEffect, useReducer, useState } from "react";
import Input from "./Input";
import { Ionicons } from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducder";
import { signUp } from "../utils/actions/authActions";
import { ActivityIndicator, Alert } from "react-native";
import colors from "../../constants/colors";

const initialState = {
  inputValues: {
    fullName: "",
    email: "",
    password: "",
  },

  inputValidation: {
    fullName: false,
    email: false,
    password: false,
  },
  formIsValid: false,
};

const Register = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangeHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, inputValue, validationResult: result });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = async () => {
    try {
      setIsLoading(true);
      await signUp(
        formState.inputValues.fullName,
        formState.inputValues.email,
        formState.inputValues.password,
      );
      setError(null);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Input
        label="Name"
        iconPack={Ionicons}
        icon="person-outline"
        placeholder="Enter full name"
        id="fullName"
        onInputChanged={inputChangeHandler}
        errorText={formState.inputValidation["fullName"]}
      />
      <Input
        label="Email"
        iconPack={Ionicons}
        icon="mail-outline"
        placeholder="Enter email"
        id="email"
        onInputChanged={inputChangeHandler}
        errorText={formState.inputValidation["email"]}
      />
      <Input
        label="Password"
        iconPack={Ionicons}
        icon="lock-closed-outline"
        placeholder="Enter password"
        secureTextEntry={true}
        id="password"
        onInputChanged={inputChangeHandler}
        errorText={formState.inputValidation["password"]}
      />
      {isLoading ? (
        <ActivityIndicator
          size={"small"}
          color={colors.pink_white}
          style={{ marginTop: 10 }}
        />
      ) : (
        <SubmitButton
          title="Register"
          onPress={authHandler}
          style={{ marginTop: 40 }}
          disabled={!formState.formIsValid}
        />
      )}
    </>
  );
};

export default Register;
