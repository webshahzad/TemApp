//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { monitor, Reentrance, reentrance, sensitive, Sensitivity, ObservableObject, Transaction, transaction, reaction } from 'reactronic'
import { Api, ApiCount, ApiData } from './Api'
import { Bool } from 'common/constants'
import { populate } from 'common/populate'
import { Notification } from 'models/data/Notification'
import { App } from './App'
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { Monitors } from './Monitors'

export class Notifications extends ObservableObject {
  private page = 1
  list: Notification[] = []

  deviceToken: string = ''

  @transaction
  reload(): void {
    sensitive(Sensitivity.ReactEvenOnSameValueAssignment, () =>
      this.page = 1)
    this.list = []
  }

  @transaction
  loadMore(): void {
    this.page++
  }

  @reaction
  @monitor(Monitors.NotificationsLoading)
  @reentrance(Reentrance.CancelAndWaitPrevious)
  protected async load(): Promise<void> {
    if (!Api.isAuthenticated()) return
    const path = `notifications?page=${this.page}`
    const response = await Api.call<ApiData<Notification[]>>('GET', path)
    for (const n of response.data) {
      const notification = new Notification()
      populate(notification, n)
      const listMutable = this.list.toMutable()
      listMutable.push(notification)
      this.list = listMutable
    }
  }

  @reaction
  protected async loadUnreadCount(): Promise<void> {
    if (!Api.isAuthenticated()) return
    for (const n of this.list) n.is_read // fake subscription
    const countResponse = await Api.call<ApiCount>('GET', 'notifications/count')
    App.user.stored.unreadNotiCount = countResponse.count
  }

  @transaction
  async markAsRead(notification: Notification): Promise<void> {
    await Api.call('GET', `notifications/${notification._id}`)
    notification.is_read = Bool.True
  }

  @transaction
  async delete(notification: Notification, index: number): Promise<void> {
    await Api.call('DELETE', 'notifications', { id: notification._id })
    const listMutable = this.list.toMutable()
    listMutable.splice(index, 1)
    this.list = listMutable
  }

  @transaction
  async markAllAsRead(): Promise<void> {
    await Api.call('GET', 'notifications/readall')
    for (const n of this.list)
      n.is_read = Bool.True
  }

  @transaction
  async deleteAll(): Promise<void> {
    await Api.call('GET', 'notifications/clear')
    this.list = []
  }

  @reaction
  protected async initPushNotifications(): Promise<void> {
    const notifications = messaging()
    this.deviceToken = await notifications.getToken()
    notifications.onTokenRefresh(token => Transaction.run(() =>
      this.deviceToken = token))
    notifications.onMessage(this.handleNotification)
  }

  @reaction
  protected async postDeviceToken(): Promise<void> {
    if (!Api.isAuthenticated()) return
    if (!this.deviceToken) return
    await Api.call('PUT', 'users/device_token', { device_token: this.deviceToken })
  }

  @transaction
  private handleNotification(message: FirebaseMessagingTypes.RemoteMessage): void {
    console.log('🔔 Notification received')
    console.log(message)
    // when the app is in foreground, remote notifications are not displayed
    // Push.localNotification({
    //   messageId: message.messageId,
    //   title: message.notification?.title,
    //   message: message.notification?.body ?? '',
    //   soundName: message.notification?.android?.sound,
    // })
    this.reload()
  }

  static async handleNotificationInBackground(message: FirebaseMessagingTypes.RemoteMessage): Promise<void> {
    console.log('🔔 Notification received (while app in background)')
    console.log(message)
    // no handling here
    // the notification is displayed in system notification area
    // tap on notification brings the app to foreground
  }
}

messaging().setBackgroundMessageHandler(Notifications.handleNotificationInBackground)
