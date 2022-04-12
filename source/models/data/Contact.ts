//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject } from 'reactronic'

export class Contact extends ObservableObject {
  name?: string = undefined
  avatarData?: string = undefined // binary data?
  phoneNumber: Array<string> = []
  email: Array<string> = []
  isSelected: boolean = false
  isInvited: boolean = false
}
