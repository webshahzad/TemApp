//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { ReactElement, useState } from 'react'
import { View, Animated, StyleSheet, Text, ColorValue } from 'react-native'
import { useLayout } from '@react-native-community/hooks'
import Svg, {
  Polygon, G, Defs, Use, ClipPath, Image as SvgImage,
  LinearGradient, Stop, Color, ForeignObject, NumberProp, Circle, Text as SvgText
} from 'react-native-svg'
import { extendHex, defineGrid, Hex, Point } from 'honeycomb-grid'
import { HoneycombProps, CellCustomization, CellContent, HoneycombArrangement } from './HoneycombProps'
import { useAnimation } from 'react-native-animation-hooks'
import Image from 'react-native-autosize-image'

const AnimatedG = Animated.createAnimatedComponent(G)

export function Honeycomb(props: HoneycombProps): React.ReactElement {
  const { onLayout, width, height } = useLayout()

  const columns = props.columns + 1

  const cellSize = width / (columns - 1) / Math.sqrt(3)
  const exampleHex = extendHex({ size: cellSize })()
  const hexWidth = exampleHex.width()
  const hexHeight = exampleHex.height()
  const rowsAboveCenter = Math.ceil((((height - hexHeight) / 2 / hexHeight) * 4) / 3)
  const rowsBelowCenter = rowsAboveCenter + 1
  const centerCellIndex = rowsAboveCenter * columns + Math.floor(columns / 2)

  const offset = props.shoveEvenRowRight ? 1 : -1
  const hexFactory = extendHex({ size: cellSize, offset })
  const gridFactory = defineGrid(hexFactory)
  const grid = gridFactory.rectangle({ height: rowsAboveCenter + 1 + rowsBelowCenter, width: columns })

  let horizontalShift = 0
  let verticalShift = 0
  const centerCell = grid[centerCellIndex]
  const customizations: (CellCustomization | undefined)[] = []
  let top = 0
  if (grid.length > 0) {

    if (props.arrangement === 'cover') {
      if (!props.shoveEvenRowRight)
        horizontalShift = exampleHex.width() / 2
      verticalShift = exampleHex.height() / 4
    }
    else if (props.arrangement === 'centerCellToCenter') {
      const centerCellPosition = centerCell.toPoint().add(centerCell.center())
      horizontalShift = centerCellPosition.x - width / 2
      verticalShift = centerCellPosition.y - height / 2
    }

    if (props.heightShift !== undefined) {
      top = hexHeight * props.heightShift
    }

    if (props.cells) {
      for (const index in props.cells) {
        if (props.cells.hasOwnProperty(index)) {
          let indexFromStart = Number(index)
          // there is an additional column in each row to cover entire container
          indexFromStart += Math.floor(indexFromStart / (columns - 1)) + 1
          customizations[indexFromStart] = props.cells[index]
        }
      }
    }

    if (props.centerNeighbors) {
      const centerNeighbors = grid.neighborsOf(centerCell)
      for (const index in props.centerNeighbors) {
        if (props.centerNeighbors.hasOwnProperty(index)) {
          const indexFromCenter = Number(index)
          let indexFromStart: number
          if (indexFromCenter === 0) {
            indexFromStart = centerCellIndex
          } else {
            const cell = centerNeighbors[indexFromCenter - 1]
            indexFromStart = columns * cell.y + cell.x
          }
          customizations[indexFromStart] = props.centerNeighbors[indexFromCenter]
        }
      }
    }
  }

  const buildFitStrokePolygon = customizations.some(c => c?.fitStroke)
  return (
    <View onLayout={onLayout} style={props.style}>
      <View style={{ marginHorizontal: -horizontalShift, marginVertical: -verticalShift, top }}>
        <Svg>
          <Defs>
            {buildPolygonDefinitionAndClipPath('regular', exampleHex)}
            {buildFitStrokePolygon ?
              buildFitStrokePolygonDefinition('fitStroke', props.strokeWidth ?? 0, cellSize, offset, exampleHex) :
              undefined}
            {customizations.map(buildGradientDefinition)}
          </Defs>

          {grid.map((hex, index) => {
            const customization: CellCustomization | undefined = customizations[index]
            const polygonId = customization?.fitStroke ? 'fitStroke' : 'regular'
            let fill: Color
            if (customization?.backgroundGradient)
              fill = `url(#gradient-${index})`
            else if (customization?.backgroundColor !== undefined)
              fill = customization.backgroundColor
            else if (props.backgroundColor !== undefined)
              fill = props.backgroundColor
            else
              fill = 'none'
            const stroke = customization?.stroke ?? props.stroke
            const strokeWidth = props.strokeWidth ?? 0
            const textColor = props.textColor ?? 'white'

            return (
              <Cell
                key={`${hex.x},${hex.y}`}
                polygonId={polygonId}
                customization={customization}
                hex={hex}
                hexHeight={hexHeight}
                hexWidth={hexWidth}
                backgroundColor={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                textColor={textColor}
                contentImageWidth={props.contentImageWidth ?? 10}
              />
            )
          })}
        </Svg>

        <Svg style={styles.overlaySvg}>{/* workaround: ForeignObject is rendered above all other elements, so onPress can not be handled */}
          <Defs>
            {buildPolygonDefinitionAndClipPath('regular', exampleHex)}
            {buildFitStrokePolygon ?
              buildFitStrokePolygonDefinition('fitStroke', props.strokeWidth ?? 0, cellSize, offset, exampleHex) :
              undefined}
          </Defs>

          {grid.map((hex, index) => {
            const customization: CellCustomization | undefined = customizations[index]
            const polygonId = customization?.fitStroke ? 'fitStroke' : 'regular'
            const hexCoords = hex.toPoint()
            let cellBehaviour: ReactElement | undefined
            if (customization?.onPress)
              cellBehaviour = (
                <CellBehavior
                  polygonId={polygonId}
                  customization={customization}
                  hexCoords={hexCoords}
                />
              )

            let cellHelp: React.ReactElement | undefined
            if (customization?.helpOnPress)
              cellHelp = (
                <G x={hexCoords.x + hexWidth - 8} y={hexCoords.y + hexHeight - 8}>
                  <SvgText x='-2.5' y='4' fill='black'>?</SvgText>
                  <Circle r='8' stroke='black' onPress={customization.helpOnPress} />
                </G>
              )

            return (
              <G key={`${hex.x},${hex.y}`}>
                {cellBehaviour}
                {cellHelp}
              </G>
            )
          })}
        </Svg>
      </View>
    </View>
  )
}

function buildGradientDefinition(c: CellCustomization | undefined, index: number): JSX.Element | null {
  if (!c?.backgroundGradient)
    return null
  const id = `gradient-${index}`
  return (
    <LinearGradient
      key={id}
      id={id}
      x1={c.backgroundGradient.x1}
      x2={c.backgroundGradient.x2}
      y1={c.backgroundGradient.y1}
      y2={c.backgroundGradient.y2}
    >
      {c.backgroundGradient.stops.map(stop => (
        <Stop
          key={stop.offset}
          offset={stop.offset}
          stopColor={stop.color}
          stopOpacity={stop.opacity}
        />
      ))}
    </LinearGradient>
  )
}

function buildPolygonDefinitionAndClipPath(polygonId: string, hex: Hex<{}>, hexOffset: number = 0): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> {
  return (
    <>
      <Polygon id={polygonId} points={hex.corners().map(vertex => `${vertex.x + hexOffset},${vertex.y + hexOffset}`)} />
      <ClipPath id={`clip-${polygonId}`}>
        <Use href={`#${polygonId}`} />
      </ClipPath>
    </>
  )
}

function buildFitStrokePolygonDefinition(polygonId: string, strokeWidth: NumberProp, cellSize: number, offset: number, exampleHex: Hex<{}>): React.ReactElement {
  const hexOffset = Number(strokeWidth)
  const fitStrokeHexFactory = extendHex({ size: cellSize - hexOffset, offset })
  const hex = fitStrokeHexFactory(exampleHex)
  return buildPolygonDefinitionAndClipPath(polygonId, hex, hexOffset)
}

function Cell({ polygonId, customization, hex, hexHeight, hexWidth, backgroundColor, stroke, strokeWidth, textColor, contentImageWidth }: {
  polygonId: string, customization: CellCustomization | undefined, hex: Hex<{}>, hexHeight: number, hexWidth: number
  backgroundColor: Color, stroke?: Color, strokeWidth: React.ReactText, textColor?: ColorValue, contentImageWidth: number
}): JSX.Element {
  const hexCoords = hex.toPoint()
  return (
    <>
      <AnimatedG x={hexCoords.x} y={hexCoords.y} originX={hexWidth / 2} originY={hexHeight / 2}>
        <Use
          href={`#${polygonId}`}
          fill={backgroundColor}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />

        {customization?.backgroundImage !== undefined ? (
          <SvgImage
            clipPath={`url(#clip-${polygonId})`}
            href={customization?.backgroundImage}
            preserveAspectRatio='xMaxYMax slice'
            height={hex.height()}
            width={hex.width()}
          />
        ) : null}

        {customization?.content &&
          <CellContentView
            key={`cell-content-${cellContentAndForeignObjectCounter++}`}
            content={customization.content}
            hexHeight={hexHeight}
            hexWidth={hexWidth}
            textColor={textColor}
            imageWidth={contentImageWidth}
          />
        }
      </AnimatedG>
    </>
  )
}

// workaround to force ForeignObject rerender on content update
// see: https://github.com/react-native-community/react-native-svg/issues/1357
let cellContentAndForeignObjectCounter: number = 0

function CellContentView({ content, hexHeight, hexWidth, textColor, imageWidth }: { content: CellContent, hexHeight: number, hexWidth: number, textColor: ColorValue | undefined, imageWidth: number }): JSX.Element {
  const [imageLoaded, setImageLoaded] = React.useState(false)

  function onImageLoadEnd(): void {
    if (!imageLoaded)
      setImageLoaded(true) // update state to re-render component
  }

  return (
    <ForeignObject key={`foreign-object-render-${cellContentAndForeignObjectCounter}`}>
      <View style={[styles.cellContent, { height: hexHeight, width: hexWidth }]}>
        {content.image !== undefined ? (<Image source={content.image} onLoadEnd={onImageLoadEnd} tintColor='white' mainAxisSize={imageWidth} style={styles.image} />) : undefined}
        {content.h1 ? (<Text style={[styles.h1, { color: textColor }]}>{content.h1}</Text>) : undefined}
        {content.h2 ? (<Text style={[styles.h2, { color: textColor }]}>{content.h2}</Text>) : undefined}
      </View>
    </ForeignObject>
  )
}

function CellBehavior({ polygonId, customization, hexCoords }: {
  polygonId: string, customization: CellCustomization, hexCoords: Point
}): React.ReactElement {
  const [pressed, onPress] = useState(false as boolean)
  const animatedOpacity = useAnimation({
    type: 'timing',
    toValue: pressed ? 0.2 : 0,
    duration: 100,
    useNativeDriver: true,
  })
  return (
    <AnimatedG
      fill='white'
      opacity={animatedOpacity}
      x={hexCoords.x}
      y={hexCoords.y}
    >
      <Use
        href={`#${polygonId}`}
        onPress={customization.onPress}
        onPressIn={() => { onPress(true) }}
        onPressOut={() => { onPress(false) }}
      />
    </AnimatedG>
  )
}

const styles = StyleSheet.create({
  overlaySvg: {
    position: 'absolute',
  },
  cellContent: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: null as any, // workaround, see: https://github.com/react-native-community/react-native-svg/issues/1428
  },
  image: {
    marginBottom: 5,
  },
  h1: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  h2: {
    fontSize: 12,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: 'white',
  },
})
