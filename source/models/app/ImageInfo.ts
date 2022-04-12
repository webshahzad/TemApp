//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { ObservableObject, transaction, Transaction, reaction } from 'reactronic'
import { Image } from 'react-native'

export class ImageInfo extends ObservableObject {
  source: { uri: string }
  actualHeight: number = 0
  actualWidth: number = 0

  width: number = 0
  height: number = 0

  marks: ImageMark[] = []

  constructor(source: { uri: string }) {
    super()
    this.source = source
  }

  @reaction
  protected resolveImageSize(): void {
    Image.getSize(this.source.uri, (width, height) => {
      Transaction.run(() => {
        this.actualHeight = height
        this.actualWidth = width
      })
    })
  }

  @transaction
  setWidth(width: number): void {
    this.width = width
  }

  @reaction
  protected calculateHeight(): void {
    if (this.actualHeight && this.width) {
      const aspectRatio = this.actualWidth / this.actualHeight
      this.height = this.width / aspectRatio
    }
  }

  @transaction
  addMark(x: number, y: number): void {
    const mark = new ImageMark(x, y)
    const marksMutable = this.marks.toMutable()
    marksMutable.push(mark)
    this.marks = marksMutable
  }
}

export class ImageMark extends ObservableObject {
  x: number
  y: number

  get key(): string {
    return `${this.x},${this.y}`
  }

  constructor(x: number, y: number) {
    super()
    this.x = x
    this.y = y
  }
}
