import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../../constants/colors';

const Bubble = props => {
    const { text, type } = props;

    const bubbleStyle = {...styles.container};
    const textStyle = {...styles.text};

    switch (type){
        case "system":
            textStyle.color = colors.chinese_black;
            bubbleStyle.backgroundColor = colors.pink_white;
            bubbleStyle.alignItems = "center";
            bubbleStyle.marginTop = 10;
            break;
            default:
                break;
    }

    return (
        <View style={styles.wrapperStyle}>
            <View style={bubbleStyle}>
                <Text style={textStyle}>
                    {text}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapperStyle: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    container:{
        backgroundColor: colors.pink_white,
        borderRadius: 10,
        padding: 5,
        marginBottom: 10,
        borderColor: colors.pink_2,
        borderWidth: 1,
        
    },
    text: {
        fontFamily: 'Poppins_regular',
        letterSpacing: 0.3
    }
})

export default Bubble;