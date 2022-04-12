//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { AddressManager } from './AddressManager'
import { LocationInfo, LocationManager } from './LocationManager'
import { Address } from 'models/data/Address'

export class UserLocationManager extends AddressManager<LocationInfo> {
  constructor(manager: LocationManager, onSetGym: (gym: Address) => void) {
    super({
      manager,
      recentUrl: 'profile/search_location',
      onSetAddress: onSetGym,
      onFind: async (filter: string, manager: LocationManager) => {
        return manager.findLocations(filter)
      },
      onGetAddress: async (info: LocationInfo, manager: LocationManager) => {
        return manager.getLocationAddress(info)
      },
    })
  }
}
