//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Ref } from 'reactronic'

import { App } from 'models/app/App'
import { InputBadge } from 'components/InputBadge'
import { doAsync } from 'common/doAsync'
import { MainBlueColor } from 'components/Theme'

export const AccountabilityMission = (): JSX.Element => {
  return reactive(() => {
    const user = App.user
    const eu = Ref.to(user.edited)
    return (
      <View style={styles.container}>
        <View style={styles.input}>
          <InputBadge
            model={eu.accountabilityMission}
            placeholder='Describe your accountability mission.'
            multiline
          />
        </View>
        <View style={styles.save}>
          <Pressable
            style={styles.button}
            onPress={() => doAsync(() => user.saveAccountabilityMission())}
          >
            <Text style={styles.buttonText}>Save</Text>
          </Pressable>
        </View>
      </View>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    position: 'relative',
    marginBottom: 10,
  },
  save: {
    marginLeft: 5,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: MainBlueColor,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
})
