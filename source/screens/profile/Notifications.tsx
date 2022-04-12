//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { View, StyleSheet, Text } from 'react-native'
import { Ref } from 'reactronic'
import { Checkbox } from 'components/Checkbox'
import { App } from 'models/app/App'
import { GrayColor } from 'components/Theme'

export const Notifications = (): JSX.Element => {
  const user = Ref.to(App.user.edited)
  return reactive(() => {
    return(
      <View style={styles.container}>
        <View
          style={styles.option}
        >
          <Text style={styles.text}>Push Notifications</Text>
          <Checkbox
            model={user.push_notification}
            onValueChanged={() => App.user.savePushNotifications()}
          />
        </View>
        <View
          style={styles.option}
        >
          <Text style={styles.text}>Calendar Notifications</Text>
          <Checkbox
            model={user.calender_notification}
            onValueChanged={() => App.user.saveCalendarNotifications()}
          />
        </View>
      </View>
    )
  })
}

const styles = StyleSheet.create({
  container: {
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: GrayColor,
  },
  text: {
    flex: 1,
  },
})
