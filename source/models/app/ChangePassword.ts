//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction, monitor, reentrance, Reentrance } from 'reactronic'
import { Api } from './Api'
import { Monitors } from './Monitors'

export class ChangePassword extends ObservableObject {
  oldPassword: string
  newPassword: string
  confirmedPassword: string

  constructor() {
    super()
    this.oldPassword = ''
    this.newPassword = ''
    this.confirmedPassword = ''
  }

  canPost(): boolean {
    return (this.oldPassword !== '') &&
      (this.newPassword !== '') &&
      (this.confirmedPassword !== '') &&
      (this.newPassword === this.confirmedPassword)
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async post(): Promise<void> {
    try {
      await Api.call('POST', 'users/changePassword', {
        currentPassword: this.oldPassword,
        newPassword: this.newPassword,
        confirmPassword: this.confirmedPassword,
      })
      this.oldPassword = ''
      this.newPassword = ''
      this.confirmedPassword = ''
    }
    catch (e) {
      console.log(e)
    }
  }
}
