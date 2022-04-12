//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Ref } from 'reactronic'

import { Checkbox } from 'components/Checkbox'
import { App } from 'models/app/App'
import { doAsync } from 'common/doAsync'

export const Privacy = (): JSX.Element => {
  const eu = Ref.to(App.user.edited)
  return reactive(() => {
    return(
      <View style={styles.container}>
        <View style={styles.section}>
          <View style={styles.line}>
            <Text style={styles.label}>Private Profile</Text>
            <View style={[styles.control, styles.switch]}>
              <Checkbox
                model={eu.is_private}
                onValueChanged={value => doAsync(() => App.user.setIsPrivate(value))}
              />
            </View>
          </View>
          <Text style={styles.private}>When your profile is private only your tēmates will be able to view your posts. However, posts added by you in tēms are still visible to other users.</Text>
        </View>
        <View style={styles.section}>
          <Pressable
            style={styles.line}
            onPress={() => App.rootNavigation.push('BlockedUsers')}
          >
            <Text style={styles.label}>Blocked List</Text>
            <View style={styles.control}>
              <Icon name='chevron-right' />
            </View>
          </Pressable>
        </View>
        <View style={styles.section}>
          <Pressable
            style={styles.line}
            onPress={() => App.rootNavigation.push('Contacts')}
          >
            <Text style={styles.label}>Contacts</Text>
            <View style={styles.control}>
              <Icon name='chevron-right' />
            </View>
          </Pressable>
        </View>
      </View>
    )
  })
}

const styles = StyleSheet.create({
  container: {
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
  },
  control: {
    marginLeft: 5,
  },
  private: {
    color: 'lightgray',
  },
  switch: {
    // marginHorizontal: -10,
  },
})
