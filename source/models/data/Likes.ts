//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject } from 'reactronic'

export enum LikeStatus {
  Undefined = 0,
  Liked = 1,
  NotLiked = 2
}

export class Likes extends ObservableObject {
  _id?: string = undefined
  profile_pic?: string = undefined
}
