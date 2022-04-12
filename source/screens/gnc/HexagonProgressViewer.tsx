//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'

import { DefaultHexGradient } from 'common/constants'
import { Hexagon } from 'components/Hexagon/Hexagon'
import { CellCustomization } from 'components/Hexagon/HexagonProps'

export interface HexagonProgressViewerProps {
  value: string // getMetricValueString(p.metric, p.score)
  name?: string //  MetricsList.find(m => m.metric === p.metric)!.name.toLocaleUpperCase()
  percentage?: number
  nameSize?: number
  valueFontSize?: number
  huge?: boolean
}

export function HexagonProgressViewer(p: HexagonProgressViewerProps): JSX.Element {
  const value = p.value

  // TODO: update

  const cells: (CellCustomization | undefined)[] = []
  const name: string = (p.name !== undefined && p.percentage !== undefined)
    ? p.name + (p.percentage !== undefined ? '\n' + p.percentage.toFixed(1) + '%' : '')
    : p.name !== undefined
      ? p.name
      : p.percentage !== undefined
        ? p.percentage.toFixed(1) + '%'
        : ''
  const valueCell: CellCustomization = {
    content: {
      h1: value,
      h1size: p.valueFontSize,
      h2: name,
      h2size: p.nameSize,
      textColor: 'white',
    },
    backgroundGradient: DefaultHexGradient,
    fitStroke: true,
  }
  if (p.huge)
    cells.push(undefined)

  cells.push(valueCell)

  const columns = p.huge ? 3 : 1
  const rows = p.huge ? 2 : 1
  const extraRows = p.huge ?? false
  const stroke = p.huge ? 'lightgray' : 'white'
  const strokeWidth = p.huge ? 2 : 5

  return (
    <Hexagon
      columns={columns}
      rows={rows}
      extraRows={extraRows}
      stroke={stroke}
      strokeWidth={strokeWidth}
      cells={cells}
    />
  )
}
