//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject } from 'reactronic'

export class Interest extends ObservableObject {
  _id: string = ''
  icon: string = ''
  image: string = ''
  name: string = ''

  static comparer(a: Interest, b: Interest): boolean {
    return a._id === b._id
  }

  static getKey(a: Interest): string {
    return a._id
  }
}
