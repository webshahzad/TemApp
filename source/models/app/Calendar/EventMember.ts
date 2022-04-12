//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { UserInfo } from 'models/data/UserInfo'

export enum AcceptanceStatus {
  Unknown = 0,
  Accepted,
  Declined,
  Pending
}

export class EventMember extends UserInfo {
  inviteAccepted: AcceptanceStatus = AcceptanceStatus.Unknown
  userId: string = ''
}
