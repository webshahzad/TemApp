//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Refreshable } from 'common/Refreshable'
import { transaction, ObservableObject, reaction, throttling, reentrance, Reentrance } from 'reactronic'
import { Api, ApiData } from 'models/app/Api'
import { UserInfo } from 'models/data/UserInfo'
import { populate } from 'common/populate'

export class Leaderboard extends ObservableObject {
  stored?: StoredLeaderboard = undefined
  search?: string = undefined
  tematesToAdd: UserInfo[] = []

  @reaction
  @throttling(1000)
  @reentrance(Reentrance.CancelPrevious)
  protected loadLeaderboard(): void {
    this.search // workaround to make reaction react to field changes
    void this.stored?.load()
    
  }

  @transaction
  initializeStoredLeaderboard(): StoredLeaderboard {
    this.stored = new StoredLeaderboard(this)
    return this.stored
  }

  @transaction
  async removeFromLeaderboard(user: UserInfo): Promise<void> {
    const response = await Api.call('POST', 'users/removeLeaderBoardMembers',
         {leaderBoardMember: user.getId()})         
         console.log("delete>>>>",response)

  }

  @transaction
  async addTematesToLeaderboard(): Promise<void> {
    const response = await Api.call('POST', 'users/addLeaderBoardMembers',
      { leaderBoardMembers: this.tematesToAdd.map(x => x._id) })
    this.tematesToAdd = []
  }
}

export class StoredLeaderboard extends Refreshable {
  myRank?: UserInfo
  topScoreMember?: UserInfo
  data?: UserInfo[]

  $leaderboard$: Leaderboard

  constructor(leaderboard: Leaderboard) {
    super()
    this.myRank = undefined
    this.topScoreMember = undefined
    this.data = []
    this.$leaderboard$ = leaderboard
  }

  @transaction
   async refresh(): Promise<void> {
    const params = this.$leaderboard$.search ? `?search=${this.$leaderboard$.search}` : ''
    const response: LeaderboardResponse = await Api.call('GET', 'users/leaderBoardList' + params)
       if (response.myRank) {
      response.myRank = populate(new UserInfo, response.myRank)
    }
    if (response.topScoreMember) {
      response.topScoreMember = populate(new UserInfo, response.topScoreMember)
    }
    response.data = response.data.map(u => populate(new UserInfo, u))
    this.apply(response)
  }
}

interface LeaderboardResponse extends ApiData<UserInfo[]> {
  myRank?: UserInfo
  topScoreMember?: UserInfo
}
