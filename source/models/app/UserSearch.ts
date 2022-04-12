//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Reentrance, reentrance, ObservableObject, transaction, reaction, unobservable, nonreactive } from 'reactronic'

import { PagedList } from './PagedList'
import { UserInfo } from 'models/data/UserInfo'
import { populate } from 'common/populate'
import { Bool } from 'common/constants'
import { Api, ApiData } from './Api'
import { App } from './App'

const MinSearchFilterLength = 3

export interface UserSearchApiConfig {
  baseUrl: string
  filterParamName?: string
  pageParamName?: string
}

export interface UserSearchOptions {
  api: UserSearchApiConfig,
  filterExpandable?: boolean,
  canViewUserDetails?: boolean
}

export class UserSearch extends ObservableObject {
  @unobservable readonly temateResults: PagedList<UserInfo>
  @unobservable readonly nonTemateResults: PagedList<UserInfo>

  @unobservable private readonly apiConfig: UserSearchApiConfig
  @unobservable readonly filterExpandable: boolean
  @unobservable readonly canViewUserDetails: boolean

  filter: string
  filterExpanded: boolean

  constructor(options: UserSearchOptions) {
    super()
    this.temateResults = new PagedList<UserInfo>()
    this.nonTemateResults = new PagedList<UserInfo>(undefined, undefined, page => this.loadUserPage(page))

    this.apiConfig = options.api
    const expandable = (options.filterExpandable !== undefined) ? options.filterExpandable : false
    this.filterExpandable = expandable
    this.canViewUserDetails = (options.canViewUserDetails !== undefined) ? options.canViewUserDetails : true

    this.filter = ''
    this.filterExpanded = !expandable
  }

  hasResults(): boolean {
    return (this.temateResults.items.length > 0) || (this.nonTemateResults.items.length > 0)
  }

  @transaction
  setFilter(value: string): void {
    this.filter = value
  }

  @transaction
  clearFilter(): void {
    this.setFilter('')
  }

  @transaction
  toggleFilter(): void {
    const value = !this.filterExpanded
    this.filterExpanded = value
    if (!value) {
      this.clearFilter()
    }
  }

  @reaction @reentrance(Reentrance.CancelPrevious)
  protected async findUsers(): Promise<void> {
    if (this.filter.length >= this.getMinFilterLength()) {
      await this.loadUserPage(1)
    } else if (this.filter.length === 0) {
      this.temateResults.clear()
      this.nonTemateResults.clear()
    }
  }

  @transaction
  private async loadUserPage(page: number): Promise<void> {
    try {
      const response = await Api.call<ApiData>('GET', this.getApiUrl(page))
      const users = convertServerUsers(response.data as any[])
      const totalCount = (response as any).count

      const temates = nonreactive(() => users.filter(user => user.is_friend === Bool.True || user._id === App.user.id))
      if (page == 1) {
        this.temateResults.items = temates
      } else {
        const tematesMutable = this.temateResults.items.toMutable()
        tematesMutable.push(...temates)
        this.temateResults.items = tematesMutable
      }
      const temateCount = nonreactive(() => this.temateResults.items.length)
      this.temateResults.totalCount = temateCount

      const nonTemates = nonreactive(() => users.filter(user => user.is_friend === Bool.False && user._id !== App.user.id))
      if (page == 1) {
        this.nonTemateResults.items = nonTemates
      } else {
        const nonTematesMutable = this.nonTemateResults.items.toMutable()
        nonTematesMutable.push(...nonTemates)
        this.nonTemateResults.items = nonTematesMutable
      }
      const nonTemateCount = nonreactive(() => this.nonTemateResults.items.length)
      this.nonTemateResults.totalCount = (totalCount !== undefined) ? (totalCount - temateCount) : nonTemateCount
    }
    catch (e) {
      console.log(e)
    }
  }

  private getApiUrl(page: number): string {
    const filterParamName = this.apiConfig.filterParamName ?? 'text'
    const pageParamName = this.apiConfig.pageParamName ?? 'page'
    return `${this.apiConfig.baseUrl}${filterParamName}=${this.filter}&${pageParamName}=${page}`
  }

  private getMinFilterLength(): number {
    return this.filterExpandable ? 0 : MinSearchFilterLength
  }
}

export const TemateSearchOptions: UserSearchOptions = {
  api: { baseUrl: 'network/search?' },
}

export function createOtherUserTemateSearchOptions(userId: string): UserSearchOptions {
  return {
    api: {
      baseUrl: `network/otherfriendList?user_id=${userId}&`,
      filterParamName: 'title',
    },
    filterExpandable: true,
    canViewUserDetails: false,
  }
}

function convertServerUsers(data: any[]): UserInfo[] {
  return data.map(x => {
    const u = new UserInfo()
    populate(u, x)
    return u
  })
}
