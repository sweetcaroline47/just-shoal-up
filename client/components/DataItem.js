import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import ProfileImage from "../components/ProfileImage";
import colors from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const imageSize = 40;

const DataItem = (props) => {
  const { title, subtitle, image, type, isChecked, icon } = props;
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.container}>
        {!icon && <ProfileImage uri={image} size={imageSize} />}
        {icon && (
          <View style={styles.leftIconContainer}>
            <Ionicons name={icon} size={24} color={colors.chinese_red} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={{...styles.title, ...{color: type === "button" ? colors.chinese_red : colors.chinese_black}}}>
            {title}
          </Text>

          {subtitle && (
            <Text numberOfLines={1} style={styles.subtitle}>
              {subtitle}
            </Text>
          )}
        </View>
        {type === "checkbox" && (
          <View style={styles.iconContainer}>
            <Ionicons
              name={isChecked ? "checkbox" : "square"}
              size={24}
              color={isChecked ? colors.orange : colors.pink_white}
            />
          </View>
        )}
        {type === "link" && (
          <View>
            <Ionicons
              name="chevron-forward-outline"
              size={18}
              color={colors.orange}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 7,
    borderBlockColor: colors.pink_white,
    borderBottomWidth: 1,
    alignItems: "center",
    minHeight: 50,
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontFamily: "Poppins_semibold",
    fontSize: 16,
    color: colors.chinese_black,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontFamily: "Poppins_light",
    color: colors.chinese_black,
    letterSpacing: 0.3,
  },
  leftIconContainer: {
    backgroundColor: colors.pink_white,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: imageSize,
    height: imageSize,
  },
});

export default DataItem;
