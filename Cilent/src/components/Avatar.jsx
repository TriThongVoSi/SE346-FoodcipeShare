import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { hp } from '../helpers/common'
import { theme } from '../constants/theme'
import { Image } from 'expo-image'

const Avatar = ({ uri, size = hp(4.5), rounded = theme.radius.md, styles = {} }) => {
  return (
    <View>
      <Image
        source={uri}
        transition={100}
        style={[styles.avatar, { height: size, width: size, borderRadius: rounded }, styles]}
      />
    </View>
  )
}

export default Avatar

const styles = StyleSheet.create({
  avatar: {
    borderCurve: 'continuous',
    borderColor: theme.colors.darkLight,
    borderWidth: 1
  }
})