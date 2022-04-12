//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { toFixedPadded } from 'common/number'
import dayjs from 'dayjs'
import { Ref, ObservableObject, unobservable, Transaction, transaction, reaction } from 'reactronic'
import { WheelManager, WheelPickerManager } from '../WheelPickerManager'

export class TimeManager extends ObservableObject implements WheelPickerManager {
  time: Ref<any>
  visible: boolean
  text: string
  wheels: WheelManager[]
  @unobservable private readonly forActivity: boolean

  constructor({ time, forActivity = false }: { time: Ref<any>, forActivity?: boolean }) {
    super()
    this.time = time
    this.visible = false
    this.text = ''
    this.forActivity = forActivity
    this.wheels = [
      new WheelManager(() => {
        const result: string[] = []
        for (let i = 0; i <= 23; i++) {
          result.push(toFixedPadded(i, 2))
        }
        return result
      }),
      new WheelManager(() => {
        const result: string[] = []
        for (let i = 0; i <= 59; i++) {
          result.push(toFixedPadded(i, 2))
        }
        return result
      })
    ]
    if (this.forActivity) {
      this.wheels.push(
        new WheelManager(() => {
          const result: string[] = []
          for (let i = 0; i <= 59; i++) {
            result.push(toFixedPadded(i, 2))
          }
          return result
        })
      )
    }
  }

  @transaction
  setVisible(value: boolean): void {
    this.visible = value
  }

  @transaction
  onSave(values: string[]): void {
    const hours = parseInt(values[0])
    const minutes = parseInt(values[1])

    const current = new Date(this.time.value)
    const updated = new Date(current.getFullYear(), current.getMonth(), current.getDate(), hours, minutes)

    const seconds = this.forActivity ? parseInt(values[2]) : undefined
    if (seconds !== undefined)
      updated.setSeconds(seconds)

    Transaction.run(() => {
      if (typeof this.time.value === 'string') {
        this.time.value = updated.toString()
      } else if (typeof this.time.value === 'number') {
        this.time.value = updated.getTime()
      } else {
        this.time.value = updated
      }
    })
  }

  @reaction
  updateText(): void {
    this.text = getTimeDescription(new Date(this.time.value), this.forActivity)
  }

  @reaction
  updateWheels(): void {
    const current = new Date(this.time.value)

    const hourWheel = this.wheels[0]
    hourWheel.selectedIndex = current.getHours()

    const minuteWheel = this.wheels[1]
    minuteWheel.selectedIndex = current.getMinutes()

    if (this.forActivity) {
      const secondsWheel = this.wheels[2]
      secondsWheel.selectedIndex = current.getSeconds()
    }
  }
}

export function getTimeDescription(time: Date, forActivity: boolean = false): string {
  const format: string = forActivity
    ? 'HH:mm:ss'
    : 'hh:mm A'
  const result = dayjs(time).format(format)
  return result
}
