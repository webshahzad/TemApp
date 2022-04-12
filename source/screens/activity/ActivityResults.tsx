//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useLayoutEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Pressable, ImageBackground, LayoutRectangle, ImageSourcePropType, Image as ImageNative } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps, useHeaderHeight } from '@react-navigation/stack'
import Image from 'react-native-autosize-image'
import { captureRef } from 'react-native-view-shot'

import { ActivityStackPropsPerPath } from 'navigation/params'
import { reactive } from 'common/reactive'
import { CellCustomization } from 'components/Hexagon/HexagonProps'
import { Hexagon } from 'components/Hexagon/Hexagon'
import { ActivitySummary } from 'models/data/Activity'
import { MainBlueColor } from 'components/Theme'
import { DefaultHexGradient } from 'common/constants'
import { App } from 'models/app/App'

import BackgroundImage from 'assets/images/activities/background.png'
import PlaceholderImage from 'assets/images/logo-white/logo-white.png'
import ActivityIcon from 'assets/icons/act/act.png'
import { HeaderRight } from 'components/HeaderRight'
import { ActivityOrigin } from 'models/app/Fit/ActivityOrigin'

export function ActivityResults(p: StackScreenProps<ActivityStackPropsPerPath, 'ActivityResults'>): JSX.Element {
  const summary: ActivitySummary = p.route.params.summary

  useLayoutEffect(() => {
    p.navigation.setOptions({
      headerTintColor: 'white',
      headerRight:
        (summary.combinedActivities === undefined)
          ? props => (
            <HeaderRight
              tintColor={props.tintColor}
              buttons={[
                {
                  simpleIcon: 'note',
                  onPress: () => App.openEditActivity(summary),
                },
              ]}
            />
          )
          : undefined,
    })
  })

  const viewRef = useRef(null)

  const imageSource: ImageSourcePropType = summary.image ? { uri: summary.image } : ActivityIcon
  const showNewButton: boolean = p.route.params.showNewButton ?? false
  const showHomeButton: boolean = p.route.params.showHomeButton ?? false

  async function resetActivity(): Promise<void> {
    // await manager.setActivity(undefined)
    p.navigation.replace('ChooseActivity')
  }

  return reactive(() => {
    const cells: CellCustomization[] = [{
      content: { h2: `Duration\n${summary.getShortDurationText()}` },
    }, {
      content: summary.distanceTracked ?
        {
          h2: `Distance\n${summary.getShortDistanceText()}`,
        }
        : {
          image: PlaceholderImage,
          useSvgImageOnly: true, // workaround to properly draw single image
        },
    }, {
      content: { h2: `Calories\n${summary.getCaloriesText()}` },
    }]

    const headerHeight = useHeaderHeight()
    const originLabel = summary.origin !== ActivityOrigin.TEM
      ? (<Text style={{ position: 'absolute', right: 20, top: headerHeight, color: 'grey' }}>{summary.origin}</Text>)
      : undefined

    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={BackgroundImage} style={styles.image} fadeDuration={0}>
          {originLabel}
          <View style={styles.badge}>
            <Text style={styles.badgeHeader}>Complete</Text>
            <Image
              fallbackSource={ActivityIcon}
              source={imageSource}
              tintColor='white'
              mainAxisSize={30}
              mainAxis='vertical'
            />
            <Text style={styles.badgeLabel}>{summary.name}</Text>
          </View>
          <View style={styles.metrics}>
            <Hexagon
              columns={2}
              rows={2}
              textColor='white'
              backgroundColor={MainBlueColor}
              removeLast
              spacing={13}
              cells={cells}
              contentImageWidth={40}
            />
          </View>
          <View style={styles.bottom}>
            {showNewButton && (
              <Pressable
                style={styles.button}
                onPress={() => resetActivity()}
              >
                <Text style={styles.buttonText}>New Activity</Text>
              </Pressable>
            )}
            <Pressable
              style={styles.button}
              onPress={async () => {
                // TODO: show separate view with results to capture
                if (viewRef.current !== null) {
                  const uri = await captureRef(viewRef, { format: 'png' })
                  await App.openNewPost(uri)
                }
              }}
            >
              <Text style={styles.buttonText}>Post Activity</Text>
            </Pressable>
            {showHomeButton && (
              <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Home</Text>
              </Pressable>
            )}
          </View>
        </ImageBackground>

        <View style={styles.resultsToShare} ref={viewRef}>
          <ActivityResultsToShare summary={summary} />
        </View>
      </SafeAreaView>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '25%',
  },
  badgeHeader: {
    fontSize: 28,
    textTransform: 'uppercase',
    marginBottom: 15,
    color: 'white',
  },
  badgeLabel: {
    fontSize: 22,
    marginTop: 10,
    color: 'white',
  },
  metrics: {
    width: '70%',
  },
  bottom: {
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    borderRadius: 5,
    backgroundColor: MainBlueColor,
    marginVertical: 5,
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
  },
  resultsToShare: {
    zIndex: -1, // hide behind main screen
    width: '100%', // full screen width
    position: 'absolute',
  },
})

