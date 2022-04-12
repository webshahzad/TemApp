//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import HoneycombImage from 'assets/images/splash/splash.png'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RoundButton } from 'components/RoundButton'
import { GrayColor, LightBlueColor, MainBlueColor } from 'components/Theme'
import { StackScreenProps } from '@react-navigation/stack'
import { MindfulnessPropsPerPath } from 'navigation/params'
import Svg, { Circle, Color, Path } from 'react-native-svg'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { ObservableObject, unobservable, Transaction, transaction } from 'reactronic'
import { reactive } from 'common/reactive'

export function AssessmentCompleted(p: StackScreenProps<MindfulnessPropsPerPath, 'AssessmentCompleted'>): React.ReactElement {
  return (
    <SafeAreaView style={styles.screen}>
      <Image source={HoneycombImage} style={styles.background} />

      <Text style={styles.text}>
        Congratulations! You have completed a Practice, Prepare and Perform Assessment
      </Text>

      <Text style={styles.text}>
        More things are awaiting down the road!
      </Text>

      {/* <Player controls /> */}

      <RoundButton
        style={styles.button}
        labelStyle={styles.buttonLabel}
        label='Go to Exercises'
        background={MainBlueColor}
        color='white'
        onPress={() => p.navigation.replace('Main')}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
  },
  background: {
    position: 'absolute',
    height: '100%', width: '100%',
    resizeMode: 'cover',
  },
  text: {
    textAlign: 'center',
    marginVertical: 40,
    marginHorizontal: 40,
    borderRadius: 10,
    fontSize: 20,
  },
  button: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  buttonLabel: {
  },
})

// Player

class PlayerModel extends ObservableObject {
  percentage: number = 0
  isPlaying: boolean = false
  timer: any = null

  @unobservable readonly RewindSecondsDelta: number

  constructor() {
    super()
    this.RewindSecondsDelta = 10
  }

  @transaction
  play(): void {
    if (!this.isPlaying) {
      if (this.percentage === 100)
        this.percentage = 0
      this.timer = setInterval(() => this.onTimer(), 500)
      this.isPlaying = true
    }
  }

  @transaction
  pause(): void {
    if (this.isPlaying) {
      clearInterval(this.timer)
      this.timer = null
      this.isPlaying = false
    }
  }

  @transaction
  rewind(): void {
    if (this.percentage - this.RewindSecondsDelta >= 0)
      this.percentage -= this.RewindSecondsDelta
    else
      this.percentage = 0
  }

  @transaction
  fastForward(): void {
    if (this.percentage + this.RewindSecondsDelta <= 100)
      this.percentage += this.RewindSecondsDelta
    else
      this.percentage = 100
  }

  @transaction
  onTimer(): void {
    if (this.percentage + this.RewindSecondsDelta < 100)
      this.percentage += this.RewindSecondsDelta
    else {
      this.percentage = 100
      this.pause()
    }
  }
}

function Player({ controls }: { controls?: boolean }): JSX.Element {
  const [player] = React.useState<PlayerModel>(() => Transaction.run(() => new PlayerModel()))
  return reactive(() => {
    return (
      <View style={playerStyles.container}>
        {controls && (
          <Pressable onPress={() => player.rewind()} style={playerStyles.rewind}>
            <Icon name='rewind-10' size={30} />
          </Pressable>
        )}
        <Pressable onPress={() => player.isPlaying ? player.pause() : player.play()} style={playerStyles.playPause}>
          <CircularProgress
            percentage={player.percentage}
            backgroundColor='white'
            progressColor={LightBlueColor}
            emptyProgressColor={GrayColor}
            centerRadius={40}
            size={100}
          >
            <Icon name={player.isPlaying ? 'pause' : 'play'} size={40} />
          </CircularProgress>
        </Pressable>
        {controls && (
          <Pressable onPress={() => player.fastForward()} style={playerStyles.rewind}>
            <Icon name='fast-forward-10' size={30} />
          </Pressable>
        )}
      </View>
    )
  })
}

const playerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPause: {
    marginHorizontal: 20,
  },
  rewind: {

  },
})

function CircularProgress({
  percentage,
  backgroundColor,
  progressColor,
  emptyProgressColor,
  centerRadius,
  size,
  children,
}: React.PropsWithChildren<{
  percentage: number,
  backgroundColor: Color,
  progressColor: Color,
  emptyProgressColor: Color,
  centerRadius: number,
  size: number,
}>): JSX.Element {
  const center = size / 2
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={center} cy={center} r={center} fill={emptyProgressColor} />
        <Path
          d={`M${center} ${center} L${center} 0 ${getSvgArc(percentage, center)} Z`}
          fill={progressColor}
        />
        {<Circle cx={center} cy={center} r={centerRadius} fill={backgroundColor} />}
      </Svg>
      <View style={circleStyles.children}>
        {children}
      </View>
    </View>
  )
}

function getSvgArc(percentage: number, radius: number): string {
  if (percentage === 100)
    percentage = 99.9999
  const angle: number = percentage * 2 * Math.PI / 100
  const r = radius
  const rx = r
  const ry = r
  const xAxisRotation = 0
  const largeArcFlag = (percentage <= 50) ? 0 : 1
  const sweepFlag = 1
  const x = r + r * Math.sin(angle)
  const y = r - r * Math.cos(angle)

  return `A${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`
}

const circleStyles = StyleSheet.create({
  children: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
