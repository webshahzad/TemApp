//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { Pages, PagesPage } from 'react-native-pages'
import { reactive } from 'common/reactive'
import { MainBlueColor } from 'components/Theme'
import { RoundButton } from 'components/RoundButton'
import { Exercise, ExerciseType } from 'models/app/MentalHealth/Exercise'
import { App } from 'models/app/App'
import { TextInput } from 'react-native-gesture-handler'

export function ExerciseCarousel(): React.ReactElement | null {
  const ref = React.useRef<Pages>(null)

  const mentalHealth = App.user.mentalHealth

  return reactive(() => {
    return (
      <Pages
        ref={ref}
        indicatorPosition='bottom'
        indicatorColor={MainBlueColor}
        indicatorOpacity={0.6}
        startPage={0}
      >
        <ExerciseIntro pagesRef={ref} />
        {mentalHealth.getAllExercises().map((ex, i) => (
          <ExerciseCard
            key={ex._id}
            exercise={ex}
            onDonePress={async text => {
              await mentalHealth.completeExercise(ex, text)
              ToastAndroid.show('Well Done!', ToastAndroid.SHORT)
            }}
          />
        ))}
      </Pages>
    )
  })
}

function ExerciseIntro({ pagesRef }: { pagesRef: React.RefObject<Pages> }): React.ReactElement {
  const mentalHealth = App.user.mentalHealth
  return reactive(() => {
    const showAdditional: boolean = mentalHealth.shouldShowAdditionalExercises()
    return (
      <ScrollView contentContainerStyle={styles.scrollablePage}>
        <View style={styles.card}>
          {
            showAdditional ? (
              <Text style={styles.cardText}>Wow, you've done all exercises, do you want to go into deeper practice?</Text>
            ) : (
              <Text style={styles.cardText}>Do you want to do some mental exercises?</Text>
            )
          }
          <RoundButton
            label={showAdditional ? 'Go to additional exercises' : 'Go to exercise'}
            background={MainBlueColor}
            color='white'
            style={styles.button}
            onPress={() => {
              if (showAdditional) {
                pagesRef.current!.scrollToPage(mentalHealth.exercises.length + 1)
              }
              else {
                const index = mentalHealth.getNotDoneExerciseIndex()
                if (index >= 0)
                pagesRef.current!.scrollToPage(index + 1)
                else
                pagesRef.current!.scrollToPage(1)
              }
            }}
          />
        </View>

        <NotificationsCard />
      </ScrollView>
    )
  })
}

interface ExerciseCardProps extends Partial<PagesPage> {
  exercise: Exercise
  onDonePress: (text?: string) => void
}

function ExerciseCard(p: ExerciseCardProps): JSX.Element {
  const isJournal: boolean = p.exercise.type === ExerciseType.Journal
  const [text, setText] = React.useState<string>('')
  return (
    <ScrollView contentContainerStyle={[styles.scrollablePage, styles.exercise]}>
      <View style={styles.card}>
        <Text style={styles.cardText}>{p.exercise.text}</Text>
      </View>
      {isJournal ? (
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.textBox}
            multiline
            textAlignVertical='top'
            placeholder='Your answer'
            defaultValue={text}
            onChangeText={text => setText(text)}
          />
        </View>
      ) : null}
      <View style={styles.bottomPanel}>
        {p.exercise.doneBefore && (
          <Text style={styles.doneText}>
            You completed this exercise once,{'\r\n'}
            would you like to do it again?
          </Text>
        )}
        <RoundButton
          label={isJournal ? 'Submit' : 'Mark as done'}
          background={MainBlueColor}
          color='white'
          style={styles.button}
          onPress={() => {
            p.onDonePress(isJournal ? text : undefined)
          }}
        />
      </View>
    </ScrollView>
  )
}

export function NotificationsCard(): React.ReactElement {
  return reactive(() => {
    if (App.user.mentalHealth.assessmentNotificationDisabled) {
      return (
        <View style={styles.card}>
          <Text style={styles.cardText}>Sometimes we send some notifications, would you allow us to display it?</Text>
          <RoundButton
            label='Enable notifications'
            background={MainBlueColor}
            color='white'
            style={styles.button}
            onPress={async () => {
              await App.user.mentalHealth.setAssessmentNotificationsEnabled(true)
              ToastAndroid.show('Notifications enabled', ToastAndroid.SHORT)
            }}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.card}>
          <Text style={styles.cardText}>Tired of Mental Health Platform notifications?</Text>
          <RoundButton
            label='Disable notifications'
            background={MainBlueColor}
            color='white'
            style={styles.button}
            onPress={async () => {
              await App.user.mentalHealth.setAssessmentNotificationsEnabled(false)
              ToastAndroid.show('Notifications disabled', ToastAndroid.SHORT)
            }}
          />
        </View>
      )
    }
  })
}

const styles = StyleSheet.create({
  scrollablePage: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  exercise: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    color: 'black',
    padding: 10,
    borderRadius: 10,
    elevation: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  cardText: {
    textAlign: 'center',
    fontSize: 16,
  },
  textBox: {
    flex: 1,
    minHeight: 150,
    borderWidth: 1,
    borderColor: 'lightgrey',
    backgroundColor: 'white',
    padding: 5,
  },
  bottomPanel: {
  },
  button: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  doneText: {
    marginTop: 10,
    color: 'gray',
    fontSize: 14,
    textAlign: 'center',
  },
})