// View to capture

function ActivityResultsToShare(p: { summary: ActivitySummary }): JSX.Element {
  const { summary } = p
  const imageSource: ImageSourcePropType = summary.image ? { uri: summary.image } : ActivityIcon
  const cells: CellCustomization[] = [{
    content: {
      h1: `${summary.getShortDurationText()}`,
      h2: 'TOTAL TIME',
      h1size: 14,
      h2size: 12,
    },
    backgroundGradient: DefaultHexGradient,
  }, {
    content:
      summary.distanceTracked ?
        {
          h1: `${summary.getDistanceText()}`,
          h2: 'DISTANCE',
          h1size: 14,
          h2size: 12,
        }
        : {
          image: PlaceholderImage,
          useSvgImageOnly: true,
        },
    backgroundGradient: DefaultHexGradient,
  }, {
    content: {
      h1: `${summary.getCaloriesText()}`,
      h2: 'CALORIES',
      h1size: 14,
      h2size: 12,
    },
    backgroundGradient: DefaultHexGradient,
  }]
  const [topLayout, setTopLayout] = useState<LayoutRectangle>({ width: 0, height: 0, x: 0, y: 0 })
  return (
    <ImageBackground source={BackgroundImage} style={shotStyles.background} fadeDuration={0}>
      <View style={shotStyles.top} onLayout={e => setTopLayout(e.nativeEvent.layout)}>
        <View>
          <Text style={shotStyles.name}>{summary.combinedActivities === undefined ? summary.name : 'Other'}</Text>
          <Text style={shotStyles.label}>Completed</Text>
        </View>
        <Image
          fallbackSource={ActivityIcon}
          source={imageSource}
          tintColor={MainBlueColor}
          mainAxisSize={topLayout.height * 2 / 3}
          mainAxis='horizontal'
          style={shotStyles.topImage}
        />
      </View>
      <View style={shotStyles.metricsWrapper}>
        <View style={shotStyles.metrics}>
          <Hexagon
            columns={3}
            rows={1}
            textColor='white'
            spacing={5}
            cells={cells}
            contentImageWidth={40}
          />
        </View>
        {
          summary.combinedActivities && summary.combinedActivities.map((a, i) => (
            <View key={`${a._id}-${i}`} style={shotStyles.combinedTextWrapper}>
              <Text style={shotStyles.combinedText}>{a.name}</Text>
              <Text style={shotStyles.combinedText}>{a.getShortInfoForShot()}</Text>
            </View>
          ))
        }
      </View>
    </ImageBackground>
  )
}

const TopPaddingLeft = 15
const TextPaddingVertical = 10

const shotStyles = StyleSheet.create({
  background: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  top: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: 'white',
    fontSize: 13,
    marginLeft: TopPaddingLeft,
    marginVertical: TextPaddingVertical,
  },
  label: {
    color: 'white',
    fontSize: 13,
    backgroundColor: MainBlueColor,
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    paddingLeft: TopPaddingLeft,
    paddingRight: TopPaddingLeft + 5,
    paddingVertical: TextPaddingVertical,
  },
  topImage: {
    marginRight: TopPaddingLeft,
  },
  metricsWrapper: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  metrics: {
    width: '100%',
    paddingBottom: 5,
  },
  combinedTextWrapper: {
    width: '100%',
    marginTop: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  combinedText: {
    color: MainBlueColor,
  },
})
