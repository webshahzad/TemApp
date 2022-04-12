//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Address } from './Address'

export class UserId {
  _id?: string = undefined
  first_name?: string = undefined
  last_name?: string = undefined
  profile_pic?: string = undefined
  username?: string = undefined
  isCompanyAccount?: number = undefined
}

export class UserIdWithAddress extends UserId {
  address: Address = new Address()
}
