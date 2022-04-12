//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { reactive } from 'common/reactive'
import { RoundButton } from 'components/RoundButton'
import { App } from 'models/app/App'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScreenStateMessage } from './LinkDevices'

export function LinkApps(): React.ReactElement {
  return (
    <View style={styles.screen}>
      <LinkAppsContent />
    </View>
  )
}

function LinkAppsContent(): React.ReactElement | null {
  return reactive(() => {
    const googleFit = App.googleFit
    return (
      <View>
        {!googleFit.authorized || !googleFit.enabled ? (
          <RoundButton
            label='Enable sync to Google Fit'
            onPress={googleFit.enable}
            background='#0096E5'
            color='white'
            style={styles.button}
          />
        ) : (
          <RoundButton
            label='Disconnect from Google Fit'
            onPress={googleFit.disable}
            background='#0096E5'
            color='white'
            style={styles.button}
          />
        )}
      </View>
    )
  })
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 10,
  },

  button: {
    flex: 1,
    marginBottom: 10,
  },
})
