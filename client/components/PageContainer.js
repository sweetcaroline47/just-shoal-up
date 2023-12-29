import { View, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import { ScrollView } from "react-native-gesture-handler";

const PageContainer = (props) => {
  return  <View style={{ ...styles.container, ...props.style }}>
      {props.children}
    </View>
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pink_1,
    paddingHorizontal: 20,
  },
});

export default PageContainer;
