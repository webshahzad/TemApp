//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useState } from 'react'
import { View, Animated, StyleSheet, Text, ColorValue } from 'react-native'
import { useLayout } from '@react-native-community/hooks'
import Svg, {
  Polygon, G, Defs, Use, ClipPath, Image as SvgImage,
  LinearGradient, Stop, Color, ForeignObject, NumberProp, Line
} from 'react-native-svg'
import { extendHex, defineGrid, Hex, onCreateCallback, Point } from 'honeycomb-grid'
import { HexagonProps, CellCustomization, CellContent, RadarStyle, RadarData } from './HexagonProps'
import { useAnimation } from 'react-native-animation-hooks'
import Image from 'react-native-autosize-image'

export function GNCHexagon(props: HexagonProps): React.ReactElement {
  const { onLayout, width, height } = useLayout()

  const spacing = props.spacing ?? 0
  // when `extraRows == true` there is an additional column in each row to cover entire container
  const columns = props.extraRows ? props.columns + 1 : props.columns

  const correctedWidth = width - spacing * (props.columns - 1)
  const cellSize = correctedWidth / props.columns / Math.sqrt(3)
  const exampleHex = extendHex({ size: cellSize })()
  const hexWidth = exampleHex.width()
  const hexHeight = exampleHex.height()

  let svgHeight: NumberProp

  let rows: number = (props.rows === 'auto' || props.rows < 0) ? 0 : props.rows
  if (rows === 0) {
    if (hexHeight > 0) {
      rows = Math.ceil((((height - hexHeight) / hexHeight) * 4) / 3)
      if (props.extraRows)
        rows += 2
    }
    svgHeight = '100%'
  }
  else {
    if (props.extraRows)
      rows += 2
    const nextRowHeight: number = hexHeight * 3 / 4 + spacing * Math.sqrt(3) / 2
    const bottomFix: number = 1
    svgHeight = hexHeight + (rows - 1) * nextRowHeight + bottomFix
    if (props.extraRows)
      svgHeight -= hexHeight * 3 / 4
  }

  let onCreate: onCreateCallback<Hex<{}>> | undefined = undefined
  if (spacing > 0) {
    const spacingCellSize = cellSize + spacing / Math.sqrt(3)
    const spacingHex: Hex<{ size: number }> = extendHex({ size: spacingCellSize })()
    onCreate = (hex, _) => {
      hex.size = spacingHex.size
    }
  }

  const hexFactory = extendHex({ size: cellSize })
  const gridFactory = defineGrid(hexFactory)
  const grid = gridFactory.rectangle({
    width: columns,
    height: rows,
    onCreate,
    start: props.extraRows ? [-0.25, -0.50] : 0,
  })

  const customizations: (CellCustomization | undefined)[] = []
  if (grid.length > 0) {
    if (props.removeLast)
      delete grid[grid.length - 1]

    if (props.cells) {
      for (const index in props.cells) {
        if (props.cells.hasOwnProperty(index)) {
          let indexFromStart = Number(index)
          indexFromStart = getIndexFromStart(indexFromStart, columns, props.extraRows)
          customizations[indexFromStart] = props.cells[index]
        }
      }
    }
  }

  const strokeWidth: number = Number(props.strokeWidth ?? 0)

  const hasOnPress = customizations.some(c => c?.onPress)
  const buildFitStrokePolygon = customizations.some(c => c?.fitStroke)
  const hexDefinitions = (
    <>
      {buildPolygonDefinitionAndClipPath('regular', exampleHex)}
      {buildFitStrokePolygon &&
        buildFitStrokePolygonDefinition('fitStroke', strokeWidth, cellSize, 0, exampleHex)
      }
    </>
  )

  let radarHex: Hex<{}> | undefined = undefined
  if (props.radarStyle) {
    const radarHexSize: number = cellSize - 3 * strokeWidth / 2
    radarHex = extendHex({ size: radarHexSize })(exampleHex)
  }

  return (
    <View onLayout={onLayout}>
      <Svg width='100%' height={svgHeight}>
        <Defs>
          {hexDefinitions}
          {customizations.map(buildGradientDefinition)}
          {customizations.some(c => c?.radarData) &&
            buildRadarPolygonDefinition('radar', strokeWidth, cellSize, 0, exampleHex, props.radarStyle)
          }
        </Defs>

        {grid.map((hex, index) => {
          const customization: CellCustomization | undefined = customizations[index]
          const polygonId =
            customization?.radarData ? 'radar' :
              customization?.fitStroke ? 'fitStroke' : 'regular'
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
          const textColor = props.textColor

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
              radarHex={radarHex}
            />
          )
        })}

        {grid.map((hex, index) => {
          const customization: CellCustomization | undefined = customizations[index]
          const polygonId = customization?.fitStroke ? 'fitStroke' : 'regular'

          if (customization?.onPress) {
            return (
              <CellBehavior
                key={`${hex.x},${hex.y}`}
                polygonId={polygonId}
                customization={customization}
                hex={hex}
              />
            )
          } else
            return undefined
        })}
      </Svg>

      {hasOnPress && (
        // workaround: ForeignObject is rendered above all other elements, so onPress can not be handled
        <Svg style={styles.overlaySvg}>
          <Defs>
            {hexDefinitions}
          </Defs>

          {grid.map((hex, index) => {
            const customization: CellCustomization | undefined = customizations[index]
            const polygonId = customization?.fitStroke ? 'fitStroke' : 'regular'

            if (customization?.onPress) {
              return (
                <CellBehavior
                  key={`${hex.x},${hex.y}`}
                  polygonId={polygonId}
                  customization={customization}
                  hex={hex}
                />
              )
            } else
              return undefined
          })}
        </Svg>
      )}
    </View>
  )
}

