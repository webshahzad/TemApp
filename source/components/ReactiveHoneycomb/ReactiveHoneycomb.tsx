//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { ReactElement, useState } from 'react'
import { View, Animated, StyleSheet, ColorValue, Text } from 'react-native'
import Svg, {
  Polygon, G, Defs, Use, ClipPath, Image as SvgImage,
  LinearGradient, Stop, Color, ForeignObject, NumberProp, Circle, Text as SvgText
} from 'react-native-svg'
import { extendHex, Hex, Point } from 'honeycomb-grid'
import { useAnimation } from 'react-native-animation-hooks'
import Image from 'react-native-autosize-image'
import { CellState, ReactiveCellContent, ReactiveCellCustomization, ReactiveHoneycombManager, ReactiveHoneycombProps } from './ReactiveHoneycombManager'
import { reactive } from 'common/reactive'

const AnimatedG = Animated.createAnimatedComponent(G)

export function ReactiveHoneycomb({ manager }: { manager: ReactiveHoneycombManager }): React.ReactElement {
  return reactive(() => {
    return (
      <View onLayout={manager.onLayout} style={manager.props.style}>
        <View style={{ marginHorizontal: -manager.horizontalShift, marginVertical: -manager.verticalShift, top: manager.top }}>
          <Svg>
            <Defs>
              {buildPolygonDefinitionAndClipPath('regular', manager.exampleHex)}
              {manager.buildFitStrokePolygon ?
                buildFitStrokePolygonDefinition('fitStroke', manager.props.strokeWidth ?? 0, manager.cellSize, manager.offset, manager.exampleHex) :
                undefined}
              {manager.cells.map(buildGradientDefinition)}
            </Defs>
       
            {manager.grid.map((hex, index) => {
              return (
                <Cell
                  key={`${hex.x},${hex.y}`}
                  manager={manager}
                  index={index}
                  hex={hex}
                  contentImageWidth={manager.props.contentImageWidth ?? 10}
                />
              )
            })}
          </Svg>

          <Svg style={styles.overlaySvg}>{/* workaround: ForeignObject is rendered above all other elements, so onPress can not be handled */}
            <Defs>
              {buildPolygonDefinitionAndClipPath('regular', manager.exampleHex)}
              {manager.buildFitStrokePolygon ?
                buildFitStrokePolygonDefinition('fitStroke', manager.props.strokeWidth ?? 0, manager.cellSize, manager.offset, manager.exampleHex) :
                undefined}
            </Defs>

            {manager.grid.map((hex, index) => {
              const customization: ReactiveCellCustomization | undefined = manager.cells[index]?.customization
              const hexCoords = hex.toPoint()
              let cellBehavior: ReactElement | undefined
              if (customization?.onPress)
                cellBehavior = (
                  <CellBehavior
                    state={manager.cells[index]}
                    hexCoords={hexCoords}
                  />
                )

              let cellHelp: React.ReactElement | undefined
              if (customization?.helpOnPress)
                cellHelp = (
                  <G x={hexCoords.x + manager.hexWidth - 8} y={hexCoords.y + manager.hexHeight - 8}>
                    <SvgText x='-2.5' y='4' fill='black'>?</SvgText>
                    <Circle r='8' stroke='black' onPress={customization.helpOnPress} />
                  </G>
                )

              return (
                <G key={`${hex.x},${hex.y}`}>
                  {cellBehavior}
                  {cellHelp}
                </G>
              )
            })}
          </Svg>
        </View>
      </View>
    )
  })
}

