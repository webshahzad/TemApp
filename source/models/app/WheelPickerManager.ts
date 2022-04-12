//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction } from 'reactronic'

export class WheelManager extends ObservableObject {
  data: string[]
  selectedIndex: number

  constructor(getData: () => string[]) {
    super()
    this.data = getData()
    this.selectedIndex = -1
  }

  @transaction
  setSelectedIndex(index: number): void {
    this.selectedIndex = index
  }
}

export interface WheelPickerManager {
  visible: boolean
  setVisible: (value: boolean) => void
  wheels: WheelManager[]
  onSave: (values: string[], selectedIndexes?: number[]) => void
  text: string
}
