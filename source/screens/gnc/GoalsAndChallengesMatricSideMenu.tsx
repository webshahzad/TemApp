//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'

import { reactive } from 'common/reactive'
import { App } from 'models/app/App'


export const GoalsAndChallengesMatricSideMenu = (): React.ReactElement => {
 
  return reactive(() => {
   
    return (
      <TouchableOpacity style={styles.container} >
         <Text>Goals and challenges matric headr</Text>        
      </TouchableOpacity>
    )
  })
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  listContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  noItemsText: {
    paddingHorizontal: 10,
    textAlign: 'center',
    color: 'lightgray',
    fontSize: 22,
  },
})
