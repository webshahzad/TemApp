//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject } from 'reactronic'
import { Address } from './Address'

export class PostLike extends ObservableObject {
  _id?: string = undefined
  first_name?: string = undefined
  username?: string = undefined
  last_name?: string = undefined
  location?: string = undefined
  profile_pic?: string = undefined
  user_id?: string = undefined
  statusWithMe?: number = undefined
  is_friend?: number = undefined
  liked_on?: string = undefined
  address?: Address = undefined
}
