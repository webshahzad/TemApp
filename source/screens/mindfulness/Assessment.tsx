//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Pages } from 'react-native-pages'
import { reactive } from 'common/reactive'
import { LightBlueColor, MainBlueColor } from 'components/Theme'
import { AssessmentQuestion } from 'models/app/MentalHealth/Assessment'
import { App } from 'models/app/App'
import { SafeAreaView } from 'react-native-safe-area-context'
import HoneycombImage from 'assets/images/splash/splash.png'
import { AnsweredQuestion } from 'models/app/MentalHealth/MentalHealth'
import { StackScreenProps } from '@react-navigation/stack'
import { MindfulnessPropsPerPath } from 'navigation/params'

export function Assessment(p: StackScreenProps<MindfulnessPropsPerPath, 'Assessment'>): React.ReactElement | null {
  const ref = React.useRef<Pages>(null)
  const mentalHealth = App.user.mentalHealth
  const assessment = mentalHealth.assessment

  const scrollFromIndex = (index: number, moveRight: boolean): void => {
    ref.current?.scrollToPage(index + (moveRight ? 1 : -1))
  }

  const scrollPage = (moveRight: boolean): void => {
    const currentPage = ref.current?.activeIndex ?? 0
    scrollFromIndex(currentPage, moveRight)
  }

  const submit = async (): Promise<void> => {
    const shouldPopOnce = mentalHealth.shouldOpenAssessmentDirectly()
    await mentalHealth.submitAssessment() // changes state and invalidates shouldOpenAssessmentDirectly() value
    if (shouldPopOnce)
      p.navigation.pop()
    else
      p.navigation.pop(2)
    p.navigation.replace('AssessmentCompleted')
  }

  return reactive(() => {
    return (
      <SafeAreaView style={styles.screen}>
        <Image source={HoneycombImage} style={styles.background} />

        {assessment !== undefined && (
          <View style={styles.content}>
            <Pages
              ref={ref}
              indicatorPosition='bottom'
              indicatorColor={MainBlueColor}
              indicatorOpacity={0.6}
            >
              {assessment.questions.map((question, i) => (
                <QuestionCard
                  key={`question-${i}`}
                  questionIndex={i}
                  question={question}
                  answer={App.user.mentalHealth.answeredQuestions[i]}
                />
              ))}
            </Pages>
            <View style={styles.bottomButtons}>
              <Text style={styles.button} onPress={() => scrollPage(false)}>Previous</Text>
              {mentalHealth.hasAllAnswers() ?
                (<Text style={styles.button} onPress={() => submit()}>Submit</Text>) :
                (<Text style={styles.button} onPress={() => scrollPage(true)}>Next</Text>)
              }
            </View>
          </View>
        )}
      </SafeAreaView>
    )
  })
}

function QuestionCard({ questionIndex, question, answer }: {
  questionIndex: number,
  question: AssessmentQuestion
  answer: AnsweredQuestion
}): JSX.Element {
  return reactive(() => {
    return (
      <ScrollView contentContainerStyle={styles.questionContainer}>
        <View style={styles.question}>
          <Text style={styles.questionText}>{question.text}</Text>
        </View>
        <View style={styles.answerOptions}>
          {question.options.map((optionText, optionIndex) => (
            <Text
              key={optionText}
              style={[styles.option, answer.answerIndex === optionIndex ? styles.selectedOption : undefined]}
              onPress={() => {
                void App.user.mentalHealth.selectAnswer(questionIndex, optionIndex)
              }}
            >
              {optionText}
            </Text>
          ))}
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  questionContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  question: {
    backgroundColor: 'white',
    color: 'black',
    padding: 10,
    borderRadius: 10,
    elevation: 10,
    marginBottom: 15,
  },
  questionText: {
    textAlign: 'center',
    fontSize: 20,
  },
  answerOptions: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'flex-end',
  },
  option: {
    marginBottom: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: MainBlueColor,
    backgroundColor: 'white',
    textAlign: 'center',
    color: 'black',
  },
  selectedOption: {
    backgroundColor: MainBlueColor,
    color: 'white',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 10,
    paddingTop: 10,
    // borderTopColor: MainBlueColor,
    // borderTopWidth: 1,
    backgroundColor: 'white',
    elevation: 15,
  },
  button: {
    borderRadius: 10,
    backgroundColor: LightBlueColor,
    color: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '45%',
    textAlign: 'center',
  },
})
