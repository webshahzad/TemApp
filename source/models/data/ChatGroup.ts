//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject } from 'reactronic'

export class ChatGroup extends ObservableObject {
}

export class GroupAdmin extends ObservableObject {
  first_name?: string = undefined
  last_name?: string = undefined
  user_id?: string = undefined
}
