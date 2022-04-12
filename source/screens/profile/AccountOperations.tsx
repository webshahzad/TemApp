//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { View, Pressable, StyleSheet, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { App } from 'models/app/App'
import { GrayColor } from 'components/Theme'
import { useNavigation } from '@react-navigation/native'

export const AccountOperations = (): JSX.Element => {
     const navigation = useNavigation();
  return reactive(() => {
    return(
      <View style={styles.container}>
        <Pressable
          style={styles.link}
          onPress={() => 
            navigation.navigate("Interests")
            // App.rootNavigation.push('ChangePassword')
          }
        >
          <Text style={styles.text}>Change Password</Text>
          <Icon name='chevron-right' size={12} style={styles.icon} />
        </Pressable>
        <Pressable
          style={styles.link}
          onPress={() => App.rootNavigation.push('DisableAccount')}
        >
          <Text style={styles.text}>Disable Account</Text>
          <Icon name='chevron-right' size={12} style={styles.icon} />
        </Pressable>
        <Pressable
          style={styles.link}
          onPress={() => App.logout()}
        >
          <Text style={styles.text}>Logout</Text>
          <Icon name='chevron-right' size={12} style={styles.icon} />
        </Pressable>
      </View>
    )
  })
}

const styles = StyleSheet.create({
  container: {
  },
  link: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: GrayColor,
  },
  text: {
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
})
