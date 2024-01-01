import React, { useCallback, useEffect, useReducer, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Input from "./Input";
import { Ionicons } from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducder";
import { signIn } from "../utils/actions/authActions";

import colors from "../../constants/colors";

const initialState = {
  inputValues: {
    email: "",
    password: "",
  },

  inputValidation: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

const LogIn = (props) => {
  const dispatch = useDispatch();
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

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);

      const action = signIn(
        formState.inputValues.email,
        formState.inputValues.password
      );
      setError(null);
      await dispatch(action);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  }, [dispatch, formState]);
  
  return (
    <>
      <Input
        label="Email"
        iconPack={Ionicons}
        icon="mail-outline"
        placeholder="Enter email"
        inputMode="email"
        id="email"
        onInputChanged={inputChangeHandler}
        errorText={formState.inputValidation["email"]}
        initialValue={formState.inputValues.email}
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
        initialValue={formState.inputValues.password}
      />

      {isLoading ? (
        <ActivityIndicator
          size={"small"}
          color={colors.pink_white}
          style={{ marginTop: 10 }}
        />
      ) : (
        <SubmitButton
          title="Log in"
          onPress={authHandler}
          style={{ marginTop: 40 }}
          disabled={!formState.formIsValid}
        />
      )}
    </>
  );
};

export default LogIn;
