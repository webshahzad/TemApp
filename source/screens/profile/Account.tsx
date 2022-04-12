//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { Text, View, StyleSheet, Pressable } from 'react-native'
import { ObservableObject, transaction, Transaction } from 'reactronic'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { AccountOperations } from './AccountOperations'
import { Notifications } from './Notifications'
import { LinkDevices } from './LinkDevices'
import { Privacy } from './Privacy'
import { MainBlueColor } from 'components/Theme'
import { App } from 'models/app/App'
import { LinkApps } from './LinkApps'

enum AccountNavigation {
  Account,
  LinkDevices,
  LinkApps,
  Notifications,
  Privacy,
}

class AccountNavigationManager extends ObservableObject {
  navigation?: AccountNavigation

  constructor() {
    super()
    this.navigation = undefined
  }

  @transaction
  navigate(navigation?: AccountNavigation): void {
    this.navigation = navigation
  }
}

export const Account = (): React.ReactElement => {
  const [manager] = React.useState(() => Transaction.run(() => new AccountNavigationManager()))

  return reactive(() => {
    return (
      <View style={styles.container}>
        {(manager.navigation === undefined) ? (
          <View style={styles.main}>
            <Pressable
              style={styles.button}
              onPress={() => manager.navigate(AccountNavigation.Account)}
            >
              <Text style={styles.text}>Account</Text>
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={() => manager.navigate(AccountNavigation.LinkDevices)}
            >
              <Text style={styles.text}>Link Devices</Text>
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={() => manager.navigate(AccountNavigation.LinkApps)}
            >
              <Text style={styles.text}>Link Apps</Text>
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={() => manager.navigate(AccountNavigation.Notifications)}
            >
              <Text style={styles.text}>Notifications</Text>
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={() => manager.navigate(AccountNavigation.Privacy)}
            >
              <Text style={styles.text}>Privacy</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.aux}>
            <Pressable
              style={styles.back}
              onPress={() => manager.navigate()}
            >
              <Icon name='chevron-left' size={16} />
            </Pressable>
            {(manager.navigation === AccountNavigation.Account) && (<AccountOperations />)}
            {(manager.navigation === AccountNavigation.LinkDevices) && (<LinkDevices />)}
            {(manager.navigation === AccountNavigation.LinkApps) && (<LinkApps />)}
            {(manager.navigation === AccountNavigation.Notifications) && (<Notifications />)}
            {(manager.navigation === AccountNavigation.Privacy) && (<Privacy />)}
          </View>
        )}
      </View>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: MainBlueColor,
    borderRadius: 20,
    marginVertical: 10,
    padding: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  aux: {
    flex: 1,
  },
  back: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
})