function buildGradientDefinition(c: CellState | undefined, index: number): JSX.Element | null {
  return (
    <React.Fragment key={`gradient-${index}`}>
      {c?.customization?.content?.backgroundGradient ? (
        <LinearGradient
          id={`gradient-${index}`}
          x1={c.customization.content.backgroundGradient.x1}
          x2={c.customization.content.backgroundGradient.x2}
          y1={c.customization.content.backgroundGradient.y1}
          y2={c.customization.content.backgroundGradient.y2}
        >
          {c.customization.content.backgroundGradient.stops.map(stop => (
            <Stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={stop.color}
              stopOpacity={stop.opacity}
            />
          ))}
        </LinearGradient>
      ) : null}

      {c?.customization.backSideContent?.backgroundGradient ? (
        <LinearGradient
          id={`gradient-${index}-back`}
          x1={c.customization.backSideContent.backgroundGradient.x1}
          x2={c.customization.backSideContent.backgroundGradient.x2}
          y1={c.customization.backSideContent.backgroundGradient.y1}
          y2={c.customization.backSideContent.backgroundGradient.y2}
        >
          {c.customization.backSideContent.backgroundGradient.stops.map(stop => (
            <Stop
              key={stop.offset}
              offset={stop.offset}
              stopColor={stop.color}
              stopOpacity={stop.opacity}
            />
          ))}
        </LinearGradient>
      ) : null}
    </React.Fragment>
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

function Cell({
  manager,
  index,
  hex,
  contentImageWidth,
}: {
  manager: ReactiveHoneycombManager,
  index: number,
  hex: Hex<{}>,
  contentImageWidth: number,
}): JSX.Element {
  return reactive(() => {
    const state = manager.cells[index]
    const textColor = manager.props.textColor ?? 'white'
    const hexCoords = hex.toPoint()
    const hexWidth = manager.hexWidth
    const hexHeight = manager.hexHeight
    const props = manager.props
    const cellFlipping = state?.cellFlipping
    if (cellFlipping) {
      cellFlipping.isFrontSide // subscribe to re-render (fix #34)
    }
    return (
      <>
        <AnimatedG
          x={hexCoords.x}
          y={hexCoords.y}
          originX={hexWidth / 2}
          originY={hexHeight / 2}
          opacity={cellFlipping?.frontSideOpacityAnimation}
        >
          <CellSide
            content={state?.customization?.content}
            hex={hex}
            hexHeight={hexHeight}
            hexWidth={hexWidth}
            textColor={textColor}
            contentImageWidth={contentImageWidth}
            gradient={`url(#gradient-${index})`}
            props={props}
            opacity={cellFlipping?.frontSideOpacityAnimation}
          />
        </AnimatedG>

        {state?.customization?.backSideContent ? (
          <AnimatedG
            x={hexCoords.x}
            y={hexCoords.y}
            originX={hexWidth / 2}
            originY={hexHeight / 2}
            opacity={cellFlipping?.backSideOpacityAnimation}
          >
            <CellSide
              content={state.customization?.backSideContent}
              hex={hex}
              hexHeight={hexHeight}
              hexWidth={hexWidth}
              textColor={textColor}
              contentImageWidth={contentImageWidth}
              gradient={`url(#gradient-${index}-back)`}
              props={props}
              opacity={cellFlipping?.backSideOpacityAnimation}
            />
          </AnimatedG>
        ) : null}
      </>
    )
  })
}

function CellSide({
  content, hex, hexHeight, hexWidth,
  textColor, contentImageWidth, gradient,
  props, opacity,
}: {
  content: ReactiveCellContent | undefined, hex: Hex<{}>, hexHeight: number, hexWidth: number
  textColor?: ColorValue, contentImageWidth: number, gradient: string,
  props: ReactiveHoneycombProps, opacity?: Animated.Value,
}): React.ReactElement {
  let fill: Color
  const polygonId = content?.fitStroke ? 'fitStroke' : 'regular'
  const stroke = content?.stroke ?? props.stroke
  const strokeWidth = content?.strokeWidth ?? props.strokeWidth ?? 0
  if (content?.backgroundGradient)
    fill = gradient
  else if (content?.backgroundColor !== undefined)
    fill = content.backgroundColor
  else
    fill = 'none'
  return (
    <>
      <Use
        href={`#${polygonId}`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />

      {content?.backgroundImage !== undefined ? (
        <SvgImage
          clipPath={`url(#clip-${polygonId})`}
          href={content?.backgroundImage}
          preserveAspectRatio='xMaxYMax slice'
          height={hex.height()}
          width={hex.width()}
        />
      ) : null}

      {content ?
        renderContent(content, hexHeight, hexWidth, textColor, contentImageWidth, opacity) :
        undefined}
    </>
  )
}

function renderContent(content: ReactiveCellContent, hexHeight: number, hexWidth: number, textColor: ColorValue | undefined, imageWidth: number,
  opacity?: Animated.Value): React.ReactElement | undefined {
  const avatarWidth = imageWidth * 1.5
  return (
    <ForeignObject>
      <View style={[styles.cellContent, { height: hexHeight, width: hexWidth }]}>
        {content.avatar !== undefined ? (
          <Image
            source={content.avatar}
            mainAxisSize={avatarWidth}
            style={[styles.image, { width: avatarWidth, height: avatarWidth, borderRadius: avatarWidth / 2 }]}
          />
        ) : undefined}
        {content.image !== undefined ? (<Image source={content.image} tintColor='white' mainAxisSize={imageWidth} style={styles.image} />) : undefined}
        {content.icon !== undefined && content.image === undefined ? content.icon : undefined}
        {content.h1 ? (<Animated.Text style={[styles.h1, { color: textColor, opacity }]}>{content.h1}</Animated.Text>) : undefined}
        {content.h2 ? (<Animated.Text style={[styles.h2, { color: textColor, opacity }]}>{content.h2}</Animated.Text>) : undefined}
      </View>
    </ForeignObject>
  )
}

function CellBehavior({ hexCoords, state }: {
  state: CellState | undefined, hexCoords: Point,
}): React.ReactElement {
  const [pressed, onPress] = useState(false as boolean)
  const animatedOpacity = useAnimation({
    type: 'timing',
    toValue: pressed ? 0.2 : 0,
    duration: 100,
    useNativeDriver: true,
  })
  const polygonId = state?.customization.content?.fitStroke ? 'fitStroke' : 'regular'
  return (
    <AnimatedG
      fill='white'
      opacity={animatedOpacity}
      x={hexCoords.x}
      y={hexCoords.y}
    >
      <Use
        href={`#${polygonId}`}
        onPress={state?.customization.onPress}
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
