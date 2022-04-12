//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Dimensions, ImageSourcePropType, Modal, StyleSheet, Text, View } from 'react-native'
import AutoImage from 'react-native-autosize-image'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Pages, PagesPage } from 'react-native-pages'

import { TutorialManager } from './TutorialManager'
import { reactive } from 'common/reactive'

import TutorialBottom from 'assets/images/tutorial/tut1.png'
import Logo from 'assets/images/t-honeycomb.png'
import Profile from 'assets/images/tutorial/tut3.png'
import Challenges from 'assets/images/tutorial/tut2.png'
import Tutorial3 from 'assets/images/tutorial/tut4.png'
import Tutorial4 from 'assets/images/tutorial/tut5.png'
import { MainBlueColor } from 'components/Theme'

const CloseIndex = -1

export function TutorialModal(p: { manager: TutorialManager }): JSX.Element {
  const ref = React.useRef<Pages>(null)
  const { manager } = p

  const onPress = (index: number): void => {
    if (index === CloseIndex) {
      manager.hide()
    }
    else {
      ref.current?.scrollToPage(index + 1)
    }
  }

  return reactive(() => {
    return (
      <Modal visible={manager.visible} transparent>
        <SafeAreaView style={styles.container}>
          <Pages
            ref={ref}
            indicatorPosition='bottom'
            indicatorColor='white'
            indicatorOpacity={0.54}
          >
            <TutorialPage
              image={Logo}
              title='Welcome to TĒM'
              text={'We are excited that you joined us! Let\'s get you started. There is a ton you can do on the app, but we think you\'ll really want to know about:'}
              bottomTitle={'TĒMATES\nCHALLENGES & GOALS\nSCORES'}
              bottomText='We will let you play around with the other stuff.'
              buttonPress={onPress}
            />
            <TutorialPage
              image={Profile}
              bottomTitle='TĒMATES'
              bottomText='Search for and add your tēmates here.'
              buttonPress={onPress}
            />
            <TutorialPage
              image={Challenges}
              bottomTitle='Challenges/Goals'
              bottomText='Create challenges and set goals here.'
              buttonPress={onPress}
            />
            <TutorialPage
              image={Tutorial3}
              bottomTitle='ACTIVITY SCORE'
              bottomText={'This is your Activity Score.\nPress it to learn more.'}
              buttonPress={onPress}
            />
            <TutorialPage
              image={Tutorial4}
              bottomTitle='HAIS SCORE'
              bottomText={'Press the center honeycomb to see your HAIS.\nPress the logo to learn more.\nENJOY!'}
              buttonPress={onPress}
            />
          </Pages>
        </SafeAreaView>
      </Modal>
    )
  })
}

interface TutorialPageProps extends Partial<PagesPage> {
  bottomText?: string
  bottomTitle?: string
  image: ImageSourcePropType
  text?: string
  title?: string
  buttonText?: string
  buttonPress?: (index: number) => void
}

function TutorialPage(p: TutorialPageProps): JSX.Element {
  const { bottomText, bottomTitle, image, text, title, buttonPress, index, pages } = p

  const current = index ?? 0
  const total = pages ?? 0
  const isLast: boolean = current === (total - 1)

  return (
    <View style={styles.page}>
      <Text
        style={[styles.controlButton, styles.buttonNext]}
        onPress={() => buttonPress && buttonPress(isLast ? CloseIndex : current)}
      >
        {isLast ? 'Done' : 'Next'}
      </Text>
      {!isLast && (
        <Text
          style={[styles.controlButton, styles.buttonSkip]}
          onPress={() => buttonPress && buttonPress(CloseIndex)}
        >
          Skip
        </Text>
      )}
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        <AutoImage source={image} mainAxisSize={Dimensions.get('screen').width / 2} />
        <Text style={styles.centerText}>{text}</Text>
      </View>
      <View>
        <View style={styles.bottomTextWrapper}>
          <Text style={[styles.title, styles.bottomTitle]}>{bottomTitle}</Text>
          <Text style={styles.bottomText}>{bottomText}</Text>
        </View>
        <AutoImage source={TutorialBottom} mainAxisSize={Dimensions.get('screen').width} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FFFFFFEE',
  },
  page: {
    flex: 1,
  },
  controlButton: {
    position: 'absolute',
    top: 20,
    fontSize: 17,
    fontWeight: 'bold',
  },
  buttonNext: {
    right: 20,
    color: MainBlueColor,
  },
  buttonSkip: {
    left: 20,
    color: 'lightgray',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  bottomTitle: {
    color: 'white',
    paddingTop: 20,
  },
  bottomText: {
    color: 'white',
    textAlign: 'center',
    paddingTop: 5,
  },
  bottomTextWrapper: {
    zIndex: 1,
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
})
