import { validateEmail, validateString, validatePassword } from "../validationConstraints";

export const validateInput = (inputId, inputValue) => {
  if (inputId === "fullName") {
    return (validateString(inputId, inputValue));
  } else if (inputId === "email") {
    return (validateEmail(inputId, inputValue));
  } else if (inputId === "password") {
    return (validatePassword(inputId, inputValue));
  }
};
