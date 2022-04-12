//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction } from 'reactronic'
import { Ref } from 'reactronic'

export class MultiplePickerManager<TOption> extends ObservableObject {
  options: TOption[]
  model: Ref<TOption[]>
  selectedIndexes: number[]
  visible: boolean
  comparer: (a: TOption, b: TOption) => boolean

  constructor(options: TOption[], model: Ref<TOption[]>, comparer?: (a: TOption, b: TOption) => boolean) {
    super()
    this.options = options.slice()
    this.comparer = comparer ?? defaultComparer
    this.model = model
    if (model.value !== undefined)
      this.selectedIndexes = model.value.map(item => options.findIndex(x => this.comparer(x, item)))
    else
      this.selectedIndexes = []
    this.visible = false
  }

  get selectedOptions(): TOption[] {
    return this.selectedIndexes.map(i => this.options[i])
  }

  isSelected(index: number): boolean {
    return this.selectedIndexes.includes(index)
  }

  @transaction
  setOptions(options: TOption[]): void {
    this.options = options.slice()
  }

  @transaction
  toggleOption(index: number): void {
    const i = this.selectedIndexes.findIndex(x => x === index)
    const selectedIndexesMutable = this.selectedIndexes.toMutable()
    const modelValueMutable = this.model.value.toMutable()
    if (i >= 0) {
      selectedIndexesMutable.splice(i, 1)
      modelValueMutable.splice(i, 1)
    } else {
      selectedIndexesMutable.push(index)
      modelValueMutable.push(this.options[index])
    }
    this.selectedIndexes = selectedIndexesMutable
    this.model.value = modelValueMutable
  }

  @transaction
  setVisible(value: boolean): void {
    this.visible = value
  }
}

function defaultComparer<TOption>(a: TOption, b: TOption): boolean {
  return a === b
}
