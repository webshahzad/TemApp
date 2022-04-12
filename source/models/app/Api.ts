//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, Transaction, unobservable, transaction, reaction } from 'reactronic'
import { NativeModules, Alert, AlertButton, ToastAndroid } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import * as RNLocalize from 'react-native-localize'
import { App, AppModel } from './App'
import { AwsCredentials } from 'models/data/AwsCredentials'
import { formatDateTime } from 'common/datetime'
import { User } from './User'
import { Bool } from 'common/constants'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface ApiResponse {
  message: string
  status: number
}

export interface ApiData<T = unknown> extends ApiResponse {
  data: T
}

export interface ApiDataWithCount<T> extends ApiData<T> {
  count: number
}

export interface ApiCount extends ApiResponse {
  count: number
}

export class ApiModel extends ObservableObject {
  @unobservable readonly serverUrl: string
  @unobservable readonly apiUrl: string
  clientVersion: string
  token?: string
  @unobservable readonly awsBucket: AwsBucketManager

  constructor() {
    super()
    this.serverUrl = config.serverUrl
    this.apiUrl = this.serverUrl + config.apiVersion
    this.clientVersion = config.version
    this.token = undefined
    this.awsBucket = new AwsBucketManager()
  }

  @reaction
  protected printWatchDebugInfo(): void {
    if (this.token)
      console.log(JSON.stringify({
        token: this.token,
        deviceId: DeviceInfo.getUniqueId(),
      }))
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  @transaction
  setAuthToken(token?: string): void {
    this.token = token
  }

  @transaction
  async initTokenFromStorage(): Promise<void> {
    const stored = await User.loadUserDetails()
    if (stored)
      this.token = stored.token
  }

  async call<R extends ApiResponse>(method: HttpMethod, func: string, payload?: any): Promise<R> {
    let shouldShowAlert: boolean = true
    try {
    
      const request = {
        method,
        headers: {
          'Content-Type': 'application/json',
          device_id: DeviceInfo.getUniqueId(),
          os_version: DeviceInfo.getSystemVersion(),
          device_model: DeviceInfo.getModel(),
          app_version: this.clientVersion,
          language: NativeModules.I18nManager.localeIdentifier,
          timezone: RNLocalize.getTimeZone(),
          offset: `${new Date().getTimezoneOffset()}`,
          device_type: '1',
          token: this.token ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTdmYzBmNmI1NWFkNzQzOWI1MzE2ZDEiLCJpYXQiOjE2NDEzNzUxODB9.EajxdgtHkwb3R3GxaGe1gP_BE4vWwvG4DUwxYNwyTu0"',
        },
        body: payload ? JSON.stringify(payload) : undefined,
      }
// console.log(`${this.apiUrl}/${func}`)
      const response = await fetch(`${this.apiUrl}/${func}`, request)
      const body = await response.json()
    
      if (!response.ok) {
        shouldShowAlert = await this.handleAuthError(response, body)
        throw new Error(response.statusText || body.message)
      }
      return body
    }
    catch (e) {
      if (shouldShowAlert){
     ToastAndroid.show(e.message, ToastAndroid.SHORT)
    }
      throw e
    }
  }

  @unobservable private singleAuthAlertGuard: boolean = false

  private async handleAuthError(response: Response, body: any): Promise<boolean> {
    const isBackgroundTask = (App as AppModel | undefined) === undefined
    if (isBackgroundTask)
      return false
    let shouldShowAnotherAlert: boolean = true
    if (response.status === 401) {
      // Check if logged in from another device
      if (body.message.includes('another device')) {
        shouldShowAnotherAlert = false
        if (!this.singleAuthAlertGuard) {
          this.singleAuthAlertGuard = true
          Alert.alert(
            '',
            response.statusText || body.message,
            [{
              text: 'OK',
              onPress: async () => {
                this.singleAuthAlertGuard = false
                await App.user.logout()
                if (App.rootNavigation.canGoBack())
                  App.rootNavigation.popToTop()
                App.rootNavigation.replace('LogIn')
              },
            }]
          )
        }
      }
      else if (body.message.includes('please signin again')) {
        shouldShowAnotherAlert = false
        if (await App.user.reset())
          setTimeout(() => {
            if (App.rootNavigation.canGoBack())
              App.rootNavigation.popToTop()
            App.rootNavigation.replace('LogIn')
          }, 0)
      }
    }
    return shouldShowAnotherAlert
  }
}

class AwsBucketManager extends ObservableObject {
  async uploadFile(imageUri: string, mimeType: string, fileName: string): Promise<string> {
    const urlResponse = await Api.call<ApiData<AwsCredentials>>('GET', 'settings/aws_s3_bucket')
    fileName = fileName + formatDateTime(new Date())
    const body = this.getRequestBody(urlResponse.data, fileName, mimeType, imageUri)
    const response = await fetch(urlResponse.data.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body,
    })
    const location = response.headers.get('location')
    if (!location)
      throw new Error('No location in response')
    console.log(response)
    console.log(location)
    return location
  }

  @transaction
  private getRequestBody(credentials: AwsCredentials, fileName: string, mimeType: string | undefined, photoUri: string | undefined): FormData {
    const formData = new FormData()
    formData.append('acl', credentials.acl)
    formData.append('success_action_status', credentials.success_action_status)
    formData.append('key', credentials.tem_file_prefix + fileName)
    mimeType = mimeType ?? 'image/jpeg'
    if (credentials.fields) {
      formData.append('X-Amz-Credential', credentials.fields['X-Amz-Credential'])
      formData.append('bucket', credentials.fields.bucket)
      formData.append('X-Amz-Signature', credentials.fields['X-Amz-Signature'])
      formData.append('Content-Type', mimeType)
      formData.append('X-Amz-Date', credentials.fields['X-Amz-Date'])
      formData.append('Policy', credentials.fields.Policy)
      formData.append('X-Amz-Algorithm', credentials.fields['X-Amz-Algorithm'])
    } else
      throw new Error('Aws credentials are missing')
    formData.append('file', { uri: photoUri, name: fileName, type: mimeType })
    return formData
  }
}

export const Api = Transaction.run(() => new ApiModel())
