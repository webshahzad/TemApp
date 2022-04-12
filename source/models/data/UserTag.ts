//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { UserInfo } from './UserInfo'

export class UserTag {
  id: string = ''
  text: string = ''
  positionX?: number = undefined
  positionY?: number = undefined
  taggedUser?: UserInfo = undefined
  first_name?: string = undefined
  last_name?: string = undefined
  profile_pic?: string = undefined
}
