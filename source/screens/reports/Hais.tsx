//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'

import { ReportsStackPropsPerPath } from 'navigation/params'
import { Health } from 'screens/profile/Health'
import { ScrollView } from 'react-native-gesture-handler'

export function Hais(p: StackScreenProps<ReportsStackPropsPerPath, 'Hais'>): JSX.Element {
  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollable} contentContainerStyle={styles.container}>
        <Health onSubmit={() => p.navigation.pop()} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollable: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
})
