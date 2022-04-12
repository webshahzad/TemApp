//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction, reaction } from 'reactronic'

import { App } from './App'
import { WheelManager, WheelPickerManager } from './WheelPickerManager'

const MinInch = 0
const MaxInch = 11
const MinFoot = 4
const MaxFoot = 8
const InchSuffix = '\'\''
const FootSuffix = '\''

export class HeightManager extends ObservableObject implements WheelPickerManager {
  visible: boolean
  text: string
  wheels: WheelManager[]

  constructor() {
    super()
    this.visible = false
    this.text = ''
    this.wheels = [
      new WheelManager(() => {
        const result: string[] = []
        for (let i = MinFoot; i <= MaxFoot; i++) {
          result.push(`${i}${FootSuffix}`)
        }
        return result
      }),
      new WheelManager(() => {
        const result: string[] = []
        for (let i = MinInch; i <= MaxInch; i++) {
          result.push(`${i}${InchSuffix}`)
        }
        return result
      })
    ]
  }

  @transaction
  setVisible(value: boolean): void {
    this.visible = value
  }

  @transaction
  onSave(values: string[]): void {
    const height = App.user.edited.height

    const footIndex = values[0].indexOf(FootSuffix)
    const footValue = Number.parseInt(values[0].substr(0, footIndex))
    height.feet = footValue

    const inchIndex = values[1].indexOf(FootSuffix)
    const inchValue = Number.parseInt(values[1].substr(0, inchIndex))
    height.inch = inchValue
  }

  @reaction
  updateText(): void {
    const height = App.user.edited.height
    const foot = height.feet
    const inch = height.inch

    let text = ''
    if ((foot !== undefined) && (foot > 0)) {
      text += `${foot}${FootSuffix} `
    }
    if ((inch !== undefined) && (inch > 0)) {
      text += `${inch}${InchSuffix}`
    }

    this.text = text
  }

  @reaction
  updateWheels(): void {
    const height = App.user.edited.height

    const footWheel = this.wheels[0]
    footWheel.selectedIndex = footWheel.data.indexOf(`${height.feet}${FootSuffix}`)

    const inchWheel = this.wheels[1]
    inchWheel.selectedIndex = inchWheel.data.indexOf(`${height.inch}${InchSuffix}`)
  }
}
