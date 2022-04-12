//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Ref } from 'reactronic'
import { reactive } from 'common/reactive'
import { StyleSheet, View, Pressable, Text, ImageSourcePropType } from 'react-native'
import { Transaction } from 'reactronic'
import { ChallengeType } from 'models/data/GoalOrChallenge'
import Image from 'react-native-autosize-image'

import UserVsUserImage from 'assets/images/challenge-type/indVsInd.png'
import UserVsUserSelectedImage from 'assets/images/challenge-type/indVsIndSel.png'
import UserVsTeamImage from 'assets/images/challenge-type/indVsTem.png'
import UserVsTeamSelectedImage from 'assets/images/challenge-type/indVsTemSel.png'
import TeamVsTeamImage from 'assets/images/challenge-type/temVsTem.png'
import TeamVsTeamSelectedImage from 'assets/images/challenge-type/temVsTemSel.png'


export interface ChallengeTypeSelectorProps {
  model: Ref<ChallengeType | undefined>
}

interface ChallengeTypeItem {
  type: ChallengeType
  image: ImageSourcePropType
  selectedImage: ImageSourcePropType
}

const Items: ChallengeTypeItem[] = [
  {
    type: ChallengeType.UserVsUser,
    image: UserVsUserImage,
    selectedImage: UserVsUserSelectedImage,
  },
  {
    type: ChallengeType.UserVsTeam,
    image: UserVsTeamImage,
    selectedImage: UserVsTeamSelectedImage,
  },
  {
    type: ChallengeType.TeamVsTeam,
    image: TeamVsTeamImage,
    selectedImage: TeamVsTeamSelectedImage,
  },
]

export function ChallengeTypeSelector(p: ChallengeTypeSelectorProps): JSX.Element {
  return reactive(() => {
    return (
      <View style={styles.container}>
        {Items.map(item => {
          const selected = (item.type === p.model?.value)
          const image = selected ? item.selectedImage : item.image
          return (
            <Pressable
              key={item.type}
              style={styles.item}
              onPress={() => {
                Transaction.run(() => {
                  if (p.model.value !== item.type) {
                    p.model.value = item.type
                  }
                })
              }}
            >
              <Image source={image} mainAxisSize={70} fadeDuration={0} />
              <Text style={styles.vsText}>vs</Text>
            </Pressable>
          )
        })}
      </View>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 5,
  },
  item: {
    marginRight: 15,
    alignItems: 'center',
  },
  vsText: {
    fontSize: 12,
  },
})
