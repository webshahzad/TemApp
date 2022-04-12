//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction } from 'reactronic'
import { UserId } from './UserId'
import { UserTag } from './UserTag'

export class UserComment extends ObservableObject {
  value: string = ''

  @transaction
  clear(): void {
    this.value = ''
  }
}

export class Comment {
  _id: string = ''
  post_id: string = ''
  created_at: string = ''
  updated_at: string = ''
  comment: string = ''
  is_deleted: boolean = false
  user_id: UserId = new UserId()
  commentTagIds?: UserTag[] = undefined // ??
}
