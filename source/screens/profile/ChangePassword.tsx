//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { View, ScrollView, ToastAndroid, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ref } from 'reactronic'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackPropsPerPath } from 'navigation/params'
import { App } from 'models/app/App'
import { Theme } from 'components/Theme'
import { SplashHeader } from 'components/SplashHeader'
import { InputBadge } from 'components/InputBadge'
import { RoundButton } from 'components/RoundButton'
import { doAsync } from 'common/doAsync'

export const ChangePassword = (p: StackScreenProps<RootStackPropsPerPath, 'ChangePassword'>): JSX.Element => {
  return reactive(() => {
    const m = Ref.to(App.changePassword)
    return (
      <SafeAreaView style={Theme.screen}>
        <SplashHeader title='CHANGE PASSWORD' />

        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
          <View style={Theme.section}>
            <InputBadge style={styles.input} label='Current Password' icon='lock' secured model={m.oldPassword} />
            <InputBadge style={styles.input} label='New Password' icon='lock' secured model={m.newPassword} />
            <InputBadge style={styles.input} label='Confirm Password' icon='lock' secured model={m.confirmedPassword} />
          </View>

          <RoundButton
            color='white'
            background='#0096E5'
            label='Save'
            style={{ minWidth: 128 }}
            onPress={() => {
              if (App.changePassword.canPost()) {
                doAsync(() => App.changePassword.post())
              } else {
                ToastAndroid.show('Please, specify valid password', ToastAndroid.SHORT)
              }
            }}
          />
        </ScrollView>
      </SafeAreaView>
    )
  })
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
  },
})
