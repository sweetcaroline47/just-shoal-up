import React, { useCallback, useReducer } from "react";
import Input from "./Input";
import { Ionicons } from "@expo/vector-icons";
import SubmitButton from "./SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducder";
import { signIn } from "../utils/actions/authActions";

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
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangeHandler = useCallback((inputId, inputValue) => {
    const result = validateInput(inputId, inputValue);
    dispatchFormState({ inputId, inputValue, validationResult: result, })
  }, [dispatchFormState]);

  const authHandler = () => {
    signIn(
      formState.inputValues.fullName,
      formState.inputValues.email,
      formState.inputValues.password,
    )
  };

  return (
    <>
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
      <SubmitButton
        title="Log in"
        onPress={authHandler}
        style={{ marginTop: 40 }}
        disabled={!formState.formIsValid}
      />
    </>
  );
};

export default LogIn;
