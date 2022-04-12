//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction, unobservable, reentrance, Reentrance } from 'reactronic'
import { ApiData } from './Api'

export interface PagedListLoadingResponse<T> {
  items: T[]
  totalCount?: number
}

const PaginationLimit: number = 15

export class PagedList<T, TOptions = any> extends ObservableObject {
  protected readonly firstPage: number = DefaultFirstPage

  items: T[]
  currentPage: number
  totalCount?: number
  lastPartLength?: number

  @unobservable private readonly dataLoader?: (page: number, options?: TOptions) => Promise<PagedListLoadingResponse<T>>
  @unobservable private readonly equalityComparer?: (item1: T, item2: T) => boolean
  @unobservable private readonly customDataPageLoader?: (page: number, options?: TOptions) => Promise<void>

  constructor(
    dataLoader?: (page: number, options?: TOptions) => Promise<PagedListLoadingResponse<T>>,
    equalityComparer?: (item1: T, item2: T) => boolean,
    customDataPageLoader?: (page: number, options?: TOptions) => Promise<void>) {
    super()
    this.items = []
    this.currentPage = this.firstPage
    this.totalCount = undefined
    this.lastPartLength = undefined
    this.dataLoader = dataLoader
    this.equalityComparer = equalityComparer
    this.customDataPageLoader = customDataPageLoader
  }

  hasMoreItems(): boolean {
    return (this.totalCount === undefined || this.items.length < this.totalCount) && (this.lastPartLength == undefined || this.lastPartLength >= PaginationLimit)
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async loadItems(options?: TOptions): Promise<void> {
    await this.loadItemsImpl(this.firstPage, options)
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async loadMoreItems(options?: TOptions): Promise<void> {
    if (this.customDataPageLoader) {
      const newPage = this.currentPage + 1
      await this.customDataPageLoader(newPage, options)
      this.currentPage = newPage
    } else {
      await this.loadItemsImpl(this.currentPage + 1, options)
    }
  }

  @transaction
  removeItem(item: T): void {
    let index = -1
    if (this.equalityComparer) {
      const existing = this.items.find(x => this.equalityComparer!(x, item))
      if (existing) {
        index = this.items.indexOf(existing)
      }
    } else {
      index = this.items.indexOf(item)
    }

    if (index !== -1) {
      const itemsMutable = this.items.toMutable()
      itemsMutable.splice(index, 1)
      this.items = itemsMutable
      if (this.totalCount !== undefined) {
        this.totalCount--
      }
    }
  }

  @transaction
  clear(): void {
    this.items = []
    this.lastPartLength = undefined
    this.currentPage = this.firstPage
    if (this.totalCount !== undefined) {
      this.totalCount = 0
    }
  }

  @transaction
  protected async loadItemsImpl(page: number, options?: TOptions): Promise<void> {
    if (this.dataLoader) {
      try {
        const response = await this.dataLoader(page, options)
        if (page === 1) { // reload
          this.items = response.items
          this.currentPage = page
        } else if (response.items.length) {
          const itemsMutable = this.items.toMutable()
          itemsMutable.push(...response.items)
          this.items = itemsMutable
          this.currentPage = page
        }

        if (response.totalCount !== undefined) {
          this.totalCount = response.totalCount
        }

        this.lastPartLength = response.items.length
      }
      catch (e) {
        console.log(e)
      }
    }
  }
}

export interface PagedListApiData<T = unknown> extends ApiData<T[]> {
  count: number
}

const DefaultFirstPage = 1
