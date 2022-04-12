//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction, reaction } from 'reactronic'

import { App } from './App'
import { WheelManager, WheelPickerManager } from './WheelPickerManager'

const MinWeight = 50
const MaxWeight = 500
const Suffix = ' lbs'

export class WeightManager extends ObservableObject implements WheelPickerManager {
  visible: boolean
  text: string
  wheels: WheelManager[]

  constructor() {
    super()
    this.visible = false
    this.text = ''
    this.wheels = [new WheelManager(() => {
      const result: string[] = []
      for (let i = MinWeight; i <= MaxWeight; i++) {
        result.push(`${i}${Suffix}`)
      }
      return result
    })]
  }

  @transaction
  setVisible(value: boolean): void {
    this.visible = value
  }

  @transaction
  onSave(values: string[]): void {
    const index = values[0].indexOf(Suffix)
    const value = Number.parseInt(values[0].substr(0, index))
    App.user.edited.weight = value
  }

  @reaction
  updateText(): void {
    const weight = App.user.edited.weight
    if ((weight !== undefined) && (weight > 0)) {
      this.text = `${weight}${Suffix}`
    }
  }

  @reaction
  updateWheels(): void {
    const wheel = this.wheels[0]
    wheel.selectedIndex = wheel.data.indexOf(this.text)
  }
}
