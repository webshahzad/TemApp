//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Transaction } from 'reactronic'

export function create<T extends object>(type: { new(): T }, existing?: Partial<T>): T {
  return Transaction.run(() => {
    const result = new type()
    if (existing)
      Object.assign(result, existing)
    return result
  })
}
