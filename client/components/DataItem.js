import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import ProfileImage from "../components/ProfileImage";
import colors from "../../constants/colors";

const DataItem = (props) => {
  const { title, subtitle, image } = props;
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={styles.container}>
        <ProfileImage uri={image} size={40} />
        <View style={styles.textContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>

          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
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
    marginLeft: 14,
  },
  title: {
    fontFamily: "Poppins_regular",

    fontSize: 16,
    color: colors.chinese_black,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontFamily: "Poppins_italic",

    color: colors.orange,
    letterSpacing: 0.3,
  },
});

export default DataItem;
