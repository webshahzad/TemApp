//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { AddressManager } from './AddressManager'
import { LocationManager, PlaceInfo } from './LocationManager'
import { Address } from 'models/data/Address'

export class GymManager extends AddressManager<PlaceInfo> {
  constructor(manager: LocationManager, onSetGym: (gym: Address) => void) {
    super({
      manager,
      recentUrl: 'profile/gym_search_location',
      onSetAddress: onSetGym,
      onFind: async (filter: string, manager: LocationManager) => {
        const location = await manager.getCurrentPlacement()
        return manager.findGyms(filter, location)
      },
      onGetAddress: async (info: PlaceInfo, manager: LocationManager) => {
        return manager.getGymAddress(info)
      },
    })
  }
}
