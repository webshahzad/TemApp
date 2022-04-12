//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useLayoutEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { FeedStackPropsPerPath } from 'navigation/params'
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { App } from 'models/app/App'
import { ImageMark } from 'models/app/ImageInfo'
import { reactive } from 'common/reactive'
import { useLayout } from '@react-native-community/hooks'
import { RightHeaderPressableButton } from 'navigation/utils'

export const TagPeople = (p: StackScreenProps<FeedStackPropsPerPath, 'TagPeople'>): React.ReactElement => {
  useLayoutEffect(() => {
    p.navigation.setOptions({
      headerRight: () => RightHeaderPressableButton('Done', () => p.navigation.goBack()),
    })
  }, [])

  return reactive(() => (
    <SafeAreaView style={styles.screen}>
      {ImageTagger()}
      <View style={styles.help}>
        <Text style={styles.helpLine}>Tap photo to tag people.</Text>
        <Text style={styles.helpLine}>Tap again to remove.</Text>
        <Text style={styles.helpLine}>Press and drag to move.</Text>
      </View>
    </SafeAreaView >
  ))
}

function ImageTagger(): React.ReactElement | null {
  if (!App.tagPeople.image)
    return null
  return (
    <View
      style={styles.content}
      onLayout={e => App.tagPeople.image?.setWidth(e.nativeEvent.layout.width)}
    >
      <Image
        source={App.tagPeople.image.source}
        style={[styles.image, { width: App.tagPeople.image.width, height: App.tagPeople.image.height }]}
      />
      {App.tagPeople.image.marks.map(mark => (
        <Mark
          key={mark.key}
          mark={mark}
          horizontalMarkPosition='right'
          verticalMarkPosition='bottom'
        />
      ))}
      <Pressable
        style={styles.pressableArea}
        onPress={e => {
          App.tagPeople.image?.addMark(e.nativeEvent.locationX, e.nativeEvent.locationY)
        }}
      >
      </Pressable>
    </View>
  )
}

type HorizontalPosition = 'left' | 'center' | 'right'
type VerticalPosition = 'top' | 'bottom'
const markPointVerticalSize = 8
const markPointHorizontalSize = 8
const labelBorderRadius = 5

function Mark({ mark, horizontalMarkPosition, verticalMarkPosition }:
  {
    mark: ImageMark, horizontalMarkPosition: HorizontalPosition,
    verticalMarkPosition: VerticalPosition
  }): React.ReactElement | null {
  const layout = useLayout()
  let horizontalShift: ViewStyle | undefined
  if (horizontalMarkPosition === 'left')
    horizontalShift = { left: -markPointHorizontalSize - labelBorderRadius }
  else if (horizontalMarkPosition === 'right')
    horizontalShift = { left: -layout.width + markPointHorizontalSize - labelBorderRadius }
  else if (horizontalMarkPosition === 'center')
    horizontalShift = { left: -layout.width / 2 - markPointHorizontalSize / 2 }
  let verticalShift: number
  if (verticalMarkPosition === 'top')
    verticalShift = mark.y
  else
    verticalShift = mark.y - layout.height
  const invisible = layout.width === 0 ? styles.invisible : undefined

  return (
    <View
      onLayout={layout.onLayout}
      style={[styles.markContainer, { top: verticalShift, left: mark.x }]}
    >
      {verticalMarkPosition === 'top' ? (
        <View style={styles.markPointer}>
          <View style={layout.width === 0 ? styles.invisible : styles.topPointingTriangle} />
        </View>
      ) : null}
      <View style={[styles.mark, invisible]}>
        <Text style={[styles.markLabel, invisible]}>
          username
        </Text>
      </View>
      {verticalMarkPosition === 'bottom' ? (
        <View style={styles.markPointer}>
          <View style={layout.width === 0 ? styles.invisible : styles.bottomPointingTriangle} />
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    height: '100%',
  },
  content: {
  },
  image: {
    resizeMode: 'contain',
  },

  help: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpLine: {
    marginBottom: 10,
    color: 'grey',
  },

  pressableArea: {
    ...StyleSheet.absoluteFillObject,
  },
  markContainer: {
    position: 'absolute',
  },
  markPointer: {
    // left: -markPointHorizontalSize / 2,
  },
  topPointingTriangle: {
    width: 0,
    height: 0,
    right: markPointHorizontalSize,
    borderLeftWidth: markPointHorizontalSize / 2,
    borderRightWidth: markPointHorizontalSize / 2,
    borderBottomWidth: markPointVerticalSize,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomPointingTriangle: {
    width: 0,
    height: 0,
    right: markPointHorizontalSize,
    borderLeftWidth: markPointHorizontalSize / 2,
    borderRightWidth: markPointHorizontalSize / 2,
    borderTopWidth: markPointVerticalSize,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(0, 0, 0, 0.5)',
  },
  mark: {
    borderRadius: labelBorderRadius,
    padding: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  markLabel: {
    color: 'white',
  },

  invisible: {
    color: 'transparent',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
})
