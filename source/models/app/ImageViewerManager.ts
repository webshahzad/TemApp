//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type'

export class ImageViewerManager {
  images: IImageInfo[] = []
  imageIndex: number = 0

  setVisible: (v: boolean) => void = () => { }

  configure(setVisible: (v: boolean) => void): void {
    this.setVisible = setVisible
  }

  show(images: IImageInfo[], index: number = 0): void {
    this.images = images.slice()
    this.imageIndex = index
    this.setVisible(true)
  }

  close(): void {
    this.setVisible(false)
  }
}
