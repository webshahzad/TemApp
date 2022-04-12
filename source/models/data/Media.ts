//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { UserTag } from './UserTag'

export class Media {
  url?: string = undefined
  type?: MediaType = undefined
  duration?: number = undefined
  mimeType?: string = undefined
  extension?: string = undefined
  preview_url?: string = undefined
  height?: number = undefined
  imageRatio?: number = undefined
  postTagIds: UserTag[] = []
}

export enum MediaType {
  Photo = 1,
  Video = 2,
}
