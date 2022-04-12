//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { reactive } from 'common/reactive'
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { RoundButton } from 'components/RoundButton'

import { RootStackPropsPerPath } from 'navigation/params'
import { Theme } from 'components/Theme'
import { doAsync } from 'common/doAsync'
import { App } from 'models/app/App'

export const DisableAccount = (p: StackScreenProps<RootStackPropsPerPath, 'DisableAccount'>): JSX.Element => {
  return reactive(() => {
    return (
      <View style={[Theme.screen, { alignItems: 'center' }]}>
        <View style={Theme.section}>
          <View style={Theme.line}>
            <Icon name='exclamation-triangle' style={styles.icon} size={72} color='lightgray' />
          </View>
        </View>

        <View style={Theme.section}>
          <View style={Theme.line}>
            <Text style={styles.text}>Do you really wish to disable your account? You will loose access to all the cool features of the app 🙁</Text>
          </View>
        </View>

        <View style={Theme.section}>
          <View style={Theme.line}>
            <Text style={styles.text}>In case you change your mind, you can always re-enable your account by simply logging in to app.</Text>
          </View>
          <View style={Theme.line}>
            <Text style={styles.text}>Click the button below to complete the process.</Text>
          </View>
        </View>

        <View style={Theme.section}>
          <View style={Theme.line}>
            <RoundButton
              color='white'
              background='#0096E5'
              label='Confirm'
              style={{ minWidth: 128 }}
              onPress={() => doAsync(() => App.user.disable())}
            />
          </View>
        </View>
      </View>
    )
  })
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontSize: 18,
  },
  icon: {
    marginTop: 20,
  },
})
