//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { View, ToastAndroid, ScrollView, StyleSheet } from 'react-native'
import { Ref } from 'reactronic'
import { SafeAreaView } from 'react-native-safe-area-context'

import { StackScreenProps } from '@react-navigation/stack'
import { RootStackPropsPerPath } from 'navigation/params'

import { reactive } from 'common/reactive'
import { Theme } from 'components/Theme'
import { InputBadge } from 'components/InputBadge'
import { RoundButton } from 'components/RoundButton'
import { SplashHeader } from 'components/SplashHeader'
import { App } from 'models/app/App'
import { ApiData } from 'models/app/Api'

export function ContactUs(p: StackScreenProps<RootStackPropsPerPath, 'ContactUs'>): JSX.Element {
  return reactive(() => {
    const m = Ref.to(App.contactUs)
    return (
      <SafeAreaView style={Theme.screen}>
        <SplashHeader title='CONTACT US' />

        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
          <View style={Theme.section}>
            <InputBadge style={styles.subject} label='Subject' icon='envelope' model={m.subject} />
            <InputBadge style={styles.description} label='Description' multiline model={m.description} />
          </View>

          <View style={Theme.line}>
            <RoundButton
              color='white'
              background='#0096E5'
              label='Submit'
              style={styles.submitButton}
              onPress={postContactUs}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  })
}

async function postContactUs(): Promise<void> {
  if (App.contactUs.canPost()) {
    const response: ApiData = await App.contactUs.post()
    ToastAndroid.show(response.message, ToastAndroid.LONG)
  }
  else {
    ToastAndroid.show('Please, enter subject and description', ToastAndroid.SHORT)
  }
}

const styles = StyleSheet.create({
  subject: {
    marginBottom: 10,
  },
  description: {
    marginBottom: 10,
  },
  submitButton: {
    minWidth: 128,
  },
})
