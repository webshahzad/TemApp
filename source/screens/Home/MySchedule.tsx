/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/jsx-props-no-multi-spaces */
import { StackScreenProps } from '@react-navigation/stack'
import { Theme } from 'components/Theme'
import { App } from 'models/app/App'
import { RootStackPropsPerPath } from 'navigation/params'
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
} from 'react-native'
import { SimpleGradientProgressbarView } from 'react-native-simple-gradient-progressbar-view'
import { ViewCalender } from './ViewCalender'
import { UserActivityReport } from '../../models/data/UserReport'
import { reactive } from 'common/reactive'
import { Transaction } from 'reactronic'
import { moderateScale, scale } from 'react-native-size-matters'

export function MySchedule(
  // p: StackScreenProps<RootStackPropsPerPath, 'MySchedule'>
) {
  // React.useEffect(()=>{
  //   void user.loadProfileProperties()
  // },[])
  return reactive(() => {
    const user = App?.user
    const account = user.accountabilityIndex
    return (
      <View style={styles.container}>
        <Text style={styles.rightSideText}>My Schedule</Text>

        <View style={styles.mainContainer}>
          <View style={styles.progressWrapper}>
            <View style={styles.progress}>
              <SimpleGradientProgressbarView
                style={styles.simpleProgressBar}
                fromColor='#B620E0'
                toColor='#F7B500'
                progress={(account != null)?( account / 100): 0}
                maskedCorners={[1, 1, 1, 1]}
              />
            </View>
            <View style={{ marginLeft: scale(10) }}>
              <Text style={styles.progressTxt}>73 %</Text>
              <Text style={[styles.progressTxt, styles.font10]}>
                Accountability
              </Text>
              <Text style={[styles.progressTxt, styles.font10]}>Index</Text>
            </View>
          </View>
          <ViewCalender />
        </View>
      </View>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: moderateScale(280),
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    width: '80%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
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
    textAlign: 'right',
  },
  simpleProgressBar: {
    width: '100%',
    height: '100%',
    borderColor: '#32C5FF',
    borderWidth: 2,
  },
  progress: {
    width: moderateScale(59),
    height: moderateScale(128),
    backgroundColor: '#3E3E3E',
    borderWidth: scale(4),
    borderColor: '#0B82DC',
    borderRadius: scale(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  progressTxt: {
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: scale(28),
    fontWeight: '500',
  },
  font10: {
    fontSize: scale(10),
  },
})
