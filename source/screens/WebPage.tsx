//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from 'react'
import { StyleSheet, ViewStyle, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { StackScreenProps } from '@react-navigation/stack'

import { RootStackPropsPerPath } from 'navigation/params'

export function WebPage(p: StackScreenProps<RootStackPropsPerPath, 'WebPage'>): JSX.Element {
  useEffect(() => p.navigation.setOptions({ title: p.route.params.title }))
  return (
    <SafeAreaView style={styles.fullSize} >
      <WebView
        source={p.route.params.source}
        startInLoadingState
        textZoom={p.route.params.textZoom}
        onShouldStartLoadWithRequest={event => {
          // open external urls in browser
          void Linking.openURL(event.url)
          return false
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  fullSize: {
    height: '100%',
    width: '100%',
  } as ViewStyle,
})
