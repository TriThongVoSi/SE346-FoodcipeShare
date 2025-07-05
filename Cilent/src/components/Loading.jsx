import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'

export default function Loading({size = 'large', color = theme.colors.primary}) {
    return (
        <View className='justify-center items-center'>
            <ActivityIndicator size={size} color={color} />
        </View>
    )
}