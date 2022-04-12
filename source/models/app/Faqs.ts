//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction, monitor, reentrance, Reentrance } from 'reactronic'
import { Api, ApiData } from './Api'
import { Monitors } from './Monitors'
import { populate } from 'common/populate'

export class Faqs extends ObservableObject {
  items: FaqItem[]

  constructor() {
    super()
    this.items = []
  }

  get needToLoad(): boolean {
    return (this.items.length === 0)
  }

  @transaction
  closeAll(): void {
    this.items.forEach(i => i.isOpen = false)
  }

  @transaction
  switchItem(item: FaqItem): void {
    const wasOpen = item.isOpen
    this.closeAll()
    if (!wasOpen)
      item.switchOpen()
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async load(): Promise<void> {
    const response: ApiData<FaqItem[]> = await Api.call('GET', 'faqs')
    this.items = response.data.map(i => populate(new FaqItem(), i))
  }
}

export class FaqItem extends ObservableObject {
  _id: string = ''
  description: string = ''
  heading: string = ''
  image: string[] = []
  isOpen: boolean = false

  @transaction
  switchOpen(): void {
    this.isOpen = !this.isOpen
  }
}