function buildGradientDefinition(c: (CellCustomization | undefined), index: number): JSX.Element | null {
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
  const points = hex.corners()
  return (
    <>
      <Polygon id={polygonId} points={points.map(vertex => `${vertex.x + hexOffset},${vertex.y + hexOffset}`)} />
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

function Cell({ polygonId, customization, hex, hexHeight, hexWidth, radarHex, backgroundColor, stroke, strokeWidth, textColor, contentImageWidth }: {
  polygonId: string, customization: (CellCustomization | undefined), hex: Hex<{}>, hexHeight: number, hexWidth: number, radarHex?: Hex<{}>,
  backgroundColor: Color, stroke?: Color, strokeWidth: React.ReactText, textColor?: ColorValue, contentImageWidth: number
}): JSX.Element {
  const hexCoords = hex.toPoint()
  return (
    <>
      <G x={hexCoords.x} y={hexCoords.y}>
        {customization?.backgroundImage !== undefined ? (
          <SvgImage
            clipPath={`url(#clip-${polygonId})`}
            href={customization?.backgroundImage}
            preserveAspectRatio='xMaxYMax slice'
            height={hex.height()}
            width={hex.width()}
          />
        ) : null}

        <Use
          href={`#${polygonId}`}
          fill={backgroundColor}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />

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

        {customization?.radarData && radarHex &&
          renderRadarData(customization.radarData, hex, radarHex)}
      </G>
    </>
  )
}

// workaround to force ForeignObject rerender on content update
// see: https://github.com/react-native-community/react-native-svg/issues/1357
let cellContentAndForeignObjectCounter = 0

function CellContentView({ content, hexHeight, hexWidth, textColor, imageWidth }: { content: CellContent, hexHeight: number, hexWidth: number, textColor: ColorValue | undefined, imageWidth: number }): JSX.Element {
  const [imageLoaded, setImageLoaded] = React.useState(false)

  function onImageLoadEnd(): void {
    if (!imageLoaded)
      setImageLoaded(true) // update state to re-render component
  }

  const color: ColorValue | undefined = content.textColor ?? textColor
  let result: JSX.Element
  // workaround to properly draw single image (tintColor not applicable)
  if (content.useSvgImageOnly) {
    result = (
      <SvgImage
        href={content.image}
        preserveAspectRatio='xMidYMid meet'
        height={hexHeight}
        width={imageWidth}
        x={(hexWidth - imageWidth) / 2}
      />
    )
  }
  else {
    result = (
      <ForeignObject key={`foreign-object-render-${cellContentAndForeignObjectCounter}`}>
        <View style={[styles.cellContent, { height: hexHeight, width: hexWidth }]}>
          {content.image !== undefined ? (<Image source={content.image as number} onLoadEnd={onImageLoadEnd} tintColor={content.tintColor} mainAxisSize={imageWidth} style={styles.image} />) : undefined}
          {content.h1 ? (<Text style={[styles.h1, { color, fontSize: content.h1size }]}>{content.h1}</Text>) : undefined}
          {content.h2 ? (<Text style={[styles.h2, { color, fontSize: content.h2size }]}>{content.h2}</Text>) : undefined}
        </View>
      </ForeignObject>
    )
  }
  return result
}

const AnimatedG = Animated.createAnimatedComponent(G)

function CellBehavior({ polygonId, customization, hex }: {
  polygonId: string, customization: CellCustomization, hex: Hex<{}>
}): React.ReactElement {
  const [active, setActive] = useState(false as boolean)
  const animatedOpacity = useAnimation({
    type: 'timing',
    toValue: active ? 0.2 : 0,
    duration: 100,
    useNativeDriver: true,
  })
  const hexCoords = hex.toPoint()
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
        onPressIn={() => { setActive(true) }}
        onPressOut={() => { setActive(false) }}
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
    textAlign: 'center',
  },
  h2: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
})

