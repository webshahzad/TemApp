//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction, monitor, reentrance, Reentrance, Transaction, unobservable, reaction, Reactronic, standalone } from 'reactronic'
import { ImageSourcePropType, ImageURISource, ImageRequireSource, Vibration, NativeEventEmitter, NativeModules } from 'react-native'
import { Monitors } from './Monitors'
import { Api, ApiData } from './Api'
import { ActivityData, ActivityProgress, ActivityType, CompletedActivity, ActivityStateStatus, CreateActivity, ActivityEdit, ExternalActivityTypes } from 'models/data/Activity'
import BackgroundService, { BackgroundTaskOptions } from 'react-native-background-actions'
import Geolocation, { GeoPosition } from 'react-native-geolocation-service'
import haversine from 'haversine'
import Pedometer from 'react-native-pedometer-ios-android'

import ActivityIcon from 'assets/icons/Tabs/activity/act.png'

import { populate } from 'common/populate'
import { ActivitySummary } from 'models/data/Activity'
import { Timer } from 'common/Timer'
import { App } from './App'

const MaxActivityCount: number = 3

const UnknownPage: number = -1
const UnknownCount: number = -1

const CountdownSeconds: number = 3

export enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

const DefaultActivityProgress: ActivityProgress = Transaction.run(() => new ActivityProgress(new ActivityData(), '', undefined, undefined))


export class ActivityManager extends ObservableObject {
  activityList: ActivityData[]
  activityListForGoals: ActivityData[]

  private activityProgressChain: ActivityProgress[]
  @unobservable private timer: Timer
  isPlaying: boolean = false

  private positionWatchId?: any = undefined
  private lastPosition?: GeoPosition = undefined

  private pedometerEvents?: NativeEventEmitter = undefined

  private lastUserActivitiesPage: number = UnknownPage
  private lastUserActivitiesCount: number = UnknownCount
  private lastUserActivitiesSortParams: string = ''
  private lastUserActivitiesFilterParams: string = ''
  userActivitiesSort: SortOrder = SortOrder.Descending
  userActivities: ActivitySummary[] // ?

  constructor() {
    super()
    this.activityList = []
    this.activityListForGoals = []
    // TODO: default object
    this.activityProgressChain = []
    this.timer = new Timer()
    this.userActivities = []
  }

  //#region Activity Types

