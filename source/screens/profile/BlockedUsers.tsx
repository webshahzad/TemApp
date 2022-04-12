//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from 'react'
import { reactive } from 'common/reactive'
import { View, StyleSheet, Pressable, Image, Text } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { Ref } from 'reactronic'

import { App } from 'models/app/App'
import { RootStackPropsPerPath } from 'navigation/params'
import { doAsync } from 'common/doAsync'
import { InputBadge } from 'components/InputBadge'
import { MainBlueColor } from 'components/Theme'

export const BlockedUsers = (p: StackScreenProps<RootStackPropsPerPath, 'BlockedUsers'>): JSX.Element => {
  useEffect(() => {
    return p.navigation.addListener('focus', () => {
      App.userSearchManager.clearBlockedFilter()
      void App.userSearchManager.blocked.loadItems()
    })
  }, [p.navigation])

  return reactive(() => {
    const manager = App.userSearchManager
    const m = Ref.to(manager)
    return (
      <View style={styles.container}>
        <View style={styles.search}>
          <InputBadge
            model={m.blockedFilter}
            icon='search'
            labelBackgroundColor='white'
            contentStyle={styles.input}
          />
        </View>
        <View style={styles.list}>
          {manager.blocked.items.map(user => (
            <View key={user._id} style={styles.user}>
              <Image source={user.getAvatar()} style={styles.avatar} />
              <Text style={styles.description}>{user.getFullName()}</Text>
              <Pressable
                style={styles.action}
                onPress={() => doAsync(() => manager.unblockUser(user))}
              >
                <Text style={styles.unblock}>Unblock</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    )
  })
}

const UserAvatarSize = 50

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    minHeight: '100%',
  },
  search: {
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#e9e6e9',
    // borderRadius: 10,
    borderWidth: 0,
  },
  list: {
    width: '100%',
    marginVertical: 15,
  },
  user: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderColor: 'lightgray',
    borderBottomWidth: 1,
  },
  avatar: {
    width: UserAvatarSize,
    height: UserAvatarSize,
    borderRadius: UserAvatarSize / 2,
    marginRight: 10,
  },
  description: {
    flex: 1,
  },
  action: {
    marginLeft: 10,
  },
  unblock: {
    color: MainBlueColor,
  },
})
