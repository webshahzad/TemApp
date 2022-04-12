//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Image, Pressable, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'
import { MainBlueColor } from 'components/Theme'
import { MindfulnessPropsPerPath } from 'navigation/params'
import { ExerciseCarousel } from './ExerciseCarousel'
import { App } from 'models/app/App'
import ArrowRightIcon from 'assets/icons/arrow-right/arrow-right.png'
import HoneycombImage from 'assets/images/splash/splash.png'
import { reactive } from 'common/reactive'
import { useOnFocus } from 'common/useOnFocus'

export function Mindfulness(p: StackScreenProps<MindfulnessPropsPerPath, 'Main'>): React.ReactElement {
  useOnFocus(p.navigation, () => {
    void App.user.mentalHealth.refresh()
  })

  return reactive(() => {
    const mentalHealth = App.user.mentalHealth
    return (
      <SafeAreaView style={styles.screen}>
        <Image style={styles.background} source={HoneycombImage} />

        {mentalHealth.assessment && (
          <Pressable style={styles.newAssessment} onPress={() => p.navigation.push('AssessmentIntro')}>
            <Text style={styles.newAssessmentText}>New Assessment Available</Text>
            <Image source={ArrowRightIcon} tintColor='white' />
          </Pressable>
        )}
        <ExerciseCarousel />
      </SafeAreaView>
    )
  })
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

  newAssessment: {
    backgroundColor: MainBlueColor,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  newAssessmentText: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
})
