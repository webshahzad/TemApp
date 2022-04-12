//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { populate } from 'common/populate'
import { UserInfo } from 'models/data/UserInfo'
import { ObservableObject, transaction, reaction, priority } from 'reactronic'
import { Api } from './Api'
import { PagedListApiData } from './PagedList'

export class FriendList extends ObservableObject {
  friends: UserInfo[] = []
  totalCount: number = 0

  options: LoadFriendsOptions = new LoadFriendsOptions()

  private currentPageNumber: number = 1

  @transaction
  reset(): void {
    this.currentPageNumber = 1
    this.options.clear()
  }

  @transaction
  loadMore(): void {
    if (this.friends.length < this.totalCount)
      this.currentPageNumber++
  }

  @reaction
  @priority(0)
  private prepareForSearch(): void {
    this.options.groupId
    this.options.search
    this.options.status
    this.options.userId
    this.currentPageNumber = 1
  }

  @reaction
  @priority(1)
  private async doLoadFriends(): Promise<void> {
    let query = `page=${this.currentPageNumber}`
    if (this.options.userId)
      query += `&user_id=${this.options.userId}`
    if (this.options.groupId)
      query += `&group_id=${this.options.groupId}`
    if (this.options.status)
      query += `&status=${this.options.status}`
    if (this.options.search)
      query += `&text=${this.options.search}`
    const response = await Api.call<PagedListApiData<UserInfo>>('GET', `network/friendList?${query}`)
    this.totalCount = response.count
    const friends = response.data.map(x => {
      const user = new UserInfo()
      populate(user, x)
      return user
    })
    if (this.currentPageNumber === 1)
      this.friends = friends
    else {
      const friendsMutable = this.friends.toMutable()
      friendsMutable.push(...friends)
      this.friends = friendsMutable
    }
  }
}

class LoadFriendsOptions extends ObservableObject {
  search?: string = undefined
  userId?: string = undefined
  groupId?: string = undefined
  status?: string = undefined

  @transaction
  clear(): void {
    this.search = undefined
    this.userId = undefined
    this.groupId = undefined
    this.status = undefined
  }
}
