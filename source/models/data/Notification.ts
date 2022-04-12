//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject } from 'reactronic'
import { Bool } from 'common/constants'

export class Notification extends ObservableObject {
  _id: string = ''
  reference_id: string = ''
  created_at: string = ''
  message: string = ''
  from: string = ''
  to: string = ''
  is_read: Bool = Bool.False
  type: NotificationType = NotificationType.Default
  userImage?: string = undefined
  group_id?: string = undefined
}

export enum NotificationType {
  Default = 0,
  CreatePost = 1,
  SentFriendRequest = 2,
  AcceptFriendRequest = 3,
  ToAdmin = 4,
  LikePost = 5,
  RemindFriendRequest = 6,
  CommentPost = 7,
  CreateChallenge = 8,
  CreateGoal = 9,
  SilentGoalCompleted = 10,
  Event = 11,
  Message = 12,
  NewGroupAdded = 13,
  ChallengeChat = 16,
  GoalChat = 17,
  MentalHealth = 18,
  MentalHealthEngagement = 19,
  MentalHealthTip = 20,
}
