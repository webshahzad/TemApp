/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { toFixedPadded } from 'common/number'
import { reactive } from 'common/reactive'
import CircularProgress from 'components/CircularProgress'
import { DialougeBoxComp } from 'components/DialougeBox'
import { NavigationTabs } from 'components/NavigationTabs'
import { useNavigation } from '@react-navigation/native'
import { Theme } from 'components/Theme'
import { App } from 'models/app/App'
import React from 'react'
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  PixelRatio,
} from 'react-native'
import { Shadow } from 'react-native-shadow-2'

import { Transaction } from 'reactronic'
import { moderateScale, scale } from 'react-native-size-matters'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

// based on iphone 5s's scale
const SCALE = SCREEN_WIDTH / 320

export function normalize(size: number) {
  const newSize = size * SCALE
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
  }
}

export function MyHealth(): JSX.Element {
  const navigation = useNavigation()
  return reactive(() => {
    const activity =
      App.user.report.totalActivityReport.totalActivityScore.value !== undefined
        ? toFixedPadded(
          App.user.report.totalActivityReport.totalActivityScore.value,
          1,
          2
        )
        : undefined
    return (
      <View style={styles.container}>
        <Text style={styles.rightSideText}>My Health</Text>
        <Shadow>
          <View style={styles.circularProgressOuter}>
            <View style={styles.circularProgressInner}>
              <CircularProgress
                trailColor='gray'
                barWidth={moderateScale(25)}
                fill={activity ? activity : 0}
                strokeColor='#04FCF6'
                styles={{ transform: [{ rotate: '180deg' }] }}
                radius={moderateScale(60)}
                strokeThickness={4}
              />
              <View style={styles.activityWrapper}>
                <Text style={styles.scoreText}>{activity ?? activity}</Text>
                <Text style={styles.acitivityText}>Activity score</Text>
              </View>
            </View>
          </View>
        </Shadow>

        <View style={styles.journalContainer}>
          <Shadow
            radius={moderateScale(1)}
            containerViewStyle={{ overflow: 'hidden' }}
          >
            <View style={styles.journalWrapper}>
              <CircularProgress
                barWidth={moderateScale(0.5)}
                radius={moderateScale(16)}
                trailColor='#C7D3CA'
                fill={100}
                strokeColor='#04FCF6'
              />
              <View style={styles.journal}>
                <Text style={styles.journalText}>JOURNAL</Text>
              </View>
            </View>
          </Shadow>
        </View>
      </View>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "green",
    width: '100%',
    height: moderateScale(280),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSideText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    position: 'absolute',
    right: '-5%',
    top: '20%',
    transform: [{ rotate: '-90deg' }],
    color: '#0A64AA',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: '#fff',
  },
  circularProgressOuter: {
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height
      ) / 2,
    width: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').width * 0.5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: moderateScale(10),
    borderColor: '#0B82DC',
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: {
      width: -8,
      height: -10,
    },
    shadowRadius: 3.45,
    shadowOpacity: 0.29,
    elevation: -10,
    overflow: 'hidden',
  },
  circularProgressInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scoreText: {
    fontSize: normalize(22),
    color: '#FFFFFF',
    borderColor: '#0B82DC',
    fontWeight: '400',
    textShadowColor: 'rgba(11,112,220,0.5)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    shadowColor: '#0B82DC',
  },
  acitivityText: {
    fontSize: normalize(8),
    color: '#0B82DC',
    borderColor: '#FFFFFF',
    fontWeight: '500',
    textShadowColor: 'rgba(240,240,255,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    shadowColor: '#FFFFFF',
    textTransform: 'uppercase',
  },
  activityWrapper: {
    width: '75%',
    height: '75%',
    position: 'absolute',
    backgroundColor: '#3d3d3d',
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height
      ) / 2,
    shadowOffset: {
      width: -6,
      height: -4,
    },
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  journalWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  journalText: {
    fontSize: scale(3.5),
    color: '#0682DC',
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    borderColor: '#FFFFFF',
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,5)',
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 10,
    shadowColor: '#ffff',
  },
  journal: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    justifyContent: 'center',
  },
  journalContainer: {
    position: 'absolute',
    right: '20%',
    bottom: '10%',
    overflow: 'hidden',
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(40),
    borderWidth: moderateScale(2),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3d3d3d',
    borderColor: '#3d3d3d',
  },
})
