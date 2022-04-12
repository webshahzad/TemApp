//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction, reaction } from 'reactronic'

import { Api, ApiData } from './Api'
import { populate } from 'common/populate'
import { UserInfo } from 'models/data/UserInfo'
import { FeedElement } from 'models/data/Feed'
import { PostList } from './PostList'
import { PagedListLoadingResponse } from './PagedList'

export enum UserPostDisplay {
  List,
  Masonry
}

export class UserInspector extends ObservableObject {
  id: string
  user: UserInfo
  posts: PostList

  constructor(id: string) {
    super()
    this.id = id
    this.user = new UserInfo
    this.posts = new PostList(page => this.loadPosts(page))
  }

  @transaction
  updateUserInfo(): void {
    void this.readUserInfoImpl()
  }

  @reaction
  protected async readUserInfo(): Promise<void> {
    return this.readUserInfoImpl()
  }

  private async readUserInfoImpl(): Promise<void> {
    if (this.id) {
      try {
        const result = await Api.call<ApiData<ProfileInfo>>('GET', `profile?id=${this.id}&page=1`)
        const data = result.data
        populate(this.user, data.user)
        const posts = data.posts.map((info: any) => {
          const post = new FeedElement()
          populate(post, info)
          post.user = this.user
          return post
        })
        this.posts.setPosts(posts, 1)
      }
      catch (e) {
        console.log(e)
      }
    }
  }

  private async loadPosts(page: number): Promise<PagedListLoadingResponse<FeedElement>> {
    const response = await Api.call<ApiData<ProfileInfo>>('GET', `profile?id=${this.id}&page=${page}`)
    const posts = response.data.posts.map(e => {
      const post = populate(new FeedElement, e)
      post.user = this.user
      return post
    })
    return {
      items: posts,
    }
  }
}

export interface ProfileInfo {
  user: UserInfo
  posts: FeedElement[]
}
