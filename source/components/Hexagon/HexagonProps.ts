//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Color, NumberProp } from 'react-native-svg'
import { ImageURISource, GestureResponderEvent, ImageRequireSource, ColorValue, } from 'react-native'

export interface HexagonProps {
  columns: number
  rows: number | 'auto'
  extraRows?: boolean
  removeLast?: boolean
  backgroundColor?: Color
  stroke?: Color
  strokeWidth?: NumberProp
  contentImageWidth?: number
  textColor?: ColorValue
  spacing?: number
  radarStyle?: RadarStyle
  cells?: (CellCustomization | undefined)[]
}

export interface CellCustomization {
  backgroundColor?: Color
  backgroundImage?: ImageURISource | ImageRequireSource
  backgroundGradient?: Gradient
  stroke?: Color
  fitStroke?: boolean
  content?: CellContent
  onPress?: OnPress
  radarData?: RadarData
}

interface Gradient {
  x1?: NumberProp
  y1?: NumberProp
  x2?: NumberProp
  y2?: NumberProp
  stops: {
    offset?: NumberProp
    color?: Color
    opacity?: NumberProp
  }[]
}

export interface CellContent {
  image?: ImageURISource | ImageRequireSource | number
  useSvgImageOnly?: boolean // workaround to properly draw single image (tintColor not applicable)
  tintColor?: ColorValue
  h1?: string
  h1size?: number
  h2?: string
  h2size?: number
  textColor?: ColorValue
}

export interface RadarStyle {
  axisStroke: Color
  axisStrokeWidth: number
  coaxialSections: number
}

export interface RadarData {
  values: number[]
  maxValue: number
  stroke: Color
  strokeWidth: number
  fill: Color
}

export type OnPress = (event: GestureResponderEvent) => void
