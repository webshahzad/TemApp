//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction } from 'reactronic'

export class TutorialManager extends ObservableObject {
  visible: boolean = false

  @transaction
  show(): void {
    this.visible = true
  }

  @transaction
  hide(): void {
    this.visible = false
  }
}
