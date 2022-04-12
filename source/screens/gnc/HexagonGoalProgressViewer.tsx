//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'

import { MetricsList, getMetricValueString, Metrics } from 'models/data/GoalOrChallenge'
import { HexagonProgressViewer } from './HexagonProgressViewer'

export interface HexagonGoalProgressViewerProps {
  metric: Metrics
  score: number
  percentage: number
  metricFontSize?: number
  valueFontSize?: number
  huge?: boolean
}

export function HexagonGoalProgressViewer(p: HexagonGoalProgressViewerProps): JSX.Element {
  const value: string = getMetricValueString(p.metric, p.score)
  const name: string = MetricsList.find(m => m.metric === p.metric)!.name.toLocaleUpperCase()
  return (
    <HexagonProgressViewer
      name={name}
      value={value}
      percentage={p.percentage}
      valueFontSize={p.valueFontSize}
      nameSize={p.metricFontSize}
      huge={p.huge}
    />
  )
}
