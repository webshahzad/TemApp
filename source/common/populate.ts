//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { nonreactive } from 'reactronic'

export function populate<T>(target: T, updates: any, properties?: (keyof T)[]): T {
  for (const p in target) {
    if ((properties === undefined) || (properties.indexOf(p) !== -1)) {
      const t = nonreactive(() => target[p])
      if (updates.hasOwnProperty(p)) {
        const v = updates[p]
        if (!(t instanceof Object) || t instanceof Function)
          target[p] = v // scalar
        else if (t instanceof Array) {
          target[p] = v.slice() // clone
        }
        else if (v !== undefined && v !== null)
          populate(t, v) // nested object
        else
          target[p] = v // undefined or null
      }
    }
  }
  return target
}
