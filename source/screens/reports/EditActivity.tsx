//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useState } from 'react'
import { Transaction, Ref } from 'reactronic'
import { reactive } from 'common/reactive'
import { Text, View, StyleSheet, Alert, ScrollView, Image, ToastAndroid } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackScreenProps } from '@react-navigation/stack'

import { RootStackPropsPerPath } from 'navigation/params'
import { App } from 'models/app/App'
import { InputBadge } from 'components/InputBadge'
import { PickerBadge } from 'components/PickerBadge'
import { PickerManager } from 'models/app/PickerManager'
import { RoundButton } from 'components/RoundButton'
import { DangerColor, MainBlueColor } from 'components/Theme'
import { doAsync } from 'common/doAsync'
import { WheelPickerBadge } from 'components/WheelPickerBadge'
import { TimeManager } from 'models/app/Calendar/TimeManager'

import ClockImage from 'assets/icons/act-clock/clock.png'
import ActivityImage from 'assets/icons/act/act.png'

export function EditActivity(p: StackScreenProps<RootStackPropsPerPath, 'EditActivity'>): JSX.Element {
  const model = p.route.params.model

  const modelRef = Ref.to(model)

  const [activityPickerManager] = useState(() => Transaction.run(
    () => new PickerManager(App.activityManager.activityList, modelRef.activityPickerValue)))

  const [timePickerManager] = useState(() => Transaction.run(
    () => new TimeManager({ time: modelRef.timePickerValue, forActivity: true })))

  return reactive(() => {
    // Validation
    const showInvalidActivity = model.isInvalid && !model.hasValidActivity
    const showInvalidTime = model.isInvalid && !model.hasValidTime
    const showInvalidDistance = model.isInvalid && !model.hasValidDistance

    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.input}>
            <PickerBadge
              label='Activity'
              labelBackgroundColor='white'
              icon={ActivityImage}
              manager={activityPickerManager}
              doBeforeOpen={async () => {
                if (App.activityManager.needToLoadActivityList) {
                  await App.activityManager.loadActivityList()
                }
                activityPickerManager.setOptions(App.activityManager.activityList)
              }}
              renderEmptyPicker={() => (
                <Text style={{ flex: 1, paddingVertical: 5, color: 'lightgray' }}>{/* Preserve height */}</Text>
              )}
              renderPickerItem={item => (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 15, paddingLeft: 10, borderBottomColor: 'lightgray', borderBottomWidth: 1 }}>
                  <Image source={{ uri: item.image }} tintColor='black' style={{ height: 30, width: 30, resizeMode: 'contain', marginRight: 10 }} />
                  <Text style={{ backgroundColor: 'white', fontSize: 17 }}>{item.name}</Text>
                </View>
              )}
              renderSelectedItem={item => {
                return (
                  <Text style={{ flex: 1, paddingVertical: 5, color: 'black' }}>{item.name}</Text>
                )
              }}
              getKey={item => item.id.toString()}
            />
            <Text style={[styles.validationMessage, { color: showInvalidActivity ? DangerColor : 'transparent' }]}>Please select activity</Text>
          </View>
          <View style={styles.input}>
            <WheelPickerBadge
              manager={timePickerManager}
              label='Time Spent'
              labelBackgroundColor='white'
              icon={ClockImage}
            />
            <Text style={[styles.validationMessage, { color: showInvalidTime ? DangerColor : 'transparent' }]}>Please enter time spent</Text>
          </View>
          {
            model.isDistanceType() &&
            (
              <View style={styles.input}>
                <InputBadge
                  label='Distance'
                  labelBackgroundColor='white'
                  icon={ClockImage}
                  model={modelRef.distance}
                  keyboardType='numeric'
                />
                <Text style={[styles.validationMessage, { color: showInvalidDistance ? DangerColor : 'transparent' }]}>Please enter distance</Text>
              </View>
            )
          }
          <View style={styles.updateContainer}>
            <RoundButton
              label='UPDATE'
              color='white'
              background={MainBlueColor}
              onPress={() => doAsync(async () => {
                if (model.validate()) {
                  Alert.alert('Update activity?', undefined, [
                    { text: 'No' },
                    {
                      text: 'Yes',
                      onPress: async () => {
                        await App.activityManager.updateUserActivity(model)
                        model.applySummary()
                        ToastAndroid.show('Activity updated', ToastAndroid.SHORT)
                        p.navigation.pop()
                      },
                    }
                  ])
                }
              })}
            />
          </View>
        </ScrollView>
      </SafeAreaView >
    )
  })
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: 'white',
    height: '100%',
  },
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 5,
  },
  validationMessage: {
    color: DangerColor,
    fontSize: 12,
  },
  updateContainer: {
    width: '40%',
    marginTop: 10,
    alignSelf: 'center',
  },
})
