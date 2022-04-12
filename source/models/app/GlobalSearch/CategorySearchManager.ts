//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Ref, ObservableObject, reaction } from 'reactronic'
import { Api } from '../Api'
import { PagedList, PagedListLoadingResponse } from '../PagedList'
import { populate } from 'common/populate'

export abstract class CategorySearchManager<T extends object> extends ObservableObject {
  private url: string
  private elementType: { new(): T }
  title: string
  filterRef: Ref<string>
  data: PagedList<T>

  abstract renderItem(item: T): JSX.Element
  abstract getKey(item: T, index: number): string

  constructor(url: string, title: string, filterRef: Ref<string>, elementType: { new(): T }) {
    super()
    this.url = url
    this.title = title
    this.filterRef = filterRef
    this.elementType = elementType
    this.data = new PagedList<T>((page: number) => this.loadData(page))
  }

  @reaction
  protected async loadDataOnFilterChange(): Promise<void> {
    if (this.filterRef.value)
      await this.data.loadItems()
    else
      this.data.clear()
  }

  private async loadData(page: number): Promise<PagedListLoadingResponse<T>> {
    const body = {
      page,
      filter: this.filterRef.value,
    }
    const response = await Api.call('POST', this.url, body)
    const data = (response as any).data
    return {
      items: data.map((e: any) => {
        const item = new this.elementType()
        populate(item, e)
        return item
      }),
    }
  }
}
