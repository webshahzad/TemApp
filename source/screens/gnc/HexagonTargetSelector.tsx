//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Transaction } from 'reactronic'

import { reactive } from 'common/reactive'
import { DefaultHexGradient } from 'common/constants'
import { GrayColor, MainBlueColor } from 'components/Theme'
import { Hexagon } from 'components/Hexagon/Hexagon'
import { CellCustomization } from 'components/Hexagon/HexagonProps'
import { InputModal, InputModalManager } from 'components/InputModal'
import { MetricsList, MetricSelection } from 'models/data/GoalOrChallenge'
import { TargetMetricsManager } from 'models/app/TargetMetricsManager'

import AvatarIcon from 'assets/icons/avatar/avatar.png'
import { GNCHexagon } from 'components/Hexagon/GNCHexagon'
import { App } from 'models/app/App'
import { Alert } from 'react-native'
import PushNotification from 'react-native-push-notification'

export interface HexagonTargetSelectorProps {
  isChallenge: boolean
  targetManager: TargetMetricsManager
  lockMetric?: boolean
  valueMetric?: string 
  manager: InputModalManager
  
}

export function HexagonTargetSelector(p: HexagonTargetSelectorProps): JSX.Element {
  const tm = p.targetManager
  const [modalManager] = React.useState(() => Transaction.run(() => new InputModalManager()))
  const visibleMetrics = MetricsList.filter(m => m.selectable)
   let selectMetric: (m: MetricSelection) => void
  let switchAllMetrics: undefined | (() => void) = undefined
  if (p.isChallenge) {
    selectMetric = m => {
      if (!p.lockMetric)
        tm.switchMetric(m.metric)
    }
    switchAllMetrics = () => {
      tm.switchAllMetrics(visibleMetrics.map(m => m.metric))
    }
  }
  else { // Goal
    selectMetric = m => {
      const selected: boolean = (m.metric === tm.targetMetric)
      if (!p.lockMetric || selected) {
        modalManager.show({
          placeholder: m.example,
          defaultValue: selected ? tm.targetValue?.toString() : undefined,
          onSubmit: text => {
            const value = Number(text)
            if (!Number.isNaN(value) && value)
              tm.setTarget(m.metric, value)
          },
        })
      }
    }
  }

  return reactive(() => {
    const allSelected: boolean = (tm.matric?.length ?? 0) === visibleMetrics.length
    const cells: CellCustomization[] = visibleMetrics.map(m => {
      const selected: boolean = p.isChallenge 
              ? (tm.matric !== undefined) && tm.matric.indexOf(m.metric) !== -1
        : (tm.targetMetric === m.metric)
      const value: string = !p.isChallenge && selected && (tm.targetValue !== undefined)
        ? tm.targetValue.toString()
        : m.maxMeasuringText.toLocaleUpperCase() 
      //   const  valueMetric = tm.targetValue; 
      // // const arry = [];      
      // // arry.push(value)
      //  console.log("valueMetric>",valueMetric)
      return {
        content: {
          h1: value,
          h2: m.name.toLocaleUpperCase(),
          textColor: selected ? 'white' : undefined,
        },
        backgroundGradient: selected ? DefaultHexGradient : undefined,
        fitStroke: true,
        onPress: (p.lockMetric && (p.isChallenge || !selected)) ? undefined : () => selectMetric(m),
      }
    })

    const  valueMetric = tm.targetValue; 
    // const arry = [];      
    // arry.push(value)
     console.log("valueMetric>",valueMetric)


    cells.unshift({
      content: {
        h2: 'TOTAL EFFORT',
        textColor: allSelected ? 'white' : undefined,
      },
      backgroundGradient: allSelected ? DefaultHexGradient : undefined,
      fitStroke: true,
      stroke: !p.isChallenge ? GrayColor : undefined,
      onPress: (p.lockMetric || !p.isChallenge) ? undefined : switchAllMetrics,
    })

    return (
      <>
        <GNCHexagon
          columns={3}
          removeLast
          rows={2}
          stroke={MainBlueColor}
          spacing={1}
          strokeWidth={5}
          textColor='gray'
          cells={cells}          
        />
        <InputModal
          manager={modalManager}
          title='Enter the metric value that you wish to achieve'
          icon={AvatarIcon}
          keyboardType='numeric'

        />
      </>
    )
  })
}
