//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction } from 'reactronic'
import { ImageInfo } from 'models/app/ImageInfo'

export class TagPeople extends ObservableObject {
  image?: ImageInfo = undefined

  @transaction
  selectImage(imageSource: { uri: string }): void {
    this.image = new ImageInfo(imageSource)
  }

  @transaction
  clear(): void {
    this.image = undefined
  }
}
