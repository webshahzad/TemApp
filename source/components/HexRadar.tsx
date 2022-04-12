//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'

import { Hexagon } from 'components/Hexagon/Hexagon'
import { DefaultHexGradient } from 'common/constants'
import { useLayout } from '@react-native-community/hooks'

type HexRadarValue = {
  name: string
  value: number
}

export interface HexRadarProps {
  values: HexRadarValue[]
  maxValue: number
  fontSize?: number
}

export function HexRadar(p: HexRadarProps): JSX.Element {
  const { onLayout, height } = useLayout()
  const fontSize = p.fontSize ?? 11
  const topSideTextMarginTop = height / 4 - fontSize / 2
  const bottomSideTextMarginTop = height / 2 - 2 * fontSize
  return (
    <View style={styles.radarContainer}>
      <Text style={[styles.topText, { fontSize }]}>{p.values[5]?.name ?? ''}</Text>
      <View style={styles.center} onLayout={onLayout}>
        <View>
          <Text style={{ fontSize, marginTop: topSideTextMarginTop, textAlign: 'right', paddingRight: 5 }}>{p.values[4]?.name ?? ''}</Text>
          <Text style={{ fontSize, marginTop: bottomSideTextMarginTop, textAlign: 'right', paddingRight: 5 }}>{p.values[3]?.name ?? ''}</Text>
        </View>
        <View style={styles.main}>
          <Hexagon
            columns={1}
            rows={1}
            radarStyle={{
              axisStroke: 'gray',
              axisStrokeWidth: 1,
              coaxialSections: 5,
            }}
            cells={[{
              backgroundGradient: DefaultHexGradient,
              radarData: {
                fill: 'lightgreen',
                stroke: 'lime',
                strokeWidth: 1,
                values: p.values.map(v => v.value),
                maxValue: p.maxValue,
              },
            }]}
            stroke='lightgray'
            strokeWidth={5}
          />
        </View>
        <View>
          <Text style={{ fontSize, marginTop: topSideTextMarginTop, paddingLeft: 5 }}>{p.values[0]?.name ?? ''}</Text>
          <Text style={{ fontSize, marginTop: bottomSideTextMarginTop, paddingLeft: 5 }}>{p.values[1]?.name ?? ''}</Text>
        </View>
      </View>
      <Text style={[styles.bottomText, { fontSize }]}>{p.values[2].name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  radarContainer: {
    width: '100%',
    flexDirection: 'column',
    position: 'relative',
  } as ViewStyle,
  topText: {
    alignSelf: 'center',
  } as TextStyle,
  center: {
    flexDirection: 'row',
    justifyContent: 'center',
  } as ViewStyle,
  main: {
    flexGrow: 1,
    maxWidth: '50%',
  },
  bottomText: {
    alignSelf: 'center',
  } as TextStyle,
})
