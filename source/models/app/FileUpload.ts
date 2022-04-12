//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { nonreactive } from 'reactronic'
import { ImagePickerResponse } from 'react-native-image-picker'

import { ApiData, Api } from './Api'
import { App } from './App'

interface AwsConfiguration {
  url: string
  fields: {
    'bucket': string
    'X-Amz-Algorithm': string
    'X-Amz-Credential': string
    'Policy': string
    'X-Amz-Signature': string
    'X-Amz-Date': string
  }
  tem_file_prefix: string
  acl: string
  success_action_status: string
}

export interface ImageInfo {
  uri: string
  type: string
  name: string
}

export class FileUpload {
  constructor() {
  }

  async uploadPickerImage(image: ImagePickerResponse): Promise<string> {
    return (!image.didCancel && !image.error && image.uri) ?
      this.uploadFile(image.uri, image.type?? 'image/jpeg') : ''
  }

  async uploadFile(uri: string, contentType: string): Promise<string> {
    let result = ''
    try {
      const awsResponse: ApiData<AwsConfiguration> = await Api.call('GET', 'settings/aws_s3_bucket')
      const aws = awsResponse.data

      const name = (aws.tem_file_prefix ?? '') + nonreactive(() => App.user.stored._id) +
        new Date().toISOString()
      const image = {
        uri,
        type: contentType,
        name,
      }

      const body = new FormData()
      body.append('key', image.name)
      body.append('Content-Type', image.type)
      body.append('acl', aws.acl)
      for (const key in aws.fields) {
        const value = (aws.fields as any)[key]
        body.append(key, value)
      }
      body.append('success_action_status', aws.success_action_status)
      body.append('file', image)
      console.log(body)

      const response = await fetch(aws.url, {
        method: 'POST',
        body,
      })
      result = `${(response as any).url}/${image.name}`
    }
    catch (e) {
      console.log(e)
    }
    return result
  }
}

export const UploadManager = new FileUpload()
