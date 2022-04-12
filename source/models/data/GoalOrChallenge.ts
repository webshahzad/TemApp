//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject } from 'reactronic'
import { UserInfo } from './UserInfo'
import { formatShortDate, formatTimeDelta, formatTimeFromSeconds } from 'common/datetime'
import { toFixedPadded } from 'common/number'
import { CreateFundraising, LeaderGroup } from './GoalChallengeDetailsModel'

export enum ActivityStatus {
  InProgress = 1,
  Completed = 2,
  Upcoming = 3
}

export enum ActivityType {
  Challenge = 1,
  Goal = 2
}

export enum ChallengeType {
  // UserVsUser = "individual vs individual",
  // UserVsTeam = "individual vs Tem",
  // TeamVsTeam = "Tem vs Tem"
  UserVsUser = 1,
  UserVsTeam = 2,
  TeamVsTeam = 3
}

export enum ChallengeMemberType {
  User = 1,
  Team = 2
}

export function getActivityTypeName(gncType: ActivityType): string {
  let result: string
  switch (gncType) {
    case ActivityType.Goal:
      result = 'Goal'
      break
    case ActivityType.Challenge:
      result = 'Challenge'
      break
  }
  return result
}

export type ActivityTypeInList = {
  type: number
  activityName: string
  logo: string
}

export class GoalOrChallenge extends ObservableObject {
  _id: string = ''
  anyActivity: boolean = false
  activityTypes: ActivityTypeInList[] = []
  description?: string = ''
  duration: string = ''
  endDate: number = 0
  isJoined: boolean = false
  memberCount: number = 0
  name: string = ''
  startDate: number = 0
  status: ActivityStatus = ActivityStatus.Completed
  gncType: ActivityType = ActivityType.Goal
  




  // challenge only
  leader?: UserInfo | LeaderGroup = undefined
  leaderType?: ChallengeMemberType = undefined // TODO
  leadUser?: any = undefined
  leadTeam?: any = undefined
  type?: ChallengeType = undefined
  matric?: Metrics[] = undefined // typo in API
  myScore?: ActivityScore<UserInfo>[] = undefined

  // goal only
  scorePercentage?: number = undefined
  target?: GoalTarget[] = undefined
  totalScore?: number = undefined
  isPerPersonGoal?: boolean = undefined


  // TODO: return updatedAt from API to re-render properly
  updatedAt?: number = undefined

  getTypeName(): string {
    return this.anyActivity ? 'Any activity' : this.activityTypes.map(t => t.activityName).join(', ')
  }
}

export interface ActivityScore<T> {
  calories: number
  distanceCovered: number
  joined_date: number
  metScore: number
  rank: number
  score: number
  steps: number
  timeSpent: number // seconds
  totalActivites: number // typo in API
  userId: string
  scoreType?: ChallengeMemberType
  userInfo?: T
}

export const EmptyScore: ActivityScore<unknown> = {
  calories: 0,
  distanceCovered: 0,
  joined_date: 0,
  metScore: 0,
  rank: 0,
  score: 0,
  steps: 0,
  timeSpent: 0,
  totalActivites: 0,
  userId: '',
}

export interface GoalTarget {
  matric: Metrics // typo in API
  value: number
}

// From API model:
// 1= max steps, 2= max distance, 3= max calories, 4= total activity, 5= total activity time
export enum Metrics {
  Steps = 1,
  Distance,
  Calories,
  TotalActivities,
  TotalActivityTime
}

export const EmptyGoalTarget: GoalTarget = {
  matric: Metrics.TotalActivities,
  value: 0,
}

export function getMetricName(m: Metrics): string {
  let name: string
  switch (m) {
    case Metrics.Steps:
      name = 'Steps'
      break
    case Metrics.Distance:
      name = 'Distance'
      break
    case Metrics.Calories:
      name = 'Calories'
      break
    case Metrics.TotalActivities:
      name = 'Activities'
      break
    case Metrics.TotalActivityTime:
      name = 'Activity Time'
      break
  }
  return name
}

export function getMetricMaxMeasuringText(m: Metrics): string {
  let text: string
  switch (m) {
    case Metrics.Steps:
    case Metrics.Calories:
    case Metrics.Distance:
      text = 'Max'
      break
    default:
      text = 'Total'
  }
  return text
}

export function getMetricMeasureText(m: Metrics): string {
  let text: string
  switch (m) {
    case Metrics.Distance:
      text = 'Miles ' + getMetricName(m)
      break
    default:
      text = getMetricName(m)
      break
  }
  return text
}

export function getMetricMeasureTextForScoreTable(m: Metrics): string {
  let text: string
  switch (m) {
    case Metrics.Distance:
      text = getMetricName(m) + '\n' + '(miles)'
      break
    default:
      text = getMetricName(m)
      break
  }
  return text
}

