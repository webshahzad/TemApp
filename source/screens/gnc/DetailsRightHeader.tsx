//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { View, Pressable, Image, ImageSourcePropType, Alert, ToastAndroid } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackPropsPerPath } from 'navigation/params'

import { reactive } from 'common/reactive'
import { Bool } from 'common/constants'
import { doAsync } from 'common/doAsync'
import { ActivityStatus, ActivityType } from 'models/data/GoalOrChallenge'
import { GoalChallengeDetailsModel } from 'models/data/GoalChallengeDetailsModel'
import { App } from 'models/app/App'

import EditIcon from 'assets/icons/edit/edit.png'
import HoneySelectedIcon from 'assets/icons/honey/honey-selected.png'
import HoneyUnselectedIcon from 'assets/icons/honey/honey-unselected.png'
import { HoneyCombType } from 'models/app/ExtraHoneyCombs'
import { standalone, Transaction } from 'reactronic'

export function DetailsRightHeader(p: { model: GoalChallengeDetailsModel; navigation: StackNavigationProp<RootStackPropsPerPath> }): JSX.Element {
  const model = p.model
  return reactive(() => {
    const isShownOnDashboard: boolean = (model.showHoneyComb === Bool.True)
    const hexSource: ImageSourcePropType = isShownOnDashboard
      ? HoneySelectedIcon
      : HoneyUnselectedIcon
    const createdBy = model.goalCreatedBy ?? model.challengeCreatedBy
    return (
      <View style={{ flexDirection: 'row' }}>
        <Pressable
          style={{ marginRight: 10 }}
          onPress={() => changeShowHoneyComb(model)}
        >
          <Image source={hexSource} fadeDuration={0} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
        </Pressable>
        {createdBy === App.user.stored._id &&
          model.status !== ActivityStatus.Completed &&
          (
            <Pressable
              style={{ marginRight: 10 }}
              onPress={() => App.goalsAndChallenges.editGoalOrChallenge(model)}
            >
              <Image source={EditIcon} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
            </Pressable>
          )}
      </View>
    )
  })
}

async function changeShowHoneyComb(model: GoalChallengeDetailsModel): Promise<void> {
  if (model.showHoneyComb || App.user.extraHoneyCombs.canAddMore) {
    const text: string = 'Are you sure you want to '
      + (
        (model.showHoneyComb === Bool.True)
          ? 'remove from'
          : 'add to'
      )
      + ' honeycomb home screen?'
    Alert.alert('', text, [
      { text: 'No' },
      {
        text: 'Yes',
        onPress: () => doAsync(async () =>
          standalone(() => Transaction.run(async () => {
            const type = (model.gncType === ActivityType.Goal) ? HoneyCombType.Goal : HoneyCombType.Challenge
            const status = (model.showHoneyComb !== Bool.True)
            const message = await App.user.extraHoneyCombs.updateAddedToDashboard(type, status, model._id, model.name)
            model.showHoneyComb = model.showHoneyComb === Bool.True ? Bool.False : Bool.True
            // TODO: readable message
            ToastAndroid.show(message, ToastAndroid.SHORT)
            console.log(message)
          }))),
      }
    ])
  }
  else {
    Alert.alert('', 'You should remove a tile in order to add this tile to the honeycomb home screen.')
  }
}
