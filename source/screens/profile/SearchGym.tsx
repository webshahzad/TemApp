//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Ref } from 'reactronic'
import { reactive } from 'common/reactive'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { RootStackPropsPerPath } from 'navigation/params'
import { App } from 'models/app/App'
import { InputBadge } from 'components/InputBadge'
import { ScrollView } from 'react-native-gesture-handler'

export const SearchGym = (p: StackScreenProps<RootStackPropsPerPath, 'SearchGym'>): JSX.Element => {
  useEffect(() => {
    return p.navigation.addListener('focus', () => {
      App.gymManager.resetFilter()
    })
  }, [p.navigation])

  return reactive(() => {
    const manager = App.gymManager
    const m = Ref.to(manager)
    const showResults = (manager.filter !== undefined) && (manager.filter.length > 0)
    return (
      <ScrollView style={styles.scroll}>
        <SafeAreaView style={styles.container}>
          <View style={styles.filter}>
            <InputBadge
              icon='search'
              model={m.filter}
              placeholder='Search Gym/Club'
              contentStyle={styles.input}
            />
          </View>
          {showResults ? (
            <View style={styles.list}>
              {manager.places?.map(gym => (
                <Pressable
                  key={`Place_${gym.place_id}`}
                  style={styles.gym}
                  onPress={async () => {
                    await manager.setAddress(gym)
                    App.rootNavigation.pop()
                  }}
                >
                  <Icon style={styles.icon} name='map-marker-alt' />
                  <View style={styles.description}>
                    <Text style={styles.text}>{gym.name}</Text>
                    <Text style={styles.text}>{gym.formatted_address}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.list}>
              {manager.recentAddresses?.map(gym => (
                <Pressable
                  key={`Gym_${gym.place_id}`}
                  style={styles.gym}
                  onPress={async () => {
                    await manager.setRecentAddress(gym)
                    App.rootNavigation.pop()
                  }}
                >
                  <Icon style={styles.icon} name='map-marker-alt' />
                  <View style={styles.description}>
                    <Text style={styles.text}>{gym.name}</Text>
                    <Text style={styles.text}>{gym.address}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </SafeAreaView>
      </ScrollView>
    )
  })
}

const GymColor = 'gray'
const GymBorderRadius = 10

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  scroll: {
    width: '100%',
  },
  filter: {
    width: '80%',
    marginVertical: 5,
  },
  list: {
    width: '90%',
    alignItems: 'center',
    position: 'relative',
    marginTop: 10,
    backgroundColor: 'white',
    borderTopLeftRadius: GymBorderRadius,
    borderTopRightRadius: GymBorderRadius,
  },
  gym: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderTopLeftRadius: GymBorderRadius,
    borderTopRightRadius: GymBorderRadius,
    borderColor: 'lightgray',
    borderBottomWidth: 1,
  },
  icon: {
    marginRight: 10,
    color: GymColor,
    fontSize: 24,
  },
  description: {
    alignItems: 'center',
    flex: 1,
  },
  text: {
    color: GymColor,
    width: '100%',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 0,
  },
})
