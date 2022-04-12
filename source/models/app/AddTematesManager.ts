//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction, Ref, monitor, reentrance, Reentrance, unobservable, reaction, throttling } from 'reactronic'

import { UserInfo } from 'models/data/UserInfo'
import { App } from './App'
import { Monitors } from './Monitors'
import { PagedList, PagedListLoadingResponse } from './PagedList'
import { LoadSearchOptions, loadTemates, usersEqual } from './UserSearchManager'
import { Api, ApiData } from './Api'
import { ChatRoom } from 'models/data/ChatRoom'
import { populate } from 'common/populate'
import { Bool } from 'common/constants'
import { Alert } from 'react-native'

interface AddTematesOptions {
  tematesToAddRef?: Ref<UserInfo[]>
  disabledTematesRef?: Ref<UserInfo[] | undefined>
  selectedTemRef?: Ref<ChatRoom | undefined>
  showPublicTems?: boolean
  doNotMixTemAndTemates?: boolean
  onApply?: () => Promise<void>
}

export class AddTematesManager extends ObservableObject {
  tematesToAdd: UserInfo[] = []
  disabledTematesRef?: Ref<UserInfo[] | undefined> = undefined
  selectedTem?: ChatRoom = undefined
  showPublicTems: boolean = false
  doNotMixTemAndTemates: boolean = false

  @unobservable readonly temates: PagedList<UserInfo, LoadSearchOptions>
  @unobservable readonly tems: PagedList<ChatRoom, LoadSearchOptions>
  @unobservable readonly publicTems: PagedList<ChatRoom, LoadSearchOptions>
  filter: string = ''

  private tematesListToUpdateRef?: Ref<UserInfo[]> = undefined
  private selectedTemToUpdateRef?: Ref<ChatRoom | undefined> = undefined
  private onApply?: () => Promise<void> = undefined

  constructor() {
    super()
    this.temates = new PagedList(loadTemates, usersEqual)
    this.tems = new PagedList((page, options) => loadGroups('chat/groupList', page, options), groupsEqual)
    this.publicTems = new PagedList((page, options) => loadGroups('chat/publicGroupList', page, options), groupsEqual)
  }

  get showUsers(): boolean {
    return this.tematesListToUpdateRef !== undefined
  }

  get showTems(): boolean {
    return this.selectedTemToUpdateRef !== undefined
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async open(options: AddTematesOptions): Promise<void> {
    const {
      tematesToAddRef, disabledTematesRef, onApply, selectedTemRef, showPublicTems, doNotMixTemAndTemates,
    } = options

    this.tematesListToUpdateRef = tematesToAddRef
    this.selectedTemToUpdateRef = selectedTemRef
    this.disabledTematesRef = disabledTematesRef
    this.showPublicTems = showPublicTems ?? false
    this.doNotMixTemAndTemates = doNotMixTemAndTemates ?? false
    this.onApply = onApply

    if (this.tematesListToUpdateRef !== undefined) {
      this.tematesToAdd = this.tematesListToUpdateRef.value.slice()
    }
    if (this.selectedTemToUpdateRef !== undefined) {
      this.selectedTem = this.selectedTemToUpdateRef.value
    } else {
      this.selectedTem = undefined
    }
    App.rootNavigation.push('AddTemates')
  }

  @transaction
  toggleUserToBeAdded(user: UserInfo): void {
    const index = this.tematesToAdd.findIndex(x => x._id === user._id)
    const tematesToAddMutable = this.tematesToAdd.toMutable()
    if (index >= 0)
      tematesToAddMutable.splice(index, 1)
    else
      tematesToAddMutable.push(user)
    if (this.showTems && this.doNotMixTemAndTemates)
      this.selectedTem = undefined
    this.tematesToAdd = tematesToAddMutable
  }
  @reaction
  getttmates(): void {
    if (this.tematesToAdd) {
      console.log("newAnsk", this.tematesToAdd)
    }
  }
  @transaction
  toggleSelectedTem(group: ChatRoom): void {
    if (this.selectedTem?.group_id !== group.group_id)
      this.selectedTem = group
    else
      this.selectedTem = undefined
    if (this.showUsers && this.doNotMixTemAndTemates)
      this.tematesToAdd = []
  }

  @transaction
  @reentrance(Reentrance.CancelPrevious)
  async apply(): Promise<void> {
    if (this.tematesListToUpdateRef)
      this.tematesListToUpdateRef.value = this.tematesToAdd.slice()
    if (this.selectedTemToUpdateRef)
      this.selectedTemToUpdateRef.value = this.selectedTem
    if (this.onApply)
      await this.onApply()
    // this.reset()
  }

  @transaction
  reset(): void {
    this.tematesToAdd = []
    this.tematesListToUpdateRef = undefined
    this.disabledTematesRef = undefined
  }

  @transaction
  resetFilter(): void {
    this.filter = ''
  }

  @reaction
  @throttling(1000)
  @reentrance(Reentrance.CancelPrevious)
  protected updateLists(): void {
    if (Api.isAuthenticated()) {
      if (this.showUsers)
        void this.temates.loadItems({ search: this.filter })
      if (this.selectedTemToUpdateRef !== undefined) {
        void this.tems.loadItems({ search: this.filter })
        if (this.showPublicTems)
          void this.publicTems.loadItems({ search: this.filter })
      }
    }
  }
}

export function groupsEqual(group1: ChatRoom, group2: ChatRoom): boolean {
  return group1.group_id === group2.group_id
}

export async function loadGroups(path: string, page: number, options?: LoadSearchOptions): Promise<PagedListLoadingResponse<ChatRoom>> {
  let parameters = `page=${page}`
  if (options?.search)
    parameters += `&text=${options.search}`
  const response = await Api.call<ApiData<ChatRoom[]>>('GET', `${path}?${parameters}`)
  // TODO: move is_deleted filtering to API
  return {
    items: response.data.filter(d => d.is_deleted !== Bool.True).map(d => populate(new ChatRoom(), d)),
    totalCount: (response as any).count,
  }
}
