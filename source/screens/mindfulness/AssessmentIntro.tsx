//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import HoneycombImage from 'assets/images/splash/splash.png'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RoundButton } from 'components/RoundButton'
import { MainBlueColor } from 'components/Theme'
import { StackScreenProps } from '@react-navigation/stack'
import { MindfulnessPropsPerPath } from 'navigation/params'
import { App } from 'models/app/App'
import { NotificationsCard } from './ExerciseCarousel'

export function AssessmentIntro(p: StackScreenProps<MindfulnessPropsPerPath, 'AssessmentIntro'>): React.ReactElement {
  useEffect(() => {
    if (App.user.mentalHealth.shouldOpenAssessmentDirectly())
      void App.user.mentalHealth.refresh()
  }, [])

  return (
    <SafeAreaView style={styles.screen}>
      <Image source={HoneycombImage} style={styles.background} />

      <View style={styles.content}>
        <Text style={styles.text}>
          <Text style={styles.major}>Practice, Prepare, Perform</Text> will help you build a lifestyle
          (not just a moment) of success, healthy hyper-focus,
          goal setting, and new personal records.
        </Text>

        {App.user.mentalHealth.shouldOpenAssessmentDirectly() ? <NotificationsCard /> : null}

        <RoundButton
          style={styles.button}
          labelStyle={styles.buttonLabel}
          label='Get Started'
          background={MainBlueColor}
          color='white'
          onPress={() => p.navigation.push('Assessment')}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    height: '100%', width: '100%',
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  text: {
    textAlign: 'center',
    marginVertical: 40,
    marginHorizontal: 20,
    borderRadius: 10,
    fontSize: 20,
  },
  major: {
    fontWeight: 'bold',
  },
  button: {
    marginVertical: 20,
  },
  buttonLabel: {
  },
})
