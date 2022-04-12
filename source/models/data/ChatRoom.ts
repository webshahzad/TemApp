//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction } from 'reactronic'
import { UserInfo } from './UserInfo'
import { Message } from './Message'
import { GroupAdmin } from './ChatGroup'
import { GroupActivity } from './Activity'
import { Bool } from 'common/constants'

export class ChatRoom extends ObservableObject {
  chat_room_id: string = ''
  chat_status?: ChatStatus = undefined
  group_chat_status?: GroupChatStatus = undefined
  chat_initiated?: Bool = undefined
  type?: ChatType = undefined
  members: UserInfo[] = []
  memberIds: string[] = []
  lastMessage?: Message = undefined

  lastSeen?: number = undefined // last seen time for a chat room
  clearChatTime?: number = undefined // time at which the user clears the chat in a chat room
  unreadCount?: number = undefined

  group_title: string = '' // this will be the name of the other user in case of single chat and name of the group in case of group chat
  is_deleted?: Bool = undefined // 0 if chat is deleted by the user, 1 if chat is not deleted by the user
  group_id: string = ''
  interests?: GroupActivity[] = undefined
  image?: string = undefined
  description?: string = undefined
  imagePath?: string = undefined // this will store the path of the image either on firebase or AWS bucket
  adminData?: GroupAdmin = undefined
  members_count?: number = undefined
  created_at: number = 0
  is_mute?: Bool = undefined
  /// this will hold the type of chat eg. in challenge, or goal or normal
  chatWindowType: ChatWindowType = ChatWindowType.Normal
  /// this will hold the status whether the user has joined goal or challenge chat room
  isJoined?: Bool = undefined

  avgScore?: number = undefined

  editableByMembers: boolean = true
  visibility: Visibility = Visibility.Private

  @transaction
  updateStatus(chatStatus?: ChatStatus, groupChatStatus?: GroupChatStatus): void {
    if (chatStatus !== undefined)
      this.chat_status = chatStatus
    if (groupChatStatus !== undefined)
      this.group_chat_status = groupChatStatus
  }
}

export enum RemoveMemberStatus {
  Delete = 1,
  Exit = 2,
}

export enum ChatStatus {
  Blocked = 0,
  Active = 1,
  Unfriend = 2,
  BlockedByAdmin = 3,
  ProfileDeleted = 4,
}

export enum GroupChatStatus {
  Observer = -1, // the user is not part of the group, but is able to see info and messages
  NoLongerPartOfGroup = 0, // in case the member was removed from group or exited the group
  Active = 1,
  Blocked = 2,
}

export enum ChatType {
  SingleChat = 1,
  GroupChat = 2,
}

export enum ChatWindowType {
  Normal = 0,
  Challenge = 1,
  Goal = 2,
}

export enum Visibility {
  Private = 'private',
  Temates = 'temates',
  Public = 'public',
}

export namespace Visibility {
  export function toString(value: Visibility): string {
    switch (value) {
      case Visibility.Private: return 'Private'
      case Visibility.Temates: return 'Temates'
      case Visibility.Public: return 'Public'
      default: return 'N/A'
    }
  }
}
