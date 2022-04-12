//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { StyleSheet, Text } from 'react-native'

export function Middot(): React.ReactElement {
  return (
    <Text style={styles.middot}>●</Text>
  )
}

const styles = StyleSheet.create({
  middot: {
    marginRight: 10,
    color: '#EFF9FE',
  },
})
