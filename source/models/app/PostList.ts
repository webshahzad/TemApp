//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { transaction } from 'reactronic'

import { FeedElement } from 'models/data/Feed'
import { PagedList, PagedListLoadingResponse } from './PagedList'

export enum UserPostDisplay {
  List,
  Masonry
}

export class PostList extends PagedList<FeedElement> {
  postDisplay: UserPostDisplay

  constructor(dataLoader: (page: number) => Promise<PagedListLoadingResponse<FeedElement>>) {
    super(dataLoader)
    this.postDisplay = UserPostDisplay.Masonry
  }

  @transaction
  setPostDisplay(value: UserPostDisplay): void {
    this.postDisplay = value
  }

  @transaction
  setPosts(posts: FeedElement[], page: number): void {
    this.clear()
    this.items = posts.slice()
    this.lastPartLength = this.items.length
    this.currentPage = page
  }
}
