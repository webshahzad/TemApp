//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'

import { reactive } from 'common/reactive'
import { DefaultHexGradient } from 'common/constants'
import { MainBlueColor } from 'components/Theme'
import { Hexagon } from 'components/Hexagon/Hexagon'
import { CellCustomization } from 'components/Hexagon/HexagonProps'
import { MetricsList, ActivityScore, EmptyScore, getMetricValueStringFromScore, Metrics } from 'models/data/GoalOrChallenge'

export interface HexagonChallengeMetricsViewerProps {
  // model: GoalOrChallenge
  score?: ActivityScore<unknown>
  metric?: Metrics[]
  metricFontSize?: number
  valueFontSize?: number
}

export function HexagonChallengeMetricsViewer(p: HexagonChallengeMetricsViewerProps): JSX.Element {
  const score: ActivityScore<unknown> = p.score ?? EmptyScore
  const metric = p.metric
  const visibleMetrics = MetricsList.filter(m => m.selectable)
  const allSelected: boolean = (metric?.length ?? 0) === visibleMetrics.length
  // to correctly display old Challenges and Goals with Steps
  const hasSteps: boolean = (metric?.findIndex(v => v === Metrics.Steps) ?? -1) > -1
  const list = hasSteps ? MetricsList : visibleMetrics

  return reactive(() => {
    const cells: CellCustomization[] = list.map(m => {
      const selected: boolean = !!metric && (metric.indexOf(m.metric) !== -1)
      const value: string = selected ? getMetricValueStringFromScore(m.metric, score) : m.maxMeasuringText
      return {
        content: {
          h1: value,
          h1size: p.valueFontSize,
          h2: m.name,
          h2size: p.metricFontSize,
          textColor: selected ? 'white' : undefined,
        },
        backgroundGradient: selected ? DefaultHexGradient : undefined,
        fitStroke: true,
      }
    })

    if (!hasSteps) {
      cells.unshift({
        content: {
          h2: 'Total Effort',
          h2size: p.metricFontSize,
          textColor: allSelected ? 'white' : undefined,
        },
        backgroundGradient: allSelected ? DefaultHexGradient : undefined,
        fitStroke: true,
      })
    }

    return (
      <Hexagon
        columns={3}
        removeLast
        rows={2}
        stroke={MainBlueColor}
        spacing={2}
        strokeWidth={2}
        textColor='gray'
        cells={cells}
      />
    )
  })
}
