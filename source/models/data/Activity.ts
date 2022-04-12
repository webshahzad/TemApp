//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, unobservable, transaction, reaction } from 'reactronic'

import { formatDateDayShortMonthYear, formatTimeAmPm, formatTimeFromSeconds, timeFromSeconds } from 'common/datetime'
import { App } from 'models/app/App'
import { toFixedPadded } from 'common/number'
import { Timer } from 'common/Timer'
import { populate } from 'common/populate'
import { ActivityOrigin } from 'models/app/Fit/ActivityOrigin'

export enum ActivityType {
  Distance = 1,
  Duration = 2,
  None = 3, // Open
}

export interface ExternalActivityTypes {
  GoogleFit: string
  HealthKit: string
}

// export enum ActivityFields {
//   case activity
//   case metric
//   case metricValue
// }

export class ActivityData extends ObservableObject {
  id: number = 0
  name: string = ''
  // selectedActivityType?: number = undefined // this is the type of the activity selected. it would be either distance or duration
  // activityType?: number = undefined //this is the activity goal. It can be distance, duration and none(Open)
  image: string = ''
  met: number = 0
  activityType: ActivityType = ActivityType.None

  filterSelected: boolean = false // to build filter for total user activities request

  @transaction
  switchFilterSelected(): void {
    this.filterSelected = !this.filterSelected
  }
}

export class CombinedActivity extends ObservableObject {
  activityData?: ActivityProgress = undefined // this will contain the information about the activity performed
  duration?: number = undefined
  distance?: number = undefined
  calories?: number = undefined
  steps?: number = undefined
  heartRate?: number = undefined
}

export class MetricValue extends ObservableObject {
  id?: number = undefined
  value?: number = undefined
  unit?: string = undefined
}


export enum ActivityStateStatus {
  Started = 1,
  Completed = 2,
  Pending = 3,
}

export class ActivityProgress extends ObservableObject {
  @unobservable readonly activity: ActivityData
  @unobservable readonly activityProgressId: string // from server
  startTime: number = 0
  time: number = 0
  createdAt: Date
  duration: string = ''
  isScheduled: number = 0
  distance: number = 0 // miles
  // distanceFromCounterpart: number = 0

  // Internal
  private stepsParts: number[] = []
  private lastMileFinishAbsoluteTimeInSeconds: number = 0
  @unobservable private readonly externalTypes: ExternalActivityTypes | undefined
  @unobservable private readonly timer: Timer | undefined

  constructor(activity: ActivityData, progressId: string, externalTypes: ExternalActivityTypes | undefined, timer: Timer | undefined) {
    super()
    this.activity = activity
    this.activityProgressId = progressId
    this.createdAt = new Date()
    this.externalTypes = externalTypes
    this.timer = timer
  }

  calculateCalories(): number {
    return ActivityProgress.calculateCalories(this.elapsed, this.activity.met)
  }

  get elapsed(): number {
    return this.timer?.seconds ?? 0
  }

  get currentMileTime(): number {
    return this.elapsed - this.lastMileFinishAbsoluteTimeInSeconds
  }

  get steps(): number {
    let result: number = 0
    for (let i = 0; i < this.stepsParts.length; i++) // loop to subscribe
      result += this.stepsParts[i]
    return result
  }

  @transaction
  start(): void {
    this.startTime = Date.now()
    this.resume()
  }

  @transaction
  resume(): void {
    const stepsPartsMutable = this.stepsParts.toMutable()
    stepsPartsMutable.push(0)
    this.stepsParts = stepsPartsMutable
  }

  @transaction
  updateDistance(lastPart: number): void {
    const newDistance = this.distance + lastPart
    if (Math.trunc(newDistance) - Math.trunc(this.distance) >= 1) {
      this.lastMileFinishAbsoluteTimeInSeconds = this.elapsed
    }
    this.distance = newDistance
  }

  @transaction
  setCurrentStepsPart(steps: number): void {
    const n: number = this.stepsParts.length
    if (n > 0) {
      const stepsPartsMutable = this.stepsParts.toMutable()
      stepsPartsMutable[n - 1] = steps
      this.stepsParts = stepsPartsMutable
    }
  }

  @transaction
  setTime(time: number): void {
    this.time = time
  }

  static calculateCalories(timeSec: number, met: number): number {
    const weightPounds = App.user.stored.weight ?? 0
    const durationHours = timeSec / 3600
    return weightPounds / 2.205 * met * durationHours
  }
}

export class ActivitySummary extends ObservableObject {
  _id?: string = undefined
  duration?: string = undefined
  distanceCovered?: number = undefined
  calories?: number = undefined
  steps?: number = undefined
  heartRate?: number = undefined
  created_at?: Date = undefined
  selectedActivityType?: ActivityType = undefined
  timeSpent: number = 0
  startDate: number = 0
  endDate: number = 0
  updatedAt?: string = undefined
  origin: ActivityOrigin = ActivityOrigin.TEM

