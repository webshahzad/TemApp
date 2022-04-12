//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { MainBlueColor } from 'components/Theme'
import { ColorValue, Pressable, StyleSheet, Text } from 'react-native'

export function RightHeaderPressableButton(label: string, onPress: () => void, color?: ColorValue): React.ReactElement {
  return (
    <Pressable onPress={onPress}>
      <Text style={[styles.rightHeaderButtonLabel, color !== undefined ? { color } : undefined]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  rightHeaderButtonLabel: {
    marginRight: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: MainBlueColor,
  },
})
