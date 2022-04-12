//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject } from 'reactronic'
import { Address } from './Address'
import { Comment } from './Comments'
import { UserInfo } from './UserInfo'
import { Likes, LikeStatus } from './Likes'
import { Media } from './Media'
import { UserTag } from './UserTag'

export class Post extends ObservableObject {
  _id: string = ''
  user: UserInfo = new UserInfo()
  caption: string = ''
  location?: [number, number] = undefined
  likes_count: number = 0
  likes: Likes[] = []
  // commentsText?: string = undefined
  comment_count: number = 0
  address?: Address = undefined
  created_at: string = ''
  updated_at?: string = undefined
  is_deleted?: boolean = undefined
  media: Media[] = []
  like_status: LikeStatus = LikeStatus.Undefined // isLikeByMe
  hashtags?: string[] = undefined
  shortLink?: string = undefined
  activityId?: string = undefined
  type?: PostType = undefined
  tempId?: string = undefined
  comments: Comment[] = []
  captionTagIds?: UserTag[] = undefined
  friendsCommentCount?: number = undefined
  friendsLikeCount?: number = undefined
  postType?: PostShareType = undefined
}

export enum PostType {
  Normal,
  Activity,
  Goal,
  Challenge,
}

export enum PostShareType {
  PostedByUser = 1,
  LikedByFriend,
  CommentByFriend,
}
