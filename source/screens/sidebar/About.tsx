//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Text, StyleSheet, ViewStyle, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'
import { reactive } from 'common/reactive'

import { RootStackPropsPerPath } from 'navigation/params'
import { MenuItemBorderColor, MenuItemBorderWidth } from 'components/Theme'
import { App } from 'models/app/App'
import { Api } from 'models/app/Api'

export function About(p: StackScreenProps<RootStackPropsPerPath, 'About'>): JSX.Element {
  return reactive(() => {
    // const my = p
    return (
      <SafeAreaView style={styles.container}>
        <Pressable
          style={styles.item}
          onPress={() => {
            App.rootNavigation.push('WebPage', {
              title: 'About Us',
              source: {
                uri: Api.apiUrl + '/aboutUs',
              },
            })
          }}
        >
          <Text>About Us</Text>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => {
            App.rootNavigation.push('WebPage', {
              title: 'Terms and Conditions',
              source: {
                uri: Api.apiUrl + '/termsConditions',
              },
            })
          }}
        >
          <Text>Terms & Conditions</Text>
        </Pressable>
        <Pressable
          style={styles.item}
          onPress={() => {
            App.rootNavigation.push('WebPage', {
              title: 'Privacy Policy',
              source: {
                uri: Api.apiUrl + '/privacy_policy',
              },
            })
          }}
        >
          <Text>Privacy Policy</Text>
        </Pressable>
      </SafeAreaView>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'white',
  } as ViewStyle,
  item: {
    padding: 15,
    paddingLeft: 20,
    borderColor: MenuItemBorderColor,
    borderBottomWidth: MenuItemBorderWidth,
  } as ViewStyle,
})
