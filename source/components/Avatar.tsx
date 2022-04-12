//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { ImageSourcePropType, ImageStyle, StyleSheet } from 'react-native'
import Image from 'react-native-autosize-image'

import UserDummy from 'assets/images/user-dummy.png'

interface AvatarProps {
  source: number | string | undefined
  size: number
  style?: ImageStyle | ImageStyle[]
}

export const Avatar = (p: AvatarProps): React.ReactElement => {
  let source: ImageSourcePropType | undefined
  if (p.source !== undefined)
    if (typeof p.source === 'string' && p.source !== '')
      source = { uri: p.source }
    else if (typeof p.source === 'number')
      source = p.source
  if (source === undefined)
    source = UserDummy
  return (
    <Image
      style={[styles.container, p.style, { width: p.size, height: p.size }]}
      mainAxisSize={p.size}
      source={source}
      fallbackSource={UserDummy}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 1000,
  },
})
