//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { PropsWithChildren, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, Animated } from 'react-native'
import { useAnimation } from 'react-native-animation-hooks'

interface LoadingIndicatorProps {
  hidden?: boolean
}

const animationDuration = 300
const opacity = 0.5

export const LoadingIndicatorModal = (p: PropsWithChildren<LoadingIndicatorProps>): React.ReactElement | null => {
  const [initialRender, setInitialRender] = useState(true) // fixes incompatibility between useNativeDriver and initial non-zero opacity
  const darkBackdropOpacity = useAnimation({
    type: 'timing',
    toValue: p.hidden || initialRender ? 0 : opacity,
    duration: animationDuration,
    useNativeDriver: true,
  })
  const indicatorBackdropOpacity = useAnimation({
    type: 'timing',
    toValue: p.hidden || initialRender ? 0 : 1,
    duration: animationDuration,
    useNativeDriver: true,
  })
  const [mounted, mount] = useState(!p.hidden)
  if (mounted && p.hidden)
    setTimeout(mount, animationDuration)
  else if (!mounted && !p.hidden)
    mount(true)
  if (initialRender)
    setInitialRender(false)

  if (!mounted)
    return null
  return (
    <View style={styles.backdropContainer}>
      <Animated.View style={[styles.darkBackdrop, { opacity: darkBackdropOpacity }]}>
      </Animated.View>
      <Animated.View style={[styles.indicatorBackdrop, { opacity: indicatorBackdropOpacity }]}>
        <ActivityIndicator size='large' color='white' />{/* does not work without color, see https://github.com/facebook/react-native/issues/29378 */}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  backdropContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  darkBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  indicatorBackdrop: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
