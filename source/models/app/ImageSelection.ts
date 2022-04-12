//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { cached, ObservableObject, transaction } from 'reactronic'
import ImagePicker from 'react-native-image-picker'
import { LayoutChangeEvent } from 'react-native'

export class ImageSelection extends ObservableObject {
  private static gridColumns = 3
  static margin = 10

  containerWidth: number = 0
  images: string[] = []

  @transaction
  measureGridLayout(event: LayoutChangeEvent): void {
    this.containerWidth = event.nativeEvent.layout.width
  }

  @cached
  getSquareSize(): number {
    if (this.containerWidth === 0) return 0
    return this.containerWidth / ImageSelection.gridColumns - ImageSelection.margin
  }

  @transaction
  reset(): void {
    this.images = []
  }

  @transaction
  async selectImage(): Promise<void> {
    const uri = await ImageSelection.runImagePicker()
    if (uri) {
      const imagesMutable = this.images.toMutable()
      imagesMutable.push(uri)
      this.images = imagesMutable
    }
  }

  static runImagePicker(): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      ImagePicker.showImagePicker({}, response => {
        if (response.error)
          reject(response.error)
        else if (!response.didCancel && response.uri) {
          resolve(response.uri)
        } else {
          resolve(undefined)
        }
      })
    })
  }

  @transaction
  removeImage(i: number): void {
    const imagesMutable = this.images.toMutable()
    imagesMutable.splice(i, 1)
    this.images = imagesMutable
  }
}
