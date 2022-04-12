//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useLayoutEffect } from 'react'
import { Transaction } from 'reactronic'
import { View, Text, Alert, StyleSheet, ViewStyle, TextStyle, Image, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useScrollToTop } from '@react-navigation/native'
import { StackScreenProps, HeaderTitle } from '@react-navigation/stack'

import { ReportsStackPropsPerPath } from 'navigation/params'
import { ScrollView } from 'react-native-gesture-handler'
import { Hexagon } from 'components/Hexagon/Hexagon'
import { CellCustomization } from 'components/Hexagon/HexagonProps'
import { DefaultHexGradient } from 'common/constants'
import { HexRadar } from 'components/HexRadar'

import HelpCircle from 'assets/icons/help-circle.png'
import { reactive } from 'common/reactive'
import { App } from 'models/app/App'
import { HexPatternStrokeColor } from 'components/Theme'
import { HeaderButton, HeaderRight } from 'components/HeaderRight'
import { useOnFocus } from 'common/useOnFocus'
import { Api } from 'models/app/Api'

export function Reports(p: StackScreenProps<ReportsStackPropsPerPath, 'Reports'>): JSX.Element {
  const scrollViewRef: React.Ref<ScrollView> = React.useRef(null)
  // Scroll to top on bottom tab press
  useScrollToTop(scrollViewRef)

  // useLayoutEffect(() => {
  //   p.navigation.setOptions({
  //     headerRight: props => (
  //       <HeaderRight
  //         tintColor={props.tintColor}
  //         buttons={[
  //           HeaderButton.globalSearch,
  //         ]}
  //       />
  //     ),
  //   })
  // }, [])

  // useOnFocus(p.navigation, () => {
  //   if (Api.isAuthenticated()) {
  //     Transaction.run(() => {
  //       void App.user.hais.load()
  //       void App.user.report.load()
  //       void App.user.radar.load()
  //     })
  //   }
  // })

  // nonreactive(() => {
  //   Transaction.runAs('refresh', true, undefined, undefined, () => {
  //     App.user.hais.load()
  //     App.user.report.load()
  //     App.user.radar.load()
  //   })
  // })

  return reactive(cycle => {

    const hais = App.user.hais
    const report = App.user.report
    const radar = App.user.radar

    const haisCells: (CellCustomization | undefined)[] = [
      {
        content: {
          h1: hais.sum.toFixed(2),
          h1size: 22,
          h2: 'HAIS',
          h2size: 17,
        },
        fitStroke: true,
        backgroundGradient: DefaultHexGradient,
        onPress: () => {
          p.navigation.push('Hais', { text: 'Health Index Here' })
        },
      }
    ]
    const maxScore = Math.max(
      radar.medicalScore,
      radar.physicalActivityScore,
      radar.mentalScore,
      radar.nutritionScore,
      radar.cardiovascularScore,
      radar.socialScore) || 100
    return (
      <SafeAreaView>
        <ScrollView ref={scrollViewRef}>
          <View>
            <View style={styles.cardsBack}>
              <Hexagon
                columns={3}
                rows='auto'
                extraRows
                stroke={HexPatternStrokeColor}
                strokeWidth={2}
              />
            </View>
            <View style={styles.haisCard}>
              <View style={styles.haisHexContainer}>
                <Hexagon
                  columns={1}
                  rows={1}
                  textColor='white'
                  cells={haisCells}
                  stroke='lightgray'
                  strokeWidth={5}
                />
                <Pressable style={{ position: 'absolute', bottom: 5, right: 0 }} onPress={() => Alert.alert(HaisHeader, HaisText, undefined, { cancelable: true })} >
                  <Image source={HelpCircle} style={{ width: 20, height: 20 }} />
                </Pressable>
              </View>
            </View>
            <View style={styles.radarCard}>
              <Text style={styles.cardCaption}>{HealthRadarHeader.toUpperCase()}</Text>
              <View style={styles.radarContainer}>
                <HexRadar
                  maxValue={maxScore}
                  fontSize={10}
                  values={[
                    { name: 'MEDICAL', value: radar.medicalScore },
                    { name: 'PHYSICAL ACTIVITY', value: radar.physicalActivityScore },
                    { name: 'MENTAL', value: radar.mentalScore },
                    { name: 'NUTRITION', value: radar.nutritionScore },
                    { name: 'CARDIOVASCULAR', value: radar.cardiovascularScore },
                    { name: 'SOCIAL', value: radar.socialScore },
                  ]}
                />
              </View>
              <Pressable style={{ alignSelf: 'flex-end' }} onPress={() => Alert.alert(HealthRadarHeader, HealthRadarText, undefined, { cancelable: true })} >
                <Image source={HelpCircle} style={{ width: 20, height: 20 }} />
              </Pressable>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <Hexagon
              columns={3}
              rows={2}
              extraRows
              stroke='#d8d8d8'
              strokeWidth={2}
              textColor='white'
              cells={[
                {
                  backgroundGradient: DefaultHexGradient,
                  content: {
                    h1: report.totalActivityReport.averageCalories.value?.toFixed(2),
                    h2: 'AVERAGE\nCALORIES',
                  },
                },
                {
                  backgroundGradient: DefaultHexGradient,
                  content: {
                    h1: `${Math.round(report.totalActivityReport.averageDuration.value ?? 0)} mins`,
                    h2: 'AVERAGE\nDURATION',
                  },
                },
                {
                  backgroundGradient: DefaultHexGradient,
                  content: {
                    h1: `${report.totalActivityReport.activityTypes.totalTypes}`,
                    h2: 'TYPES OF\nACTIVITIES',
                  },
                },
                {
                  backgroundGradient: DefaultHexGradient,
                  content: {
                    h1: `${report.totalActivityReport.totalActivities.value}`,
                    h2: 'TOTAL\nACTIVITIES',
                  },
                  onPress: () => {
                    const totalActivityCount: number = report.totalActivityReport.totalActivities.value ?? 0
                    if (totalActivityCount > 0) {
                      App.activityManager.resetFilter()
                      p.navigation.push('TotalActivities')
                    }
                  },
                },
                {
                  backgroundGradient: DefaultHexGradient,
                  content: {
                    h2: 'ACTIVITY LOG',
                  },
                  onPress: () => {
                    App.rootNavigation.push('ActivityLog')
                  },
                },
              ]}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  })
}

const RadarMarginBottom: number = 10 // to eliminate cutting of elevation shadow

const styles = StyleSheet.create({
  cardsBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: RadarMarginBottom,
  } as ViewStyle,
  haisCard: {
    marginVertical: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
  } as ViewStyle,
  haisHexContainer: {
    alignSelf: 'center',
    width: '35%',
    paddingBottom: 5,
  } as ViewStyle,
  radarCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
    marginBottom: RadarMarginBottom,
    margin: 5,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
 
  } as ViewStyle,
  cardCaption: {
    fontSize: 17,
    // fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  } as TextStyle,
  radarContainer: {
    alignSelf: 'center',
    width: '100%',
  } as ViewStyle,
  statsContainer: {
    marginTop: -RadarMarginBottom,
  } as ViewStyle,
})

const HealthRadarHeader: string = 'Balanced Health Radar'
const HealthRadarText: string = 'This is a color-coded representation of how balanced each area of health is in relation to your other areas. It captures six major categories: Social, Medical, Physical Activity, Mental, Nutrition and Cardiovascular. As you engage with the app you will begin to fill the blue honeycomb with green from the middle out.'

const HaisHeader: string = ''
const HaisText: string = 'Press on your HAIS number to see and add more detail.'
