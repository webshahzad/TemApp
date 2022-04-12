//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Monitor } from 'reactronic'

export abstract class Monitors {
  static Loading = Monitor.create('Loading', 0, 0)
  static Refreshing = Monitor.create('Refreshing', 0, 0)
  static FeedRefreshing = Monitor.create('FeedRefreshing', 0, 0)
  static UserPostsRefreshing = Monitor.create('UserPostsRefreshing', 0, 0)
  static NotificationsLoading = Monitor.create('Notifications', 0, 0)
  static ChatListLoading = Monitor.create('ChatList', 0, 0)
}