export function getMetricExampleText(m: Metrics): string {
  let text: string = 'e.g. '
  switch (m) {
    case Metrics.Steps:
      text += '1000 steps'
      break
    case Metrics.Distance:
      text += '5.2 miles'
      break
    case Metrics.Calories:
      text += '2500 calories'
      break
    case Metrics.TotalActivities:
      text += '10'
      break
    case Metrics.TotalActivityTime:
      text += '90 minutes'
      break
  }
  return text
}

// for Goal
export function getMetricValueString(m: Metrics, value: number): string {
  let result: string = ''
  switch (m) {
    case Metrics.Steps:
      result = toFixedPadded(value, 0, 0)
      break
    case Metrics.Distance:
      result = toFixedPadded(value, 0, 2)
      break
    case Metrics.Calories:
      result = toFixedPadded(value, 0, 0)
      break
    case Metrics.TotalActivities:
      result = toFixedPadded(value, 0, 0)
      break
    case Metrics.TotalActivityTime:
      result = formatTimeFromSeconds(value)
      break
  }
  return result
}

// for Challenge
export function getMetricValueStringFromScore(m: Metrics, score: ActivityScore<unknown>): string {
  let value: string = ''
  switch (m) {
    case Metrics.Steps:
      value = toFixedPadded(score.steps, 0, 0)
      break
    case Metrics.Distance:
      value = toFixedPadded(score.distanceCovered, 0, 2)
      break
    case Metrics.Calories:
      value = toFixedPadded(score.calories, 0, 0)
      break
    case Metrics.TotalActivities:
      value = toFixedPadded(score.totalActivites, 0, 0)
      break
    case Metrics.TotalActivityTime:
      value = formatTimeFromSeconds(score.timeSpent)
      break
  }
  return value
}

export function getGoalChallengeTimeInfo(start: number, end: number, status: ActivityStatus, now: number): string {
  let timeInfo: string
  if (status === ActivityStatus.InProgress) {
    timeInfo = `${formatTimeDelta(now, end)} Remaining`
  }
  else if (status === ActivityStatus.Upcoming) {
    timeInfo = `Starting in ${formatTimeDelta(now, start)}`
  }
  else {
    const startDate = formatShortDate(new Date(start))
    const endDate = formatShortDate(new Date(end))
    timeInfo = `${startDate} - ${endDate}`
  }
  return timeInfo
}

export class MetricSelection {
  metric: Metrics
  name: string
  maxMeasuringText: string
  example: string
  selectable: boolean
  

  constructor(metric: Metrics, selectable: boolean = true) {
    this.metric = metric
    this.name = getMetricName(metric)
    this.maxMeasuringText = getMetricMaxMeasuringText(metric)
    this.example = getMetricExampleText(metric)
    this.selectable = selectable
    
}
}

export const MetricsList: MetricSelection[] = [
  new MetricSelection(Metrics.Steps, false), // to correctly display old Challenges and Goals with Steps
  new MetricSelection(Metrics.Distance),
  new MetricSelection(Metrics.Calories),
  new MetricSelection(Metrics.TotalActivities),
  new MetricSelection(Metrics.TotalActivityTime),
]

export const DurationList: string[] = [
  '1 day',
  '2 days',
  '3 days',
  '4 days',
  '5 days',
  '6 days',
  '1 week',
  '2 weeks',
  '3 weeks',
  '1 month',
  '2 months',
  '3 months'
]
export const typeList: number[] = [
  1,2,3
// 'individual vs individual',
// 'individual vs Tem',
// 'Tem vs Tem',
]

export class GNCFundraising extends ObservableObject {
  destination?: GNCFundraisingDestination = undefined
  goalAmount?: number = undefined
  collectedAmount?: number = undefined

  percent(): number | undefined {
    if (this.goalAmount !== undefined && this.goalAmount > 0 && this.collectedAmount != undefined)
      return this.collectedAmount * 100 / this.goalAmount
    else
      return undefined
  }
}

export enum GNCFundraisingDestination {
  Self = 'self',
  Tem = 'tem',
}

export const FundsDestinationList: GNCFundraisingDestination[] = Object.values(GNCFundraisingDestination)

export function getFundsDestinationText(destination: GNCFundraisingDestination): string {
  let result: string
  switch (destination) {
    case GNCFundraisingDestination.Self:
      result = 'Self'
      break
    case GNCFundraisingDestination.Tem:
      result = 'TĒM Up Foundation'
      break
  }
  return result
}

export type ActivitySelection = boolean
export const ActivitySelectionValues = [true, false]

export function getActivitySelectionText(value: ActivitySelection): string {
  return value ? 'Any Activity' : 'Selection'
}