  get needToLoadActivityList(): boolean {
    return (this.activityList.length === 0)
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async loadActivityList(): Promise<void> {
    await this.loadActivityListInternal()
  }

  // Workaround to resolve reactronic conflict
  private async loadActivityListInternal(): Promise<void> {
    const response: ApiData<ActivityData[]> = await Api.call('GET', 'activity')
    this.activityList = response.data.map(d => populate(new ActivityData(), d))
  }

  get needToLoadActivityListForGoals(): boolean {
    return (this.activityListForGoals.length === 0)
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async loadActivityListForGoals(): Promise<void> {
    const response: ApiData<ActivityData[]> = await Api.call('GET', 'activity?type=2')
    this.activityListForGoals = response.data.map(d => populate(new ActivityData(), d))
  }

  //#endregion

  //#region User Activities

  hasNewActivities: boolean = false
  keyToDelete: string = '' // trick to make TotalActivities swipe-list work correctly

  @transaction
  setKeyToDelete(key: string): void {
    this.keyToDelete = key
  }

  get needToLoadMoreUserActivities(): boolean {
    return (this.lastUserActivitiesCount > 0)
  }

  get needToRefreshUserActivities(): boolean {
    return (this.lastUserActivitiesSortParams !== this.getSortParams()
      || this.lastUserActivitiesFilterParams !== this.getFilterParams())
  }

  getSortParams(): string {
    const sortParams: string = `sort=${this.userActivitiesSort}`
    return sortParams
  }

  getFilterParams(): string {
    let filterParams: string
    const filter: number[] = []
    for (const activity of this.activityList) {
      if (activity.filterSelected)
        filter.push(activity.id)
    }
    // show all when nothing selected
    if (filter.length > 0) {
      filterParams = filter.map(id => `filter[]=${id}`).join('&')
    }
    else {
      filterParams = ''
    }
    return filterParams
  }

  @transaction
  resetFilter(): void {
    this.activityList.forEach(a => a.filterSelected = false)
    this.userActivitiesSort = SortOrder.Descending
  }

  @transaction
  setUserActivitiesSort(value: SortOrder): void {
    this.userActivitiesSort = value
  }

  isUserActivitiesSortAscending(): boolean {
    return this.userActivitiesSort === SortOrder.Ascending
  }

  isUserActivitiesSortDescending(): boolean {
    return this.userActivitiesSort === SortOrder.Descending
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async deleteUserActivity(activity: ActivitySummary): Promise<string> {
    const response = await Api.call('POST', '/users/activity/delete', {
      activityId: activity._id,
    })
    const index = this.userActivities.findIndex(a => a._id === activity._id)
    if (index > -1) {
      const userActivitiesMutable = this.userActivities.toMutable()
      userActivitiesMutable.splice(index, 1)
      this.userActivities = userActivitiesMutable
      App.user.report.totalActivityReport.decreaseTotalActivities()
    }
    return response.message
  }

  @transaction
  @monitor(Monitors.Loading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async updateUserActivity(edit: ActivityEdit): Promise<string> {
    const activity = edit.summary
    const calories = edit.getCalories()
    const response = await Api.call('POST', '/users/activity/update', {
      id: activity._id,
      activityId: edit.activityId,
      distanceCovered: edit.distance,
      timeSpent: edit.timeSpent,
      calories,
    })
    return response.message
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async refreshUserActivities(): Promise<void> {
    this.lastUserActivitiesPage = UnknownPage
    this.lastUserActivitiesCount = UnknownCount
    this.hasNewActivities = false
    await this.loadMoreUserActivities(true)
  }

  @transaction
  @monitor(Monitors.Refreshing)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async loadMoreUserActivities(clear: boolean = false): Promise<void> {
    this.lastUserActivitiesPage++ // API page number starts from 1
    this.lastUserActivitiesSortParams = this.getSortParams()
    this.lastUserActivitiesFilterParams = this.getFilterParams()

    const page = this.lastUserActivitiesPage
    const sortParams = this.lastUserActivitiesSortParams
    const filterParams = this.lastUserActivitiesFilterParams
    const params = (sortParams ? '&' + sortParams : '') + (filterParams ? '&' + filterParams : '')
    const response: ApiData<{ resp: ActivitySummary[] }> =
      await Api.call('GET', `reports/getActivities?page=${page}${params}`)

    if (this.needToLoadActivityList)
      await this.loadActivityListInternal()

    // Set proper ActivityType
    const newElements = response.data.resp.map(item => {
      const activity = this.activityList.find(a => a.name === item.name)
      if (activity)
        item.activityType = activity.activityType
      return new ActivitySummary(item)
    })

    if (clear) {
      this.userActivities.forEach(x => Reactronic.dispose(x))
      this.userActivities = newElements
    } else {
      const userActivitiesMutable = this.userActivities.toMutable()
      userActivitiesMutable.push(...newElements)
      this.userActivities = userActivitiesMutable
    }
    this.lastUserActivitiesCount = newElements.length
  }

  //#endregion

  //#region Activity Tracking

  @reaction
  async initPedometerEvents(): Promise<void> {
    const isPedometerAvailable = await Pedometer.isSupported()
    if (isPedometerAvailable) {
      this.pedometerEvents = new NativeEventEmitter(NativeModules.Pedometer)
      this.pedometerEvents.addListener('StepCounter', (data: { steps: number }) => {
        this.updateCurrentSteps(data.steps)
      })
    }
  }

  get isPedometerAvailable(): boolean {
    return (this.pedometerEvents !== undefined)
  }

  get countdown(): number {
    return -(this.timer.seconds + 1)
  }

  get time(): number {
    return this.timer.seconds
  }

  get activityProgress(): ActivityProgress {
    const count = this.activityProgressChain.length
    if (count > 0)
      return this.activityProgressChain[count - 1]
    else
      return DefaultActivityProgress
  }

  get activityCount(): number {
    return this.activityProgressChain.length
  }

  get canAddActivity(): boolean {
    return this.activityProgressChain.length < MaxActivityCount
  }

  get trackDistance(): boolean {
    return (this.activityProgress.activity.activityType === ActivityType.Distance)
  }

  get displayCountdown(): boolean {
    return this.timer.seconds < 0
  }

  get hasActivityRunning(): boolean {
    return (this.activityProgressChain.length > 0)
  }

  get runningActivityName(): string {
    return this.activityProgress.activity.name
  }

  get runningActivityImage(): ImageURISource | ImageRequireSource {
    let result: ImageSourcePropType
    if (this.activityProgress.activity.image)
      result = { uri: this.activityProgress.activity.image }
    else
      result = ActivityIcon
    return result
  }

  @transaction @monitor(Monitors.Loading)
  async startActivity(activity: ActivityData): Promise<void> {
    if (this.canAddActivity) {
      const isFirstActivity: boolean = (this.activityProgressChain.length === 0)
      const response: ApiData<{ _id: string, externalTypes?: ExternalActivityTypes }> = await Api.call('POST', 'users/activity/start', {
        activityType: activity.activityType,
        activityId: activity.id,
        activityTarget: '',
        isScheduled: false,
      } as CreateActivity)
      const progressId: string = response.data._id
      const externalTypes = response.data.externalTypes

      const progress = new ActivityProgress(activity, progressId, externalTypes, this.timer)
      const activityProgressChainMutable = this.activityProgressChain.toMutable()
      activityProgressChainMutable.push(progress)
      this.activityProgressChain = activityProgressChainMutable
      this.isPlaying = true

      const countdown: number = isFirstActivity ? (CountdownSeconds + 1) : 0
      this.timer.reset({ countUpToZero: countdown })
      await BackgroundService.start(async () => {
        if (isFirstActivity) {
          await this.timer.start().waitForZero()
          Vibration.vibrate(250)
        }
        this.activityProgress.start()
        await this.backgroundTracking()
      }, {
        ...DefaultBackgroundTaskOptions,
        taskTitle: this.activityProgress.activity.name,
      })

      // TODO: send activity progress data to Wearable
    }
  }

  @transaction
  async pauseActivity(stopBackgroundTask?: boolean): Promise<void> {
    if (this.isPlaying) {
      this.isPlaying = false
      this.activityProgress.setTime(this.timer.seconds)
      if (this.isPedometerAvailable)
        Pedometer.stopStepCounter()
      this.timer.pause()
      if (stopBackgroundTask)
        await BackgroundService.stop()
      else {
        await BackgroundService.start(this.pausedTask, {
          ...DefaultBackgroundTaskOptions,
          taskTitle: this.activityProgress.activity.name + ' (Paused)',
        })
      }
      await this.stopGeolocationTracking()
      if (this.trackDistance)
        await this.trackLocation(false)
    }
  }

  @transaction
  async resumeActivity(): Promise<void> {
    if (!this.isPlaying) {
      this.activityProgress.resume()
      await BackgroundService.start(this.backgroundTracking, {
        ...DefaultBackgroundTaskOptions,
        taskTitle: this.activityProgress.activity.name,
      })
      this.isPlaying = true
    }
  }

  @transaction @monitor(Monitors.Loading)
  async stopActivity(): Promise<ActivitySummary> {
    if (this.isPlaying)
      await this.pauseActivity(true)
    else
      await BackgroundService.stop()

    const all = this.activityProgressChain
    const isCombined = all.length > 1

    const activities: CompletedActivity[] = all.map(a => ({
      activityId: a.activityProgressId,
      calories: a.calculateCalories(),
      steps: a.steps,
      distanceCovered: normalizeDistance(a.distance),
      status: ActivityStateStatus.Completed,
      timeSpent: a.time,
      isScheduled: a.isScheduled,
    } as CompletedActivity))

    await Api.call('POST', 'users/activity/complete', {
      activities,
    })

    const summary = standalone(() => Transaction.run(() => new ActivitySummary({
      name: all.map(a => a.activity.name).join(', '),
      image: isCombined ? '' : this.activityProgress.activity.image,
      calories: all.map(a => a.calculateCalories()).reduce((a, b) => a + b, 0),
      distanceCovered: all.map(a => a.distance).reduce((a, b) => a + b, 0),
      steps: all.map(a => a.steps).reduce((a, b) => a + b, 0),
      timeSpent: all.map(a => a.time).reduce((a, b) => a + b, 0),
      activityId: isCombined ? undefined : this.activityProgress.activity.id,
      activityType: isCombined ? ActivityType.None : this.activityProgress.activity.activityType,
      combinedActivities: isCombined ? all.map(a => new ActivitySummary({
        _id: a.activityProgressId,
        name: a.activity.name,
        image: a.activity.image,
        calories: a.calculateCalories(),
        distanceCovered: a.distance,
        steps: a.steps,
        timeSpent: a.time,
        activityType: a.activity.activityType,
      })) : undefined,
    })))

    this.activityProgressChain = []

    const filterUsed: boolean = this.lastUserActivitiesFilterParams.length > 0
    // TODO: check all new activities
    this.hasNewActivities = !filterUsed || all.map(a => a.activity.filterSelected).reduce((a, b) => a || b, false)
    standalone(() => App.user.report.totalActivityReport.increaseTotalActivities(activities.length))

    return summary
  }

  @transaction
  @reentrance(Reentrance.OverwritePrevious)
  async trackLocation(watch: boolean = true): Promise<void> {
    const position = await App.locationManager.getCurrentGeolocation({ maximumAge: MaxGeoPositionAgeMs })
    this.updateDistance(position)

    if (watch) {
      this.positionWatchId = Geolocation.watchPosition(
        position => this.updateDistance(position),
        error => console.log(error),
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: LocationIntervalMs,
          fastestInterval: FastestLocationIntervalMs,
        }
      )
    }
  }

  @transaction
  @reentrance(Reentrance.CancelPrevious)
  private updateDistance(position: GeoPosition): void {
    if (this.isPlaying && this.lastPosition && this.hasActivityRunning) {
      const lastPart: number = haversine(this.lastPosition.coords, position.coords, { unit: 'mile' })
      this.activityProgress.updateDistance(lastPart)
    }
    this.lastPosition = position
  }

  @transaction
  private async stopGeolocationTracking(): Promise<void> {
    const positionWatchId = this.positionWatchId
    if (positionWatchId !== undefined)
      Geolocation.clearWatch(positionWatchId)
    this.positionWatchId = undefined
  }

  /**
   * @returns `Promise` that never resolves!
   */
  private backgroundTracking: () => Promise<void> = () => {
    return new Promise<void>(async (_resolve, reject) => {
      try {
        // resolve is never called -- Task should be stopped manually
        this.timer.resume()
        if (this.isPedometerAvailable)
          Pedometer.startStepCounter()
        if (this.trackDistance)
          await this.trackLocation()
      }
      catch (e) {
        reject(e)
      }
    })
  }

  private updateCurrentSteps(current: number): void {
    this.activityProgress.setCurrentStepsPart(current)
  }

  private pausedTask: () => Promise<void> = () => {
    return new Promise<void>(async () => {
      // do nothing - just keep notification
    })
  }

  //#endregion
}

const LocationIntervalMs: number = 3 * 1000
const FastestLocationIntervalMs: number = 1 * 1000
const MaxGeoPositionAgeMs: number = 1 * 1000

const DefaultBackgroundTaskOptions: BackgroundTaskOptions = {
  taskName: 'Activity is running',
  taskTitle: '', // activity name
  taskDesc: 'Tap to show activity progress',
  taskIcon: {
    name: 'ic_notification',
    type: 'drawable',
  },
  color: '#ffffff',
  linkingURI: 'tem://activities/track',
}

function normalizeDistance(distance: number | undefined): number | undefined {
  if (distance !== undefined)
    return Math.trunc(distance * 100) / 100
  else
    return undefined
}
