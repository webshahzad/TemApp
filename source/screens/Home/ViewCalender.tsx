/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import active from 'assets/images/active.png'
import active2 from 'assets/images/active2.png'
import { standalone, Transaction } from 'reactronic'
import { CalendarManager } from 'models/app/Calendar/CalendarManager'
import { App } from 'models/app/App'
import { EventEditor } from 'models/app/Calendar/EventEditor'
import {
  moderateScale,
  moderateVerticalScale,
  scale,
} from 'react-native-size-matters'

export interface EditEventProps {
  editor: EventEditor;
}

const WEEK: string[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function Divider() {
  return <View style={styles.divider} />
}

interface IWeekProps {
  isIndicator?: boolean | undefined;
}

function Week(props: IWeekProps) {
  const { isIndicator } = props
  const d = new Date()
  const day = d.getDay()

  const renderWeek = (weekArr: string[]) => {
    return weekArr.map((item: string, index: number) => {
      return (
        <View
          key={item + Math.floor(Math.random())}
          style={styles.renderWeekContainer}
        >
          {isIndicator ? (
            <Image
              style={styles.weekDotImg}
              source={day == index ? active : active2}
            />
          ) : (
            <Text style={styles.weekTxt}>{item}</Text>
          )}
        </View>
      )
    })
  }

  return <View style={styles.weekContainer}>{renderWeek(WEEK)}</View>
}

export function ViewCalender(): JSX.Element {
  const d = new Date()
  const day = d.getDay()
  const windowWidth = Dimensions.get('window').width
  return (
    <View style={[styles.container, styles.shadow]}>
      <View style={[styles.innerContainer, styles.lightShadow]}>
        <Week isIndicator />
        <Divider />
        <Week />
      </View>
      <View style={styles.viewCalendarContainer}>
        <Text style={styles.viewCalenderText}>View your Calendar</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: scale(10),
    width: moderateScale(278),
    height: moderateScale(111),
    backgroundColor: '#0682DC',

    borderRadius: scale(8),

    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: moderateVerticalScale(10),
    paddingBottom: moderateVerticalScale(7),
  },
  innerContainer: {
    width: moderateScale(258),
    height: moderateScale(70),
    backgroundColor: '#3E3E3E',
    borderWidth: scale(8),
    borderColor: '#0B82DC',
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewCalendarContainer: {
    width: moderateScale(208),
    height: moderateScale(19),
    borderRadius: scale(8),
    backgroundColor: '#0682DC',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,

    justifyContent: 'center',
    alignItems: 'center',
  },
  viewCalenderText: {
    fontSize: scale(8),
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.7,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,

    elevation: 18,
  },
  lightShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  divider: { width: '90%', height: 0.6, backgroundColor: '#ccc' },
  weekDotImg: { width: 13, height: 13, resizeMode: 'contain', marginBottom: moderateVerticalScale(3) },
  renderWeekContainer: {
    width: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekTxt: { color: '#0B82DC', fontSize: scale(10) },
  weekContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 2,
  },
})
