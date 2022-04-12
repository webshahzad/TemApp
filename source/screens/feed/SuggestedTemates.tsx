//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from 'react'
import { reactive } from 'common/reactive'
import { View, Text, StyleSheet, Image, Pressable, FlatList, Dimensions } from 'react-native'

import { App } from 'models/app/App'
import { doAsync } from 'common/doAsync'
import { Monitors } from 'models/app/Monitors'
import { MainBlueColor } from 'components/Theme'
import { UserInfo } from 'models/data/UserInfo'

export const SuggestedTemates = (): JSX.Element => {
  const listViewRef: React.Ref<FlatList> = React.useRef(null)
  const screenWidth = Dimensions.get('screen').width
  const itemWidth = screenWidth / 3
  const manager = App.userSearchManager
  return reactive(() => {
    const requestsSent: number = manager.sentRequests.items.length
    return (
      <View style={styles.container}>
        <FlatList<UserInfo>
          ref={listViewRef}
          data={manager.suggestions.items}
          horizontal
          keyExtractor={(item, index) => {
            return item._id + '-' + index.toString()
          }}
          renderItem={({ item }) => (<SuggestionCard item={item} width={itemWidth} />)}
          extraData={requestsSent}
          onEndReached={() => doAsync(async () => {
            if (manager.suggestions.hasMoreItems()) {
              await manager.suggestions.loadMoreItems()
              listViewRef.current?.flashScrollIndicators()
            }
          })}
          refreshing={Monitors.Refreshing.isActive}
          onEndReachedThreshold={0.5}
          onRefresh={() => doAsync(async () => manager.suggestions.loadItems())}
        />
      </View>
    )
  })
}

function SuggestionCard({ item, width }: { item: UserInfo, width: number }): JSX.Element {
  const manager = App.userSearchManager
  return reactive(() => {
    const requestSent = manager.sentRequests.items.find(request => request._id === item._id) !== undefined
    return (
      <View style={[styles.suggestion, { width }]}>
        <Image source={item.getAvatar()} style={styles.avatar} />
        <Text numberOfLines={1} style={styles.name}>{item.getFullName()}</Text>
        <Text numberOfLines={1} style={styles.location}>{item.getLocation()}</Text>
        {requestSent
          ? (
            <Pressable
              style={[styles.submit, styles.undo]}
              onPress={() => doAsync(() => manager.deleteRequest(item))}
            >
              <Text style={[styles.submitText, styles.undo]}>Undo</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.submit}
              onPress={() => doAsync(() => manager.sendRequest(item))}
            >
              <Text style={styles.submitText}>Send Request</Text>
            </Pressable>
          )
        }
      </View>
    )
  })
}

const UserAvatarSize = 50

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  suggestion: {
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 5,
    paddingHorizontal: 5,
    position: 'relative',
  },
  avatar: {
    width: UserAvatarSize,
    height: UserAvatarSize,
    borderRadius: UserAvatarSize / 2,
    marginTop: 10,
    marginBottom: 5,
  },
  name: {
    fontWeight: 'bold',
  },
  location: {
    color: 'gray',
  },
  submit: {
    alignItems: 'center',
    borderColor: MainBlueColor,
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 5,
    padding: 5,
    width: '85%',
  },
  submitText: {
    color: MainBlueColor,
  },
  undo: {
    color: 'gray',
    borderColor: 'gray',
  },
})
