//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Metrics } from 'models/data/GoalOrChallenge'

export interface TargetMetricsManager {
  targetMetric?: Metrics
  targetValue?: number
  matric?: Metrics[] // typo in API

  setTarget(metric: Metrics, value?: number): void
  switchMetric(metric: Metrics): void
  switchAllMetrics(metrics: Metrics[]): void
}

export class TargetMetricsManager {
  constructor(metrics: Metrics[]) {
    this.matric = metrics
  }
}
