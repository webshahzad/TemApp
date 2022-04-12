//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction } from 'reactronic'
import { Ref } from 'reactronic'

export class PickerManager<TOption> extends ObservableObject {
  options: TOption[]
  model?: Ref<TOption | undefined>
  selectedIndex: number
  visible: boolean

  constructor(options: TOption[], model?: Ref<TOption | undefined>) {
    super()
    this.options = options.slice()
    this.model = model
    if (model && model.value !== undefined)
      this.selectedIndex = options.indexOf(model.value)
    else
      this.selectedIndex = -1
    this.visible = false
  }

  get selectedOption(): TOption | undefined {
    let result: TOption | undefined = undefined
    if (this.selectedIndex >= 0 && this.selectedIndex < this.options.length)
      result = this.options[this.selectedIndex]
    return result
  }

  @transaction
  setOptions(options: TOption[]): void {
    this.options = options.slice()
  }

  @transaction
  selectOption(index: number): void {
    this.selectedIndex = index
    if (this.model) {
      this.model.value = this.selectedOption
    }
  }

  @transaction
  setVisible(value: boolean): void {
    this.visible = value
  }
}
