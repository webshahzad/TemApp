//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Refreshable } from 'common/Refreshable'
import { Api } from 'models/app/Api'
import { Alert, PermissionsAndroid } from 'react-native'
import { ObservableObject, unobservable, transaction } from 'reactronic'
import { Address } from './Address'

export class Location extends ObservableObject {
  @unobservable readonly storedRecents: StoredRecentLocations

  constructor() {
    super()
    this.storedRecents = new StoredRecentLocations()
  }

  refresh(): Promise<void> {
    return this.storedRecents.load()
  }

  async requestCurrentLocation(): Promise<void> {
    const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Permission granted', 'todo: obtain location')
    } else
      Alert.alert('', 'Location permission was not granted. Retry?', [
        { text: 'No' },
        { text: 'Yes', onPress: () => this.requestCurrentLocation() },
      ])
  }
}

export class StoredRecentLocations extends Refreshable {
  data: Address[] = []

  @transaction
  protected async refresh(): Promise<void> {
    const response = await Api.call('GET', 'profile/search_location')
    this.apply(response)
  }
}