function getIndexFromStart(index: number, columns: number, extraRows: boolean | undefined): number {
  let i: number = 0
  let row: number = 0
  let currentRowWidth: number = columns
  if (extraRows)
    index += columns
  while (index >= currentRowWidth) {
    index -= currentRowWidth
    row++
    if (row % 2 === 0) {
      currentRowWidth = columns
      if (extraRows) {
        currentRowWidth -= 1
        index += 1
      }
    } else {
      currentRowWidth = columns - 1
    }
    i += columns
  }
  i += index
  return i
}

// Radar

function buildRadarPolygonDefinition(polygonId: string, strokeWidth: NumberProp, cellSize: number, offset: number,
  exampleHex: Hex<{}>, radarStyle: RadarStyle = defaultRadarStyle): React.ReactElement {

  const stroke = Number(strokeWidth)
  const fullSize: number = cellSize - stroke
  const sectionCount: number = radarStyle.coaxialSections
  const sectionSize: number = fullSize / sectionCount
  const inner: Hex<{}>[] = []
  for (let i = 0; i < radarStyle.coaxialSections; i++) {
    const size: number = fullSize - i * sectionSize - stroke / 2
    const hexFactory = extendHex({ size, offset })
    const hex = hexFactory(exampleHex)
    inner.push(hex)
  }
  const outerHexFactory = extendHex({ size: fullSize, offset })
  const outer = outerHexFactory(exampleHex)
  return buildRadarPolygonDefinitionAndClipPath(polygonId, outer, inner, radarStyle, stroke)
}

function buildRadarPolygonDefinitionAndClipPath(polygonId: string, outer: Hex<{}>, inner: Hex<{}>[],
  radarStyle: RadarStyle, strokeWidth: number = 0): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)> {

  const outerWidth = outer.width()
  const outerHeight = outer.height()

  const axisPoints = inner[0].corners()
  const axisOffsetX = strokeWidth + (outerWidth - inner[0].width()) / 2
  const axisOffsetY = strokeWidth + (outerHeight - inner[0].height()) / 2
  const opposites: [Point, Point][] = []
  for (let i = 0; i < 3; i++)
    opposites.push([axisPoints[i].add(axisOffsetX, axisOffsetY), axisPoints[i + 3].add(axisOffsetX, axisOffsetY)])

  return (
    <>
      <G id={polygonId}>
        <Polygon points={outer.corners().map(vertex => `${vertex.x + strokeWidth},${vertex.y + strokeWidth}`)} />
        <G stroke={radarStyle.axisStroke} strokeWidth={radarStyle.axisStrokeWidth}>
          {opposites.map((p, i) => (
            <Line key={'line-' + i} x1={p[0].x} y1={p[0].y} x2={p[1].x} y2={p[1].y} />
          ))}
          {inner.map((h, i) => {
            const offsetX = strokeWidth + (outerWidth - h.width()) / 2
            const offsetY = strokeWidth + (outerHeight - h.height()) / 2
            return (
              <Polygon fill='none' key={polygonId + '-' + i} points={h.corners().map(p => `${p.x + offsetX},${p.y + offsetY}`)} />
            )
          }
          )}
        </G>
      </G>
      <ClipPath id={`clip-${polygonId}`}>
        <Use href={`#${polygonId}`} />
      </ClipPath>
    </>
  )
}

function renderRadarData(data: RadarData, hex: Hex<{}>, radarHex: Hex<{}>): JSX.Element {
  const offsetX = (hex.width() - radarHex.width()) / 2 + 1
  const offsetY = (hex.height() - radarHex.height()) / 2
  const corners = radarHex.corners().map(p => p.add({ x: offsetX, y: offsetY }))
  const center = hex.center()
  const x0 = center.x
  const y0 = center.y
  const points: { x: number, y: number }[] = []
  for (let i = 0; i < corners.length; i++) {
    const value = (data.values[i] ?? 0)
    const xLength = corners[i].x - x0
    const yLength = corners[i].y - y0
    const x: number = x0 + xLength * value / data.maxValue
    const y: number = y0 + yLength * value / data.maxValue
    points.push({ x, y })
  }
  return (
    <Polygon stroke={data.stroke} strokeWidth={data.strokeWidth} fill={data.fill} fillOpacity={0.5} points={points.map(p => `${p.x},${p.y}`)} />
  )
}

const defaultRadarStyle: RadarStyle = {
  axisStroke: 'black',
  axisStrokeWidth: 1,
  coaxialSections: 5,
}