  // Activity part
  activityId?: number = undefined
  id?: number = undefined // = activityId
  name?: string = undefined
  image?: string = undefined
  met?: number = undefined
  activityType?: ActivityType = undefined

  // Internal
  combinedActivities?: ActivitySummary[] = undefined

  constructor(e: Partial<ActivitySummary>) {
    super()
    populate(this, e)
  }

  get distanceTracked(): boolean {
    return (this.activityType !== ActivityType.Duration)
  }

  getStartEndText(): string {
    const start = new Date(this.startDate)
    const end = new Date(this.endDate)
    let result: string
    if (start.toDateString() === end.toDateString()) {
      // same start and end dates
      result = `${formatDateDayShortMonthYear(start)} (${formatTimeAmPm(start)} - ${formatTimeAmPm(end)})`
    }
    else {
      // different start and end dates
      result = `${formatDateDayShortMonthYear(start)} ${formatTimeAmPm(start)} - ${formatDateDayShortMonthYear(end)} ${formatTimeAmPm(end)}`
    }
    return result
  }

  getDurationText(): string {
    return this.getShortDurationText() + ' hrs'
  }

  getShortDurationText(): string {
    return formatTimeFromSeconds(this.timeSpent)
  }

  getDistanceText(): string {
    const value: number = this.distanceCovered ?? 0
    return `${toFixedPadded(value, 0, 1)} Miles`
  }

  getShortDistanceText(): string {
    const value: number = this.distanceCovered ?? 0
    return `${toFixedPadded(value, 0, 1)} mi`
  }

  getCaloriesText(): string {
    const value: number = this.calories ?? 0
    return `${toFixedPadded(value, 0, 2)}`
  }

  getShortInfoForShot(): string {
    return `${this.getDurationText()} | ${this.getCaloriesText()} Calories`
  }
}

const UnknownActivity = -1

export class ActivityEdit extends ObservableObject {
  activityId: number
  timeSpent: number
  distance?: number
  summary: ActivitySummary // source to update

  // Internal
  activityPickerValue?: ActivityData = undefined
  timePickerValue: Date = new Date()
  isInvalid: boolean = false

  constructor(summary: ActivitySummary) {
    super()
    this.timeSpent = summary.timeSpent
    this.distance = summary.distanceCovered
    this.activityId = summary.activityId ?? UnknownActivity
    this.summary = summary
    const t = timeFromSeconds(this.timeSpent)
    this.timePickerValue.setHours(t.hours, t.minutes, t.seconds)
  }

  get hasValidActivity(): boolean {
    return this.activityId !== UnknownActivity
  }

  get hasValidTime(): boolean {
    return (this.timeSpent ?? 0) > 0
  }

  get hasValidDistance(): boolean {
    const checkDistance = this.isDistanceType()
    return !checkDistance || (this.distance ?? 0) > 0
  }

  getCalories(): number {
    return this.activityPickerValue ? ActivityProgress.calculateCalories(this.timeSpent, this.activityPickerValue.met) : 0
  }

  isDistanceType(): boolean {
    return (this.activityPickerValue?.activityType === ActivityType.Distance)
  }

  @transaction
  validate(): boolean {
    const isValid: boolean = (this.hasValidActivity && this.hasValidTime
      && this.hasValidDistance)
    this.isInvalid = !isValid
    return isValid
  }

  @transaction
  applySummary(): void {
    this.summary.distanceCovered = this.distance
    this.summary.timeSpent = this.timeSpent ?? 0
    this.summary.calories = this.getCalories()
    this.summary.id = this.activityPickerValue?.id
    this.summary.activityId = this.activityPickerValue?.id
    this.summary.activityType = this.activityPickerValue?.activityType
    this.summary.name = this.activityPickerValue?.name
    this.summary.image = this.activityPickerValue?.image
    this.summary.met = this.activityPickerValue?.met
    this.summary.updatedAt = new Date().toISOString()
  }

  @reaction
  protected pickActivity(): void {
    const pickerValue = this.activityPickerValue
    if (pickerValue !== undefined)
      this.activityId = pickerValue.id
  }

  @reaction
  protected updateTimeSpent(): void {
    const t = this.timePickerValue
    this.timeSpent = t.getHours() * 3600 + t.getMinutes() * 60 + t.getSeconds()
    console.log(t, this.timeSpent)
  }

  @transaction
  async setActivityPickerValue(): Promise<void> {
    const activityId = this.activityId
    if (App.activityManager.needToLoadActivityList)
      await App.activityManager.loadActivityList()
    const v = App.activityManager.activityList.find(a => a.id === activityId)
    this.activityPickerValue = v
  }
}

// API interfaces

export interface CreateActivity {
  activityType: ActivityType
  activityId: number
  activityTarget: string
  isScheduled?: boolean
}

export interface CompletedActivity {
  activityId: string
  status: ActivityStateStatus
  calories?: number
  timeSpent?: number
  distanceCovered?: number
  steps?: number
  sleep?: number
  isScheduled?: number
  startDate?: string
  endDate?: string
}

export interface GroupActivity {
  interest_id: string
  name: string
}
