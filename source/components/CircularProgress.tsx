/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react'
import { Dimensions, View } from 'react-native'
import { Path, Defs, LinearGradient, Stop } from 'react-native-svg'
import { DashedProgress } from 'react-native-dashed-progress'

export interface circularProps {
  children?: any;
  styles?: object | boolean;
  strokeColor: string;
  barWidth: number;
  fill: number | undefined | string;
  radius: number;
  trailColor: string;
  strokeThickness?: number | undefined;
}
const CircularProgress = (p: circularProps) => {
  return (
    <View
      style={{
        overflow: 'hidden',
        // padding: 10,
        // display: "flex",

      }}
    >
      <DashedProgress
        fill={p.fill}
        countBars={100}
        radius={p.radius}
        strokeColor={p.strokeColor}
        barWidth={p.barWidth}
        indicatorWidth={10}
        strokeThickness={1}
        trailColor={p.trailColor}
        tooltipSize={0}
        dividerNumber={10}
        dividerNumberSize={9}
        containerStyle={p.styles}
        duration={3000}
        showIndicator={false}
      />
      {/* {p.children}
      <Defs>
        <LinearGradient id='grad' x1='0' y1='0' x2='1' y2='0'>
          <Stop offset='0' stopColor='#32C5FF' stopOpacity='10' />
          <Stop offset='0' stopColor='#B620E0' stopOpacity='1' />
          <Stop offset='1' stopColor='#F7B500' stopOpacity='10' />
        </LinearGradient>
      </Defs>
      <Path fill='url(#grad)' stroke='url(#grad)' /> */}
    </View>
  )
}

export default CircularProgress
