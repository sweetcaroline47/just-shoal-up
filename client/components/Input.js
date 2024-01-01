import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import colors from "../../constants/colors";
import { useState, useEffect, useCallback } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { Ionicons } from '@expo/vector-icons';

const Input = (props) => {
  
  // Add initial value
  const [value, setValue] = useState(props.initialValue);
  
  const onChangeText = (text) => {
    setValue(text);
    props.onInputChanged(props.id, text);
  };

  // CY EDIT: Add a handler for dropdown value changes
  const [selected, setSelected] = useState(props.initialValue);
  const data = props.selections;

  const onChangeSelection = (text) => {
    setSelected(text);
    props.onInputChanged(props.id, text);
  }

  // CY EDIT: Add password protection
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState); // Toggle password visibility state
  };
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to track password visibility
  const isPasswordInput = props.secureTextEntry;

  return (
    <View style={{ ...styles.container, ...props.style }}>
      <Text style={styles.inputLabel}>{props.label}</Text>

      {!props.isDropDown && (
        <View style={styles.inputContainer}>
          {props.icon && (
            <props.iconPack name={props.icon} size={24} style={styles.icon} />
          )}
          <TextInput
            {...props}
            style={styles.textInput}
            inputMode={props.inputMode}
            placeholder={props.placeholder}
            onChangeText={onChangeText}
            secureTextEntry={isPasswordInput ? !isPasswordVisible : false} // Toggle secureTextEntry based on visibility state
            value={value}
          />

          {isPasswordInput && ( // Show toggle icon only if secureTextEntry is true
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <props.iconPack
                name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={24}
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      {props.isDropDown && (
        <View style={{ flexDirection: "column" }}>
          {props.icon && (
            <props.iconPack name={props.icon} size={24} style={styles.icon} />
          )}
          <SelectList
            onSelect={() => onChangeSelection(selected)}
            setSelected={(val) => setSelected(val)}
            data={data}
            save="value"
            placeholder={props.placeholder}
            boxStyles={{
              width: "auto",
              borderColor: colors.pink_white,
              backgroundColor: colors.pink_white,
            }}
            inputStyles={{
              fontFamily: "Poppins_regular",
              fontSize: 16,
              color: colors.chinese_black,
            }}
            dropdownStyles={{
              backgroundColor: colors.pink_white,
              borderColor: colors.orange,
            }}
            dropdownItemStyles={{ fontFamily: "Poppins_regular", fontSize: 16 }}
            arrowicon={
              <Ionicons name="chevron-down-outline" size={24} color={colors.chinese_grey} />
            }
            searchicon={<Ionicons name="search-outline" size={24} color={colors.chinese_grey} />}
          />
        </View>
      )}

      {props.errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText[0]}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputLabel: {
    fontFamily: "Poppins_semibold",
    fontSize: 18,
    color: colors.orange,
    marginVertical: 8,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: "row",
    width: "auto",
    backgroundColor: colors.pink_white,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  icon: {
    color: colors.orange,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontFamily: "Poppins_regular",
    marginLeft: 10,
    fontSize: 16,
    color: colors.chinese_black,
    letterSpacing: 0.3,
  },

  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: colors.chinese_red,
    fontSize: 12,
    fontFamily: "Poppins_italic",
  },
});

export default Input;
