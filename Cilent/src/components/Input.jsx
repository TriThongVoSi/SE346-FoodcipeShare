import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import { hp } from '../helpers/common'
import { theme } from '../constants/theme'

const Input = ({ isSearch = false, ...props }) => {
    return (
        <View style={[styles.container, props.containerStyle && props.containerStyle]}>
            {props.icon && props.icon}
            <TextInput
                style={isSearch ? { width: '100%' } : { flex: 1 }}
                placeholderTextColor={theme.colors.textLight}
                ref={props.inputRef && props.inputRef}
                {...props}
            />
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: hp(7.2),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.9,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        paddingHorizontal: 18,
        gap: 12
    }
})