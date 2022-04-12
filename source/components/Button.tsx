//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import {
  Pressable, GestureResponderEvent, StyleProp,
  ViewStyle, StyleSheet, View, Text
} from 'react-native'
import { DefaultPressableRipple } from 'components/Theme'

interface ButtonProps {
  label: string
  style?: StyleProp<ViewStyle>
  onPress?: (event: GestureResponderEvent) => void
}

export const Button = (p: ButtonProps): React.ReactElement => {

  return (
    <View style={[styles.buttonContainer, p.style]}>
      <Pressable style={styles.button} onPress={p.onPress} android_ripple={DefaultPressableRipple}>
        <Text style={styles.buttonLabel}>{p.label}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    overflow: 'hidden',
    borderRadius: 1000,
  },
  button: {
    backgroundColor: '#0096E5',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    minWidth: 150,
  },
  buttonLabel: {
    textTransform: 'uppercase',
    color: 'white',
    fontSize: 16,
  },
})
