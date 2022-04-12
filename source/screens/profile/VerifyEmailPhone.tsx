//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from 'react'
import { reactive } from 'common/reactive'
import { View, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ref, ObservableObject, Transaction, transaction } from 'reactronic'
import { StackScreenProps } from '@react-navigation/stack'

import { RootStackPropsPerPath } from 'navigation/params'
import { App } from 'models/app/App'
import { Theme } from 'components/Theme'
import { SplashHeader } from 'components/SplashHeader'
import { InputBadge } from 'components/InputBadge'
import { RoundButton } from 'components/RoundButton'
import { doAsync } from 'common/doAsync'
import { UserVerificationTarget } from 'models/app/User'

export interface VerifyEmailPhoneProps {
  target: UserVerificationTarget
  initialValue?: string
}

interface PhoneInfo {
  countryCode: string
  phone: string
}

class VerificationManager extends ObservableObject {
  value: string

  constructor() {
    super()
    this.value = ''
  }

  @transaction
  setValue(value: string): void {
    this.value = value
  }

  getPhoneInfo(): PhoneInfo {
    return {
      countryCode: '+91', // from iOs
      phone: this.value,
    }
  }
}

export const VerifyEmailPhone = (p: StackScreenProps<RootStackPropsPerPath, 'VerifyEmailPhone'>): JSX.Element => {
  const [manager] = React.useState(() => Transaction.run(() => new VerificationManager()))

  useEffect(() => {
    return p.navigation.addListener('focus', () => {
      manager.setValue(p.route.params.initialValue ?? '')
    })
  }, [p.navigation])

  return reactive(() => {
    const m = Ref.to(manager)

    const target = p.route.params.target
    const title = (target === UserVerificationTarget.Email) ? 'CHANGE EMAIL' : 'CHANGE PHONE NUMBER'
    const icon = (target === UserVerificationTarget.Email) ? 'envelope' : 'phone-alt'
    const onVerify = async (): Promise<void> => {
      if (manager.value) {
        if (target === UserVerificationTarget.Email) {
          await App.user.requestEmailVerification(manager.value)
          App.rootNavigation.replace('OtpVerification', { context: 'email' })
        } else {
          const phoneInfo = manager.getPhoneInfo()
          await App.user.requestPhoneVerification(phoneInfo.countryCode, phoneInfo.phone)
          App.rootNavigation.replace('OtpVerification', { context: 'phone' })
        }
      }
    }

    return (
      <SafeAreaView style={Theme.screen}>
        <SplashHeader title={title} />

        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
          <View style={Theme.section}>
            <InputBadge style={styles.input} icon={icon} model={m.value} />
          </View>

          <RoundButton
            color='white'
            background='#0096E5'
            label='Verify'
            style={{ minWidth: 128 }}
            onPress={() => doAsync(onVerify)}
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
