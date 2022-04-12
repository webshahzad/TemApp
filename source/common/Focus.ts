//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction } from 'reactronic'

export class Focus extends ObservableObject {
  focused: boolean = false

  @transaction
  setFocused(value: boolean): void {
    this.focused = value
  }
}
