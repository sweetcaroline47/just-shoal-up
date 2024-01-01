import { View, Text, StyleSheet } from "react-native"
import colors from "../../constants/colors";

export default PageTitle = (props) => {
    return <View style={styles.container}>
        <Text style={styles.text}>
            {props.text}
        </Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 26,
        color: colors.chinese_black,
        fontFamily: "Poppins_semibold",
        letterSpacing: 0.3,
    },
});