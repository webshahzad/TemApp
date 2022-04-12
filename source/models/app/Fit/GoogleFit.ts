//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { monitor, Reentrance, reentrance, ObservableObject, unobservable, transaction, reaction } from 'reactronic'
import { RNGoogleFit, RNGoogleFitActivityType } from 'native-modules/RNGoogleFit'
import { Alert, ToastAndroid } from 'react-native'
import dayjs from 'dayjs'
import { Api, ApiResponse } from '../Api'
import { ActivityOrigin } from './ActivityOrigin'
import { metersToMiles } from 'common/distance'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppModel } from '../App'
import { cancel, register, schedule } from 'react-native-background-job'
import Push from 'react-native-push-notification'
import { Monitors } from '../Monitors'

const GoogleFitSyncJobKey = 'google-fit:syncing-job'

const AskedForSyncEnableStorageKey = 'google-fit:asked-to-enable'
const SyncEnabledStorageKey = 'google-fit:enabled'
const TimestampStorageKey = 'google-fit:last-import-timestamp'

export class GoogleFit extends ObservableObject {
  @unobservable private readonly app: AppModel

  askedForSyncEnable?: boolean = undefined
  enabled?: boolean = undefined
  authorized: boolean = false

  constructor(app: AppModel) {
    super()
    this.app = app
  }

  @reaction
  protected async init(): Promise<void> {
    if (this.app.user.stored.token) {
      this.authorized = await RNGoogleFit.isAuthorized()
    }
  }

  @reaction
  protected async saveEnabledStatus(): Promise<void> {
    if (this.enabled === undefined)
      return
    await AsyncStorage.setItem(SyncEnabledStorageKey, this.enabled.toString())
  }

  @reaction
  protected async saveAskedToEnableStatus(): Promise<void> {
    if (this.askedForSyncEnable === undefined)
      return
    await AsyncStorage.setItem(AskedForSyncEnableStorageKey, this.askedForSyncEnable.toString())
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  async askToEnableActivitiesSync(): Promise<void> {
    let stored = await AsyncStorage.getItem(AskedForSyncEnableStorageKey)
    this.askedForSyncEnable = stored === 'true'
    stored = await AsyncStorage.getItem(SyncEnabledStorageKey)
    this.enabled = stored === 'true'
    if (this.askedForSyncEnable === false && this.enabled === false) {
      Alert.alert('', 'Would you like to enable automatic Google Fit activities syncing? You can enable it later in Profile & Temates -> Account -> Link Apps', [
        { text: 'No' },
        { text: 'Yes', onPress: this.enable }
      ])
      this.askedForSyncEnable = true
    }
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  @monitor(Monitors.Loading)
  async enable(): Promise<void> {
    this.enabled = true
    await this.authorize()
    await GoogleFit.importActivities()
  }

  @transaction
  private async authorize(): Promise<void> {
    if (await RNGoogleFit.authorize()) {
      ToastAndroid.show('Authorized with Google Fit', ToastAndroid.SHORT)
      this.authorized = true
    } else {
      ToastAndroid.show('Authorization with Google Fit is unsuccessful', ToastAndroid.SHORT)
      this.authorized = false
    }
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  @monitor(Monitors.Loading)
  async disable(): Promise<void> {
    this.enabled = false
    await RNGoogleFit.disconnect()
    this.authorized = false
    await AsyncStorage.removeItem(TimestampStorageKey)
  }

  @transaction
  @reentrance(Reentrance.CancelAndWaitPrevious)
  @monitor(Monitors.Loading)
  async reset(): Promise<void> {
    await this.disable()
    this.enabled = undefined
    this.askedForSyncEnable = undefined
    await AsyncStorage.multiRemove([SyncEnabledStorageKey, AskedForSyncEnableStorageKey])
  }

  @reaction
  protected async scheduleImportJob(): Promise<void> {
    if (this.enabled) {
      await schedule({
        jobKey: GoogleFitSyncJobKey,
        networkType: NetworkRequirements.NETWORK_TYPE_ANY,
        notificationTitle: 'TĒM',
        notificationText: 'Importing activities from Google Fit',
        allowExecutionInForeground: true,
        allowWhileIdle: true,
        timeout: 10000,
        period: config.googleFitSyncInterval,
      })
    }
    else {
      await cancel({ jobKey: GoogleFitSyncJobKey })
    }
  }

  static async importActivities(): Promise<void> {
    if (!Api.token)
      await Api.initTokenFromStorage()
    if (!Api.token) {
      console.log('Google Fit: no api token present, cancelling sync job')
      await cancel({ jobKey: GoogleFitSyncJobKey })
      return
    }
    const authorized = await RNGoogleFit.isAuthorized()
    if (!authorized) {
      await AsyncStorage.setItem(SyncEnabledStorageKey, 'false')
      console.log('Google Fit: missing authorization for reading activities')
      Push.localNotification({
        title: 'TĒM',
        message: 'Missing authorization for importing activities. Check in Profile & Temates -> Account -> Link Apps',
      })
      await cancel({ jobKey: GoogleFitSyncJobKey })
      return
    }
    const stored = await AsyncStorage.getItem(TimestampStorageKey)
    const lastImportTimestamp = stored ? Number(stored) : NaN
    const end = new Date().valueOf()
    const start = Number.isNaN(lastImportTimestamp) ?
      dayjs(end).subtract(1, 'month').valueOf() :
      dayjs(lastImportTimestamp).subtract(1, 'day').valueOf()
    let activities = await RNGoogleFit.getActivities(start, end)
    activities = activities.filter(x => !GoogleFit.IgnoredActivities.includes(x.type))
    activities.forEach(x => x.distance = metersToMiles(x.distance))

    await Api.call<ApiResponse>('POST', 'users/activity/import', {
      start,
      end,
      origin: ActivityOrigin.GoogleFit,
      activities,
    })
    await AsyncStorage.setItem(TimestampStorageKey, end.toString())
    console.log(`Google Fit: Imported ${activities.length} activities`)
  }

  private static readonly IgnoredActivities: RNGoogleFitActivityType[] = [
    RNGoogleFitActivityType.ELEVATOR,
    RNGoogleFitActivityType.ESCALATOR,
    RNGoogleFitActivityType.IN_VEHICLE,
    RNGoogleFitActivityType.ON_FOOT,
    RNGoogleFitActivityType.SLEEP,
    RNGoogleFitActivityType.SLEEP_AWAKE,
    RNGoogleFitActivityType.SLEEP_DEEP,
    RNGoogleFitActivityType.SLEEP_LIGHT,
    RNGoogleFitActivityType.SLEEP_REM,
    RNGoogleFitActivityType.STILL,
    RNGoogleFitActivityType.UNKNOWN,
  ]
}

register({ jobKey: GoogleFitSyncJobKey, job: GoogleFit.importActivities })

enum NetworkRequirements {
  NETWORK_TYPE_NONE = 0,
  NETWORK_TYPE_ANY = 1,
  NETWORK_TYPE_UNMETERED = 2,
  NETWORK_TYPE_NOT_ROAMING = 3,
  NETWORK_TYPE_CELLULAR = 4,
}
