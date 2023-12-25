import { View, StyleSheet } from "react-native"
import colors from "../../constants/colors";

const PageContainer = props => {
    return <View style={{...styles.container, ...props.style, }}>
        {props.children}
    </View>
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.pink_1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
});

export default PageContainer;