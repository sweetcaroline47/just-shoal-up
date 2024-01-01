import {
  validateEmail,
  validateString,
  validatePassword,
  validateSelection,
} from "../validationConstraints";

export const validateInput = (inputId, inputValue) => {
  if (inputId === "fullName") {
    return validateString(inputId, inputValue);
  } else if (inputId === "email") {
    return validateEmail(inputId, inputValue);
  } else if (inputId === "password") {
    return validatePassword(inputId, inputValue);
  } else if (
    inputId === "age" ||
    inputId === "currentLevel" ||
    inputId === "idealLevel" ||
    inputId === "type"
  ) {
    return validateSelection(inputId, inputValue);
  } else if (
    inputId === "chatName"
  ) {
    return validateString(inputId, inputValue);
  }
};
