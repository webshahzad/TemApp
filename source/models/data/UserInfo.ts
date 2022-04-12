//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { cached, ObservableObject, reaction } from 'reactronic'
import { UserId } from './UserId'
import { Address } from './Address'
import { ChatRoom } from './ChatRoom'
import { Alert, ImageSourcePropType } from 'react-native'
import UserDummy from 'assets/images/user-dummy2.png'

export class UserInfo extends ObservableObject implements UserId {
  _id: string = '' // this id is used for the member in a chat room
  email?: string = undefined
  first_name: string = ''
  username?: string = undefined
  last_name: string = ''
  // location?: string = undefined
  profile_pic?: string = undefined
  address?: Address = undefined
  status?: number = undefined //this will also hold the value of member in the chatroom whether the user can chat in this chatroom or not
  points?: number = undefined
  rank?: number = undefined
  priority?: number = undefined
  is_friend?: number = undefined
  liked_on?: string = undefined
  inviteAccepted?: number = undefined
  user_id: string = ''
  accountabilityMission?: string = undefined
  activityScore?: string = undefined
  isCompanyAccount?: number = undefined
  goalAndChallengeCount?: number = undefined

  feed_posted?: number = undefined
  number_of_temmates?: number = undefined
  number_of_tems?: number = undefined
  is_private?: number = undefined
  friend_status?: FriendshipStatus = undefined
  gym?: Address = undefined
  gym_name?: string = undefined
  profile_completion_percentage?: number = undefined

  chat_room_id: string = ''
  admin?: string = undefined // this will hold the chat group admin id in case of the group chat participants
  member_exist?: number = undefined // this holds the status whether the user already exists in the listing to be added
  /*
   This will have values 0, 1
   0:- Current user has already reminded this user once in a day
   1:- Current user can remind this user
   */
  reminder_status?: number = undefined
  activityCount?: ActivityCount = undefined
  chatRooms?: Array<ChatRoom> = undefined // contain the information of all the chat rooms of this particular user
  is_deleted?: number = undefined // 0 if chat is deleted by the user, 1 if chat is not deleted by the user
  score?: number = undefined

  @cached
  getId(): string {
    return (this.user_id.length > 0) ? this.user_id : this._id
  }



  getLocation(): string {
    let result = ''
    if (this.address) {
      if (this.address.city) {
        result += this.address.city
        if (this.address.country) {
          result += ', '
        }
      }
      result += this.address.country
    }
    return result
  }

  getAvatar(): ImageSourcePropType {
    if (this.profile_pic)
      return { uri: this.profile_pic }
    else
      return UserDummy
  }

  getFullName(): string {
    return `${this.first_name} ${this.last_name}`
  }
}

export enum FriendshipStatus {
  Other = 0,
  RequestSent = 1,
  Connected = 2, // friends with each other
  RequestReceived = 3,
  Blocked = 4,
}

export class ActivityCount extends ObservableObject {
  score?: number = undefined
  scoreFlag?: number = undefined
}

export class Peers extends ObservableObject {
  friends: Array<UserInfo> = []
  others: Array<UserInfo> = []
}
