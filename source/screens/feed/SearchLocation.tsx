//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useLayoutEffect } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'
import { FeedStackPropsPerPath } from 'navigation/params'
import { useOnFocus } from 'common/useOnFocus'
import { App } from 'models/app/App'
import { Location } from 'models/data/Location'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import { Address } from 'models/data/Address'
import { reactive } from 'common/reactive'
import { MainBlueColor } from 'components/Theme'
import { RightHeaderPressableButton } from 'navigation/utils'

export const SearchLocation = (p: StackScreenProps<FeedStackPropsPerPath, 'SearchLocation'>): React.ReactElement => {
  useOnFocus(p.navigation, () => {
    let location: Location
    if (!App.location) {
      location = new Location()
      App.location = location
    } else
      location = App.location
    void location.refresh()
  })

  useLayoutEffect(() => {
    p.navigation.setOptions({
      headerRight: props => RightHeaderPressableButton('Cancel', () => p.navigation.goBack()),
    })
  }, [])

  return reactive(() => {
    return (
      <SafeAreaView style={styles.screen}>
        {/* <GooglePlacesAutocomplete
          placeholder='Search'
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
           
          }}
          query={{
            key: 'AIzaSyBsIg57VjRz6OIj1qYwZXZwi6IQEqOARK8',
            language: 'en',
          }}
          currentLocation
        /> */}
        {/* <InputBadge
          placeholder='Search Location'
          icon='search'
          // model={Ref.to(leaderboard).search}
          style={styles.search}
        />

        <ScrollView contentContainerStyle={styles.locationsList}>
          {UseCurrentLocationButton()}
          {App.location ? App.location.storedRecents.data.map(RecentLocationRow) : null}
        </ScrollView> */}
      </SafeAreaView>
    )
  })
}

function UseCurrentLocationButton(): React.ReactElement {
  return (
    <Pressable
      key='current location'
      style={styles.locationRow}
      onPress={App.location?.requestCurrentLocation}
    >
      <View style={[styles.locationIcon, styles.currentLocationIcon]}>
        <Icon name='location-pin' size={30} color='white' />
      </View>
      <Text style={[styles.locationLabel, styles.currentLocationLabel]}>Use my current location</Text>
    </Pressable>
  )
}

function RecentLocationRow(address: Address): React.ReactElement {
  let location: string
  if (address.country && address.city)
    location = `${address.city}, ${address.country}`
  else
    location = address.country || ''
  return (
    <Pressable key={address.place_id} style={[styles.locationRow, styles.recentLocationRow]}>
      <View style={styles.locationIcon}>
        <Icon name='location-pin' size={30} color='white' />
      </View>
      <Text style={styles.locationLabel}>{location}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    padding: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  recentLocationRow: {
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
  },
  currentLocationIcon: {
    backgroundColor: MainBlueColor,
  },
  currentLocationLabel: {
    color: 'black',
  },
  locationIcon: {
    backgroundColor: 'lightgrey',
    padding: 5,
    borderRadius: 100,
    marginRight: 10,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'grey',
  },
})
