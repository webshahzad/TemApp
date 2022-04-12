//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { Text, View, StyleSheet, Dimensions } from 'react-native'

import { reactive } from 'common/reactive'
import { App } from 'models/app/App'

import { GoalsAndChallengesList } from './GoalsAndChallengesList'

export const GoalsAndChallengesSideMenu = (): React.ReactElement => {

  return reactive(() => {
    const list = App.goalsAndChallenges.sideMenuList
    const noItemsText = App.goalsAndChallenges.sideMenuNoItemsText
    const title = App.goalsAndChallenges.sideMenuTitle
    const listss = "show"
    return (
      <View style={styles.container}>
        {title &&
          (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
          )}
        <View style={styles.listContainer}>
          {(list && list.items.length)
            ? (
              <GoalsAndChallengesList  scrollToTop short list={list} listss="show" />
            )
            : (
              <Text style={styles.noItemsText}>{noItemsText}</Text>
            )}
        </View>
      </View>
    )
  })
}
const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
  width: "100%",
    height: '100%',
    backgroundColor: 'white',
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
    width: '100%',
    // borderBottomColor: 'lightgray',
    // borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  listContainer: {
    flex: 1,
    justifyContent: 'center',
    
  },
  noItemsText: {
    paddingHorizontal: 10,
    textAlign: 'center',
    color: 'lightgray',
    fontSize: 22,
    
  },
})
