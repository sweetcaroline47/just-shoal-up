export const reducer = (state, action) => {
  const { inputId, inputValue, validationResult, } = action;
  
  const updatedValues = {
    ...state.inputValues,
    [inputId]: inputValue,
  };
  
  const updatedValidation = {
    ...state.inputValidation,
    [inputId]: validationResult,
  };

  let updatedFormIsValid = true;
  for (const key in updatedValidation) {
    if (updatedValidation[key] !== undefined) {
      updatedFormIsValid = false;
      break;
    }
  }

  return {
    inputValues: updatedValues,
    inputValidation: updatedValidation,
    formIsValid: updatedFormIsValid,
  };
};
