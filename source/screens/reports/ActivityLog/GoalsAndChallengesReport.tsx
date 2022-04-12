//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Svg, { Circle, Color, G, NumberProp, Path, Text as SvgText } from 'react-native-svg'
import { Ref } from 'reactronic'
import { Middot } from './Middot'
import { reactive } from 'common/reactive'
import { App } from 'models/app/App'

export function ChallengesReport(): React.ReactElement {
  return reactive(() => {
    return (
      <>
        <Text style={styles.cardHeader}>Challenges</Text>
        <View style={styles.cardContent}>
          <View style={styles.indicator}>
            <CircleIndicator
              completed={Ref.to(App.user.report.challenges).completed}
              total={Ref.to(App.user.report.challenges).total}
            />
          </View>
          <View style={styles.summary}>
            <Metric
              label='Total'
              model={Ref.to(App.user.report.challenges).total}
            />
            <Metric
              label='Completed'
              model={Ref.to(App.user.report.challenges).completed}
            />
            <Metric
              label='Won'
              model={Ref.to(App.user.report.challenges).won}
            />
            <Metric
              label='Active'
              model={Ref.to(App.user.report.challenges).active}
            />
          </View>
        </View>
      </>
    )
  })
}
export function GoalsReport(): React.ReactElement {
  return reactive(() => {
    return (
      <>
        <Text style={styles.cardHeader}>Goals</Text>
        <View style={styles.cardContent}>
          <View style={styles.indicator}>
            <CircleIndicator
              completed={Ref.to(App.user.report.goals).completed}
              total={Ref.to(App.user.report.goals).total}
            />
          </View>
          <View style={styles.summary}>
            <Metric
              label='Total'
              model={Ref.to(App.user.report.goals).total}
            />
            <Metric
              label='Completed'
              model={Ref.to(App.user.report.goals).completed}
            />
            <Metric
              label='Active'
              model={Ref.to(App.user.report.goals).active}
            />
          </View>
        </View>
      </>
    )
  })
}

const padding = 10
const circleRadius = 60
const innerCircleRadius = 40
function CircleIndicator({ total, completed }: { total?: Ref<number | undefined>, completed?: Ref<number | undefined> }): React.ReactElement {
  return reactive(() => {
    const completedValue = completed?.value ?? 0
    const totalValue = total?.value !== undefined && total.value !== 0 ? total.value : 1

    const center = { x: circleRadius + padding, y: circleRadius + padding }
    const angleRads = 2 * Math.PI * completedValue / totalValue
    const angleDegrees = 360 * completedValue / totalValue
    const marker = point(0, center, circleRadius)

    return (
      <Svg height={2 * circleRadius + 2 * padding} width={2 * circleRadius + 2 * padding}>
        <Arc
          startAngle={angleRads}
          endAngle={2 * Math.PI}
          center={center}
          radius={circleRadius}
          padding={padding}
          stroke='#EFF9FE'
          strokeWidth='5'
        />
        <Arc
          endAngle={angleRads}
          center={center}
          radius={circleRadius}
          padding={padding}
          stroke='#0096E5'
          strokeWidth='5'
        />
        <G
          x={marker.x}
          y={marker.y}
          originX='0'
          originY={circleRadius}
          rotation={angleDegrees}
        >
          <Circle r='7' fill='#0096E5' />
          <SvgText fill='white' x='-3' y='3.5'>{'>'}</SvgText>
        </G>
        <Circle x={center.x} y={center.y} r={innerCircleRadius} fill='#0096E5' />
        <SvgText
          x={center.x}
          y={center.y + 10}
          textAnchor='middle'
          fill='white'
          fontSize='30'
        >
          {completedValue}
        </SvgText>
      </Svg>
    )
  })
}

function Arc({ startAngle, endAngle, center, radius, padding, stroke, strokeWidth }: {
  startAngle?: number, endAngle: number, center: Point, radius: number, padding: number,
  stroke?: Color, strokeWidth?: NumberProp,
}): React.ReactElement {
  if (startAngle === undefined)
    startAngle = 0
  if (endAngle - startAngle >= 2 * Math.PI)
    return (
      <Circle
        cx={center.x}
        cy={center.y}
        r={radius}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    )

  const arcStart = point(startAngle, center, circleRadius)
  const arcEnd = point(endAngle, center, circleRadius)
  const largeArc = endAngle - startAngle > Math.PI || endAngle - startAngle < 0 ? '1' : '0'
  const clockwise = startAngle < endAngle ? '1' : '0'
  return (
    <Path
      d={`
        M ${arcStart.x} ${arcStart.y}
        A ${circleRadius},${circleRadius} 0,${largeArc},${clockwise} ${arcEnd.x},${arcEnd.y}
      `}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  )
}

interface Point {
  x: number
  y: number
}

function point(angle: number, center: Point, radius: number): Point {
  return {
    x: center.x + radius * Math.sin(angle),
    y: center.y - radius * Math.cos(angle),
  }
}

function Metric({ label, model }: { label: string, model?: Ref<number | undefined> }): React.ReactElement {
  // return reactive(() => {
  return (
    <View style={styles.metric}>
      <View style={styles.metricName}>
        <Middot />
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
      <Text style={styles.metricValue}>{model?.value ?? 0}</Text>
    </View>
  )
  // })
}

const styles = StyleSheet.create({
  cardHeader: {
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
    alignSelf: 'center',
    marginBottom: 5,
  },
  cardContent: {
    flexDirection: 'row',
  },
  indicator: {
    flex: 1,
  },
  summary: {
    flex: 1,
    justifyContent: 'center',
  },

  metric: {
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  metricName: {
    flexDirection: 'row',
  },
  metricLabel: {
    textTransform: 'capitalize',
  },
  metricValue: {
  },
})
