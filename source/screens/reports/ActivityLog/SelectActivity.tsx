//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { StyleSheet, View, Text,ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { reactive } from 'common/reactive'
import { ScrollView } from 'react-native-gesture-handler'

export function SelectActivity(): React.ReactElement {
  return reactive(() => {

    return (
      <SafeAreaView>
          <ScrollView>
               <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
               <Text>
                    Activity Screen
                </Text>
               </View>
          </ScrollView>
      </SafeAreaView>
    )
  })
}
const styles = StyleSheet.create({
 
})
