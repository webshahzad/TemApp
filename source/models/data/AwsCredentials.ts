//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject } from 'reactronic'

// export class AwsParameters extends ObservableObject {
//   acl: string = ''
//   success_action_status: string = ''
//   key: string = ''
//   'X-Amz-Credential': string = ''
//   bucket: string = ''
//   'X-Amz-Signature': string = ''
//   'Content-Type': string = ''
//   'X-Amz-Date': string = ''
//   Policy: string = ''
//   'X-Amz-Algorithm': string = ''
// }

export class AwsCredentials extends ObservableObject {
  url: string = ''
  acl: string = ''
  fields?: AwsCredentialsFields = undefined
  success_action_status: string = ''
  tem_file_prefix: string = ''
}

class AwsCredentialsFields extends ObservableObject {
  bucket: string = ''
  Policy: string = ''
  'X-Amz-Algorithm': string = ''
  'X-Amz-Credential': string = ''
  'X-Amz-Date': string = ''
  'X-Amz-Signature': string = ''
}
