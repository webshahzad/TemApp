//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { useEffect } from 'react'
import { NavigationProp, EventMapCore, NavigationState } from '@react-navigation/native'
import { Transaction } from 'reactronic'

export function addNavigationListener<T extends Extract<keyof EventMapCore<NavigationState>, string>>(
  navigation: NavigationProp<any>,
  type: T,
  performUpdate: () => void
): void {
  useEffect(() => {
    // return callback to unsubscribe
    return navigation?.addListener(type, () => {
      Transaction.run(() => {
        performUpdate()
      })
    })
  }, [navigation])
}

export function useOnFocus(navigation: NavigationProp<any>, performUpdate: () => void): void {
  addNavigationListener(navigation, 'focus', performUpdate)
}
