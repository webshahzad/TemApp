//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useState } from 'react'
import { reactive } from 'common/reactive'
import { View, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Transaction } from 'reactronic'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { StackScreenProps } from '@react-navigation/stack'

import { App } from 'models/app/App'
import { TemateList } from 'components/TemateList'
import { Bool } from 'common/constants'
import { doAsync } from 'common/doAsync'
import { RootStackPropsPerPath } from 'navigation/params'
import { showUserDetails } from './OtherUser'
import { UserSearch, UserSearchOptions } from 'models/app/UserSearch'
import { UserInfo } from 'models/data/UserInfo'

export interface SearchTematesProps {
  options: UserSearchOptions
}

export const SearchTemates = (p: StackScreenProps<RootStackPropsPerPath, 'SearchTemates'>): JSX.Element => {
  const [manager] = useState(() => Transaction.run(() => new UserSearch(p.route.params.options)))

  const onUserPressed = (user: UserInfo): void => {
    if (manager.canViewUserDetails) {
      showUserDetails(user)
    }
  }

  return reactive(() => {
    return (
      <SafeAreaView style={styles.container}>
        {manager.filterExpanded ? (
          <View style={styles.search}>
            <Pressable
              onPress={() => {
                if (manager.filterExpandable) {
                  manager.toggleFilter()
                }
              }}
            >
              <Icon name='search' color={SearchIconColor} />
            </Pressable>
            <TextInput
              style={styles.input}
              value={manager.filter}
              onChangeText={value => manager.setFilter(value)}
            />
            {(manager.filter.length > 0) && (
              <Pressable onPress={() => manager.clearFilter()}>
                <Icon name='times-circle' color={SearchIconColor} />
              </Pressable>
            )}
          </View>
        ) : (
          <View style={styles.searchCollapsed}>
            <Pressable
              onPress={() => manager.toggleFilter()}
            >
              <Icon name='search' color={SearchIconColor} />
            </Pressable>
          </View>
        )}
        <ScrollView style={styles.list}>
          {(manager.temateResults.items.length > 0) && (
            <View style={styles.list}>
              <TemateList
                list={manager.temateResults}
                title='tēmate'
                onUserPressed={onUserPressed}
              />
            </View>
          )}
          {(manager.nonTemateResults.items.length > 0) && (
            <TemateList
              list={manager.nonTemateResults}
              title='non-tēmate'
              onUserPressed={onUserPressed}
              buttons={[{
                id: 'add',
                icon: 'plus',
                title: 'Add',
                shouldHide: user => user.is_friend === Bool.True,
                onPress: user => doAsync(() => App.userSearchManager.sendRequest(user)),
              }]}
            />
          )}
        </ScrollView>
      </SafeAreaView >
    )
  })
}

const SearchBackground = '#e9e6e9'
const SearchIconColor = 'gray'
const BorderRadius = 10

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  search: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SearchBackground,
    borderRadius: BorderRadius,
    paddingHorizontal: 15,
  },
  searchCollapsed: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 18,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: SearchBackground,
    borderRadius: BorderRadius,
    paddingHorizontal: 10,
  },
  list: {
    width: '100%',
    marginVertical: 15,
  },
})
