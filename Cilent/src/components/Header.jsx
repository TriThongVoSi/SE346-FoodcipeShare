import React from 'react'
import Icon from '../assets/icons'
import { StyleSheet, Text, View, Pressable } from 'react-native'
import { hp } from '../helpers/common'
import { theme } from '../constants/theme'

const Header = ({ title, showBackButton = false, mb = 10, navigation }) => {
    return (
        <View style={[styles.container, { marginBottom: mb }]}>
            {
                showBackButton && (
                    <View style={styles.backButtonContainer}>
                        <Pressable onPress={() => navigation.goBack()} style={[styles.backButton, { borderRadius: theme.radius.sm, backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                            <Icon name='arrowLeft' strokeWidth={2.5} size={22} color={theme.colors.text} />
                        </Pressable>
                    </View>
                )
            }
            <Text style={styles.title}>{title || ""}</Text>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        gap: 10
    },
    title: {
        fontSize: hp(2.7),
        fontWeight: theme.fonts.semibold,
        color: theme.colors.textDark
    },
    backButtonContainer: {
        position: 'absolute',
        left: 0,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginLeft: 24,
        padding: 16,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
})