//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, Transaction, transaction, sleep, unobservable, monitor, reentrance, Reentrance } from 'reactronic'
import { Api, ApiData } from './Api'
import { Monitors } from './Monitors'

export class ContactUs extends ObservableObject {
  subject: string
  description: string

  constructor() {
    super()
    this.subject = ''
    this.description = ''
  }

  canPost(): boolean {
    return (this.subject !== '' && this.description !== '')
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async post(): Promise<ApiData> {
    const response = await Api.call<ApiData>('POST', 'contactUs', {
      subject: this.subject,
      description: this.description,
    })
    this.subject = ''
    this.description = ''
    return response
  }
}
