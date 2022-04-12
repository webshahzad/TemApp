//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { MessageImageProps } from 'react-native-gifted-chat'
import { IMessage as GiftedMessage } from 'react-native-gifted-chat'
import Lightbox from 'react-native-lightbox-v2'

export function MessageImage({
  containerStyle, currentMessage, imageProps, imageStyle, lightboxProps,
}: MessageImageProps<GiftedMessage>): React.ReactElement | null {
  if (!currentMessage)
    return null
  return (
    <View style={[styles.container, containerStyle]}>
      <Lightbox
        activeProps={{ style: styles.imageActive }}
        {...lightboxProps}
      >
        <Image
          {...imageProps}
          style={[styles.image, imageStyle]}
          source={{ uri: currentMessage.image }}
        />
      </Lightbox>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover',  
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
})
