import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import colors from "../../constants/colors";

const SubmitButton = props => {

    const enabledBackgroundColor = props.isLogOut || props.isRemove ? colors.chinese_red : colors.orange;
    const disabledBackgroundColor = colors.chinese_grey;
    const backgroundColor = props.disabled ? disabledBackgroundColor : enabledBackgroundColor;

    return <TouchableOpacity 
        onPress={props.disabled ? ()=> {}: props.onPress }
        style={{
            ...styles.buttonContainer, 
            ...props.style,
            ...{backgroundColor: backgroundColor},}}>
        <Text style={styles.buttonText}>
            {props.title}
        </Text>
    </TouchableOpacity>
};

const styles = StyleSheet.create({
    buttonContainer: {
        paddingHorizontal: 120,
        paddingVertical: 5,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontFamily: "Poppins_semibold",
        color: colors.pink_white,
        fontSize: 20,
        marginVertical: 5,
    },
});

export default SubmitButton;