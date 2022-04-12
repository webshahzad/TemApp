//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Focus } from 'common/Focus'
import { ObservableObject, transaction } from 'reactronic'
import { Ref } from 'reactronic'

interface DatePickerOptions {
  model: Ref<string | Date | undefined>
  convertToString: boolean
  timePicker?: boolean
  format: (d: Date) => string
}

export class DatePickerManager extends ObservableObject {
  visible: boolean
  model: Ref<string | Date | undefined>
  convertToString: boolean
  timePicker: boolean
  format: (d: Date) => string

  mode: 'date' | 'time'
  value: Date

  private focus?: Focus

  constructor({ model, convertToString, timePicker, format }: DatePickerOptions) {
    super()
    this.model = model
    this.value = new Date(this.model.value ?? new Date())
    this.convertToString = convertToString
    this.timePicker = timePicker ?? false
    this.format = format
    this.visible = false
    this.mode = 'date'
    this.focus = undefined
  }

  get date(): Date | undefined {
    let result: Date | undefined = undefined
    const value = this.model.value
    if (value !== undefined) {
      result = new Date(value)
    }
    return result
  }

  get dateString(): string {
    const date = this.date
    return date ? this.format(date) : ''
  }

  @transaction
  setValue(date: Date): void {
    this.model.value = this.convertToString ? date.toString() : date
  }

  @transaction
  show(focus: Focus): void {
    this.mode = 'date'
    this.focus = focus
    this.focus.setFocused(true)
    this.setVisible(true)
  }

  @transaction
  next(date: Date | undefined): void {
    if (date) {
      this.value = date
      if (this.timePicker && this.mode == 'date') {
        this.mode = 'time'
      }
      else {
        this.apply()
        this.hide()
      }
    }
    else {
      this.hide()
    }
  }

  private apply(): void {
    this.model.value = this.convertToString ? this.value.toString() : this.value
  }

  private hide(): void {
    this.focus?.setFocused(false)
    this.setVisible(false)
  }

  private setVisible(value: boolean): void {
    this.visible = value
  }
}
