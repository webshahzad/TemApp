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
import { doAsync } from 'common/doAsync'
import { UserLocationManager } from 'models/app/UserLocationManager'
import { EventLocationManager } from 'models/app/Calendar/EventLocationManager'
import { LocationInfo, PlaceInfo } from 'models/app/LocationManager'
import { MainBlueColor } from 'components/Theme'

export interface SearchUserLocationProps {
  manager: UserLocationManager | EventLocationManager
}

export const SearchUserLocation = (p: StackScreenProps<RootStackPropsPerPath, 'SearchUserLocation'>): JSX.Element => {
  useEffect(() => {
    return p.navigation.addListener('focus', () => {
      const manager = p.route.params.manager
      manager.resetFilter()
    })
  }, [p.navigation])

  return reactive(() => {
    const manager = p.route.params.manager
    const m = Ref.to(manager)
    const showResults = (manager.filter !== undefined) && (manager.filter.length > 0)
    console.log("m......>>",m)
    console.log("showResults",showResults)
    return (
      <ScrollView style={styles.scroll}>
        <SafeAreaView style={styles.container}>
          <View style={styles.filter}>
            <InputBadge
              icon='search'
              model={m.filter}
              placeholder='Search Location'
              contentStyle={styles.input}
            />
          </View>
          {showResults ? (
            <View style={styles.list}>
              {manager.places && (
                <>
                  {(manager instanceof UserLocationManager) ? (
                    <>
                      {(manager.places as LocationInfo[]).map(location => (
                        <Pressable
                          key={`Place_${location.place_id}`}
                          style={styles.location}
                          onPress={async () => {
                            await manager.setAddress(location)
                            App.rootNavigation.pop()
                          }}
                        >
                          <Icon style={styles.icon} name='map-marker-alt' />
                          <View style={styles.description}>
                            <Text style={styles.text}>{location.description}</Text>
                          </View>
                        </Pressable>
                      ))}
                    </>
                  ) : (
                    <>
                      {(manager.places as PlaceInfo[]).map(location => (
                        <Pressable
                          key={`Place_${location.place_id}`}
                          style={styles.location}
                          onPress={() => {
                            doAsync(() => manager.setAddress(location))
                            App.rootNavigation.pop()
                          }}
                        >
                          <Icon style={styles.icon} name='map-marker-alt' />
                          <View style={styles.description}>
                            <Text style={styles.text}>{location.name}</Text>
                            <Text style={styles.text}>{location.formatted_address}</Text>
                          </View>
                        </Pressable>
                      ))}
                    </>
                  )}
                </>
              )}
            </View>
          ) : (
            <View style={styles.list}>
              <Pressable
                style={styles.location}
                onPress={() => {
                  doAsync(() => manager.setCurrentAddress())
                  App.rootNavigation.pop()
                }}
              >
                <Icon style={[styles.icon, styles.currentIcon]} name='map-marker-alt' />
                <Text style={[styles.text, styles.currentText]}>Use my current location</Text>
              </Pressable>
              {manager.recentAddresses?.map(location => (
                <Pressable
                  key={`Location_${location.place_id}`}
                  style={styles.location}
                  onPress={() => {
                    doAsync(() => manager.setRecentAddress(location))
                    App.rootNavigation.pop()
                  }}
                >
                  <Icon style={styles.icon} name='map-marker-alt' />
                  <View style={styles.description}>
                    <Text style={styles.text}>{location.address}</Text>
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
  location: {
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
  currentIcon: {
    color: MainBlueColor,
  },
  currentText: {
    fontWeight: 'bold',
  },
})
