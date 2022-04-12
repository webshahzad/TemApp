//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject } from 'reactronic'
import { Bool } from 'common/constants'

export enum GymType {
  Gym,
  Home,
  Other
}

export class Address extends ObservableObject {
  city?: string = undefined
  state?: string = undefined
  country?: string = undefined
  pincode?: string = undefined
  lat?: number = undefined
  lng?: number = undefined
  address?: string = undefined // (formatted) displayed on location input
  place_id?: string = undefined
  name?: string = undefined
  _location?: [number, number] = undefined // [lat, lng]
  set location(value: [number, number]) {
    debugger
    this._location = value
  }
  get location(): [number, number] {
    return this._location as [number, number]
  }
  type?: number = undefined // gymType (1=home, 2=other)
  gym_type_mandatory?: number = 0 // 0 - not selected, 1 - selected

  getDisplayValue(): string {
    return this.address ?? ''
  }

  get formatted(): string {
    let result = ''
    if (this.city) {
      result += this.city
      if (this.country) {
        result += ', '
      }
    }
    if (this.country) {
      result += this.country
    }
    return result
  }

  get gymInfo(): string {
    let result = ''
    if (this.name) {
      result += this.name
      if (this.address) {
        result += ', '
      }
    }
    if (this.address) {
      result += this.address
    }
    return result
  }

  get gymType(): GymType {
    let result = GymType.Gym
    const type = this.type
    if (this.gym_type_mandatory === Bool.True) {
      if (type === 1) {
        result = GymType.Home
      } else if (type === 2) {
        result = GymType.Other
      }
    }
    return result
  }

  set gymType(value: GymType) {
    switch (value) {
      case GymType.Home:
        this.gym_type_mandatory = Bool.True
        this.type = 1
        break
      case GymType.Other:
        this.gym_type_mandatory = Bool.True
        this.type = 2
        this.name = undefined
        this.place_id = undefined
        this.address = undefined
        this.lat = undefined
        this.lng = undefined
        break
      default:
        this.gym_type_mandatory = Bool.False
    }
  }
}
