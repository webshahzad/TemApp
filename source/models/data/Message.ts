//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Media } from './Media'
import { Bool } from 'common/constants'
import { ChatType } from './ChatRoom'
import { UserTag } from './UserTag'

export class Message {
  id: string = ''
  text?: string = undefined
  time: number = 0
  senderId: string = ''
  type: MessageType = MessageType.Text
  media?: Media = undefined
  isRead: Bool = Bool.False
  chat_room_id: string = ''
  uploadingStatus: MediaUploadStatus = MediaUploadStatus.Uploaded
  updatedAt?: number = undefined
  userIds?: string[] = undefined
  chatType?: ChatType = undefined
  taggedUsers?: UserTag[] = undefined
}

export enum MessageType {
  Text = 0,
  Image,
  Video,
}

export enum MediaUploadStatus {
  Uploaded = 0,
  Uploading = 1,
  Error = 2,
}
