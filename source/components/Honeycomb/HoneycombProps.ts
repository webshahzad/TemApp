//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { Color, NumberProp } from 'react-native-svg'
import {
  ImageURISource, GestureResponderEvent,
  ImageRequireSource, ColorValue, ViewStyle
} from 'react-native'

export interface HoneycombProps {
  style?: ViewStyle
  columns: number
  arrangement?: HoneycombArrangement
  heightShift?: number // in units of cell height
  shoveEvenRowRight?: boolean // see https://www.redblobgames.com/grids/hexagons/#coordinates-offset
  backgroundColor?: Color
  stroke?: Color
  strokeWidth?: NumberProp
  contentImageWidth?: number
  textColor?: ColorValue
  cells?: (CellCustomization | undefined)[]
  centerNeighbors?: (CellCustomization | undefined)[]
}

export type HoneycombArrangement =
  'default' | // no arrangement, honeycomb would not cover entire container
  'cover' | // honeycomb is arranged by left and top sides to cover entire container
  'centerCellToCenter' // center cell center is calculated to match container center

export interface CellCustomization {
  backgroundColor?: Color
  backgroundImage?: ImageURISource | ImageRequireSource
  backgroundGradient?: Gradient
  stroke?: Color
  fitStroke?: boolean
  content?: CellContent
  onPress?: OnPress
  helpOnPress?: OnPress
}

export interface Gradient {
  x1?: NumberProp
  y1?: NumberProp
  x2?: NumberProp
  y2?: NumberProp
  stops: GradientPoint[]
}

export interface GradientPoint {
  offset?: NumberProp
  color?: Color
  opacity?: NumberProp
}

export interface CellContent {
  image?: ImageURISource | ImageRequireSource | number
  h1?: string
  h2?: string
}

export type OnPress = (event: GestureResponderEvent) => void
