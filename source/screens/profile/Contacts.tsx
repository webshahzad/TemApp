//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { View, StyleSheet, Text, Pressable } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { RootStackPropsPerPath } from 'navigation/params'
import { doAsync } from 'common/doAsync'
import { App } from 'models/app/App'
import { MainBlueColor } from 'components/Theme'

export const Contacts = (p: StackScreenProps<RootStackPropsPerPath, 'Contacts'>): JSX.Element => {
  return reactive(() => {
    return(
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.text}>Connecting your Facebook account and syncing phone contacts helps us to suggest you</Text>
        </View>
        <View style={styles.section}>
          <Pressable
            style={styles.line}
            onPress={() => doAsync(() => App.userSearchManager.readFacebookContacts())}
          >
            <Icon name='facebook' style={styles.icon} />
            <Text style={styles.label}>Connect Facebook Account</Text>
          </Pressable>
        </View>
        <View style={styles.section}>
          <Pressable
            style={styles.line}
            onPress={() => void App.userSearchManager.readPhoneContacts()}
          >
            <Icon name='address-book' style={styles.icon} />
            <Text style={styles.label}>Sync Phone Contacts</Text>
          </Pressable>
        </View>
      </View>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  section: {
    padding: 20,
    borderColor: 'lightgray',
    borderBottomWidth: 1,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
  },
  line: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 10,
    color: MainBlueColor,
    fontSize: 16,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
})
