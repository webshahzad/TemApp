//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, monitor, transaction } from 'reactronic'
import { Monitors } from 'models/app/Monitors'
import { Api, ApiData } from 'models/app/Api'
import { Refreshable } from 'common/Refreshable'
import DownArrow from 'assets//icons/down1/down1.png'
import UpArrow from 'assets//icons/upTilted/upTilted.png'
import { App } from 'models/app/App'

export class UserReport extends Refreshable {
  challenges = new UserChallengesReport()
  goals = new UserGoalsReport()
  graph = new Array<UserGraphReportItem>()
  totalActivityReport = new UserActivityReport()

  @transaction
  protected async refresh(short: boolean = false): Promise<void> {
    const response = await Api.call<ApiData>('GET', short ? 'reports?fullReport=0' : 'reports?fullReport=1&graph=1')
    const data = await response.data
    App.user.accountabilityIndex = data.totalActivityReport.activityAccountability.value
    this.apply(response.data)
  }
}

export class UserChallengesReport extends ObservableObject {
  active?: number = undefined
  completed?: number = undefined
  pending?: number = undefined
  total?: number = undefined
  won?: number = undefined
  flag?: number = undefined
}

export class UserGoalsReport extends ObservableObject {
  total?: number = undefined
  completed?: number = undefined
  won?: number = undefined
  active?: number = undefined
  flag?: number = undefined
}

export class UserGraphReportItem {
  date: string = ''
  score: number = 0
}

export class UserActivityReport extends ObservableObject {
  totalAppScore = 0
  goalCompletionRate = 0
  activityAccountability = new AverageStats()
  activityTypes = new ActivityTypes()
  averageCalories = new AverageStats()
  averageDailySteps = new AverageStats()
  averageDistance = new AverageStats()
  averageDuration = new AverageStats()
  averageSleep = new AverageStats()
  totalActivities = new AverageStats()
  totalActivityScore = new AverageStats()
  totalActivityTypes = new AverageStats()

  @transaction
  increaseTotalActivities(count: number = 1): void {
    if (this.totalActivities.value !== undefined)
      this.totalActivities.value += count
  }

  @transaction
  decreaseTotalActivities(): void {
    if (this.totalActivities.value !== undefined && this.totalActivities.value > 0)
      this.totalActivities.value--
  }
}

export class AverageStats extends ObservableObject {
  value?: number = undefined
  unit?: string = undefined
  flag: ReportFlag = 0
}

export class ActivityTypes extends ObservableObject {
  totalTypes = 0
  flag: ReportFlag = 0
  types: Array<{ id: number, name: string, image: string }> = []
}

export enum ReportFlag {
  LowStats = -1, // current stats is lower than the last
  SameStats = 0, // current stats is same to the last
  HighStats = 1, // current stats is higher than the last
}

export namespace ReportFlag {
  const colors = {
    [ReportFlag.LowStats]: '#ff6961',
    [ReportFlag.SameStats]: 'gray',
    [ReportFlag.HighStats]: '#50c878',
  }

  const icons = {
    [ReportFlag.LowStats]: DownArrow,
    [ReportFlag.SameStats]: UpArrow,
    [ReportFlag.HighStats]: UpArrow,
  }

  export function color(flag: ReportFlag | undefined): string {
    if (flag !== undefined)
      return colors[flag]
    else
      return 'gray'
  }

  export function icon(flag: ReportFlag | undefined): number {
    if (flag !== undefined)
      return icons[flag]
    else
      return UpArrow
  }
}
