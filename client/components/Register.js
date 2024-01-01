import React, { useCallback, useEffect, useReducer, useState } from "react";
import Input from "./Input";
import { Ionicons } from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducder";
import { signUp } from "../utils/actions/authActions";
import { ActivityIndicator, Alert } from "react-native";
import colors from "../../constants/colors";
import { useDispatch, useSelector } from "react-redux";

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

  const authHandler = useCallback( async () => {
    try {
      setIsLoading(true);

      const action = signUp(
        formState.inputValues.fullName,
        formState.inputValues.email,
        formState.inputValues.password,
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
        label="Name"
        iconPack={Ionicons}
        icon="person-outline"
        placeholder="Enter full name"
        inputMode="text"
        id="fullName"
        onInputChanged={inputChangeHandler}
        errorText={formState.inputValidation["fullName"]}
      />
      <Input
        label="Email"
        iconPack={Ionicons}
        icon="mail-outline"
        placeholder="Enter email"
        inputMode="email"
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
