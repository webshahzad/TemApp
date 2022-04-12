//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction, monitor, Reentrance, reentrance, Reactronic, unobservable, observableArgs } from 'reactronic'
import { Monitors } from 'models/app/Monitors'
import { Api, ApiData } from 'models/app/Api'
import { Address } from './Address'
import { Comment, UserComment } from './Comments'
import { populate } from 'common/populate'
import { App, AppModel } from 'models/app/App'
import { Media, MediaType } from './Media'
import { LikeStatus } from './Likes'
import { Post } from './Post'
import { UserInfo } from './UserInfo'
import { PagedList, PagedListLoadingResponse } from 'models/app/PagedList'

const UnknownPage: number = 0

export class Feed extends ObservableObject {
  @unobservable private readonly app: AppModel
  @unobservable readonly newPost: NewPost
  @unobservable readonly elements: PagedList<FeedElement>

  currentPostForComments?: FeedElement = undefined
  currentPostToView?: FeedElement = undefined

  constructor(app: AppModel) {
    super()
    this.app = app
    this.newPost = new NewPost(app)
    // To invalidate this.loadPosts cache on Feed reload, Date.now() is passed as `time` argument.
    this.elements = new PagedList(page => this.loadPosts(page, Date.now()), postsEqual)
  }

  @transaction
  @monitor(Monitors.Loading)
  async deletePost(post: FeedElement): Promise<void> {
    await Api.call('DELETE', 'posts', { id: post._id })
  }

  @transaction
  resetSelectedPostToView(): void {
    this.currentPostToView = undefined
  }

  @transaction
  @monitor(Monitors.Refreshing)
  async loadAndSelectPostToView(postId: string): Promise<void> {
    if (this.currentPostToView === undefined)
      this.currentPostToView = new FeedElement()
    await this.loadPost(postId, this.currentPostToView)
  }

  @transaction
  viewPost(post: FeedElement, onDelete?: () => void): void {
    this.currentPostToView = post
    this.app.rootNavigation.push('Post', { post_id: post._id, onDelete })
  }

  @transaction
  openPostComments(model: FeedElement): void {
    this.currentPostForComments = model
    this.app.rootNavigation.push('Comments')
  }

  @transaction
  async loadAndOpenPostComments(postId: string): Promise<void> {
    const post = new FeedElement()
    await this.loadPost(postId, post)
    this.openPostComments(post)
  }

  @transaction
  private async loadPost(postId: string, post: FeedElement): Promise<void> {
    const response = await Api.call<ApiData<FeedElement>>('GET', `posts/detail?post_id=${postId}`)
    populate(post, response.data)
  }

  // @monitor makes this method cached, @sensitiveArgs makes it rely on arguments.
  // To make it possible to reload posts on 1st page, `time` argument is passed
  // to invalidate cache on each call.
  @monitor(Monitors.FeedRefreshing)
  @observableArgs(true)
  async loadPosts(page: number, time: number): Promise<PagedListLoadingResponse<FeedElement>> {
    const response = await Api.call<ApiData<FeedElement[]>>('GET', `posts/${page}`)
    return {
      items: response.data.map(e => populate(new FeedElement, e)),
      totalCount: (response as any).count,
    }
  }
}

function postsEqual(a: FeedElement, b: FeedElement): boolean {
  return a._id === b._id
}

export class FeedElement extends Post {
  private lastCommentsPage: number
  @unobservable readonly userComment: UserComment

  constructor() {
    super()
    this.lastCommentsPage = UnknownPage
    this.userComment = new UserComment()
  }

  unmount(): void {
    Reactronic.dispose(this.userComment)
    Reactronic.dispose(this.address)
    Reactronic.dispose(this)
  }

  get needToLoadMoreComments(): boolean {
        return this.comment_count > 0    
      && (
        this.comments.length < this.comment_count
        || this.lastCommentsPage == UnknownPage
       
      )
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  @monitor(Monitors.Refreshing)
  async postComment(): Promise<void> {
    const response: ApiData<Comment> =
      await Api.call('POST', 'comments', {
        post_id: this._id,
        comment: this.userComment.value,
        commentTagIds: [], // ???
      })
    response.data.user_id = App.user.getUserId()
    const commentsMutable = this.comments.toMutable()
    commentsMutable.unshift(response.data)
    this.comments = commentsMutable
    // this.comment_count++
    // TODO: handle errors without clearing userComment
    this.userComment.clear()
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  @monitor(Monitors.Refreshing)
  async deleteComment(id: string, index: number): Promise<void> {
    const response = await Api.call('DELETE', 'comments', {
      comment_id: id,
    })
    const commentsMutable = this.comments.toMutable()
    commentsMutable.splice(index, 1)
    this.comments = commentsMutable
    this.comment_count--
  }

  @transaction
  async refreshComments(): Promise<void> {
    this.lastCommentsPage = UnknownPage
    await this.loadMoreComments(true)
  }

  @transaction
  @monitor(Monitors.Refreshing)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async loadMoreComments(clear: boolean = false): Promise<void> {
    this.lastCommentsPage++ // API page number starts from 1
    const response: ApiData<Array<Comment>> =
      await Api.call('GET', `comments/?post_id=${this._id}&page=${this.lastCommentsPage}`)
    const newElements = response.data
    if (clear) {
      this.comments = []
    }
    const commentsMutable = this.comments.toMutable()
    commentsMutable.push(...newElements)
    this.comments = commentsMutable
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async switchLike(): Promise<void> {
    if (this.like_status === LikeStatus.Liked) {
      this.like_status = LikeStatus.NotLiked
      this.likes_count--
    }
    else {
      this.like_status = LikeStatus.Liked
      this.likes_count++
    }

    await Api.call('PUT','posts/like', {
      post_id: this._id,
      status: this.like_status,
    })
  }

  @transaction
  async getShortLink(): Promise<string> {
    if (!this.shortLink) {
      const response: ApiData<string> = await Api.call('GET', `posts/share?post_id=${this._id}`)
      this.shortLink = response.data
    }
    return this.shortLink
  }
}
export class NewPost extends ObservableObject {
  @unobservable private readonly app: AppModel
  caption: string = ''

  constructor(app: AppModel) {
    super()
    this.app = app
  }

  @transaction
  @monitor(Monitors.Loading)
  async submit(): Promise<void> {
    const post = new Post()
    post.caption = this.caption.trim()
    post.address = new Address()
    const mediaItems: Media[] = []
    for (const imageUri of this.app.imageSelection.images) {
      const media = new Media()
      media.url = imageUri
      media.mimeType = 'image/jpg'
      media.type = MediaType.Photo
      media.extension = '.jpg'
      media.url = await Api.awsBucket.uploadFile(imageUri, 'image/jpg', 'UserID101' + 'media')
      media.preview_url = media.url
      mediaItems.push(media)
    }
    post.media = mediaItems
    // todo: location
    // todo: friends tagging
    const user = App.user.stored
    const postOwner = new UserInfo()
    postOwner.profile_pic = user.profile_pic
    postOwner.first_name = user.first_name
    postOwner.last_name = user.last_name
    postOwner._id = user._id
    postOwner.username = user.username
    // todo: offline storing & new posts sync

    const response = await Api.call('POST', 'posts', post)
    console.log(response)
  }
}
