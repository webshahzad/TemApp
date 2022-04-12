//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { useScrollToTop } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { ActivityStackPropsPerPath } from 'navigation/params'
import { FlatList, Pressable, Text, StyleSheet, ColorValue, Image, ImageStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { App } from 'models/app/App'
import { ActivityData } from 'models/data/Activity'
import { MainBlueColor } from 'components/Theme'
import { HeaderButton, HeaderRight } from 'components/HeaderRight'

import ActivityIcon from 'assets/icons/Tabs/activity/act.png'

export function ChooseActivity(p: StackScreenProps<ActivityStackPropsPerPath, 'ChooseActivity'>): JSX.Element {
  const listViewRef: React.Ref<FlatList> = React.useRef(null)
  // Scroll to top on bottom tab press
  useScrollToTop(listViewRef)

  React.useLayoutEffect(() => p.navigation.setOptions({
    headerRight: props => (
      <HeaderRight
        tintColor={props.tintColor}
        buttons={[
          HeaderButton.newPost,
          HeaderButton.globalSearch,
        ]}
      />
    ),
  }), [])

  const manager = App.activityManager

  React.useEffect(() => {
    if (manager.needToLoadActivityList)
      void manager.loadActivityList()
  }, [])

  async function startActivity(activity: ActivityData): Promise<void> {
    await manager.startActivity(activity)
    p.navigation.replace('TrackActivity')
  }

  return reactive(cycle => {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          ref={listViewRef}
          style={{ width: '100%' }}
          contentContainerStyle={styles.activities}
          data={manager.activityList}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={styles.activity}
              key={item.id}
              onPress={() => startActivity(item)}
            >
              <Image
                source={{ uri: item.image }}
                defaultSource={ActivityIcon}
                tintColor={MainBlueColor}
                style={styles.activityImage}
                fadeDuration={0}
              />
              <Text>{item.name}</Text>
            </Pressable>
          )}
        />
      </SafeAreaView >
    )
  })
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activities: {
    width: '100%',
    paddingHorizontal: 10,
  },
  activity: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 5,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: MainBlueColor,
    alignItems: 'center',
  },
  activityImage: {
    marginRight: 10,
    width: 40,
    height: 30,
    resizeMode: 'contain',
  } as ImageStyle,
})
