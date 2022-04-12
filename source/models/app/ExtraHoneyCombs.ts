//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction, monitor, reentrance, Reentrance } from 'reactronic'
import { Monitors } from 'models/app/Monitors'
import { Api, ApiData } from 'models/app/Api'
import { ShowHoneycomb } from 'models/data/GoalChallengeDetailsModel'
import { Bool } from 'common/constants'

const MaxExtraHoneyCombs = 6

export class ExtraHoneyCombs extends ObservableObject {
  data: ExtraHoneyComb[] = []
  newDelta: number = 0

  get canAddMore(): boolean {
    return this.data.length + this.newDelta < MaxExtraHoneyCombs
  }

  async isAddedToDashboard(type: HoneyCombType, id: string): Promise<Bool> {
    const showHoneyCombResponse = await Api.call<ApiData<ShowHoneycomb>>('GET',
      `users/checkHoneyCombScreen?type=${type}&id=${id}`)
    return showHoneyCombResponse.data.showHoneyComb
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async updateAddedToDashboard(type: HoneyCombType, status: boolean, id: string, name: string): Promise<string> {
    const body: AddUpdateHoneyComb = {
      id,
      name,
      status: status ? Bool.True : Bool.False,
      type,
    }
    const response = await Api.call('POST', 'users/addUpdateHoneyComb', body)
    if (status)
      this.newDelta += 1
    else
      this.newDelta -= 1
    return response.message
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async load(): Promise<void> {
    const response: ApiData<ExtraHoneyCombsResponse> = await Api.call('GET', 'users/getHoneyComb')
    this.data = response.data.honey_comb_screens
    this.newDelta = 0
  }
}

interface ExtraHoneyCombsResponse {
  honey_comb_screens: ExtraHoneyComb[]
}

interface ExtraHoneyComb {
  id: string
  goalPercent?: number
  name: string
  type: HoneyCombType
}

interface AddUpdateHoneyComb {
  id: string
  name: string
  status: Bool // 0 - remove, 1 - add
  type: HoneyCombType
}

export enum HoneyCombType {
  Tem = 1,
  Goal = 2,
  Challenge = 3,
}
