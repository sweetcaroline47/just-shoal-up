import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';

const ReplyTo = props => {
    const { text, user, onCancel } = props;
    const name = `${user.fullName}`;

    return <View style={styles.container}>
        <View style={styles.textContainer}>

            <Text numberOfLines={1} style={styles.name}>{name}</Text>
            <Text numberOfLines={1}>{text}</Text>
        </View>

        <TouchableOpacity onPress={onCancel}>
        <Ionicons name="close-circle-outline" size={24} color={colors.chinese_black} />
        </TouchableOpacity>

    </View>
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: colors.pink_white,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftColor: colors.pink_1,
        borderLeftWidth: 4
    },
    textContainer: {
        flex: 1,
        marginRight: 5
    },
    name: {
        color: colors.orange,
        fontFamily: 'Poppins_semibold',
        letterSpacing: 0.3,
        fontSize: 14,
    }
});

export default ReplyTo;