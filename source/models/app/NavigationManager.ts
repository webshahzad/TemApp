//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction } from 'reactronic'

export interface INavigationTab<T> {
  value: T
  name: string
}

export class NavigationManager<T> extends ObservableObject {
  currentNavigation: T
  tabs: INavigationTab<T>[]

  constructor(currentNavigation: T, tabs: INavigationTab<T>[]) {
    super()
    this.currentNavigation = currentNavigation
    this.tabs = tabs
  }

  @transaction
  navigate(navigation: T): void {
    this.currentNavigation = navigation
  }
}
