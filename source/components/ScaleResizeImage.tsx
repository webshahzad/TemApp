//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { useImageDimensions } from '@react-native-community/hooks'
import { ImageProps, ImageRequireSource, ImageStyle, Image } from 'react-native'

export const ScaleResizeImage = (p: ImageProps): JSX.Element | null => {
  const { dimensions, loading, error } = useImageDimensions(p.source as ImageRequireSource)
  if (loading || error || !dimensions)
    return null
  const { aspectRatio } = dimensions
  const { style: s, ...props } = p
  const { width: w, height: h, ...style } = (s as ImageStyle)
  let width: number | undefined = undefined
  let height: number | undefined = undefined
  if (w !== undefined) {
    width = Number(w)
    height = width / aspectRatio
  } else if (h !== undefined) {
    height = Number(h)
    width = height * aspectRatio
  }
  return (
    <Image
      style={[{
        width,
        height,
      }, style]}
      {...props}
    />
  )
}
