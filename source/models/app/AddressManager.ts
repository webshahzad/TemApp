//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, unobservable, transaction, reaction } from 'reactronic'

import { LocationManager, PlaceInfo } from './LocationManager'
import { Api, ApiData } from './Api'
import { populate } from 'common/populate'
import { Address } from 'models/data/Address'
import { Alert } from 'react-native'

const MinFilterLength = 3

export interface AddressManagerSettings<T> {
  manager: LocationManager,
  recentUrl: string,
  onFind: (filter: string, manager: LocationManager) => Promise<T[]>
  onGetAddress: (info: T, manager: LocationManager) => Promise<Address>
  onSetAddress: (address: Address) => void
}

export class AddressManager<T> extends ObservableObject {
  @unobservable private s: AddressManagerSettings<T>

  recentAddresses?: Address[]
  filter?: string
  places?: T[]

  constructor(settings: AddressManagerSettings<T>) {
    super()
    this.s = settings

    this.recentAddresses = undefined
    this.filter = undefined
    this.places = undefined
  }

  @reaction
  async loadRecentAddresses(): Promise<void> {
    if (Api.isAuthenticated()) {
      try {
        const result: ApiData<Address[]> = await Api.call('GET', this.s.recentUrl)
        this.recentAddresses = result.data.map(entry => {
          const gym = new Address()
          populate(gym, entry)
          return gym
        })
      }
      catch (e) {
        console.log(e)
      }
    }
  }

  @reaction
  async findPlaces(): Promise<void> {
    if (this.filter && (this.filter.length >= MinFilterLength)) {
      try {
        this.places = await this.s.onFind(this.filter, this.s.manager)
      }
      catch (e) {
        console.log(e)
      }
    } else {
      this.places = undefined
    }
  }

  @transaction
  async setAddress(place: T): Promise<void> {
    try {
      const address = await this.s.onGetAddress(place, this.s.manager)
      await Api.call('POST', this.s.recentUrl, address)
      if (!this.recentAddresses) {
        this.recentAddresses = [address]
      } else {
        const recentAddressesMutable = this.recentAddresses.toMutable()
        recentAddressesMutable.unshift(address)
        this.recentAddresses = recentAddressesMutable
      }
      this.s.onSetAddress(address)
    }
    catch (e) {
      console.log(e)
    }
  }

  @transaction
  async setRecentAddress(address: Address): Promise<void> {
    try {
      if (this.recentAddresses) {
        await Api.call('POST', this.s.recentUrl, address)
        const index = this.recentAddresses.indexOf(address)
        const recentAddressesMutable = this.recentAddresses.toMutable()
        recentAddressesMutable.splice(index, 1)
        recentAddressesMutable.splice(0, 0, address)
        this.recentAddresses = recentAddressesMutable

        const result = new Address()
        populate(result, address)
        this.s.onSetAddress(result)
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  @transaction
  resetFilter(): void {
    this.filter = undefined
  }

  @transaction
  async setCurrentAddress(): Promise<void> {
    try {
      const address = await this.s.manager.getCurrentLocation()
      if (address) {
        this.s.onSetAddress(address)
      } else {
        Alert.alert('Couldn\'t detect your current address. Please enter it manually.')
      }
    }
    catch (e) {
      console.log(e)
    }
  }
}
