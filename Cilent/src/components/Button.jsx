import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'
import Loading from './Loading'

export default function Button({ button, text, title, press, loading = false, shadow }) {
  const shadowStyle = {
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  }

  if (loading) {
    return (
      <View style={[style.button, button, { backgroundColor: 'white' }]}>
        <Loading />
      </View>
    )
  }

  return (
    <Pressable onPress={press} style={[style.button, button, shadow && shadowStyle]} >
      <Text style={[style.text, text]}>{title}</Text>
    </Pressable>
  )
}

const style = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    height: hp(6.6),
    justifyContent: 'center',
    borderCurve: 'continuous',
    borderRadius: theme.radius.xl
  },
  text: {
    fontSize: hp(2.5),
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})