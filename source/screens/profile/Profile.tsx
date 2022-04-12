//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { View, StyleSheet } from 'react-native'
import { Transaction } from 'reactronic'

import { AccordionManager } from 'models/app/AccordionManager'
import { Accordion } from 'components/Accordion'
import { ProfileInformation } from './ProfileInformation'
import { AccountabilityMission } from './AccountabilityMission'
import { Posts } from './PostList'
import { App } from 'models/app/App'

export const Profile = (): React.ReactElement => {

  const [manager] = React.useState(() =>Transaction.run(() => new AccordionManager([{
    name: 'Profile Information',
    content: (
      <ProfileInformation />
    ),
  }, {
    name: 'Accountability Mission',
    content: (
      <AccountabilityMission />
    ),
  }, {
    name: 'Posts',
    content: (
      <Posts posts={App.user.posts}/>
    ),
  }])))
  return reactive(() => {
    return(
      <View style={styles.container}>
        <Accordion manager={manager} />
      </View>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
})
