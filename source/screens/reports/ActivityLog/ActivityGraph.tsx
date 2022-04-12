//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { StyleSheet, View } from 'react-native'
import { UserReport } from 'models/data/UserReport'
import { LineChart, XAxis, YAxis } from 'react-native-svg-charts'
import { curveBasis } from 'd3-shape'

export function ActivityGraph({ userReport }: { userReport: UserReport; }): React.ReactElement {
  const data = userReport.graph.slice().reverse() // copy of array
  const count = data.length

  const contentInset = { top: 10, bottom: 5, right: 20 }
  return (
    <View style={styles.graphContainer}>
      <View style={styles.graphWithYAxis}>
        <YAxis
          data={data}
          yAccessor={item => item.item.score}
          min={0}
          max={100}
          svg={svg.axis}
          contentInset={contentInset}
        />
        <LineChart
          style={styles.chart}
          data={data}
          xAccessor={item => item.index}
          yAccessor={item => item.item.score}
          svg={svg.chart}
          contentInset={contentInset}
          yMin={0}
          yMax={100}
          curve={curveBasis}
        />
      </View>
      <XAxis
        data={data}
        xAccessor={item => item.index}
        formatLabel={(_, index) => {
          const dayFromToday = index - count + 1
          if (dayFromToday === 0)
            return 'Today'
          else if (dayFromToday % 7 === 0)
            return dayFromToday
          else
            return ''
        }}
        svg={svg.axis}
        style={styles.xAxis}
        contentInset={contentInset}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  graphContainer: {
    padding: 10,
  },
  graphWithYAxis: {
    flexDirection: 'row',
  },
  chart: {
    height: 200,
    flex: 1,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#0096E5',
  },
  xAxis: {
    marginTop: 5,
  },
})

const svg = {
  axis: {
    fontSize: 10,
    fill: 'black',
  },
  chart: {
    stroke: 'black',
    strokeWidth: 2,
  },
}
