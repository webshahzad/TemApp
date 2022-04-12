//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export function EmptyDialogs(): React.ReactElement {
  return (
    <View style={styles.emptyDialogs}>
      <Text style={styles.emptyDialogsMessageLine}>
        You have not sent any messages yet
      </Text>
      <Text style={styles.emptyDialogsMessageLine}>
        All the messages you exchange with your contacts and groups are shown on this screen
      </Text>
      <Text style={styles.emptyDialogsMessageLine}>
        Select a contact and send your first message
      </Text>
      <Text style={styles.emptyDialogsMessageLine}>
        Happy Messaging :)
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  emptyDialogs: {
    marginHorizontal: 20,
    marginVertical: 40,
    alignItems: 'center',
  },
  emptyDialogsMessageLine: {
    textAlign: 'center',
    marginBottom: 10,
  },
})
