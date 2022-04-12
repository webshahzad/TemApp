//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { toFixedPadded } from 'common/number'
import { App } from 'models/app/App'
import { ActivityTypes, AverageStats, ReportFlag } from 'models/data/UserReport'
import { Ref } from 'reactronic'
import { formatTimeFromHours } from 'common/datetime'
import { Slider } from './Slider'
import { reactive } from 'common/reactive'
import { Middot } from './Middot'

export function ActivityReport(): React.ReactElement {
  return (
    <>
      <Slider
        value={Ref.to(App.user.report.totalActivityReport.totalActivityScore).value}
        averageValue={Ref.to(App.user.report.totalActivityReport).totalAppScore}
      />
      <StatsMetric
        label='Total activities'
        model={Ref.to(App.user.report.totalActivityReport).totalActivities}
        format={formatIntegerStats}
      />
      <ActivityTypeMetric
        label='Total activity type'
        model={Ref.to(App.user.report.totalActivityReport).activityTypes}
      />
      <StatsMetric
        label='Accountability index'
        model={Ref.to(App.user.report.totalActivityReport).activityAccountability}
        format={formatIntegerStats}
        unit='%'
      />
      <StatsMetric
        label='Average duration'
        model={Ref.to(App.user.report.totalActivityReport).averageDuration}
        format={formatIntegerStats}
        unit=' mins'
      />
      <StatsMetric
        label='Average distance'
        model={Ref.to(App.user.report.totalActivityReport).averageDistance}
        format={formatRealStats}
        unit=' miles'
      />
      <StatsMetric
        label='Average calories'
        model={Ref.to(App.user.report.totalActivityReport).averageCalories}
        format={formatRealStats}
        unit=' cals'
      />
      <StatsMetric
        label='Average daily steps'
        model={Ref.to(App.user.report.totalActivityReport).averageDailySteps}
        format={formatIntegerStats}
      />
      <StatsMetric
        label='Average sleep'
        model={Ref.to(App.user.report.totalActivityReport).averageSleep}
        format={formatHoursStats}
      />
    </>
  )
}

function StatsMetric({ label, model, unit, format }: { label: string; model: Ref<AverageStats>; unit?: string; format: (value: AverageStats) => string; }): React.ReactElement {
  return Metric(label, model.value, format, model.value.flag, unit)
}

function formatIntegerStats(stats: AverageStats): string {
  const value = stats.value ?? 0
  return toFixedPadded(value, 0)
}

function formatRealStats(stats: AverageStats): string {
  const value = stats.value ?? 0
  return toFixedPadded(value, 0, 2)
}

function formatHoursStats(stats: AverageStats): string {
  const value = stats.value ?? 0
  return formatTimeFromHours(value)
}

function ActivityTypeMetric({ label, model }: { label: string; model: Ref<ActivityTypes>; }): React.ReactElement {
  return Metric(label, model.value, formatActivityTypes, model.value.flag)
}

function formatActivityTypes(activityTypes: ActivityTypes): string {
  return activityTypes.totalTypes.toString()
}

function Metric<T>(label: string, value: T, format: (value: T) => string, flag: ReportFlag, unit?: string): React.ReactElement {
  return reactive(() => {
    return (
      <View style={styles.metric}>
        <View style={styles.metricName}>
          <Middot />
          <Text style={styles.metricLabel}>{label}</Text>
        </View>
        <Text style={[styles.metricValue, { color: ReportFlag.color(flag) }]}>
          {format(value)}{unit}
        </Text>
      </View>
    )
  })
}

const styles = StyleSheet.create({
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
