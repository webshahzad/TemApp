//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Address } from 'models/data/Address'
import { EventLocation } from 'models/data/EventInfo'
import { Ref, Transaction } from 'reactronic'
import { AddressManager } from '../AddressManager'
import { LocationManager, PlaceInfo } from '../LocationManager'

export class EventLocationManager extends AddressManager<PlaceInfo> {
  constructor(manager: LocationManager, model: Ref<EventLocation | undefined>) {
    super({
      manager,
      recentUrl: 'profile/search_location',
      onSetAddress: (address: Address) => {
        Transaction.run(() => {
          const location = new EventLocation()
          location.location = (address.name ? `${address.name}, ${address.address}` : address.address) ?? ''
          location.lat = address.lat!
          location.long = address.lng!
          model.value = location
        })
      },
      onFind: async (filter: string, manager: LocationManager) => {
        const location = await manager.getCurrentPlacement()
        return manager.findPlaces(filter, location)
      },
      onGetAddress: async (info: PlaceInfo, manager: LocationManager) => {
        return manager.getGymAddress(info)
      },
    })
  }
}
