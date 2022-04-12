//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { ActivityStackPropsPerPath } from 'navigation/params'
import { reactive } from 'common/reactive'
import { StyleSheet, View, Text, ImageBackground, Alert, Image, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { App } from 'models/app/App'
import { CellCustomization } from 'components/Hexagon/HexagonProps'
import { Hexagon } from 'components/Hexagon/Hexagon'
import { MainBlueColor } from 'components/Theme'
import { ActivityProgress } from 'models/data/Activity'
import { formatTimeFromSeconds, formatTimeFromSecondsWithTicks } from 'common/datetime'
import { toFixedPadded } from 'common/number'
import { useFocusEffect } from '@react-navigation/native'

import BackgroundImage from 'assets/images/activities/background.png'
import NewImage from 'assets/images/activities/new.png'
import NewDisabledImage from 'assets/images/activities/newDisabled.png'
import StopImage from 'assets/images/activities/stop.png'
import PlayImage from 'assets/images/activities/play.png'
import PauseImage from 'assets/images/activities/pause.png'

export function TrackActivity(p: StackScreenProps<ActivityStackPropsPerPath, 'TrackActivity'>): JSX.Element {
  useEffect(() => p.navigation.setOptions({ headerTintColor: 'white' }))
  useFocusEffect(() => {
    // Avoid empty screen when accidentally navigating through deep link
    if (!App.activityManager.hasActivityRunning)
      p.navigation.replace('ChooseActivity')
  })

  const manager = App.activityManager
  const showDistance: boolean = manager.trackDistance

  const addActivity = async function(): Promise<void> {
    if (manager.canAddActivity) {
      const wasPlaying: boolean = manager.isPlaying
      if (wasPlaying)
        await manager.pauseActivity()
      Alert.alert('Add activity?', undefined, [
        {
          text: 'No', onPress: async () => {
            if (wasPlaying)
              await manager.resumeActivity()
          },
        },
        {
          text: 'Yes', onPress: async () => {
            p.navigation.replace('ChooseActivity')
          },
        },
      ])
    }
  }

  const stopActivity = async function(): Promise<void> {
    const wasPlaying: boolean = manager.isPlaying
    if (wasPlaying)
      await manager.pauseActivity()
    Alert.alert('Are you sure you want to stop the current activity?', undefined, [
      {
        text: 'No', onPress: async () => {
          if (wasPlaying)
            await manager.resumeActivity()
        },
      },
      {
        text: 'Yes', onPress: async () => {
          const summary = await manager.stopActivity()
          p.navigation.replace('ActivityResults', { summary, showNewButton: true })
        },
      },
    ])
  }

  const pausePlayActivity = async function(): Promise<void> {
    if (manager.isPlaying)
      await manager.pauseActivity()
    else
      await manager.resumeActivity()
  }

  return reactive(() => {

    let content: JSX.Element
    if (manager.displayCountdown) {
      const countdownCells: CellCustomization[] = []
      countdownCells[0] = {
        content: {
          image: manager.countdown > 0 ? undefined : manager.runningActivityImage,
          tintColor: 'white',
          h1: `${manager.countdown > 0 ? manager.countdown : 'GO!'}`,
          h1size: 24,
        },
      }
      content = (
        <View style={styles.countdownHex}>
          <Hexagon
            columns={1}
            rows={1}
            textColor='white'
            backgroundColor={MainBlueColor}
            contentImageWidth={30}
            cells={countdownCells}
          />
        </View>
      )
    }
    else {
      const cells: CellCustomization[] = []
      cells[0] = {
        content: {
          image: manager.runningActivityImage,
          tintColor: 'white',
          h1: manager.runningActivityName,
        },
      }
      content = (
        <>
          <View style={styles.badge}>
            <Hexagon
              columns={1}
              rows={1}
              textColor='white'
              backgroundColor={MainBlueColor}
              contentImageWidth={30}
              cells={cells}
            />
          </View>
          <TimeElapsed progress={manager.activityProgress} />
          <View style={styles.metrics}>
            {
              showDistance && (
                <>
                  <Text style={styles.metric}>
                    <Text style={styles.metricValue}>{formatTimeFromSecondsWithTicks(manager.activityProgress.currentMileTime)}</Text>
                    <Text style={styles.metricText}> In-Progress Mile</Text>
                  </Text>
                  <Text style={styles.metric}>
                    <Text style={styles.metricValue}>{toFixedPadded(manager.activityProgress.distance, 0, 2)}</Text>
                    <Text style={styles.metricText}> Miles</Text>
                  </Text>
                </>
              )
            }
            <Text style={[styles.metric, styles.calories]}>
              <Text style={styles.metricValue}>{toFixedPadded(manager.activityProgress.calculateCalories(), 0, 2)}</Text>
              <Text style={styles.metricText}> Calories</Text>
            </Text>
          </View>
          <View style={styles.bottom}>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.7}
                onPress={manager.canAddActivity ? addActivity : undefined}
              >
                <Image source={manager.canAddActivity ? NewImage : NewDisabledImage} style={styles.buttonImage} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.7}
                onPress={stopActivity}
              >
                <Image source={StopImage} style={styles.buttonImage} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.7}
                onPress={pausePlayActivity}
              >
                <Image source={manager.isPlaying ? PauseImage : PlayImage} style={styles.buttonImage} />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )
    }

    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground source={BackgroundImage} style={styles.image}>
          {content}
        </ImageBackground>
      </SafeAreaView>
    )
  })
}

function TimeElapsed(p: { progress: ActivityProgress }): JSX.Element {
  return reactive(() => (
    <Text style={styles.time}>{formatTimeFromSeconds(p.progress.elapsed)}</Text>
  ))
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  countdownHex: {
    width: '50%',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  bottom: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  badge: {
    marginTop: 40,
    marginBottom: 10,
    width: '45%',
  },
  time: {
    fontSize: 32,
    color: 'white',
  },
  metrics: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  metric: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    textAlignVertical: 'bottom',
    marginVertical: 10,
    paddingHorizontal: 10,
    color: MainBlueColor,
  },
  metricValue: {
    fontSize: 24,
  },
  metricText: {
    fontSize: 18,
  },
  calories: {
    color: 'yellow',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  button: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
})
