//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Svg, { Circle, ForeignObject, Line } from 'react-native-svg'
import { useLayout } from '@react-native-community/hooks'
import { Ref } from 'reactronic'
import { toFixedPadded } from 'common/number'

export function Slider({ value, averageValue }: { value?: Ref<number | undefined>; averageValue: Ref<number | undefined>; }): React.ReactElement {
  const { width, height, onLayout } = useLayout()
  const horizontalLineMargin = 10
  const valueMarkerPosition = value?.value !== undefined ?
    (width - 2 * horizontalLineMargin) * value.value / 100 + horizontalLineMargin : 0
  const averageValueMarkerPosition = averageValue.value !== undefined ?
    (width - 2 * horizontalLineMargin) * averageValue.value / 100 + horizontalLineMargin : 0
  return (
    <View style={styles.sliderIndicator}>
      <Text style={styles.sliderLabel}>0</Text>
      <View style={styles.slider}>
        <Svg onLayout={onLayout}>
          <Line
            x1={horizontalLineMargin}
            x2={valueMarkerPosition}
            y1='50%'
            y2='50%'
            stroke='#0096E5'
            strokeWidth='8'
            strokeLinecap='round'
          />
          <Line
            x1={valueMarkerPosition}
            x2={width - horizontalLineMargin}
            y1='50%'
            y2='50%'
            stroke='#eaeaea'
            strokeWidth='8'
            strokeLinecap='round'
          />
          {AverageValueMarker(averageValue.value, averageValueMarkerPosition, width, height)}
          {ValueMarker(value?.value, valueMarkerPosition, width, height)}
        </Svg>
      </View>
      <Text style={styles.sliderLabel}>100</Text>
    </View>
  )
}

const valueLabelWidth = 50
export function ValueMarker(value: number | undefined, markerPosition: number, width: number, height: number): React.ReactElement {
  const x = Math.min(Math.max(0, markerPosition - valueLabelWidth / 2), width - valueLabelWidth)
  return (
    <>
      <Circle
        cx={markerPosition}
        cy='50%'
        r='8'
        stroke='#0096E5'
        strokeWidth='2'
        fill='#0096E5'
      />
      <ForeignObject x={x} y={height / 2 + 10} width={valueLabelWidth} height={labelHeight}>
        <View style={[styles.markerContainer, styles.valueMarkerContainer]}>
          {value !== undefined ? (
            <Text style={styles.valueMarkerLabel}>{toFixedPadded(value, 0, 2)}</Text>
          ) : null}
        </View>
      </ForeignObject>
    </>
  )
}

const averageValueLabelWidth = 80
const labelHeight = 30
export function AverageValueMarker(value: number | undefined, markerPosition: number, width: number, height: number): React.ReactElement {
  const x = Math.min(Math.max(0, markerPosition - averageValueLabelWidth / 2), width - averageValueLabelWidth)
  return (
    <>
      <Circle
        cx={markerPosition}
        cy='50%'
        r='8'
        stroke='#0096E5'
        strokeWidth='2'
        fill='white'
      />
      <ForeignObject x={x} y={height / 2 - labelHeight - 10} width={averageValueLabelWidth} height={labelHeight}>
        <View style={[styles.markerContainer, styles.averageValueMarkerContainer]}>
          {value !== undefined ? (
            <Text style={styles.averageValueMarkerLabel}>{toFixedPadded(value, 0, 2)}-Avg</Text>
          ) : null}
        </View>
      </ForeignObject>
    </>
  )
}

const styles = StyleSheet.create({
  sliderIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderLabel: {
    marginHorizontal: 10,
  },
  slider: {
    flex: 1,
    height: 80,
  },
  markerContainer: {
    padding: 4,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  valueMarkerContainer: {
    backgroundColor: '#0096E5',
    width: valueLabelWidth,
  },
  valueMarkerLabel: {
    color: 'white',
  },
  averageValueMarkerContainer: {
    backgroundColor: 'white',
    borderColor: '#0096E5',
    borderWidth: 1,
    width: averageValueLabelWidth,
  },
  averageValueMarkerLabel: {
    color: '#0096E5',
  },
})
