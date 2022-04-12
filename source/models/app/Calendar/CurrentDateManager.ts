//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Ref, ObservableObject, Transaction, transaction, reaction } from 'reactronic'
import { WheelManager, WheelPickerManager } from '../WheelPickerManager'
import { MonthInfo, MonthNames } from './CalendarManager'

const YearRange = 30

export class CurrentDateManager extends ObservableObject implements WheelPickerManager {
  date: Ref<MonthInfo>
  visible: boolean
  text: string
  wheels: WheelManager[]

  private startYear: number

  constructor(date: Ref<MonthInfo>) {
    super()
    this.date = date
    this.visible = false
    this.text = ''

    const startYear = new Date().getFullYear() - YearRange
    this.startYear = startYear

    this.wheels = [
      new WheelManager(() => {
        const result: string[] = []
        for (let i = 0; i <= 11; i++) {
          result.push(this.getMonthName(i))
        }
        return result
      }),
      new WheelManager(() => {
        const result: string[] = []
        const endYear = startYear + YearRange * 2 + 1
        for (let i = startYear; i <= endYear; i++) {
          result.push(i.toString())
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
  onSave(values: string[], indexes?: number[]): void {
    const month = indexes![0]
    const year = parseInt(values[1])

    Transaction.run(() => {
      this.date.value = { month, year }
    })
  }

  @reaction
  protected updateText(): void {
    const info = this.date.value
    const monthName = this.getMonthName(info.month)
    this.text = `${MonthNames[info.month]} ${info.year}`
  }

  @reaction
  protected updateWheels(): void {
    const hourWheel = this.wheels[0]
    hourWheel.selectedIndex = this.date.value.month

    const minuteWheel = this.wheels[1]
    minuteWheel.selectedIndex = this.date.value.year - this.startYear
  }

  private getMonthName(month: number): string {
    return MonthNames[month]
  }
}
